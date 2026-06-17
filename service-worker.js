const CACHE_NAME = 'ali-wc-v1g';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/app.css?v=v1k2',
  './assets/js/app.js?v=v1k2',
  './assets/data/matches.json',
  './assets/data/meta.json',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png'
];

// حدث التثبيت - تخزين الأصول الأساسية مؤقتاً
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching local app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((err) => {
        // عدم تعطيل التطبيق إذا فشل التخزين المؤقت
        console.warn('[Service Worker] Pre-caching failed silently:', err);
      })
  );
  self.skipWaiting();
});

// حدث التنشيط - تنظيف الكاش القديم المتوافق مع بادئة ali-wc-
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('ali-wc-') && cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// حدث جلب الموارد - استراتيجية الشبكة أولاً مع الرجوع للكاش عند انقطاع الاتصال
self.addEventListener('fetch', (event) => {
  // تجاهل الطلبات التي ليست من نوع GET
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  // قصر الكاش على الموارد المحلية فقط وتجاهل الموارد الخارجية
  if (url.origin !== self.location.origin) return;

  // معالجة ملفات البيانات المباشرة بدون كاش أو حفظ في الكاش
  if (url.pathname.includes('/assets/data/live/')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => {
          // بديل طوارئ من الكاش في حال انقطاع الشبكة بالكامل
          return caches.match(event.request, { ignoreSearch: true });
        })
    );
    return;
  }

  // معالجة طلبات التنقل (index.html) كـ Network-first لمنع تجميد واجهة التطبيق القديمة
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseCopy);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request, { ignoreSearch: true })
            .then((cachedResponse) => {
              if (cachedResponse) return cachedResponse;
              return caches.match('./index.html').then((indexResponse) => {
                if (indexResponse) return indexResponse;
                return caches.match('./');
              });
            });
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // تحديث الكاش بالاستجابة الجديدة إذا كانت ناجحة
        if (response && response.status === 200 && response.type === 'basic') {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseCopy);
          });
        }
        return response;
      })
      .catch(() => {
        // استدعاء من الكاش عند تعذر الاتصال بالشبكة
        return caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // السماح بالفشل الطبيعي للطلبات غير المخزنة دون تجميد الواجهة
        });
      })
  );
});
