(()=>{
'use strict';
function boot(){
  const toolbar=document.querySelector('.explorer-toolbar');
  const filters=document.querySelector('#pandal-filters');
  if(!toolbar||!filters||document.getElementById('filter-fix-style'))return;
  const style=document.createElement('style');
  style.id='filter-fix-style';
  style.textContent=`
    .explorer-toolbar{position:sticky;top:72px;z-index:900;margin-top:0;padding:12px 0;background:var(--ink,#140c0a);isolation:isolate}
    #pandal-filters{position:sticky;top:72px;z-index:901}
    @media(max-width:800px){
      .explorer-toolbar{top:64px;padding:10px 0;margin-bottom:14px}
      #pandal-filters{position:relative;top:auto}
      .filter-row{scrollbar-width:none}
      .filter-row::-webkit-scrollbar{display:none}
    }
  `;
  document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
