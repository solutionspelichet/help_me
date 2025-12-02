const CACHE_NAME = 'support-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com' // Cache du CDN CSS
];

// Installation
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activation (Nettoyage des vieux caches)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// Stratégie de cache : Network First (pour avoir toujours la version fraîche du formulaire)
// Si pas de réseau, on sert le cache.
self.addEventListener('fetch', (e) => {
  // On ne cache pas les appels API vers Google Apps Script
  if (e.request.url.includes('script.google.com')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
