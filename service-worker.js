// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = "pwa-cszcm-v7.1.1";
const OFFLINE_URLS = 
[
  './',
  './index.html',
  './css/styles.css',
  './js/scripts.js',
  './manifest.json',
  './assets/img/bg-masthead.jpg',
  './assets/img/bg-signup.jpg',
  './assets/img/logoblanco.png',
  './assets/img/logopeque.png',
  './temporizador/css/styles.css',
  './temporizador/guardar.html',
  './temporizador/index.html',
  './temporizador/js/guardar.js',
  './temporizador/js/phrases.js',
  './temporizador/js/script.js',
  './temporizador/multimedia/end.mp3',
  './temporizador/multimedia/logoblanco.png',
  './temporizador/multimedia/logopeque.png',
  './temporizador/multimedia/start.mp3',
  './xinxinming/audios.html',
  './xinxinming/comentarios.html',
  './xinxinming/comentarios/comentarios1.html',
  './xinxinming/comentarios/comentarios10.html',
  './xinxinming/comentarios/comentarios11.html',
  './xinxinming/comentarios/comentarios12.html',
  './xinxinming/comentarios/comentarios13.html',
  './xinxinming/comentarios/comentarios14.html',
  './xinxinming/comentarios/comentarios15.html',
  './xinxinming/comentarios/comentarios2.html',
  './xinxinming/comentarios/comentarios3.html',
  './xinxinming/comentarios/comentarios4.html',
  './xinxinming/comentarios/comentarios5.html',
  './xinxinming/comentarios/comentarios6.html',
  './xinxinming/comentarios/comentarios7.html',
  './xinxinming/comentarios/comentarios8.html',
  './xinxinming/comentarios/comentarios9.html',
  './xinxinming/index.html',
  './xinxinming/traduccion.html'



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
      }).catch(() => caches.match('./index.html')) // En caso de error, redirige a una página offline
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