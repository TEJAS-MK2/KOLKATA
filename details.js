(()=>{
  const modal=document.querySelector('#pandal-details');
  const nav=document.querySelector('.site-header nav');
  const menu=document.querySelector('.site-header .menu');

  if(nav&&menu){
    const style=document.createElement('style');
    style.textContent=`
      .site-header nav{align-items:center;gap:6px}
      .site-header nav a{position:relative;padding:8px 11px;border-radius:999px;transition:background .18s ease,color .18s ease,transform .18s ease}
      .site-header nav a::after{content:'';position:absolute;left:11px;right:11px;bottom:4px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:center;transition:transform .18s ease;opacity:.65}
      .site-header nav a:hover,.site-header nav a:focus-visible{background:rgba(24,21,18,.06);transform:translateY(-1px)}
      .site-header nav a:hover::after,.site-header nav a:focus-visible::after{transform:scaleX(1)}
      @media(max-width:800px){
        .site-header .menu{display:flex!important;align-items:center;justify-content:center;width:44px;height:44px;padding:10px;margin:0;cursor:pointer;z-index:1001;touch-action:manipulation}
        .site-header .menu span{pointer-events:none;transition:transform .18s ease,opacity .18s ease}
        .site-header .menu[aria-expanded="true"] span:first-child{transform:translateY(3.5px) rotate(45deg)}
        .site-header .menu[aria-expanded="true"] span:last-child{transform:translateY(-3.5px) rotate(-45deg)}
        .site-header nav{display:none!important;position:absolute;top:72px;right:16px;z-index:1000;min-width:190px;flex-direction:column;align-items:stretch;gap:2px;padding:8px;background:rgba(247,244,238,.98);border:1px solid var(--line);border-radius:14px;box-shadow:0 12px 32px rgba(24,21,18,.14)}
        .site-header nav[data-open="true"]{display:flex!important}
        .site-header nav a{display:block;padding:13px 14px;opacity:1!important;color:var(--ink)!important;border-radius:9px}
        .site-header nav a::after{display:none}
        .site-header nav a:hover,.site-header nav a:focus-visible{background:var(--paper-2);color:var(--red)!important;transform:none}
        .explorer-toolbar{position:sticky!important;top:72px;z-index:90;background:var(--paper);padding:10px 0 12px;margin-top:0!important;margin-bottom:18px!important;border-bottom:1px solid var(--line);isolation:isolate}
        .explorer-toolbar .explorer-search{display:block}
        .explorer-status{margin:0 0 10px!important;padding:0;font-size:11px;color:var(--muted)}
        .filter-row{display:flex;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:2px 1px 3px}
        .filter-row::-webkit-scrollbar{display:none}
        .filter-btn{flex:0 0 auto;white-space:nowrap}
        .explorer-v2-tools{position:static!important;top:auto!important;z-index:auto!important;overflow-x:auto;overflow-y:hidden;flex-wrap:nowrap;scrollbar-width:none;-webkit-overflow-scrolling:touch;background:transparent!important;backdrop-filter:none!important}
        .explorer-v2-tools::-webkit-scrollbar{display:none}
        .explorer-v2-tools>*{flex:0 0 auto}
        .explorer-v2-tools .v2-spacer{display:none}
      }
      @media(min-width:801px){.site-header nav{display:flex!important}.site-header .menu{display:none!important}}
    `;
    document.head.appendChild(style);
    const setMenu=open=>{nav.dataset.open=String(open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu')};
    const syncMenu=()=>{if(window.innerWidth>800){setMenu(false);nav.style.display=''}else setMenu(nav.dataset.open==='true')};
    menu.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();if(window.innerWidth<=800)setMenu(nav.dataset.open!=='true')});
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{if(window.innerWidth<=800)setMenu(false)}));
    document.addEventListener('click',event=>{if(window.innerWidth<=800&&nav.dataset.open==='true'&&!nav.contains(event.target)&&!menu.contains(event.target))setMenu(false)});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&window.innerWidth<=800&&nav.dataset.open==='true'){event.preventDefault();setMenu(false);menu.focus()}});
    window.addEventListener('resize',syncMenu,{passive:true});syncMenu();
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
  function findPandal(name){return window.pandals?.find?.(p=>p.name===name)||null}
  function directionsUrl(p){
    if(!p)return 'https://www.google.com/maps/search/?api=1&query=Kolkata%20Durga%20Puja';
    const mode=document.querySelector('.mode-btn.active')?.dataset.mode||localStorage.getItem('kolkata-pujo-mode')||'walking';
    const travel=mode==='two-wheeler'?'driving':mode;
    if(Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lng)))return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}&travelmode=${encodeURIComponent(travel)}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.area||''}, Kolkata, West Bengal`)}`;
  }
  function focusables(){return [...modal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.offsetParent!==null)}
  function openDetails(p){
    if(!p)return;current=p;previousFocus=document.activeElement;
    image.src=p.photo||'';image.alt=p.photo?`Archive photo associated with ${p.name}`:'Archive image unavailable';image.onerror=()=>{image.removeAttribute('src');image.alt='Archive image unavailable'};
    zone.textContent=`${p.zone} Kolkata · ${p.tag||'Discovery listing'}`;title.textContent=p.name;summary.textContent=descriptions[p.name]||`Explore ${p.name} in ${p.area}, ${p.zone} Kolkata.`;area.textContent=p.area||'Kolkata';zoneFact.textContent=p.zone||'Kolkata';rating.textContent=p.rating?`${p.rating.toFixed(1)} / 5`:'Not rated';
    directions.href=directionsUrl(p);
    const inRoute=window.routeStops?.some?.(x=>x.name===p.name);route.textContent=inRoute?'Added ✓':'Add to Puja Night +';route.disabled=!!inRoute;
    modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';document.querySelector('.pandal-details-close')?.focus();
  }
  function closeDetails(){modal.hidden=true;modal.setAttribute('aria-hidden','true');document.body.style.overflow='';previousFocus?.focus?.();current=null}
  document.addEventListener('click',e=>{const card=e.target.closest?.('.pandal-card');if(card&&!e.target.closest('a,button'))openDetails(findPandal(card.dataset.name));if(e.target.matches?.('[data-details-close]'))closeDetails()});
  route?.addEventListener('click',()=>{if(!current)return;if(window.addToRoute){window.addToRoute(current);route.textContent='Added ✓';route.disabled=true}});
  document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape'){e.preventDefault();closeDetails();return}if(e.key==='Tab'){const items=focusables();if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
})();

(()=>{
  const list=document.querySelector('#pandal-list');if(!list)return;
  const sync=()=>{
    const visible=new Set([...list.querySelectorAll('.pandal-card')].map(c=>c.dataset.name));
    document.querySelectorAll('.leaflet-marker-icon').forEach(icon=>{const name=icon.getAttribute('title')||icon.getAttribute('alt');if(name)icon.style.display=visible.has(name)?'':'none'});
    const mode=document.querySelector('.mode-btn.active')?.dataset.mode||localStorage.getItem('kolkata-pujo-mode')||'walking';
    const travel=mode==='two-wheeler'?'driving':mode;
    list.querySelectorAll('.pandal-card').forEach(card=>{const p=window.pandals?.find?.(x=>x.name===card.dataset.name),link=card.querySelector('.route');if(!p||!link)return;if(Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lng)))link.href=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}&travelmode=${encodeURIComponent(travel)}`;else link.href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.area||''}, Kolkata, West Bengal`)}`});
    let status=document.querySelector('.explorer-status');if(!status){status=document.createElement('p');status.className='explorer-status';status.setAttribute('aria-live','polite');document.querySelector('.explorer-toolbar')?.after(status)}
    const count=list.querySelectorAll('.pandal-card').length;status.textContent=`${count} ${count===1?'pandal':'pandals'} shown`;
  };
  new MutationObserver(sync).observe(list,{childList:true});
  document.querySelectorAll('.mode-btn').forEach(btn=>btn.addEventListener('click',()=>setTimeout(sync,0)));
  sync();
})();
