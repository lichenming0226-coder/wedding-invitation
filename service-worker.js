'use strict';

const CACHE = 'wedding-invitation-20260927-v15';
const MEDIA_CACHE = 'wedding-invitation-media-20260927-v15';
const COS_ORIGIN = 'https://wedding-invitation-1452764663.cos.ap-shanghai.myqcloud.com';
const WARM_MEDIA = [
  `${COS_ORIGIN}/assets/assets/lace-ornament-bg-20260925.webp`,
  `${COS_ORIGIN}/assets/assets/seal-20260925.webp`,
  `${COS_ORIGIN}/assets/assets/couple-comic-20260925.webp`,
];
const NAVIGATION_FALLBACK = './index.html?v=repeat-cache-v1-20260927';
const CORE = [
  NAVIGATION_FALLBACK,
  './fonts.css?v=github-cos-v2-20260927',
  './styles.css?v=github-cos-v2-20260927',
  './app.js?v=repeat-cache-v1-20260927',
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
        keys
          .filter(key => key.startsWith('wedding-invitation-') && ![CACHE, MEDIA_CACHE].includes(key))
          .map(key => caches.delete(key)),
      )),
      caches.open(MEDIA_CACHE).then(cache => Promise.allSettled(
        WARM_MEDIA.map(async url => {
          const request = new Request(url, { mode: 'no-cors', credentials: 'omit' });
          if (await cache.match(request)) return;
          const response = await fetch(request);
          if (response.ok || response.type === 'opaque') await cache.put(request, response);
        }),
      )),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin === COS_ORIGIN && request.destination === 'image') {
    const mediaResponse = caches.open(MEDIA_CACHE).then(async cache => {
      const cached = await cache.match(request);
      if (cached) return { response: cached };
      const response = await fetch(request);
      const cacheCopy = response.ok || response.type === 'opaque' ? response.clone() : null;
      return { response, cache, cacheCopy };
    });
    event.respondWith(mediaResponse.then(result => result.response));
    event.waitUntil(mediaResponse.then(result => {
      if (result.cacheCopy) return result.cache.put(request, result.cacheCopy);
    }));
    return;
  }

  if (url.origin !== self.location.origin || url.pathname.endsWith('.m4a')) return;

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
