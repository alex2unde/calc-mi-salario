import { montarNavegacionInferior } from "./navegacion-compartida.js";
import {
  calcularRemunerativo,
  calcularNoRemunerativo,
  calcularDescuentos,
  calcularSueldoNeto,
  desgloseDescuentos,
  cotizacionDolar,
  convertirPesosADolares,
  cotizacionReal,
  convertirPesosAReales,
  cotizacionChileno,
  convertirAchilenos,
} from "./modelo.js";

montarNavegacionInferior();

const tareasPorUnidad = [
  { inputId: "cantMugronEnguanado", tarifa: "enguanados" },
  { inputId: "cantMugronSinEnguanar", tarifa: "sinEnguanar" },
  { inputId: "cantRodrigones", tarifa: "rodrigones" },
  { inputId: "cantCabeceros", tarifa: "cabeceros" },
];

const formatoPesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

function redondearMoneda(importe) {
  return Math.round((importe + Number.EPSILON) * 100) / 100;
}

function leerCantidad(id, requerido = false) {
  const input = document.getElementById(id);
  const valorIngresado = input.value.trim();
  const valor =
    valorIngresado === "" && !requerido ? 0 : Number(valorIngresado);

  if (!Number.isFinite(valor) || valor < 0 || (requerido && valor <= 0)) {
    throw new Error(
      requerido
        ? "Ingresá una cantidad de hectáreas mayor que cero."
        : "Las cantidades de tareas deben ser números iguales o mayores que cero.",
    );
  }

  return valor;
}

function obtenerDatosContrato() {
  const tareas = tareasPorUnidad.reduce((cantidades, tarea) => {
    cantidades[tarea.tarifa] = leerCantidad(tarea.inputId);
    return cantidades;
  }, {});

  return {
    tipoCultivo: document.getElementById("tipoCultivo").value,
    hectareas: leerCantidad("hectareasContratista", true),
    intercaladas: document.getElementById("selectIntercaladas").value,
    tareas,
  };
}

async function calcularContrato(datos) {
  const totalRem = redondearMoneda(
    calcularRemunerativo(
      datos.tipoCultivo,
      datos.hectareas,
      datos.intercaladas,
      datos.tareas,
    ),
  );
  const totalNoRem = redondearMoneda(
    calcularNoRemunerativo(
      datos.tipoCultivo,
      datos.hectareas,
      datos.intercaladas,
      datos.tareas,
    ),
  );
  const totalDescuentos = redondearMoneda(
    calcularDescuentos(totalRem, datos.hectareas),
  );
  const sueldoNeto = redondearMoneda(
    calcularSueldoNeto(totalRem, totalNoRem, totalDescuentos),
  );

  const dolarVenta = await cotizacionDolar();
  const totalEnDolares = convertirPesosADolares(sueldoNeto, dolarVenta);

  const realVenta = await cotizacionReal();
  const totalEnReales = convertirPesosAReales(sueldoNeto, realVenta);

  const chilenoVenta = await cotizacionChileno();
  const totalEnChilenos = convertirAchilenos(sueldoNeto, chilenoVenta);

  return {
    totalRem,
    totalNoRem,
    descuentos: desgloseDescuentos(totalRem, datos.hectareas).map(
      (descuento) => ({
        ...descuento,
        importe: redondearMoneda(descuento.importe),
      }),
    ),
    totalDescuentos,
    sueldoNeto,
    totalEnDolares,
    totalEnReales,
    totalEnChilenos,
  };
}

function renderizarResultado(datos, calculo) {
  const resultado = document.getElementById("resultado");
  const retencionesDeLey = calculo.descuentos[0];
  const seguroSepelio = calculo.descuentos[1];
  const fondoDesempleo = calculo.descuentos[2];
  const cuotaExtraordinaria = calculo.descuentos[3];
  const dolares =
    calculo.totalEnDolares === null
      ? "Cotización no disponible"
      : calculo.totalEnDolares.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
  const reales =
    calculo.totalEnReales === null
      ? "Cotización no disponible"
      : calculo.totalEnReales.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
  const pesosChilenos =
    calculo.totalEnChilenos === null
      ? "Cotización no disponible"
      : calculo.totalEnChilenos.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        });

  resultado.innerHTML = `
  <div id="divPDF">

  <h4 class="h4-titulo-arriba" >Haberes Remunerativos</h4>
  <div class="resultado1">
    <span> Superficie: ${datos.hectareas} ha</span> <span>${formatoPesos.format(calculo.totalRem)}</span>
  </div>

  <h4 class="h4-titulo-arriba" >No remunerativo</h4>
  <div class="resultado1">
    <span>Subtotal </span> <span>${formatoPesos.format(calculo.totalNoRem)}</span>
  </div>

  <h4 class="h4-titulo-arriba">Deducciones</h4>
  <div class="resultado1 descuento-item descuento-ley">
    <span >${retencionesDeLey.nombre}</span>
    <span >${formatoPesos.format(retencionesDeLey.importe)}</span>
  </div>
  <div class="resultado1 descuento-item descuento-sepelio">
    <span >${seguroSepelio.nombre}</span>
    <span >${formatoPesos.format(seguroSepelio.importe)}</span>
  </div>
  <div class="resultado1 descuento-item descuento-desempleo">
    <span >${fondoDesempleo.nombre}</span>
    <span >${formatoPesos.format(fondoDesempleo.importe)}</span>
  </div>
  <div class="resultado1 descuento-item descuento-cuota">
    <span >${cuotaExtraordinaria.nombre}</span>
    <span >${formatoPesos.format(cuotaExtraordinaria.importe)}</span>
  </div>

  <div class="resultado1">
   <span>Total descuentos:</span> <span> ${formatoPesos.format(calculo.totalDescuentos)}</span>
  </div>

  
  <div class="resultadoFinal">
    <div class="resultEnMonedaFinal moneda-pesos">
      <h4 class="h4-titulo-arriba" >Total</h4><span class="numeroPesos">${formatoPesos.format(calculo.sueldoNeto)}</span>
      </div>

    <div class="div-conversion">
    <div class="resultEnMonedas no-pdf numeroDolares">
      <span>${dolares}</span><img class="bandera-conversion" src="assets/imagenes/bandera-eeuu.svg" alt="Bandera de Estados Unidos">
     </div>

    <div class="resultEnMonedas no-pdf numeroReal">
      <span>${reales}</span><img class="bandera-conversion" src="assets/imagenes/bandera-brasil.svg" alt="Bandera de Brasil">
    </div>
  
    <div class="resultEnMonedas no-pdf numeroChileno">
      <span>${pesosChilenos}</span><img class="bandera-conversion" src="assets/imagenes/bandera-chile.svg" alt="Bandera de Chile">
    </div>
    </div>
  
    <div class="sello-de-agua">
      <span class="sello-texto">SUELDOBODEGA.com.ar</span>
    </div>
  </div>
  `;
}

function controladorContrato() {
  const formulario = document.getElementById("formulario");
  const resultado = document.getElementById("resultado");

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    resultado.setAttribute("aria-live", "polite");

    try {
      const datos = obtenerDatosContrato();
      const calculo = await calcularContrato(datos);
      renderizarResultado(datos, calculo);
    } catch (error) {
      resultado.innerHTML = `<p role="alert">${error.message}</p>`;
    }
  });
}

controladorContrato();
