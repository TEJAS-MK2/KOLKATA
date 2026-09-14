(()=>{
  'use strict';

  // Final integration fixes. Runs after the feature scripts injected by Pages workflow.
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

  function removeRedundantBlocks(){
    // The base route planner already has route-intelligence metrics. The suite was
    // adding a second identical metrics card underneath it.
    document.getElementById('suite-route')?.remove();

    // The official 2026 update and live layer already contain this information.
    // Remove the duplicate prose block to keep the page concise.
    document.getElementById('latest-2026-note')?.remove();
  }

  function normalizeExplorerCount(){
    const list=document.querySelector('#pandal-list');
    const count=document.querySelector('#pandal-result-count');
    if(!list||!count)return;
    const cards=[...list.querySelectorAll('.pandal-card')];
    const exact=cards.filter(c=>CANONICAL_PINS[c.dataset.name]).length;
    const text=count.textContent||'';
    if(!/exact pins|discovery listings/.test(text)){
      count.textContent=`${cards.length} shown · ${exact} exact pins`;
    }
  }

  function run(){
    syncCanonicalPins();
    removeRedundantBlocks();
    normalizeExplorerCount();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0),{once:true});
  else setTimeout(run,0);
})();
