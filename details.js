(()=>{
  const modal=document.querySelector('#pandal-details');
  const nav=document.querySelector('.site-header nav');
  const menu=document.querySelector('.site-header .menu');

  // Mobile navigation repair: the original menu button existed but had no mobile
  // display rule. Keep the existing script's toggle logic, then normalize the
  // visual state here so the menu remains reliable across viewport changes.
  if(nav&&menu){
    const style=document.createElement('style');
    style.textContent=`
      @media(max-width:800px){
        .site-header .menu{display:flex!important;align-items:center;justify-content:center;width:44px;height:44px;padding:10px;margin:0;cursor:pointer;z-index:1001}
        .site-header .menu span{pointer-events:none}
        .site-header nav{display:none!important;position:absolute;top:72px;right:16px;z-index:1000;min-width:180px;flex-direction:column;align-items:stretch;gap:0;padding:8px;background:rgba(247,244,238,.98);border:1px solid var(--line);border-radius:12px;box-shadow:0 12px 32px rgba(24,21,18,.14)}
        .site-header nav[data-open="true"]{display:flex!important}
        .site-header nav a{display:block;padding:13px 14px;opacity:1!important;color:var(--ink)!important;border-radius:8px}
        .site-header nav a:hover,.site-header nav a:focus-visible{background:var(--paper-2);color:var(--red)!important}
      }
      @media(min-width:801px){.site-header nav{display:flex!important}.site-header .menu{display:none!important}}
    `;
    document.head.appendChild(style);

    const syncMenu=()=>{
      const open=nav.dataset.open==='true';
      menu.setAttribute('aria-expanded',String(open));
      menu.setAttribute('aria-label',open?'Close menu':'Open menu');
      if(window.innerWidth>800){
        nav.dataset.open='false';
        nav.style.display='';
      }
    };
    menu.addEventListener('click',()=>requestAnimationFrame(syncMenu));
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
      if(window.innerWidth<=800){
        nav.dataset.open='false';
        menu.setAttribute('aria-expanded','false');
        menu.setAttribute('aria-label','Open menu');
      }
    }));
    document.addEventListener('click',event=>{
      if(window.innerWidth<=800&&nav.dataset.open==='true'&&!nav.contains(event.target)&&!menu.contains(event.target)){
        nav.dataset.open='false';
        menu.setAttribute('aria-expanded','false');
        menu.setAttribute('aria-label','Open menu');
      }
    });
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&window.innerWidth<=800&&nav.dataset.open==='true'){
        nav.dataset.open='false';
        menu.setAttribute('aria-expanded','false');
        menu.setAttribute('aria-label','Open menu');
        menu.focus();
      }
    });
    window.addEventListener('resize',syncMenu,{passive:true});
    syncMenu();
  }

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
  function focusables(){return [...modal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.offsetParent!==null);}
  function openDetails(p){
    if(!p)return; current=p; previousFocus=document.activeElement;
    image.src=p.photo; image.alt=`Archive photo associated with ${p.name}`; image.onerror=()=>{image.removeAttribute('src');image.alt='Archive image unavailable';};
    zone.textContent=`${p.zone} Kolkata · ${p.tag}`; title.textContent=p.name; summary.textContent=descriptions[p.name]||`Explore ${p.name} in ${p.area}, ${p.zone} Kolkata.`; area.textContent=p.area; zoneFact.textContent=p.zone; rating.textContent=p.rating?`${p.rating.toFixed(1)} / 5`:'Not rated';
    const mode=document.querySelector('.mode-btn.active')?.dataset.mode||'walking';
    directions.href=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}&travelmode=${encodeURIComponent(mode)}`;
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
  document.addEventListener('keydown',e=>{
    if(modal.hidden)return;
    if(e.key==='Escape'){e.preventDefault();closeDetails();return;}
    if(e.key==='Tab'){
      const items=focusables();if(!items.length)return;
      const first=items[0],last=items[items.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
})();