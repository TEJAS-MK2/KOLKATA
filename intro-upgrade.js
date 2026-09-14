(()=>{
'use strict';
const intro=document.querySelector('.site-intro');
if(!intro)return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const s=document.createElement('style');
s.id='intro-stable-style';
s.textContent=`
.site-intro{animation:none!important;opacity:1!important;visibility:visible!important;pointer-events:none!important;overflow:hidden!important;background:#140c0a!important}
.site-intro-inner{animation:none!important;opacity:1!important;transform:none!important;filter:none!important}
.site-intro::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 45%,rgba(216,173,98,.12),transparent 36%);opacity:0;animation:introGlowStable .8s ease .05s forwards}
.site-intro-kicker{opacity:0!important;transform:translateY(8px)!important;animation:introKickerStable .45s ease .08s forwards!important}
.site-intro-title{opacity:0!important;transform:translateY(12px) scale(.985)!important;filter:blur(4px)!important;animation:introTitleStable .62s cubic-bezier(.2,.75,.25,1) .18s forwards!important}
.site-intro-year{opacity:0!important;transform:translateY(6px)!important;animation:introYearStable .4s ease .48s forwards!important}
.site-intro-line{width:0!important;animation:introLineStable .45s ease .56s forwards!important}
.site-intro.is-leaving{animation:introExitStable .48s cubic-bezier(.76,0,.24,1) forwards!important}
@keyframes introGlowStable{to{opacity:1}}
@keyframes introKickerStable{to{opacity:.62;transform:none}}
@keyframes introTitleStable{to{opacity:1;transform:none;filter:blur(0)}}
@keyframes introYearStable{to{opacity:1;transform:none}}
@keyframes introLineStable{to{width:72px}}
@keyframes introExitStable{to{opacity:0;transform:translateY(-10px)}}
@media(prefers-reduced-motion:reduce){.site-intro{display:none!important}}
`;
document.head.appendChild(s);
if(reduced){intro.remove();return;}
let done=false;
const finish=()=>{if(done)return;done=true;intro.classList.add('is-leaving');window.setTimeout(()=>intro.remove(),500)};
window.setTimeout(finish,1500);
window.addEventListener('keydown',e=>{if(e.key==='Escape')finish()},{passive:true});
})();