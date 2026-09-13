(() => {
  'use strict';
  const pins={
    'Bagbazar Sarbojanin':[22.60121,88.36682], 'Tala Prattoy':[22.61046,88.38460], 'Hatibagan Sarbojanin':[22.59439,88.37200],
    'Sree Bhumi Sporting Club':[22.59890,88.40293], 'Dumdum Park Bharat Chakra':[22.61082,88.41460], 'Dumdum Park Sarbojanin':[22.60944,88.41641],
    'Kumartuli Park':[22.59898,88.36147], 'Shobhabazar Rajbari':[22.59626,88.36738], 'College Square':[22.57453,88.36447],
    'Santosh Mitra Square':[22.56602,88.36565], 'Maddox Square':[22.52656,88.35465], 'Deshapriya Park':[22.51858,88.35346],
    'Naktala Udayan Sangha':[22.47449,88.36658]
  };
  const directions=(lat,lng)=>`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${encodeURIComponent(localStorage.getItem('kolkata-pujo-mode')||'walking')}`;
  const seo=()=>{const set=(name,content,property=false)=>{let el=document.querySelector(property?`meta[property="${name}"]`:`meta[name="${name}"]`);if(!el){el=document.createElement('meta');property?el.setAttribute('property',name):el.setAttribute('name',name);document.head.appendChild(el)}el.setAttribute('content',content)};set('description','Explore Kolkata Durga Puja 2026: 92 pandal listings, verified map pins, route planning, Puja Night mode and current 2026 guidance.');set('og:title','কলকাতা দুর্গাপূজা — ২০২৬',true);set('og:description','A practical Kolkata Durga Puja 2026 explorer with pandals, maps, routes and current guidance.',true);set('og:type','website',true);set('og:url','https://tejas-mk2.github.io/KOLKATA/',true);set('twitter:card','summary_large_image');set('twitter:title','কলকাতা দুর্গাপূজা — ২০২৬');set('twitter:description','Explore Kolkata Puja 2026 with verified map pins and route planning.');let link=document.querySelector('link[rel="canonical"]');if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link)}link.href='https://tejas-mk2.github.io/KOLKATA/'};
  const fix=()=>{
    document.querySelectorAll('.map-legend').forEach((el,i)=>{if(i>0)el.remove()});
    document.querySelectorAll('.pandal-card').forEach(card=>{const name=card.dataset.name,p=pins[name];if(!p)return;const a=card.querySelector('a.route');if(a)a.href=directions(p[0],p[1]);card.dataset.lat=p[0];card.dataset.lng=p[1]});
    document.querySelector('#fit-pins')?.click();
    setTimeout(()=>document.querySelector('#fit-pins')?.click(),700);
    document.body.style.overflowX='hidden';document.documentElement.style.overflowX='hidden';
    seo();
  };
  setTimeout(fix,3400);setTimeout(fix,4700);
})();
