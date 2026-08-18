// Cambiamos a v2 para que el navegador sepa que hay una actualización
const CACHE_NAME = "bodega-cache-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/calculadora.html",
  "/indemnizacion.html",
  "/css/Estylos.css",
  "/js/controlador-landing.js",
  "/js/controlador-calculadora.js",
  "/js/controlador-indemnizacion.js",
  "/js/modelo.js",
  "/manifest.json",
  "/assets/imagenes/logo-png-192.png",
  "/assets/imagenes/logo-png-512.png",
];

// 1. INSTALACIÓN
self.addEventListener("install", (event) => {
  // Poder 1: Obliga al SW nuevo a instalarse inmediatamente (ignora el estado de "espera")
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// 2. ACTIVACIÓN (Limpieza y toma de control)
self.addEventListener("activate", (event) => {
  // Poder 2: Toma el control de la pestaña al instante
  event.waitUntil(clients.claim());
});

// 3. FETCH (Intercepción de red a prueba de fallos)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Poder 3: ignoreSearch en true ignora los parámetros extra de Live Server
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      // Si el archivo está en la caché, lo devolvemos al instante
      if (response) {
        return response;
      }

      return fetch(event.request).catch(() => {
        console.log(
          "Estás offline y el archivo no está en caché: ",
          event.request.url,
        );
        // El parche: devolvemos una respuesta oficial para que no explote la promesa
        return new Response("Página no disponible offline", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      });
    }),
  );
});
