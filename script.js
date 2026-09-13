const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.style.background = y > 40 ? 'rgba(18,10,8,.82)' : 'transparent';
  header.style.backdropFilter = y > 40 ? 'blur(14px)' : 'none';
  header.style.transition = 'background .25s ease, backdrop-filter .25s ease';
  const hero = document.querySelector('.hero-image');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) hero.style.transform = `translateY(${Math.min(y * 0.16, 90)}px) scale(1.04)`;
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
  {name:'Bagbazar Sarbojanin',zone:'North',area:'Bagbazar',lat:22.6016,lng:88.3718,tag:'Heritage favourite',photo:'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=900&q=80'},
  {name:'Kumartuli Park',zone:'North',area:'Kumartuli',lat:22.5967,lng:88.3629,tag:'Artisan quarter',photo:'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80'},
  {name:'Shobhabazar Rajbari',zone:'North',area:'Shobhabazar',lat:22.5974,lng:88.3672,tag:'Historic puja',photo:'https://images.unsplash.com/photo-1606293926249-edc3d2b7a1d1?auto=format&fit=crop&w=900&q=80'},
  {name:'College Square',zone:'Central',area:'College Street',lat:22.5733,lng:88.3654,tag:'Central Kolkata',photo:'https://images.unsplash.com/photo-1609252509105-3c0f2b2e8b2d?auto=format&fit=crop&w=900&q=80'},
  {name:'Santosh Mitra Square',zone:'Central',area:'Sealdah',lat:22.5658,lng:88.3685,tag:'Theme-driven',photo:'https://images.unsplash.com/photo-1602774895192-7f4d5c8f8f4a?auto=format&fit=crop&w=900&q=80'},
  {name:'Maddox Square',zone:'South',area:'Ballygunge',lat:22.5407,lng:88.3514,tag:'Classic adda',photo:'https://images.unsplash.com/photo-1604514628550-37477afdf4e3?auto=format&fit=crop&w=900&q=80'},
  {name:'Deshapriya Park',zone:'South',area:'Deshapriya Park',lat:22.5186,lng:88.3542,tag:'South Kolkata',photo:'https://images.unsplash.com/photo-1604608672516-f1b9c5d4d1a4?auto=format&fit=crop&w=900&q=80'},
  {name:'Naktala Udayan Sangha',zone:'South',area:'Naktala',lat:22.4643,lng:88.3715,tag:'Neighbourhood favourite',photo:'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=900&q=80'}
];

let activeZone='all', map, markers=[], routeStops=[], travelMode='walking';
const routeMax=8;

function renderStars(value){return `<span class="stars" aria-label="${value?' '+value.toFixed(1)+' out of 5':'Not rated'}">${value?'★★★★★':'☆☆☆☆☆'}</span> ${value?value.toFixed(1):'Not rated'}`;}
function filteredPandals(){const query=(document.querySelector('#pandal-search')?.value||'').trim().toLowerCase();return pandals.filter(p=>(activeZone==='all'||p.zone===activeZone)&&(!query||`${p.name} ${p.area} ${p.zone} ${p.tag}`.toLowerCase().includes(query)));}
function selectPandal(p){if(!p)return;if(map){map.flyTo([p.lat,p.lng],15,{duration:.7});markers.find(m=>m.pandal===p)?.marker.openPopup();}document.querySelectorAll('.pandal-card').forEach(c=>c.classList.toggle('selected',c.dataset.name===p.name));}
function isInRoute(p){return routeStops.some(x=>x.name===p.name);}
function addToRoute(p){if(!p||isInRoute(p)||routeStops.length>=routeMax)return;routeStops.push(p);renderRoute();}
function removeFromRoute(name){routeStops=routeStops.filter(p=>p.name!==name);renderRoute();}
function routeUrl(){
  if(!routeStops.length)return 'https://www.google.com/maps/dir/?api=1';
  const destination=`${routeStops[routeStops.length-1].lat},${routeStops[routeStops.length-1].lng}`;
  const waypoints=routeStops.slice(0,-1).map(p=>`${p.lat},${p.lng}`).join('|');
  let url=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=${encodeURIComponent(travelMode)}`;
  if(waypoints)url+=`&waypoints=${encodeURIComponent(waypoints)}`;
  return url;
}
function updateRouteLink(){const link=document.querySelector('#open-route');if(link){link.href=routeUrl();link.setAttribute('aria-disabled',String(!routeStops.length));}}
function renderRoute(){
  const wrap=document.querySelector('#route-stops'), count=document.querySelector('#route-count');
  if(count)count.textContent=`${routeStops.length} / ${routeMax}`;
  if(wrap)wrap.innerHTML=routeStops.length?routeStops.map((p,i)=>`<div class="route-stop"><span class="route-stop-index">${i+1}</span><div><strong>${p.name}</strong><small>${p.area} · ${p.zone}</small></div><button class="remove-stop" type="button" data-remove="${p.name.replaceAll('"','&quot;')}" aria-label="Remove ${p.name}">×</button></div>`).join(''):`<div class="empty-state"><strong>Your route is empty.</strong><p>Tap “Add to route” on pandals above.</p></div>`;
  wrap?.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>removeFromRoute(btn.dataset.remove)));
  updateRouteLink();
  document.querySelectorAll('.add-route').forEach(btn=>{const p=pandals.find(x=>x.name===btn.dataset.name);const added=isInRoute(p);btn.textContent=added?'Added ✓':(routeStops.length>=routeMax?'Route full':'Add to route +');btn.disabled=added||routeStops.length>=routeMax;});
}
function renderPandalExplorer(){
  const list=document.querySelector('#pandal-list');if(!list)return;const items=filteredPandals();
  list.innerHTML=items.length?items.map(p=>`<article class="pandal-card" data-name="${p.name.replaceAll('"','&quot;')}" tabindex="0" aria-label="Explore ${p.name}"><img src="${p.photo}" alt="Festival atmosphere near ${p.name}" loading="lazy" onerror="this.style.display='none'"><div class="pandal-card-body"><div class="pandal-meta">${p.zone} · ${p.area}</div><h3>${p.name}</h3><div class="rating">${renderStars(0)}</div><div class="pandal-actions"><button class="view-map" type="button">View map</button><button class="add-route" type="button" data-name="${p.name.replaceAll('"','&quot;')}">${isInRoute(p)?'Added ✓':routeStops.length>=routeMax?'Route full':'Add to route +'}</button><a class="route" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noopener">Directions ↗</a></div></div></article>`).join(''):`<div class="empty-state"><strong>No pandals found.</strong><p>Try another neighbourhood or clear the search.</p></div>`;
  list.querySelectorAll('.pandal-card').forEach(card=>{const p=pandals.find(x=>x.name===card.dataset.name);card.addEventListener('click',e=>{if(!e.target.closest('a,button'))selectPandal(p);});card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button')){e.preventDefault();selectPandal(p);}});});
  list.querySelectorAll('.view-map').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();selectPandal(pandals.find(p=>p.name===btn.closest('.pandal-card').dataset.name));}));
  list.querySelectorAll('.add-route').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const p=pandals.find(x=>x.name===btn.dataset.name);if(!isInRoute(p))addToRoute(p);else removeFromRoute(p.name);renderPandalExplorer();}));
}
function initMap(){if(!window.L||!document.querySelector('#pandal-map'))return;map=L.map('pandal-map',{scrollWheelZoom:false}).setView([22.5726,88.3639],12);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);markers=pandals.map(p=>{const marker=L.marker([p.lat,p.lng]).addTo(map).bindPopup(`<strong>${p.name}</strong><br>${p.area} · ${p.zone}<br><button type="button" class="popup-add" data-pandal="${p.name.replaceAll('"','&quot;')}">Add to route</button> · <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noopener">Directions ↗</a>`);marker.on('popupopen',()=>document.querySelector('.popup-add[data-pandal]')?.addEventListener('click',()=>{const q=document.querySelector('.popup-add[data-pandal]').dataset.pandal;const item=pandals.find(x=>x.name===q);if(item&&!isInRoute(item)){addToRoute(item);renderPandalExplorer();}}));return{pandal:p,marker};});}

document.querySelector('#pandal-search')?.addEventListener('input',renderPandalExplorer);
document.querySelectorAll('#pandal-filters .filter-btn').forEach(btn=>btn.addEventListener('click',()=>{activeZone=btn.dataset.zone;document.querySelectorAll('#pandal-filters .filter-btn').forEach(b=>b.classList.toggle('active',b===btn));renderPandalExplorer();}));
document.querySelectorAll('.mode-btn').forEach(btn=>btn.addEventListener('click',()=>{travelMode=btn.dataset.mode;document.querySelectorAll('.mode-btn').forEach(b=>b.classList.toggle('active',b===btn));updateRouteLink();}));
document.querySelector('#clear-route')?.addEventListener('click',()=>{routeStops=[];renderRoute();renderPandalExplorer();});

function initLightbox(){const box=document.querySelector('#lightbox'),image=document.querySelector('#lightbox-image');const close=()=>box?.classList.remove('open');document.querySelectorAll('.gallery-grid .tile').forEach(tile=>tile.addEventListener('click',()=>{const bg=getComputedStyle(tile).backgroundImage,match=bg.match(/url\(["']?(.*?)["']?\)/);if(!match)return;image.src=match[1];box.classList.add('open');}));document.querySelector('#lightbox-close')?.addEventListener('click',close);box?.addEventListener('click',e=>{if(e.target===box)close();});document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});}

window.addEventListener('load',()=>{
  initMap();renderPandalExplorer();renderRoute();initLightbox();
  if(!window.anime||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  anime({targets:'.hero-content .eyebrow,.hero-content h1,.hero-copy,.hero-actions',opacity:[0,1],translateY:[28,0],duration:1100,delay:anime.stagger(140),easing:'easeOutExpo'});
  anime({targets:'.hero-mark',opacity:[0,.8],scale:[.7,1],rotate:[-8,0],duration:1400,delay:650,easing:'easeOutElastic(1,.65)'});
  anime({targets:'.scroll-note',opacity:[0,1],translateY:[12,0],duration:900,delay:1500,easing:'easeOutQuad'});
  const revealTargets=document.querySelectorAll('.section-label,.intro-grid > div,.stats > div,.timeline-head > *, .days article,.culture-card,.guide-head > *, .explorer-toolbar,.pandal-card,.map-panel,.route-planner,.gallery-head > *, .tile,footer > *');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;anime({targets:entry.target,opacity:[0,1],translateY:[34,0],duration:800,easing:'easeOutCubic'});observer.unobserve(entry.target);}),{threshold:.12,rootMargin:'0px 0px -40px'});
  revealTargets.forEach(el=>{el.style.opacity='0';observer.observe(el);});
  anime({targets:'.scroll-note span',translateY:[0,7],opacity:[1,.45],direction:'alternate',loop:true,duration:850,easing:'easeInOutSine'});
});
