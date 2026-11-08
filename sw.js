/* ============================================================
   ARIS · Service Worker — soporte offline de la PWA
   ============================================================ */
"use strict";

var VERSION = "aris-v1.0.0";

var CORE_CACHE = "aris-core-" + VERSION;
var AUDIO_CACHE = "aris-audio-" + VERSION + ".1";

/* App shell: todo lo necesario para arrancar sin red. */
var CORE_ASSETS = [
  "./",
  "index.html",
  "app.html",
  "landing.html",
  "landing.css",
  "landing.js",
  "manifest.json",
  "styles.css",
  "app-mobile.css",
  "app.js",
  "pwa.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-192.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png"
];

/* Audios de la asistente por voz: se cachean en segundo plano
   (no bloquean la instalación si pesan). */
var AUDIO_ASSETS = [
  "audio/voz-bienvenida.mp3",
  "audio/voz-sismo.mp3",
  "audio/voz-ambulancia.mp3",
  "audio/voz-rcp.mp3",
  "audio/voz-atrapado.mp3",
  "audio/voz-alerta.mp3",
  "audio/voz-detener.mp3",
  "audio/voz-reanudar.mp3"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then(function (cache) {
        return cache.addAll(CORE_ASSETS);
      })
      .then(function () {
        return caches.open(AUDIO_CACHE);
      })
      .then(function (cache) {
        /* addAll aborta todo si un archivo falla; cacheamos uno por uno. */
        return Promise.all(
          AUDIO_ASSETS.map(function (url) {
            return cache.add(url).catch(function () {
              /* El audio se seguirá cacheando en tiempo de uso. */
            });
          })
        );
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  var keep = [CORE_CACHE, AUDIO_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            if (keep.indexOf(key) === -1) return caches.delete(key);
          })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;

  if (request.method !== "GET") return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  /* Navegación: app primero, fallback a la app shell si no hay red. */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          return response;
        })
        .catch(function () {
          return caches.match("app.html").then(function (cached) {
            return cached || caches.match("./") || caches.match("index.html");
          });
        })
    );
    return;
  }

  /* Audios: cache-first con respaldo en tiempo de uso. */
  if (url.pathname.indexOf("/audio/") !== -1) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(function (cache) {
        return cache.match(request).then(function (cached) {
          if (cached) return cached;
          return fetch(request)
            .then(function (response) {
              if (response && response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(function () {
              return cached;
            });
        });
      })
    );
    return;
  }

  /* Resto de assets propios: cache-first + actualización en segundo plano. */
  event.respondWith(
    caches.match(request).then(function (cached) {
      var network = fetch(request)
        .then(function (response) {
          if (response && response.status === 200) {
            var copy = response.clone();
            caches.open(CORE_CACHE).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return response;
        })
        .catch(function () {
          return cached;
        });
      return cached || network;
    })
  );
});
