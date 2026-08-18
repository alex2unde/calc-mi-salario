//boton del menu responsive-----------------------------------------------------------------
const botonMenu = document.getElementById("menu");
const navDesplega = document.getElementById("nav__links");

// PWA -------------------------------------------------------------------------------------
// Verificamos si el navegador del usuario soporta Service Workers
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

// 1. Atrapamos el evento del navegador
window.addEventListener("beforeinstallprompt", (e) => {
  // Frenamos el mini-cartel automático del navegador
  e.preventDefault();

  // Guardamos el evento en nuestra variable para usarlo después
  eventoInstalacion = e;

  // ¡Mostramos tu botón en la página!
  botonInstalar.style.display = "block";
});

// 2. Le damos vida a tu botón
botonInstalar.addEventListener("click", async () => {
  if (eventoInstalacion !== null) {
    // Cuando hacen clic, disparamos el cartel oficial de instalación del celular
    eventoInstalacion.prompt();

    // Esperamos a ver qué elige el usuario (Aceptar o Cancelar)
    const { outcome } = await eventoInstalacion.userChoice;

    if (outcome === "accepted") {
      console.log("¡El usuario instaló la aplicación!");
      // Como ya la instaló, volvemos a ocultar el botón
      botonInstalar.style.display = "none";
    }

    // Limpiamos la variable
    eventoInstalacion = null;
  }
});

// -------------------------------------------------------------------------------------------------
botonMenu.addEventListener("click", () => {
  navDesplega.classList.toggle("active");
});
//modo claro/oscuro.
const btnModo = document.getElementById("toggleModo");
// Buscamos específicamente la etiqueta <i> que está adentro del botón
const iconoModo = btnModo.querySelector("i");

btnModo.addEventListener("click", () => {
  // 1. Cambiamos el modo de la página
  document.body.classList.toggle("modo-claro");

  // 2. Cambiamos el ícono
  if (document.body.classList.contains("modo-claro")) {
    // Si pasamos a modo claro, sacamos el sol y ponemos la luna
    iconoModo.classList.remove("fa-sun");
    iconoModo.classList.add("fa-moon");
  } else {
    // Si volvemos a modo oscuro, sacamos la luna y ponemos el sol
    iconoModo.classList.remove("fa-moon");
    iconoModo.classList.add("fa-sun");
  }
});

// --------------------------------------------------------------------------------------------------

// function obtenerFeriados() {
//   const url = "https://api.argentinadatos.com/v1/feriados/2026";

//   // la fecha solo hasta la t.
//   const hoy = new Date().toISOString().split("T")[0];

//   const contenedor = document.getElementById("contenedor-feriados");
//   contenedor.innerHTML = `<p class="cargando">Cargando feriados...</p>`;

//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       // 1. Filtramos: solo los feriados cuya fecha sea igual o mayor a HOY
//       const feriadosFuturos = data.filter((feriado) => feriado.fecha >= hoy);

//       // 2. Tomamos solo los próximos 3 para mostrar en la interfaz
//       const proximosTres = feriadosFuturos.slice(0, 3);

//       // 3. Llamamos a la función que los dibuja en el HTML
//       renderizarFeriados(proximosTres);
//     })
//     .catch((error) =>
//       console.error("Error al cargar feriados para la landing:", error),
//     );
// }

//version offline por pwa
function obtenerFeriados() {
  // 1. Calculamos la fecha de hoy
  const hoy = new Date().toISOString().split("T")[0];
  const contenedor = document.getElementById("contenedor-feriados");

  // 2. NUESTRA "API" LOCAL Y OFFLINE:
  // Una lista estática con los feriados que quedan en el año.
  // Como esto es texto en tu archivo .js, el Service Worker lo guarda en el celular.
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

  // 3. Hacemos exactamente la misma lógica que ya tenías, pero usando nuestra lista local
  const feriadosFuturos = feriados2026.filter(
    (feriado) => feriado.fecha >= hoy,
  );
  const proximosTres = feriadosFuturos.slice(0, 3);

  // 4. Se los mandamos a tu función dibujante
  renderizarFeriados(proximosTres);
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
                ${faltanDias === 0 ? '<p class="faltan-dias">Hoy</p>' : `<p class="faltan-dias">Faltan ${faltanDias} días</p>`}
                <p class="feriado-nombre">${feriado.nombre}</p>
                <small class="feriado-tipo">${feriado.tipo}</small>
            </div>
        `;
  });
}

window.onload = obtenerFeriados;
