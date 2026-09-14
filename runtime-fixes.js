(()=>{
'use strict';
const MODE_KEY='kolkata-pujo-mode';
const pins=()=>window.KOLKATA_CANONICAL_PINS||{};
function syncMode(){
  document.querySelectorAll('.mode-btn').forEach(btn=>{if(btn.dataset.kolkataModeBound)return;btn.dataset.kolkataModeBound='1';btn.addEventListener('click',()=>{if(btn.dataset.mode)localStorage.setItem(MODE_KEY,btn.dataset.mode)},{passive:true})});
  const saved=localStorage.getItem(MODE_KEY);if(saved){const btn=document.querySelector(`.mode-btn[data-mode="${CSS.escape(saved)}"]`);if(btn&&!btn.classList.contains('active'))btn.click()}
}
function exposeSelector(){window.selectPandal=p=>{if(!p)return;const map=window.kolkataMap||window.map;if(map?.flyTo)map.flyTo([p.lat,p.lng],15,{duration:.7});if(map?.eachLayer)map.eachLayer(layer=>{if(layer?.options?.title===p.name&&layer.openPopup)layer.openPopup()});document.querySelectorAll('.pandal-card').forEach(c=>c.classList.toggle('selected',c.dataset.name===p.name));document.querySelector(`.pandal-card[data-name="${CSS.escape(p.name)}"]`)?.scrollIntoView({behavior:'smooth',block:'center'})}}
function patchCatalogCards(){
  const canonical=pins();const active=document.querySelector('.mode-btn.active')?.dataset.mode||localStorage.getItem(MODE_KEY)||'walking';const mode=active==='two-wheeler'?'driving':active;const mapsDir=(lat,lng)=>`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${encodeURIComponent(mode)}`;
  document.querySelectorAll('#pandal-list .pandal-card[data-name]').forEach(card=>{const pin=canonical[card.dataset.name];if(!pin)return;const link=card.querySelector('.route');if(link)link.href=mapsDir(pin[0],pin[1]);const btn=card.querySelector('.catalog-map,.suite-map');if(btn){btn.disabled=false;btn.textContent='View map'}let status=card.querySelector('.pin-status');if(!status){status=document.createElement('div');status.className='pin-status';card.querySelector('h3')?.after(status)}status.classList.add('verified');status.classList.remove('pending');status.textContent='● Exact map pin verified'});
  document.querySelectorAll('[data-verified-count]').forEach(el=>{el.textContent=String(Object.keys(canonical).length)});
}
function patchUndefinedDirections(){
  const mode=(document.querySelector('.mode-btn.active')?.dataset.mode||localStorage.getItem(MODE_KEY)||'walking');
  document.querySelectorAll('#pandal-list .pandal-card[data-name] a.route').forEach(link=>{
    if(!/google\.com\/maps\/dir\//i.test(link.href)||!/destination=(?:undefined|null)/i.test(link.href))return;
    const card=link.closest('.pandal-card');
    const p=window.pandals?.find?.(item=>item.name===card?.dataset.name);
    if(!p)return;
    if(Number.isFinite(p.lat)&&Number.isFinite(p.lng)){
      const travel=mode==='two-wheeler'?'driving':mode;
      link.href=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}&travelmode=${encodeURIComponent(travel)}`;
    }else{
      link.href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.area||''}, Kolkata, West Bengal`)}`;
    }
    link.target='_blank';link.rel='noopener';
  });
}
function patchCompanionDates(){document.querySelectorAll('#puja-pro, #puja-companion, #puja-night-upgrade, body').forEach(root=>{root.querySelectorAll?.('*').forEach(el=>{if(el.children.length===0&&/22[–-]24\s*Oct/.test(el.textContent))el.textContent=el.textContent.replace(/22[–-]24\s*Oct/g,'22–23 Oct')})})}
function patchCompanionHolidayCopy(){
  const title=document.getElementById('pro-today-title');
  const copy=document.getElementById('pro-today-copy');
  if(title)title.textContent=title.textContent.replace(/days until Puja begins\.?/i,'days until the Puja holiday window begins.');
  if(copy)copy.textContent=copy.textContent.replace(/Maha Chaturthi starts the official 2026 Puja holiday period on 15 October\.?/i,'The official 2026 Puja holiday window begins on 15 October; core ritual days run from Shashthi on 17 October through Dashami on 21 October.');
}
function patchHolidayCopy(){
  document.querySelectorAll('.hero .eyebrow, .puja-countdown .countdown-title, .puja-countdown .countdown-date').forEach(el=>{
    if(el.classList.contains('countdown-title'))el.textContent=el.textContent.replace(/Durga Puja begins in/i,'Puja holiday window begins in');
    if(el.classList.contains('countdown-date'))el.textContent=el.textContent.replace(/Maha Chaturthi · 15 October 2026/i,'Holiday window · 15 October 2026');
    if(el.classList.contains('eyebrow'))el.textContent=el.textContent.replace(/PUJA 15—26 OCTOBER 2026/i,'HOLIDAY WINDOW 15—26 OCTOBER 2026');
  });
}
function fixGalleryA11y(){document.querySelectorAll('.gallery-grid .tile').forEach((tile,i)=>{tile.setAttribute('role','button');tile.setAttribute('tabindex','0');if(!tile.getAttribute('aria-label'))tile.setAttribute('aria-label',`Open gallery image ${i+1}`);if(tile.dataset.kolkataGalleryBound)return;tile.dataset.kolkataGalleryBound='1';tile.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tile.click()}})})}
function fixLeafletAssetUrls(){document.querySelectorAll('img[src*="/distmarker-"]').forEach(img=>{img.src=img.src.replace('/distmarker-','/dist/images/marker-')})}
function normalizeLinks(){const active=document.querySelector('.mode-btn.active')?.dataset.mode||localStorage.getItem(MODE_KEY)||'walking';const mode=active==='two-wheeler'?'driving':active;document.querySelectorAll('a[href*="google.com/maps/dir/"]').forEach(a=>{try{const u=new URL(a.href);u.searchParams.set('travelmode',mode);a.href=u.toString();const rel=new Set((a.rel||'').split(/\s+/).filter(Boolean));rel.add('noopener');a.rel=[...rel].join(' ')}catch{}})}
function registerSW(){if(!('serviceWorker' in navigator))return;navigator.serviceWorker.register('sw.js',{scope:'./'}).catch(()=>{})}
function patchAll(){patchCatalogCards();patchUndefinedDirections();patchCompanionDates();patchCompanionHolidayCopy();patchHolidayCopy();fixGalleryA11y();normalizeLinks();fixLeafletAssetUrls()}
function boot(){window.KOLKATA_NORMALIZE_PANDALS?.(window.pandals);syncMode();exposeSelector();patchAll();registerSW();setTimeout(patchAll,1200);setTimeout(patchAll,3200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',patchAll,{once:true});
})();
