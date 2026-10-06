'use strict';

const CACHE = 'wedding-invitation-20261006-v30';
const MEDIA_CACHE = 'wedding-invitation-media-20261006-v20';
const COS_ORIGIN = 'https://wedding-invitation-1452764663.cos.ap-shanghai.myqcloud.com';
const MEDIA_URLS = [
  `${COS_ORIGIN}/assets/assets/lace-ornament-bg-20260925.webp`,
  `${COS_ORIGIN}/assets/assets/seal-20260925.webp`,
  new URL('./assets/envelope-photo-fast-20261006.webp', self.location).href,
  `${COS_ORIGIN}/assets/assets/fountain-birds-20260925.webp`,
  `${COS_ORIGIN}/assets/assets/oval-lace-20260925.webp`,
  new URL('./assets/gallery-new-color-20261006.webp', self.location).href,
  new URL('./assets/gallery-new-bw-20261006.webp', self.location).href,
  ...Array.from(
    { length: 20 },
    (_, index) => `${COS_ORIGIN}/assets/assets/gallery-${String(index + 1).padStart(2, '0')}-20260925.webp`,
  ),
];
const NAVIGATION_FALLBACK = './index.html?v=fast-first-v1-20260927';
const CORE = [
  NAVIGATION_FALLBACK,
  './fonts.css?v=poem-tabs-v1-20261006',
  './styles.css?v=loader-progress-v1-20261006',
  './app.js?v=loader-progress-v1-20261006',
  './assets/hand-chinese-20260925.woff2',
  './assets/hand-chinese-copy-20261006.woff2',
  './assets/hand-english-20260925.woff2',
  './assets/italianno-20260925.woff2',
  './assets/italianno-journey-20260925.woff2',
  './assets/lace-envelope-fast-20261006.webp',
  './assets/seal-20260925.webp',
  './assets/cat-toast-relaxed-white-20261005.webp',
  './assets/share-thumbnail-original-20260925.jpg',
  './assets/favicon-20260925.png',
];

const isCacheableMediaUrl = value => {
  try {
    const url = new URL(value, self.location.origin);
    return [COS_ORIGIN, self.location.origin].includes(url.origin) && url.pathname.endsWith('.webp');
  } catch {
    return false;
  }
};

async function warmMedia(urls, concurrency = 3) {
  const queue = [...new Set(urls)]
    .filter(isCacheableMediaUrl)
    .map(value => new URL(value, self.location.origin).href);
  const cache = await caches.open(MEDIA_CACHE);
  const result = { total: queue.length, cached: 0, stored: 0, failed: 0 };
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < queue.length) {
      const url = queue[nextIndex++];
      const request = new Request(url, { mode: 'no-cors', credentials: 'omit', cache: 'force-cache' });
      try {
        if (await cache.match(request)) {
          result.cached += 1;
          continue;
        }
        const response = await fetch(request);
        if (response.ok || response.type === 'opaque') {
          await cache.put(request, response);
          result.stored += 1;
        } else {
          result.failed += 1;
        }
      } catch {
        result.failed += 1;
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
  return result;
}

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
      self.clients.claim(),
    ]),
  );
});

self.addEventListener('message', event => {
  if (event.data?.type !== 'warm-media') return;
  const urls = Array.isArray(event.data.urls) ? event.data.urls : MEDIA_URLS;
  const warming = warmMedia(urls).then(result => {
    if (event.ports[0]) event.ports[0].postMessage(result);
  });
  event.waitUntil(warming);
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
