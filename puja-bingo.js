(() => {
  'use strict';
  const KEY='kolkata-puja-bingo-v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}};
  const state=read(); state.done=Array.isArray(state.done)?state.done:[];
  const cells=['North Kolkata classic','South Kolkata favourite','A heritage puja','A themed pandal','A lake-side puja','A first-time discovery','A beautiful idol','A quiet morning visit','A late-night visit','A dhak performance','A community puja','A pandal with archival history'];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(){
    let host=document.querySelector('#puja-bingo');
    if(!host){const guide=document.querySelector('#puja-pro')||document.querySelector('#guide');if(!guide)return;host=document.createElement('section');host.id='puja-bingo';host.className='bingo-panel';guide.appendChild(host)}
    host.innerHTML=`<div class="bingo-head"><div><small>PUJA BINGO</small><h3>Make the city your game board.</h3><p>Tap a square when you've experienced it. Progress is saved only on this device.</p></div><strong>${state.done.length}/${cells.length}</strong></div><div class="bingo-grid">${cells.map((c,i)=>`<button type="button" class="bingo-cell ${state.done.includes(i)?'done':''}" data-bingo="${i}"><span>${state.done.includes(i)?'✓':String(i+1).padStart(2,'0')}</span>${esc(c)}</button>`).join('')}</div><div class="bingo-actions"><button type="button" id="bingo-reset">Reset board</button><button type="button" id="bingo-share">Share progress</button></div>`;
    host.querySelectorAll('[data-bingo]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.bingo);state.done=state.done.includes(i)?state.done.filter(x=>x!==i):state.done.concat(i);write(state);render()});
    host.querySelector('#bingo-reset').onclick=()=>{state.done=[];write(state);render()};
    host.querySelector('#bingo-share').onclick=async()=>{const text=`Kolkata Puja Bingo: ${state.done.length}/${cells.length} completed.`;try{await navigator.clipboard.writeText(text);host.querySelector('#bingo-share').textContent='Copied ✓'}catch{alert(text)}};
  }
  const style=document.createElement('style');style.textContent=`.bingo-panel{margin-top:18px;padding:18px;border:1px solid rgba(216,173,98,.22);border-radius:18px;background:rgba(216,173,98,.05)}.bingo-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.bingo-head small{letter-spacing:.12em;opacity:.55}.bingo-head h3{margin:5px 0;font-size:20px}.bingo-head p{margin:0;max-width:560px;font-size:12px;line-height:1.5;opacity:.62}.bingo-head>strong{font-size:20px;white-space:nowrap}.bingo-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:16px}.bingo-cell{min-height:86px;padding:10px;border:1px solid rgba(247,244,238,.1);border-radius:12px;background:rgba(255,255,255,.035);color:inherit;text-align:left;font-size:11px;line-height:1.35;cursor:pointer}.bingo-cell span{display:block;margin-bottom:8px;font-size:10px;opacity:.5}.bingo-cell.done{border-color:rgba(216,173,98,.7);background:rgba(216,173,98,.16)}.bingo-actions{display:flex;gap:8px;margin-top:12px}.bingo-actions button{border:1px solid rgba(247,244,238,.12);border-radius:9px;background:transparent;color:inherit;padding:8px 10px;font-size:11px}@media(max-width:650px){.bingo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
  document.head.appendChild(style);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,2200),{once:true});else setTimeout(render,2200);
})();
