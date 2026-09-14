(() => {
  'use strict';
  const KEY='kolkata-puja-2026-suite-v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v));window.dispatchEvent(new CustomEvent('kolkata:state',{detail:v}))}catch{}};
  const state=read(); state.visited=state.visited||[]; state.route=state.route||[]; state.passport=state.passport||[];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const all=()=>Array.isArray(window.pandals)?window.pandals:[];
  const syncRouteState=()=>{state.route=Array.isArray(window.routeStops)?window.routeStops.map(p=>({name:p.name,lat:p.lat,lng:p.lng})):state.route;write(state)};
  function nearest(){
    if(!navigator.geolocation)return alert('Location is not available in this browser.');
    navigator.geolocation.getCurrentPosition(pos=>{
      const {latitude:lat,longitude:lng}=pos.coords;
      const ranked=all().filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lng)).map(p=>({...p,distance:Math.hypot((p.lat-lat)*111,(p.lng-lng)*103)})).sort((a,b)=>a.distance-b.distance).slice(0,5);
      openPanel('Near me',ranked.map(p=>`<article class="suite-item"><strong>${esc(p.name)}</strong><span>${(p.distance*1000).toFixed(0)} m approx.</span><button data-pandal="${esc(p.name)}">View on map</button></article>`).join('')||'<p>No verified nearby pins are available yet.</p>');
    },()=>alert('Location permission was not granted. You can still use the search and route tools.'));
  }
  function addRoute(name){
    const p=all().find(x=>x.name===name); if(!p)return;
    if(typeof window.addToRoute==='function'){window.addToRoute(p);syncRouteState();}else if(!state.route.some(x=>x.name===name)){state.route.push({name:p.name,lat:p.lat,lng:p.lng});write(state)}
    renderRoute();
  }
  function removeRoute(name){
    if(typeof window.removeFromRoute==='function')window.removeFromRoute(name);
    state.route=state.route.filter(x=>x.name!==name);write(state);renderRoute();
  }
  function renderRoute(){
    const box=document.querySelector('#suite-route-list'); if(!box)return;
    box.innerHTML=state.route.length?state.route.map((p,i)=>`<div class="suite-route-row"><span><b>${i+1}</b> ${esc(p.name)}</span><button data-remove-route="${esc(p.name)}">Remove</button></div>`).join(''):'<p class="suite-muted">Add verified pins from the Explorer to build a route.</p>';
    box.querySelectorAll('[data-remove-route]').forEach(b=>b.onclick=()=>removeRoute(b.dataset.removeRoute));
    updateStats();
    const r=document.querySelector('#suite-open-route');if(r)r.href=routeLink();
  }
  function routeLink(){
    const route=Array.isArray(window.routeStops)&&window.routeStops.length?window.routeStops:state.route;
    if(route.length<1)return '#';
    const pts=route.map(p=>`${p.lat},${p.lng}`).join('/');
    return `https://www.google.com/maps/dir/${pts}`;
  }
  function toggleVisited(name){
    state.visited=state.visited.includes(name)?state.visited.filter(x=>x!==name):state.visited.concat(name);write(state);updateStats();renderPassport();
  }
  function updateStats(){
    const el=document.querySelector('#suite-stats'); if(el)el.textContent=`${state.visited.length} visited · ${state.route.length} in route`;
  }
  function renderPassport(){
    const box=document.querySelector('#suite-passport-list');if(!box)return;
    const names=state.visited.slice().reverse();
    box.innerHTML=names.length?names.map(n=>`<div class="suite-passport-row"><span>${esc(n)}</span><button data-unvisit="${esc(n)}">Undo</button></div>`).join(''):'<p class="suite-muted">Your Puja Passport is empty. Mark a pandal visited from its card.</p>';
    box.querySelectorAll('[data-unvisit]').forEach(b=>b.onclick=()=>toggleVisited(b.dataset.unvisit));
  }
  function openPanel(title,body){
    let panel=document.querySelector('#puja-suite-panel');if(!panel){panel=document.createElement('dialog');panel.id='puja-suite-panel';panel.className='suite-dialog';document.body.appendChild(panel)}
    panel.innerHTML=`<div class="suite-head"><div><small>কলকাতা দুর্গাপূজা · ২০২৬</small><h2>${esc(title)}</h2></div><button data-close aria-label="Close">×</button></div><div class="suite-body">${body}</div>`;
    panel.querySelector('[data-close]').onclick=()=>panel.close();
    panel.querySelectorAll('[data-pandal]').forEach(b=>b.onclick=()=>{const p=all().find(x=>x.name===b.dataset.pandal);if(p&&typeof window.selectPandal==='function'){panel.close();window.selectPandal(p)}});
    if(typeof panel.showModal==='function')panel.showModal();else panel.setAttribute('open','');
  }
  function toolkit(){
    syncRouteState();
    const route=`<section class="suite-card"><div class="suite-card-head"><div><small>SMART ROUTE</small><h3>Your Puja Route</h3></div><span id="suite-stats"></span></div><div id="suite-route-list"></div><div class="suite-actions"><a class="suite-primary" href="${routeLink()}" target="_blank" rel="noopener" id="suite-open-route">Open route in Maps ↗</a><button id="suite-clear-route">Clear route</button></div></section>`;
    const passport=`<section class="suite-card"><div class="suite-card-head"><div><small>PUJA PASSPORT</small><h3>Places you've visited</h3></div></div><div id="suite-passport-list"></div></section>`;
    openPanel('Puja Toolkit',`${route}${passport}<section class="suite-grid"><button class="suite-tool" id="suite-near">Near me</button><button class="suite-tool" id="suite-focus">Verified pins</button><button class="suite-tool" id="suite-food">Food nearby</button><button class="suite-tool" id="suite-help">Visitor help</button></section>`);
    renderRoute();renderPassport();updateStats();
    document.querySelector('#suite-clear-route').onclick=()=>{if(typeof window.removeFromRoute==='function'&&Array.isArray(window.routeStops))window.routeStops.slice().forEach(p=>window.removeFromRoute(p.name));state.route=[];write(state);renderRoute();const x=document.querySelector('#suite-open-route');if(x)x.href='#'};
    document.querySelector('#suite-near').onclick=nearest;
    document.querySelector('#suite-focus').onclick=()=>{document.querySelector('#puja-suite-panel')?.close();document.querySelector('#pandal-map')?.scrollIntoView({behavior:'smooth',block:'center'})};
    document.querySelector('#suite-food').onclick=()=>openPanel('Food nearby','<p>Use Google Maps to find food around Kolkata Puja venues. The site does not invent restaurant listings.</p><a class="suite-primary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/food+near+Durga+Puja+pandal+Kolkata">Find food in Maps ↗</a>');
    document.querySelector('#suite-help').onclick=()=>openPanel('Visitor help','<div class="suite-help"><b>Emergency</b><span>Police 112 · Ambulance 108 · Fire 101</span><b>Good practice</b><span>Keep valuables secure, follow crowd-control barriers, and use official directions when available.</span></div>');
  }
  function inject(){
    if(document.querySelector('#puja-suite-launcher'))return;
    const style=document.createElement('style');style.textContent=`.suite-dialog{width:min(720px,calc(100vw - 24px));max-height:88vh;border:1px solid rgba(216,173,98,.3);border-radius:22px;padding:0;background:#181512;color:#f7f4ee;box-shadow:0 30px 90px rgba(0,0,0,.45)}.suite-dialog::backdrop{background:rgba(10,8,6,.62);backdrop-filter:blur(5px)}.suite-head{display:flex;justify-content:space-between;gap:20px;padding:22px 22px 16px;border-bottom:1px solid rgba(247,244,238,.1)}.suite-head small,.suite-card-head small{letter-spacing:.12em;opacity:.55}.suite-head h2,.suite-card h3{margin:5px 0 0}.suite-head button{width:38px;height:38px;border:0;border-radius:50%;font-size:24px;background:rgba(255,255,255,.08);color:inherit}.suite-body{padding:18px;overflow:auto}.suite-card{border:1px solid rgba(247,244,238,.1);border-radius:16px;padding:15px;margin-bottom:12px;background:rgba(255,255,255,.035)}.suite-card-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.suite-card-head h3{font-size:17px}.suite-card-head span,.suite-muted{font-size:11px;opacity:.55}.suite-route-row,.suite-passport-row,.suite-item{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:12px}.suite-route-row b{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#d8ad62;color:#181512;margin-right:7px}.suite-route-row button,.suite-passport-row button,.suite-item button,.suite-card button{border:1px solid rgba(255,255,255,.14);background:transparent;color:inherit;border-radius:9px;padding:7px 9px;font-size:11px}.suite-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.suite-primary{display:inline-flex;align-items:center;text-decoration:none;background:#d8ad62;color:#181512;border-radius:10px;padding:9px 12px;font-size:11px;font-weight:700}.suite-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.suite-tool{padding:15px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.035);color:inherit;border-radius:13px;text-align:left}.suite-help{display:grid;gap:7px}.suite-help span{font-size:13px;opacity:.72;margin-bottom:8px}@media(max-width:520px){.suite-dialog{width:calc(100vw - 12px);border-radius:17px}.suite-body{padding:12px}.suite-grid{grid-template-columns:1fr}.suite-route-row span{max-width:65%}}`;
    document.head.appendChild(style);
    const b=document.createElement('button');b.id='puja-suite-launcher';b.type='button';b.textContent='Puja Toolkit';b.setAttribute('aria-label','Open Puja Toolkit');b.onclick=toolkit;b.style.cssText='position:fixed;right:16px;bottom:16px;z-index:1200;border:1px solid rgba(216,173,98,.5);background:#181512;color:#f7f4ee;border-radius:999px;padding:11px 15px;font:600 12px system-ui;box-shadow:0 10px 28px rgba(0,0,0,.22);cursor:pointer';document.body.appendChild(b);
    document.querySelectorAll('#pandal-list .pandal-card').forEach(card=>decorateCard(card));
  }
  function decorateCard(card){
    if(card.dataset.suiteReady)return;card.dataset.suiteReady='1';const name=card.dataset.name;if(!name)return;
    const actions=card.querySelector('.pandal-actions');if(!actions)return;
    const v=document.createElement('button');v.type='button';v.className='suite-visit';v.textContent=state.visited.includes(name)?'Visited ✓':'Mark visited';v.onclick=e=>{e.stopPropagation();toggleVisited(name);v.textContent=state.visited.includes(name)?'Visited ✓':'Mark visited'};actions.appendChild(v);
    const p=all().find(x=>x.name===name);if(p?.lat&&p?.lng&&!actions.querySelector('.catalog-route,.add-route,.suite-route-add')){const r=document.createElement('button');r.type='button';r.className='suite-route-add';r.textContent=state.route.some(x=>x.name===name)?'In route ✓':'Add to route +';r.onclick=e=>{e.stopPropagation();addRoute(name);r.textContent='In route ✓'};actions.appendChild(r)}
  }
  function observe(){const list=document.querySelector('#pandal-list');if(list){new MutationObserver(()=>list.querySelectorAll('.pandal-card').forEach(decorateCard)).observe(list,{childList:true})}}
  function boot(){inject();observe();window.addEventListener('kolkata:state',()=>{document.querySelectorAll('#pandal-list .pandal-card').forEach(decorateCard);syncRouteState()});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1800),{once:true});else setTimeout(boot,1800);
})();
