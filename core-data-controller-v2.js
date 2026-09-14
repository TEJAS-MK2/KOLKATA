(()=>{
'use strict';
// Compatibility/readiness shim. The canonical map, explorer and route controller lives in script.js.
const ready=()=>{const count=Array.isArray(window.pandals)?window.pandals.length:0;if(count<28)return false;window.__KOLKATA_CANONICAL_CONTROLLER_READY=true;window.dispatchEvent(new CustomEvent('kolkata:canonical-controller-ready',{detail:{pandals:count,markers:document.querySelectorAll('.leaflet-marker-icon').length}}));return true};
if(ready()){}else{window.addEventListener('load',ready,{once:true});window.addEventListener('kolkata:state-ready',ready,{once:true})}
})();
