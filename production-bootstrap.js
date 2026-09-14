(()=>{
'use strict';
const CANONICAL={
  'Bagbazar Sarbojanin':[22.60121,88.36682],
  'Tala Prattoy':[22.61046,88.38460],
  'Hatibagan Sarbojanin':[22.59439,88.37200],
  'Sree Bhumi Sporting Club':[22.59890,88.40293],
  'Dumdum Park Bharat Chakra':[22.61082,88.41460],
  'Dumdum Park Sarbojanin':[22.60944,88.41641],
  'Kumartuli Park':[22.59898,88.36147],
  'Shobhabazar Rajbari':[22.59626,88.36738],
  'College Square':[22.57453,88.36447],
  'Santosh Mitra Square':[22.56602,88.36565],
  'Maddox Square':[22.52656,88.35465],
  'Deshapriya Park':[22.51858,88.35346],
  'Naktala Udayan Sangha':[22.47449,88.36658]
};
const EXTRA={
  'Tala Prattoy':['North','Tala',22.61046,88.38460,'Verified location'],
  'Hatibagan Sarbojanin':['North','Hatibagan',22.59439,88.37200,'Verified location'],
  'Sree Bhumi Sporting Club':['North','Sreebhumi',22.59890,88.40293,'Verified location'],
  'Dumdum Park Bharat Chakra':['North','Dum Dum Park',22.61082,88.41460,'Verified location'],
  'Dumdum Park Sarbojanin':['North','Dum Dum Park',22.60944,88.41641,'Verified location']
};
function normalize(list){
  if(!Array.isArray(list))return list;
  for(const [name,[zone,area,lat,lng,tag]] of Object.entries(EXTRA)){
    if(!list.some(p=>p?.name===name))list.push({name,zone,area,lat,lng,tag,photo:'',rating:0});
  }
  list.forEach(p=>{const xy=CANONICAL[p?.name];if(xy){p.lat=xy[0];p.lng=xy[1]}});
  return list;
}
let stored;
try{
  const desc=Object.getOwnPropertyDescriptor(window,'pandals');
  if(desc && !desc.configurable){stored=normalize(window.pandals);}
  else Object.defineProperty(window,'pandals',{configurable:true,get(){return stored},set(value){stored=normalize(value)}});
}catch{}
if(window.L?.map&&!window.L.map.__kolkataWrapped){
  const originalMap=window.L.map;
  const wrappedMap=function(...args){const instance=originalMap.apply(this,args);window.kolkataMap=instance;window.map=instance;return instance};
  wrappedMap.__kolkataWrapped=true;
  window.L.map=wrappedMap;
}
window.KOLKATA_CANONICAL_PINS=Object.freeze({...CANONICAL});
window.KOLKATA_NORMALIZE_PANDALS=normalize;
function slug(p){return String(p.id||p.slug||p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'))}
function syncDirections(){
  const active=document.querySelector('.mode-btn.active')?.dataset.mode||localStorage.getItem('kolkata-pujo-mode')||'walking';
  const mode=active==='two-wheeler'?'driving':active;
  document.querySelectorAll('a[href*="google.com/maps/dir/"]').forEach(a=>{try{const u=new URL(a.href);u.searchParams.set('travelmode',mode);a.href=u.toString()}catch{}});
}
function syncPersonalState(){
  try{
    const fav=JSON.parse(localStorage.getItem('kolkata-pujo-favourites-v1')||'[]');
    const current=JSON.parse(localStorage.getItem('kolkata-puja-2026-personal-v2')||'{"saved":[],"visited":[],"notes":{}}');
    const ids=new Set([...(current.saved||[]),...fav.map(name=>{const p=window.pandals?.find?.(x=>x.name===name);return p?slug(p):String(name)})]);
    current.saved=[...ids];
    localStorage.setItem('kolkata-puja-2026-personal-v2',JSON.stringify(current));
  }catch{}
}
function syncFavoritesFromPro(){
  try{
    const current=JSON.parse(localStorage.getItem('kolkata-puja-2026-personal-v2')||'{"saved":[]}');
    const existing=JSON.parse(localStorage.getItem('kolkata-pujo-favourites-v1')||'[]');
    const names=new Set(existing);
    (current.saved||[]).forEach(id=>{const p=window.pandals?.find?.(x=>slug(x)===String(id));if(p)names.add(p.name)});
    localStorage.setItem('kolkata-pujo-favourites-v1',JSON.stringify([...names]));
  }catch{}
}
function boot(){syncDirections();syncPersonalState()}
document.addEventListener('click',event=>{
  if(event.target.closest('.mode-btn'))setTimeout(syncDirections,0);
  if(event.target.closest('.v2-fav'))setTimeout(syncPersonalState,0);
  if(event.target.closest('#pro-save-one,#pro-first-save'))setTimeout(syncFavoritesFromPro,0);
  if(event.target.closest('a[href*="google.com/maps/dir/"]'))setTimeout(syncDirections,0);
},{capture:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
