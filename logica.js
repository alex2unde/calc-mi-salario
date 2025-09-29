
class Operario {

    valorCategoria = {
    comun: 448696,
    especial: 493566,
    calificado: 529462,
    foguista: 565357,
    encargado: 583305
    };

    valorHora = {
    comun: 2243,
    especial: 2468,
    calificado: 2647,
    foguista: 2828,
    encargado: 2916
    };

    asigNoRem = {
    comun: 148661,
    especial: 163528,
    calificado: 175420,
    foguista: 187313,
    encargado: 193260
    };

    titulo = 22435;
    presentPerfec = 22435;
    presentComplet = 44870;
    refrigerio = 151652;
    
    // Descuentos
    jubilacion = 0.11;
    ley19032 = 0.03;
    sindicato = 0.02;
    sepelio = 9606;
    ospav = 0.03;
    obraSocial = 31140;
    preciosVinos = {0: 0, 1: 6387, 2: 6387, 3: 10413, 4: 10413, 5: 10138, 6: 10138, 7: 10138, 8: 10138, 9: 10138,
    10: 10138, 39:12165, 11: 14362, 12: 14362, 13: 13579, 14: 15605, 15: 13579, 16: 13579, 17: 13579, 18: 13579, 19: 13579, 
    20: 29372, 21: 29372, 22: 15802, 23: 15802, 24: 15802, 25: 15802, 26: 15802, 27: 15802, 28: 20610,
    29: 20610, 30: 20610, 31: 24140, 32: 24140, 33: 15262, 34: 15262, 35: 15262, 36: 17050, 37: 15262,
    38: 15753};

    constructor(categoria, noRem ,antiguedad, vino, vino2, tieneTitulo, horasExt50,
    horasExt100, jubilacion, ley19032, obraSocial, sindicato1, presenperf, 
    presencomp, refri, horasTrabajadas, sepel, ospav,) {
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
        this.ospav = ospav;
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
        let descuentoObraSocial = this.obraSocial || 0;
        let descuentoSepelio = this.sepel || 0;
        let descuentoOspav = 0;
        if (this.ospav){
            descuentoOspav = total * this.ospav;
        }

        let descuentos = descuentoSepelio + descuentoJubilacion +
         descuentoLey19032 + descuentoSindicato + adicionalVino + descuentoObraSocial + descuentoOspav;

        // Resultado final
        return (total - descuentos) + (adicionalRefri + asigNoRem);
    }
}

