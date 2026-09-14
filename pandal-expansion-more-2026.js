(()=>{
  'use strict';
  const MORE={
    'Nalin Sarkar Street':{zone:'North',area:'Hatibagan',lat:22.59500,lng:88.37390,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Nalin_Sarkar_Street_Durga_Puja_2023_01.jpg'},
    'Ahiritola Sarbojanin':{zone:'North',area:'Ahiritola',lat:22.59484,lng:88.35717,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Ahiritola_Sarbojanin_Durgotsab_2023_16.jpg'},
    'Kumartuli Sarbojanin':{zone:'North',area:'Kumartuli',lat:22.60088,lng:88.36232,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Kumartuli_Sarbojanin_Durgatsab_2023_01.jpg'},
    'Hatibagan Nabinpally':{zone:'North',area:'Hatibagan',lat:22.59590,lng:88.37342,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Hatibagan_Nabinpally_Durga_Utsav_Committee_04.jpg'},
    '20 Palli Sarbojani Durgotsab':{zone:'North',area:'Ahiritola',lat:22.59363,lng:88.35813,tag:'Verified location',photo:''},
    'Alipur Sarbojanin':{zone:'South',area:'Alipore',lat:22.51963,lng:88.33366,tag:'Verified location',photo:''},
    'Dhakuria Sarbojanin':{zone:'South',area:'Dhakuria',lat:22.51003,lng:88.37199,tag:'Verified location',photo:''},
    'Barisha Sarbojanin':{zone:'South',area:'Barisha',lat:22.47999,lng:88.30808,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Barisha_Sarbojanin_2025_Durga_utsav_01.jpg'},
    'Shibmandir Sarbojanin':{zone:'South',area:'Southern Avenue',lat:22.51100,lng:88.34985,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Shibmandir_Sarbojanin_Durgotsav_2025_01.jpg'},
    'Lake Youth Corner':{zone:'South',area:'Lake Gardens',lat:22.51495,lng:88.35470,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/LakeYouth_Corner_Durga_puja_2025_01.jpg'},
    'Lake Kalibari':{zone:'South',area:'Lake Gardens',lat:22.51367,lng:88.35503,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_2025_at_Lake_Kalibari_01.jpg'},
    'Samajsebi Sangha':{zone:'South',area:'Lake Road',lat:22.51474,lng:88.35600,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Samaj_Sebi_Sangha_Durga_Puja_in_South_Kolkata_(Lake_View_Road)_02.jpg'},
    'Singhi Park':{zone:'South',area:'Gariahat',lat:22.52122,lng:88.36301,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Singhi_Park_-_Dover_Lane_-_Kolkata_2014-10-02_8943.JPG'},
    'Tarun Matri Sevak Samity':{zone:'South',area:'Behala',lat:22.5022,lng:88.3215,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Behala_Tarun_Matri_Sevak_Samity_Durga_puja_2025_01.jpg'},
    'Kidderpore 25 Pally':{zone:'South',area:'Kidderpore',lat:22.53848,lng:88.32660,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_25_Pally_-_Kolkata_2011-10-03_030258.JPG'},
    'Kidderpore 74 Pally':{zone:'South',area:'Kidderpore',lat:22.53978,lng:88.32512,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_74_Pally_-_Kolkata_2011-10-03_030266.JPG'},
    'Kidderpore 75 Pally':{zone:'South',area:'Kidderpore',lat:22.54030,lng:88.32528,tag:'Verified location',photo:''}
  };
  window.KOLKATA_MORE_PINS=Object.freeze(Object.fromEntries(Object.entries(MORE).map(([name,p])=>[name,[p.lat,p.lng]])));
  window.KOLKATA_PIN_METADATA=window.KOLKATA_PIN_METADATA||{};
  Object.assign(window.KOLKATA_PIN_METADATA,MORE);
  window.pandals=window.pandals||[];
  Object.entries(MORE).forEach(([name,p])=>{const existing=window.pandals.find(x=>x.name===name);if(existing)Object.assign(existing,p);else window.pandals.push({name,...p});});

  const EXTRA=[
    ['Aatchala Bari, Barisha','South','Barisha','https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_2025_at_Aatchala_Bari%2C_Barisha_01.jpg'],
    ['Chaltabagan Sarbojanin','North','Chaltabagan','https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_2025_at_Chalta_Bagan_Sarbojanin_18.jpg'],
    ['Dum Dum Park Tarun Sangha','North','Dum Dum Park','https://commons.wikimedia.org/wiki/Special:FilePath/Dum_Dum_Park_Tarun_Sangha_2023.jpg'],
    ['Behala Club','South','Behala','https://commons.wikimedia.org/wiki/Special:FilePath/Behala_Club.jpg'],
    ['Bakul Bagan Sarbojanin','South','Bakul Bagan',''],
    ['Pratapaditya Road Tricon Park','South','Kalighat',''],
    ['Vivekananda Sporting Club','South','Haridevpur',''],
    ['41 Pally Club','South','Haridevpur','https://commons.wikimedia.org/wiki/Special:FilePath/41_Pally_Durga_puja_2025_11.jpg'],
    ['Roy Bari, Behala','South','Behala','https://commons.wikimedia.org/wiki/Special:FilePath/The_2025_Durga_Puja_at_Amarendra_Bhawan_%28Behala_Roy_Bari%29_05.jpg'],
    ['Bosepukur Talbagan','South','Bosepukur, Kasba','https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Bosepukur_Talbagan_-_Kasba_-_Kolkata_2012-10-23_1190.JPG'],
    ['Chorebagan Sarbojanin','North','Simla/Girish Park',''],
    ['22 Palli Sarodotsab','South','Bakul Bagan, Bhowanipore','']
  ].map(([name,zone,area,photo])=>({name,zone,area,photo}));
  window.KOLKATA_EXTRA_PANDALS=Object.freeze(EXTRA);
  const escapeHtml=s=>String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  function injectExtras(){
    const list=document.querySelector('#pandal-list');if(!list)return;
    list.querySelectorAll('[data-extra-pandal="true"]').forEach(n=>n.remove());
    const query=(document.querySelector('#pandal-search')?.value||'').trim().toLowerCase();
    const zone=document.querySelector('#pandal-filters .filter-btn.active')?.dataset.zone||'all';
    const visible=EXTRA.filter(p=>(zone==='all'||p.zone===zone)&&(!query||`${p.name} ${p.area} ${p.zone}`.toLowerCase().includes(query)));
    if(!visible.length)return;
    list.insertAdjacentHTML('beforeend',visible.map(p=>`<article class="pandal-card catalog-card" data-extra-pandal="true" data-name="${escapeHtml(p.name)}" tabindex="0" aria-label="Explore ${escapeHtml(p.name)}">${p.photo?`<img src="${escapeHtml(p.photo)}" alt="Archive photo associated with ${escapeHtml(p.name)}" loading="lazy" onerror="this.remove()">`:''}<div class="pandal-card-body"><div class="pandal-meta">${escapeHtml(p.zone)} · ${escapeHtml(p.area)}</div><h3>${escapeHtml(p.name)}</h3><div class="rating">○ Discovery listing</div><div class="pandal-actions"><button class="catalog-map" type="button" disabled>Map pin pending</button><a class="route" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.area}, Kolkata, West Bengal`)}" target="_blank" rel="noopener">Directions ↗</a></div></div></article>`).join(''));
    const count=document.querySelector('#pandal-result-count');if(count&&!count.textContent.includes('new listings'))count.textContent+=` · ${EXTRA.length} new discovery listings`;
  }
  function boot(){setTimeout(()=>{injectExtras();document.querySelector('#pandal-search')?.addEventListener('input',()=>setTimeout(injectExtras,20));document.querySelectorAll('#pandal-filters .filter-btn').forEach(b=>b.addEventListener('click',()=>setTimeout(injectExtras,20)));},1500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
