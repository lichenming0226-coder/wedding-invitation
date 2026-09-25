'use strict';

const CACHE = 'wedding-invitation-20260925-v1';
const CORE = [
  './',
  './index.html',
  './fonts.css?v=performance-20260925',
  './styles.css?v=performance-20260925',
  './app.js?v=performance-20260925',
  './assets/paper-texture.svg',
  './assets/hand-chinese-20260925.woff2',
  './assets/hand-english-20260925.woff2',
  './assets/italianno-20260925.woff2',
  './assets/lace-ornament-bg-20260925.webp',
  './assets/lace-envelope-20260925.webp',
  './assets/seal-20260925.webp',
  './assets/couple-comic-20260925.webp',
  './assets/envelope-photo-20260925.webp',
  './assets/share-thumbnail-20260925.jpg',
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

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached => {
        const fresh = fetch(request).then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put('./index.html', copy));
          }
          return response;
        }).catch(() => cached);
        return cached || fresh;
      }),
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
