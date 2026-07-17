const ASIGNACION_COMUN = 188978;
const ASIGNACION_AYUDANTE_REPARTO = 196537;
const ASIGNACION_ESPECIAL = 207875;
const ASIGNACION_MEDIO_OFICIAL = 215434;
const ASIGNACION_CALIFICADO = 222994;
const ASIGNACION_LARGA_DISTANCIA = 230554;
const ASIGNACION_FOGUISTA = 238112;
const ASIGNACION_ENCARGADO = 245671;

const REFRIGERIO = 192779;
const sepelio = 15234;

const DIVISOR_JORNALERO = 200;

function calculoBaseJornal(valorHora, horasDelMes) {
  return valorHora * horasDelMes;
}
function diaDelJornal(valorHora) {
  return valorHora * 8;
}
function verificarHorasHabiles(mesSeleccionado) {
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const diaDeInicio = new Date(anioActual, Number(mesSeleccionado) + 1, 1);
  const diasDelMes = new Date(anioActual, Number(mesSeleccionado), 0).getDate();

  let diaHabil = 0;
  let diaNoHabil = 0;
  let diaSabdo = 0;

  for (let i = 1; i <= diasDelMes; i++) {
    diaDeInicio.setDate(i);

    let nombreDia = diaDeInicio.toLocaleString("es-AR", { weekday: "long" });

    if (nombreDia === "domingo") {
      diaNoHabil++;
    } else if (nombreDia === "sábado") {
      diaSabdo++;
    } else {
      diaHabil++;
    }
  }

  let horasSabado = diaSabdo * 4;
  let horasSemana = diaHabil * 8;

  let horasHabiles = horasSabado + horasSemana;

  return horasHabiles;
}
function validarNumeros(numeros) {
  const regexNumero = /^\d+$/;

  if (regexNumero.test(numeros)) {
    return `Solo numeros.`;
  }

  if (numeros.trim() === "") {
    return 0;
  }
}
function tituloSiNo(tieneTitulo, titulo) {
  const valorDelTitulo = tieneTitulo ? titulo : 0;

  return valorDelTitulo;
}
function valorHora(categoria, divisorJornalero) {
  return categoria / divisorJornalero;
}
function valorHoraConItemsPext(categoria, divisorJornalero, antiguedad) {
  return (categoria + antiguedad) / divisorJornalero;
}
function horasExtra50(valorHoraCitems) {
  return valorHoraCitems * 1.5;
}
function horasExtra100(valorHoraCitems) {
  return valorHoraCitems * 2;
}
function valorDiaEfectivo(basico) {
  return basico / 25;
}
function calcularSuspensionEfectivo(diasSuspension, valorDiaSuspension) {
  return diasSuspension * valorDiaSuspension;
}
function calcularSuspensionJornal(diasSuspension, valorDiaJornal) {
  return diasSuspension * valorDiaJornal;
}
function calculoHorasMes(horasInput, valorHoras) {
  return Number(horasInput) * Number(valorHoras);
}
function asignacionNoRem(nombreCategoria) {
  switch (nombreCategoria) {
    case "Op. Común":
      return ASIGNACION_COMUN;
    case "Ayudante de Reparto":
      return ASIGNACION_AYUDANTE_REPARTO;
    case "Op. Especializado":
      return ASIGNACION_ESPECIAL;
    case "1/2 oficial":
      return ASIGNACION_MEDIO_OFICIAL;
    case "Calificado/Clarkista":
      return ASIGNACION_CALIFICADO;
    case "Larga distancia/Tonelero":
      return ASIGNACION_LARGA_DISTANCIA;
    case "Oficiales. Mecanicos tetrabrick. Foguistas. Destiladores":
      return ASIGNACION_FOGUISTA;
    case "Oficiales toneleros vasija grande. Encargados de sección":
      return ASIGNACION_ENCARGADO;
    default:
      return console.log("Error en asignacionNoRem");
  }
}
function calculoPresCompleto(basicoComun) {
  return basicoComun * 0.1;
}
function calculoPresPerfecto(basicoComun) {
  return basicoComun * 0.05;
}
function calcularAntiguedad(categoria) {
  return categoria * 0.01;
}
function sumaHaberes(
  radioMes,
  categoria,
  antiguedad,
  titulo,
  presentPerfec,
  presentComplet,
  horasEx50,
  horasEx100,
) {
  if (radioMes) {
    return (
      categoria +
      antiguedad +
      titulo +
      presentPerfec +
      presentComplet +
      horasEx50 +
      horasEx100
    );
  } else {
    return categoria + antiguedad + titulo + horasEx50 + horasEx100;
  }
}
function totalNeto(
  totalHaberes,
  descuentos,
  anticipo,
  refrigerio,
  noRemunerativo,
  dineroEnNegro,
) {
  return (
    totalHaberes -
    descuentos -
    anticipo +
    refrigerio +
    noRemunerativo +
    dineroEnNegro
  );
}
function jubilacion(sueldoBruto) {
  return sueldoBruto * 0.11;
}
function ley19032(sueldoBruto) {
  return sueldoBruto * 0.03;
}
function sindicato(sueldoBruto) {
  return sueldoBruto * 0.02;
}
function obraSocial(sueldoBruto) {
  return sueldoBruto * 0.03;
}
function totalDescuentos(
  sepelio,
  descuentoJubilacion,
  descuentoLey19032,
  descuentoSindicato,
  OBRA_SOCIAL,
  suspensiones,
) {
  return (
    sepelio +
    descuentoJubilacion +
    descuentoLey19032 +
    descuentoSindicato +
    OBRA_SOCIAL +
    suspensiones
  );
}
function sueldoFinal(totalSuma, totalDescuentos) {
  return totalSuma - totalDescuentos;
}

// -------------Indemnizacion-------------------------------------------------

//Dias totales del año de despido.
function anioDiasTotales(fechaFin) {
  const parteFecha = fechaFin.split("-");
  const anio = Number(parteFecha[0]);
  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const fechaInicioAnio = new Date(anio, 0, 1);

  const diasDelAnio =
    Math.floor(
      (new Date(anio, 11, 31) - fechaInicioAnio) / milisegundosPorDia,
    ) + 1;

  return diasDelAnio;
}

//Dias totales del mes de despido.
function diasDelUltimoMes(fechaFin) {
  const parteFecha = fechaFin.split("-");
  const anio = Number(parteFecha[0]);
  const mes = Number(parteFecha[1]);

  const fechaInicioMes = new Date(anio, mes - 1, 1);
  const fechaFinMes = new Date(anio, mes, 0);

  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const milisegundosDelMes = fechaFinMes - fechaInicioMes;
  const diasDelMes = milisegundosDelMes / milisegundosPorDia;

  return diasDelMes;
}

//Liquidacion por antiguedad.
function calcularAntiguedadIndem(años, mejorSueldo) {
  return años * mejorSueldo;
}

//Dias trabajados por el operario.
function diasTrabajadosTotales(fechaInicio, fechaFin) {
  const fechaIngreso = new Date(fechaInicio);
  const fechaEgreso = new Date(fechaFin);

  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const milisegundosTrabajados = fechaEgreso - fechaIngreso;
  const diasTrabajados =
    Math.floor(milisegundosTrabajados / milisegundosPorDia) + 1;

  return diasTrabajados;
}

//Meses trabajados.
function calcularMes(fechaInicio, fechaFin) {
  const fechaIngreso = fechaInicio.split("-");
  const fechaEgreso = fechaFin.split("-");

  const anioIngreso = Number(fechaIngreso[0]);
  const mesIngreso = Number(fechaIngreso[1]);
  const anioEgreso = Number(fechaEgreso[0]);
  const mesEgreso = Number(fechaEgreso[1]);

  const mesesTotales =
    (anioEgreso - anioIngreso) * 12 + (mesEgreso - mesIngreso);

  return mesesTotales;
}

//Años proporcionales. si años >= 3 meses cuenta un año mas.
function calcularAños(diasTrabajados) {
  const años = Math.floor(diasTrabajados / 365);

  if (diasTrabajados % 365 >= 90) {
    return años + 1;
  } else {
    return años;
  }
}

//Dias trabajados el ultimo mes.
function diasUltMes(fechaFin) {
  const parteFecha = fechaFin.split("-");
  const anio = Number(parteFecha[0]);
  const mes = Number(parteFecha[1]) - 1;
  const dia = Number(parteFecha[2]);

  const fechaInicioMes = new Date(anio, mes, 1);
  const fechaEgreso = new Date(anio, mes, dia);

  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const milisegundosTrabajados = fechaEgreso - fechaInicioMes;
  const diasTrabajados = milisegundosTrabajados / milisegundosPorDia;

  return diasTrabajados;
}

//para saber cuanto le corresponde por el ultimo mes trabajado.
function valorUltimoMes(diasTrabajadosUltMes, valorHora) {
  return diasTrabajadosUltMes * 8 * valorHora;
}

//Dias trabajados el ultimo añó.
function diasTrabajadosUltAnio(fechaFin) {
  const parteFecha = fechaFin.split("-");
  const anio = Number(parteFecha[0]);
  const mes = Number(parteFecha[1]) - 1;
  const dia = Number(parteFecha[2]);

  //milisegundos desde el 1 de enero de 1970 hasta el 1 de enero del año de egreso.
  const fechaInicioAnio = new Date(anio, 0, 1);
  //milisegundos desde el 1 de enero de 1970 hasta la fecha de egreso.
  const fechaEgreso = new Date(anio, mes, dia);

  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const milisegundosTrabajados = fechaEgreso - fechaInicioAnio;
  const diasTrabajados = milisegundosTrabajados / milisegundosPorDia + 1;

  return diasTrabajados;
}

function vacacionesSegunAntiguedad(antiguedad) {
  if (antiguedad < 5) {
    return 14;
  } else if (antiguedad >= 5 && antiguedad < 10) {
    return 21;
  } else if (antiguedad >= 10 && antiguedad < 20) {
    return 28;
  } else {
    return 35;
  }
}

//Pago de aguinaldo en base a los meses trabajados en el semestre.
function calcularAguinaldoProporcional(fechaFin, mejorSueldo) {
  const parteFecha = fechaFin.split("-");
  const anio = Number(parteFecha[0]);
  const mes = Number(parteFecha[1]) - 1;
  const dia = Number(parteFecha[2]);

  //milisegundos desde el 1 de enero de 1970 hasta la fecha de egreso.
  const fechaEgreso = new Date(anio, mes, dia);

  const esPrimerSemestre = mes < 6;

  //1 de enero o 30 de junio.
  const fechaInicioSemestre = esPrimerSemestre
    ? new Date(anio, 0, 1)
    : new Date(anio, 6, 1); //Se restó 1 para llegar al 30 de junio.

  //30 de junio o 31 de diciembre
  const fechaFinSemestre = esPrimerSemestre
    ? new Date(anio, 5, 30)
    : new Date(anio, 11, 31);

  const milisegundosPorDia = 1000 * 60 * 60 * 24;

  //Sumamos 1 porque el día que lo despiden también se considera trabajado.
  const diasTrabajados =
    Math.floor((fechaEgreso - fechaInicioSemestre) / milisegundosPorDia) + 1;
  const diasTotalesSemestre =
    Math.floor((fechaFinSemestre - fechaInicioSemestre) / milisegundosPorDia) +
    1;

  const aguinaldoPorSemestre = mejorSueldo / 2;
  const proporcionalAguinaldo =
    (diasTrabajados / diasTotalesSemestre) * aguinaldoPorSemestre;

  return proporcionalAguinaldo;
}

//Pago de vacaciones segun los dias trabajados el ultimo año.
function vacacionesProporcionales(
  diasSegAntiguedad,
  mayorSueldo,
  diasTrabajadosDelAnio,
  diasDelAnio,
) {
  const valorDiaVacaciones = mayorSueldo / 25;
  const vacacionesCorrespondientes =
    (diasTrabajadosDelAnio * diasSegAntiguedad) / diasDelAnio;

  return vacacionesCorrespondientes * valorDiaVacaciones;
}

function vacacionesSAC(vacacionesProporcionales) {
  return vacacionesProporcionales / 12;
}

//Si le deben vacaciones de años anteriores.
function vacacionesAdeudadas(diasQueLeDeben, mayorSueldo) {
  const valorDiaVacaciones = mayorSueldo / 25;
  return diasQueLeDeben * valorDiaVacaciones;
}

function vacacionesAdeudadasSAC(deudaVacaciones) {
  return deudaVacaciones / 12;
}

// 1. Menos de 3 meses (Período de prueba)
// 2. Si ya pasó los 90 días, verificamos si tiene 5 años o menos.
// 3. Si no es menor a 90 días ni menor a 5 años, por descarte tiene más de 5 años
function preAvisoCalculo(diasTrabajados, mayorSueldo, antiguedad) {
  if (diasTrabajados < 90) {
    return mayorSueldo / 2;
  } else if (antiguedad <= 5) {
    return mayorSueldo;
  } else {
    return mayorSueldo * 2;
  }
}

function SACsobrePreaviso(mayorSueldo) {
  return mayorSueldo / 12;
}

function IntegracionMesDespido(diasUltMes, mayorSueldo, diasDelMes = 30) {
  const diasNoTrabajados = diasDelMes - diasUltMes;

  const valorDiaNormal = mayorSueldo / diasDelMes;

  return diasNoTrabajados * valorDiaNormal;
}
function integracionMesDespidoSAC(integracionMesDespido) {
  return integracionMesDespido / 12;
}

function totalSinCausayCP(
  vacacionesPropo,
  SACvacaciones,
  SACaguinaldo,
  liquidxAños,
  intMesDespido,
  intMesDespidoSAC,
  preaviso,
  preavisoSAC,
  preAviso,
  vacacionesDeuda,
  vacacionesDeudaSAC,
) {
  if (!preAviso) {
    return (
      vacacionesPropo +
      SACvacaciones +
      SACaguinaldo +
      liquidxAños +
      intMesDespido +
      intMesDespidoSAC +
      preaviso +
      preavisoSAC +
      vacacionesDeuda +
      vacacionesDeudaSAC
    );
  } else {
    return (
      vacacionesPropo +
      SACvacaciones +
      SACaguinaldo +
      liquidxAños +
      intMesDespido +
      intMesDespidoSAC +
      vacacionesDeuda +
      vacacionesDeudaSAC
    );
  }
}

function totalConCausaOrenuncia(
  diasTrabajadosDelMes,
  SACsemestre,
  vacacionesNoGozadas,
  SACvacacionesNoGozadas,
  vacacionesDeudaNumero,
  vacacionesDeudaSAC,
) {
  return (
    diasTrabajadosDelMes +
    SACsemestre +
    vacacionesNoGozadas +
    SACvacacionesNoGozadas +
    vacacionesDeudaNumero +
    vacacionesDeudaSAC
  );
}

//---------------------Dolar-------------------------------------------------

async function cotizacionDolar() {
  try {
    const respuesta = await fetch("https://dolarapi.com/v1/dolares/blue");
    const datos = await respuesta.json();

    return datos.venta;
  } catch (error) {
    console.error("Error al obtener la cotización del dólar:", error);
    return null;
  }
}

function convertirPesosADolares(montoEnPesos, cotizacionDolar) {
  if (cotizacionDolar) {
    return montoEnPesos / cotizacionDolar;
  } else {
    return null;
  }
}

async function cotizacionReal() {
  try {
    const respuesta = await fetch("https://dolarapi.com/v1/cotizaciones/brl");
    const datos = await respuesta.json();

    return datos.venta;
  } catch (error) {
    console.error("Error al obtener la cotización del real:", error);
    return null;
  }
}

function convertirPesosAReales(montoEnPesos, cotizacionReal) {
  if (cotizacionReal) {
    return montoEnPesos / cotizacionReal;
  } else {
    return null;
  }
}

async function cotizacionChileno() {
  try {
    const respuesta = await fetch("https://dolarapi.com/v1/cotizaciones/clp");
    const datos = await respuesta.json();

    return datos.venta;
  } catch (error) {
    console.error("Error al obtener la cotización del peso chileno:", error);
    return null;
  }
}

function convertirAchilenos(montoEnPesos, cotizacionChileno) {
  if (cotizacionChileno) {
    return montoEnPesos / cotizacionChileno;
  } else {
    return null;
  }
}
