(()=>{
'use strict';
function boot(){
  const header=document.querySelector('.site-header');
  const nav=header?.querySelector('nav');
  const menu=header?.querySelector('.menu');
  if(!nav||!menu||menu.dataset.fixed==='true')return;
  menu.dataset.fixed='true';
  const style=document.createElement('style');
  style.id='menu-fix-css';
  style.textContent=`
    @media(max-width:800px){
      .site-header{position:relative}
      .site-header .menu{display:flex!important;position:relative;align-items:center;justify-content:center;width:44px;height:44px;padding:10px;margin:0;z-index:20001;cursor:pointer}
      .site-header .menu span{pointer-events:none;display:block}
      .site-header nav{display:none!important;position:absolute!important;top:calc(100% + 8px)!important;right:0!important;left:auto!important;width:min(230px,calc(100vw - 28px));box-sizing:border-box;z-index:20000!important;flex-direction:column!important;align-items:stretch!important;gap:2px!important;padding:8px!important;background:rgba(20,12,10,.98)!important;border:1px solid rgba(243,234,217,.18)!important;border-radius:14px!important;box-shadow:0 16px 40px rgba(0,0,0,.28)!important}
      .site-header nav[data-menu-open="true"]{display:flex!important}
      .site-header nav a{display:block!important;padding:13px 14px!important;color:#f3ead9!important;text-decoration:none!important;opacity:1!important;border-radius:9px!important}
      .site-header nav a:active,.site-header nav a:focus-visible,.site-header nav a:hover{background:rgba(243,234,217,.1)!important}
    }
    @media(min-width:801px){.site-header .menu{display:none!important}.site-header nav{display:flex!important}}
  `;
  document.head.appendChild(style);
  const setOpen=open=>{
    nav.dataset.menuOpen=String(open);
    nav.dataset.open=String(open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close menu':'Open menu');
  };
  setOpen(false);
  menu.addEventListener('click',event=>{
    if(window.innerWidth>800)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    setOpen(nav.dataset.menuOpen!=='true');
  },true);
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    if(window.innerWidth<=800)setOpen(false);
  }));
  document.addEventListener('click',event=>{
    if(window.innerWidth<=800&&nav.dataset.menuOpen==='true'&&!nav.contains(event.target)&&!menu.contains(event.target))setOpen(false);
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&nav.dataset.menuOpen==='true'){setOpen(false);menu.focus();}
  });
  window.addEventListener('resize',()=>{if(window.innerWidth>800)setOpen(false);},{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
