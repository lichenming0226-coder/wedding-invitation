'use strict';

const CACHE = 'wedding-invitation-20260926-v12';
const NAVIGATION_FALLBACK = './index.html';
const CORE = [
  NAVIGATION_FALLBACK,
  './fonts.css?v=thin-tagline-20260925',
  './styles.css?v=loading-hearts-v2-20260925',
  './app.js?v=loading-hearts-v2-20260925',
  './assets/assets/paper-texture.svg',
  './assets/assets/hand-chinese-20260925.woff2',
  './assets/assets/hand-english-20260925.woff2',
  './assets/assets/italianno-20260925.woff2',
  './assets/assets/italianno-journey-20260925.woff2',
  './assets/assets/lace-ornament-bg-20260925.webp',
  './assets/assets/lace-envelope-20260925.webp',
  './assets/assets/seal-20260925.webp',
  './assets/assets/couple-comic-20260925.webp',
  './assets/assets/envelope-photo-20260925.webp',
  './assets/assets/share-thumbnail-original-20260925.jpg',
  './assets/assets/favicon-20260925.png',
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
            caches.open(CACHE).then(cache => cache.put(NAVIGATION_FALLBACK, copy));
          }
          return response;
        })
        .catch(() => caches.match(NAVIGATION_FALLBACK)),
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
