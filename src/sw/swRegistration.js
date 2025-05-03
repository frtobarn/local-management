// Funcionalidad Offline con Service Worker
// src/sw/swRegistration.js
export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registrado:', registration);
            })
            .catch((error) => {
                console.error('Error al registrar el Service Worker:', error);
            });
    }
};
