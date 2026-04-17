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

    return {
        numeroMes, elementCategoria, selectCategoria, valorTitulo, tieneTituloSi, tieneTituloNo, 
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
        numeroMes ,elementCategoria, selectCategoria, valorTitulo, tieneTitulo, tieneTituloSi, 
        inpHoras50, inpHoras100, selectAntiguedad, inpAnticipo } = capturaValores();

    const nombreCategoria = elementCategoria.options[elementCategoria.selectedIndex].text;
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

    console.log("Precio hora: " + precioHora);

    console.log("No remunerativo: " + noRemunerativo);
    console.log("REFRIGERIO: " + REFRIGERIO);

    const radioMesCompleto = document.getElementById("mesCompleto1").checked;

    const totalHaberes = sumaHaberes(radioMesCompleto ,selectCategoria, antiguedad,
         secundarioCompleto, presentismoPerfecto, presentismoCompleto, valorHoraAl50,
        valorHoraAl100);

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
    console.log("dias del mes " + new Date(2026, 4, 0).getDate());

    
    if (tipoDeOperario === "temporario"){

    const horasHabilesDelMes = verificarHorasHabiles(numeroMes);
    const baseJornal = calculoBaseJornal(precioHora, horasHabilesDelMes);
    const mesHorasInput = mostrarInputMes();
    const horasValor = calculoHorasMes(mesHorasInput, precioHora);
    const haberesTemporario = sumaHaberes(radioMesCompleto, baseJornal, antiguedad, secundarioCompleto, 
        presentismoPerfecto, presentismoCompleto, valorHoraAl50, valorHoraAl100);
    const jubilacionTemp = jubilacion(haberesTemporario);
    const ley19032Temp = ley19032(haberesTemporario);
    const sindicatoTemp = sindicato(haberesTemporario);
    const obraSocialTemp = obraSocial(haberesTemporario);
    const descuentosTemp = totalDescuentos(sepelio, jubilacionTemp, ley19032Temp, 
        sindicatoTemp, obraSocialTemp);
    const totalFinalTemp = totalNeto(haberesTemporario, descuentosTemp, anticipo, REFRIGERIO,
         noRemunerativo);

        console.log("Mes completo: " + mesHorasInput);
        console.log("Horas Habiles: " + horasHabilesDelMes);


    divResultado.innerHTML = `

    <div class="resultado1">
        <span> Basico: </span>
        <span> $${baseJornal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span> 
    </div>
    <div class="resultado1"> 
        <span> Antiguedad: </span>
        <span> $${antiguedad.toLocaleString('es-AR')} </span>
    </div>
    <div class="resultado1"> 
        <span> Horas Extra al 50%: </span>
        <span> $${valorHoraAl50.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 
    <div class="resultado1"> 
        <span> Horas Extra al 100%: </span>
        <span> $${valorHoraAl100.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
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
        <span> $${jubilacionTemp.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 
    <div class="resultado1"> 
        <span> Ley 19032: </span>
        <span> $${ley19032Temp.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 
    <div class="resultado1"> 
        <span> Obra social: </span>
        <span> $${obraSocialTemp.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div>
    <div class="resultado1"> 
        <span> Sindicato: </span>
        <span> $${sindicatoTemp.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
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
        <span> $${totalFinalTemp.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div>
`;

    }
    else {  

    divResultado.innerHTML = `

    <div class="resultado1">
        <span> Basico: </span>
        <span> $${selectCategoria.toLocaleString('es-AR')} </span> 
    </div> 
    <div class="resultado1"> 
        <span> Antiguedad: </span>
        <span> $${antiguedad.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 
    <div class="resultado1"> 
        <span> Horas Extra al 50%: </span>
        <span> $${valorHoraAl50.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 
    <div class="resultado1"> 
        <span> Horas Extra al 100%: </span>
        <span> $${valorHoraAl100.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
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
        <span> $${descuentoJubilacion.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 
    <div class="resultado1"> 
        <span> Ley 19032: </span>
        <span> $${descuentoLey19032.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div> 
    <div class="resultado1"> 
        <span> Obra social: </span>
        <span> $${obraSocialDesc.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div>
    <div class="resultado1"> 
        <span> Sindicato: </span>
        <span> $${descuentoSindicato.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
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
        <span> $${totalFinal.toLocaleString('es-AR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
    </div>
    `;
}
}
