(()=>{
'use strict';
const CANONICAL_PINS={
 'Bagbazar Sarbojanin':[22.60121,88.36682],'Tala Prattoy':[22.61046,88.38460],
 'Hatibagan Sarbojanin':[22.59439,88.37200],'Sree Bhumi Sporting Club':[22.59890,88.40293],
 'Dumdum Park Bharat Chakra':[22.61082,88.41460],'Dumdum Park Sarbojanin':[22.60944,88.41641],
 'Kumartuli Park':[22.59898,88.36147],'Shobhabazar Rajbari':[22.59626,88.36738],
 'College Square':[22.57453,88.36447],'Santosh Mitra Square':[22.56602,88.36565],
 'Maddox Square':[22.52656,88.35465],'Deshapriya Park':[22.51858,88.35346],
 'Naktala Udayan Sangha':[22.47449,88.36658]
};
const VERIFIED=new Set(Object.keys(CANONICAL_PINS));
const mapsDir=(lat,lng)=>`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${encodeURIComponent(localStorage.getItem('kolkata-pujo-mode')||'walking')}`;
let observer=null,running=false;
function run(){
 if(running)return;
 running=true;observer?.disconnect();
 try{
  if(Array.isArray(window.pandals))Object.entries(CANONICAL_PINS).forEach(([name,[lat,lng]])=>{const p=window.pandals.find(x=>x.name===name);if(p){p.lat=lat;p.lng=lng}});
  document.querySelectorAll('#pandal-list .pandal-card[data-name]').forEach(card=>{
   const name=card.dataset.name,pin=CANONICAL_PINS[name];
   if(!pin)return;
   const link=card.querySelector('.route');if(link)link.href=mapsDir(pin[0],pin[1]);
   let status=card.querySelector('.pin-status');
   if(!status){status=document.createElement('div');status.className='pin-status';card.querySelector('h3')?.after(status)}
   status.classList.remove('pending');status.classList.add('verified');status.textContent='● Map pin verified';status.setAttribute('aria-label','Exact map pin verified');
   card.classList.remove('pending-pin');
   card.querySelectorAll('.catalog-map[disabled],.suite-map[disabled]').forEach(btn=>btn.disabled=false);
   card.querySelectorAll('.pandal-meta').forEach(meta=>{meta.textContent=meta.textContent.replace(/\s*·\s*Map pin verified$/,'')});
  });
  document.getElementById('suite-route')?.remove();
  document.getElementById('latest-2026-note')?.remove();
  const list=document.querySelector('#pandal-list'),count=document.querySelector('#pandal-result-count');
  if(list&&count){const cards=[...list.querySelectorAll('.pandal-card')],exact=cards.filter(c=>VERIFIED.has(c.dataset.name)).length;if(exact)count.textContent=`${cards.length} discovery listings · ${exact} exact pins · ${Math.max(0,cards.length-exact)} pending verification`}
 }finally{running=false;if(listen)observer?.observe(listen,{childList:true})}
}
let listen=null;
function boot(){listen=document.querySelector('#pandal-list');if(!listen)return;observer=new MutationObserver(()=>{if(!running)requestAnimationFrame(run)});observer.observe(listen,{childList:true});run();setTimeout(run,3000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
