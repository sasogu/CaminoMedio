const CACHE_NAME = 'pwa-cszcm-v4';
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

// Guardar páginas offline
const OFFLINE_URLS = [
    'https://www.caminomedio.org/agenda/', // Reemplaza con tus URL
    'https://www.caminomedio.org/cursos/',
    'https://www.caminomedio.org/dharma-digital/',
    'https://www.caminomedio.org/forums/forum/general/',
    'https://www.caminomedio.org/sangha-online/',
    'https://www.caminomedio.org/dharma-digital/dokusan/'
];

// Instalación del Service Worker y almacenamiento de contenido externo
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(OFFLINE_URLS).catch((error) => {
                console.error('Error al agregar URLs al caché:', error);
            });
        })
    );
});

// Interceptar solicitudes de red
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
            }).catch(() => caches.match('index.html')) // En caso de error, redirige a una página offline
        );
    } else {
        // Manejar solicitudes externas
        event.respondWith(
            fetch(event.request).then((response) => {
                return response;
            }).catch(() => {
                // Opcional: Manejar errores para solicitudes externas
                console.error('Error al obtener recurso externo:', event.request.url);
            })
        );
    }
});

// Activar el Service Worker y eliminar cachés antiguas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            );
        })
    );
});