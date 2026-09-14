const CACHE='kolkata-puja-2026-v3';
const CORE=['/KOLKATA/','/KOLKATA/index.html','/KOLKATA/styles.css','/KOLKATA/puja-assets.css','/KOLKATA/site.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put('/KOLKATA/',copy));return res}).catch(()=>caches.match('/KOLKATA/')));return}e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy))}return res})));});
