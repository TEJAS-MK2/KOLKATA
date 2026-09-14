(() => {
  'use strict';
  const catalog = [
    ['Noapara Udayan Sangha','North','Noapara'],['Sinthee Sarbojanin','North','Sinthee'],['Tala Park','North','Tala'],['Tala Prattoy','North','Tala'],['Dakshinpara','North','Dakshinpara'],['Arjunpur Amra Sabai Club','North','Arjunpur'],['Dumdum Park Bharat Chakra','North','Dum Dum Park'],['Dumdum Park Sarbojanin','North','Dum Dum Park'],['Dumdum Park Tarun Dal','North','Dum Dum Park'],['Sree Bhumi Sporting Club','North','Sreebhumi'],['Golaghata Sammilani','North','Golaghata'],['Dakshindari Youth','North','Dakshindari'],['Telengabagan','North','Ultadanga'],['Bagbazar Sarbojanin','North','Bagbazar'],['Sikdar Bagan','North','Sikdar Bagan'],['Hatibagan Nabinpally','North','Hatibagan'],['Nalin Sarkar Street','North','Hatibagan'],['Hatibagan Sarbojanin','North','Hatibagan'],['Kashi Bose Lane','North','Hatibagan'],['Lalabagan Nabankur','North','Lalabagan'],['Shobhabazar Rajbari','North','Shobhabazar'],['Jagat Mukherjee Park','North','Shobhabazar'],['Kumartuli Sarbojanin','North','Kumartuli'],['Kumartuli Park','North','Kumartuli'],['Beniatola Sarbojanin','North','Beniatola'],['Ahiritola Sarbojanin','North','Ahiritola'],['Jorasanko Sadharan','North','Jorasanko'],['Chorebagan Sarbojanin','North','Chorebagan'],['Simla Byayam Samity','North','Simla'],['Chaltabagan Lohapatty','North','Manicktala'],['Simla Sporting Club','North','Simla'],['Falguni Sangha','South','Suren Tagore Road'],['Park Circus Beniapukur','Central','Park Circus'],['74 Pally','South','Kalighat'],['29 Palli','South','Behala'],['Bosepukur Talbagan','South','Kasba'],['Muhammad Ali Park','Central','Central Kolkata'],['College Square','Central','College Street'],['Santosh Mitra Square','Central','Sealdah'],['Sealdah Athletic Club','Central','Sealdah'],['Subodh Mallick Square','Central','Central Kolkata'],['Kapalitola Sarbajanin','Central','Central Kolkata'],['Janbazar Rajbari','Central','Janbazar'],['Taltala Sarbojanin','Central','Taltala'],['Chakraberia Sarbojanin','Central','Bhowanipore'],['68 Pally','Central','Bhowanipore'],['76 Pally','Central','Bhowanipore'],['Bhowanipur 75 Pally','Central','Bhowanipore'],['22 Pally (Northern Park)','Central','Bhowanipore'],['Paddapukur Youth','Central','Bhowanipore'],['Harish Park','Central','Bhowanipore'],['Agradut Udaya Sangha','Central','Central Kolkata'],['Swadhin Sangha','Central','Central Kolkata'],['23 Pally','South','Ballygunge'],['Forward Club','South','Ballygunge'],['Matri Mandir','South','Ballygunge'],['Bakul Bagan','South','Ballygunge'],['Maddox Square','South','Ballygunge'],['Suruchi Sangha','South','New Alipore'],['Chetla Agrani','South','Chetla'],['66 Pally','South','Ballygunge'],['Badamtala Ashar Sangha','South','Kalighat'],['Deshapriya Park','South','Deshapriya Park'],['Tridhara Sammilani','South','Ballygunge'],['Ballygunge Cultural Association','South','Ballygunge'],['Hindusthan Park','South','Gariahat'],['Hindusthan Club','South','Gariahat'],['Singhi Park','South','Gariahat'],['Ekdalia Evergreen','South','Gariahat'],['Bosepukur Sitala Mandir','South','Bosepukur'],['Rajdanga Naba Uday Sangha','South','Rajdanga'],['Shib Mandir','South','Tollygunge'],['Mudiali','South','Tollygunge'],['Jodhpur Park 95 Pally','South','Jodhpur Park'],['Behala Nutan Dal','South','Behala'],['Behala Friends','South','Behala'],['Haridevpur 41 Pally','South','Haridevpur'],['Vivekananda Park','South','Tollygunge'],['Ajeya Sanghati','South','Behala'],['New Sporting Club','South','Behala'],['Barisha Club','South','Barisha'],['Barisha Sporting Club','South','Barisha'],['Naktala Pally Unnayan Samity','South','Naktala'],['Regent Park','South','Regent Park'],['Roynagar Unnayan Samity','South','Roynagar'],['Naktala Udayan Sangha','South','Naktala'],['Baishnabghata Balak Samity','South','Baishnabghata'],['Naba Durga','South','Garia'],['Garia Mitali','South','Garia'],['Tarun Sathi','South','Garia'],['Shyama Pally','South','Garia'],['Kamdahari Purbapara','South','Kamdahari'],['Patuli Sarbojanin','South','Patuli'],['Santoshpur Lake Pally','South','Santoshpur'],['Santoshpur Trikon Park','South','Santoshpur'],['Pally Mangal','South','Santoshpur'],['FD Block','Salt Lake','Salt Lake'],['AE Block','Salt Lake','Salt Lake'],['BJ Block','Salt Lake','Salt Lake']
  ].map(([name,zone,area]) => ({name,zone,area}));

  const imageMap = {
    'Falguni Sangha':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Falguni_Sangha_-_Suren_Tagore_Road_-_Kolkata_2013-10-11_3350.JPG',
    'Park Circus Beniapukur':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_Inside_-_Park_Circus_Beniapukur_-_Kolkata_2011-10-04_00715.jpg',
    '74 Pally':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_74_Pally_Part_-_Kolkata_2011-10-03_030270.JPG',
    '29 Palli':'https://commons.wikimedia.org/wiki/Special:FilePath/29_Palli%2C_Behala.JPG',
    'Bosepukur Talbagan':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Bosepukur_Talbagan_-_Kasba_-_Kolkata_2012-10-23_1178.JPG',
    'Chetla Agrani':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Chetla_Agrani_Club_-_Kolkata_2017-09-26_4199.JPG',
    'Ekdalia Evergreen':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Ekdalia_Evergreen_-_Ekdalia_Road_-_Kolkata_2013-10-11_3312.JPG',
    'Jodhpur Park 95 Pally':'https://commons.wikimedia.org/wiki/Special:FilePath/Jodhpur_Park.jpg',
    'Tridhara Sammilani':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Tridhara_Sammilani_-_Manohar_Pukur_Road_-_Kolkata_2017-09-26_3988.JPG',
    'Singhi Park':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_Singhi_Park_-_Dover_Lane_-_Kolkata_2013-10-11_3410.JPG',
    'Bosepukur Sitala Mandir':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Bosepukur_Sitala_Mandir_-_Kasba_-_Kolkata_2012-10-23_1154.JPG',
    'Barisha Sporting Club':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Barisha_Sporting_Club_-_Kolkata_2012-10-23_1147.JPG',
    '66 Pally':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_66_Pally_-_Nepal_Bhattacharya_Street_-_Kolkata_2015-10-21_6346.JPG',
    'Ballygunge Cultural Association':'https://commons.wikimedia.org/wiki/Special:FilePath/DurgaPuja2017_-_Pandal_of_Ballygunge_Cultural_Association_02.jpg',
    'Hindusthan Park':'https://commons.wikimedia.org/wiki/Special:FilePath/DurgaPuja2017_-_Pandal_of_Hindustan_Park_01.jpg',
    'Ekdalia Evergreen':'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Ekdalia_Evergreen_-_Ekdalia_Road_-_Kolkata_2017-09-26_4105.JPG'
  };
  catalog.forEach(p=>{if(imageMap[p.name])p.photo=imageMap[p.name];});
  const mapped = new Map((window.pandals || []).map(p => [p.name, p]));
  const items = catalog.map(p => ({...p, ...(mapped.get(p.name) || {})}));
  window.pandals = items;

  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mapsSearch = p => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.area}, Kolkata, West Bengal`)}`;
  function replaceWithCleanControl(node){if(!node||!node.parentNode)return node;const clone=node.cloneNode(true);node.parentNode.replaceChild(clone,node);return clone;}
  function render(){
    const list=document.querySelector('#pandal-list'); if(!list)return;
    const search=document.querySelector('#pandal-search'); const query=(search?.value||'').trim().toLowerCase();
    const active=document.querySelector('#pandal-filters .filter-btn.active')?.dataset.zone||'all';
    const visible=items.filter(p=>(active==='all'||p.zone===active)&&(!query||`${p.name} ${p.area} ${p.zone}`.toLowerCase().includes(query)));
    let count=document.querySelector('#pandal-result-count'); if(!count){count=document.createElement('p');count.id='pandal-result-count';count.className='catalog-count';list.parentNode.insertBefore(count,list);}
    count.textContent=`${visible.length} pandals in the discovery catalog · ${visible.filter(p=>p.lat&&p.lng).length} verified map pins`;
    list.innerHTML=visible.length?visible.map(p=>{const pin=Boolean(p.lat&&p.lng);const image=p.photo?`<img src="${escapeHtml(p.photo)}" alt="Archive photo associated with ${escapeHtml(p.name)}" loading="lazy" onerror="this.remove()">`:'';return `<article class="pandal-card catalog-card" data-name="${escapeHtml(p.name)}" tabindex="0" aria-label="Explore ${escapeHtml(p.name)}">${image}<div class="pandal-card-body"><div class="pandal-meta">${escapeHtml(p.zone)} · ${escapeHtml(p.area)}</div><h3>${escapeHtml(p.name)}</h3><div class="rating">${pin?'● Map pin verified':'○ Discovery listing'}</div><div class="pandal-actions"><button class="catalog-map" type="button" ${pin?'':'disabled'}>${pin?'View map':'Map pin pending'}</button>${pin?`<button class="catalog-route" type="button">Add to route +</button>`:''}<a class="route" href="${mapsSearch(p)}" target="_blank" rel="noopener">Directions ↗</a></div></div></article>`;}).join(''):`<div class="empty-state"><strong>No pandals found.</strong><p>Try another neighbourhood or clear the search.</p></div>`;
    list.querySelectorAll('.catalog-map').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const card = btn.closest('.pandal-card');
        const p = items.find(x => x.name === card?.dataset.name);
        const original = p && window.pandals?.find(x => x.name === p.name);
        if (original && original.lat && original.lng && typeof window.selectPandal === 'function') {
          window.selectPandal(original);
        }
      });
    });
    list.querySelectorAll('.catalog-route').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const card = btn.closest('.pandal-card');
        const p = items.find(x => x.name === card?.dataset.name);
        const original = p && window.pandals?.find(x => x.name === p.name);
        if (original && typeof window.addToRoute === 'function') {
          window.addToRoute(original);
          render();
        }
      });
    });
  }
  function bind(){const search=replaceWithCleanControl(document.querySelector('#pandal-search'));search?.addEventListener('input',render);document.querySelectorAll('#pandal-filters .filter-btn').forEach(btn=>{const clean=replaceWithCleanControl(btn);clean.addEventListener('click',()=>{document.querySelectorAll('#pandal-filters .filter-btn').forEach(b=>b.classList.toggle('active',b===clean));render();});});render();}
  function addCatalogNote(){const host=document.querySelector('#pandal-list')?.parentElement;if(!host||document.querySelector('#catalog-verification-note'))return;const note=document.createElement('div');note.id='catalog-verification-note';note.className='catalog-note';note.innerHTML='<strong>Verification-first map</strong><span>The discovery catalog is expanded with archival images from Wikimedia Commons. A marker is shown only when the exact pin is already verified; we do not invent coordinates. Directions for every listing open a place search.</span>';host.insertBefore(note,document.querySelector('#pandal-list'));}
  function addLatest2026Note(){const section=document.querySelector('#puja-2026-info');if(!section||document.querySelector('#latest-2026-note'))return;const box=document.createElement('div');box.id='latest-2026-note';box.className='latest-2026-note';box.innerHTML='<strong>Latest 2026 update</strong><p>West Bengal has announced a ₹1 lakh grant for small/low-budget committees, free electricity and fire-licence fee waiver, with DJ use prohibited during Puja and immersion. A grand Mahalaya programme at Eden Gardens has also been reported for 10 October; its programme details remain subject to changes.</p><small>Government of West Bengal · Indian Express, September 2026</small>';section.appendChild(box);}
  function animationFallback(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;setTimeout(()=>{document.querySelectorAll('.hero-content > *, .hero-mark, .scroll-note, .section-label, .intro-grid > *, .stats > div, .timeline-head > *, .days > article, .culture-card, .guide-head > *, .explorer-toolbar, .pandal-card, .map-panel, .route-planner, .puja-2026-info, .gallery-head > *, .gallery-grid .tile, footer span').forEach(el=>{const cs=getComputedStyle(el);if(cs.opacity==='0'){el.style.opacity='1';el.style.transform='none';}});},3500);}
  const style=document.createElement('style');style.textContent=`.catalog-count{margin:0 0 12px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.58}.catalog-note{display:grid;gap:5px;margin:0 0 14px;padding:12px 14px;border:1px solid rgba(243,234,217,.14);border-radius:14px;background:rgba(243,234,217,.035);font-size:11px}.catalog-note strong{font-size:12px}.catalog-note span{opacity:.62;line-height:1.5}.catalog-card .pandal-card-body{min-height:145px}.catalog-card:not(:has(img)){min-height:220px}.catalog-card img{display:block;width:100%;height:180px;object-fit:cover;border-radius:16px 16px 0 0;background:#eee}.catalog-map:disabled{opacity:.45;cursor:not-allowed}.latest-2026-note{margin-top:18px;padding:16px;border:1px solid rgba(216,173,98,.35);border-radius:14px;background:rgba(216,173,98,.07)}.latest-2026-note strong{display:block;font-size:12px;letter-spacing:.1em;text-transform:uppercase}.latest-2026-note p{margin:8px 0;font-size:13px;line-height:1.6}.latest-2026-note small{opacity:.55}`;document.head.appendChild(style);
  const boot=()=>{addCatalogNote();addLatest2026Note();setTimeout(bind,1200);animationFallback();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
