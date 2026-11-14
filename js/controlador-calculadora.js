import { montarNavegacionInferior } from "./navegacion-compartida.js";
import { registrarDescargaPDF } from "./pdf-compartido.js";
import {
  calculoBaseJornal,
  diaDelJornal,
  tituloSiNo,
  calcularAntiguedad,
  valorHora,
  DIVISOR_JORNALERO,
  valorHoraConItemsPext,
  horasExtra50,
  horasExtra100,
  valorDiaEfectivo,
  calcularSuspensionEfectivo,
  asignacionNoRem,
  calculoPresPerfecto,
  calculoPresCompleto,
  verificarHorasHabiles,
  calcularSuspensionJornal,
  sumaHaberes,
  jubilacion,
  ley19032,
  sindicato,
  sepelio,
  obraSocial,
  REFRIGERIO,
  totalDescuentos,
  totalNeto,
  cotizacionDolar,
  convertirPesosADolares,
  cotizacionReal,
  convertirPesosAReales,
  cotizacionChileno,
  convertirAchilenos,
  calcularIndemnizacionRapidaBodega,
} from "./modelo.js";

montarNavegacionInferior();

// boton del menu desplegable responsive-----------------------------------------------------------------
const botonMenu = document.getElementById("menu");
const navDesplega = document.getElementById("nav__links");

botonMenu.addEventListener("click", () => {
  navDesplega.classList.toggle("active");
});

// Variable global para saber si el operario es efectivo o temporario----------------------
let tipoDeOperario = "efectivo";

const opcionMesOp = document.getElementById("selectMes");
const btnTemporario = document.getElementById("temporario");
const btnEfectivo = document.getElementById("efectivo");

btnTemporario.addEventListener("click", () => {
  tipoDeOperario = "temporario";

  opcionMesOp.classList.add("visible");
  document.getElementById("temporario").classList.add("activo");
  document.getElementById("efectivo").classList.remove("activo");
});

btnEfectivo.addEventListener("click", () => {
  tipoDeOperario = "efectivo";

  opcionMesOp.classList.remove("visible");
  document.getElementById("efectivo").classList.add("activo");
  document.getElementById("temporario").classList.remove("activo");
});

function capturaValores() {
  const numeroMes = Number(document.getElementById("opcionesMes").value);
  const elementCategoria = document.getElementById("opcionesCat");
  const selectCategoria = Number(document.getElementById("opcionesCat").value);
  const valorTitulo = Number(document.getElementById("tituloSec1").value || 0);
  const tieneTituloSi = document.getElementById("tituloSec1").checked;
  const tieneTituloNo = document.getElementById("tituloSec2").checked;
  const inpHoras50 = Number(document.getElementById("horasEx50").value);
  const inpHoras100 = Number(document.getElementById("horasEx100").value);
  const diasSuspension = Number(
    document.getElementById("dias-suspencion").value || 0,
  );
  const selectAntiguedad = Number(document.getElementById("opcionesAnt").value);
  const inpAnticipo = Number(document.getElementById("anticipo").value || 0);
  const dineroEnNegro = Number(document.getElementById("enNegro").value || 0);

  return {
    numeroMes,
    elementCategoria,
    selectCategoria,
    valorTitulo,
    tieneTituloSi,
    tieneTituloNo,
    inpHoras50,
    inpHoras100,
    diasSuspension,
    selectAntiguedad,
    inpAnticipo,
    dineroEnNegro,
  };
}

//Se va a obviar para solo se vera reflejado la diferencia en cuanto a presentismos.
// function mostrarInputMes() {
//   const radioMesCompleto = document.getElementById("mesCompleto2").checked;
//   const divMesHoras = document.getElementById("horasLabel");
//   const inpHorasTrabajadas = Number(
//     document.getElementById("horasTrab").value || 0,
//   );

//   if (!radioMesCompleto) {
//     divMesHoras.style.display = "none";
//     return 0;
//   } else {
//     divMesHoras.style.display = "block";
//     return inpHorasTrabajadas;
//   }
// }

// variable global para usarlo en ambos controladores (calculadora e indemnización)
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

//se exporta para usar algunas variables o funciones para el caluculo en viña.
async function controladorPrincipal() {
  const {
    numeroMes,
    elementCategoria,
    selectCategoria,
    valorTitulo,
    tieneTituloSi,
    tieneTituloNo,
    inpHoras50,
    inpHoras100,
    diasSuspension,
    selectAntiguedad,
    inpAnticipo,
    dineroEnNegro,
  } = capturaValores();

  const nombreCategoria =
    elementCategoria.options[elementCategoria.selectedIndex].text;
  const basicoComun = Number(elementCategoria.options[0].value);

  const secundarioCompleto = tituloSiNo(tieneTituloSi, valorTitulo);

  //0.01 es el porcentaje de antiguedad que se le suma al basico comun por cada año de antiguedad.
  const antiguedadCalculo = calcularAntiguedad(selectCategoria, 0.01);
  const antiguedad = antiguedadCalculo * selectAntiguedad;
  console.log(
    "Antiguedad calculada: ",
    antiguedadCalculo,
    " * ",
    selectAntiguedad,
    " = ",
    antiguedad,
  );

  const precioHora = valorHora(selectCategoria, DIVISOR_JORNALERO);
  //valor de la hora con antiguedad agregada por recibo de balbo.
  const precioHoraConItems = valorHoraConItemsPext(
    selectCategoria,
    DIVISOR_JORNALERO,
    antiguedad,
  );

  const horasAl50 = horasExtra50(precioHoraConItems);
  const valorHoraAl50 = horasAl50 * inpHoras50;
  const horasAl100 = horasExtra100(precioHoraConItems);
  const valorHoraAl100 = horasAl100 * inpHoras100;

  const valorDiaSuspension = valorDiaEfectivo(selectCategoria);
  const suspenciones = calcularSuspensionEfectivo(
    diasSuspension,
    valorDiaSuspension,
  );

  const noRemunerativo = asignacionNoRem(nombreCategoria);

  //no sera variable constante por si hay suspensiones.
  let presentismoPerfecto = calculoPresPerfecto(basicoComun);
  let presentismoCompleto = calculoPresCompleto(basicoComun);
  if (suspenciones > 0) {
    presentismoPerfecto = 0;
    presentismoCompleto = 0;
  }

  const radioMesCompleto = document.getElementById("mesCompleto1").checked;

  const totalHaberes = sumaHaberes(
    radioMesCompleto,
    selectCategoria,
    antiguedad,
    secundarioCompleto,
    presentismoPerfecto,
    presentismoCompleto,
    valorHoraAl50,
    valorHoraAl100,
  );

  const descuentoJubilacion = jubilacion(totalHaberes);
  const descuentoLey19032 = ley19032(totalHaberes);
  const descuentoSindicato = sindicato(totalHaberes);
  const obraSocialDesc = obraSocial(totalHaberes);
  const anticipo = inpAnticipo;

  const descuentos = totalDescuentos(
    sepelio,
    descuentoJubilacion,
    descuentoLey19032,
    descuentoSindicato,
    obraSocialDesc,
    suspenciones,
  );

  const totalFinal = totalNeto(
    totalHaberes,
    descuentos,
    anticipo,
    REFRIGERIO,
    noRemunerativo,
    dineroEnNegro,
  );

  const dolarVenta = await cotizacionDolar();
  const totalEnDolares = convertirPesosADolares(totalFinal, dolarVenta);

  const realVenta = await cotizacionReal();
  const totalEnReales = convertirPesosAReales(totalFinal, realVenta);

  const chilenoVenta = await cotizacionChileno();
  const totalEnChilenos = convertirAchilenos(totalFinal, chilenoVenta);

  let resultadosTemporario = {};

  if (tipoDeOperario === "temporario") {
    // Si el operario es temporario, el básico se calcula en base a las horas trabajadas, sino, se toma el valor de la categoría.
    // const mesHorasInput = mostrarInputMes();
    // const horasValor = calculoHorasMes(mesHorasInput, precioHora);
    //queda comentado por que no se va a pedir el input de horas trabajadas.

    const horasHabilesDelMes = verificarHorasHabiles(numeroMes);
    const baseJornal = calculoBaseJornal(precioHora, horasHabilesDelMes);
    const valorDia = diaDelJornal(precioHora);

    const SuspensionJornal = calcularSuspensionJornal(diasSuspension, valorDia);

    const haberesTemporario = sumaHaberes(
      radioMesCompleto,
      baseJornal,
      antiguedad,
      secundarioCompleto,
      presentismoPerfecto,
      presentismoCompleto,
      valorHoraAl50,
      valorHoraAl100,
    );
    const jubilacionTemp = jubilacion(haberesTemporario);
    const ley19032Temp = ley19032(haberesTemporario);
    const sindicatoTemp = sindicato(haberesTemporario);
    const obraSocialTemp = obraSocial(haberesTemporario);
    const descuentosTemp = totalDescuentos(
      sepelio,
      jubilacionTemp,
      ley19032Temp,
      sindicatoTemp,
      obraSocialTemp,
      SuspensionJornal,
    );
    const totalFinalTemp = totalNeto(
      haberesTemporario,
      descuentosTemp,
      anticipo,
      REFRIGERIO,
      noRemunerativo,
      dineroEnNegro,
    );

    resultadosTemporario = {
      horasHabilesDelMes,
      baseJornal,
      valorDia,
      SuspensionJornal,
      haberesTemporario,
      jubilacionTemp,
      ley19032Temp,
      sindicatoTemp,
      obraSocialTemp,
      descuentosTemp,
      totalFinalTemp,
    };
  }

  return {
    tipoDeOperario,
    numeroMes,
    nombreCategoria,
    basicoComun,
    selectCategoria,
    valorTitulo,
    tieneTituloSi,
    tieneTituloNo,
    inpHoras50,
    inpHoras100,
    diasSuspension,
    selectAntiguedad,
    inpAnticipo,
    dineroEnNegro,
    secundarioCompleto,
    antiguedadCalculo,
    antiguedad,
    precioHora,
    precioHoraConItems,
    horasAl50,
    valorHoraAl50,
    horasAl100,
    valorHoraAl100,
    valorDiaSuspension,
    suspenciones,
    noRemunerativo,
    presentismoPerfecto,
    presentismoCompleto,
    radioMesCompleto,
    totalHaberes,
    descuentoJubilacion,
    descuentoLey19032,
    descuentoSindicato,
    obraSocialDesc,
    anticipo,
    descuentos,
    REFRIGERIO,
    sepelio,
    totalFinal,
    dolarVenta,
    totalEnDolares,
    realVenta,
    totalEnReales,
    chilenoVenta,
    totalEnChilenos,
    ...resultadosTemporario,
  };
}

function imprimirResultado(resultado) {
  const divResultado = document.getElementById("resultado");
  const {
    tipoDeOperario,
    selectCategoria,
    baseJornal,
    antiguedad,
    valorHoraAl50,
    valorHoraAl100,
    diasSuspension,
    SuspensionJornal,
    suspenciones,
    secundarioCompleto,
    radioMesCompleto,
    presentismoPerfecto,
    presentismoCompleto,
    noRemunerativo,
    REFRIGERIO,
    dineroEnNegro,
    jubilacionTemp,
    ley19032Temp,
    sindicatoTemp,
    obraSocialTemp,
    descuentoJubilacion,
    descuentoLey19032,
    obraSocialDesc,
    descuentoSindicato,
    sepelio,
    inpAnticipo,
    totalFinalTemp,
    totalFinal,
    totalEnDolares,
    totalEnReales,
    totalEnChilenos,
  } = resultado;

  if (tipoDeOperario === "temporario") {
    divResultado.innerHTML = `
<div id="divPDF">

  <h4 class="h4-titulo-arriba" >Haberes Remunerativos</h4>

    <div class="resultado1">
        <span> Basico: </span>
        <span> $${baseJornal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
    </div>

    <div class="resultado1"> 
        <span> Antiguedad: </span>
        <span> $${antiguedad.toLocaleString("es-AR")} </span>
    </div>

    <div class="resultado1"> 
        <span> Horas Extra al 50%: </span>
        <span> $${valorHoraAl50.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1"> 
        <span> Horas Extra al 100%: </span>
        <span> $${valorHoraAl100.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1">
        <span> Suspencion: (${diasSuspension}) dias</span>
        <span> $${SuspensionJornal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div>

    <div class="resultado1">
        <span> Titulo Secundario: </span>
        <span> $${secundarioCompleto.toLocaleString("es-AR")} </span>
    </div> 

    ${
      radioMesCompleto
        ? `<div class="resultado1"> 
        <span> Presentismo Perf.: </span>
        <span> $${presentismoPerfecto.toLocaleString("es-AR")} </span>
    </div> 

    <div class="resultado1">  
        <span> Presentismo Comp.: </span>
        <span> $${presentismoCompleto.toLocaleString("es-AR")} </span>
    </div>`
        : ""
    }

    <h4 class="h4-enMedio">Haberes No Remunerativos</h4>

    <div class="resultado1"> 
        <span> No Remunerativo: </span>
        <span> $${noRemunerativo.toLocaleString("es-AR")} </span>
    </div> 

    <div class="resultado1"> 
        <span> Refrigerio: </span>
        <span> $${REFRIGERIO.toLocaleString("es-AR")} </span>
    </div> 

    <div class="resultado1">
        <span> Dinero en negro: </span>
        <span> $${dineroEnNegro.toLocaleString("es-AR")} </span>
    </div>

      <h4 class="h4-enMedio">Deducciones</h4>

    <div class="resultado1"> 
        <span> Jubilacion: </span>
        <span> $${jubilacionTemp.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1"> 
        <span> Ley 19032: </span>
        <span> $${ley19032Temp.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1"> 
        <span> Obra social: </span>
        <span> $${obraSocialTemp.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div>

    <div class="resultado1"> 
        <span> Sindicato: </span>
        <span> $${sindicatoTemp.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1"> 
        <span> Sepelio: </span>
        <span> $${sepelio.toLocaleString("es-AR")} </span>
    </div>

    <div class="resultado1"> 
        <span> Anticipo: </span>
        <span> $${inpAnticipo.toLocaleString("es-AR")} </span>
    </div> 

  <div class="resultado1">
<h4 class="h4-total">Total Neto</h4>
</div>  

    <div class="resultadoFinal">
      <div class="resultEnMonedaFinal moneda-pesos">
        <h4 class="h4-titulo-arriba">Total</h4>
        <span class="numeroPesos">$${totalFinalTemp.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>

      <div class="div-conversion">
        <div class="resultEnMonedas no-pdf numeroDolares">
          <span>${totalEnDolares.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
          <img class="bandera-conversion" src="assets/imagenes/bandera-eeuu.svg" alt="Bandera de Estados Unidos">
        </div>
        <div class="resultEnMonedas no-pdf numeroReal">
          <span>${totalEnReales.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
          <img class="bandera-conversion" src="assets/imagenes/bandera-brasil.svg" alt="Bandera de Brasil">
        </div>
        <div class="resultEnMonedas no-pdf numeroChileno">
          <span>${totalEnChilenos.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</span>
          <img class="bandera-conversion" src="assets/imagenes/bandera-chile.svg" alt="Bandera de Chile">
        </div>
      </div>
        <div class="sello-de-agua">
        <span class="sello-texto">SUELDOBODEGA.com.ar</span>
        </div>
    </div>
</div>
`;
  } else {
    divResultado.innerHTML = `
<div id="divPDF">

  <h4 class="h4-titulo-arriba" >Haberes Remunerativos</h4>

    <div class="resultado1">
        <span> Basico: </span>
        <span> $${selectCategoria.toLocaleString("es-AR")} </span> 
    </div> 

    <div class="resultado1"> 
        <span> Antiguedad: </span>
        <span> $${antiguedad.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1"> 
        <span> Horas Extra al 50%: </span>
        <span> $${valorHoraAl50.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1"> 
        <span> Horas Extra al 100%: </span>
        <span> $${valorHoraAl100.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1">
        <span> Suspencion: (${diasSuspension}) dias</span>
        <span> $${suspenciones.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div>

    <div class="resultado1">
        <span> Titulo Secundario: </span>
        <span> $${secundarioCompleto.toLocaleString("es-AR")} </span>
    </div> 
    ${
      radioMesCompleto
        ? `<div class="resultado1"> 
        <span> Presentismo Perf.: </span>
        <span> $${presentismoPerfecto.toLocaleString("es-AR")} </span>
    </div> 
    <div class="resultado1">  
        <span> Presentismo Comp.: </span>
        <span> $${presentismoCompleto.toLocaleString("es-AR")} </span>
    </div>`
        : ""
    }

    <h4 class="h4-enMedio">Haberes No Remunerativos</h4>

    <div class="resultado1"> 
        <span> No Remunerativo: </span>
        <span> $${noRemunerativo.toLocaleString("es-AR")} </span>
    </div> 

    <div class="resultado1"> 
        <span> Refrigerio: </span>
        <span> $${REFRIGERIO.toLocaleString("es-AR")} </span>
    </div> 

        <div class="resultado1">
        <span> Dinero en negro: </span>
        <span> $${dineroEnNegro.toLocaleString("es-AR")} </span>
    </div>

 <h4 class="h4-enMedio">Deducciones</h4>

    <div class="resultado1"> 
        <span> Jubilacion: </span>
        <span> $${descuentoJubilacion.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1"> 
        <span> Ley 19032: </span>
        <span> $${descuentoLey19032.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1"> 
        <span> Obra social: </span>
        <span> $${obraSocialDesc.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div>

    <div class="resultado1"> 
        <span> Sindicato: </span>
        <span> $${descuentoSindicato.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 

    <div class="resultado1"> 
        <span> Sepelio: </span>
        <span> $${sepelio.toLocaleString("es-AR")} </span>
    </div>

    <div class="resultado1"> 
        <span> Anticipo: </span>
        <span> $${inpAnticipo.toLocaleString("es-AR")} </span>
    </div> 
  
  <div class="resultado1">
</div>  

    <div class="resultadoFinal">
      <div class="resultEnMonedaFinal moneda-pesos">
        <h4 class="h4-titulo-arriba">Total</h4>
        <span class="numeroPesos">$${totalFinal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>

      <div class="div-conversion">
        <div class="resultEnMonedas no-pdf numeroDolares">
          <span>${totalEnDolares.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
          <img class="bandera-conversion" src="assets/imagenes/bandera-eeuu.svg" alt="Bandera de Estados Unidos">
        </div>
        <div class="resultEnMonedas no-pdf numeroReal">
          <span>${totalEnReales.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
          <img class="bandera-conversion" src="assets/imagenes/bandera-brasil.svg" alt="Bandera de Brasil">
        </div>
        <div class="resultEnMonedas no-pdf numeroChileno">
          <span>${totalEnChilenos.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</span>
          <img class="bandera-conversion" src="assets/imagenes/bandera-chile.svg" alt="Bandera de Chile">
        </div>
      </div>

    </div>
        <div class="sello-de-agua">
        <span class="sello-texto">SUELDOBODEGA.com.ar</span>
        </div>
</div>
    `;
  }
}

const seccionIndemnizacionRapida = document.getElementById(
  "indemnizacionRapida",
);
const formularioIndemnizacionRapida = document.getElementById(
  "formularioIndemnizacionRapida",
);
const fechaIngresoRapida = document.getElementById("fechaIngresoRapida");
const errorIndemnizacionRapida = document.getElementById(
  "errorIndemnizacionRapida",
);
const resultadoIndemnizacionRapida = document.getElementById(
  "resultadoIndemnizacionRapida",
);
let ultimoResultadoSalarial = null;
let calcularIndemnizacionSeleccionado = false;

function obtenerSueldoComputable(resultado) {
  if (resultado.tipoDeOperario === "temporario") {
    return (
      resultado.totalFinalTemp +
      resultado.descuentosTemp +
      resultado.anticipo -
      resultado.REFRIGERIO -
      resultado.noRemunerativo -
      resultado.dineroEnNegro
    );
  }

  return resultado.totalHaberes;
}

function fechaActualLocal() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function formatoMoneda(valor) {
  return `$${valor.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function limpiarResultadoIndemnizacionRapida() {
  errorIndemnizacionRapida.textContent = "";
  resultadoIndemnizacionRapida.hidden = true;
  resultadoIndemnizacionRapida.replaceChildren();
}

function actualizarIndemnizacionRapida() {
  limpiarResultadoIndemnizacionRapida();

  const fechaInicio = fechaIngresoRapida.value;
  if (!fechaInicio) {
    return;
  }

  const fechaFin = fechaActualLocal();
  if (fechaInicio > fechaFin) {
    errorIndemnizacionRapida.textContent =
      "La fecha de ingreso no puede ser posterior a la fecha actual.";
    return;
  }
  if (!fechaIngresoRapida.validity.valid) {
    errorIndemnizacionRapida.textContent =
      "Ingresá una fecha de ingreso válida.";
    return;
  }

  try {
    const mayorSueldo = obtenerSueldoComputable(ultimoResultadoSalarial);
    const calculo = calcularIndemnizacionRapidaBodega(
      mayorSueldo,
      fechaInicio,
      fechaFin,
    );

    resultadoIndemnizacionRapida.innerHTML = `
      <h4 class="h4-total">Total estimado</h4>
      <p class="resultadoFinal">${formatoMoneda(calculo.total)}</p>
      <details>
        <summary>Ver desglose de conceptos</summary>
        <div class="resultado1"><span>Indemnización por antigüedad:</span><span>${formatoMoneda(calculo.indemnizacionAntiguedad)}</span></div>
        <div class="resultado1"><span>Aguinaldo proporcional:</span><span>${formatoMoneda(calculo.SACaguinaldo)}</span></div>
        <div class="resultado1"><span>Vacaciones proporcionales:</span><span>${formatoMoneda(calculo.vacacionesProp)}</span></div>
        <div class="resultado1"><span>SAC de vacaciones:</span><span>${formatoMoneda(calculo.SACvacaciones)}</span></div>
        <div class="resultado1"><span>Integración del mes de despido:</span><span>${formatoMoneda(calculo.intMesDespido)}</span></div>
        <div class="resultado1"><span>SAC de integración:</span><span>${formatoMoneda(calculo.intMesDespidoSAC)}</span></div>
      </details>
      <small>Estimación orientativa basada en el sueldo actual. El importe puede diferir de la indemnización que corresponda según el historial salarial y las circunstancias de la relación laboral.</small>
      <p><a href="indemnizacion.html">Realizar un cálculo más detallado</a></p>
    `;
    resultadoIndemnizacionRapida.hidden = false;
  } catch (error) {
    console.error("No se pudo calcular la indemnización rápida:", error);
    errorIndemnizacionRapida.textContent =
      "No se pudo calcular la estimación. Revisá la fecha y volvé a intentar.";
  }
}

document
  .getElementById("calcularIndemnizacionSi")
  .addEventListener("click", () => {
    calcularIndemnizacionSeleccionado = true;
    formularioIndemnizacionRapida.hidden = false;
    fechaIngresoRapida.max = fechaActualLocal();
    fechaIngresoRapida.focus();
    actualizarIndemnizacionRapida();
  });

document
  .getElementById("calcularIndemnizacionNo")
  .addEventListener("click", () => {
    calcularIndemnizacionSeleccionado = false;
    formularioIndemnizacionRapida.hidden = true;
    seccionIndemnizacionRapida.hidden = true;
    limpiarResultadoIndemnizacionRapida();
  });

fechaIngresoRapida.addEventListener("input", actualizarIndemnizacionRapida);

//boton para calcular
const formulario = document.getElementById("formulario");
formulario.addEventListener("submit", async (event) => {
  event.preventDefault(); //asi no se recarga la pagina al presionar el boton.
  const resultado = await controladorPrincipal();
  imprimirResultado(resultado);
  ultimoResultadoSalarial = resultado;
  fechaIngresoRapida.max = fechaActualLocal();
  seccionIndemnizacionRapida.hidden = false;
  if (calcularIndemnizacionSeleccionado) {
    actualizarIndemnizacionRapida();
  }
});

registrarDescargaPDF();
