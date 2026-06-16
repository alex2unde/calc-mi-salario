// Le damos un nombre a nuestra caché
const CACHE_NAME = "bodega-cache-v1";

// Instalación: El navegador detecta el Service Worker y lo instala
self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
});

// Fetch: Intercepta las peticiones (hace que funcione offline si ya visitó la página)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
