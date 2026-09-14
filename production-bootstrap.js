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
  'Naktala Udayan Sangha':[22.47449,88.36658],
  'Chetla Agrani':[22.51640,88.33684],
  'Ekdalia Evergreen':[22.52125,88.36596],
  'Hindusthan Park':[22.51768,88.36207],
  'Ballygunge Cultural Association':[22.51646,88.35561],
  'Bosepukur Sitala Mandir':[22.51915,88.38475],
  '66 Pally':[22.51824,88.34286],
  'Mudiali':[22.51008,88.34663],
  'Suruchi Sangha':[22.50899,88.33395],
  'Jagat Mukherjee Park':[22.59967,88.36600],
  'Kashi Bose Lane':[22.59100,88.36890],
  'Nalin Sarkar Street':[22.59500,88.37390],
  'Ahiritola Sarbojanin':[22.59484,88.35717],
  'Kumartuli Sarbojanin':[22.60088,88.36232],
  'Hatibagan Nabinpally':[22.59590,88.37342],
  '20 Palli Sarbojani Durgotsab':[22.59363,88.35813],
  'Badamtala Ashar Sangha':[22.51797,88.34372],
  'Tridhara Sammilani':[22.51953,88.35544],
  'Simla Byayam Samity':[22.58533,88.36503],
  'Jodhpur Park Sarbojanin':[22.50458,88.36560],
  'Ajeya Sanghati':[22.48055,88.33742],
  'Barisha Club':[22.48129,88.31324],
  'Behala Nutan Dal':[22.50021,88.32029]
};
const PHOTOS={
  'Badamtala Ashar Sangha':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Badamtala_Ashar_Sangha_-_Kolkata_2012-10-23_1159.JPG',
  'Tridhara Sammilani':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Tridhara_Sammilani_-_Manohar_Pukur_Road_-_Kolkata_2017-09-26_3988.JPG',
  'Simla Byayam Samity':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Simla_Byayam_Samity_-_Kolkata_2012-10-23_1170.JPG',
  'Jodhpur Park Sarbojanin':'https://commons.wikimedia.org/wiki/Special:FilePath/Jodhpur_Park.jpg',
  'Ajeya Sanghati':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Ajeya_Sanghati_-_Kolkata_2017-09-26_4012.JPG',
  'Barisha Club':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Barisha_Club_-_Kolkata_2012-10-23_1142.JPG',
  'Behala Nutan Dal':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Behala_Natun_Dal_-_Kolkata_2012-10-23_1145.JPG'
};
const META={
  'Tala Prattoy':['North','Tala'],'Hatibagan Sarbojanin':['North','Hatibagan'],'Sree Bhumi Sporting Club':['North','Sreebhumi'],'Dumdum Park Bharat Chakra':['North','Dum Dum Park'],'Dumdum Park Sarbojanin':['North','Dum Dum Park'],'Kumartuli Park':['North','Kumartuli'],'Shobhabazar Rajbari':['North','Shobhabazar'],'College Square':['Central','College Street'],'Santosh Mitra Square':['Central','Sealdah'],'Maddox Square':['South','Ballygunge'],'Deshapriya Park':['South','Deshapriya Park'],'Naktala Udayan Sangha':['South','Naktala'],'Chetla Agrani':['South','Chetla'],'Ekdalia Evergreen':['South','Gariahat'],'Hindusthan Park':['South','Gariahat'],'Ballygunge Cultural Association':['South','Ballygunge'],'Bosepukur Sitala Mandir':['South','Bosepukur'],'66 Pally':['South','Ballygunge'],'Mudiali':['South','Tollygunge'],'Suruchi Sangha':['South','New Alipore'],'Jagat Mukherjee Park':['North','Shobhabazar'],'Kashi Bose Lane':['North','Hatibagan'],'Nalin Sarkar Street':['North','Hatibagan'],'Ahiritola Sarbojanin':['North','Ahiritola'],'Kumartuli Sarbojanin':['North','Kumartuli'],'Hatibagan Nabinpally':['North','Hatibagan'],'20 Palli Sarbojani Durgotsab':['North','Ahiritola'],'Badamtala Ashar Sangha':['South','Kalighat'],'Tridhara Sammilani':['South','Manoharpukur'],'Simla Byayam Samity':['North','Simla'],'Jodhpur Park Sarbojanin':['South','Jodhpur Park'],'Ajeya Sanghati':['South','Tollygunge'],'Barisha Club':['South','Barisha'],'Behala Nutan Dal':['South','Behala']
};
function normalize(list){
 if(!Array.isArray(list))return [];
 for(const [name,coords] of Object.entries(CANONICAL)){
  const existing=list.find(p=>p?.name===name),meta=META[name]||[];
  if(existing){existing.lat=coords[0];existing.lng=coords[1];if(meta[0])existing.zone=meta[0];if(meta[1])existing.area=meta[1];existing.tag=existing.tag||'Verified location';if(PHOTOS[name]&&!existing.photo)existing.photo=PHOTOS[name];}
  else list.push({name,zone:meta[0]||'Kolkata',area:meta[1]||'Kolkata',lat:coords[0],lng:coords[1],tag:'Verified location',photo:PHOTOS[name]||'',rating:0});
 }
 return list;
}
let stored=normalize([]);
try{
 const desc=Object.getOwnPropertyDescriptor(window,'pandals');
 if(desc?.get&&desc?.set)stored=normalize(Array.isArray(window.pandals)?window.pandals:stored);
 else if(desc&&!desc.configurable)stored=normalize(window.pandals);
 else Object.defineProperty(window,'pandals',{configurable:true,get(){return stored},set(value){stored=normalize(Array.isArray(value)?value:[])}});
}catch{}
if(window.L?.map&&!window.L.map.__kolkataWrapped){const originalMap=window.L.map;const wrappedMap=function(...args){const instance=originalMap.apply(this,args);window.kolkataMap=instance;window.map=instance;return instance};wrappedMap.__kolkataWrapped=true;window.L.map=wrappedMap;}
window.KOLKATA_CANONICAL_PINS=Object.freeze({...CANONICAL});
window.KOLKATA_NORMALIZE_PANDALS=normalize;
function syncDirections(){const active=document.querySelector('.mode-btn.active')?.dataset.mode||window.KolkataState?.get?.().mode||'walking';const mode=active==='two-wheeler'?'driving':active;document.querySelectorAll('a[href*="google.com/maps/dir/"]').forEach(a=>{try{const u=new URL(a.href);u.searchParams.set('travelmode',mode);a.href=u.toString()}catch{}})}
function boot(){syncDirections()}
document.addEventListener('click',event=>{if(event.target.closest('.mode-btn'))setTimeout(syncDirections,0);if(event.target.closest('a[href*="google.com/maps/dir/"]'))setTimeout(syncDirections,0)},{capture:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
