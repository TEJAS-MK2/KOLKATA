(()=>{
'use strict';
const list=document.querySelector('#pandal-list');
if(!list)return;
const STORAGE='kolkata-pujo-favourites-v1';
let favourites=new Set();
let userPos=null;
let sortMode='recommended';
let verifiedOnly=false;
let nearbyOnly=false;
try{favourites=new Set(JSON.parse(localStorage.getItem(STORAGE)||'[]'))}catch{}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hav=(a,b)=>{const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180,x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(x))};
const getP=name=>window.pandals?.find?.(p=>p.name===name)||null;
const save=()=>{try{localStorage.setItem(STORAGE,JSON.stringify([...favourites]))}catch{}};
function addStyles(){if(document.getElementById('explorer-v2-css'))return;const s=document.createElement('style');s.id='explorer-v2-css';s.textContent=`
.explorer-v2-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 12px;padding:10px 0}
.explorer-v2-tools select,.explorer-v2-tools button{min-height:42px;border:1px solid rgba(243,234,217,.18);border-radius:999px;background:transparent;color:inherit;padding:9px 13px;font:inherit;cursor:pointer}
.explorer-v2-tools select{appearance:auto;background:rgba(20,12,10,.06)}
.explorer-v2-tools button.active{background:#f3ead9;color:#140c0a}
.explorer-v2-tools .v2-spacer{flex:1}
.explorer-v2-status{font-size:11px;opacity:.58;margin:2px 0 12px}
.catalog-card,.pandal-card{position:relative}
.v2-fav{position:absolute;right:10px;top:10px;z-index:4;width:40px;height:40px;border-radius:50%;border:1px solid rgba(243,234,217,.24);background:rgba(20,12,10,.72);color:#f3ead9;font-size:18px;cursor:pointer;backdrop-filter:blur(8px)}
.v2-fav.is-fav{background:#f3ead9;color:#140c0a}
.v2-distance{display:inline-block;margin-left:5px;opacity:.62}
.pandal-card.v2-hidden{display:none!important}
@media(max-width:600px){.explorer-v2-tools{position:sticky;top:138px;z-index:31;background:rgba(247,244,238,.96);backdrop-filter:blur(12px);overflow:auto;flex-wrap:nowrap}.explorer-v2-tools>*{flex:0 0 auto}.explorer-v2-tools .v2-spacer{display:none}.explorer-v2-tools select{max-width:180px}}
`;
document.head.appendChild(s)}
function tools(){if(document.querySelector('.explorer-v2-tools'))return;const host=document.querySelector('.explorer-toolbar');if(!host)return;const box=document.createElement('div');box.className='explorer-v2-tools';box.innerHTML=`<select id="v2-sort" aria-label="Sort pandals"><option value="recommended">Sort: Recommended</option><option value="distance">Sort: Nearest first</option><option value="rating">Sort: Highest rated</option><option value="name">Sort: A–Z</option><option value="area">Sort: Neighbourhood</option></select><button id="v2-verified" type="button">Exact pins</button><button id="v2-nearby" type="button">Near me</button><button id="v2-favs" type="button">Saved</button><button id="v2-location" type="button">Use my location</button><span class="v2-spacer"></span>`;host.after(box);box.querySelector('#v2-sort').addEventListener('change',e=>{sortMode=e.target.value;apply()});box.querySelector('#v2-verified').addEventListener('click',e=>{verifiedOnly=!verifiedOnly;e.currentTarget.classList.toggle('active',verifiedOnly);apply()});box.querySelector('#v2-nearby').addEventListener('click',e=>{if(!userPos){locate(()=>{nearbyOnly=true;e.currentTarget.classList.add('active');apply()});return}nearbyOnly=!nearbyOnly;e.currentTarget.classList.toggle('active',nearbyOnly);apply()});box.querySelector('#v2-favs').addEventListener('click',e=>{const on=e.currentTarget.classList.toggle('active');e.currentTarget.textContent=on?'Saved only':'Saved';box.dataset.favs=on?'1':'0';apply()});box.querySelector('#v2-location').addEventListener('click',()=>locate());}
function locate(done){if(!navigator.geolocation){status('Location is not available in this browser.');return}status('Requesting your location…');navigator.geolocation.getCurrentPosition(pos=>{userPos={lat:pos.coords.latitude,lng:pos.coords.longitude};status('Location ready · distances are approximate straight-line distances.');apply();done?.()},()=>status('Location permission was not granted. You can still use the explorer normally.'),{enableHighAccuracy:false,timeout:8000,maximumAge:300000})}
function status(text){let el=document.querySelector('.explorer-v2-status');if(!el){el=document.createElement('p');el.className='explorer-v2-status';document.querySelector('.explorer-v2-tools')?.after(el)}el.textContent=text}
function decorateCard(card){const name=card.dataset.name;if(!name)return;let fav=card.querySelector('.v2-fav');if(!fav){fav=document.createElement('button');fav.className='v2-fav';fav.type='button';fav.title='Save this pandal';fav.setAttribute('aria-label',`Save ${name}`);card.prepend(fav);fav.addEventListener('click',e=>{e.stopPropagation();if(favourites.has(name))favourites.delete(name);else favourites.add(name);save();paintFavourite(fav,name);apply()})}paintFavourite(fav,name);const p=getP(name);let meta=card.querySelector('.pandal-meta');if(meta&&p?.lat&&userPos&&!meta.querySelector('.v2-distance')){const d=document.createElement('span');d.className='v2-distance';d.textContent=`· ${hav(userPos,p).toFixed(1)} km`;meta.appendChild(d)}}
function paintFavourite(btn,name){const on=favourites.has(name);btn.classList.toggle('is-fav',on);btn.textContent=on?'★':'☆';btn.setAttribute('aria-label',on?`Remove ${name} from saved pandals`:`Save ${name}`);btn.title=on?'Remove from saved':'Save this pandal'}
function apply(){const cards=[...list.querySelectorAll('.pandal-card')];const favOnly=document.querySelector('#v2-favs')?.classList.contains('active');cards.forEach(decorateCard);const visible=cards.filter(c=>{const p=getP(c.dataset.name);const pin=!!p?.lat;const dist=userPos&&pin?hav(userPos,p):Infinity;const okPin=!verifiedOnly||pin;const okNear=!nearbyOnly||(!Number.isFinite(dist)||dist<=5);const okFav=!favOnly||favourites.has(c.dataset.name);c.classList.toggle('v2-hidden',!(okPin&&okNear&&okFav));return okPin&&okNear&&okFav});visible.sort((a,b)=>{const pa=getP(a.dataset.name)||{},pb=getP(b.dataset.name)||{};if(sortMode==='name')return a.dataset.name.localeCompare(b.dataset.name);if(sortMode==='area')return String(pa.area||'').localeCompare(String(pb.area||''));if(sortMode==='rating')return (Number(pb.rating)||0)-(Number(pa.rating)||0);if(sortMode==='distance'){const da=userPos&&pa.lat?hav(userPos,pa):Infinity,db=userPos&&pb.lat?hav(userPos,pb):Infinity;return da-db}return 0});visible.forEach(c=>list.appendChild(c));const hidden=cards.length-visible.length;status(`${visible.length} shown · ${hidden} filtered${favourites.size?` · ${favourites.size} saved`:''}`);}
const observer=new MutationObserver(()=>requestAnimationFrame(apply));
function boot(){addStyles();tools();observer.observe(list,{childList:true});apply();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,1800),{once:true});else setTimeout(boot,1800);
})();
