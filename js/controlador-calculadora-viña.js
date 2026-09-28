import {
  valorHora,
  DIVISOR_JORNALERO,
  verificarHorasHabiles,
  calculoBaseJornal,
  diaDelJornal,
  calcularSuspensionJornal,
  calculoPresPerfecto,
  antiguedadViña,
  MENSAJES_ANTIGUEDAD_VINA,
  ASIGNACION_VINA,
  REFRIGERIO_VIÑA,
  SEPELIO_VIÑA,
  valorDiaViña,
  valorHoraViña,
  horasExtra50,
  horasExtra100,
  sumaHaberesViña,
  jubilacion,
  ley19032,
  obraSocial,
  sindicato,
  totalDescuentos,
  valorDiaEfectivo,
  calcularSuspensionEfectivo,
  cotizacionDolar,
  convertirPesosADolares,
  cotizacionReal,
  convertirPesosAReales,
  cotizacionChileno,
  convertirAchilenos,
} from "./modelo.js";

//variable dinamica para trabajar con diferentes liquidaciones--------------------------------------------
// let tipoDePago = "mensual";
// const botonQuincenal = document.getElementById("quincenal");
// const botonMensual = document.getElementById("mensual");

// botonQuincenal.addEventListener("click", () => {
//   tipoDePago = "quincenal";

//   botonQuincenal.classList.add("activo");
//   botonMensual.classList.remove("activo");
// });

// botonMensual.addEventListener("click", () => {
//   tipoDePago = "mensual";

//   botonMensual.classList.add("activo");
//   botonQuincenal.classList.remove("activo");
// });

// Variable global y excuchadores para saber si el operario es efectivo o temporario----------------------
let tipoDeOperario = "efectivo";

const opcionMesOp = document.getElementById("selectMes");
const btnTemporario = document.getElementById("temporario");
const btnEfectivo = document.getElementById("efectivo");

btnTemporario.addEventListener("click", () => {
  tipoDeOperario = "temporario";

  opcionMesOp.classList.add("visible");
  btnTemporario.classList.add("activo");
  btnEfectivo.classList.remove("activo");
});

btnEfectivo.addEventListener("click", () => {
  tipoDeOperario = "efectivo";

  opcionMesOp.classList.remove("visible");
  btnEfectivo.classList.add("activo");
  btnTemporario.classList.remove("activo");
});

//por ahora no va a funcionar.
//funcion que verifica si el checkbox de insalubre esta seleccionado.
// const insalubre = document.getElementById("checkInsalubre");
// const divInputDiasInsalubre = document.getElementById("divInputDiasInsalubre");
// const diasInsalubre = document.getElementById("diasInsalubre");
// let cantidadDiasInsalubre = 0;

// insalubre.addEventListener("change", () => {
//   if (insalubre.checked) {
//     divInputDiasInsalubre.classList.add("visible");
//     cantidadDiasInsalubre = Number(
//       document.getElementById("diasInsalubre").value || 0,
//     );
//   } else {
//     divInputDiasInsalubre.classList.remove("visible");
//     diasInsalubre.value = 0;
//     cantidadDiasInsalubre = 0;
//   }
// });

//funcion que recoge los datos que el usuario ingresa en el formulario de viña.
function obtencionDatos() {
  const numeroMes = Number(document.getElementById("opcionesMes").value);
  const basicoCategoriaViña = Number(
    document.getElementById("opcionesCat-viña").value,
  );
  const antiguedadViñaSelect = Number(
    document.getElementById("opcionesAnt").value,
  );
  const radioMesCompleto = document.getElementById("mesCompleto1").checked;
  const inpHoras50 = Number(document.getElementById("horasEx50").value);
  const inpHoras100 = Number(document.getElementById("horasEx100").value);
  const diasSuspension = Number(
    document.getElementById("dias-suspencion").value || 0,
  );
  // const checkboxVendimia = document.getElementById("checkVendimia").checked;

  //estructuramos
  return {
    basicoCategoriaViña,
    antiguedadViñaSelect,
    radioMesCompleto,
    inpHoras50,
    inpHoras100,
    diasSuspension,
    // checkboxVendimia,
    numeroMes,
  };
}

//funcion para calcular el sueldo neto de viña, usando las formulas de la funcion modelo.js.
async function controladorPrincipalViña() {
  //des-estructura.
  const {
    basicoCategoriaViña,
    antiguedadViñaSelect,
    radioMesCompleto,
    inpHoras50,
    inpHoras100,
    diasSuspension,
    // checkboxVendimia, -se comenta por si despues se implementa-
    numeroMes,
  } = obtencionDatos();

  let basico = 0;
  let valorDiaSuspension = 0;
  let suspenciones = 0;
  let horasHabilesDelMes = 0;
  let valorDia = 0;
  let suspensionJornal = 0;
  let refrigerio_temporario = 0;
  let asignacion_temporario = 0;

  if (tipoDeOperario === "efectivo") {
    //sacamos el basico de la categoria elegida en el select.
    basico = basicoCategoriaViña;
    console.log("basico", basico);
    valorDiaSuspension = valorDiaEfectivo(basico); //basico / 25
    console.log("valorDiaSuspension", valorDiaSuspension);
    suspenciones = calcularSuspensionEfectivo(
      diasSuspension,
      valorDiaSuspension,
    );
    console.log("suspenciones", suspenciones);
  } else {
    const precioHora = valorHora(basicoCategoriaViña, DIVISOR_JORNALERO);
    console.log("precioHora", precioHora);
    horasHabilesDelMes = verificarHorasHabiles(numeroMes);
    console.log("horasHabilesDelMes", horasHabilesDelMes);
    const diasTrabajados = Math.floor(horasHabilesDelMes / 8);
    console.log("diasTrabajados", diasTrabajados);
    basico = calculoBaseJornal(precioHora, horasHabilesDelMes);
    console.log("basico", basico);
    valorDia = diaDelJornal(precioHora);
    console.log("valorDia", valorDia);
    suspensionJornal = calcularSuspensionJornal(diasSuspension, valorDia);
    console.log("suspensionJornal", suspensionJornal);
    refrigerio_temporario = (REFRIGERIO_VIÑA / 25) * diasTrabajados;
    console.log("refrigerio_temporario", refrigerio_temporario);
    asignacion_temporario = (ASIGNACION_VINA / 25) * diasTrabajados;
    console.log("asignacion_temporario", asignacion_temporario);
  }

  // ------------------------antiguedad--------------------------
  //multiplica el basico por 2.5%.
  const calculoAntiguedadViña = antiguedadViña(basico);
  console.log("calculoAntiguedadViña", calculoAntiguedadViña);
  //numero de años de antiguedad por el calculo del 2.5% del basico.
  const antiguedadViñacorrespondiente =
    calculoAntiguedadViña * antiguedadViñaSelect;
  console.log("antiguedadViña", antiguedadViñacorrespondiente);
  //segun la opcion elegida en el select, muestra un mensaje con la cantidad de años.
  const mensajeAntiguedadViña = MENSAJES_ANTIGUEDAD_VINA[antiguedadViñaSelect];
  console.log("mensajeAntiguedadViña", mensajeAntiguedadViña);

  //-------------------------valor hora y dia (efectivo/ mensual) para horas extras----------------
  const valorDiaViña_var = valorDiaViña(basico, antiguedadViñacorrespondiente); //b + a / 25
  console.log("valorDiaViña", valorDiaViña_var);
  const valorHoraViña_var = valorHoraViña(valorDiaViña_var); //v / 8 || / 6
  console.log("valorHoraViña", valorHoraViña_var);

  //-------------------------horas extras--------------------------
  const horasExtra50_var = horasExtra50(valorHoraViña_var); //valor de la hora con antiguedad * 1.5
  console.log("horasExtra50", horasExtra50_var);
  const valorFinalHorasExtra50 = horasExtra50_var * inpHoras50;
  console.log("valorFinalHorasExtra50", valorFinalHorasExtra50);
  const horasExtra100_var = horasExtra100(valorHoraViña_var); //valor de la hora con antiguedad * 2
  console.log("horasExtra100", horasExtra100_var);
  const valorFinalHorasExtra100 = horasExtra100_var * inpHoras100;
  console.log("valorFinalHorasExtra100", valorFinalHorasExtra100);

  // ------------------------presentismo--------------------------
  let presentismo = 23025;
  console.log("presentismo", presentismo);
  //si el radio button de mes completo no esta seleccionado, o se selecciono "NO", el presentismo es 0.
  if (!radioMesCompleto) {
    presentismo = 0;
  }

  // ------------------------asignaciones--------------------------
  console.log("refrigerio", REFRIGERIO_VIÑA);
  console.log("asignacion", ASIGNACION_VINA);
  const noRemunerativos = REFRIGERIO_VIÑA + ASIGNACION_VINA;
  console.log("noRemunerativos_efectivo", noRemunerativos);
  const noRemunerativosTemp = refrigerio_temporario + asignacion_temporario;
  console.log("noRemunerativos_temporario", noRemunerativosTemp);

  //------------------------calculos finales--------------------------
  const sumatoria = sumaHaberesViña(
    basico,
    antiguedadViñacorrespondiente,
    presentismo,
    valorFinalHorasExtra50,
    valorFinalHorasExtra100,
  );
  console.log("sueldoFinalViña", sumatoria);

  //------------------------Deducciones--------------------------
  const jubilacion_var = jubilacion(sumatoria);
  console.log("jubilacion", jubilacion_var);
  const ley19032_var = ley19032(sumatoria);
  console.log("ley19032", ley19032_var);
  const obraSocial_var = obraSocial(sumatoria);
  console.log("obraSocial", obraSocial_var);
  const sindicato_var = sindicato(sumatoria);
  console.log("sindicato", sindicato_var);
  console.log("sepelio", SEPELIO_VIÑA);

  const totalDescuentos_var = totalDescuentos(
    SEPELIO_VIÑA,
    jubilacion_var,
    ley19032_var,
    sindicato_var,
    obraSocial_var,
    suspenciones,
  );
  console.log("totalDescuentos", totalDescuentos_var);

  //------------------------total final--------------------------
  let totalFinal = 0;
  if (tipoDeOperario === "efectivo") {
    totalFinal = sumatoria - totalDescuentos_var + noRemunerativos;
  } else {
    totalFinal = sumatoria - totalDescuentos_var + noRemunerativosTemp;
  }
  console.log("totalFinal", totalFinal);

  //--------------------cotizaciones---------------------------------
  const dolarVenta = await cotizacionDolar();
  const totalEnDolares = convertirPesosADolares(totalFinal, dolarVenta);

  const realVenta = await cotizacionReal();
  const totalEnReales = convertirPesosAReales(totalFinal, realVenta);

  const chilenoVenta = await cotizacionChileno();
  const totalEnChilenos = convertirAchilenos(totalFinal, chilenoVenta);

  //------------------------retorno de valores operarios efectivos--------------------------
  return {
    basico,
    antiguedadViñacorrespondiente,
    mensajeAntiguedadViña,
    presentismo,
    REFRIGERIO_VIÑA,
    ASIGNACION_VINA,
    jubilacion_var,
    ley19032_var,
    sindicato_var,
    obraSocial_var,
    suspenciones,
    diasSuspension,
    SEPELIO_VIÑA,
    valorFinalHorasExtra50,
    valorFinalHorasExtra100,
    refrigerio_temporario,
    asignacion_temporario,
    sumatoria,
    totalDescuentos_var,
    totalFinal,
    totalEnDolares,
    totalEnReales,
    totalEnChilenos,
  };
}

async function imprimirviña() {
  const divVistaResultado = document.getElementById("resultado");

  //des-estructura de la funcion controladorPrincipalViña.
  const {
    basico,
    antiguedadViñacorrespondiente,
    mensajeAntiguedadViña,
    presentismo,
    REFRIGERIO_VIÑA,
    ASIGNACION_VINA,
    jubilacion_var,
    ley19032_var,
    sindicato_var,
    obraSocial_var,
    suspenciones,
    diasSuspension,
    SEPELIO_VIÑA,
    valorFinalHorasExtra50,
    valorFinalHorasExtra100,
    refrigerio_temporario,
    asignacion_temporario,
    sumatoria,
    totalDescuentos_var,
    totalFinal,
    totalEnDolares,
    totalEnReales,
    totalEnChilenos,
  } = await controladorPrincipalViña();

  divVistaResultado.innerHTML = `
  <div id="divPDF">

  <h4 class="h4-titulo-arriba" >Haberes Remunerativos</h4>

  <div class="resultado1">
  <span> Basico: </span> 
  <span> $${basico.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

  <div class="resultado1">
  <span> Antiguedad (${mensajeAntiguedadViña}):</span>
  <span> $${antiguedadViñacorrespondiente.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

  <div class="resultado1">
  <span> Horas extras 50%: </span>
  <span> $${valorFinalHorasExtra50.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

  <div class="resultado1">
  <span> Horas extras 100%: </span>
  <span> $${valorFinalHorasExtra100.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
  </div>

  <div class="resultado1">
  <span> Presentismo: </span> 
  <span> $${presentismo.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

<h4 class="h4-enMedio">Haberes No Remunerativos</h4>

${
  tipoDeOperario === "efectivo"
    ? `
  <div class="resultado1">
  <span> No remunerativo: </span> 
  <span> $${ASIGNACION_VINA.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

  <div class="resultado1">
  <span> Refrigerio: </span> 
  <span> $${REFRIGERIO_VIÑA.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>`
    : `<div class="resultado1">
  <span> No remunerativo: </span> 
  <span> $${asignacion_temporario.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

  <div class="resultado1">
  <span> Refrigerio: </span> 
  <span> $${refrigerio_temporario.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>`
}

  <h4 class="h4-enMedio">Deducciones</h4>

  ${
    suspenciones != 0
      ? `
<div class="resultado1">
  <span> Suspención (${diasSuspension} ${diasSuspension < 2 ? `dia` : `dias`}): </span>
  <span> $${suspenciones.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>`
      : ""
  }
<div class="resultado1">
  <span> Jubilacion: </span>
  <span> $${jubilacion_var.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

  <div class="resultado1">
  <span> Ley 19032: </span>
  <span> $${ley19032_var.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

    <div class="resultado1">
  <span> Obra Social: </span>
  <span> $${obraSocial_var.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

  <div class="resultado1">
  <span> Sindicato: </span>
  <span> $${sindicato_var.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

  <div class="resultado1">
  <span> Sepelio: </span>
  <span> $${SEPELIO_VIÑA.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
  </div>

  <div class="resultado1">
<h4 class="h4-total">Total Neto</h4>
</div>  

    <div class="resultadoFinal"> 

        <div class="resultEnMonedas">
        <span class="tituloEnPesos"> En pesos:  </span>
         <span class="numeroPesos"> $${totalFinal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
        </div>

        <div class="resultEnMonedas no-pdf">
        <span class="tituloEnDolares"> En dolares:  </span> <span class="numeroDolares"> $${totalEnDolares.toLocaleString("en-US", { style: "currency", currency: "USD" })} </span>
        </div>

        <div class="resultEnMonedas no-pdf">
        <span class="tituloEnReales"> En reales:  </span> <span class="numeroReal"> ${totalEnReales.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} </span>
        </div>

        <div class="resultEnMonedas no-pdf">
        <span class="tituloEnChilenos"> En chilenos:  </span> <span class="numeroChileno"> ${totalEnChilenos.toLocaleString("es-CL", { style: "currency", currency: "CLP" })} </span>
        </div>

        <div class="sello-de-agua-viña">
        <span class="sello-texto">SUELDOBODEGA.com.ar</span>
        </div>
    </div>`;
}

//boton para calcular
const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", (event) => {
  event.preventDefault(); //asi no se recarga la pagina al presionar el boton.
  controladorPrincipalViña();
  imprimirviña();
});
