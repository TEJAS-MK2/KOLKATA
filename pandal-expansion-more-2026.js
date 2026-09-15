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
    'Bakul Bagan':{zone:'South',area:'Bhowanipore',lat:22.52676,lng:88.34826,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Bakul_Bagan_Sarbojanin_Arnab_Dutta_2011.jpg'},
    'Dumdum Park Tarun Dal':{zone:'North',area:'Dum Dum Park',lat:22.61173,lng:88.41874,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Dum_Dum_Park_Tarun_Dal_2023.jpg'},
    'Chorebagan Sarbojanin':{zone:'North',area:'Chorebagan',lat:22.583485,lng:88.363380,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_2024_at_Chorbagan_Sarbojanin_05.jpg'},
    'Muhammad Ali Park':{zone:'Central',area:'Central Kolkata',lat:22.57710,lng:88.36030,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/5465g_muhammad-ali-park_pratima-foeticide.jpg'},
    'Tala Park':{zone:'North',area:'Tala',lat:22.61150,lng:88.38411,tag:'Verified location',photo:''},
    '23 Pally':{zone:'Central',area:'Bhowanipore',lat:22.52540,lng:88.34400,tag:'Verified location',photo:''}
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
    ['Bakul Bagan Sarbojanin','South','Bakul Bagan','https://commons.wikimedia.org/wiki/Special:FilePath/Bakul_Bagan_Sarbojanin_Arnab_Dutta_2011.jpg'],
    ['Pratapaditya Road Tricon Park','South','Kalighat',''],
    ['Vivekananda Sporting Club','South','Haridevpur',''],
    ['41 Pally Club','South','Haridevpur','https://commons.wikimedia.org/wiki/Special:FilePath/41_Pally_Durga_puja_2025_11.jpg'],
    ['Roy Bari, Behala','South','Behala','https://commons.wikimedia.org/wiki/Special:FilePath/The_2025_Durga_Puja_at_Amarendra_Bhawan_%28Behala_Roy_Bari%29_05.jpg']
  ].map(([name,zone,area,photo])=>({name,zone,area,photo}));
  window.KOLKATA_EXTRA_PANDALS=Object.freeze(EXTRA);
  const escapeHtml=s=>String(s).replace(/[&<>\\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\\"':'&quot;',"'":'&#39;'}[c]));
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

  /* Current city pulse: these are deliberately appended to the existing pulse so no prior feature or story is removed. */
  const CURRENT_NEWS=[
    {kicker:'TRAFFIC · TODAY',title:'Morning traffic is reported normal; a College Square–Shobhabazar procession is planned later',copy:'Today’s traffic bulletin says movement was normal in the morning. A 100–150 person procession is expected from College Square to Shobhabazar Metro from about 4:30pm, with no major disruption currently expected.',meta:'Sep 15, 2026 · re-check before travel',href:'https://eisamay.com/samay-shorts/%E0%A6%AE%E0%A6%99%E0%A7%8D%E0%A6%97%E0%A6%B2%E0%A6%AC%E0%A6%BE%E0%A6%B0-%E0%A6%95%E0%A6%B2%E0%A6%95%E0%A6%BE%E0%A6%A4%E0%A6%BE%E0%A6%B0-%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%AB%E0%A6%BF%E0%A6%95-%E0%A6%86%E0%A6%AA%E0%A6%A1%E0%A5%87%E0%A6%9F/200542818.cms',source:'Ei Samay'},
    {kicker:'ROAD PLANNING · 14 SEP',title:'Camac Street planning is being prepared around Allen Park Puja',copy:'Traffic Police are preparing diversions around Camac Street as Allen Park is expected to become a major Puja attraction. Treat central-Kolkata driving plans as provisional.',meta:'Planning signal · Sep 14, 2026',href:'https://timesofindia.indiatimes.com/city/kolkata/puja-closure-for-camac-st-allen-park-stretch/amp_articleshow/134246574.cms',source:'Times of India'},
    {kicker:'WEATHER · TODAY',title:'Partly cloudy with light to moderate rain possible',copy:'The latest Kolkata outlook points to partly cloudy conditions and possible light to moderate rain over the next 24 hours, with heavy rain not currently expected.',meta:'Sep 15, 2026 · next 24 hours',href:'https://bengali.indianexpress.com/west-bengal/west-bengal-weather-forecast-next-24-hours-12533297',source:'The Indian Express'}
  ];
  function injectCurrentNews(){
    const pulse=document.querySelector('#puja-pulse .pulse-grid');if(!pulse||pulse.dataset.currentNews==='1')return;
    pulse.dataset.currentNews='1';
    CURRENT_NEWS.forEach(n=>{const card=document.createElement('article');card.className='pulse-card current-news';card.innerHTML=`<div class="pulse-kicker">${escapeHtml(n.kicker)}</div><h4>${escapeHtml(n.title)}</h4><p>${escapeHtml(n.copy)}</p><div class="pulse-meta">${escapeHtml(n.meta)}</div><a class="pulse-link" href="${n.href}" target="_blank" rel="noopener noreferrer">Read source · ${escapeHtml(n.source)} ↗</a>`;pulse.appendChild(card)});
  }
  function boot(){setTimeout(()=>{injectExtras();injectCurrentNews();document.querySelector('#pandal-search')?.addEventListener('input',()=>setTimeout(injectExtras,20));document.querySelectorAll('#pandal-filters .filter-btn').forEach(b=>b.addEventListener('click',()=>setTimeout(injectExtras,20)));},8000);setTimeout(injectCurrentNews,11000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
