// PWA Service Worker (scope auto-resolves relative to script location)

const CACHE_NAME = "pwa-cszcm-v7.3.15";
// Precarga mínima necesaria para arrancar offline (rutas relativas al scope)
const OFFLINE_URLS = [
  // Núcleo app
  './',
  './index.html',
  './css/styles.css',
  './js/scripts.js',
  './manifest.json',
  // Recursos de cabecera/nav necesarios siempre
  './assets/img/logocompleto.png',
  './assets/img/logonegro.png',

  // Secciones clave (sin archivos pesados)
  './temporizador/index.html',
  './temporizador/css/styles.css',
  './temporizador/css/estilos.css',
  './temporizador/js/script.js',
  './temporizador/js/phrases.js',
  './temporizador/js/estadisticas.js',
  './temporizador/js/guardar.js',
  './temporizador/guardar.html',
  './temporizador/estadisticas.html',

  './xinxinming/index.html',
  './xinxinming/comentarios.html'
];


// Instalar el Service Worker y almacenar en caché los archivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Archivos en caché.');
      return cache.addAll(OFFLINE_URLS).catch((error) => {
        console.error('Error al agregar URLs al caché:', error);
      });
    })
  );
  self.skipWaiting(); // Forzar la activación inmediata del nuevo SW
});

// Activar el nuevo Service Worker y eliminar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Asegurar que el SW se active inmediatamente en todos los clientes
});

// Interceptar solicitudes y servir archivos desde la caché o la red
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Solo gestionar peticiones del mismo origen
  if (!url.origin.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(req).catch(() => new Response('Contenido no disponible', { status: 503 }))
    );
    return;
  }

  // Navegación: network-first con fallback al index en caché
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Actualiza caché para HTML si carga
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          return caches.match('./index.html');
        })
    );
    return;
  }

  // Estrategias por tipo de recurso (stale-while-revalidate)
  const dest = req.destination;
  if (dest === 'style' || dest === 'script' || dest === 'worker') {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }
  if (dest === 'image' || dest === 'font') {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // Por defecto: cache-first con actualización
  event.respondWith(
    caches.match(req)
      .then((cached) => {
        return (
          cached ||
          fetch(req).then((res) => {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
            return res;
          })
        );
      })
      .catch(() => caches.match('./index.html'))
  );
});

function staleWhileRevalidate(request) {
  return caches.match(request).then((cached) => {
    const fetchPromise = fetch(request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
        return res;
      })
      .catch(() => undefined);
    return cached || fetchPromise;
  });
}

// Escuchar cambios en la caché y notificar a la página sobre nuevas versiones
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    self.skipWaiting();
  }
});
