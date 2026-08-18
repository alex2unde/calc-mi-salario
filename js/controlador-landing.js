//boton del menu responsive-----------------------------------------------------------------
const botonMenu = document.getElementById("menu");
const navDesplega = document.getElementById("nav__links");

// ESCUDO: Solo ejecuta si el menú existe en esta página
if (botonMenu && navDesplega) {
  botonMenu.addEventListener("click", () => {
    navDesplega.classList.toggle("active");
  });
}

// PWA -------------------------------------------------------------------------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log(
          "¡Service Worker registrado con éxito!",
          registration.scope,
        );
      })
      .catch((error) => {
        console.log("Falló el registro del Service Worker:", error);
      });
  });
}

let eventoInstalacion;
const botonInstalar = document.getElementById("btnInstalarApp");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  eventoInstalacion = e;

  // ESCUDO: Solo intenta mostrar el botón si existe en el HTML
  if (botonInstalar) {
    botonInstalar.style.display = "block";
  }
});

// ESCUDO: Solo le agrega el evento click si el botón existe
if (botonInstalar) {
  botonInstalar.addEventListener("click", async () => {
    if (eventoInstalacion !== null) {
      eventoInstalacion.prompt();
      const { outcome } = await eventoInstalacion.userChoice;
      if (outcome === "accepted") {
        console.log("¡El usuario instaló la aplicación!");
        botonInstalar.style.display = "none";
      }
      eventoInstalacion = null;
    }
  });
}

//modo claro/oscuro. ------------------------------------------------------------------------
const btnModo = document.getElementById("toggleModo");

// ESCUDO: Solo busca el ícono y cambia el tema si el botón de modo existe
if (btnModo) {
  const iconoModo = btnModo.querySelector("i");

  btnModo.addEventListener("click", () => {
    document.body.classList.toggle("modo-claro");

    if (document.body.classList.contains("modo-claro")) {
      iconoModo.classList.remove("fa-sun");
      iconoModo.classList.add("fa-moon");
    } else {
      iconoModo.classList.remove("fa-moon");
      iconoModo.classList.add("fa-sun");
    }
  });
}

// ------------------------------------------------------------------------------------------
// Feriados (Versión offline)
// ------------------------------------------------------------------------------------------
function obtenerFeriados() {
  const contenedor = document.getElementById("contenedor-feriados");

  // ESCUDO: Si no estamos en la página de inicio (no hay contenedor), cortamos la función acá
  if (!contenedor) return;

  const hoy = new Date().toISOString().split("T")[0];
  const feriados2026 = [
    {
      fecha: "2026-10-12",
      nombre: "Día del Respeto a la Diversidad Cultural",
      tipo: "trasladable",
    },
    {
      fecha: "2026-11-20",
      nombre: "Día de la Soberanía Nacional",
      tipo: "trasladable",
    },
    {
      fecha: "2026-12-08",
      nombre: "Inmaculada Concepción de María",
      tipo: "inamovible",
    },
    { fecha: "2026-12-25", nombre: "Navidad", tipo: "inamovible" },
  ];

  const feriadosFuturos = feriados2026.filter(
    (feriado) => feriado.fecha >= hoy,
  );
  const proximosTres = feriadosFuturos.slice(0, 3);
  renderizarFeriados(proximosTres);
}

function renderizarFeriados(listaFeriados) {
  const contenedor = document.getElementById("contenedor-feriados");

  // ESCUDO DE SEGURIDAD EXTRA
  if (!contenedor) return;

  contenedor.innerHTML = "";

  listaFeriados.forEach((feriado) => {
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
                ${faltanDias === 0 ? '<p class="faltan-dias">Hoy</p>' : `<p class="faltan-dias">Faltan ${faltanDias} días</p>`}
                <p class="feriado-nombre">${feriado.nombre}</p>
                <small class="feriado-tipo">${feriado.tipo}</small>
            </div>
        `;
  });
}

window.onload = obtenerFeriados;
