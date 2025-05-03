// Funcionalidad Offline con Service Worker
// src/sw/service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('library-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/static/js/bundle.js',
                '/static/js/vendors~main.chunk.js',
                '/static/js/main.chunk.js',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
