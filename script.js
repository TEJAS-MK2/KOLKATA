(() => {
  'use strict';

  // UI-only enhancements. Pandal data, map, routes and explorer state live in
  // core-data-controller-v2.js so every feature consumes the canonical registry.
  const header = document.querySelector('.site-header');

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      if (link.dataset.kolkataAnchorBound) return;
      link.dataset.kolkataAnchorBound = '1';
      link.addEventListener('click', event => {
        const selector = link.getAttribute('href');
        if (!selector || selector === '#') return;
        const target = document.querySelector(selector);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initLightbox() {
    const box = document.querySelector('#lightbox');
    const image = document.querySelector('#lightbox-image');
    if (!box || !image) return;
    const close = () => {
      box.classList.remove('open');
      image.removeAttribute('src');
    };
    document.querySelectorAll('.gallery-grid .tile').forEach(tile => {
      if (tile.dataset.kolkataLightboxBound) return;
      tile.dataset.kolkataLightboxBound = '1';
      tile.addEventListener('click', () => {
        const bg = getComputedStyle(tile).backgroundImage;
        const match = bg.match(/url\(["']?(.*?)["']?\)/);
        if (match?.[1]) {
          image.src = match[1];
          box.classList.add('open');
        }
      });
    });
    document.querySelector('#lightbox-close')?.addEventListener('click', close);
    box.addEventListener('click', event => {
      if (event.target === box) close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });
  }

  function initScrollState() {
    const update = () => {
      header?.classList.toggle('is-scrolled', window.scrollY > 40);
      const hero = document.querySelector('.hero-image');
      if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        hero.style.transform = `translateY(${Math.min(window.scrollY * 0.08, 50)}px) scale(1.02)`;
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function boot() {
    initAnchors();
    initLightbox();
    initScrollState();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
