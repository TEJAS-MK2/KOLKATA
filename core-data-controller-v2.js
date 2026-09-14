(() => {
  'use strict';

  // Single runtime data source: production-bootstrap.js owns window.pandals.
  // This controller deliberately does not maintain a second hard-coded catalog.
  const data = () => Array.isArray(window.pandals) ? window.pandals : [];
  const MAX_STOPS = 8;
  const MODE_KEY = 'kolkata-pujo-mode';
  const ROUTE_KEY = 'kolkata-pujo-route';
  const DONE_KEY = 'kolkata-pujo-completed';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const valid = p => p && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng));
  const mode = () => ['walking','driving','transit'].includes(localStorage.getItem(MODE_KEY)) ? localStorage.getItem(MODE_KEY) : 'walking';
  const maps = p => valid(p) ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}&travelmode=${encodeURIComponent(mode())}` : 'https://www.google.com/maps/dir/?api=1';

  let route = [];
  let done = new Set();
  let nightIndex = 0;
  let map = null;
  let markers = [];

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(ROUTE_KEY) || '[]');
      route = saved.map(x => data().find(p => p.name === x.name)).filter(Boolean).slice(0, MAX_STOPS);
    } catch { route = []; }
    try {
      const saved = JSON.parse(localStorage.getItem(DONE_KEY) || '[]');
      done = new Set(Array.isArray(saved) ? saved : []);
    } catch { done = new Set(); }
  }
  function persist() {
    try {
      localStorage.setItem(ROUTE_KEY, JSON.stringify(route.map(p => ({name:p.name}))));
      localStorage.setItem(DONE_KEY, JSON.stringify([...done]));
    } catch {}
  }
  function inRoute(p) { return !!p && route.some(x => x.name === p.name); }
  function renderStars(r) { const n = Number(r); return n > 0 ? `<span class="stars" aria-label="${n.toFixed(1)} out of 5">★★★★★</span> ${n.toFixed(1)}` : '<span class="stars" aria-label="Not rated">☆☆☆☆☆</span> Not rated'; }

  function renderExplorer() {
    const list = document.querySelector('#pandal-list');
    if (!list) return;
    const query = (document.querySelector('#pandal-search')?.value || '').trim().toLowerCase();
    const zone = document.querySelector('.filter-btn.active')?.dataset.zone || document.querySelector('.filter-btn[aria-pressed="true"]')?.dataset.zone || 'all';
    const items = data().filter(p => (zone === 'all' || !zone || p.zone === zone) && (!query || `${p.name} ${p.area} ${p.zone} ${p.tag}`.toLowerCase().includes(query)));
    list.innerHTML = items.length ? items.map(p => `<article class="pandal-card" data-name="${esc(p.name)}" tabindex="0" aria-label="Explore ${esc(p.name)}"><img src="${esc(p.photo)}" alt="Archive photo associated with ${esc(p.name)}" loading="lazy" onerror="this.style.display='none'"><div class="pandal-card-body"><div class="pandal-meta">${esc(p.zone)} · ${esc(p.area)}</div><h3>${esc(p.name)}</h3><div class="rating">${renderStars(p.rating)}${Number(p.rating)>0 ? ' · Historical visitor rating' : ''}</div><div class="pandal-actions"><button class="view-map" type="button">View map</button><button class="add-route" type="button" data-name="${esc(p.name)}">${inRoute(p) ? 'Added ✓' : route.length >= MAX_STOPS ? 'Route full' : 'Add to route +'}</button><a class="route" href="${maps(p)}" target="_blank" rel="noopener">Directions ↗</a></div></div></article>`).join('') : '<div class="empty-state"><strong>No pandals found.</strong><p>Try another neighbourhood or clear the search.</p></div>';
    list.querySelectorAll('.pandal-card').forEach(card => {
      const p = data().find(x => x.name === card.dataset.name);
      card.addEventListener('click', e => { if (!e.target.closest('a,button')) select(p); });
      card.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) { e.preventDefault(); select(p); } });
    });
    list.querySelectorAll('.view-map').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); select(data().find(p => p.name === b.closest('.pandal-card')?.dataset.name)); }));
    list.querySelectorAll('.add-route').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const p=data().find(x=>x.name===b.dataset.name); if(inRoute(p)) remove(p.name); else add(p); }));
  }

  function select(p) {
    if (!p) return;
    if (map && valid(p)) {
      map.flyTo([Number(p.lat),Number(p.lng)], 15, {duration:.5});
      const item = markers.find(x => x.p.name === p.name); item?.marker.openPopup();
    }
    document.querySelectorAll('.pandal-card').forEach(c => c.classList.toggle('selected', c.dataset.name === p.name));
  }
  window.selectPandal = select;

  function rebuildMap() {
    const host=document.querySelector('#pandal-map');
    if (!host || !window.L) return;
    if (window.kolkataMap) { try { window.kolkataMap.remove(); } catch {} }
    map=window.L.map(host,{scrollWheelZoom:false}).setView([22.5726,88.3639],12);
    window.kolkataMap=map; window.map=map;
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
    markers=data().filter(valid).map(p=>{
      const marker=window.L.marker([Number(p.lat),Number(p.lng)],{title:p.name,alt:p.name}).addTo(map);
      marker.bindPopup(`<strong>${esc(p.name)}</strong><br>${esc(p.area)} · ${esc(p.zone)}<br><button type="button" class="popup-add" data-pandal="${esc(p.name)}">Add to route</button> · <a href="${maps(p)}" target="_blank" rel="noopener">Directions ↗</a>`);
      marker.on('popupopen',()=>document.querySelector(`.popup-add[data-pandal="${CSS.escape(p.name)}"]`)?.addEventListener('click',()=>add(p),{once:true}));
      return {p,marker};
    });
  }

  function routeUrl() {
    if (!route.length) return 'https://www.google.com/maps/dir/?api=1';
    const stops=route.slice(0,MAX_STOPS), last=stops[stops.length-1];
    let u=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${last.lat},${last.lng}`)}&travelmode=${encodeURIComponent(mode())}`;
    const wp=stops.slice(0,-1).map(p=>`${p.lat},${p.lng}`).join('|');
    if(wp) u+=`&waypoints=${encodeURIComponent(wp)}`;
    return u;
  }
  function renderRoute() {
    const count=document.querySelector('#route-count'); if(count) count.textContent=`${route.length} / ${MAX_STOPS}`;
    const wrap=document.querySelector('#route-stops');
    if(wrap) wrap.innerHTML=route.length ? route.map((p,i)=>`<div class="route-stop"><span class="route-stop-index">${i+1}</span><div><strong>${esc(p.name)}</strong><small>${esc(p.area)} · ${esc(p.zone)}</small></div><button class="remove-stop" type="button" data-remove="${esc(p.name)}" aria-label="Remove ${esc(p.name)}">×</button></div>`).join('') : '<div class="empty-state"><strong>Your route is empty.</strong><p>Tap “Add to route” on pandals above.</p></div>';
    wrap?.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>remove(b.dataset.remove)));
    const link=document.querySelector('#open-route'); if(link){link.href=routeUrl();link.setAttribute('aria-disabled',String(!route.length));}
    document.querySelectorAll('.add-route').forEach(b=>{const p=data().find(x=>x.name===b.dataset.name); const added=inRoute(p); b.textContent=added?'Added ✓':route.length>=MAX_STOPS?'Route full':'Add to route +'; b.disabled=added||route.length>=MAX_STOPS;});
    renderNight();
  }
  function add(p){ if(!p||inRoute(p)||route.length>=MAX_STOPS)return false; route.push(p);persist();renderRoute();renderExplorer();return true; }
  function remove(name){route=route.filter(p=>p.name!==name);done.delete(name);nightIndex=Math.min(nightIndex,Math.max(route.length-1,0));persist();renderRoute();renderExplorer();}

  function renderNight(){
    const total=route.length, p=route[nightIndex];
    const label=document.querySelector('#night-stop-label'),name=document.querySelector('#night-stop-name'),area=document.querySelector('#night-stop-area'),bar=document.querySelector('#night-progress-bar'),text=document.querySelector('#night-progress-text'),prev=document.querySelector('#night-prev'),next=document.querySelector('#night-next'),dir=document.querySelector('#night-directions');
    if(!total){if(label)label.textContent='STOP 1 OF 0';if(name)name.textContent='Add stops to begin';if(area)area.textContent='Your selected route will appear here.';if(bar)bar.style.width='0%';if(text)text.textContent='0 / 0 completed';if(prev)prev.disabled=true;if(next)next.disabled=true;return;}
    const complete=route.filter(x=>done.has(x.name)).length;
    if(label)label.textContent=`STOP ${nightIndex+1} OF ${total}${done.has(p.name)?' · VISITED':''}`;
    if(name)name.textContent=p.name;if(area)area.textContent=`${p.area} · ${p.zone} · ${done.has(p.name)?'Marked as visited':'Not visited yet'}`;
    if(bar)bar.style.width=`${Math.round(complete/total*100)}%`;if(text)text.textContent=`${complete} / ${total} completed`;
    if(prev)prev.disabled=nightIndex===0;if(next){next.disabled=false;next.textContent=nightIndex===total-1?'Finish stop ✓':'Next stop →';}if(dir)dir.href=maps(p);
  }

  function bindControls(){
    document.querySelector('#night-prev')?.addEventListener('click',()=>{nightIndex=Math.max(0,nightIndex-1);renderNight();});
    document.querySelector('#night-next')?.addEventListener('click',()=>{if(!route.length)return;if(nightIndex<route.length-1)nightIndex++;else done.add(route[nightIndex].name);persist();renderNight();});
    document.querySelector('#pandal-search')?.addEventListener('input',renderExplorer);
    document.querySelectorAll('.filter-btn').forEach(b=>b.addEventListener('click',()=>setTimeout(renderExplorer,0)));
  }

  function start(){
    if(!Array.isArray(window.pandals)||window.pandals.length<28)return;
    restore();
    // Replace the old core's local 8-item data path with this canonical controller.
    try{Object.defineProperty(window,'routeStops',{configurable:true,get:()=>route});}catch{}
    window.addToRoute=add;window.removeFromRoute=remove;window.routeUrl=routeUrl;
    rebuildMap();renderExplorer();renderRoute();bindControls();
    window.dispatchEvent(new CustomEvent('kolkata:canonical-controller-ready',{detail:{pandals:data().length,markers:markers.length}}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,50),{once:true});else setTimeout(start,50);
})();
