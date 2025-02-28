const CACHE_NAME = 'cozy-pomodoro-cache-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/timer.js',
    '/js/tasks.js',
    '/js/settings.js',
    '/js/stats.js',
    '/js/ambient.js',
    '/assets/sounds/timer-complete.mp3',
    '/assets/sounds/rain.mp3',
    '/assets/sounds/forest.mp3',
    '/assets/sounds/waves.mp3',
    '/assets/sounds/lofi.mp3',
    '/assets/images/forest-bg.jpg',
    '/assets/images/cabin-bg.jpg',
    '/assets/images/lofi-bg.jpg',
    '/assets/images/achievements/achievement-1.png',
    '/assets/images/achievements/achievement-2.png',
    '/assets/images/achievements/achievement-3.png',
    '/assets/icons/favicon.png',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS);
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if found
                if (response) {
                    return response;
                }
                
                // Otherwise fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response as it can only be consumed once
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // If both cache and network fail, return a fallback
                        if (event.request.url.indexOf('.html') > -1) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});
