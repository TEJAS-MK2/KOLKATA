(()=>{
  'use strict';
  const MORE={
    'Nalin Sarkar Street':{zone:'North',area:'Hatibagan',lat:22.59500,lng:88.37390,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Nalin_Sarkar_Street_Durga_Puja_2023_01.jpg'},
    'Ahiritola Sarbojanin':{zone:'North',area:'Ahiritola',lat:22.59484,lng:88.35717,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Ahiritola_Sarbojanin_Durgotsab_2023_16.jpg'},
    'Kumartuli Sarbojanin':{zone:'North',area:'Kumartuli',lat:22.60088,lng:88.36232,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Kumartuli_Sarbojanin_Durgatsab_2023_01.jpg'},
    'Hatibagan Nabinpally':{zone:'North',area:'Hatibagan',lat:22.59590,lng:88.37342,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Hatibagan_Nabinpally_Durga_Utsav_Committee_04.jpg'},
    '20 Palli Sarbojani Durgotsab':{zone:'North',area:'Ahiritola',lat:22.59363,lng:88.35813,tag:'Verified location',photo:''}
  };
  window.KOLKATA_MORE_PINS=Object.freeze(Object.fromEntries(Object.entries(MORE).map(([name,p])=>[name,[p.lat,p.lng]])));
  window.KOLKATA_PIN_METADATA=window.KOLKATA_PIN_METADATA||{};
  Object.assign(window.KOLKATA_PIN_METADATA,MORE);

  // Additional discovery listings sourced from 2025 Kolkata Puja directories/Commons.
  // These intentionally remain discovery-only: no coordinates are invented.
  const EXTRA=[
    ['Chaltabagan Sarbojanin','North','Chaltabagan','https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_2025_at_Chalta_Bagan_Sarbojanin_18.jpg'],
    ['Ahiritola Yubak Brinda','North','Ahiritola',''],
    ['Dum Dum Park Tarun Sangha','North','Dum Dum Park',''],
    ['Behala Club','South','Behala','https://commons.wikimedia.org/wiki/Special:FilePath/Behala_Club.jpg'],
    ['S B Park Sarbojanin','South','Thakurpukur',''],
    ['Beliaghata 33 Palli','Central','Beliaghata',''],
    ['New Town Sarbojanin','Salt Lake','New Town',''],
    ['Alipur Sarbojanin','South','Alipore',''],
    ['Bakul Bagan Sarbojanin','South','Bakul Bagan',''],
    ['Pratapaditya Road Tricon Park','South','Kalighat',''],
    ['Vivekananda Sporting Club','South','Haridevpur',''],
    ['Pally Unnayan Samity','South','Paschim Putiary','https://commons.wikimedia.org/wiki/Special:FilePath/41_Pally_Durga_puja_2025_17.jpg']
  ].map(([name,zone,area,photo])=>({name,zone,area,photo}));
  window.KOLKATA_EXTRA_PANDALS=Object.freeze(EXTRA);

  const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function injectExtras(){
    const list=document.querySelector('#pandal-list');
    if(!list)return;
    list.querySelectorAll('[data-extra-pandal="true"]').forEach(n=>n.remove());
    const query=(document.querySelector('#pandal-search')?.value||'').trim().toLowerCase();
    const zone=document.querySelector('#pandal-filters .filter-btn.active')?.dataset.zone||'all';
    const visible=EXTRA.filter(p=>(zone==='all'||p.zone===zone)&&(!query||`${p.name} ${p.area} ${p.zone}`.toLowerCase().includes(query)));
    if(!visible.length)return;
    const html=visible.map(p=>`<article class="pandal-card catalog-card" data-extra-pandal="true" data-name="${escapeHtml(p.name)}" tabindex="0" aria-label="Explore ${escapeHtml(p.name)}">${p.photo?`<img src="${escapeHtml(p.photo)}" alt="Archive photo associated with ${escapeHtml(p.name)}" loading="lazy" onerror="this.remove()">`:''}<div class="pandal-card-body"><div class="pandal-meta">${escapeHtml(p.zone)} · ${escapeHtml(p.area)}</div><h3>${escapeHtml(p.name)}</h3><div class="rating">○ Discovery listing</div><div class="pandal-actions"><button class="catalog-map" type="button" disabled>Map pin pending</button><a class="route" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.area}, Kolkata, West Bengal`)}" target="_blank" rel="noopener">Directions ↗</a></div></div></article>`).join('');
    list.insertAdjacentHTML('beforeend',html);
    const count=document.querySelector('#pandal-result-count');
    if(count&&!count.textContent.includes('new listings'))count.textContent+=` · ${EXTRA.length} new discovery listings`;
  }
  function boot(){
    // catalog-upgrade renders after its own 1.2s bind; inject after it and re-apply on search/filter changes.
    setTimeout(()=>{
      injectExtras();
      document.querySelector('#pandal-search')?.addEventListener('input',()=>setTimeout(injectExtras,20));
      document.querySelectorAll('#pandal-filters .filter-btn').forEach(b=>b.addEventListener('click',()=>setTimeout(injectExtras,20)));
    },1500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
