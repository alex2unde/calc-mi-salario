
function capturaValores() {

    const elementCategoria = document.getElementById("opcionesCat");
    const selectCategoria = Number(document.getElementById("opcionesCat").value);
    const valorTitulo = Number(document.getElementById("tituloSec1").value || 0);
    const tieneTituloSi = document.getElementById("tituloSec1").checked;
    const tieneTituloNo = document.getElementById("tituloSec2").checked;
    const inpHoras50 = Number(document.getElementById("horasEx50").value);
    const inpHoras100 = Number(document.getElementById("horasEx100").value);
    const selectAntiguedad = Number(document.getElementById("opcionesAnt").value);
    const inpAnticipo = Number(document.getElementById("anticipo").value || 0);

    return {
        elementCategoria, selectCategoria, valorTitulo, tieneTituloSi, tieneTituloNo, 
        inpHoras50, inpHoras100, selectAntiguedad, inpAnticipo };
}

function mostrarInputMes(){

    const radioMesCompleto = document.getElementById("mesCompleto2").checked;
    const divMesHoras = document.getElementById("horasLabel");
    const inpHorasTrabajadas = Number(document.getElementById("horasTrab").value);

if (!radioMesCompleto) {
    divMesHoras.style.display = "none";
    return null;
}   else {
    divMesHoras.style.display = "block";
    return inpHorasTrabajadas;
}
}

function controladorPrincipal() {

    const divResultado = document.getElementById("resultado");

    const {
        elementCategoria, selectCategoria, valorTitulo, tieneTitulo, tieneTituloSi, 
        inpHoras50, inpHoras100, selectAntiguedad, inpAnticipo } = capturaValores();

    const nombreCategoria = elementCategoria.options[elementCategoria.selectedIndex].text;
    const basicoComun = Number(elementCategoria.options[0].value);

    const secundarioCompleto = tituloSiNo(tieneTituloSi, valorTitulo);

    const precioHora = valorHora(selectCategoria, DIVISOR_JORNALERO);

    const horasAl50 = horasExtra50(precioHora);
    const valorHoraAl50 = horasAl50 * inpHoras50;
    const horasAl100 = horasExtra100(precioHora);
    const valorHoraAl100 = horasAl100 * inpHoras100;

    const mesHorasInput = mostrarInputMes();
    const horasValor = calculoHorasMes(mesHorasInput, precioHora);

    const noRemunerativo = asignacionNoRem(nombreCategoria);
    
    const antiguedadCalculo = calcularAntiguedad(selectCategoria);
    const antiguedad = antiguedadCalculo * selectAntiguedad;

    const presentismoPerfecto = calculoPresPerfecto(basicoComun);
    const presentismoCompleto = calculoPresCompleto(basicoComun);

    console.log("Nombre categoria: " + nombreCategoria);
    console.log("BASICO: " + selectCategoria);

    console.log("Antiguedad: " + selectAntiguedad);
    console.log("Antiguedad calculada: " + antiguedad);

    console.log("Valor horas al 50%: " + valorHoraAl50);
    console.log("Valor horas al 100%: " + valorHoraAl100);
    console.log("Horas extra al 50%: " + inpHoras50);
    console.log("Horas extra al 100%: " + inpHoras100);

    console.log("Secundario completo: " + secundarioCompleto);
    console.log("Tiene titulo: " + tieneTituloSi);
    console.log("Valor titulo: " + valorTitulo);

    console.log("Presentismo perfecto: " + presentismoPerfecto);
    console.log("Presentismo completo: " + presentismoCompleto);
    console.log("Mes completo: " + mesHorasInput);
    console.log("Horas trabajadas: " + horasValor);
    console.log("Precio hora: " + precioHora);

    console.log("No remunerativo: " + noRemunerativo);
    console.log("REFRIGERIO: " + REFRIGERIO);

    const radioMesCompleto = document.getElementById("mesCompleto1").checked;

    const totalHaberes = sumaHaberes(radioMesCompleto ,selectCategoria, antiguedad,
         secundarioCompleto, presentismoPerfecto, presentismoCompleto, valorHoraAl50,
        valorHoraAl100, horasValor);

    const descuentoJubilacion = jubilacion(totalHaberes);
    const descuentoLey19032 = ley19032(totalHaberes);
    const descuentoSindicato = sindicato(totalHaberes);
    const obraSocialDesc = obraSocial(totalHaberes);
    const anticipo = inpAnticipo;

    const descuentos = totalDescuentos (sepelio, descuentoJubilacion, 
    descuentoLey19032, descuentoSindicato, obraSocialDesc);

    const totalFinal = totalNeto (totalHaberes, descuentos, anticipo, 
        REFRIGERIO, noRemunerativo);

    console.log("Jubilacion: " + descuentoJubilacion);
    console.log("Ley 19032: " + descuentoLey19032);
    console.log("Sindicato: " + descuentoSindicato);
    console.log("Anticipo: " + inpAnticipo);
    console.log("Sepelio: " + sepelio);
    console.log("Obra social: " + obraSocialDesc);
    console.log(" descuentos: " + descuentos);

    console.log("SumaHaberes: " + totalHaberes);
    console.log("Total neto: " + totalFinal);

    divResultado.innerHTML = `
    ${mesHorasInput 
    ? `<div class="resultado1"> 
    <span> Horas trabajadas: </span>
    <span> $${horasValor.toLocaleString('es-AR')} </span>
    </div>` 
    : `<div class="resultado1">
    <span> Basico: </span>
    <span> $${selectCategoria.toLocaleString('es-AR')} </span> 
    </div> `}
    <div class="resultado1"> 
    <span> Antiguedad: </span>
    <span> $${antiguedad.toLocaleString('es-AR')} </span>
    </div> 
    <div class="resultado1"> 
    <span> Horas Extra al 50%: </span>
    <span> $${valorHoraAl50.toLocaleString('es-AR')} </span>
    </div> 
    <div class="resultado1"> 
    <span> Horas Extra al 100%: </span>
    <span> $${valorHoraAl100.toLocaleString('es-AR')} </span>
    </div> 
    <div class="resultado1">
    <span> Titulo Secundario: </span>
    <span> $${secundarioCompleto.toLocaleString('es-AR')} </span>
    </div> 
    ${radioMesCompleto 
    ? `<div class="resultado1"> 
    <span> Presentismo Perf.: </span>
    <span> $${presentismoPerfecto.toLocaleString('es-AR')} </span>
    </div> 
    <div class="resultado1">  
    <span> Presentismo Comp.: </span>
    <span> $${presentismoCompleto.toLocaleString('es-AR')} </span>
    </div>` : ""}
    <div class="resultado1"> 
     <span> No Remunerativo: </span>
     <span> $${noRemunerativo.toLocaleString('es-AR')} </span>
    </div> 
    <div class="resultado1"> 
    <span> Refrigerio: </span>
    <span> $${REFRIGERIO.toLocaleString('es-AR')} </span>
    </div> 
    <hr>
    <div class="resultado1"> 
    <span> Jubilacion: </span>
    <span> $${descuentoJubilacion.toLocaleString('es-AR')} </span>
    </div> 
    <div class="resultado1"> 
    <span> Ley 19032: </span>
    <span> $${descuentoLey19032.toLocaleString('es-AR')} </span>
    </div> 
    <div class="resultado1"> 
    <span> Obra social: </span>
    <span> $${obraSocialDesc.toLocaleString('es-AR')} </span>
    </div>
    <div class="resultado1"> 
    <span> Sindicato: </span>
    <span> $${descuentoSindicato.toLocaleString('es-AR')} </span>
    </div> 
    <div class="resultado1"> 
    <span> Sepelio: </span>
    <span> $${sepelio.toLocaleString('es-AR')} </span>
    </div>
    <div class="resultado1"> 
    <span> Anticipo: </span>
    <span> $${inpAnticipo.toLocaleString('es-AR')} </span>
    </div> 
    <hr>
    <div class="resultado1"> 
    <span> Total: </span>
    <span> $${totalFinal.toLocaleString('es-AR')} </span>
    </div>
    `;
}