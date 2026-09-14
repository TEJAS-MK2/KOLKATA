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
    const syncMenu=()=>{if(window.innerWidth>800)setMenu(false);else setMenu(nav.dataset.open==='true')};
    menu.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();setMenu(nav.dataset.open!=='true')});
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{if(window.innerWidth<=800)setMenu(false)}));
    document.addEventListener('click',event=>{if(window.innerWidth<=800&&nav.dataset.open==='true'&&!nav.contains(event.target)&&!menu.contains(event.target))setMenu(false)});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&window.innerWidth<=800&&nav.dataset.open==='true'){event.preventDefault();setMenu(false);menu.focus()}});
    window.addEventListener('resize',syncMenu,{passive:true});syncMenu();
  }

  const findPandal=name=>window.pandals?.find?.(p=>p.name===name)||null;
  let lastFocus=null;
  function openDetails(name){
    const p=findPandal(name);if(!p||!modal)return;
    lastFocus=document.activeElement;
    const img=document.querySelector('#details-image'),zone=document.querySelector('#details-zone'),title=document.querySelector('#details-title'),summary=document.querySelector('#details-summary'),area=document.querySelector('#details-area'),zoneFact=document.querySelector('#details-zone-fact'),rating=document.querySelector('#details-rating'),route=document.querySelector('#details-route'),directions=document.querySelector('#details-directions');
    if(img){img.src=p.photo||'';img.alt=`Archive photo associated with ${p.name}`;img.style.display=p.photo?'block':'none'}
    if(zone)zone.textContent=p.zone||'Kolkata';if(title)title.textContent=p.name;if(summary)summary.textContent=p.tag||'Kolkata Puja pandal guide point.';if(area)area.textContent=p.area||'Kolkata';if(zoneFact)zoneFact.textContent=p.zone||'Kolkata';if(rating)rating.textContent=Number(p.rating)>0?`${Number(p.rating).toFixed(1)} / 5 (historical)`: 'Not rated';
    const mode=document.querySelector('.mode-btn.active')?.dataset.mode||localStorage.getItem('kolkata-pujo-mode')||'walking';const travel=mode==='two-wheeler'?'driving':mode;
    if(directions)directions.href=Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lng))?`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}&travelmode=${encodeURIComponent(travel)}`:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.area||''}, Kolkata, West Bengal`)}`;
    const inRoute=window.routeStops?.some?.(x=>x.name===p.name);if(route){route.textContent=inRoute?'Added ✓':'Add to Puja Night +';route.disabled=!!inRoute}
    modal.hidden=false;modal.setAttribute('aria-hidden','false');requestAnimationFrame(()=>modal.classList.add('open'));document.body.style.overflow='hidden';route?.focus();
  }
  function closeDetails(){if(!modal)return;modal.classList.remove('open');modal.hidden=true;modal.setAttribute('aria-hidden','true');document.body.style.overflow='';lastFocus?.focus?.();lastFocus=null}
  document.addEventListener('click',event=>{const card=event.target.closest('#pandal-list .pandal-card');if(!card||event.target.closest('a,button'))return;openDetails(card.dataset.name)});
  modal?.querySelectorAll('[data-details-close]').forEach(el=>el.addEventListener('click',closeDetails));
  modal?.querySelector('.pandal-details-close')?.addEventListener('click',closeDetails);
  document.querySelector('#details-route')?.addEventListener('click',()=>{const p=findPandal(document.querySelector('#details-title')?.textContent?.trim());if(!p)return;if(window.addToRoute){window.addToRoute(p);document.querySelector('#details-route').textContent='Added ✓';document.querySelector('#details-route').disabled=true}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal&&!modal.hidden)closeDetails()});
  document.addEventListener('click',event=>{if(event.target.closest('.pandal-card')){const name=event.target.closest('.pandal-card')?.dataset.name;if(name)setTimeout(()=>openDetails(name),0)}});
  function syncRouteLinks(){const travel=document.querySelector('.mode-btn.active')?.dataset.mode||localStorage.getItem('kolkata-pujo-mode')||'walking';const mode=travel==='two-wheeler'?'driving':travel;document.querySelectorAll('#pandal-list .pandal-card[data-name]').forEach(card=>{const p=findPandal(card.dataset.name),link=card.querySelector('.route');if(!p||!link)return;if(Number.isFinite(Number(p.lat))&&Number.isFinite(Number(p.lng)))link.href=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lng}`)}&travelmode=${encodeURIComponent(mode)}`;else link.href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.area||''}, Kolkata, West Bengal`)}`})}
  const list=document.querySelector('#pandal-list');if(list)new MutationObserver(()=>requestAnimationFrame(syncRouteLinks)).observe(list,{childList:true});
  window.addEventListener('kolkata:canonical-controller-ready',syncRouteLinks);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncRouteLinks,{once:true});else syncRouteLinks();
})();
