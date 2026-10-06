const CACHE_NAME = "bodega-cache-v12";
const urlsToCache = [
  "./",
  "/index.html",
  "/calculadora.html",
  "/indemnizacion.html",
  "/calculadora-viña.html",
  "/css/Estylos.css",
  "/js/controlador-landing.js",
  "/js/controlador-calculadora.js",
  "/js/controlador-Indemnizacion.js",
  "/js/controlador-calculadora-viña.js",
  "/js/modelo.js",
  "/manifest.json",
  "/assets/imagenes/logo-png-192.png",
  "/assets/imagenes/logo-png-512.png",
  "/assets/imagenes/trabajadores-bodega-card-cropped.webp",
  "/assets/imagenes/trabajadores-cocechando-card-cropped.webp",
];

// Instalación: Guardamos todos los archivos
self.addEventListener("install", (event) => {
  self.skipWaiting(); // <--- TOMA EL CONTROL INMEDIATO
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

// Activación: Borramos cachés antiguas y tomamos control de las pestañas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            // Si el nombre de la caché en el navegador NO coincide con la actual, se borra
            if (cache !== CACHE_NAME) {
              console.log("Eliminando caché antigua:", cache);
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()), // Fuerza a todas las pestañas abiertas a usar el nuevo SW
  );
});

self.addEventListener("fetch", (event) => {
  // 1. Ignorar solicitudes que no sean HTTP o HTTPS (como chrome-extension://)
  if (!event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // 2. Solo guardamos si la respuesta es válida y exitosa
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic" // Evita también problemas con recursos de terceros opacos
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      }),
  );
});
