// Service worker: app offline. Aumenta VERSION quando cambi index.html.
const VERSION = "bdd-v6";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png"];
const DATA = ["data/domande.json", "data/risposte.json", "data/glossario.json", "data/modelli.json", "data/puntichiave.json"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(SHELL);
    // I file dati opzionali possono mancare: si ignorano gli errori
    await Promise.all(DATA.map(u => c.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.includes("/data/")) {
    // Dati: prima la rete (così le nuove risposte arrivano subito), poi la cache offline
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      try {
        const r = await fetch(e.request, { cache: "no-cache" });
        if (r.ok) c.put(e.request, r.clone());
        return r;
      } catch {
        return (await c.match(e.request, { ignoreSearch: true })) || new Response("", { status: 404 });
      }
    })());
    return;
  }
  // App: prima la cache, aggiornandola in background
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || (await c.match("index.html")) || new Response("Offline", { status: 503 });
  })());
});
