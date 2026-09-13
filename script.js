const header = document.querySelector('.site-header');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.style.background = y > 40 ? 'rgba(18,10,8,.82)' : 'transparent';
  header.style.backdropFilter = y > 40 ? 'blur(14px)' : 'none';
  header.style.transition = 'background .25s ease, backdrop-filter .25s ease';
  lastY = y;
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelector('.menu')?.addEventListener('click', () => {
  const nav = document.querySelector('nav');
  const open = nav.dataset.open === 'true';
  nav.dataset.open = String(!open);
  nav.style.display = open ? 'none' : 'flex';
  nav.style.position = 'absolute';
  nav.style.top = '72px';
  nav.style.right = '6vw';
  nav.style.flexDirection = 'column';
  nav.style.padding = '18px 22px';
  nav.style.background = 'rgba(18,10,8,.96)';
  nav.style.border = '1px solid rgba(243,234,217,.15)';
});
