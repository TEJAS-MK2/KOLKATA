const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.style.background = y > 40 ? 'rgba(18,10,8,.82)' : 'transparent';
  header.style.backdropFilter = y > 40 ? 'blur(14px)' : 'none';
  header.style.transition = 'background .25s ease, backdrop-filter .25s ease';

  const hero = document.querySelector('.hero-image');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.style.transform = `translateY(${Math.min(y * 0.16, 90)}px) scale(1.04)`;
  }
}, { passive: true });

const nav = document.querySelector('nav');
const menu = document.querySelector('.menu');
menu?.addEventListener('click', () => {
  const open = nav.dataset.open === 'true';
  nav.dataset.open = String(!open);
  menu.setAttribute('aria-expanded', String(!open));
  nav.style.display = open ? '' : 'flex';
  if (!open) {
    nav.style.position = 'absolute'; nav.style.top = '72px'; nav.style.right = '6vw';
    nav.style.flexDirection = 'column'; nav.style.padding = '18px 22px';
    nav.style.background = 'rgba(18,10,8,.96)'; nav.style.border = '1px solid rgba(243,234,217,.15)';
  }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.innerWidth <= 800 && nav.dataset.open === 'true') menu?.click();
  });
});

// Curated 2026 guide data. Ratings are directory visitor ratings, not official
// committee scores. Archive photos are explicitly dated so they cannot be
// mistaken for 2026 photographs.
const pandals = [
  {
    name:'Bagbazar Sarbojanin', zone:'North', area:'Bagbazar', lat:22.60121, lng:88.36682,
    tag:'Heritage · traditional', rating:4.8, ratingSource:'Durga Puja Kolkata directory',
    photo:'https://upload.wikimedia.org/wikipedia/commons/e/e7/%E0%A6%AC%E0%A6%BE%E0%A6%97%E0%A6%AC%E0%A6%9C%E0%A6%BE%E0%A6%B0_%E0%A6%B8%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%9C%E0%A6%A8%E0%A7%80%E0%A6%A8_%E0%A6%A6%E0%A7%81%E0%A6%B0%E0%A7%8D%E0%A6%97%E0%A7%8B%E0%A7%8E%E0%A6%B8%E0%A6%AC_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AE.jpg',
    photoLabel:'Archive photo · 2018', photoSource:'https://commons.wikimedia.org/wiki/File:%E0%A6%AC%E0%A6%BE%E0%A6%97%E0%A6%AC%E0%A6%9C%E0%A6%BE%E0%A6%B0_%E0%A6%B8%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%9C%E0%A6%A8%E0%A7%80%E0%A6%A8_%E0%A6%A6%E0%A7%81%E0%A6%B0%E0%A7%8D%E0%A6%97%E0%A7%8B%E0%A7%8E%E0%A6%B8%E0%A6%AC_%E0%A7%A8%E0%A7%A6%E0%A7%A7%E0%A7%AE.jpg',
    source:'https://www.durgapujakolkata.in/paras/bagbazar-sarbojanin-durgotsav-exhibition'
  },
  {
    name:'Kumartuli Park', zone:'North', area:'Kumartuli', lat:22.5967, lng:88.3629,
    tag:'Artisan quarter',
    photo:'https://www.durgapujopandals.com/pandals/?region=North+Kolkata', photoLabel:'Pandal directory photo', photoSource:'https://www.durgapujopandals.com/pandals/?region=North+Kolkata',
    source:'https://www.durgapujopandals.com/pandals/?region=North+Kolkata'
  },
  {
    name:'Shobhabazar Rajbari', zone:'North', area:'Shobhabazar', lat:22.5974, lng:88.3672,
    tag:'Historic puja',
    source:'https://www.durgapujakolkata.in/paras'
  },
  {
    name:'College Square', zone:'Central', area:'College Street', lat:22.57453, lng:88.36447,
    tag:'Lighting · waterfront', rating:4.9, ratingSource:'Durga Puja Kolkata directory',
    photo:'https://commons.wikimedia.org/wiki/Special:FilePath/College_square_puja.jpg', photoLabel:'Archive photo · 2019', photoSource:'https://commons.wikimedia.org/wiki/File:College_square_puja.jpg',
    source:'https://www.durgapujakolkata.in/paras/college-square-sarbojanin-durgotsab-committee'
  },
  {
    name:'Santosh Mitra Square', zone:'Central', area:'Lebutala / Sealdah', lat:22.5686, lng:88.3648,
    tag:'Theme-driven',
    photo:'https://files.prokerala.com/news/photos/imgs/1024/durga-idol-at-santosh-mitra-square-durga-puja-910549.jpg', photoLabel:'Archive photo · 2019', photoSource:'https://www.prokerala.com/news/photos/santosh-mitra-square-durga-puja-1378507.html',
    source:'https://www.durgapujakolkata.in/paras/santosh-mitra-square-lebutala'
  },
  {
    name:'Maddox Square', zone:'South', area:'Ballygunge', lat:22.52656, lng:88.35465,
    tag:'Classic adda',
    photo:'https://www.flickr.com/photos/23985194%40N06/9723469757/', photoLabel:'Archive photo · 2012', photoSource:'https://www.flickr.com/photos/23985194%40N06/9723469757/',
    source:'https://www.agamoni.in/pandals/pandal-maddox-square-durga-pujo'
  },
  {
    name:'Deshapriya Park', zone:'South', area:'Kalighat', lat:22.51858, lng:88.35346,
    tag:'Large-scale theme art',
    photo:'https://upload.wikimedia.org/wikipedia/commons/f/fe/Durga_Puja_Pandal_-_Ballygunge_Sarbojanin_Durgotsab_-_Deshapriya_Park_-_Kolkata_2017-09-27_4501.JPG', photoLabel:'Archive photo · 2017', photoSource:'https://commons.wikimedia.org/wiki/File:Durga_Puja_Pandal_-_Ballygunge_Sarbojanin_Durgotsab_-_Deshapriya_Park_-_Kolkata_2017-09-27_4501.JPG',
    source:'https://www.agamoni.in/pandals/pandal-deshapriya-park'
  },
  {
    name:'Naktala Udayan Sangha', zone:'South', area:'Naktala', lat:22.4643, lng:88.3715,
    tag:'Theme-based · community', rating:4.5, ratingSource:'Durga Puja Kolkata directory',
    photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Idol_Naktala_Udayan_Sangha.jpg', photoLabel:'Archive photo · 2013', photoSource:'https://commons.wikimedia.org/wiki/File:Durga_Idol_Naktala_Udayan_Sangha.jpg',
    source:'https://www.durgapujakolkata.in/paras/naktala-udayan-sangha'
  }
];

let activeZone = 'all';
let map;
let markers = [];

function renderStars(value) {
  if (!value) return '<span class="stars" aria-label="Not rated">☆☆☆☆☆</span> Not rated';
  return `<span class="stars" aria-label="${value.toFixed(1)} out of 5">★★★★★</span> ${value.toFixed(1)}`;
}

function filteredPandals() {
  const query = (document.querySelector('#pandal-search')?.value || '').trim().toLowerCase();
  return pandals.filter(p => {
    const matchesZone = activeZone === 'all' || p.zone === activeZone;
    const matchesQuery = !query || `${p.name} ${p.area} ${p.zone} ${p.tag}`.toLowerCase().includes(query);
    return matchesZone && matchesQuery;
  });
}

function selectPandal(pandal) {
  if (!map || !pandal) return;
  map.flyTo([pandal.lat, pandal.lng], 15, { duration: 0.7 });
  const marker = markers.find(m => m.pandal === pandal)?.marker;
  marker?.openPopup();
  document.querySelectorAll('.pandal-card').forEach(card => card.classList.toggle('selected', card.dataset.name === pandal.name));
}

function renderPandalExplorer() {
  const list = document.querySelector('#pandal-list');
  if (!list) return;
  const items = filteredPandals();
  list.innerHTML = items.length ? items.map(p => `
    <article class="pandal-card" data-name="${p.name.replaceAll('"','&quot;')}" tabindex="0" aria-label="Explore ${p.name}">
      ${p.photo ? `<img src="${p.photo}" alt="${p.photoLabel || 'Archive photo'} of ${p.name}" loading="lazy" onerror="this.closest('.pandal-card').classList.add('no-photo');this.remove()">` : '<div class="pandal-photo-placeholder">PHOTO ARCHIVE<br><small>Not yet linked</small></div>'}
      <div class="pandal-card-body">
        <div class="pandal-meta">${p.zone} · ${p.area}</div>
        <h3>${p.name}</h3>
        <div class="rating">${renderStars(p.rating)}${p.ratingSource ? ` <small>· ${p.ratingSource}</small>` : ''}</div>
        <div class="pandal-meta" style="margin-top:8px">${p.tag}</div>
        <div class="pandal-actions">
          <button class="view-map" type="button">View map</button>
          ${p.source ? `<a href="${p.source}" target="_blank" rel="noopener">2026 details ↗</a>` : ''}
          ${p.photoSource ? `<a href="${p.photoSource}" target="_blank" rel="noopener">Photo ↗</a>` : ''}
          <a class="route" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noopener">Directions ↗</a>
        </div>
      </div>
    </article>`).join('') : '<div class="empty-state"><strong>No pandals found.</strong><p>Try another neighbourhood or clear the search.</p></div>';

  list.querySelectorAll('.pandal-card').forEach(card => {
    const p = pandals.find(item => item.name === card.dataset.name);
    card.addEventListener('click', e => { if (!e.target.closest('a')) selectPandal(p); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPandal(p); } });
  });
}

function initMap() {
  if (!window.L || !document.querySelector('#pandal-map')) return;
  map = L.map('pandal-map', { scrollWheelZoom: false }).setView([22.5726, 88.3639], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  markers = pandals.map(p => {
    const marker = L.marker([p.lat,p.lng]).addTo(map).bindPopup(`<strong>${p.name}</strong><br>${p.area} · ${p.zone}<br><a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noopener">Get directions ↗</a>`);
    return {pandal:p, marker};
  });
}

document.querySelector('#pandal-search')?.addEventListener('input', renderPandalExplorer);
document.querySelectorAll('#pandal-filters .filter-btn').forEach(btn => btn.addEventListener('click', () => {
  activeZone = btn.dataset.zone;
  document.querySelectorAll('#pandal-filters .filter-btn').forEach(b => b.classList.toggle('active', b === btn));
  renderPandalExplorer();
}));

function initLightbox() {
  const box = document.querySelector('#lightbox');
  const image = document.querySelector('#lightbox-image');
  const close = () => box?.classList.remove('open');
  document.querySelectorAll('.gallery-grid .tile').forEach(tile => tile.addEventListener('click', () => {
    const style = getComputedStyle(tile); const bg = style.backgroundImage;
    if (!bg || bg === 'none') return;
    const match = bg.match(/url\(["']?(.*?)["']?\)/);
    if (!match) return;
    image.src = match[1]; box.classList.add('open');
  }));
  document.querySelector('#lightbox-close')?.addEventListener('click', close);
  box?.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

window.addEventListener('load', () => {
  initMap(); renderPandalExplorer(); initLightbox();
  if (!window.anime || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  anime({ targets: '.hero-content .eyebrow, .hero-content h1, .hero-copy, .hero-actions', opacity:[0,1], translateY:[28,0], duration:1100, delay:anime.stagger(140), easing:'easeOutExpo' });
  anime({ targets: '.hero-mark', opacity:[0,.8], scale:[.7,1], rotate:[-8,0], duration:1400, delay:650, easing:'easeOutElastic(1,.65)' });
  anime({ targets: '.scroll-note', opacity:[0,1], translateY:[12,0], duration:900, delay:1500, easing:'easeOutQuad' });

  const revealTargets = document.querySelectorAll('.section-label,.intro-grid > div,.stats > div,.timeline-head > *, .days article,.culture-card,.guide-head > *, .explorer-toolbar,.pandal-card,.map-panel,.gallery-head > *, .tile,footer > *');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    anime({ targets: entry.target, opacity:[0,1], translateY:[34,0], duration:800, easing:'easeOutCubic' });
    observer.unobserve(entry.target);
  }), {threshold:.12, rootMargin:'0px 0px -40px'});
  revealTargets.forEach(el => { el.style.opacity='0'; observer.observe(el); });
  anime({ targets: '.scroll-note span', translateY:[0,7], opacity:[1,.45], direction:'alternate', loop:true, duration:850, easing:'easeInOutSine' });
});
