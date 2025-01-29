const CACHE_NAME = 'pwa-cszcm-v1';
const urlsToCache = [
    './',
    './index.html',
    './css/styles.css',
    './script.js',
    './assetes/img/logopeque.png',
    './assetes/img/logoblanco.png',
    './assets/img/bg-masthead.jpg',
    './assets/img/bg-signup.jpg',
];

// Instalar el Service Worker y almacenar en caché los archivos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Archivos en caché.');
            return cache.addAll(urlsToCache);
        })
    );
});

// Interceptar solicitudes y servir archivos desde la caché
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Actualizar el Service Worker
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
});

