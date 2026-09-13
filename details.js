(()=>{
  const modal=document.querySelector('#pandal-details');
  if(!modal)return;
  const image=document.querySelector('#details-image'),zone=document.querySelector('#details-zone'),title=document.querySelector('#details-title'),summary=document.querySelector('#details-summary'),area=document.querySelector('#details-area'),zoneFact=document.querySelector('#details-zone-fact'),rating=document.querySelector('#details-rating'),route=document.querySelector('#details-route'),directions=document.querySelector('#details-directions');
  let current=null,previousFocus=null;
  const descriptions={
    'Bagbazar Sarbojanin':'A heritage favourite in North Kolkata, known for its long-running community Puja and classic Bagbazar atmosphere.',
    'Kumartuli Park':'A North Kolkata stop beside the artisan quarter, pairing pandal culture with the neighbourhood where many Durga idols are made.',
    'Shobhabazar Rajbari':'A historic North Kolkata experience centred on the old Rajbari tradition and a very different sense of Puja scale.',
    'College Square':'A Central Kolkata favourite around College Street, especially atmospheric when the surrounding streets light up at night.',
    'Santosh Mitra Square':'A Central Kolkata theme-driven stop in the Sealdah area, best treated as one of the route highlights when crowd conditions allow.',
    'Maddox Square':'A classic South Kolkata adda spot in Ballygunge with a relaxed neighbourhood identity and a strong evening atmosphere.',
    'Deshapriya Park':'A major South Kolkata stop around Deshapriya Park, useful as an anchor for a wider south-side Puja route.',
    'Naktala Udayan Sangha':'A neighbourhood favourite in Naktala, suited to visitors who want to explore beyond the central headline pandals.'
  };
  function findPandal(name){return window.pandals?.find?.(p=>p.name===name)||null;}
  function openDetails(p){
    if(!p)return; current=p; previousFocus=document.activeElement;
    image.src=p.photo; image.alt=`Archive photo associated with ${p.name}`; image.onerror=()=>{image.removeAttribute('src');image.alt='Archive image unavailable';};
    zone.textContent=`${p.zone} Kolkata · ${p.tag}`; title.textContent=p.name; summary.textContent=descriptions[p.name]||`Explore ${p.name} in ${p.area}, ${p.zone} Kolkata.`; area.textContent=p.area; zoneFact.textContent=p.zone; rating.textContent=p.rating?`${p.rating.toFixed(1)} / 5`:'Not rated';
    directions.href=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}`;
    const inRoute=window.routeStops?.some?.(x=>x.name===p.name); route.textContent=inRoute?'Added ✓':'Add to Puja Night +'; route.disabled=!!inRoute;
    modal.hidden=false; modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; document.querySelector('.pandal-details-close')?.focus();
  }
  function closeDetails(){modal.hidden=true;modal.setAttribute('aria-hidden','true');document.body.style.overflow='';previousFocus?.focus?.();current=null;}
  document.addEventListener('click',e=>{
    const card=e.target.closest?.('.pandal-card');
    if(card&&!e.target.closest('a,button'))openDetails(findPandal(card.dataset.name));
    if(e.target.matches?.('[data-details-close]'))closeDetails();
  });
  route?.addEventListener('click',()=>{if(!current)return; if(window.addToRoute){window.addToRoute(current); route.textContent='Added ✓'; route.disabled=true;}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeDetails();});
})();