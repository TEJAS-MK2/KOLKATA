(()=>{
'use strict';
function boot(){
  if(document.getElementById('puja-countdown'))return;
  const hero=document.querySelector('.hero');
  if(!hero)return;
  const target=new Date('2026-10-15T00:00:00+05:30').getTime();
  const wrap=document.createElement('section');
  wrap.id='puja-countdown';
  wrap.className='puja-countdown';
  wrap.setAttribute('aria-label','Countdown to the 2026 Puja holiday window');
  wrap.innerHTML='<div class="countdown-kicker">THE COUNTDOWN</div><div class="countdown-title">Puja holiday window begins in</div><div class="countdown-grid"><div><strong data-unit="days">--</strong><span>Days</span></div><div><strong data-unit="hours">--</strong><span>Hours</span></div><div><strong data-unit="minutes">--</strong><span>Minutes</span></div><div><strong data-unit="seconds">--</strong><span>Seconds</span></div></div><div class="countdown-date">Holiday window · 15 October 2026</div>';
  hero.insertAdjacentElement('afterend',wrap);
  const style=document.createElement('style');
  style.id='puja-countdown-style';
  style.textContent=`
    .puja-countdown{max-width:var(--max);margin:0 auto;padding:24px 6vw;border-bottom:1px solid var(--line,rgba(20,12,10,.12));background:var(--paper,#f5f0e8);color:var(--ink,#140c0a);text-align:center}
    .countdown-kicker{font:700 10px/1 var(--sans,Arial,sans-serif);letter-spacing:.18em;text-transform:uppercase;opacity:.5}
    .countdown-title{margin-top:8px;font:600 clamp(24px,4vw,38px)/1.1 'Playfair Display',serif}
    .countdown-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));max-width:650px;margin:20px auto 12px;border:1px solid rgba(20,12,10,.12);border-radius:16px;overflow:hidden;background:rgba(255,255,255,.45)}
    .countdown-grid div{padding:15px 8px;border-right:1px solid rgba(20,12,10,.1)}.countdown-grid div:last-child{border-right:0}
    .countdown-grid strong{display:block;font:700 clamp(28px,5vw,46px)/1 'DM Sans',sans-serif;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
    .countdown-grid span{display:block;margin-top:7px;font:600 9px/1 var(--sans,Arial,sans-serif);letter-spacing:.14em;text-transform:uppercase;opacity:.55}
    .countdown-date{font:600 10px/1.4 var(--sans,Arial,sans-serif);letter-spacing:.1em;text-transform:uppercase;opacity:.55}
    @media(max-width:520px){.puja-countdown{padding:20px 14px}.countdown-grid{margin-top:16px}.countdown-grid div{padding:13px 4px}.countdown-grid strong{font-size:27px}.countdown-grid span{font-size:8px;letter-spacing:.08em}.countdown-date{font-size:9px}}
  `;
  document.head.appendChild(style);
  const nodes={days:wrap.querySelector('[data-unit="days"]'),hours:wrap.querySelector('[data-unit="hours"]'),minutes:wrap.querySelector('[data-unit="minutes"]'),seconds:wrap.querySelector('[data-unit="seconds"]')};
  function update(){
    const diff=Math.max(0,target-Date.now());
    const days=Math.floor(diff/86400000);const hours=Math.floor(diff%86400000/3600000);const minutes=Math.floor(diff%3600000/60000);const seconds=Math.floor(diff%60000/1000);
    nodes.days.textContent=String(days).padStart(2,'0');nodes.hours.textContent=String(hours).padStart(2,'0');nodes.minutes.textContent=String(minutes).padStart(2,'0');nodes.seconds.textContent=String(seconds).padStart(2,'0');
    if(diff===0){wrap.querySelector('.countdown-title').textContent='Puja holiday window is here';wrap.querySelector('.countdown-date').textContent='Holiday window · 15 October 2026';clearInterval(timer)}
  }
  update();const timer=setInterval(update,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
