(()=>{
  'use strict';

  // Final integration fixes. This pass intentionally owns the last-mile verified-pin
  // presentation because the catalog has a late finalizer that can rebuild the cards.
  const CANONICAL_PINS={
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
  const VERIFIED=new Set(Object.keys(CANONICAL_PINS));

  const mapsDir=(lat,lng)=>`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${encodeURIComponent(localStorage.getItem('kolkata-pujo-mode')||'walking')}`;

  function syncCanonicalPins(){
    if(Array.isArray(window.pandals)){
      Object.entries(CANONICAL_PINS).forEach(([name,[lat,lng]])=>{
        const p=window.pandals.find(x=>x.name===name);
        if(p){p.lat=lat;p.lng=lng;}
      });
    }

    document.querySelectorAll('#pandal-list .pandal-card[data-name]').forEach(card=>{
      const pin=CANONICAL_PINS[card.dataset.name];
      if(!pin)return;
      const link=card.querySelector('.route');
      if(link)link.href=mapsDir(pin[0],pin[1]);
    });
  }

  function syncVerifiedCardUI(){
    document.querySelectorAll('#pandal-list .pandal-card[data-name]').forEach(card=>{
      const name=card.dataset.name;
      if(!VERIFIED.has(name))return;

      let status=card.querySelector('.pin-status');
      if(!status){
        status=document.createElement('div');
        status.className='pin-status verified';
        const title=card.querySelector('h3');
        title?.after(status);
      }
      status.classList.remove('pending');
      status.classList.add('verified');
      status.textContent='● Map pin verified';
      status.setAttribute('aria-label','Exact map pin verified');

      const pending=card.querySelector('.pending-pin');
      pending?.classList.remove('pending-pin');

      const route=card.querySelector('.route');
      const pin=CANONICAL_PINS[name];
      if(route&&pin)route.href=mapsDir(pin[0],pin[1]);
    });
  }

  function removeRedundantBlocks(){
    document.getElementById('suite-route')?.remove();
    document.getElementById('latest-2026-note')?.remove();
  }

  function normalizeExplorerCount(){
    const list=document.querySelector('#pandal-list');
    const count=document.querySelector('#pandal-result-count');
    if(!list||!count)return;
    const cards=[...list.querySelectorAll('.pandal-card')];
    const exact=cards.filter(c=>VERIFIED.has(c.dataset.name)).length;
    if(exact===0)return;
    count.textContent=`${cards.length} discovery listings · ${exact} exact pins · ${Math.max(0,cards.length-exact)} pending verification`;
  }

  function run(){
    syncCanonicalPins();
    syncVerifiedCardUI();
    removeRedundantBlocks();
    normalizeExplorerCount();
  }

  function observe(){
    const list=document.querySelector('#pandal-list');
    if(!list||list.dataset.qaHotfixObserved==='1')return;
    list.dataset.qaHotfixObserved='1';
    new MutationObserver(()=>requestAnimationFrame(run)).observe(list,{childList:true});
  }

  function boot(){
    run();
    observe();
    window.setTimeout(run,3000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
