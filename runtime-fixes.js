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
  window.pandals.forEach(p=>{const xy=CANONICAL[p.name];if(xy){p.lat=xy[0];p.lng=xy[1]}});
}
function syncMode(){
  document.querySelectorAll('.mode-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const mode=btn.dataset.mode;
    if(mode)localStorage.setItem(MODE_KEY,mode);
  },{passive:true}));
  const saved=localStorage.getItem(MODE_KEY);
  if(saved){const btn=document.querySelector(`.mode-btn[data-mode="${CSS.escape(saved)}"]`);if(btn&&!btn.classList.contains('active'))btn.click()}
}
function mapResilience(){
  const map=document.querySelector('#pandal-map');
  if(!map||window.L)return;
  window.setTimeout(()=>{
    if(window.L||map.dataset.fallbackShown)return;
    map.dataset.fallbackShown='true';
    map.innerHTML='<div class="map-fallback"><strong>Interactive map unavailable</strong><p>The map provider could not be loaded. The pandal list and Google Maps directions are still available.</p></div>';
    const style=document.createElement('style');style.textContent='.map-fallback{min-height:330px;height:100%;display:grid;place-content:center;text-align:center;padding:28px;background:#eee9df;color:#181512}.map-fallback strong{font:600 22px/1.2 "Playfair Display",Georgia,serif}.map-fallback p{max-width:360px;margin:8px auto 0;color:#6e685f;font-size:13px;line-height:1.6}';document.head.appendChild(style);
  },5000);
}
function boot(){normalizeData();syncMode();mapResilience();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
