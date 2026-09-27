'use strict';

const CACHE = 'wedding-invitation-20260927-v14';
const NAVIGATION_FALLBACK = './index.html?v=github-cos-v2-20260927';
const CORE = [
  NAVIGATION_FALLBACK,
  './fonts.css?v=github-cos-v2-20260927',
  './styles.css?v=github-cos-v2-20260927',
  './app.js?v=github-cos-v2-20260927',
  './assets/hand-chinese-20260925.woff2',
  './assets/hand-english-20260925.woff2',
  './assets/italianno-20260925.woff2',
  './assets/italianno-journey-20260925.woff2',
  './assets/lace-envelope-20260925.webp',
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
