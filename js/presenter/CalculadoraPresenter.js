class CalculadoraPresenter {
    constructor(view) {
        this.view = view;
        this.init();
    }

    init() {
        // Manejar cambio de "mes completo"
        this.view.onMesCompletoChange(() => {
            const trabajoMesCompleto = Array.from(document.querySelectorAll('input[name="opcion"]'))
                .find(r => r.checked)?.value === "1";
            this.view.toggleHorasTrabajadas(!trabajoMesCompleto);
        });

        // Manejar clic en "Calcular"
        this.view.onCalcular(() => {
            const datos = this.view.getFormData();
            const operario = new Operario(
                datos.categoria,
                datos.antiguedad,
                datos.vino,
                datos.vino2,
                datos.tieneTitulo,
                datos.horasExt50,
                datos.horasExt100,
                0.11,
                0.03,
                0.02,
                true,
                true,
                true,
                datos.horasTrabajadas,
                9606,
                datos.obraSocial,
                datos.anticipo,
                datos.trabajoMesCompleto
            );

            const resultado = operario.calcular();
            this.view.mostrarResultado(resultado);
        });
    }
}