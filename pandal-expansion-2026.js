(()=>{
  'use strict';
  const EXTRA={
    'Mudiali':{zone:'South',area:'Tollygunge',lat:22.51008,lng:88.34663,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Mudiali_Club_Durga_Puja_2025_09.jpg'},
    'Suruchi Sangha':{zone:'South',area:'New Alipore',lat:22.50899,lng:88.33395,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Suruchi_Sangha%27s_Durga_Puja_2025_09.jpg'},
    'Jagat Mukherjee Park':{zone:'North',area:'Shobhabazar',lat:22.59967,lng:88.36600,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja2019_-_Durga_Puja_Pandal_of_Jagat_Mukherjee_Park_in_Kolkata_10.jpg'},
    'Kashi Bose Lane':{zone:'North',area:'Hatibagan',lat:22.59100,lng:88.36890,tag:'Verified location',photo:'https://commons.wikimedia.org/wiki/Special:FilePath/Durga_Puja2019_-_Durga_Puja_Pandal_of_Kashi_Bose_Lane_in_Kolkata_14.jpg'}
  };
  function normalize(list){
    if(!Array.isArray(list))return list;
    for(const [name,p] of Object.entries(EXTRA)){
      const existing=list.find(x=>x?.name===name);
      if(existing)Object.assign(existing,p);
      else list.push({name,...p,rating:0});
    }
    return list;
  }
  window.KOLKATA_EXPANDED_PINS=Object.freeze(Object.fromEntries(Object.entries(EXTRA).map(([name,p])=>[name,[p.lat,p.lng]])));
  const current=window.pandals;
  try{
    const desc=Object.getOwnPropertyDescriptor(window,'pandals');
    if(desc?.configurable){
      let stored=normalize(Array.isArray(current)?current:[]);
      Object.defineProperty(window,'pandals',{configurable:true,get(){return stored},set(value){stored=normalize(value)}});
    }else if(Array.isArray(current)){
      normalize(current);
    }
  }catch{}
})();
