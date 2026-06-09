//modo claro/oscuro.
const btnModo = document.getElementById("toggleModo");
// Buscamos específicamente la etiqueta <i> que está adentro del botón
const iconoModo = btnModo.querySelector("i");

btnModo.addEventListener("click", () => {
  // 1. Cambiamos el modo de la página
  document.body.classList.toggle("modo-claro");

  // 2. Cambiamos el ícono
  if (document.body.classList.contains("modo-claro")) {
    // Si pasamos a modo claro, sacamos el sol y ponemos la luna
    iconoModo.classList.remove("fa-sun");
    iconoModo.classList.add("fa-moon");
  } else {
    // Si volvemos a modo oscuro, sacamos la luna y ponemos el sol
    iconoModo.classList.remove("fa-moon");
    iconoModo.classList.add("fa-sun");
  }
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

async function controladorIndemnizacion(event) {
  event.preventDefault();

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
  console.log(diasTotales + " días del ult. año");

  const diasTrabajado = diasTrabajadosTotales(fechaInit, fechaFinit);
  console.log(diasTrabajado + " días trabajados");

  const liquidxMeses = calcularMes(fechaInit, fechaFinit);
  console.log(liquidxMeses + " meses trabajados");

  const añosTrabajados = calcularAños(diasTrabajado);
  console.log(añosTrabajados + " años computados");

  const liquidxAños = calcularAntiguedadIndem(añosTrabajados, mayorSueldo);
  console.log(liquidxAños + " indemnización x antiguedad");

  const SACaguinaldo = calcularAguinaldoProporcional(fechaFinit, mayorSueldo);
  console.log(SACaguinaldo + " SACaguinaldo proporcional");

  const diasTrabajadosUanio = diasTrabajadosUltAnio(fechaFinit);

  const vacaciones = vacacionesSegunAntiguedad(añosTrabajados);
  console.log(vacaciones + " días de vacaciones");

  const vacacionesProp = vacacionesProporcionales(
    vacaciones,
    mayorSueldo,
    diasTrabajadosUanio,
    diasTotales,
  );
  console.log(vacacionesProp + " vacacionesProp proporcional");

  const SACvacaciones = vacacionesSAC(vacacionesProp);
  console.log(SACvacaciones + " SAC vacaciones proporcional");

  const diasQueLeDeben = diasAdeudadosVacaciones();
  console.log(diasQueLeDeben + " días de vacaciones adeudados");

  const deudaVacaciones = vacacionesAdeudadas(diasQueLeDeben, mayorSueldo);
  console.log(deudaVacaciones + " vacaciones adeudadas");

  const deudaVacacionesSAC = vacacionesAdeudadasSAC(deudaVacaciones);
  console.log(deudaVacacionesSAC + " SAC vacaciones adeudadas");

  const diasUltimoMes = diasDelUltimoMes(fechaFinit);
  console.log(diasUltimoMes + " días del último mes");

  const diasTrabajadosUltMes = diasUltMes(fechaFinit);
  console.log(diasTrabajadosUltMes + " días trabajados en el último mes");

  const valorHoraCalculado = valorHora(selectCategoria, DIVISOR_JORNALERO);
  console.log(valorHoraCalculado + " valor hora");

  const valorUltimoMesCalculado = valorUltimoMes(
    diasTrabajadosUltMes,
    valorHoraCalculado,
  );
  console.log(valorUltimoMesCalculado + " valor del último mes trabajado");

  const intMesDespido = IntegracionMesDespido(
    diasTrabajadosUltMes,
    valorHoraCalculado,
    diasUltimoMes,
  );
  console.log(intMesDespido + " integración mes de despido");

  const intMesDespidoSAC = integracionMesDespidoSAC(intMesDespido);
  console.log(intMesDespidoSAC + " SAC integración mes de despido");

  const preAvisoCalculado = preAvisoCalculo(
    diasTrabajado,
    mayorSueldo,
    añosTrabajados,
  );
  console.log(preAvisoCalculado + " preaviso");

  const preavisoSAC = SACsobrePreaviso(preAvisoCalculado);
  console.log(preavisoSAC + " SAC sobre preaviso");

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
  console.log(totalIndemnizacionSCP + " total indemnización");

  const totalIndemnizacionConCausa = totalConCausaOrenuncia(
    valorUltimoMesCalculado,
    SACaguinaldo,
    deudaVacaciones,
    deudaVacacionesSAC,
    vacacionesProp,
    SACvacaciones,
  );
  console.log(totalIndemnizacionConCausa + " total indemnización con causa");

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
<hr />
    ${
      tipoDespido === "Sin_causa"
        ? `
    <div class="resultadoFinal">
        <p class="tituloTotal">Total indemnización sin causa: </p>
        <div class="resultEnMonedas">
            <span class="tituloEnPesos"> En pesos: </span> <span> <span class="numeroPesos">$${totalIndemnizacionSCP.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> </span>
        </div>
        <div class="resultEnMonedas no-pdf">
            <span class="tituloEnDolares"> En dólares: </span> <span class="numeroDolares">$${totalEnDolaresSC.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
        </div>
        <div class="resultEnMonedas no-pdf">
            <span class="tituloEnReales"> En reales: </span> <span class="numeroReal">${totalEnRealesSC.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        </div>    
    </div>
  `
        : `
    <div class="resultadoFinal">
        <p class="tituloTotal">Total indemnización con causa: </p>
        <div class="resultEnMonedas">
            <span class="tituloEnPesos"> En pesos: </span> <span> <span class="numeroPesos">$${totalIndemnizacionConCausa.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> </span>
        </div>
        <div class="resultEnMonedas no-pdf">
            <span class="tituloEnDolares"> En dólares: </span> <span class="numeroDolares">$${totalEnDolaresCC.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
        </div>
        <div class="resultEnMonedas no-pdf">
            <span class="tituloEnReales"> En reales: </span> <span class="numeroReal">${totalEnRealesCC.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        </div>
    </div>
    </div>
  `
    }
  `;
}

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
botonDescarga.addEventListener("click", () => {
  const capturaAqui = document.getElementById("divPDF");

  if (!capturaAqui) {
    alert("Primero debes realizar el cálculo para generar el PDF.");
    return;
  }

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

  html2pdf().set(configPDF).from(capturaAqui).save();
});
