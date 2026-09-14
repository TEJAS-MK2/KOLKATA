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
})();
