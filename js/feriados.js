const URL_DATOS_INICIALES = "./datos/feriados-iniciales.json";
const URL_API_FERIADOS = "https://api.argentinadatos.com/v1/feriados";
const PREFIJO_ALMACENAMIENTO = "sueldobodega-feriados-";
const VIGENCIA_CACHE_MS = 12 * 60 * 60 * 1000;
const INTERVALO_REINTENTO_MS = 60 * 1000;

let datosInicialesPromise;
const actualizacionesPorAnio = new Map();
const intentosPorAnio = new Map();
const fallosPorAnio = new Set();
const suscriptoresPorAnio = new Map();

export function obtenerAnioLocal(fecha = new Date()) {
  return fecha.getFullYear();
}

export function obtenerFechaLocal(fecha = new Date()) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

export function crearFechaLocal(fechaIso) {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaIso);

  if (!coincidencia) {
    return null;
  }

  const [, anio, mes, dia] = coincidencia;
  const fecha = new Date(Number(anio), Number(mes) - 1, Number(dia));

  if (
    fecha.getFullYear() !== Number(anio) ||
    fecha.getMonth() !== Number(mes) - 1 ||
    fecha.getDate() !== Number(dia)
  ) {
    return null;
  }

  return fecha;
}

export function diferenciaEnDias(fechaIso, referencia = new Date()) {
  const fecha = crearFechaLocal(fechaIso);

  if (!fecha) {
    return null;
  }

  const fechaUtc = Date.UTC(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  );
  const referenciaUtc = Date.UTC(
    referencia.getFullYear(),
    referencia.getMonth(),
    referencia.getDate(),
  );

  return Math.round((fechaUtc - referenciaUtc) / 86400000);
}

function validarListaFeriados(lista, anio) {
  if (!Array.isArray(lista) || lista.length === 0) {
    throw new Error("La fuente no devolvió feriados para el año solicitado.");
  }

  const feriados = lista.map((feriado) => {
    if (
      !feriado ||
      typeof feriado.nombre !== "string" ||
      !feriado.nombre.trim() ||
      typeof feriado.tipo !== "string" ||
      !feriado.tipo.trim() ||
      typeof feriado.fecha !== "string" ||
      !crearFechaLocal(feriado.fecha) ||
      !feriado.fecha.startsWith(`${anio}-`)
    ) {
      throw new Error("La fuente devolvió un registro de feriado inválido.");
    }

    return {
      fecha: feriado.fecha,
      tipo: feriado.tipo.trim(),
      nombre: feriado.nombre.trim(),
    };
  });

  return feriados.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function obtenerDatosIniciales() {
  if (!datosInicialesPromise) {
    datosInicialesPromise = fetch(URL_DATOS_INICIALES)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(
            `No se pudo cargar el archivo inicial de feriados (${respuesta.status}).`,
          );
        }

        return respuesta.json();
      })
      .then((datos) => {
        if (!datos || !datos.anios || typeof datos.anios !== "object") {
          throw new Error(
            "El archivo inicial de feriados tiene un formato inválido.",
          );
        }

        return datos;
      })
      .catch((error) => {
        datosInicialesPromise = null;
        throw error;
      });
  }

  return datosInicialesPromise;
}

function leerDatosGuardados(anio) {
  try {
    const guardado = localStorage.getItem(`${PREFIJO_ALMACENAMIENTO}${anio}`);

    if (!guardado) {
      return null;
    }

    const datos = JSON.parse(guardado);
    const feriados = validarListaFeriados(datos.feriados, anio);

    if (
      typeof datos.consultadoEn !== "string" ||
      !Number.isFinite(Date.parse(datos.consultadoEn))
    ) {
      return null;
    }

    return {
      feriados,
      origen: "guardado",
      consultadoEn: datos.consultadoEn,
    };
  } catch (error) {
    console.warn(
      `No se pudieron leer los feriados guardados de ${anio}.`,
      error,
    );
    return null;
  }
}

function notificarActualizacion(anio, datos) {
  const suscriptores = suscriptoresPorAnio.get(anio);
  suscriptores?.forEach((suscriptor) => suscriptor(datos));
}

function suscribirseAActualizaciones(anio, suscriptor) {
  if (!suscriptoresPorAnio.has(anio)) {
    suscriptoresPorAnio.set(anio, new Set());
  }

  const suscriptores = suscriptoresPorAnio.get(anio);
  suscriptores.add(suscriptor);
  return () => suscriptores.delete(suscriptor);
}

async function consultarApi(anio) {
  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), 8000);

  try {
    const respuesta = await fetch(`${URL_API_FERIADOS}/${anio}`, {
      signal: controlador.signal,
      cache: "no-store",
    });

    if (!respuesta.ok) {
      throw new Error(`ArgentinaDatos respondió con HTTP ${respuesta.status}.`);
    }

    const json = await respuesta.json();
    const feriados = validarListaFeriados(json, anio);
    const datos = {
      feriados,
      origen: "api",
      consultadoEn: new Date().toISOString(),
    };

    try {
      localStorage.setItem(
        `${PREFIJO_ALMACENAMIENTO}${anio}`,
        JSON.stringify(datos),
      );
    } catch (error) {
      console.warn(
        "No se pudieron guardar los feriados para uso offline.",
        error,
      );
    }

    return datos;
  } finally {
    clearTimeout(timeout);
  }
}

function actualizarDesdeApi(anio, datosActuales) {
  if (actualizacionesPorAnio.has(anio)) {
    return actualizacionesPorAnio.get(anio);
  }

  const ultimoIntento = intentosPorAnio.get(anio) || 0;

  if (Date.now() - ultimoIntento < INTERVALO_REINTENTO_MS) {
    if (fallosPorAnio.has(anio)) {
      notificarActualizacion(anio, {
        ...datosActuales,
        verificacion: "fallida",
        mensaje:
          "No se pudo verificar la actualización reciente. Se conservan los datos disponibles; la API no confirma si la lista anual está completa.",
      });
    }

    return Promise.resolve(datosActuales);
  }

  intentosPorAnio.set(anio, Date.now());
  const solicitud = consultarApi(anio)
    .then((datosActualizados) => {
      fallosPorAnio.delete(anio);
      notificarActualizacion(anio, {
        ...datosActualizados,
        verificacion: "actualizado",
        mensaje:
          "Datos actualizados desde ArgentinaDatos. La API no confirma si la lista anual está completa.",
      });
      return datosActualizados;
    })
    .catch((error) => {
      fallosPorAnio.add(anio);
      console.warn(`No se pudieron actualizar los feriados de ${anio}.`, error);
      notificarActualizacion(anio, {
        ...datosActuales,
        verificacion: "fallida",
        mensaje:
          "No se pudo verificar la actualización. Se conservan los datos disponibles; la API no confirma si la lista anual está completa.",
      });
      return datosActuales;
    })
    .finally(() => {
      actualizacionesPorAnio.delete(anio);
    });

  actualizacionesPorAnio.set(anio, solicitud);
  return solicitud;
}

export async function obtenerFeriados(anio, alActualizar) {
  const desuscribir = alActualizar
    ? suscribirseAActualizaciones(anio, alActualizar)
    : () => {};
  const guardados = leerDatosGuardados(anio);
  let locales = guardados;
  let errorInicial = null;

  if (!locales) {
    try {
      const datosIniciales = await obtenerDatosIniciales();
      const feriados = validarListaFeriados(
        datosIniciales.anios[String(anio)] || [],
        anio,
      );

      locales = {
        feriados,
        origen: "inicial",
        consultadoEn: datosIniciales.obtenido || null,
      };
    } catch (error) {
      errorInicial = error;
    }
  }

  const datosActuales = locales
    ? {
        ...locales,
        verificacion: "pendiente",
        mensaje:
          locales.origen === "inicial"
            ? `Copia local obtenida de ArgentinaDatos el ${locales.consultadoEn}. La API no confirma si la lista anual está completa.`
            : `Copia guardada de ArgentinaDatos (${new Date(locales.consultadoEn).toLocaleString("es-AR")}). La API no confirma si la lista anual está completa.`,
      }
    : {
        feriados: [],
        origen: "ninguno",
        consultadoEn: null,
        verificacion: "fallida",
        mensaje: errorInicial
          ? `No hay datos locales utilizables para ${anio} y no se pudieron cargar.`
          : `No hay datos locales disponibles para ${anio}.`,
      };

  const datosGuardadosVigentes =
    guardados &&
    Date.now() - Date.parse(guardados.consultadoEn) < VIGENCIA_CACHE_MS;

  if (!datosGuardadosVigentes) {
    void actualizarDesdeApi(anio, datosActuales);
  }

  return {
    ...datosActuales,
    desuscribir,
  };
}
