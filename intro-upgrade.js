(() => {
  const intro = document.querySelector('.site-intro');
  const inner = intro?.querySelector('.site-intro-inner');
  if (!intro || !inner) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const style = document.createElement('style');
  style.id = 'intro-upgrade-style';
  style.textContent = `
    .site-intro{animation:none!important;opacity:1!important;visibility:visible!important;overflow:hidden;background:#140c0a}
    .site-intro::before,.site-intro::after{content:"";position:absolute;inset:0;pointer-events:none}
    .site-intro::before{background:radial-gradient(circle at 50% 48%,rgba(216,173,98,.11),transparent 34%),linear-gradient(115deg,transparent 0 45%,rgba(243,234,217,.025) 50%,transparent 55%);transform:scale(1.15);opacity:0;animation:introGlow 1.25s ease-out .1s forwards}
    .site-intro::after{background:linear-gradient(90deg,transparent,rgba(216,173,98,.16),transparent);height:1px;inset:50% 12%;transform:scaleX(0);animation:introSweep .9s cubic-bezier(.76,0,.24,1) .32s forwards}
    .site-intro-inner{position:relative;z-index:1;animation:none!important;opacity:1!important;transform:none!important;filter:none!important}
    .site-intro-kicker{opacity:0!important;transform:translateY(10px);animation:introUp .55s cubic-bezier(.2,.75,.25,1) .12s forwards}
    .site-intro-title{opacity:0!important;transform:translateY(18px) scale(.97);filter:blur(6px);animation:introTitle .85s cubic-bezier(.2,.75,.25,1) .24s forwards}
    .site-intro-year{opacity:0!important;transform:translateY(8px);animation:introUp .55s ease .58s forwards}
    .site-intro-line{width:0!important;animation:introLineUpgrade .7s cubic-bezier(.76,0,.24,1) .68s forwards!important}
    .site-intro.is-leaving .site-intro-inner{animation:introLeave .42s cubic-bezier(.76,0,.24,1) forwards!important}
    .site-intro.is-leaving{animation:introExit .72s cubic-bezier(.76,0,.24,1) forwards!important;pointer-events:none}
    @keyframes introGlow{to{opacity:1;transform:scale(1)}}
    @keyframes introSweep{to{transform:scaleX(1)}}
    @keyframes introUp{to{opacity:.62;transform:translateY(0)}}
    @keyframes introTitle{to{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
    @keyframes introLineUpgrade{to{width:72px}}
    @keyframes introLeave{to{opacity:0;transform:translateY(-10px) scale(.985);filter:blur(4px)}}
    @keyframes introExit{0%{opacity:1;clip-path:inset(0 0 0 0)}100%{opacity:0;clip-path:inset(0 0 100% 0);visibility:hidden}}
    @media(prefers-reduced-motion:reduce){.site-intro{opacity:0!important;visibility:hidden!important}.site-intro *{animation:none!important}}
  `;
  document.head.appendChild(style);

  if (reduced) return;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    intro.classList.add('is-leaving');
    window.setTimeout(() => {
      intro.remove();
      document.documentElement.classList.remove('intro-active');
    }, 760);
  };

  document.documentElement.classList.add('intro-active');
  window.setTimeout(finish, 2100);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') finish();
  }, { once: false, passive: true });
})();
