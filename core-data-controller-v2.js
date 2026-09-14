(()=>{
'use strict';
// Compatibility/readiness shim. script.js owns the canonical map, explorer and route UI.
const ready=()=>{
  try{window.initKolkataMap?.()}catch{}
  const count=Array.isArray(window.pandals)?window.pandals.length:0;
  const markers=document.querySelectorAll('.leaflet-marker-icon').length;
  if(count<28)return false;
  if(!markers){setTimeout(ready,250);return false}
  window.__KOLKATA_CANONICAL_CONTROLLER_READY=true;
  window.dispatchEvent(new CustomEvent('kolkata:canonical-controller-ready',{detail:{pandals:count,markers}}));
  return true;
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ready();setTimeout(ready,500)},{once:true});
else ready();
window.addEventListener('load',ready,{once:true});
window.addEventListener('kolkata:state-ready',ready,{once:true});
})();
