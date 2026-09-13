const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.style.background = y > 40 ? 'rgba(18,10,8,.82)' : 'transparent';
  header.style.backdropFilter = y > 40 ? 'blur(14px)' : 'none';
  header.style.transition = 'background .25s ease, backdrop-filter .25s ease';
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

// Anime.js motion layer — keeps the original design intact while adding
// cinematic entrance, stagger, hover and scroll-reveal animations.
window.addEventListener('load', () => {
  if (!window.anime) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  anime({
    targets: '.hero-content .eyebrow, .hero-content h1, .hero-copy, .hero-actions',
    opacity: [0, 1],
    translateY: [28, 0],
    duration: 1100,
    delay: anime.stagger(140),
    easing: 'easeOutExpo'
  });

  anime({
    targets: '.hero-mark',
    opacity: [0, 0.8],
    scale: [0.7, 1],
    rotate: [-8, 0],
    duration: 1400,
    delay: 650,
    easing: 'easeOutElastic(1, .65)'
  });

  anime({
    targets: '.scroll-note',
    opacity: [0, 1],
    translateY: [12, 0],
    duration: 900,
    delay: 1500,
    easing: 'easeOutQuad'
  });

  const revealTargets = document.querySelectorAll(
    '.section-label, .intro-grid > div, .stats > div, .timeline-head > *, .days article, .culture-card, .guide-head > *, .zone, .gallery-head > *, .tile, footer > *'
  );

  const reveal = (el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    anime({
      targets: el,
      opacity: [0, 1],
      translateY: [34, 0],
      duration: 850,
      easing: 'easeOutCubic'
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement?.querySelectorAll(':scope > *');
        if (siblings && siblings.length > 1) {
          siblings.forEach((item, index) => {
            if (!item.dataset.animated) {
              item.dataset.animated = 'true';
              anime({
                targets: item,
                opacity: [0, 1],
                translateY: [34, 0],
                duration: 800,
                delay: index * 90,
                easing: 'easeOutCubic'
              });
            }
          });
        } else {
          reveal(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -50px' });

  revealTargets.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  document.querySelectorAll('.zone, .button, .tile').forEach(el => {
    el.addEventListener('mouseenter', () => {
      anime.remove(el);
      anime({ targets: el, scale: 1.025, duration: 300, easing: 'easeOutQuad' });
    });
    el.addEventListener('mouseleave', () => {
      anime({ targets: el, scale: 1, duration: 400, easing: 'easeOutElastic(1, .7)' });
    });
  });

  anime({
    targets: '.scroll-note span',
    translateY: [0, 7],
    opacity: [1, 0.45],
    direction: 'alternate',
    loop: true,
    duration: 850,
    easing: 'easeInOutSine'
  });
});
