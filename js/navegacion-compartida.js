import {
  diferenciaEnDias,
  obtenerAnioLocal,
  obtenerFechaLocal,
  obtenerFeriados,
} from "./feriados.js";

const barraInferior = () => `
  <nav class="nav-inferior">
    <button type="button" id="toggleModo" class="toggleModo-calculadora">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        class="icono-calc-nav-inf"
        fill="#ffffff"
      >
        <path
          d="M 14.984375 0.98632812 A 1.0001 1.0001 0 0 0 14 2 L 14 5 A 1.0001 1.0001 0 1 0 16 5 L 16 2 A 1.0001 1.0001 0 0 0 14.984375 0.98632812 z M 5.796875 4.7988281 A 1.0001 1.0001 0 0 0 5.1015625 6.515625 L 7.2226562 8.6367188 A 1.0001 1.0001 0 1 0 8.6367188 7.2226562 L 6.515625 5.1015625 A 1.0001 1.0001 0 0 0 5.796875 4.7988281 z M 24.171875 4.7988281 A 1.0001 1.0001 0 0 0 23.484375 5.1015625 L 21.363281 7.2226562 A 1.0001 1.0001 0 1 0 22.777344 8.6367188 L 24.898438 6.515625 A 1.0001 1.0001 0 0 0 24.171875 4.7988281 z M 15 8 C 11.134 8 8 11.134 8 15 C 8 18.866 11.134 22 15 22 C 18.866 22 22 18.866 22 15 C 22 11.134 18.866 8 15 8 z M 2 14 A 1.0001 1.0001 0 1 0 2 16 L 5 16 A 1.0001 1.0001 0 1 0 5 14 L 2 14 z M 25 14 A 1.0001 1.0001 0 1 0 25 16 L 28 16 A 1.0001 1.0001 0 1 0 28 14 L 25 14 z M 7.9101562 21.060547 A 1.0001 1.0001 0 0 0 7.2226562 21.363281 L 5.1015625 23.484375 A 1.0001 1.0001 0 1 0 6.515625 24.898438 L 8.6367188 22.7773438 A 1.0001 1.0001 0 0 0 7.9101562 21.060547 z M 22.0605469 21.060547 A 1.0001 1.0001 0 0 0 21.363281 22.7773438 L 23.484375 24.8984375 A 1.0001 1.0001 0 1 0 24.8984375 23.484375 L 22.7773438 21.363281 A 1.0001 1.0001 0 0 0 22.0605469 21.060547 z M 14.984375 23.986328 A 1.0001 1.0001 0 0 0 14 25 L 14 28 A 1.0001 1.0001 0 1 0 16 28 L 16 25 A 1.0001 1.0001 0 0 0 14.984375 23.986328 z"
        ></path>
      </svg>
      <span class="modo-texto">Noche/dia</span>
    </button>

    <button
      type="button"
      class="a-nav-inferior btnCalculadoras"
      id="btnCalculadoras"
    >
      <svg
        class="icono-calc-nav-inf"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="4" y="2" width="16" height="20" rx="2"></rect>
        <line x1="8" y1="6" x2="16" y2="6"></line>
        <line x1="8" y1="11" x2="8" y2="11"></line>
        <line x1="12" y1="11" x2="12" y2="11"></line>
        <line x1="16" y1="11" x2="16" y2="11"></line>
        <line x1="8" y1="15" x2="8" y2="15"></line>
        <line x1="12" y1="15" x2="12" y2="15"></line>
        <line x1="16" y1="14" x2="16" y2="14"></line>
        <line x1="16" y1="17" x2="16" y2="17"></line>
      </svg>
      <span class="modo-texto">Calculadoras</span>
    </button>

    <button
      type="button"
      class="a-nav-inferior"
      id="btnAbrirFeriados"
      aria-haspopup="dialog"
      aria-controls="modalFeriados"
    >
      <svg
        class="icono-calc-nav-inf"
        fill="currentColor"
        viewBox="0 0 485.213 485.212"
        width="48px"
        height="48px"
      >
        <g>
          <path
            d="M60.652,75.816V15.163C60.652,6.781,67.433,0,75.817,0c8.38,0,15.161,6.781,15.161,15.163v60.653
            c0,8.38-6.781,15.161-15.161,15.161C67.433,90.978,60.652,84.196,60.652,75.816z M318.424,90.978
            c8.378,0,15.163-6.781,15.163-15.161V15.163C333.587,6.781,326.802,0,318.424,0c-8.382,0-15.168,6.781-15.168,15.163v60.653
            C303.256,84.196,310.042,90.978,318.424,90.978z M485.212,363.906c0,66.996-54.312,121.307-121.303,121.307
            c-66.986,0-121.302-54.311-121.302-121.307c0-66.986,54.315-121.3,121.302-121.3C430.9,242.606,485.212,296.919,485.212,363.906z
            M454.89,363.906c0-50.161-40.81-90.976-90.98-90.976c-50.166,0-90.976,40.814-90.976,90.976c0,50.171,40.81,90.98,90.976,90.98
            C414.08,454.886,454.89,414.077,454.89,363.906z M121.305,181.955H60.652v60.651h60.653V181.955z M60.652,333.584h60.653V272.93
            H60.652V333.584z M151.629,242.606h60.654v-60.651h-60.654V242.606z M151.629,333.584h60.654V272.93h-60.654V333.584z
            M30.328,360.891V151.628h333.582v60.653h30.327V94c0-18.421-14.692-33.349-32.843-33.349h-12.647v15.166
            c0,16.701-13.596,30.325-30.322,30.325c-16.731,0-30.326-13.624-30.326-30.325V60.651H106.14v15.166
            c0,16.701-13.593,30.325-30.322,30.325c-16.733,0-30.327-13.624-30.327-30.325V60.651H32.859C14.707,60.651,0.001,75.579,0.001,94
            v266.892c0,18.36,14.706,33.346,32.858,33.346h179.424v-30.331H32.859C31.485,363.906,30.328,362.487,30.328,360.891z
            M303.256,242.606v-60.651h-60.648v60.651H303.256z M409.399,363.906h-45.49v-45.49c0-8.377-6.781-15.158-15.163-15.158
            s-15.159,6.781-15.159,15.158v60.658c0,8.378,6.777,15.163,15.159,15.163h60.653c8.382,0,15.163-6.785,15.163-15.163
            C424.562,370.692,417.781,363.906,409.399,363.906z"
          />
        </g>
      </svg>
      <span class="modo-texto">Feriados</span>
    </button>

    <div class="div-sugerencias" id="divSugerencias">
      <div class="div-sugerencias-titulo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icono-calc-nav-inf"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"
          />
          <path d="M8 9h8" />
          <path d="M8 13h6" />
        </svg>
        <span class="modo-texto">Sugerencias</span>
      </div>

      <form
        class="formularioSugerencias"
        id="formularioSugerencias"
        action="https://formspree.io/f/mkoagbwv"
        method="POST"
      >
        <small>¿Tenés alguna sugerencia?</small>
        <hr />
        <label for="sugerencias">
          <textarea
            id="sugerencias"
            placeholder="Escribí tu sugerencia aquí..."
            maxlength="500"
            name="sugerencia"
            required
          ></textarea>
        </label>
        <button class="btnEnviar" id="enviarSugerencia">Enviar</button>
      </form>
    </div>
  </nav>
`;

const modalFeriados = `
  <div
    class="modal-feriados"
    id="modalFeriados"
    role="dialog"
    aria-modal="true"
    aria-labelledby="tituloModalFeriados"
    aria-hidden="true"
  >
    <section class="contenido-modal-feriados">
      <header class="encabezado-modal-feriados">
        <div>
          <h2 id="tituloModalFeriados">Calendario de feriados</h2>
          <div class="selector-anio-feriados">
            <button type="button" id="anioFeriadosAnterior" aria-label="Año anterior">‹</button>
            <strong id="anioFeriados"></strong>
            <button type="button" id="anioFeriadosSiguiente" aria-label="Año siguiente">›</button>
          </div>
        </div>
        <button
          type="button"
          class="btnCerrarModal btn-cerrar-feriados"
          id="btnCerrarFeriados"
          aria-label="Cerrar calendario de feriados"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 84 84"
            class="icono-cerrar"
            aria-hidden="true"
          >
            <path
              d="M42,0C18.803,0,0,18.807,0,42c0,23.197,18.803,42,42,42c23.193,0,42-18.803,42-42C84,18.807,65.193,0,42,0z M50.643,42l15.303,15.302l-8.643,8.642L42.002,50.643L26.699,65.944l-8.641-8.642L33.359,42l-15.3-15.298l8.641-8.646L42,33.357l15.301-15.299l8.643,8.641L50.643,42z"
            />
          </svg>
        </button>
      </header>
      <div class="leyenda-feriados" aria-label="Estados de feriados">
        <span><i class="leyenda-pasado"></i> Ya pasó</span>
        <span><i class="leyenda-futuro"></i> Próximo</span>
        <span><i class="leyenda-seleccionado"></i> Seleccionado</span>
      </div>
      <div class="vistas-feriados">
        <section
          class="panel-vista-feriados"
          id="panelVistaCalendario"
          role="tabpanel"
          aria-labelledby="btnVistaCalendario"
        >
          <div class="contenido-calendario-feriados">
            <div class="calendario-anual-feriados" id="calendarioAnualFeriados"></div>
            <aside class="detalle-feriado" id="detalleFeriado" aria-live="polite">
              <button
                type="button"
                class="btn-volver-calendario"
                id="btnVolverCalendario"
                aria-label="Volver al calendario"
              >
                ×
              </button>
              <div id="contenidoDetalleFeriado">
                <p>Seleccioná una fecha marcada para ver el detalle.</p>
              </div>
            </aside>
          </div>
        </section>
        <section
          class="panel-vista-feriados"
          id="panelVistaLista"
          role="tabpanel"
          aria-labelledby="btnVistaLista"
          hidden
        >
          <div class="lista-feriados-modal" id="listaFeriadosModal"></div>
        </section>
      </div>
      <nav class="navegacion-vistas-feriados" role="tablist" aria-label="Vistas de feriados">
        <button
          type="button"
          class="boton-vista-feriados activo"
          id="btnVistaCalendario"
          role="tab"
          aria-controls="panelVistaCalendario"
          aria-selected="true"
          tabindex="0"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="17" rx="2"></rect>
            <path d="M16 2v4M8 2v4M3 10h18"></path>
          </svg>
          <span>Calendario</span>
        </button>
        <button
          type="button"
          class="boton-vista-feriados"
          id="btnVistaLista"
          role="tab"
          aria-controls="panelVistaLista"
          aria-selected="false"
          tabindex="-1"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6h13M8 12h13M8 18h13"></path>
            <path d="M3 6h.01M3 12h.01M3 18h.01"></path>
          </svg>
          <span>Lista de feriados</span>
        </button>
      </nav>
    </section>
  </div>
`;

const modalCalculadoras = `
  <div class="modalPrincipal" id="modalPrincipal">
    <div class="modal-contenido">
      <div class="modal-header">
        <h2 class="h2-modal">Elegí una calculadora</h2>
        <button class="btnCerrarModal" id="btnCerrarModal">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 84 84"
            width="32"
            height="32"
            class="icono-cerrar"
          >
            <path
              style="fill: currentColor"
              d="M42,0C18.803,0,0,18.807,0,42c0,23.197,18.803,42,42,42c23.193,0,42-18.803,42-42
              C84,18.807,65.193,0,42,0z M50.643,42l15.303,15.302l-8.643,8.642L42.002,50.643L26.699,65.944l-8.641-8.642L33.359,42
              l-15.3-15.298l8.641-8.646L42,33.357l15.301-15.299l8.643,8.641L50.643,42z"
            />
          </svg>
        </button>
      </div>

      <div class="grid-cards">
        <div class="card-bodega">
          <img
            class="img-bodega-card"
            src="assets/imagenes/trabajadores-bodega-card-cropped.webp"
          />
          <div class="overlay-contenido-bodega">
            <h3>Bodega</h3>
            <p>
              Calculá tu sueldo neto según la escala de<br />
              <strong class="strong-card">Bodega C.C.T. 85/89</strong>
            </p>
            <div class="botones-card-bodega">
              <a class="irAcalcular" href="calculadora.html"
                >Salario <i class="fa-solid fa-circle-right"></i
              ></a>
              <a class="irAindemnizacion" href="indemnizacion.html"
                >Indemnización
              </a>
            </div>
          </div>
        </div>

        <div class="card-viña">
          <img
            class="img-viña-card"
            src="assets/imagenes/trabajadores-viña-card-cropped.webp"
          />
          <div class="overlay-contenido-viña">
            <h3>Viña</h3>
            <p>
              Calculá tu sueldo neto según la escala de<br />
              <strong class="strong-card">Viña C.C.T. 154/91</strong>
            </p>
            <div class="botones-card-viña">
              <a class="irAcalcular" href="calculadora-viña.html"
                >Salario <i class="fa-solid fa-circle-right"></i
              ></a>
              <a class="irAindemnizacion" href="indemnizacion-viña.html"
                >Indemnización
              </a>
            </div>
          </div>
        </div>

        <div class="card-bodega">
          <img
            class="img-bodega-card"
            src="assets/imagenes/trabajadores-cocechando-card-cropped.webp"
            alt="Trabajador cosechando"
          />
          <div class="overlay-contenido-bodega">
            <h3>Contratista</h3>
            <p>
              Calculá tu sueldo neto según la escala de<br />
              <strong class="strong-card">Contratistas Ley 23.154</strong>
            </p>
            <div class="botones-card-bodega">
              <a class="irAcalcular" href="calculadora-contrato.html">
                Salario <i class="fa-solid fa-circle-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

function manejarClicNavegacion(evento) {
  if (!(evento.target instanceof Element)) {
    return;
  }

  const botonModo = evento.target.closest("#toggleModo");
  const botonAbrir = evento.target.closest("#btnCalculadoras");
  const botonCerrar = evento.target.closest("#btnCerrarModal");
  const botonAbrirFeriados = evento.target.closest(
    "#btnAbrirFeriados, #btnAbrirFeriadosInicio",
  );
  const botonCerrarFeriados = evento.target.closest("#btnCerrarFeriados");
  const botonVolverCalendario = evento.target.closest("#btnVolverCalendario");
  const botonAnioAnterior = evento.target.closest("#anioFeriadosAnterior");
  const botonAnioSiguiente = evento.target.closest("#anioFeriadosSiguiente");
  const botonDiaFeriado = evento.target.closest("[data-fecha-feriado]");
  const botonVistaFeriados = evento.target.closest(
    "#btnVistaCalendario, #btnVistaLista",
  );
  const modalCalculadorasElemento = document.getElementById("modalPrincipal");
  const modalFeriadosElemento = document.getElementById("modalFeriados");

  if (botonModo) {
    document.body.classList.toggle("modo-claro");
    const iconoModo = botonModo.querySelector(".icono-calc-nav-inf");

    if (document.body.classList.contains("modo-claro")) {
      iconoModo.classList.remove("fa-sun");
      iconoModo.classList.add("fa-moon");
    } else {
      iconoModo.classList.remove("fa-moon");
      iconoModo.classList.add("fa-sun");
    }
  } else if (botonAbrir) {
    modalFeriadosElemento.classList.remove("activo");
    modalFeriadosElemento.setAttribute("aria-hidden", "true");
    modalCalculadorasElemento.classList.add("activo");
  } else if (botonCerrar) {
    modalCalculadorasElemento.classList.remove("activo");
  } else if (botonAbrirFeriados) {
    modalCalculadorasElemento.classList.remove("activo");
    modalFeriadosElemento.classList.add("activo");
    modalFeriadosElemento.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-feriados-abierto");
    botonAbrirFeriados.setAttribute("aria-expanded", "true");
    establecerVistaFeriados("calendario");
    abrirCalendarioFeriados(obtenerAnioLocal());
  } else if (botonCerrarFeriados) {
    cerrarCalendarioFeriados();
  } else if (botonVistaFeriados) {
    const mostrarLista = botonVistaFeriados.id === "btnVistaLista";

    if (mostrarLista && modalFeriadosElemento.classList.contains("detalle-abierto")) {
      establecerVistaDetalle(false);
    }

    establecerVistaFeriados(mostrarLista ? "lista" : "calendario");
  } else if (botonVolverCalendario) {
    cerrarDetalleFeriado();
  } else if (botonAnioAnterior || botonAnioSiguiente) {
    const anioActual = Number(
      document.getElementById("anioFeriados").textContent,
    );
    abrirCalendarioFeriados(anioActual + (botonAnioAnterior ? -1 : 1));
  } else if (botonDiaFeriado) {
    seleccionarFechaFeriado(botonDiaFeriado.dataset.fechaFeriado);
  } else if (evento.target === modalFeriadosElemento) {
    cerrarCalendarioFeriados();
  }
}

let anioCalendarioActual;
let feriadosCalendarioActual = [];
let fechaFeriadoSeleccionada = null;
let desuscribirActualizaciones = () => {};

function mostrarFechaCompleta(fechaIso) {
  const [anio, mes, dia] = fechaIso.split("-").map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function crearCeldaDia(anio, mes, dia, feriadosPorFecha) {
  if (!dia) {
    const espacio = document.createElement("span");
    espacio.className = "dia-vacio-feriados";
    return espacio;
  }

  const fecha = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  const feriados = feriadosPorFecha.get(fecha);

  if (!feriados) {
    const diaNormal = document.createElement("span");
    diaNormal.className = "dia-normal-feriados";
    diaNormal.textContent = String(dia);
    return diaNormal;
  }

  const boton = document.createElement("button");
  const diferencia = diferenciaEnDias(fecha);
  boton.type = "button";
  boton.className = `dia-feriado ${diferencia < 0 ? "feriado-pasado" : "feriado-futuro"}`;
  boton.dataset.fechaFeriado = fecha;
  boton.setAttribute(
    "aria-label",
    `${fecha}: ${feriados.map((feriado) => feriado.nombre).join(", ")}`,
  );
  boton.setAttribute(
    "aria-pressed",
    String(fecha === fechaFeriadoSeleccionada),
  );
  boton.title = feriados.map((feriado) => feriado.nombre).join("; ");
  boton.textContent = String(dia);

  if (fecha === fechaFeriadoSeleccionada) {
    boton.classList.add("feriado-seleccionado");
  }

  if (feriados.length > 1) {
    boton.dataset.cantidad = String(feriados.length);
  }

  return boton;
}

function renderizarCalendarioAnual() {
  const calendario = document.getElementById("calendarioAnualFeriados");
  const feriadosPorFecha = new Map();

  document.getElementById("anioFeriados").textContent = String(
    anioCalendarioActual,
  );
  calendario.replaceChildren();

  if (feriadosCalendarioActual.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "sin-datos-calendario-feriados";
    mensaje.textContent =
      "No hay datos válidos disponibles para mostrar los feriados de este año.";
    calendario.append(mensaje);
    return;
  }

  feriadosCalendarioActual.forEach((feriado) => {
    const lista = feriadosPorFecha.get(feriado.fecha) || [];
    lista.push(feriado);
    feriadosPorFecha.set(feriado.fecha, lista);
  });

  for (let mes = 0; mes < 12; mes += 1) {
    const seccionMes = document.createElement("section");
    seccionMes.className = "mes-calendario-feriados";

    const tituloMes = document.createElement("h3");
    tituloMes.textContent = new Date(
      anioCalendarioActual,
      mes,
      1,
    ).toLocaleDateString("es-AR", { month: "long" });

    const grilla = document.createElement("div");
    grilla.className = "grilla-mes-feriados";
    ["L", "M", "M", "J", "V", "S", "D"].forEach((diaSemana, indice) => {
      const encabezado = document.createElement("span");
      encabezado.className = "encabezado-dia-feriados";
      encabezado.setAttribute("aria-label", ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"][indice]);
      encabezado.textContent = diaSemana;
      grilla.append(encabezado);
    });

    const primerDiaSemana = (new Date(anioCalendarioActual, mes, 1).getDay() + 6) % 7;
    const cantidadDias = new Date(anioCalendarioActual, mes + 1, 0).getDate();

    for (let posicion = 0; posicion < primerDiaSemana; posicion += 1) {
      grilla.append(crearCeldaDia(anioCalendarioActual, mes, null, feriadosPorFecha));
    }

    for (let dia = 1; dia <= cantidadDias; dia += 1) {
      grilla.append(crearCeldaDia(anioCalendarioActual, mes, dia, feriadosPorFecha));
    }

    seccionMes.append(tituloMes, grilla);
    calendario.append(seccionMes);
  }

}

function obtenerCondicionFeriado(tipo) {
  if (tipo === "inamovible") {
    return "Fijo";
  }

  if (tipo === "trasladable") {
    return "Movible";
  }

  return "Condición no disponible";
}

function renderizarListaFeriados() {
  const lista = document.getElementById("listaFeriadosModal");
  lista.replaceChildren();

  if (feriadosCalendarioActual.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "sin-datos-calendario-feriados";
    mensaje.textContent =
      "No hay datos válidos disponibles para mostrar los feriados de este año.";
    lista.append(mensaje);
    return;
  }

  [...feriadosCalendarioActual]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .forEach((feriado) => {
      const [anio, mes, dia] = feriado.fecha.split("-").map(Number);
      const fecha = new Date(anio, mes - 1, dia);
      const diferencia = diferenciaEnDias(feriado.fecha);
      const tarjeta = document.createElement("article");
      tarjeta.className = `tarjeta-feriado tarjeta-feriado-modal ${
        diferencia < 0 ? "feriado-tarjeta-pasada" : "feriado-tarjeta-vigente"
      }`;
      tarjeta.dataset.fecha = feriado.fecha;

      const fechaBadge = document.createElement("span");
      fechaBadge.className = "fecha-badge";
      fechaBadge.textContent = `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}`;

      const diaNombre = document.createElement("p");
      diaNombre.className = "dia-nombre";
      diaNombre.textContent = fecha.toLocaleDateString("es-AR", {
        weekday: "long",
      });

      const cuentaRegresiva = document.createElement("p");
      cuentaRegresiva.className = "faltan-dias";
      cuentaRegresiva.textContent =
        diferencia === 0
          ? "Hoy"
          : diferencia < 0
            ? `Hace ${Math.abs(diferencia)} ${Math.abs(diferencia) === 1 ? "día" : "días"}`
            : `En ${diferencia} días`;

      const nombre = document.createElement("p");
      nombre.className = "feriado-nombre";
      nombre.textContent = feriado.nombre;

      const condicion = document.createElement("small");
      condicion.className = "feriado-tipo";
      condicion.textContent = obtenerCondicionFeriado(feriado.tipo);

      tarjeta.append(fechaBadge, diaNombre, cuentaRegresiva, nombre, condicion);
      lista.append(tarjeta);
    });
}

function establecerVistaFeriados(vista) {
  const mostrarLista = vista === "lista";
  const titulo = document.getElementById("tituloModalFeriados");
  const botonCalendario = document.getElementById("btnVistaCalendario");
  const botonLista = document.getElementById("btnVistaLista");

  titulo.textContent = mostrarLista
    ? "Lista de feriados"
    : "Calendario de feriados";
  document.getElementById("panelVistaCalendario").hidden = mostrarLista;
  document.getElementById("panelVistaLista").hidden = !mostrarLista;
  botonCalendario.classList.toggle("activo", !mostrarLista);
  botonLista.classList.toggle("activo", mostrarLista);
  botonCalendario.setAttribute("aria-selected", String(!mostrarLista));
  botonLista.setAttribute("aria-selected", String(mostrarLista));
  botonCalendario.tabIndex = mostrarLista ? -1 : 0;
  botonLista.tabIndex = mostrarLista ? 0 : -1;

  if (mostrarLista) {
    enfocarProximoFeriado();
  }
}

function enfocarProximoFeriado() {
  const panel = document.getElementById("panelVistaLista");

  if (panel.hidden || panel.clientHeight === 0) {
    return;
  }

  const feriadoProximo = [
    ...panel.querySelectorAll(".tarjeta-feriado-modal[data-fecha]"),
  ].find((tarjeta) => tarjeta.dataset.fecha >= obtenerFechaLocal());

  if (!feriadoProximo) {
    panel.scrollTop = 0;
    return;
  }

  const rectPanel = panel.getBoundingClientRect();
  const rectFeriado = feriadoProximo.getBoundingClientRect();
  const bordeSuperior = rectPanel.top + panel.clientTop;
  const scrollDeseado =
    panel.scrollTop + rectFeriado.top - bordeSuperior;
  const scrollMaximo = Math.max(0, panel.scrollHeight - panel.clientHeight);

  panel.scrollTop = Math.min(Math.max(0, scrollDeseado), scrollMaximo);
}

function renderizarAlmanaqueDetalle(fechaIso) {
  const [anio, mes, diaSeleccionado] = fechaIso.split("-").map(Number);
  const primerDiaSemana = (new Date(anio, mes - 1, 1).getDay() + 6) % 7;
  const cantidadDias = new Date(anio, mes, 0).getDate();
  const calendario = document.createElement("div");
  calendario.className = "almanaque-feriado";

  ["L", "M", "M", "J", "V", "S", "D"].forEach((diaSemana) => {
    const encabezado = document.createElement("span");
    encabezado.className = "encabezado-dia-feriados";
    encabezado.textContent = diaSemana;
    calendario.append(encabezado);
  });

  for (let posicion = 0; posicion < primerDiaSemana; posicion += 1) {
    calendario.append(document.createElement("span"));
  }

  for (let dia = 1; dia <= cantidadDias; dia += 1) {
    const celda = document.createElement("span");
    celda.textContent = String(dia);

    if (dia === diaSeleccionado) {
      celda.className = "dia-detalle-seleccionado";
    }

    calendario.append(celda);
  }

  return calendario;
}

function seleccionarFechaFeriado(fechaIso) {
  fechaFeriadoSeleccionada = fechaIso;
  const feriados = feriadosCalendarioActual.filter(
    (feriado) => feriado.fecha === fechaIso,
  );
  const detalle = document.getElementById("contenidoDetalleFeriado");
  const diferencia = diferenciaEnDias(fechaIso);
  const estadoFecha =
    diferencia < 0
      ? `Este feriado ya pasó hace ${Math.abs(diferencia)} ${Math.abs(diferencia) === 1 ? "día" : "días"}.`
      : diferencia === 0
        ? "Este feriado es hoy."
        : `Faltan ${diferencia} ${diferencia === 1 ? "día" : "días"} para este feriado.`;

  detalle.replaceChildren();
  const titulo = document.createElement("h3");
  titulo.textContent =
    feriados.length > 1 ? "Feriados de esta fecha" : feriados[0].nombre;

  const fecha = document.createElement("p");
  fecha.className = "fecha-completa-feriado";
  fecha.textContent = mostrarFechaCompleta(fechaIso);

  const estado = document.createElement("p");
  estado.className = "cuenta-feriado";
  estado.textContent = estadoFecha;

  detalle.append(titulo, fecha, estado);

  feriados.forEach((feriado) => {
    const nombre = document.createElement("p");
    nombre.className = "nombre-detalle-feriado";
    nombre.textContent = `${feriado.nombre} — ${feriado.tipo}`;
    detalle.append(nombre);
  });

  const tituloAlmanaque = document.createElement("h4");
  tituloAlmanaque.textContent = new Date(
    Number(fechaIso.slice(0, 4)),
    Number(fechaIso.slice(5, 7)) - 1,
    1,
  ).toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  detalle.append(tituloAlmanaque, renderizarAlmanaqueDetalle(fechaIso));
  renderizarCalendarioAnual();
  establecerVistaDetalle(true);
}

function establecerVistaDetalle(abierta) {
  const modal = document.getElementById("modalFeriados");
  const calendario = document.getElementById("calendarioAnualFeriados");
  const yaEstabaAbierta = modal.classList.contains("detalle-abierto");

  modal.classList.toggle("detalle-abierto", abierta);
  document.body.classList.toggle("detalle-feriados-abierto", abierta);
  calendario.inert = abierta;
  calendario.setAttribute("aria-hidden", String(abierta));

  if (abierta && !yaEstabaAbierta) {
    document.getElementById("btnVolverCalendario").focus();
  }
}

function cerrarDetalleFeriado() {
  establecerVistaDetalle(false);
  document
    .querySelector(`[data-fecha-feriado="${fechaFeriadoSeleccionada}"]`)
    ?.focus();
}

async function abrirCalendarioFeriados(anio) {
  establecerVistaDetalle(false);
  anioCalendarioActual = anio;
  fechaFeriadoSeleccionada = null;
  feriadosCalendarioActual = [];
  document.getElementById("anioFeriados").textContent = String(anio);
  document.getElementById("calendarioAnualFeriados").replaceChildren();
  document.getElementById("contenidoDetalleFeriado").innerHTML =
    "<p>Seleccioná una fecha marcada para ver el detalle.</p>";
  desuscribirActualizaciones();
  const datos = await obtenerFeriados(anio, (datosActualizados) => {
    if (anioCalendarioActual !== anio) {
      return;
    }

    feriadosCalendarioActual = datosActualizados.feriados;
    renderizarCalendarioAnual();
    renderizarListaFeriados();
    enfocarProximoFeriado();

    if (fechaFeriadoSeleccionada) {
      seleccionarFechaFeriado(fechaFeriadoSeleccionada);
    }
  });

  if (anioCalendarioActual !== anio) {
    datos.desuscribir();
    return;
  }

  desuscribirActualizaciones = datos.desuscribir;
  feriadosCalendarioActual = datos.feriados;
  renderizarCalendarioAnual();
  renderizarListaFeriados();
  enfocarProximoFeriado();

  if (feriadosCalendarioActual.length === 0) {
    document.getElementById("contenidoDetalleFeriado").textContent =
      `No hay una copia local válida de los feriados de ${anio}.`;
  }
}

function cerrarCalendarioFeriados() {
  establecerVistaDetalle(false);
  const modal = document.getElementById("modalFeriados");
  modal.classList.remove("activo");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-feriados-abierto");
  document
    .querySelectorAll("#btnAbrirFeriados, #btnAbrirFeriadosInicio")
    .forEach((boton) => boton.setAttribute("aria-expanded", "false"));
  desuscribirActualizaciones();
}

function manejarTecladoNavegacion(evento) {
  if (evento.key === "Escape") {
    cerrarCalendarioFeriados();
    document.getElementById("modalPrincipal").classList.remove("activo");
    return;
  }

  if (
    !(evento.target instanceof Element) ||
    !["ArrowLeft", "ArrowRight"].includes(evento.key)
  ) {
    return;
  }

  const botonVista = evento.target.closest(
    "#btnVistaCalendario, #btnVistaLista",
  );

  if (!botonVista) {
    return;
  }

  evento.preventDefault();
  const siguienteVista =
    botonVista.id === "btnVistaCalendario"
      ? "btnVistaLista"
      : "btnVistaCalendario";
  const siguienteBoton = document.getElementById(siguienteVista);
  siguienteBoton.focus();
  siguienteBoton.click();
}

function registrarEventosNavegacion() {
  document.addEventListener("click", manejarClicNavegacion);
  document.addEventListener("keydown", manejarTecladoNavegacion);
}

export function montarModalFeriados() {
  if (!document.getElementById("modalFeriados")) {
    document.body.insertAdjacentHTML("beforeend", modalFeriados);
  }

  if (!eventosNavegacionRegistrados) {
    registrarEventosNavegacion();
    eventosNavegacionRegistrados = true;
  }
}

let eventosNavegacionRegistrados = false;

export function montarNavegacionInferior() {
  const puntoMontaje =
    document.getElementById("navegacion-compartida") ||
    document.querySelector(".nav-inferior");

  if (!puntoMontaje) {
    throw new Error("No se encontró la barra ni el punto de montaje de navegación.");
  }

  if (
    document.getElementById("btnCalculadoras") ||
    document.getElementById("modalPrincipal") ||
    document.getElementById("btnCerrarModal")
  ) {
    throw new Error("La navegación compartida ya existe en esta página.");
  }

  puntoMontaje.insertAdjacentHTML(
    "beforebegin",
    `${barraInferior()}${modalCalculadoras}`,
  );
  puntoMontaje.remove();

  montarModalFeriados();
}
