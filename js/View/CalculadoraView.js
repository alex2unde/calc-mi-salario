class CalculadoraView {
    constructor() {
        this.rubro = document.getElementById('opcionRubro');
        this.categoria = document.getElementById('opcionesCat');
        this.antiguedad = document.getElementById('opcionesAnt');
        this.titulo = document.querySelectorAll('input[name="titulo"]');
        this.horasEx50 = document.getElementById('horasEx50');
        this.horasEx100 = document.getElementById('horasEx100');
        this.mesCompleto = document.querySelectorAll('input[name="opcion"]');
        this.horasTrab = document.getElementById('horasTrab');
        this.obraSocial = document.querySelectorAll('input[name="obraSocial"]');
        this.anticipo = document.getElementById('anticipo');
        this.calcularBtn = document.getElementById('calcularBtn');
        this.resultadoDiv = document.getElementById('resultado');
        this.horasCampo = document.getElementById('horasCampo');
    }

    getFormData() {
        return {
            rubro: this.rubro?.value,
            categoria: this.categoria.value,
            antiguedad: parseInt(this.antiguedad.value),
            tieneTitulo: Array.from(this.titulo).find(r => r.checked)?.value === "si",
            horasExt50: parseInt(this.horasEx50.value) || 0,
            horasExt100: parseInt(this.horasEx100.value) || 0,
            trabajoMesCompleto: Array.from(this.mesCompleto).find(r => r.checked)?.value === "1",
            horasTrabajadas: parseInt(this.horasTrab.value) || 0,
            obraSocial: Array.from(this.obraSocial).find(r => r.checked)?.value === "3",
            anticipo: parseInt(this.anticipo.value) || 0
        };
    }

    mostrarResultado(resultado) {
        this.resultadoDiv.innerHTML = `
            <strong class="resultado2">Detalle de tu sueldo:</strong><br><hr><br>
            ${resultado.basico > 0 ? `
            <div class="resultado-fila">
                <span>Básico:</span>
                <span>$${resultado.basico.toFixed(2)}</span>
            </div>
            ` : ""}
            <div class="resultado-fila">
                <span>Antigüedad:</span>
                <span>$${resultado.adicionalAntiguedad.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Horas extras 50%:</span>
                <span>$${resultado.horas50.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Horas extras 100%:</span>
                <span>$${resultado.horas100.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Título secundario:</span>
                <span>$${resultado.adicionalTitulo.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Presentismo perf.:</span>
                <span>$${resultado.adicionalPerfec.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Presentismo compl.:</span>
                <span>$${resultado.adicionalComplet.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Asig. no remunerativa:</span>
                <span>$${resultado.asigNoRem.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Refrigerio:</span>
                <span>$${resultado.adicionalRefri.toFixed(2)}</span>
            </div>
            ${resultado.adicionalHorasTrabajadas > 0 ? `
            <div class="resultado-fila">
                <span>Horas trabajadas:</span>
                <span>$${resultado.adicionalHorasTrabajadas.toFixed(2)}</span>
            </div>
            ` : ""}
            <hr>
            <div class="resultado-fila">
                <span>Jubilación:</span>
                <span>- $${resultado.descuentoJubilacion.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Ley 19032:</span>
                <span>- $${resultado.descuentoLey19032.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Sindicato:</span>
                <span>- $${resultado.descuentoSindicato.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Sepelio:</span>
                <span>- $${resultado.sepelio.toFixed(2)}</span>
            </div>
            <div class="resultado-fila">
                <span>Obra social:</span>
                <span>- $${resultado.descuentoObraSocial.toFixed(2)}</span>
            </div>
            <hr>
            <div class="resultado-fila total">
                <span><strong>Total:</strong></span>
                <span class="totalFinal"><strong>$${resultado.sueldoFinal.toFixed(0)}</strong></span>
            </div>
        `;
    }

    onCalcular(callback) {
        this.calcularBtn.addEventListener('click', callback);
    }

    toggleHorasTrabajadas(mostrar) {
        this.horasCampo.style.display = mostrar ? "block" : "none";
    }

    onMesCompletoChange(callback) {
        this.mesCompleto.forEach(radio => {
            radio.addEventListener('change', callback);
        });
    }
}