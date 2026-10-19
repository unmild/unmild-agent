document.documentElement.classList.add('js');
(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Nav — supports both #nav-links (store pattern) and .nav-mobile fallback
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('nav-links');
  const mobile = document.querySelector('.nav-mobile');
  const menuTarget = links || mobile;
  if (toggle && menuTarget) {
    const labelOpen = 'Close —';
    const labelClosed = 'Menu +';
    function closeMenu(returnFocus = false) {
      menuTarget.classList.remove('is-open');
      if (links) links.classList.remove('is-open');
      if (mobile) mobile.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = labelClosed;
      if (returnFocus) toggle.focus();
    }
    function isOpen() { return menuTarget.classList.contains('is-open'); }
    toggle.addEventListener('click', () => {
      const open = !isOpen();
      menuTarget.classList.toggle('is-open', open);
      if (links) links.classList.toggle('is-open', open);
      if (mobile) mobile.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? labelOpen : labelClosed;
    });
    if (links) links.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
    if (mobile) mobile.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) closeMenu(true); });
    document.addEventListener('click', (e) => { if (!e.target.closest('.site-header') && isOpen()) closeMenu(); });
    window.matchMedia('(min-width: 721px)').addEventListener('change', () => closeMenu());
  }

  // FAQ accordion — single-open, keyboard friendly
  document.querySelectorAll('.faq details').forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        document.querySelectorAll('.faq details').forEach((o) => { if (o !== d) o.open = false; });
      }
    });
  });

  // Lightbox for masonry/gallery
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  if (lb && lbImg) {
    function openLightbox(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    }
    function closeLightbox() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.removeAttribute('src');
      document.body.style.overflow = '';
    }
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-lightbox]');
      if (btn) {
        const img = btn.querySelector('img');
        if (img) openLightbox(img.currentSrc || img.src, img.alt);
      }
    });
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox(); });
  }

  // Respect reduced motion for any JS-driven scroll
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) document.documentElement.style.scrollBehavior = 'auto';
})();
