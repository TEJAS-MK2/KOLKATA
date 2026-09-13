(() => {
  'use strict';
  const start=()=>{
    const old=document.querySelector('#pandal-map'); if(!old||!window.L)return;
    const pins=[...document.querySelectorAll('#pandal-list .pandal-card[data-lat][data-lng]')].map(c=>({name:c.dataset.name,lat:Number(c.dataset.lat),lng:Number(c.dataset.lng),area:c.querySelector('.pandal-meta')?.textContent||'',source:c.querySelector('.pin-status')?.textContent||''})).filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng));
    const fresh=old.cloneNode(false); old.replaceWith(fresh); fresh.style.height='100%';
    const map=L.map(fresh,{scrollWheelZoom:false,preferCanvas:true,zoomControl:true,fadeAnimation:false,zoomAnimation:false}).setView([22.5726,88.3639],12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
    const draw=()=>{const group=window.L.MarkerClusterGroup?L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:48,disableClusteringAtZoom:15}):L.layerGroup();pins.forEach(p=>{const m=L.marker([p.lat,p.lng],{title:p.name,alt:p.name});m.bindPopup(`<strong>${p.name}</strong><br><small>${p.area}</small><br><span>${p.source}</span><br><a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=${encodeURIComponent(localStorage.getItem('kolkata-pujo-mode')||'walking')}">Directions ↗</a> · <button type="button" data-hot-route="${p.name.replace(/"/g,'&quot;')}">Add to route</button>`);group.addLayer(m)});map.addLayer(group);return map};
    const m=draw(); window.setTimeout(()=>m.invalidateSize(false),150); window.setTimeout(()=>m.invalidateSize(false),900);
  };
  const load=()=>{if(window.L?.MarkerClusterGroup){start();return}const s=document.createElement('script');s.src='https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';s.onload=start;document.head.appendChild(s)};
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-hot-route]');if(b){const p=[...document.querySelectorAll('#pandal-list .pandal-card')].find(c=>c.dataset.name===b.dataset.hotRoute);if(p&&window.addToRoute)window.addToRoute({name:p.dataset.name,lat:Number(p.dataset.lat),lng:Number(p.dataset.lng),area:p.querySelector('.pandal-meta')?.textContent||'',zone:'',photo:p.querySelector('img')?.src||''})}});
  setTimeout(load,5200);
})();
