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
        <span class="tituloEnPesos"> En pesos: </span> <span> <span class="numeroPesos">$${totalIndemnizacionSCP.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="resultEnMonedas">
        <span class="tituloEnDolares"> En dólares: </span> <span class="numeroDolares">$${totalEnDolaresSC.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
        </div>
        <div class="resultEnMonedas">
        <span class="tituloEnReales"> En reales: </span> <span class="numeroReal">${totalEnRealesSC.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        </div>    
    </div>
  `
        : `
    <div class="resultadoFinal">
        <p class="tituloTotal">Total indemnización con causa: </p>
        <div class="resultEnMonedas">
        <span class="tituloEnPesos"> En pesos: </span> <span> <span class="numeroPesos">$${totalIndemnizacionConCausa.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="resultEnMonedas">
        <span class="tituloEnDolares"> En dólares: </span> <span class="numeroDolares">$${totalEnDolaresCC.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
        </div>
        <div class="resultEnMonedas">
        <span class="tituloEnReales"> En reales: </span> <span class="numeroReal">${totalEnRealesCC.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
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
