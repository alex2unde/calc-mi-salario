const ASIGNACION_COMUN = 173993; 
const ASIGNACION_ESPECIAL = 191392;
const ASIGNACION_CALIFICADO = 205312;
const ASIGNACION_FOGUISTA = 219792;
const ASIGNACION_ENCARGADO = 226191;

const REFRIGERIO = 177492;
const sepelio = 14026;

const DIVISOR_JORNALERO = 200;

function calculoBaseJornal (valorHora, horasDelMes) {

    return valorHora * horasDelMes;
}

function verificarHorasHabiles (mesSeleccionado){

    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const diaDeInicio = new Date(anioActual, Number(mesSeleccionado) + 1, 1);
    const diasDelMes = new Date(anioActual, Number(mesSeleccionado), 0).getDate();
    
    let diaHabil = 0;
    let diaNoHabil = 0;
    let diaSabdo = 0;

    for (let i = 1; i <= diasDelMes; i++) { 
        diaDeInicio.setDate(i);

        let nombreDia = diaDeInicio.toLocaleString('es-AR', { weekday: 'long' });
        
        if (nombreDia === "domingo") {
            diaNoHabil++;
        }    

        else if (nombreDia === "sábado") {
            diaSabdo++;
        }  
         else {
            diaHabil++;
        }
        }

        let horasSabado = diaSabdo * 4;
        let horasSemana = diaHabil * 8;

        let horasHabiles = horasSabado + horasSemana;
       
        return  horasHabiles;
}

function validarNumeros (numeros) {

const regexNumero = /^\d+$/;

if(regexNumero.test(numeros)){
    return `Solo numeros.`;
}

if (numeros.trim() === "") {
    return 0;
}
}

function tituloSiNo (tieneTitulo, titulo) {

    const valorDelTitulo = tieneTitulo ? titulo : 0;

    return valorDelTitulo;

}

function valorHora (categoria, divisorJornalero) {

    return categoria / divisorJornalero;
}

function horasExtra50 (valorHora) {

        return valorHora * 1.5;    
}

function horasExtra100 (valorHora) {

    return valorHora * 2;
}

function calculoHorasMes (horasInput, valorHoras) {

    return Number(horasInput) * Number(valorHoras);
}

function asignacionNoRem (nombreCategoria) {

switch (nombreCategoria) {
    case "Op. Común":
        return ASIGNACION_COMUN;
    case "Op. Especializado":
        return ASIGNACION_ESPECIAL;
    case "Op. Calificado":
        return ASIGNACION_CALIFICADO;
    case "Op. Foguista":
        return ASIGNACION_FOGUISTA;
    case "Encargado de sección":
        return ASIGNACION_ENCARGADO;
    default:
        return console.log("Error en asignacionNoRem");   
}
}

function calculoPresCompleto(basicoComun) {

    return basicoComun * 0.10;

}

function calculoPresPerfecto(basicoComun) {

    return basicoComun * 0.05;
    
}

function calcularAntiguedad (categoria) {

    return categoria * 0.01;
}

function sumaHaberes (radioMes ,categoria, antiguedad, titulo, presentPerfec, 
    presentComplet, horasEx50, horasEx100) {

        if (radioMes) {

       return  categoria + antiguedad  + titulo + presentPerfec +
        presentComplet + horasEx50 + horasEx100;

        }   else {

            return categoria + antiguedad + titulo +
             horasEx50 + horasEx100;
        }
    }

function totalNeto (totalHaberes, descuentos, anticipo, refrigerio, noRemunerativo) {

    return (totalHaberes - descuentos - anticipo) + refrigerio + noRemunerativo;

}

function jubilacion(sueldoBruto){

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

function totalDescuentos ( sepelio, descuentoJubilacion, 
    descuentoLey19032, descuentoSindicato, OBRA_SOCIAL) {

    return  sepelio + descuentoJubilacion
     + descuentoLey19032 + descuentoSindicato + OBRA_SOCIAL;

}

function sueldoFinal (totalSuma, totalDescuentos) {

    return totalSuma - totalDescuentos;
     
}

