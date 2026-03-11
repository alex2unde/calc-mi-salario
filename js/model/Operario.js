class Operario {
    valorCategoria = {
        comun: 502540,
        especial: 552794,
        calificado: 592998,
        foguista: 633201,
        encargado: 653302
    };

    valorHora = {
        comun: 2512,
        especial: 2764,
        calificado: 2964,
        foguista: 3166,
        encargado: 3266
    };

    asigNoRem = {
        comun: 166501,
        especial: 183152,
        calificado: 196472,
        foguista: 209792,
        encargado: 216452
    };

    titulo = 25127;
    presentPerfec = 25127;
    presentComplet = 50254;
    refrigerio = 169851;
    jubilacion = 0.11;
    ley19032 = 0.03;
    sindicato = 0.02;
    sepelio = 12943;
    obraSocial = 0.03;

    constructor(categoria, antiguedad,  tieneTitulo, horasExt50,
        horasExt100, jubilacion, ley19032, sindicato1, presenperf, 
        presencomp, refri, horasTrabajadas, sepel, obraSocial, anticipo, trabajoMesCompleto) {
        this.categoria = categoria;
        this.antiguedad = antiguedad || 0;
        this.tieneTitulo = tieneTitulo || false;
        this.horasEx50 = horasExt50 || 0;
        this.horasEx100 = horasExt100 || 0;
        this.horasTrabajadas = horasTrabajadas || 0;
        this.jubilacion = jubilacion || this.jubilacion;
        this.ley19032 = ley19032 || this.ley19032;
        this.obraSocial = obraSocial || false;
        this.sindicato1 = sindicato1 || this.sindicato;
        this.presenperf = presenperf || false;
        this.presencomp = presencomp || false;
        this.refri = refri || false;
        this.sepel = sepel || this.sepelio;
        this.anticipo = anticipo || 0;
        this.trabajoMesCompleto = trabajoMesCompleto || false;
    }

    calcular() {
        const valorBaseCategoria = this.valorCategoria[this.categoria];
        const basico = valorBaseCategoria;
        const adicionalAntiguedad = this.antiguedad > 0 ? valorBaseCategoria * 0.01 * this.antiguedad : 0;
        const asigNoRem = this.asigNoRem[this.categoria] || 0;
        const adicionalTitulo = this.tieneTitulo ? this.titulo : 0;
        const adicionalPerfec = this.presenperf ? this.presentPerfec : 0;
        const adicionalComplet = this.presencomp ? this.presentComplet : 0;
        const adicionalRefri = this.refri ? this.refrigerio : 0;

        const valorHora = this.trabajoMesCompleto ? this.valorHora[this.categoria] : (basico / 189);
        const horas50 = valorHora * 1.5 * (this.horasEx50 || 0);
        const horas100 = valorHora * 2 * (this.horasEx100 || 0);

       let adicionalHorasTrabajadas = 0;
        if (!this.trabajoMesCompleto) {
        adicionalHorasTrabajadas =
        (this.valorHora[this.categoria] || 0) *
        (this.horasTrabajadas || 0);
        }


        const subTotal = basico + adicionalAntiguedad + adicionalTitulo +
                        adicionalPerfec + adicionalComplet + 
                        adicionalHorasTrabajadas + horas50 + horas100;

        const descuentoJubilacion = subTotal * this.jubilacion;
        const descuentoLey19032 = subTotal * this.ley19032;
        const descuentoSindicato = subTotal * this.sindicato1;
        const descuentoObraSocial = this.obraSocial ? subTotal * 0.03 : 0;
        const sepelio = this.sepel;
        const descuentosLegales = descuentoJubilacion + descuentoLey19032 + 
                                 descuentoSindicato + descuentoObraSocial;
        const gastosTotales = descuentosLegales +  this.anticipo + sepelio;
        const sueldoFinal = (subTotal - gastosTotales) + (adicionalRefri + asigNoRem);

        return {
            basico,
            adicionalAntiguedad,
            horas50,
            horas100,
            adicionalTitulo,
            adicionalPerfec,
            adicionalComplet,
            asigNoRem,
            adicionalRefri,
            adicionalHorasTrabajadas,
            descuentoJubilacion,
            descuentoLey19032,
            descuentoSindicato,
            descuentoObraSocial,
            sepelio,
            sueldoFinal
        };
    }
}