//---------------------------------------viña----------------------------------------------
//valores globales para viña
//checkbox de trabajo insalubre.

//mensajes eque aparecen en la impresion mostrando en los resulatdos la antiguedad ya seleccionada.
export const MENSAJES_ANTIGUEDAD_VINA = {
  0: "0 a 3 años",
  1: "3 a 6 años",
  2: "6 a 9 años",
  3: "9 a 12 años",
  4: "12 a 15 años",
  5: "15 a 18 años",
  6: "18 a 21 años",
  7: "21 a 24 años",
  8: "24 a 27 años",
  9: "27 a 30 años",
  10: "mas de 30 años",
};

// suma mensual no remunerativa
export const ASIGNACION_VINA = 204949;
// valor mensual por refrigerio
export const REFRIGERIO_VIÑA = 163389;
// Subsidio de Sepelio: 40% de un Jornal del obrero Común
export const SEPELIO_VIÑA = 13512;

//se obtiene el % de la antiguedad por categoria.
export function antiguedadViña(basico) {
  return basico * 0.025;
}
export function valorDiaViña(basico, antiguedadViña) {
  return (basico + antiguedadViña) / 25;
}
//funcion para calcular el valor de la hora segun si es insalubre o no. pero decidi no utilizarlo por ahora para poner en funcionamiento ya.
// export function valorHoraViña(valorDiaViña, insalubre) {
//   if (insalubre === true) {
//     return valorDiaViña / 6;
//   } else {
//     return valorDiaViña / 8;
//   }
// }
export function valorHoraViña(valorDiaViña) {
  return valorDiaViña / 8;
}

//El Encargado percibirá el 30% sobre el sueldo establecido para el Obrero Común (Art.32)
function valorEncargado(valorObComun) {
  return valorObComun * 0.3;
}
// El Capataz percibirá el 35% sobre el sueldo establecido para el Obrero Común (Art. 32)
function valorCapataz(valorObComun) {
  return valorObComun * 0.35;
}
//suma de los haberes percibidos
export function sumaHaberesViña(
  basico,
  antiguedadViñacorrespondiente,
  presentismo,
  horasAl50,
  horasAl100,
) {
  return (
    basico +
    antiguedadViñacorrespondiente +
    presentismo +
    horasAl50 +
    horasAl100
  );
}

//-----------------------------------------bodega--------------------------------------
// valores globales para bodega
// asignacion no remunerativa
const ASIGNACION_COMUN = 195781;
const ASIGNACION_AYUDANTE_REPARTO = 203612;
const ASIGNACION_ESPECIAL = 215359;
const ASIGNACION_MEDIO_OFICIAL = 223190;
const ASIGNACION_CALIFICADO = 231022;
const ASIGNACION_LARGA_DISTANCIA = 238853;
const ASIGNACION_FOGUISTA = 246684;
const ASIGNACION_ENCARGADO = 254515;

export const REFRIGERIO = 199719;
export const sepelio = 15783;

export const DIVISOR_JORNALERO = 200;

export function calculoBaseJornal(valorHora, horasDelMes) {
  return valorHora * horasDelMes;
}
export function diaDelJornal(valorHora) {
  return valorHora * 8;
}
//funcion para saber cuantas horas habiles tiene el mes seleccionado.
export function verificarHorasHabiles(mesSeleccionado) {
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const diaDeInicio = new Date(anioActual, Number(mesSeleccionado) - 1, 1);
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

  return Math.floor(horasHabiles);
}
//regex para validar que solo se ingresen numeros en los input.
function validarNumeros(numeros) {
  const regexNumero = /^\d+$/;

  if (regexNumero.test(numeros)) {
    return `Solo numeros.`;
  }

  if (numeros.trim() === "") {
    return 0;
  }
}
export function tituloSiNo(tieneTitulo, titulo) {
  const valorDelTitulo = tieneTitulo ? titulo : 0;

  return valorDelTitulo;
}
export function valorHora(categoria, divisorJornalero) {
  return categoria / divisorJornalero;
}
export function valorHoraConItemsPext(categoria, divisorJornalero, antiguedad) {
  return (categoria + antiguedad) / divisorJornalero;
}
export function horasExtra50(valorHoraCitems) {
  return valorHoraCitems * 1.5;
}
export function horasExtra100(valorHoraCitems) {
  return valorHoraCitems * 2;
}
export function valorDiaEfectivo(basico) {
  return basico / 25;
}
export function calcularSuspensionEfectivo(diasSuspension, valorDiaSuspension) {
  return diasSuspension * valorDiaSuspension;
}
export function calcularSuspensionJornal(diasSuspension, valorDiaJornal) {
  return diasSuspension * valorDiaJornal;
}
function calculoHorasMes(horasInput, valorHoras) {
  return Number(horasInput) * Number(valorHoras);
}
export function asignacionNoRem(nombreCategoria) {
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
    case "Mecanico/ tetrabrick/ Foguista/ Oficial/ Destilador":
      return ASIGNACION_FOGUISTA;
    case "Oficiales toneleros vasija grande. Encargados de sección":
      return ASIGNACION_ENCARGADO;
    default:
      return console.log("Error en asignacionNoRem");
  }
}
export function calculoPresCompleto(basicoComun) {
  return basicoComun * 0.1;
}
// Tambien sirve para viña
export function calculoPresPerfecto(basicoComun) {
  return basicoComun * 0.05;
}
export function calcularAntiguedad(categoria, PORCENTAJE_ANTIGUEDAD) {
  return categoria * PORCENTAJE_ANTIGUEDAD;
}
export function sumaHaberes(
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
export function totalNeto(
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
export function jubilacion(sueldoBruto) {
  return sueldoBruto * 0.11;
}
export function ley19032(sueldoBruto) {
  return sueldoBruto * 0.03;
}
export function sindicato(sueldoBruto) {
  return sueldoBruto * 0.02;
}
export function obraSocial(sueldoBruto) {
  return sueldoBruto * 0.03;
}
export function totalDescuentos(
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
export function sueldoFinal(totalSuma, totalDescuentos) {
  return totalSuma - totalDescuentos;
}

// -------------Indemnizacion-------------------------------------------------

//Dias totales del año de despido.
export function anioDiasTotales(fechaFin) {
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
export function diasDelUltimoMes(fechaFin) {
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
export function calcularAntiguedadIndem(años, mejorSueldo) {
  return años * mejorSueldo;
}

//Dias trabajados por el operario.
export function diasTrabajadosTotales(fechaInicio, fechaFin) {
  const fechaIngreso = new Date(fechaInicio);
  const fechaEgreso = new Date(fechaFin);

  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const milisegundosTrabajados = fechaEgreso - fechaIngreso;
  const diasTrabajados =
    Math.floor(milisegundosTrabajados / milisegundosPorDia) + 1;

  return diasTrabajados;
}

//Meses trabajados.
export function calcularMes(fechaInicio, fechaFin) {
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
export function calcularAños(diasTrabajados) {
  const años = Math.floor(diasTrabajados / 365);

  if (diasTrabajados % 365 >= 90) {
    return años + 1;
  } else {
    return años;
  }
}

//Dias trabajados el ultimo mes.
export function diasUltMes(fechaFin) {
  const parteFecha = fechaFin.split("-");
  const anio = Number(parteFecha[0]);
  const mes = Number(parteFecha[1]) - 1;
  const dia = Number(parteFecha[2]);

  const fechaInicioMes = new Date(anio, mes, 1);
  const fechaEgreso = new Date(anio, mes, dia);

  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const milisegundosTrabajados = fechaEgreso - fechaInicioMes;
  const diasTrabajados =
    Math.floor(milisegundosTrabajados / milisegundosPorDia) + 1;

  return diasTrabajados;
}

//para saber cuanto le corresponde por el ultimo mes trabajado.
export function valorUltimoMes(diasTrabajadosUltMes, valorHora) {
  return diasTrabajadosUltMes * 8 * valorHora;
}

//Dias trabajados el ultimo añó.
export function diasTrabajadosUltAnio(fechaFin) {
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

export function vacacionesSegunAntiguedad(antiguedad) {
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
export function calcularAguinaldoProporcional(fechaFin, mejorSueldo) {
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
export function vacacionesProporcionales(
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

export function vacacionesSAC(vacacionesProporcionales) {
  return vacacionesProporcionales / 12;
}

//Si le deben vacaciones de años anteriores.
export function vacacionesAdeudadas(diasQueLeDeben, mayorSueldo) {
  const valorDiaVacaciones = mayorSueldo / 25;
  return diasQueLeDeben * valorDiaVacaciones;
}

export function vacacionesAdeudadasSAC(deudaVacaciones) {
  return deudaVacaciones / 12;
}

// 1. Menos de 3 meses (Período de prueba)
// 2. Si ya pasó los 90 días, verificamos si tiene 5 años o menos.
// 3. Si no es menor a 90 días ni menor a 5 años, por descarte tiene más de 5 años
export function preAvisoCalculo(diasTrabajados, mayorSueldo, antiguedad) {
  if (diasTrabajados < 90) {
    return mayorSueldo / 2;
  } else if (antiguedad <= 5) {
    return mayorSueldo;
  } else {
    return mayorSueldo * 2;
  }
}

export function SACsobrePreaviso(mayorSueldo) {
  return mayorSueldo / 12;
}

export function IntegracionMesDespido(
  diasUltMes,
  mayorSueldo,
  diasDelMes = 30,
) {
  const diasNoTrabajados = diasDelMes - diasUltMes;

  const valorDiaNormal = mayorSueldo / diasDelMes;

  return diasNoTrabajados * valorDiaNormal;
}
export function integracionMesDespidoSAC(integracionMesDespido) {
  return integracionMesDespido / 12;
}

export function totalSinCausayCP(
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

export function totalConCausaOrenuncia(
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

//---------------------Conversion a dolar, real y chilenos-------------------------------------------------

export async function cotizacionDolar() {
  try {
    const respuesta = await fetch("https://dolarapi.com/v1/dolares/blue");
    const datos = await respuesta.json();

    return datos.venta;
  } catch (error) {
    console.error("Error al obtener la cotización del dólar:", error);
    return null;
  }
}

export function convertirPesosADolares(montoEnPesos, cotizacionDolar) {
  if (cotizacionDolar) {
    return montoEnPesos / cotizacionDolar;
  } else {
    return null;
  }
}

export async function cotizacionReal() {
  try {
    const respuesta = await fetch("https://dolarapi.com/v1/cotizaciones/brl");
    const datos = await respuesta.json();

    return datos.venta;
  } catch (error) {
    console.error("Error al obtener la cotización del real:", error);
    return null;
  }
}

export function convertirPesosAReales(montoEnPesos, cotizacionReal) {
  if (cotizacionReal) {
    return montoEnPesos / cotizacionReal;
  } else {
    return null;
  }
}

export async function cotizacionChileno() {
  try {
    const respuesta = await fetch("https://dolarapi.com/v1/cotizaciones/clp");
    const datos = await respuesta.json();

    return datos.venta;
  } catch (error) {
    console.error("Error al obtener la cotización del peso chileno:", error);
    return null;
  }
}

export function convertirAchilenos(montoEnPesos, cotizacionChileno) {
  if (cotizacionChileno) {
    return montoEnPesos / cotizacionChileno;
  } else {
    return null;
  }
}
