class Operario {
    valorCategoria = {
        comun: 484592 ,
        especial: 533052 ,
        calificado: 571819,
        foguista: 610586,
        encargado: 629970
    };

    valorHora = {
        comun: 2423,
        especial: 2665,
        calificado: 2859,
        foguista: 3053,
        encargado: 3149
    };

    asigNoRem = {
        comun: 160554,
        especial: 176610,
        calificado: 189454,
        foguista: 202299,
        encargado: 208721
    };

    titulo = 24230;
    presentPerfec = 24230;
    presentComplet = 48460;
    refrigerio = 163785;
    jubilacion = 0.11;
    ley19032 = 0.03;
    sindicato = 0.02;
    sepelio = 12943;
    obraSocial = 0.03;

    preciosVinos = {
        0: 0, 1: 6451, 2: 6451, 3: 10517, 4: 10517, 5: 10645, 6: 10645, 7: 10645, 
        8: 10645, 9: 10645, 10: 10645, 39: 12773, 11: 15080, 12: 15080, 13: 14258, 
        14: 17165, 15: 14258, 16: 14258, 17: 14258, 18: 14258, 19: 14258, 20: 32309, 
        21: 32309, 22: 15802, 23: 15802, 24: 15802, 25: 15802, 26: 15802, 27: 15802, 
        28: 20610, 29: 20610, 30: 20610, 31: 28147, 32: 28147, 33: 28147, 34: 28147, 
        35: 16506, 36: 16506, 37: 16506, 38: 19711, 39: 16506, 40: 24417, 41: 24417, 
        42: 23775, 43: 23775
    };

    constructor(categoria, antiguedad, vino, vino2, tieneTitulo, horasExt50,
        horasExt100, jubilacion, ley19032, sindicato1, presenperf, 
        presencomp, refri, horasTrabajadas, sepel, obraSocial, anticipo, trabajoMesCompleto) {
        this.categoria = categoria;
        this.antiguedad = antiguedad || 0;
        this.vino = vino || 0;
        this.vino2 = vino2 || 0;
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
        const adicionalVino = (this.preciosVinos[this.vino] || 0) + (this.preciosVinos[this.vino2] || 0);
        
        const valorHora = this.trabajoMesCompleto ? this.valorHora[this.categoria] : (basico / 189);
        const horas50 = valorHora * 1.5 * (this.horasEx50 || 0);
        const horas100 = valorHora * 2 * (this.horasEx100 || 0);

        let adicionalHorasTrabajadas = 0;
        if (this.trabajoMesCompleto) {
            adicionalHorasTrabajadas = (this.valorHora[this.categoria] || 0) * (this.horasTrabajadas || 0);
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
        const gastosTotales = descuentosLegales + adicionalVino + this.anticipo + sepelio;
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
            adicionalVino,
            sueldoFinal
        };
    }
}