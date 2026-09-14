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
})();
