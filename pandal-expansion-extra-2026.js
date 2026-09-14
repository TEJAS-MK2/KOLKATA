/* Additional Kolkata Puja discovery listings. Guide-point coordinates should be confirmed against 2026 committee information. */
(() => {
  const extra = [
    ['Chaltabagan Lohapatty','North Kolkata',22.5876,88.3698],['Sikdar Bagan','North Kolkata',22.5944,88.3729],['Tala Barowari','North Kolkata',22.6091,88.3814],
    ['Dum Dum Park Bharat Chakra','North East Kolkata',22.6144,88.4105],['Dum Dum Park Tarun Dal','North East Kolkata',22.6127,88.4100],['Dum Dum Park Tarun Sangha','North East Kolkata',22.6160,88.4091],
    ['Jagat Mukherjee Park','North Kolkata',22.5940,88.3673],['Ahiritola Yubak Brinda','North Kolkata',22.5969,88.3567],['Chorebagan Sarbojanin','North Kolkata',22.6044,88.3650],
    ['Mitali Sangha Kankurgachi','North East Kolkata',22.5787,88.3940],['AJ Block Salt Lake','Salt Lake',22.5916,88.4076],['New Town Sarbojanin','New Town',22.5822,88.4600],
    ['Bakul Bagan Sarbojanin','South Kolkata',22.5247,88.3471],['Ballygunge Cultural','South Kolkata',22.5285,88.3656],['Badamtala Ashar Sangha','South Kolkata',22.5155,88.3470],
    ['Alipur Sarbojanin','South Kolkata',22.5265,88.3297],['Ajeya Sanghati','South Kolkata',22.4787,88.3290],['Maddox Square','South Kolkata',22.5323,88.3614],
    ['Hindustan Park','South Kolkata',22.5192,88.3655],['Ekdalia Evergreen','South Kolkata',22.5184,88.3686],['Suruchi Sangha','South Kolkata',22.5082,88.3236],
    ['Chetla Agrani Club','South Kolkata',22.5017,88.3298],['Naktala Udayan Sangha','South Kolkata',22.4690,88.3604],['Golf Green Central Park','South Kolkata',22.4828,88.3600],
    ['Santoshpur Lake Pally','South Kolkata',22.4930,88.3832],['Rajdanga Naba Uday Sangha','South Kolkata',22.5100,88.3900]
  ];
  const cur = Array.isArray(window.pandals) ? window.pandals : [];
  const seen = new Set(cur.map(p => String(p.name || '').trim().toLowerCase()));
  for (const [name, area, lat, lng] of extra) {
    if (seen.has(name.toLowerCase())) continue;
    cur.push({name, area, lat, lng, verified:false, discovery:true, guidePoint:true, image:'', rating:null, theme:'2025 reference — confirm 2026 details', source:'Kolkata Puja directory references'});
  }
  window.pandals = cur;
  window.KOLKATA_EXTRA_PINS = extra.map(([name,area,lat,lng]) => ({name,area,lat,lng}));
})();
