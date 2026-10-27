import { diferenciaEnDias, obtenerAnioLocal, obtenerFeriados } from "./feriados.js";
import { montarModalFeriados } from "./navegacion-compartida.js";

montarModalFeriados();

//boton del menu responsive-----------------------------------------------------------------
const botonMenu = document.getElementById("menu");
const navDesplega = document.getElementById("nav__links");

// ESCUDO: Solo ejecuta si el menú existe en esta página
if (botonMenu && navDesplega) {
  botonMenu.addEventListener("click", () => {
    navDesplega.classList.toggle("active");
  });
}

//modal para las calculadoras--------------------------------------------------------------
const botonPabrirModal = document.getElementById("btnCalculadoras");
const divOcultoModal = document.getElementById("modalPrincipal");
const btnCerrarModal = document.getElementById("btnCerrarModal");
console.log(botonPabrirModal, divOcultoModal);
botonPabrirModal.addEventListener("click", () => {
  divOcultoModal.classList.add("activo");
});
btnCerrarModal.addEventListener("click", () => {
  divOcultoModal.classList.remove("activo");
});

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

function renderizarFeriados(contenedor, feriados) {
  const hoy = new Date();
  const hoyIso = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
  const proximos = feriados
    .filter((feriado) => feriado.fecha >= hoyIso)
    .slice(0, 1);

  contenedor.replaceChildren();

  if (proximos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "cargando";
    mensaje.textContent = `No hay feriados próximos disponibles para ${obtenerAnioLocal()}.`;
    contenedor.append(mensaje);
    return;
  }

  proximos.forEach((feriado) => {
    const [anio, mes, dia] = feriado.fecha.split("-");
    const fecha = new Date(Number(anio), Number(mes) - 1, Number(dia));
    const diasRestantes = diferenciaEnDias(feriado.fecha);
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-feriado";

    const fechaBadge = document.createElement("span");
    fechaBadge.className = "fecha-badge";
    fechaBadge.textContent = `${dia}/${mes}`;

    const diaNombre = document.createElement("p");
    diaNombre.className = "dia-nombre";
    diaNombre.textContent = fecha.toLocaleDateString("es-AR", {
      weekday: "long",
    });

    const cuentaRegresiva = document.createElement("p");
    cuentaRegresiva.className = "faltan-dias";
    cuentaRegresiva.textContent =
      diasRestantes === 0 ? "Hoy" : `En ${diasRestantes} días`;

    const nombre = document.createElement("p");
    nombre.className = "feriado-nombre";
    nombre.textContent = feriado.nombre;

    const tipo = document.createElement("small");
    tipo.className = "feriado-tipo";
    tipo.textContent = feriado.tipo;

    tarjeta.append(fechaBadge, diaNombre, cuentaRegresiva, nombre, tipo);
    contenedor.append(tarjeta);
  });
}

const contenedorFeriados = document.getElementById("contenedor-feriados");

if (contenedorFeriados) {
  obtenerFeriados(obtenerAnioLocal(), (datos) => {
    renderizarFeriados(contenedorFeriados, datos.feriados);
  }).then((datos) => {
    renderizarFeriados(contenedorFeriados, datos.feriados);
  });
}
