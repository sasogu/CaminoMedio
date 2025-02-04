const CACHE_NAME = 'pwa-cszcm-v3';
const urlsToCache = [
    './',
    './index.html',
    './css/styles.css',
    './js/scripts.js',
    './manifest.json',
    './assets/img/logopeque.png',
    './assets/img/logoblanco.png',
    './assets/img/bg-masthead.jpg',
    './assets/img/bg-signup.jpg',

    // Archivos del temporizador
    './temporizador/index.html',
    './temporizador/guardar.html',
    './temporizador/css/styles.css',
    './temporizador/js/script.js',
    './temporizador/js/guardar.js',
    './temporizador/js/phrases.js',
    './temporizador/multimedia/start.mp3',
    './temporizador/multimedia/end.mp3',
    './temporizador/multimedia/logoblanco.png',
    './temporizador/multimedia/logopeque.png'
];

// Instalar el Service Worker y almacenar en caché los archivos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Archivos en caché.');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting(); // Forzar la activación inmediata del nuevo SW
});

// Interceptar solicitudes y servir archivos desde la caché o la red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Activar el nuevo Service Worker y eliminar cachés antiguas
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Asegurar que el SW se active inmediatamente en todos los clientes
});

// Escuchar cambios en la caché y notificar a la página sobre nuevas versiones
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CHECK_UPDATE') {
        self.skipWaiting();
    }
});

// Enviar una notificación push cuando hay una nueva versión del Service Worker
self.addEventListener('push', (event) => {
    const title = 'Nueva versión disponible';
    const options = {
        body: 'Actualiza la aplicación para disfrutar de las últimas mejoras.',
        icon: './assets/img/logopeque.png',
        badge: './assets/img/logoblanco.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
