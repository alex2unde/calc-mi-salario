import { montarNavegacionInferior } from "./navegacion-compartida.js";
import {
  anioDiasTotales,
  diasTrabajadosTotales,
  calcularMes,
  calcularAños,
  calcularAntiguedadIndem,
  calcularAguinaldoProporcional,
  diasTrabajadosUltAnio,
  vacacionesSegunAntiguedad,
  vacacionesProporcionales,
  vacacionesSAC,
  vacacionesAdeudadas,
  vacacionesAdeudadasSAC,
  diasDelUltimoMes,
  diasUltMes,
  valorHora,
  valorUltimoMes,
  IntegracionMesDespido,
  integracionMesDespidoSAC,
  preAvisoCalculo,
  SACsobrePreaviso,
  totalSinCausayCP,
  totalConCausaOrenuncia,
  cotizacionDolar,
  convertirPesosADolares,
  cotizacionReal,
  convertirPesosAReales,
  cotizacionChileno,
  convertirAchilenos,
  DIVISOR_JORNALERO,
} from "./modelo.js";

montarNavegacionInferior();

// boton del menu responsive-----------------------------------------------------------------
const botonMenu = document.getElementById("menu");
const navDesplega = document.getElementById("nav__links");

//modo claro/oscuro.
botonMenu.addEventListener("click", () => {
  navDesplega.classList.toggle("active");
});
function obtencionDeDatos() {
  const selectCategoria = Number(document.getElementById("opcionesCat").value);
  const fechaInit = document.getElementById("fechaInicio").value;
  const fechaFinit = document.getElementById("fechaFin").value;
  const mayorSueldo = parseFloat(
    document.getElementById("ultimoSueldo").value || 0,
  );
  const tipoDespido = document.getElementById("tipoDespido").value;
  const preAviso = document.getElementById("preAviso").checked;

  return {
    selectCategoria,
    fechaInit,
    fechaFinit,
    mayorSueldo,
    tipoDespido,
    preAviso,
  };
}

// Si el check está marcado, devolvemos el número, sino 0.
function diasAdeudadosVacaciones() {
  const checkbox = document.getElementById("vacaciones");
  const input = document.getElementById("diasVacaciones");

  return checkbox.checked ? Number(input.value) || 0 : 0;
}

const iconoSugerencias = document.getElementById("divSugerencias");
const formularioSug = document.getElementById("formularioSugerencias");

// 1. SOLUCIÓN AL CLIC ADENTRO: Frenar la burbuja
formularioSug.addEventListener("click", (event) => {
  event.stopPropagation(); // El clic muere en el form, no llega al div padre
});
// 2. Abrir y cerrar con el ícono
iconoSugerencias.addEventListener("click", () => {
  if (formularioSug.style.display === "block") {
    formularioSug.style.display = "none";
  } else {
    formularioSug.style.display = "block";
  }
});
// 3. Cerrar al hacer clic afuera
document.addEventListener("click", (event) => {
  if (formularioSug.style.display === "block") {
    if (
      !formularioSug.contains(event.target) &&
      !iconoSugerencias.contains(event.target)
    ) {
      formularioSug.style.display = "none";
    }
  }
});
// 4. SOLUCIÓN AL ENVÍO: Enviar "en silencio" sin recargar la página
formularioSug.addEventListener("submit", async (event) => {
  // Frenamos la recarga automática
  event.preventDefault();

  // Recolectamos lo que el usuario escribió
  const formData = new FormData(formularioSug);

  try {
    // Usamos fetch para enviar los datos a la URL que pusiste en el action de tu HTML
    const response = await fetch(formularioSug.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json", // Le decimos a Formspree que no nos redirija
      },
    });

    if (response.ok) {
      alert("¡Sugerencia enviada con éxito! Gracias por ayudarnos.");
      formularioSug.reset(); // Limpia los campos (nombre, mensaje, etc)
      formularioSug.style.display = "none"; // Cierra la ventanita
    } else {
      alert("Hubo un problema al enviar la sugerencia.");
    }
  } catch (error) {
    alert("Error de conexión. Revisá tu internet e intentá nuevamente.");
  }
});

async function controladorIndemnizacion() {
  const divResultado = document.getElementById("resultadoIndemnizacion");

  const {
    selectCategoria,
    fechaInit,
    fechaFinit,
    mayorSueldo,
    tipoDespido,
    preAviso,
  } = obtencionDeDatos();

  const diasTotales = anioDiasTotales(fechaInit, fechaFinit);

  const diasTrabajado = diasTrabajadosTotales(fechaInit, fechaFinit);

  const liquidxMeses = calcularMes(fechaInit, fechaFinit);

  const añosTrabajados = calcularAños(diasTrabajado);

  const liquidxAños = calcularAntiguedadIndem(añosTrabajados, mayorSueldo);

  const SACaguinaldo = calcularAguinaldoProporcional(fechaFinit, mayorSueldo);

  const diasTrabajadosUanio = diasTrabajadosUltAnio(fechaFinit);

  const vacaciones = vacacionesSegunAntiguedad(añosTrabajados);

  const vacacionesProp = vacacionesProporcionales(
    vacaciones,
    mayorSueldo,
    diasTrabajadosUanio,
    diasTotales,
  );

  const SACvacaciones = vacacionesSAC(vacacionesProp);

  const diasQueLeDeben = diasAdeudadosVacaciones();

  const deudaVacaciones = vacacionesAdeudadas(diasQueLeDeben, mayorSueldo);

  const deudaVacacionesSAC = vacacionesAdeudadasSAC(deudaVacaciones);

  const diasUltimoMes = diasDelUltimoMes(fechaFinit);

  const diasTrabajadosUltMes = diasUltMes(fechaFinit);

  const valorHoraCalculado = valorHora(selectCategoria, DIVISOR_JORNALERO);

  const valorUltimoMesCalculado = valorUltimoMes(
    diasTrabajadosUltMes,
    valorHoraCalculado,
  );

  const intMesDespido = IntegracionMesDespido(
    diasTrabajadosUltMes,
    mayorSueldo,
    30,
  );

  const intMesDespidoSAC = integracionMesDespidoSAC(intMesDespido);

  const preAvisoCalculado = preAvisoCalculo(
    diasTrabajado,
    mayorSueldo,
    añosTrabajados,
  );

  const preavisoSAC = SACsobrePreaviso(preAvisoCalculado);

  const totalIndemnizacionSCP = totalSinCausayCP(
    vacacionesProp,
    SACvacaciones,
    SACaguinaldo,
    liquidxAños,
    intMesDespido,
    intMesDespidoSAC,
    preAvisoCalculado,
    preavisoSAC,
    preAviso,
    deudaVacaciones,
    deudaVacacionesSAC,
  );

  const totalIndemnizacionConCausa = totalConCausaOrenuncia(
    valorUltimoMesCalculado,
    SACaguinaldo,
    deudaVacaciones,
    deudaVacacionesSAC,
    vacacionesProp,
    SACvacaciones,
  );

  const dolarVenta = await cotizacionDolar();
  const totalEnDolaresSC = convertirPesosADolares(
    totalIndemnizacionSCP,
    dolarVenta,
  );
  const totalEnDolaresCC = convertirPesosADolares(
    totalIndemnizacionConCausa,
    dolarVenta,
  );

  const realVenta = await cotizacionReal();
  const totalEnRealesSC = convertirPesosAReales(
    totalIndemnizacionSCP,
    realVenta,
  );
  const totalEnRealesCC = convertirPesosAReales(
    totalIndemnizacionConCausa,
    realVenta,
  );

  const chilenoVenta = await cotizacionChileno();
  const totalEnChilenosSC = convertirAchilenos(
    totalIndemnizacionSCP,
    chilenoVenta,
  );
  const totalEnChilenosCC = convertirAchilenos(
    totalIndemnizacionConCausa,
    chilenoVenta,
  );

  divResultado.innerHTML = `
  <div id="divPDF">
    <div class="resultado1">
        <p>Fecha de ingreso: </p>
        <p>${fechaInit}</p>
    </div>
    <div class="resultado1">
        <p>Fecha de egreso: </p>
        <p>${fechaFinit}</p>
    </div>
    <div class="resultado1">
        <p>Mayor sueldo mensual: </p>
        <p>$${mayorSueldo.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
    <div class="resultado1">
        <p>Tipo de despido: </p>
        <p>${tipoDespido}</p>
    </div>
    <div class="resultado1">
        <p>Preaviso: </p>
        <p>${preAviso ? "Sí" : "No"}</p>
    </div>
<hr />
    <div class="resultado1">
        <p>Años trabajados: </p>
        <p>${añosTrabajados}</p>
    </div>
        ${
          tipoDespido === "Con_causa" || tipoDespido === "Renuncia"
            ? `
    <div class="resultado1">
        <p>Ultimo mes trabajado: </p>
        <p>$${valorUltimoMesCalculado.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>`
            : ""
        }
    <div class="resultado1">
        <p>Aguinaldo proporcional: </p>
        <p>$${SACaguinaldo.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>    
    <div class="resultado1">
        <p>Vacaciones proporcionales: </p>
        <p>$${vacacionesProp.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
    <div class="resultado1">
        <p>SAC vacaciones proporcionales: </p>
        <p>$${SACvacaciones.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
        ${
          tipoDespido === "Sin_causa"
            ? `
    <div class="resultado1">
        <p>Indemnización por años trabajados: </p>
        <p>$${liquidxAños.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
    <div class="resultado1">
        <p>Integración mes de despido: </p>
        <p>$${intMesDespido.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
    <div class="resultado1">
        <p>SAC integración mes de despido: </p>
        <p>$${intMesDespidoSAC.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>

    ${
      !preAviso
        ? `
    <div class="resultado1">
        <p>Preaviso: </p>
        <p>$${preAvisoCalculado.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
    <div class="resultado1">
        <p>SAC sobre preaviso: </p>
        <p>$${preavisoSAC.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>`
        : ""
    }
  `
            : ""
        }
    ${
      diasQueLeDeben > 0
        ? `
    <div class="resultado1">
        <p>Vacaciones adeudadas: </p>
        <p>$${deudaVacaciones.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
    <div class="resultado1">
        <p>SAC vacaciones adeudadas: </p>
        <p>$${deudaVacacionesSAC.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>`
        : ""
    }
    ${
      tipoDespido === "Sin_causa"
        ? `
    <div class="resultado1">
      <h4 class="h4-total">Total Neto</h4>
    </div>
    <div class="resultadoFinal">
        <div class="resultEnMonedaFinal moneda-pesos">
            <h4 class="h4-titulo-arriba">Total</h4>
            <span class="numeroPesos">$${totalIndemnizacionSCP.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="div-conversion">
          <div class="resultEnMonedas no-pdf numeroDolares">
            <span>${totalEnDolaresSC.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
            <img class="bandera-conversion" src="assets/imagenes/bandera-eeuu.svg" alt="Bandera de Estados Unidos">
          </div>
          <div class="resultEnMonedas no-pdf numeroReal">
            <span>${totalEnRealesSC.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            <img class="bandera-conversion" src="assets/imagenes/bandera-brasil.svg" alt="Bandera de Brasil">
          </div>
          <div class="resultEnMonedas no-pdf numeroChileno">
            <span>${totalEnChilenosSC.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</span>
            <img class="bandera-conversion" src="assets/imagenes/bandera-chile.svg" alt="Bandera de Chile">
          </div>
        </div>
        <div class="sello-de-agua">
        <span class="sello-texto">SUELDOBODEGA.com.ar</span>
        </div>
    </div>
  `
        : `
    <div class="resultado1">
      <h4 class="h4-total">Total Neto</h4>
    </div>
    <div class="resultadoFinal">
        <div class="resultEnMonedaFinal moneda-pesos">
            <h4 class="h4-titulo-arriba">Total</h4>
            <span class="numeroPesos">$${totalIndemnizacionConCausa.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="div-conversion">
          <div class="resultEnMonedas no-pdf numeroDolares">
            <span>${totalEnDolaresCC.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
            <img class="bandera-conversion" src="assets/imagenes/bandera-eeuu.svg" alt="Bandera de Estados Unidos">
          </div>
          <div class="resultEnMonedas no-pdf numeroReal">
            <span>${totalEnRealesCC.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            <img class="bandera-conversion" src="assets/imagenes/bandera-brasil.svg" alt="Bandera de Brasil">
          </div>
          <div class="resultEnMonedas no-pdf numeroChileno">
            <span>${totalEnChilenosCC.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</span>
            <img class="bandera-conversion" src="assets/imagenes/bandera-chile.svg" alt="Bandera de Chile">
          </div>
        </div>
        <div class="sello-de-agua">
        <span class="sello-texto">SUELDOBODEGA.com.ar</span>
        </div>
    </div>
    </div>
  `
    }
  `;
}

//boton para calcular
const formulario = document.getElementById("formulario-indemnizacion");
formulario.addEventListener("submit", (event) => {
  event.preventDefault(); //asi no se recarga la pagina al presionar el boton.
  controladorIndemnizacion();
});

// 1. Identificamos los elementos una sola vez
const checkVacaciones = document.getElementById("vacaciones");
const inputVacaciones = document.getElementById("diasVacaciones");
// Seleccionamos el label para ocultar también el texto "Días de vacaciones..."
const labelVacaciones = document.querySelector(".labelVacacionesDeuda");

checkVacaciones.addEventListener("change", function () {
  // Esta lógica se ejecuta CADA VEZ que haces clic en el checkbox
  if (checkVacaciones.checked) {
    labelVacaciones.style.display = "block"; // Se muestra todo
  } else {
    labelVacaciones.style.display = "none"; // Se oculta todo
    inputVacaciones.value = ""; // Limpiamos el número si lo desmarcan
  }
});

// Generar PDF.
const botonDescarga = document.getElementById("botonPDF");
botonDescarga.addEventListener("click", async () => {
  const capturaAqui = document.getElementById("divPDF");

  if (!capturaAqui) {
    alert("Primero debes realizar el cálculo para generar el PDF.");
    return;
  }

  if (!(await window.html2pdfReady)) {
    alert("No se pudo cargar el generador de PDF. Revisá tu conexión e intentá nuevamente.");
    return;
  }

  capturaAqui.classList.add("forzar-PDF");

  const configPDF = {
    margin: 5, // Un margen pequeño para aprovechar el espacio
    filename: "sueldo-calculado.pdf",
    image: { type: "jpeg", quality: 0.98 },
    pagebreak: { mode: ["css", "legacy"] }, // Evita cortes bruscos
    html2canvas: {
      scale: 2,
      useCORS: true, // Importante si usas imágenes o estilos externos
      letterRendering: true,
      scrollY: 0, // Asegura que no se corte si hay scroll en la página
    },
    // Cambiamos a A4 y definimos orientación vertical
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf()
    .set(configPDF)
    .from(capturaAqui)
    .save()
    .then(() => {
      capturaAqui.classList.remove("forzar-PDF");
    });
});
