(()=>{
'use strict';
const MODE_KEY='kolkata-pujo-mode';
const CANONICAL={
 'Bagbazar Sarbojanin':[22.60121,88.36682],
 'Tala Prattoy':[22.61046,88.38460],
 'Hatibagan Sarbojanin':[22.59439,88.37200],
 'Sree Bhumi Sporting Club':[22.59890,88.40293],
 'Dumdum Park Bharat Chakra':[22.61082,88.41460],
 'Dumdum Park Sarbojanin':[22.60944,88.41641],
 'Kumartuli Park':[22.59898,88.36147],
 'Shobhabazar Rajbari':[22.59626,88.36738],
 'College Square':[22.57453,88.36447],
 'Santosh Mitra Square':[22.56602,88.36565],
 'Maddox Square':[22.52656,88.35465],
 'Deshapriya Park':[22.51858,88.35346],
 'Naktala Udayan Sangha':[22.47449,88.36658]
};
function normalizeData(){
  if(!Array.isArray(window.pandals))return;
  const extra={
    'Tala Prattoy':['North','Tala',22.61046,88.38460],
    'Hatibagan Sarbojanin':['North','Hatibagan',22.59439,88.37200],
    'Sree Bhumi Sporting Club':['North','Sreebhumi',22.59890,88.40293],
    'Dumdum Park Bharat Chakra':['North','Dum Dum Park',22.61082,88.41460],
    'Dumdum Park Sarbojanin':['North','Dum Dum Park',22.60944,88.41641]
  };
  Object.entries(extra).forEach(([name,[zone,area,lat,lng]])=>{if(!window.pandals.some(p=>p.name===name))window.pandals.push({name,zone,area,lat,lng,tag:'Verified location',photo:'',rating:0})});
  window.pandals.forEach(p=>{const xy=CANONICAL[p.name];if(xy){p.lat=xy[0];p.lng=xy[1]}});
}
function syncMode(){
  document.querySelectorAll('.mode-btn').forEach(btn=>btn.addEventListener('click',()=>{const mode=btn.dataset.mode;if(mode)localStorage.setItem(MODE_KEY,mode)},{passive:true}));
  const saved=localStorage.getItem(MODE_KEY);if(saved){const btn=document.querySelector(`.mode-btn[data-mode="${CSS.escape(saved)}"]`);if(btn&&!btn.classList.contains('active'))btn.click()}
}
function exposeMap(){
  if(!window.L?.map||window.L.map.__kolkataWrapped)return;
  const original=window.L.map;
  const wrapped=function(...args){const instance=original.apply(this,args);window.map=instance;return instance};
  wrapped.__kolkataWrapped=true;window.L.map=wrapped;
}
function exposeSelector(){
  if(window.selectPandal)return;
  window.selectPandal=p=>{if(!p)return;const map=window.map;if(map?.flyTo)map.flyTo([p.lat,p.lng],15,{duration:.7});if(map?.eachLayer)map.eachLayer(layer=>{if(layer?.options?.title===p.name&&layer.openPopup)layer.openPopup()});document.querySelectorAll('.pandal-card').forEach(c=>c.classList.toggle('selected',c.dataset.name===p.name));document.querySelector(`.pandal-card[data-name="${CSS.escape(p.name)}"]`)?.scrollIntoView({behavior:'smooth',block:'center'})};
}
function patchCatalogCards(){
  const mapsDir=(lat,lng)=>`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${encodeURIComponent(localStorage.getItem(MODE_KEY)||'walking')}`;
  document.querySelectorAll('#pandal-list .pandal-card[data-name]').forEach(card=>{const pin=CANONICAL[card.dataset.name];if(!pin)return;const link=card.querySelector('.route');if(link)link.href=mapsDir(pin[0],pin[1]);const btn=card.querySelector('.catalog-map,.suite-map');if(btn){btn.disabled=false;btn.textContent='View map'}let status=card.querySelector('.pin-status');if(!status){status=document.createElement('div');status.className='pin-status';card.querySelector('h3')?.after(status)}status.classList.add('verified');status.classList.remove('pending');status.textContent='● Exact map pin verified'});
}
function mapResilience(){
  const map=document.querySelector('#pandal-map');if(!map||window.L)return;
  window.setTimeout(()=>{if(window.L||map.dataset.fallbackShown)return;map.dataset.fallbackShown='true';map.innerHTML='<div class="map-fallback"><strong>Interactive map unavailable</strong><p>The map provider could not be loaded. The pandal list and Google Maps directions are still available.</p></div>';const style=document.createElement('style');style.textContent='.map-fallback{min-height:330px;height:100%;display:grid;place-content:center;text-align:center;padding:28px;background:#eee9df;color:#181512}.map-fallback strong{font:600 22px/1.2 "Playfair Display",Georgia,serif}.map-fallback p{max-width:360px;margin:8px auto 0;color:#6e685f;font-size:13px;line-height:1.6}';document.head.appendChild(style)},5000);
}
function registerSW(){if(!('serviceWorker' in navigator))return;navigator.serviceWorker.register('sw.js',{scope:'./'}).catch(()=>{})}
function boot(){normalizeData();syncMode();exposeMap();exposeSelector();mapResilience();registerSW();patchCatalogCards();setTimeout(patchCatalogCards,1400);setTimeout(patchCatalogCards,3200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',()=>{exposeMap();exposeSelector()},{once:true});
})();
