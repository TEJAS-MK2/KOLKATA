(()=>{
'use strict';
function boot(){
  const toolbar=document.querySelector('.explorer-toolbar');
  if(!toolbar||document.getElementById('filter-fix-style'))return;
  const style=document.createElement('style');
  style.id='filter-fix-style';
  style.textContent=`
    .explorer-toolbar{position:sticky;top:72px;z-index:900;margin-top:0;padding:12px 0;background:var(--paper,#f7f4ee);isolation:isolate}
    @media(max-width:800px){
      .explorer-toolbar{top:64px;padding:10px 0;margin-bottom:14px}
      .filter-row{scrollbar-width:none}
      .filter-row::-webkit-scrollbar{display:none}
    }
  `;
  document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
