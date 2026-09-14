(()=>{
  'use strict';

  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.site-header nav');
  const menu = document.querySelector('.menu');
  const routeMax = 8;

  const FALLBACK_PANDALS = [
    {name:'Bagbazar Sarbojanin',zone:'North',area:'Bagbazar',lat:22.60121,lng:88.36682,tag:'Heritage favourite',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Bagbazar_Sarbojonin_Durgotsov.jpg',rating:4.8},
    {name:'Kumartuli Park',zone:'North',area:'Kumartuli',lat:22.59913,lng:88.36157,tag:'Artisan quarter',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/DurgaPuja2019_-_Durga_Puja_pandal_of_Kumartoli_Park_in_Kolkata_01.jpg',rating:0},
    {name:'Shobhabazar Rajbari',zone:'North',area:'Shobhabazar',lat:22.5974,lng:88.3672,tag:'Historic puja',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Shobhabazar_Rajbari_Durga_Puja.jpg',rating:0},
    {name:'College Square',zone:'Central',area:'College Street',lat:22.57453,lng:88.36447,tag:'Central Kolkata',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/College_square_puja.jpg',rating:4.9},
    {name:'Santosh Mitra Square',zone:'Central',area:'Sealdah',lat:22.5658,lng:88.3685,tag:'Theme-driven',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Santosh_Mitra_square_Durga_Puja_2025_01.jpg',rating:4.8},
    {name:'Maddox Square',zone:'South',area:'Ballygunge',lat:22.52656,lng:88.35465,tag:'Classic adda',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_With_Her_Family_-_Ballygunge_Durga_Puja_Samiti_-_Maddox_Square_-_Kolkata_2017-09-26_3939.JPG',rating:0},
    {name:'Deshapriya Park',zone:'South',area:'Deshapriya Park',lat:22.51858,lng:88.35346,tag:'South Kolkata',photo:'https://upload.wikimedia.org/wikipedia/commons/f/fe/Durga_Puja_Pandal_-_Ballygunge_Sarbojanin_Durgotsab_-_Deshapriya_Park_-_Kolkata_2017-09-27_4501.JPG',rating:0},
    {name:'Naktala Udayan Sangha',zone:'South',area:'Naktala',lat:22.4643,lng:88.3715,tag:'Neighbourhood favourite',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Idol_Naktala_Udayan_Sangha.jpg',rating:4.5}
  ];
  const getPandals = () => Array.isArray(window.pandals) && window.pandals.length ? window.pandals : FALLBACK_PANDALS;

  let activeZone = 'all';
  let map = null;
  let markers = [];
  let routeStops = [];
  let travelMode = 'walking';
  let nightIndex = 0;
  let completedStops = new Set();

  Object.defineProperty(window, 'routeStops', {configurable:true,get:() => routeStops});
  window.addToRoute = addToRoute;
  window.removeFromRoute = removeFromRoute;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function normalizeMode(mode) { return mode === 'two-wheeler' ? 'driving' : (['walking','driving','transit'].includes(mode) ? mode : 'walking'); }
  function mapsTravelMode() { return normalizeMode(travelMode); }
  function singleDirectionsUrl(pandal) {
    if (!pandal || !Number.isFinite(Number(pandal.lat)) || !Number.isFinite(Number(pandal.lng))) return 'https://www.google.com/maps/dir/?api=1';
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${pandal.lat},${pandal.lng}`)}&travelmode=${encodeURIComponent(mapsTravelMode())}`;
  }
  function routeUrl() {
    if (!routeStops.length) return 'https://www.google.com/maps/dir/?api=1';
    const mobile = window.matchMedia('(max-width: 800px)').matches;
    const start = mobile ? Math.min(nightIndex, routeStops.length - 1) : 0;
    const stops = mobile ? routeStops.slice(start, start + 4) : routeStops;
    const last = stops[stops.length - 1];
    let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${last.lat},${last.lng}`)}&travelmode=${encodeURIComponent(mapsTravelMode())}`;
    const waypoints = stops.slice(0, -1).map(p => `${p.lat},${p.lng}`).join('|');
    if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
    return url;
  }
  function persistNight() { window.KolkataState?.update?.({route:routeStops.map(p => ({name:p.name})),completed:[...completedStops],mode:travelMode}); }
  function restoreState() {
    const state = window.KolkataState?.get?.();
    routeStops = (Array.isArray(state?.route) ? state.route : []).map(item => getPandals().find(p => p.name === item.name)).filter(Boolean).slice(0, routeMax);
    completedStops = new Set(Array.isArray(state?.completed) ? state.completed : []);
    travelMode = ['walking','driving','transit','two-wheeler'].includes(state?.mode) ? state.mode : 'walking';
  }
  function isInRoute(pandal) { return Boolean(pandal && routeStops.some(p => p.name === pandal.name)); }
  function addToRoute(pandal) { if (!pandal || isInRoute(pandal) || routeStops.length >= routeMax) return false; routeStops.push(pandal); persistNight(); renderRoute(); renderNightMode(); return true; }
  function removeFromRoute(name) { routeStops=routeStops.filter(p=>p.name!==name);completedStops.delete(name);nightIndex=Math.min(nightIndex,Math.max(routeStops.length-1,0));persistNight();renderRoute();renderPandalExplorer();renderNightMode(); }
  function renderStars(value) { const rated=Number(value)>0; const label=rated?`${Number(value).toFixed(1)} out of 5`:'Not rated'; return `<span class="stars" aria-label="${label}">${rated?'★★★★★':'☆☆☆☆☆'}</span> ${rated?Number(value).toFixed(1):'Not rated'}`; }
  function filteredPandals() { const query=(document.querySelector('#pandal-search')?.value||'').trim().toLowerCase(); return getPandals().filter(p=>(activeZone==='all'||p.zone===activeZone)&&(!query||`${p.name} ${p.area} ${p.zone} ${p.tag}`.toLowerCase().includes(query))); }
  function selectPandal(pandal) { if(!pandal)return; if(map){map.flyTo([pandal.lat,pandal.lng],15,{duration:.7});markers.find(item=>item.pandal===pandal)?.marker.openPopup()} document.querySelectorAll('.pandal-card').forEach(card=>card.classList.toggle('selected',card.dataset.name===pandal.name)); }
  window.selectPandal=selectPandal;
  function renderPandalExplorer(){
    const list=document.querySelector('#pandal-list');if(!list)return;const items=filteredPandals();
    list.innerHTML=items.length?items.map(p=>`<article class="pandal-card" data-name="${escapeHtml(p.name)}" tabindex="0" aria-label="Explore ${escapeHtml(p.name)}"><img src="${escapeHtml(p.photo)}" alt="Archive photo associated with ${escapeHtml(p.name)}" loading="lazy" onerror="this.style.display='none'"><div class="pandal-card-body"><div class="pandal-meta">${escapeHtml(p.zone)} · ${escapeHtml(p.area)}</div><h3>${escapeHtml(p.name)}</h3><div class="rating">${renderStars(p.rating)}${p.rating?' · Historical visitor rating':''}</div><div class="pandal-actions"><button class="view-map" type="button">View map</button><button class="add-route" type="button" data-name="${escapeHtml(p.name)}">${isInRoute(p)?'Added ✓':routeStops.length>=routeMax?'Route full':'Add to route +'}</button><a class="route" href="${singleDirectionsUrl(p)}" target="_blank" rel="noopener">Directions ↗</a></div></div></article>`).join(''):'<div class="empty-state"><strong>No pandals found.</strong><p>Try another neighbourhood or clear the search.</p></div>';
    list.querySelectorAll('.pandal-card').forEach(card=>{const pandal=getPandals().find(p=>p.name===card.dataset.name);card.addEventListener('click',event=>{if(!event.target.closest('a,button'))selectPandal(pandal)});card.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&!event.target.closest('button')){event.preventDefault();selectPandal(pandal)}})});
    list.querySelectorAll('.view-map').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();selectPandal(getPandals().find(p=>p.name===button.closest('.pandal-card')?.dataset.name))}));
    list.querySelectorAll('.add-route').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();const p=getPandals().find(x=>x.name===button.dataset.name);if(isInRoute(p))removeFromRoute(p.name);else addToRoute(p);renderPandalExplorer()}));
  }
  function initMap(){const host=document.querySelector('#pandal-map');if(!host||!window.L||map)return;map=window.L.map(host,{scrollWheelZoom:false}).setView([22.5726,88.3639],12);window.kolkataMap=map;window.map=map;window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);markers=getPandals().filter(p=>Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lng))).map(p=>{const marker=window.L.marker([p.lat,p.lng],{title:p.name,alt:p.name}).addTo(map);marker.bindPopup(`<strong>${escapeHtml(p.name)}</strong><br>${escapeHtml(p.area)} · ${escapeHtml(p.zone)}<br><button type="button" class="popup-add" data-pandal="${escapeHtml(p.name)}">Add to route</button> · <a href="${singleDirectionsUrl(p)}" target="_blank" rel="noopener">Directions ↗</a>`);marker.on('popupopen',()=>{const button=document.querySelector(`.popup-add[data-pandal="${CSS.escape(p.name)}"]`);button?.addEventListener('click',()=>{if(addToRoute(p))renderPandalExplorer()},{once:true})});return {pandal:p,marker}})}
  function updateRouteLink(){const link=document.querySelector('#open-route');if(!link)return;link.href=routeUrl();link.setAttribute('aria-disabled',String(!routeStops.length));}
  function renderRoute(){const wrap=document.querySelector('#route-stops'),count=document.querySelector('#route-count');if(count)count.textContent=`${routeStops.length} / ${routeMax}`;if(wrap)wrap.innerHTML=routeStops.length?routeStops.map((p,i)=>`<div class="route-stop"><span class="route-stop-index">${i+1}</span><div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.area)} · ${escapeHtml(p.zone)}</small></div><button class="remove-stop" type="button" data-remove="${escapeHtml(p.name)}" aria-label="Remove ${escapeHtml(p.name)}">×</button></div>`).join(''):'<div class="empty-state"><strong>Your route is empty.</strong><p>Tap “Add to route” on pandals above.</p></div>';wrap?.querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>removeFromRoute(button.dataset.remove)));updateRouteLink();document.querySelectorAll('.add-route').forEach(button=>{const pandal=getPandals().find(p=>p.name===button.dataset.name),added=isInRoute(pandal);button.textContent=added?'Added ✓':routeStops.length>=routeMax?'Route full':'Add to route +';button.disabled=added||routeStops.length>=routeMax});refreshRouteIntelligence();}
  function renderNightMode(){const total=routeStops.length,current=routeStops[nightIndex],label=document.querySelector('#night-stop-label'),name=document.querySelector('#night-stop-name'),area=document.querySelector('#night-stop-area'),bar=document.querySelector('#night-progress-bar'),text=document.querySelector('#night-progress-text'),prev=document.querySelector('#night-prev'),next=document.querySelector('#night-next'),directions=document.querySelector('#night-directions');if(!total){if(label)label.textContent='STOP 1 OF 0';if(name)name.textContent='Add stops to begin';if(area)area.textContent='Your selected route will appear here.';if(bar)bar.style.width='0%';if(text)text.textContent='0 / 0 completed';if(directions)directions.href=routeUrl();if(prev)prev.disabled=true;if(next)next.disabled=true;return}nightIndex=Math.min(nightIndex,total-1);const done=completedStops.has(current.name),completedCount=routeStops.filter(p=>completedStops.has(p.name)).length;if(label)label.textContent=`STOP ${nightIndex+1} OF ${total}${done?' · VISITED':''}`;if(name)name.textContent=current.name;if(area)area.textContent=`${current.area} · ${current.zone} · ${done?'Marked as visited':'Not visited yet'}`;if(bar)bar.style.width=`${Math.round((completedCount/total)*100)}%`;if(text)text.textContent=`${completedCount} / ${total} completed`;if(prev)prev.disabled=nightIndex===0;if(next)next.textContent=nightIndex===total-1?'Finish stop ✓':'Next stop →';if(directions)directions.href=singleDirectionsUrl(current);refreshRouteIntelligence();}
  function refreshRouteIntelligence(){const el=document.querySelector('#route-intelligence');if(!el)return;if(!routeStops.length){el.innerHTML='<strong>Route intelligence</strong><p>Add verified stops to see a rough planning estimate.</p>';return}const factor=normalizeMode(travelMode)==='walking'?11:normalizeMode(travelMode)==='transit'?8:5;const minutes=Math.max(0,routeStops.length*factor);el.innerHTML=`<strong>${routeStops.length} stops · ${travelMode}</strong><p>Rough planning estimate only: ${minutes}–${minutes+12} min between stops. Live traffic and crowding are not included.</p>`}
  function initLightbox(){const box=document.querySelector('#lightbox'),image=document.querySelector('#lightbox-image');if(!box||!image)return;const close=()=>box.classList.remove('open');document.querySelectorAll('.gallery-grid .tile').forEach(tile=>tile.addEventListener('click',()=>{const bg=getComputedStyle(tile).backgroundImage,match=bg.match(/url\(["']?(.*?)["']?\)/);if(match?.[1]){image.src=match[1];box.classList.add('open')}}));document.querySelector('#lightbox-close')?.addEventListener('click',close);box.addEventListener('click',event=>{if(event.target===box)close()});document.addEventListener('keydown',event=>{if(event.key==='Escape')close()})}
  function bindUI(){
    document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const selector=link.getAttribute('href');if(!selector||selector==='#')return;const target=document.querySelector(selector);if(!target)return;event.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});if(window.innerWidth<=800&&nav?.dataset.open==='true')menu?.click()}));
    document.querySelector('#pandal-search')?.addEventListener('input',renderPandalExplorer);
    document.querySelectorAll('#pandal-filters .filter-btn').forEach(button=>button.addEventListener('click',()=>{activeZone=button.dataset.zone||'all';document.querySelectorAll('#pandal-filters .filter-btn').forEach(item=>item.classList.toggle('active',item===button));renderPandalExplorer()}));
    document.querySelectorAll('.mode-btn').forEach(button=>{button.classList.toggle('active',button.dataset.mode===travelMode);button.addEventListener('click',()=>{travelMode=button.dataset.mode||'walking';window.KolkataState?.update?.({mode:travelMode});document.querySelectorAll('.mode-btn').forEach(item=>item.classList.toggle('active',item===button));updateRouteLink();renderNightMode();renderPandalExplorer()})});
    document.querySelector('#clear-route')?.addEventListener('click',()=>{routeStops=[];completedStops.clear();nightIndex=0;persistNight();renderRoute();renderPandalExplorer();renderNightMode()});
    document.querySelector('#night-mode-toggle')?.addEventListener('click',()=>{document.querySelector('#night-mode')?.classList.remove('hidden');renderNightMode();document.querySelector('#night-mode')?.scrollIntoView({behavior:'smooth',block:'nearest'})});
    document.querySelector('#night-close')?.addEventListener('click',()=>document.querySelector('#night-mode')?.classList.add('hidden'));
    document.querySelector('#night-prev')?.addEventListener('click',()=>{nightIndex=Math.max(0,nightIndex-1);renderNightMode()});
    document.querySelector('#night-next')?.addEventListener('click',()=>{if(!routeStops.length)return;completedStops.add(routeStops[nightIndex].name);if(nightIndex<routeStops.length-1)nightIndex++;persistNight();renderNightMode()});
    document.querySelector('#night-route')?.addEventListener('click',()=>window.open(routeUrl(),'_blank','noopener'));
    document.querySelector('#night-reset')?.addEventListener('click',()=>{completedStops.clear();nightIndex=0;persistNight();renderNightMode()});
    window.addEventListener('scroll',()=>{const y=window.scrollY;header?.classList.toggle('is-scrolled',y>40);const hero=document.querySelector('.hero-image');if(hero&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)hero.style.transform=`translateY(${Math.min(y*.08,50)}px) scale(1.02)`},{passive:true});
  }
  function boot(){restoreState();bindUI();renderPandalExplorer();initMap();renderRoute();renderNightMode();initLightbox();window.addEventListener('kolkata:state',()=>{const state=window.KolkataState?.get?.();if(!state)return;routeStops=(Array.isArray(state.route)?state.route:[]).map(item=>getPandals().find(p=>p.name===item.name)).filter(Boolean).slice(0,routeMax);completedStops=new Set(Array.isArray(state.completed)?state.completed:[]);travelMode=state.mode||travelMode;renderPandalExplorer();renderRoute();renderNightMode()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
