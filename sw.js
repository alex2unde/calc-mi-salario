const CACHE_NAME = "bodega-cache-v8";
const urlsToCache = [
  "/",
  "/index.html",
  "/calculadora.html",
  "/indemnizacion.html",
  "/css/Estylos.css",
  "/js/controlador-landing.js",
  "/js/controlador-calculadora.js",
  "/js/controlador-Indemnizacion.js",
  "/js/modelo.js",
  "/manifest.json",
  "/assets/imagenes/logo-png-192.png",
  "/assets/imagenes/logo-png-512.png",
];

// Instalación: Guardamos todos los archivos
self.addEventListener("install", (event) => {
  self.skipWaiting(); // <--- TOMA EL CONTROL INMEDIATO
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

// Intercepción: Prioridad a la caché
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché, lo devuelve. Si no, va a la red.
      return response || fetch(event.request);
    }),
  );
});

// Activación: Limpiamos cachés viejas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        }),
      );
    }),
  );
  self.clients.claim();
});
