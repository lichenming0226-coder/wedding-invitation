'use strict';

const CACHE = 'wedding-invitation-20260925-v8';
const CORE = [
  './?v=full-bgm-20260925',
  './fonts.css?v=thin-tagline-20260925',
  './styles.css?v=thin-tagline-20260925',
  './app.js?v=music-unlock-20260925',
  './assets/paper-texture.svg',
  './assets/hand-chinese-20260925.woff2',
  './assets/hand-english-20260925.woff2',
  './assets/italianno-20260925.woff2',
  './assets/italianno-journey-20260925.woff2',
  './assets/lace-ornament-bg-20260925.webp',
  './assets/lace-envelope-20260925.webp',
  './assets/seal-20260925.webp',
  './assets/couple-comic-20260925.webp',
  './assets/envelope-photo-20260925.webp',
  './assets/share-thumbnail-original-20260925.jpg',
  './assets/favicon-20260925.png',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(
        keys.filter(key => key.startsWith('wedding-invitation-') && key !== CACHE).map(key => caches.delete(key)),
      )),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('.m4a')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put('./?v=full-bgm-20260925', copy));
          }
          return response;
        })
        .catch(() => caches.match('./?v=full-bgm-20260925')),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
