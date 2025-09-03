// This is the "Offline page" service worker

const CACHE_NAME = "pwa-cszcm-v7.2.30";
const OFFLINE_URLS = [
  // Páginas principales
  '/app/inicio/',
  '/app/inicio/index.html',
  '/app/inicio/css/styles.css',
  '/app/inicio/js/scripts.js',
  '/app/inicio/manifest.json',

  // Imágenes
  // (limpiado) Imágenes de tema no presentes en el repositorio actual

  // Temporizador
  '/app/inicio/temporizador/css/styles.css',
  '/app/inicio/temporizador/css/estilos.css',
  '/app/inicio/temporizador/guardar.html',
  '/app/inicio/temporizador/index.html',
  '/app/inicio/temporizador/js/guardar.js',
  '/app/inicio/temporizador/js/phrases.js',
  '/app/inicio/temporizador/js/script.js',
  '/app/inicio/temporizador/js/estadisticas.js',
  '/app/inicio/temporizador/multimedia/end.mp3',
  '/app/inicio/temporizador/multimedia/logoblanco.png',
  '/app/inicio/temporizador/multimedia/logopeque.png',
  '/app/inicio/temporizador/multimedia/start.mp3',

  // Xinxinming
  '/app/inicio/xinxinming/audios.html',
  '/app/inicio/xinxinming/comentarios.html',
  // (limpiado) Ruta inexistente en xinxinming
  // '/app/inicio/xinxinming/estadisticas.html',
  '/app/inicio/xinxinming/comentarios/comentarios1.html',
  '/app/inicio/xinxinming/comentarios/comentarios2.html',
  '/app/inicio/xinxinming/comentarios/comentarios3.html',
  '/app/inicio/xinxinming/comentarios/comentarios4.html',
  '/app/inicio/xinxinming/comentarios/comentarios5.html',
  '/app/inicio/xinxinming/comentarios/comentarios6.html',
  '/app/inicio/xinxinming/comentarios/comentarios7.html',
  '/app/inicio/xinxinming/comentarios/comentarios8.html',
  '/app/inicio/xinxinming/comentarios/comentarios9.html',
  '/app/inicio/xinxinming/comentarios/comentarios10.html',
  '/app/inicio/xinxinming/comentarios/comentarios11.html',
  '/app/inicio/xinxinming/comentarios/comentarios12.html',
  '/app/inicio/xinxinming/comentarios/comentarios13.html',
  '/app/inicio/xinxinming/comentarios/comentarios14.html',
  '/app/inicio/xinxinming/comentarios/comentarios15.html',
  '/app/inicio/xinxinming/index.html',
  '/app/inicio/xinxinming/traduccion.html'
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
  if (event.request.url.startsWith(self.location.origin)) {
    // Manejar solicitudes internas
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => caches.match(self.registration.scope + 'index.html')) // Fallback robusto dentro del scope
    );
  } else {
    // Manejar solicitudes externas
    event.respondWith(
      fetch(event.request).catch(() => {
        console.error('Error al obtener recurso externo:', event.request.url);
        return new Response('Contenido no disponible', { status: 503 });
      })
    );
  }
});

// Escuchar cambios en la caché y notificar a la página sobre nuevas versiones
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    self.skipWaiting();
  }
});
