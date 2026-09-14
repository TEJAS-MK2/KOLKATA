(()=>{
'use strict';
// Graceful fallback for optional MarkerCluster and Leaflet failures.
if(window.L&&!window.L.markerClusterGroup){
  window.L.markerClusterGroup=()=>window.L.layerGroup();
}
function ensureMenuStyles(){
  if(document.getElementById('kolkata-menu-core-css'))return;
  const style=document.createElement('style');
  style.id='kolkata-menu-core-css';
  style.textContent='@media(max-width:600px){.site-header .menu{display:flex!important;align-items:center;justify-content:center;position:relative;z-index:1201}.site-header nav{display:none!important}.site-header.menu-open nav{display:flex!important;position:absolute;left:10px;right:10px;top:calc(100% + 8px);z-index:1200;flex-direction:column;gap:4px;padding:10px;background:rgba(255,253,250,.97);border-radius:16px;box-shadow:0 22px 50px rgba(24,21,18,.16)}}@media(min-width:601px){.site-header .menu{display:none!important}.site-header nav{display:flex!important}}';
  document.head.appendChild(style);
}
function initMenuFallback(){
  const menu=document.querySelector('.menu'),nav=document.querySelector('.site-header nav');
  if(!menu||!nav||menu.dataset.kolkataMenuBound||menu.dataset.kolkataMenuFallbackBound)return;
  menu.dataset.kolkataMenuFallbackBound='1';
  const header=menu.closest('.site-header');
  const setOpen=open=>{
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close menu':'Open menu');
    nav.classList.toggle('is-open',open);
    header?.classList.toggle('menu-open',open);
    document.documentElement.classList.toggle('menu-is-open',open);
  };
  setOpen(false);
  menu.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();setOpen(menu.getAttribute('aria-expanded')!=='true')});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setOpen(false)});
}
function showFallback(){
  const map=document.querySelector('#pandal-map');
  if(!map||window.L||map.dataset.fallbackShown)return;
  map.dataset.fallbackShown='true';
  map.innerHTML='<div class="map-fallback"><strong>Interactive map unavailable</strong><p>The map library could not be loaded. Search and Google Maps directions remain available.</p></div>';
  const s=document.createElement('style');s.textContent='.map-fallback{min-height:330px;height:100%;display:grid;place-content:center;text-align:center;padding:28px;background:#eee9df;color:#181512}.map-fallback strong{font:600 22px/1.2 "Playfair Display",Georgia,serif}.map-fallback p{max-width:360px;margin:8px auto 0;color:#6e685f;font:13px/1.6 "DM Sans",Arial,sans-serif}';document.head.appendChild(s);
}
function boot(){ensureMenuStyles();initMenuFallback();if(!window.L)setTimeout(showFallback,5000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
