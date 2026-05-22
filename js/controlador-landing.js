function obtenerFeriados() {
  const url = "https://api.argentinadatos.com/v1/feriados/2026";

  // la fecha solo hasta la t.
  const hoy = new Date().toISOString().split("T")[0];

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // 1. Filtramos: solo los feriados cuya fecha sea igual o mayor a HOY
      const feriadosFuturos = data.filter((feriado) => feriado.fecha >= hoy);

      // 2. Tomamos solo los próximos 3 para mostrar en la interfaz
      const proximosTres = feriadosFuturos.slice(0, 3);

      // 3. Llamamos a la función que los dibuja en el HTML
      renderizarFeriados(proximosTres);
    })
    .catch((error) =>
      console.error("Error al cargar feriados para la landing:", error),
    );
}

// Esta función se encarga de pintar las tarjetitas en el HTML
function renderizarFeriados(listaFeriados) {
  const contenedor = document.getElementById("contenedor-feriados");
  contenedor.innerHTML = ""; // Limpiamos por si hay algo antes

  listaFeriados.forEach((feriado) => {
    // Separamos la fecha para mostrarla más linda (ej: "25/05")
    const [anio, mes, dia] = feriado.fecha.split("-");
    const fechaObjeto = new Date(anio, mes - 1, dia);
    let nombreDia = fechaObjeto.toLocaleDateString("es-AR", {
      weekday: "long",
    });
    let faltanDias = Math.ceil(
      (fechaObjeto - new Date()) / (1000 * 60 * 60 * 24),
    );

    contenedor.innerHTML += `
            <div class="tarjeta-feriado">
                <span class="fecha-badge">${dia}/${mes}</span>
                <p class="dia-nombre">${nombreDia}</p>
                <p class="faltan-dias">Faltan ${faltanDias} días</p>
                <p class="feriado-nombre">${feriado.nombre}</p>
                <small class="feriado-tipo">${feriado.tipo}</small>
            </div>
        `;
  });
}

// Ejecutamos la función apenas se carga la landing page
window.onload = obtenerFeriados;
