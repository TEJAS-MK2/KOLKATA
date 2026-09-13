const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (header) {
    header.classList.toggle('is-scrolled', y > 40);
    header.style.transition = 'background .25s ease, box-shadow .25s ease';
  }
  const hero = document.querySelector('.hero-image');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) hero.style.transform = `translateY(${Math.min(y * 0.08, 50)}px) scale(1.02)`;
}, { passive: true });

const nav = document.querySelector('nav');
const menu = document.querySelector('.menu');
menu?.addEventListener('click', () => {
  const open = nav.dataset.open === 'true';
  nav.dataset.open = String(!open);
  menu.setAttribute('aria-expanded', String(!open));
  nav.style.display = open ? '' : 'flex';
  if (!open) { nav.style.position='absolute'; nav.style.top='72px'; nav.style.right='6vw'; nav.style.flexDirection='column'; nav.style.padding='18px 22px'; nav.style.background='rgba(18,10,8,.96)'; nav.style.border='1px solid rgba(243,234,217,.15)'; }
});

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' });
  if (window.innerWidth <= 800 && nav.dataset.open === 'true') menu?.click();
}));

const pandals = [
  {name:'Bagbazar Sarbojanin',zone:'North',area:'Bagbazar',lat:22.60121,lng:88.36682,tag:'Heritage favourite',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/%E0%A6%AC%E0%A6%BE%E0%A6%97%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0_%E0%A6%B8%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A7%80%E0%A6%A8_%E0%A6%A6%E0%A7%81%E0%A6%B0%E0%A5%8D%E0%A4%97%E0%A5%8B%E0%A4%A4%E0%A5%8D%E0%A4%B8%E0%A4%AC_%E0%A5%A8%E0%A5%A6%E0%A5%A7%E0%A4%82.jpg',rating:4.8},
  {name:'Kumartuli Park',zone:'North',area:'Kumartuli',lat:22.59913,lng:88.36157,tag:'Artisan quarter',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/DurgaPuja2019_-_Durga_Puja_pandal_of_Kumartoli_Park_in_Kolkata_01.jpg',rating:0},
  {name:'Shobhabazar Rajbari',zone:'North',area:'Shobhabazar',lat:22.5974,lng:88.3672,tag:'Historic puja',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Shobhabazar_Rajbari_Durga_Puja.jpg',rating:0},
  {name:'College Square',zone:'Central',area:'College Street',lat:22.57453,lng:88.36447,tag:'Central Kolkata',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/College_square_puja.jpg',rating:4.9},
  {name:'Santosh Mitra Square',zone:'Central',area:'Sealdah',lat:22.5658,lng:88.3685,tag:'Theme-driven',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Santosh_Mitra_square_Durga_Puja_2025_01.jpg',rating:4.8},
  {name:'Maddox Square',zone:'South',area:'Ballygunge',lat:22.52656,lng:88.35465,tag:'Classic adda',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_With_Her_Family_-_Ballygunge_Durga_Puja_Samiti_-_Maddox_Square_-_Kolkata_2017-09-26_3939.JPG',rating:0},
  {name:'Deshapriya Park',zone:'South',area:'Deshapriya Park',lat:22.51858,lng:88.35346,tag:'South Kolkata',photo:'https://upload.wikimedia.org/wikipedia/commons/f/fe/Durga_Puja_Pandal_-_Ballygunge_Sarbojanin_Durgotsab_-_Deshapriya_Park_-_Kolkata_2017-09-27_4501.JPG',rating:0},
  {name:'Naktala Udayan Sangha',zone:'South',area:'Naktala',lat:22.4643,lng:88.3715,tag:'Neighbourhood favourite',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Idol_Naktala_Udayan_Sangha.jpg',rating:4.5}
];

let activeZone='all', map, markers=[], routeStops=[], travelMode='walking';
const routeMax=8;
let nightIndex=0, completedStops=new Set();

window.pandals = pandals;
Object.defineProperty(window, 'routeStops', { configurable: true, get: () => routeStops });
window.addToRoute = addToRoute;

try { routeStops=JSON.parse(localStorage.getItem('kolkata-pujo-route')||'[]').map(saved=>pandals.find(p=>p.name===saved.name)).filter(Boolean); } catch {}
try { completedStops=new Set(JSON.parse(localStorage.getItem('kolkata-pujo-completed')||'[]')); } catch {}

function persistNight(){localStorage.setItem('kolkata-pujo-route',JSON.stringify(routeStops.map(p=>({name:p.name}))));localStorage.setItem('kolkata-pujo-completed',JSON.stringify([...completedStops]));}
function renderStars(value){return `<span class="stars" aria-label="${value?value.toFixed(1)+' out of 5':'Not rated'}">${value?'★★★★★':'☆☆☆☆☆'}</span> ${value?value.toFixed(1):'Not rated'}`;}
function filteredPandals(){const query=(document.querySelector('#pandal-search')?.value||'').trim().toLowerCase();return pandals.filter(p=>(activeZone==='all'||p.zone===activeZone)&&(!query||`${p.name} ${p.area} ${p.zone} ${p.tag}`.toLowerCase().includes(query)));}
function selectPandal(p){if(!p)return;if(map){map.flyTo([p.lat,p.lng],15,{duration:.7});markers.find(m=>m.pandal===p)?.marker.openPopup();}document.querySelectorAll('.pandal-card').forEach(c=>c.classList.toggle('selected',c.dataset.name===p.name));}
function isInRoute(p){return !!p&&routeStops.some(x=>x.name===p.name);}
function addToRoute(p){if(!p||isInRoute(p)||routeStops.length>=routeMax)return;routeStops.push(p);persistNight();renderRoute();renderNightMode();}
function removeFromRoute(name){routeStops=routeStops.filter(p=>p.name!==name);completedStops.delete(name);nightIndex=Math.min(nightIndex,Math.max(routeStops.length-1,0));persistNight();renderRoute();renderNightMode();}

// Google Maps Directions URLs support walking, driving, bicycling and transit.
// Keep the site's two-wheeler option, but safely map it to driving for the external URL.
function mapsTravelMode(){return travelMode==='two-wheeler'?'driving':travelMode;}
function routeUrl(){
  if(!routeStops.length)return 'https://www.google.com/maps/dir/?api=1';
  const mobile=window.matchMedia('(max-width: 800px)').matches;
  const start=mobile?Math.min(nightIndex,Math.max(routeStops.length-1,0)):0;
  const stops=mobile?routeStops.slice(start,start+4):routeStops;
  const destination=`${stops[stops.length-1].lat},${stops[stops.length-1].lng}`;
  const waypoints=stops.slice(0,-1).map(p=>`${p.lat},${p.lng}`).join('|');
  let url=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=${encodeURIComponent(mapsTravelMode())}`;
  if(waypoints)url+=`&waypoints=${encodeURIComponent(waypoints)}`;
  return url;
}
function singleDirectionsUrl(p){return p?`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}&travelmode=${encodeURIComponent(mapsTravelMode())}`:'https://www.google.com/maps/dir/?api=1';}
function updateRouteLink(){const link=document.querySelector('#open-route');if(link){link.href=routeUrl();link.setAttribute('aria-disabled',String(!routeStops.length));}}
function renderRoute(){
  const wrap=document.querySelector('#route-stops'), count=document.querySelector('#route-count');
  if(count)count.textContent=`${routeStops.length} / ${routeMax}`;
  if(wrap)wrap.innerHTML=routeStops.length?routeStops.map((p,i)=>`<div class="route-stop"><span class="route-stop-index">${i+1}</span><div><strong>${p.name}</strong><small>${p.area} · ${p.zone}</small></div><button class="remove-stop" type="button" data-remove="${p.name.replaceAll('"','&quot;')}" aria-label="Remove ${p.name}">×</button></div>`).join(''):`<div class="empty-state"><strong>Your route is empty.</strong><p>Tap “Add to route” on pandals above.</p></div>`;
  wrap?.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>removeFromRoute(btn.dataset.remove)));
  updateRouteLink();
  document.querySelectorAll('.add-route').forEach(btn=>{const p=pandals.find(x=>x.name===btn.dataset.name);const added=isInRoute(p);btn.textContent=added?'Added ✓':(routeStops.length>=routeMax?'Route full':'Add to route +');btn.disabled=added||routeStops.length>=routeMax;});
  refreshRouteIntelligence();
}
function renderPandalExplorer(){
  const list=document.querySelector('#pandal-list');if(!list)return;const items=filteredPandals();
  list.innerHTML=items.length?items.map(p=>`<article class="pandal-card" data-name="${p.name.replaceAll('"','&quot;')}" tabindex="0" aria-label="Explore ${p.name}"><img src="${p.photo}" alt="Archive photo associated with ${p.name}" loading="lazy" onerror="this.style.display='none'"><div class="pandal-card-body"><div class="pandal-meta">${p.zone} · ${p.area}</div><h3>${p.name}</h3><div class="rating">${renderStars(p.rating)}${p.rating?' · Historical visitor rating':''}</div><div class="pandal-actions"><button class="view-map" type="button">View map</button><button class="add-route" type="button" data-name="${p.name.replaceAll('"','&quot;')}">${isInRoute(p)?'Added ✓':routeStops.length>=routeMax?'Route full':'Add to route +'}</button><a class="route" href="${singleDirectionsUrl(p)}" target="_blank" rel="noopener">Directions ↗</a></div></div></article>`).join(''):`<div class="empty-state"><strong>No pandals found.</strong><p>Try another neighbourhood or clear the search.</p></div>`;
  list.querySelectorAll('.pandal-card').forEach(card=>{const p=pandals.find(x=>x.name===card.dataset.name);card.addEventListener('click',e=>{if(!e.target.closest('a,button'))selectPandal(p);});card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button')){e.preventDefault();selectPandal(p);}});});
  list.querySelectorAll('.view-map').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();selectPandal(pandals.find(p=>p.name===btn.closest('.pandal-card').dataset.name));}));
  list.querySelectorAll('.add-route').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const p=pandals.find(x=>x.name===btn.dataset.name);if(isInRoute(p))removeFromRoute(p.name);else addToRoute(p);renderPandalExplorer();}));
}
function initMap(){if(!window.L||!document.querySelector('#pandal-map'))return;map=L.map('pandal-map',{scrollWheelZoom:false}).setView([22.5726,88.3639],12);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);markers=pandals.map(p=>{const marker=L.marker([p.lat,p.lng]).addTo(map).bindPopup(`<strong>${p.name}</strong><br>${p.area} · ${p.zone}<br><button type="button" class="popup-add" data-pandal="${p.name.replaceAll('"','&quot;')}">Add to route</button> · <a href="${singleDirectionsUrl(p)}" target="_blank" rel="noopener">Directions ↗</a>`);marker.on('popupopen',()=>document.querySelector('.popup-add[data-pandal]')?.addEventListener('click',()=>{const q=document.querySelector('.popup-add[data-pandal]').dataset.pandal;const item=pandals.find(x=>x.name===q);if(item&&!isInRoute(item)){addToRoute(item);renderPandalExplorer();}}));return{pandal:p,marker};});}

document.querySelector('#pandal-search')?.addEventListener('input',renderPandalExplorer);
document.querySelectorAll('#pandal-filters .filter-btn').forEach(btn=>btn.addEventListener('click',()=>{activeZone=btn.dataset.zone;document.querySelectorAll('#pandal-filters .filter-btn').forEach(b=>b.classList.toggle('active',b===btn));renderPandalExplorer();}));
document.querySelectorAll('.mode-btn').forEach(btn=>btn.addEventListener('click',()=>{travelMode=btn.dataset.mode;document.querySelectorAll('.mode-btn').forEach(b=>b.classList.toggle('active',b===btn));updateRouteLink();renderNightMode();refreshRouteIntelligence();}));
document.querySelector('#clear-route')?.addEventListener('click',()=>{routeStops=[];completedStops.clear();nightIndex=0;persistNight();renderRoute();renderPandalExplorer();renderNightMode();});

function renderNightMode(){
  const total=routeStops.length, current=routeStops[nightIndex];
  const label=document.querySelector('#night-stop-label'),name=document.querySelector('#night-stop-name'),area=document.querySelector('#night-stop-area'),bar=document.querySelector('#night-progress-bar'),text=document.querySelector('#night-progress-text'),prev=document.querySelector('#night-prev'),next=document.querySelector('#night-next'),directions=document.querySelector('#night-directions');
  if(!total){if(label)label.textContent='STOP 1 OF 0';if(name)name.textContent='Add stops to begin';if(area)area.textContent='Your selected route will appear here.';if(bar)bar.style.width='0%';if(text)text.textContent='0 / 0 completed';if(directions)directions.href=routeUrl();if(prev)prev.disabled=true;if(next)next.disabled=true;return;}
  if(nightIndex>=total)nightIndex=total-1;
  const done=completedStops.has(current.name);
  if(label)label.textContent=`STOP ${nightIndex+1} OF ${total}${done?' · VISITED':''}`;
  if(name)name.textContent=current.name;
  if(area)area.textContent=`${current.area} · ${current.zone} · ${done?'Marked as visited':'Not visited yet'}`;
  const completedCount=routeStops.filter(p=>completedStops.has(p.name)).length;
  if(bar)bar.style.width=`${Math.round((completedCount/total)*100)}%`;
  if(text)text.textContent=`${completedCount} / ${total} completed`;
  if(prev)prev.disabled=nightIndex===0;
  if(next)next.textContent=nightIndex===total-1?'Finish stop ✓':'Next stop →';
  if(directions)directions.href=singleDirectionsUrl(current);
  refreshRouteIntelligence();
}
function openNightMode(){const panel=document.querySelector('#night-mode');if(!panel)return;panel.classList.remove('hidden');renderNightMode();panel.scrollIntoView({behavior:'smooth',block:'nearest'});}
function closeNightMode(){document.querySelector('#night-mode')?.classList.add('hidden');}

document.querySelector('#night-mode-toggle')?.addEventListener('click',openNightMode);
document.querySelector('#night-close')?.addEventListener('click',closeNightMode);
document.querySelector('#night-prev')?.addEventListener('click',()=>{nightIndex=Math.max(0,nightIndex-1);renderNightMode();});
document.querySelector('#night-next')?.addEventListener('click',()=>{if(!routeStops.length)return;completedStops.add(routeStops[nightIndex].name);if(nightIndex<routeStops.length-1)nightIndex+=1;persistNight();renderNightMode();});
document.querySelector('#night-route')?.addEventListener('click',()=>{window.open(routeUrl(),'_blank','noopener');});
document.querySelector('#night-reset')?.addEventListener('click',()=>{completedStops.clear();nightIndex=0;persistNight();renderNightMode();});

function initLightbox(){const box=document.querySelector('#lightbox'),image=document.querySelector('#lightbox-image');const close=()=>box?.classList.remove('open');document.querySelectorAll('.gallery-grid .tile').forEach(tile=>tile.addEventListener('click',()=>{const bg=getComputedStyle(tile).backgroundImage,match=bg.match(/url\([\"']?(.*?)[\"']?\)/);if(!match)return;image.src=match[1];box.classList.add('open');}));document.querySelector('#lightbox-close')?.addEventListener('click',close);box?.addEventListener('click',e=>{if(e.target===box)close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();closeNightMode();}});}

const routeModeConfig={walking:{label:'Walk',speed:4.5,roadFactor:1.28},driving:{label:'Drive',speed:22,roadFactor:1.18},transit:{label:'Transit',speed:16,roadFactor:1.22},'two-wheeler':{label:'Two-wheeler',speed:25,roadFactor:1.18}};
function routeDistance(a,b){const R=6371,rad=Math.PI/180,dLat=(b.lat-a.lat)*rad,dLon=(b.lng-a.lng)*rad,x=Math.sin(dLat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
function routeEstimate(stops=routeStops){if(stops.length<2)return{distance:0,minutes:0};const mode=routeModeConfig[travelMode]||routeModeConfig.walking;let distance=0;for(let i=1;i<stops.length;i++)distance+=routeDistance(stops[i-1],stops[i])*mode.roadFactor;return{distance,minutes:distance/mode.speed*60};}
function formatRouteDistance(km){return km<1?`${Math.round(km*1000)} m`:`${km.toFixed(1)} km`;}
function formatRouteTime(mins){if(!mins)return'—';const m=Math.max(1,Math.round(mins));return m>=60?`${Math.floor(m/60)}h ${m%60}m`:`${m} min`;}
function ensureRouteIntelligence(){const planner=document.querySelector('#route-planner');if(!planner||document.querySelector('#route-intelligence'))return;const style=document.createElement('style');style.textContent=`.route-intelligence{margin:0 0 15px;padding:14px;border:1px solid rgba(243,234,217,.12);border-radius:15px;background:rgba(8,5,4,.16)}.route-intel-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.route-intel-stat{padding:10px 12px;border-radius:11px;background:rgba(243,234,217,.045)}.route-intel-stat strong{display:block;font:600 19px/1.1 'Playfair Display',serif}.route-intel-stat span{display:block;margin-top:4px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;opacity:.52}.route-intel-actions{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:10px;flex-wrap:wrap}.optimize-route{border:1px solid rgba(243,234,217,.2);background:#f3ead9;color:#140c0a;border-radius:999px;padding:9px 13px;font:inherit;font-size:12px;cursor:pointer}.route-intel-note{font-size:10px!important;opacity:.45!important;margin:0!important}.route-stop-distance{display:block;margin-top:3px;font-size:10px;opacity:.48}.route-stop.next-stop{border-color:rgba(243,234,217,.38)}@media(max-width:800px){.route-intel-grid{grid-template-columns:1fr 1fr}.route-intel-stat:last-child{grid-column:1/-1}}`;document.head.appendChild(style);const intel=document.createElement('div');intel.id='route-intelligence';intel.className='route-intelligence';intel.innerHTML=`<div class="route-intel-grid"><div class="route-intel-stat"><strong id="route-distance">—</strong><span>estimated distance</span></div><div class="route-intel-stat"><strong id="route-time">—</strong><span>travel time</span></div><div class="route-intel-stat"><strong id="route-mode-label">Walk</strong><span>travel mode</span></div></div><div class="route-intel-actions"><button id="optimize-route" class="optimize-route" type="button">Optimize stop order ↗</button><p class="route-intel-note">Approximate city travel estimate, not live traffic.</p></div>`;planner.insertBefore(intel,planner.querySelector('#route-stops'));intel.querySelector('#optimize-route').addEventListener('click',optimizeRoute);}
function refreshRouteIntelligence(){ensureRouteIntelligence();const {distance,minutes}=routeEstimate();const d=document.querySelector('#route-distance'),t=document.querySelector('#route-time'),m=document.querySelector('#route-mode-label');if(d)d.textContent=formatRouteDistance(distance);if(t)t.textContent=formatRouteTime(minutes);if(m)m.textContent=(routeModeConfig[travelMode]||routeModeConfig.walking).label;document.querySelectorAll('.route-stop').forEach((card,i)=>{card.classList.toggle('next-stop',i===nightIndex);card.querySelector('.route-stop-distance')?.remove();if(i>0){const leg=routeDistance(routeStops[i-1],routeStops[i])*(routeModeConfig[travelMode]||routeModeConfig.walking).roadFactor;const body=card.querySelector('div:nth-child(2)');if(body){const detail=document.createElement('span');detail.className='route-stop-distance';detail.textContent=`≈ ${formatRouteDistance(leg)} from previous stop`;body.appendChild(detail);}}});}
function optimizeRoute(){if(routeStops.length<3)return;const remaining=routeStops.slice(1),ordered=[routeStops[0]];while(remaining.length){const last=ordered[ordered.length-1];let best=0,dist=Infinity;remaining.forEach((candidate,i)=>{const d=routeDistance(last,candidate);if(d<dist){dist=d;best=i;}});ordered.push(remaining.splice(best,1)[0]);}routeStops.splice(0,routeStops.length,...ordered);persistNight();renderRoute();renderPandalExplorer();renderNightMode();}

function initPuja2026Info(){
  if(document.querySelector('#puja-2026-info'))return;
  const guide=document.querySelector('#guide');
  if(!guide)return;
  const style=document.createElement('style');
  style.textContent=`.puja-2026-info{margin-top:22px;padding:22px;border:1px solid rgba(243,234,217,.14);border-radius:20px;background:linear-gradient(145deg,rgba(243,234,217,.075),rgba(243,234,217,.025))}.puja-2026-info .section-label{margin-bottom:8px}.puja-2026-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-end}.puja-2026-head h3{margin:0;font:600 28px/1.1 'Playfair Display',serif}.puja-2026-head p{max-width:520px;margin:0;opacity:.65;font-size:13px}.puja-2026-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:12px;margin-top:16px}.puja-2026-card{padding:16px;border:1px solid rgba(243,234,217,.1);border-radius:15px;background:rgba(8,5,4,.14)}.puja-2026-card strong{display:block;font:600 20px/1.1 'Playfair Display',serif}.puja-2026-card small{display:block;margin-top:6px;font-size:10px;text-transform:uppercase;letter-spacing:.1em;opacity:.5}.puja-2026-dates{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:16px}.puja-2026-date{padding:11px 9px;border-radius:12px;background:rgba(243,234,217,.05);text-align:center}.puja-2026-date b{display:block;font-size:15px}.puja-2026-date span{display:block;margin-top:3px;font-size:10px;opacity:.58}.puja-2026-note{margin:12px 0 0;font-size:10px;opacity:.45}.puja-2026-source{margin-top:14px;font-size:11px;opacity:.58}.puja-2026-source a{color:inherit}.puja-2026-badge{display:inline-flex;align-items:center;border:1px solid rgba(243,234,217,.18);border-radius:999px;padding:6px 9px;font-size:10px;letter-spacing:.06em;text-transform:uppercase;opacity:.75}@media(max-width:800px){.puja-2026-head{display:block}.puja-2026-head p{margin-top:8px}.puja-2026-grid{grid-template-columns:1fr}.puja-2026-dates{grid-template-columns:repeat(2,1fr)}}`;
  document.head.appendChild(style);
  const section=document.createElement('section');
  section.id='puja-2026-info';
  section.className='puja-2026-info';
  section.innerHTML=`<div class="section-label">05 / 2026 UPDATE</div><div class="puja-2026-head"><div><h3>This year's Pujo, at a glance.</h3><span class="puja-2026-badge">Updated · September 2026</span></div><p>Key dates and confirmed state-level guidance for planning a 2026 Kolkata Puja night. Local committee schedules can differ.</p></div><div class="puja-2026-dates"><div class="puja-2026-date"><b>17 Oct</b><span>Shashthi</span></div><div class="puja-2026-date"><b>18 Oct</b><span>Saptami</span></div><div class="puja-2026-date"><b>19 Oct</b><span>Ashtami</span></div><div class="puja-2026-date"><b>20 Oct</b><span>Navami</span></div><div class="puja-2026-date"><b>21 Oct</b><span>Dashami</span></div></div><div class="puja-2026-grid"><article class="puja-2026-card"><strong>₹1 lakh committee grant</strong><small>State announcement</small><p>Small and low-budget Puja committees have been announced a ₹1 lakh grant, alongside free electricity and a waiver of fire-licence fees.</p></article><article class="puja-2026-card"><strong>No DJ during Puja & immersion</strong><small>State guidance</small><p>The state government has reiterated that DJs remain prohibited during Puja celebrations and immersion processions.</p></article></div><p class="puja-2026-note">Planning note: these are high-level state announcements, not a substitute for local police, traffic, committee or venue notices.</p><p class="puja-2026-source">Sources: <a href="https://wb.gov.in/government-cm-events-details-new.aspx?event=Durga-Puja-2026-Meeting&id=E260908105535364" target="_blank" rel="noopener">Government of West Bengal · Durga Puja 2026 Meeting</a> · <a href="https://www.incredibleindia.gov.in/en/festivals-and-events/durga-puja" target="_blank" rel="noopener">Incredible India · Durga Puja</a></p>`;
  guide.appendChild(section);
}

window.addEventListener('load',()=>{
  initMap();renderPandalExplorer();renderRoute();renderNightMode();initLightbox();refreshRouteIntelligence();initPuja2026Info();
  if(!window.anime||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  anime({targets:'.hero-content .eyebrow,.hero-content h1,.hero-copy,.hero-actions',opacity:[0,1],translateY:[28,0],duration:1100,delay:anime.stagger(140),easing:'easeOutExpo'});
  anime({targets:'.hero-mark',opacity:[0,.8],scale:[.7,1],rotate:[-8,0],duration:1400,delay:650,easing:'easeOutElastic(1,.65)'});
  anime({targets:'.scroll-note',opacity:[0,1],translateY:[12,0],duration:900,delay:1500,easing:'easeOutQuad'});
  const revealTargets=document.querySelectorAll('.section-label,.intro-grid > div,.stats > div,.timeline-head > *, .days article,.culture-card,.guide-head > *, .explorer-toolbar,.pandal-card,.map-panel,.route-planner,.night-mode,.gallery-head > *, .tile,footer > *,#puja-2026-info');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;anime({targets:entry.target,opacity:[0,1],translateY:[34,0],duration:800,easing:'easeOutCubic'});observer.unobserve(entry.target);}),{threshold:.12,rootMargin:'0px 0px -40px'});
  revealTargets.forEach(el=>{el.style.opacity='0';observer.observe(el);});
  anime({targets:'.scroll-note span',translateY:[0,7],opacity:[1,.45],direction:'alternate',loop:true,duration:850,easing:'easeInOutSine'});
});
