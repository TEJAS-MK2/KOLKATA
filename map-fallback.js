(()=>{
'use strict';
// Graceful fallback for the optional MarkerCluster plugin.
// The main suite can still render all verified markers if the CDN is unavailable.
if(window.L&&!window.L.markerClusterGroup){
  window.L.markerClusterGroup=options=>window.L.layerGroup();
}
})();
