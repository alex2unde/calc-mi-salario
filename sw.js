const CACHE_NAME = "bodega-cache-v14";
const CACHE_PREFIX = "bodega-cache-";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/calculadora.html",
  "/calculadora-contrato.html",
  "/calculadora-viña.html",
  "/indemnizacion.html",
  "/indemnizacion-viña.html",
  "/css/Estylos.css",
  "/js/controlador-landing.js",
  "/js/controlador-calculadora.js",
  "/js/controlador-calculadora-contrato.js",
  "/js/controlador-calculadora-viña.js",
  "/js/controlador-Indemnizacion.js",
  "/js/navegacion-compartida.js",
  "/js/modelo.js",
  "/manifest.json",
  "/assets/imagenes/bandera-brasil.svg",
  "/assets/imagenes/bandera-chile.svg",
  "/assets/imagenes/bandera-eeuu.svg",
  "/assets/imagenes/logo-png-192.png",
  "/assets/imagenes/logo-png-512.png",
  "/assets/imagenes/trabajadores-bodega-card-cropped.webp",
  "/assets/imagenes/trabajadores-cocechando-card-cropped.webp",
  "/assets/imagenes/trabajadores-viña-card-cropped.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(URLS_TO_CACHE);
      } catch (error) {
        await caches.delete(CACHE_NAME);
        throw error;
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const oldAppCaches = cacheNames.filter(
        (cacheName) =>
          cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME,
      );

      await Promise.all(oldAppCaches.map((cacheName) => caches.delete(cacheName)));
      await self.clients.claim();
    })(),
  );
});

async function getCachedResponse(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request, {
    ignoreSearch: request.mode === "navigate",
  });

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);

  if (networkResponse.status === 200 && networkResponse.type === "basic") {
    try {
      await cache.put(request, networkResponse.clone());
    } catch (error) {
      console.error("No se pudo guardar el recurso en caché:", request.url, error);
    }
  }

  return networkResponse;
}

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (
    event.request.method !== "GET" ||
    requestUrl.origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith(
    getCachedResponse(event.request).catch(async (error) => {
      if (event.request.mode === "navigate") {
        const cache = await caches.open(CACHE_NAME);
        const offlinePage = await cache.match("/index.html");

        if (offlinePage) {
          return offlinePage;
        }
      }

      throw error;
    }),
  );
});
