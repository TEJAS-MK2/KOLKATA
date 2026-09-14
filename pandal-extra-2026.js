(() => {
  'use strict';
  const extras = [
    { name:'Chaltabagan Sarbojanin', zone:'North', area:'Chaltabagan', lat:null, lng:null, photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga%20Puja%202025%20at%20Chalta%20Bagan%20Sarbojanin%2018.jpg' },
    { name:'Dum Dum Park Tarun Sangha', zone:'North', area:'Dum Dum Park', lat:null, lng:null, photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Dum%20Dum%20Park%20Tarun%20Sangha%202023.jpg' },
    { name:'Ahiritola Yubak Brinda', zone:'North', area:'Ahiritola', lat:null, lng:null, photo:null },
    { name:'Beliaghata 33 Palli', zone:'Central', area:'Beliaghata', lat:null, lng:null, photo:null },
    { name:'New Town Sarbojanin', zone:'Salt Lake', area:'New Town', lat:null, lng:null, photo:null },
    { name:'Alipore Sarbojanin', zone:'South', area:'Alipore', lat:22.51963, lng:88.33366, photo:null },
    { name:'Dhakuria Sarbojanin', zone:'South', area:'Dhakuria', lat:22.51003, lng:88.37199, photo:null },
    { name:'Chakraberia Sarbojanin', zone:'South', area:'Bhowanipore', lat:null, lng:null, photo:null },
    { name:'Abasar', zone:'South', area:'Bhowanipore', lat:null, lng:null, photo:null },
    { name:'Hindusthan Park Sarbojanin', zone:'South', area:'Gariahat', lat:null, lng:null, photo:'https://commons.wikimedia.org/wiki/Special:FilePath/DurgaPuja2017%20-%20Pandal%20of%20Hindustan%20Park%2001.jpg' },
    { name:'Rajdanga Naba Uday Sangha', zone:'South', area:'Rajdanga', lat:null, lng:null, photo:null },
    { name:'Purbachal Shakti Sangha', zone:'South', area:'Santoshpur', lat:null, lng:null, photo:null },
    { name:'Santoshpur Trikon Park', zone:'South', area:'Santoshpur', lat:null, lng:null, photo:null },
    { name:'Bosepukur Sitala Mandir', zone:'South', area:'Bosepukur', lat:null, lng:null, photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja_Pandal_-_Bosepukur_Sitala_Mandir_-_Kasba_-_Kolkata_2012-10-23_1154.JPG' },
    { name:'Haridevpur 41 Pally', zone:'South', area:'Haridevpur', lat:null, lng:null, photo:'https://commons.wikimedia.org/wiki/Special:FilePath/41%20Pally%20Durga%20puja%202025%2017.jpg' }
  ];

  const existing = new Map((window.pandals || []).map(p => [p.name, p]));
  extras.forEach(extra => {
    const old = existing.get(extra.name);
    if (old) {
      Object.assign(old, extra, { lat: old.lat ?? extra.lat, lng: old.lng ?? extra.lng, photo: old.photo || extra.photo });
    } else {
      const item = { ...extra };
      if (item.lat == null) delete item.lat;
      if (item.lng == null) delete item.lng;
      if (!item.photo) delete item.photo;
      window.pandals = [...(window.pandals || []), item];
    }
  });

  // These coordinates come from map/EXIF-backed sources, not estimated pin placement.
  window.pandalVerifiedSources = {
    ...(window.pandalVerifiedSources || {}),
    'Alipore Sarbojanin': 'Mapcarta / OpenStreetMap-backed location: 22.51963, 88.33366',
    'Dhakuria Sarbojanin': 'Mapcarta / OpenStreetMap-backed location: 22.51003, 88.37199'
  };

  const renderExtras = () => {
    const list = document.querySelector('#pandal-list');
    if (!list) return;
    list.querySelectorAll('.pandal-card').forEach(card => {
      const name = card.dataset.name;
      const p = window.pandals?.find(x => x.name === name);
      if (!p || !p.photo || card.querySelector('img')) return;
      const img = document.createElement('img');
      img.src = p.photo;
      img.alt = `Archive photo associated with ${p.name}`;
      img.loading = 'lazy';
      img.onerror = () => img.remove();
      card.insertBefore(img, card.firstChild);
    });
  };
  setTimeout(renderExtras, 1600);
})();
