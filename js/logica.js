
class Operario {

    valorCategoria = {
    comun: 466644,
    especial: 513309,
    calificado: 531975,
    foguista: 587972,
    encargado: 606638
    };

    valorHora = {
    comun: 2467,
    especial: 2715,
    calificado: 2814,
    foguista: 3110,
    encargado: 3209
    };

    asigNoRem = {
    comun: 154608,
    especial: 170069,
    calificado: 176254,
    foguista: 194807,
    encargado: 200991
    };

    titulo = 23333;
    presentPerfec = 23333;
    presentComplet = 46665;
    refrigerio = 157719;
    
    // Descuentos
    jubilacion = 0.11;
    ley19032 = 0.03;
    sindicato = 0.02;
    sepelio = 9606;
    obraSocial = 0.03;
    anticipo = 0;
    preciosVinos = {0: 0, 1: 6451, 2: 6451, 3: 10517, 4: 10517, 5: 10645, 6: 10645, 7: 10645, 8: 10645, 9: 10645,
    10: 10645, 39:12773, 11: 15080, 12: 15080, 13: 14258, 14: 17165, 15: 14258, 16: 14258, 17: 14258, 18: 14258, 19: 14258, 
    20: 32309, 21: 32309, 22: 15802, 23: 15802, 24: 15802, 25: 15802, 26: 15802, 27: 15802, 28: 20610,
    29: 20610, 30: 20610, 31: 28147, 32: 28147, 33: 28147, 34: 28147, 35: 16506, 36: 16506, 37: 16506,
    38: 19711, 39: 16506, 40: 24417, 41: 24417, 42: 23775, 43: 23775};

    constructor(categoria, noRem ,antiguedad, vino, vino2, tieneTitulo, horasExt50,
    horasExt100, jubilacion, ley19032, sindicato1, presenperf, 
    presencomp, refri, horasTrabajadas, sepel, obraSocial, anticipo) {
        this.categoria = categoria;
        this.antiguedad = antiguedad;
        this.vino = vino;
        this.vino2 = vino2;
        this.tieneTitulo = tieneTitulo;
        this.horasEx50 = horasExt50;
        this.horasEx100 = horasExt100;
        this.horasTrabajadas = horasTrabajadas;
        this.jubilacion = jubilacion;
        this.ley19032 = ley19032;
        this.obraSocial = obraSocial;
        this.sindicato1 = sindicato1;
        this.noRem = noRem;
        this.presenperf = presenperf;
        this.presencomp = presencomp;
        this.refri = refri;
        this.sepel = sepel;
        this.anticipo = anticipo;
    }

    basicoCompleto() {

        // Sueldo básico + antigüedad
        let basico = this.valorCategoria[this.categoria];
        let adicionalAntiguedad = basico * 0.01 * (this.antiguedad || 0);

        // Asignación no remunerativa
        let asigNoRem = this.asigNoRem[this.noRem];

        // Título secundaria
        let adicionalTitulo;
        if (this.tieneTitulo) {
             adicionalTitulo = this.titulo;
        } else {
            adicionalTitulo = 0;
        }

        let adicionalHorasTrabajadas = 0;
        if (trabajoMesCompleto) {
        adicionalHorasTrabajadas = (Operario.valorHora[Operario.categoria] || 0) * (Operario.horasTrabajadas || 0);
        }

        // Anticipo
        let adicionalAnticipo = 0;
        if (this.anticipo) {
            adicionalAnticipo = this.anticipo;
        }

        // Presentismo
        let adicionalPerfec;
        if (this.presenperf){
            adicionalPerfec = this.presentPerfec;
        }   else{
            adicionalPerfec = 0;
        }

        let adicionalComplet;
        if (this.presencomp){
            adicionalComplet = this.presentComplet;
        }   else{
            adicionalComplet = 0;
        }

        // Refrigerio
         let adicionalRefri;
        if (this.refri){
            adicionalRefri = this.refrigerio;
        }   else{
            adicionalRefri = 0;
        }
        
        // Vino retirado
        let adicionalVino1 = (this.preciosVinos[this.vino] || 0);
        let adicionalVino2 = (this.preciosVinos[this.vino2] || 0);
        let adicionalVino = adicionalVino1 + adicionalVino2;

        // Suma total antes de descuentos
        let total = basico + adicionalAntiguedad +  adicionalTitulo +
                    adicionalPerfec + adicionalComplet + adicionalHorasTrabajadas;

        // Descuentos
        let descuentoJubilacion = total * this.jubilacion;
        let descuentoLey19032 = total * this.ley19032;
        let descuentoSindicato = total * this.sindicato1;
        let descuentoSepelio = this.sepel || 0;
        let descuentoObraSocial = 0;
        if (this.obraSocial){
            descuentoObraSocial = total * this.obraSocial;
        }

        let descuentos = descuentoSepelio + descuentoJubilacion +
         descuentoLey19032 + descuentoSindicato + adicionalVino + descuentoObraSocial;

        // Resultado final
        return (total - descuentos) + (adicionalRefri + asigNoRem);
    }
}

