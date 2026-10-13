/* Shared header, footer, WhatsApp button, mobile call bar — driven by window.SITE */
(function () {
  const S = window.SITE;
  if (!S) return;

  const path = location.pathname.replace(/\\/g, '/');
  const page = path.split('/').pop() || 'index.html';

  function brandLabel() {
    return S.legalName || S.name;
  }

  function brandHtml(onDark) {
    const label = brandLabel();
    if (!S.logo) {
      return `<span class="mark" aria-hidden="true">R</span><span>${label}</span>`;
    }
    const theme = document.documentElement.getAttribute('data-theme');
    const useLight = onDark || theme === 'dark';
    const src = useLight && S.logoDark ? S.logoDark : S.logo;
    return `<img class="brand-logo" src="${src}?v=11" alt="${label}" width="240" height="80">`;
  }

  function navLinks() {
    return (S.nav || [])
      .map((n) => {
        const href = n.href.startsWith('/') ? n.href.slice(1) : n.href;
        const active = page === href || (page === '' && href === 'index.html') ? ' aria-current="page"' : '';
        return `<a href="${n.href}"${active}>${n.label}</a>`;
      })
      .join('');
  }

  function mountHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;
    el.outerHTML = `
<header class="nav" id="nav">
  <a href="/index.html" class="brand" id="brand">${brandHtml(false)}</a>
  <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Open menu">
    <span></span><span></span>
  </button>
  <nav id="main-nav" aria-label="Main">
    ${navLinks()}
    <a href="${S.cta.href}" class="btn btn-sm">${S.cta.label}</a>
    <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Toggle colour theme" title="Toggle theme">
      <span class="theme-icon" aria-hidden="true"></span>
    </button>
  </nav>
</header>`;
  }

  function mountFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    const year = new Date().getFullYear();
    el.outerHTML = `
<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <a href="/index.html" class="brand">${brandHtml(true)}</a>
      <p class="footer-tag">${S.tagline}</p>
    </div>
    <div>
      <h2 class="footer-h">Contact</h2>
      <p><a href="mailto:${S.email}">${S.email}</a></p>
      <p><a href="tel:${S.phone.replace(/\s/g, '')}">${S.phone}</a></p>
      <p>${S.address}</p>
      <p class="muted">${S.hours}</p>
    </div>
    <div>
      <h2 class="footer-h">Explore</h2>
      <p><a href="/services.html">Services</a></p>
      <p><a href="/about.html">About</a></p>
      <p><a href="/contact.html">Contact & support</a></p>
    </div>
  </div>
  <p class="footer-copy">© ${year} ${brandLabel().replace(/\.$/, '')}. All rights reserved.</p>
</footer>`;
  }

  function mountFloaters() {
    const wa = (S.whatsapp || '').replace(/\D/g, '');
    const tel = (S.phone || '').replace(/\s/g, '');
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<a class="wa-float" href="https://wa.me/${wa}" target="_blank" rel="noopener noreferrer" aria-label="${S.whatsappLabel}">
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M20.5 3.5A11.8 11.8 0 0012.05 0C5.5 0 .2 5.3.2 11.85c0 2.1.55 4.1 1.6 5.9L0 24l6.4-1.7a11.8 11.8 0 005.65 1.45h.05c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.23-6.15-3.45-8.4zM12.05 21.7h-.04a9.8 9.8 0 01-5-1.37l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.8 9.8 0 01-1.5-5.2c0-5.4 4.4-9.8 9.84-9.8 2.63 0 5.1 1.02 6.95 2.88a9.74 9.74 0 012.88 6.93c0 5.4-4.4 9.85-9.85 9.85zm5.4-7.35c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54 1.9.82 2.65.9 3.6.76.58-.09 1.75-.72 2-1.4.25-.7.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35z"/></svg>
</a>
<div class="call-bar" role="region" aria-label="Phone contact">
  <a href="tel:${tel}">${S.callBarLabel}: ${S.phone}</a>
</div>`;
    document.body.append(...wrap.childNodes);
  }

  function wireNav() {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener(
      'resize',
      () => {
        if (window.matchMedia('(min-width: 901px)').matches) setOpen(false);
      },
      { passive: true }
    );
  }

  function themeInit() {
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (preferDark ? 'dark' : 'light');
    root.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      const brand = document.querySelector('#brand .brand-logo');
      if (brand && S.logo) {
        brand.src = next === 'dark' && S.logoDark ? S.logoDark : S.logo;
      }
    });
  }

  function stickyNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  mountHeader();
  mountFooter();
  mountFloaters();
  wireNav();
  themeInit();
  stickyNav();
})();
