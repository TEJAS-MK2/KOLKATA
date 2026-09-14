(()=>{
  'use strict';
  const MORE={
    'Nalin Sarkar Street':{zone:'North',area:'Hatibagan',lat:22.59500,lng:88.37390,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Nalin_Sarkar_Street_Durga_Puja_2023_01.jpg'},
    'Ahiritola Sarbojanin':{zone:'North',area:'Ahiritola',lat:22.59484,lng:88.35717,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Ahiritola_Sarbojanin_Durgotsab_2023_16.jpg'},
    'Kumartuli Sarbojanin':{zone:'North',area:'Kumartuli',lat:22.60088,lng:88.36232,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Kumartuli_Sarbojanin_Durgatsab_2023_01.jpg'},
    'Hatibagan Nabinpally':{zone:'North',area:'Hatibagan',lat:22.59590,lng:88.37342,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Hatibagan_Nabinpally_Durga_Utsav_Committee_04.jpg'},
    '20 Palli Sarbojani Durgotsab':{zone:'North',area:'Ahiritola',lat:22.59363,lng:88.35813,tag:'Verified location',photo:''}
  };
  function normalize(list){
    if(!Array.isArray(list))return list;
    for(const [name,p] of Object.entries(MORE)){
      const existing=list.find(x=>x?.name===name);
      if(existing)Object.assign(existing,p);
      else list.push({name,...p,rating:0});
    }
    return list;
  }
  window.KOLKATA_MORE_PINS=Object.freeze(Object.fromEntries(Object.entries(MORE).map(([name,p])=>[name,[p.lat,p.lng]])));
  try{
    const current=window.pandals;
    const desc=Object.getOwnPropertyDescriptor(window,'pandals');
    if(desc?.configurable){
      let stored=normalize(Array.isArray(current)?current:[]);
      Object.defineProperty(window,'pandals',{configurable:true,get(){return stored},set(value){stored=normalize(value)}});
    }else if(Array.isArray(current))normalize(current);
  }catch{}
})();
