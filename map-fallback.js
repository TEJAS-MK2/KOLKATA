(()=>{
'use strict';
// Graceful fallback for optional MarkerCluster and Leaflet failures.
if(window.L&&!window.L.markerClusterGroup){
  window.L.markerClusterGroup=()=>window.L.layerGroup();
}
function showFallback(){
  const map=document.querySelector('#pandal-map');
  if(!map||window.L||map.dataset.fallbackShown)return;
  map.dataset.fallbackShown='true';
  map.innerHTML='<div class="map-fallback"><strong>Interactive map unavailable</strong><p>The map library could not be loaded. Search and Google Maps directions remain available.</p></div>';
  const s=document.createElement('style');s.textContent='.map-fallback{min-height:330px;height:100%;display:grid;place-content:center;text-align:center;padding:28px;background:#eee9df;color:#181512}.map-fallback strong{font:600 22px/1.2 "Playfair Display",Georgia,serif}.map-fallback p{max-width:360px;margin:8px auto 0;color:#6e685f;font:13px/1.6 "DM Sans",Arial,sans-serif}';document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(showFallback,5000),{once:true});else setTimeout(showFallback,5000);
})();
