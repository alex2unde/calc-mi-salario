let tipoDeOperario = "efectivo";

function opTemporario() {
  const opcionMesOp = document.getElementById("selectMes");
  tipoDeOperario = "temporario";

  opcionMesOp.style.display = "block";
  document.getElementById("temporario").classList.add("activo");
  document.getElementById("efectivo").classList.remove("activo");
}

function opEfectivo() {
  const opcionMesOp = document.getElementById("selectMes");
  tipoDeOperario = "efectivo";

  opcionMesOp.style.display = "none";
  document.getElementById("efectivo").classList.add("activo");
  document.getElementById("temporario").classList.remove("activo");
}

function capturaValores() {
  const numeroMes = Number(document.getElementById("opcionesMes").value);
  const elementCategoria = document.getElementById("opcionesCat");
  const selectCategoria = Number(document.getElementById("opcionesCat").value);
  const valorTitulo = Number(document.getElementById("tituloSec1").value || 0);
  const tieneTituloSi = document.getElementById("tituloSec1").checked;
  const tieneTituloNo = document.getElementById("tituloSec2").checked;
  const inpHoras50 = Number(document.getElementById("horasEx50").value);
  const inpHoras100 = Number(document.getElementById("horasEx100").value);
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

async function controladorPrincipal() {
  const divResultado = document.getElementById("resultado");

  const {
    numeroMes,
    elementCategoria,
    selectCategoria,
    valorTitulo,
    tieneTitulo,
    tieneTituloSi,
    inpHoras50,
    inpHoras100,
    selectAntiguedad,
    inpAnticipo,
    dineroEnNegro,
  } = capturaValores();

  const nombreCategoria =
    elementCategoria.options[elementCategoria.selectedIndex].text;
  const basicoComun = Number(elementCategoria.options[0].value);

  const secundarioCompleto = tituloSiNo(tieneTituloSi, valorTitulo);

  const precioHora = valorHora(selectCategoria, DIVISOR_JORNALERO);

  const horasAl50 = horasExtra50(precioHora);
  const valorHoraAl50 = horasAl50 * inpHoras50;
  const horasAl100 = horasExtra100(precioHora);
  const valorHoraAl100 = horasAl100 * inpHoras100;

  const noRemunerativo = asignacionNoRem(nombreCategoria);

  const antiguedadCalculo = calcularAntiguedad(selectCategoria);
  const antiguedad = antiguedadCalculo * selectAntiguedad;

  const presentismoPerfecto = calculoPresPerfecto(basicoComun);
  const presentismoCompleto = calculoPresCompleto(basicoComun);

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

  if (tipoDeOperario === "temporario") {
    // Si el operario es temporario, el básico se calcula en base a las horas trabajadas, sino se toma el valor de la categoría.
    // const mesHorasInput = mostrarInputMes();
    // const horasValor = calculoHorasMes(mesHorasInput, precioHora);
    //queda comentado por que no se va a pedir el input de horas trabajadas.

    const horasHabilesDelMes = verificarHorasHabiles(numeroMes);
    const baseJornal = calculoBaseJornal(precioHora, horasHabilesDelMes);

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
    );
    const totalFinalTemp = totalNeto(
      haberesTemporario,
      descuentosTemp,
      anticipo,
      REFRIGERIO,
      noRemunerativo,
      dineroEnNegro,
    );

    divResultado.innerHTML = `
<div id="divPDF">
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
    <hr>
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
    <hr>
    <div class="resultadoFinal"> 
        <span class="tituloTotal"> Total: </span>
        <div class="resultEnMonedas">
        <span class="tituloEnPesos"> En pesos: </span> <span class="numeroPesos"> $${totalFinalTemp.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
        </div>
        <div class="resultEnMonedas no-pdf">
        <span class="tituloEnDolares"> En dolares:  </span> <span class="numeroDolares"> $${totalEnDolares.toLocaleString("en-US", { style: "currency", currency: "USD" })} </span>
        </div>
        <div class="resultEnMonedas no-pdf">
        <span class="tituloEnReales"> En reales:  </span> <span class="numeroReal"> ${totalEnReales.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} </span>
        </div>
    </div>
</div>
`;
  } else {
    divResultado.innerHTML = `
<div id="divPDF">
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
    <hr>
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
    <hr>
    <div class="resultadoFinal"> 
        <span class="tituloTotal"> Total: </span>
        <div class="resultEnMonedas">
        <span class="tituloEnPesos"> En pesos:  </span> <span class="numeroPesos"> $${totalFinal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
        </div>
        <div class="resultEnMonedas no-pdf">
        <span class="tituloEnDolares"> En dolares:  </span> <span class="numeroDolares"> $${totalEnDolares.toLocaleString("en-US", { style: "currency", currency: "USD" })} </span>
        </div>
        <div class="resultEnMonedas no-pdf">
        <span class="tituloEnReales"> En reales:  </span> <span class="numeroReal"> ${totalEnReales.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} </span>
        </div>
    </div>
</div>
    `;
  }
}

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
