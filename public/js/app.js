const S = window.SITE;
const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ICONS = [
  'M4 6h16M4 12h16M4 18h10',
  'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  'M7 18a4 4 0 010-8 5 5 0 019.6-1A4 4 0 1117 18z',
  'M12 4v6M5 20v-4h14v4M12 10v6M3 20h4M17 20h4',
  'M4 7c0-2 16-2 16 0s-16 2-16 0v10c0 2 16 2 16 0V7',
  'M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14',
  'M3 5h18v12H3zM8 21h8M12 17v4',
  'M5 4h14v16H5zM9 9h6M9 13h6',
  'M4 7h16v10H4zM2 19h20',
  'M5 4c0 9 6 15 15 15l-3-4-4 1c-2-1-4-3-5-5l1-4-4-3z',
  'M4 20V10M10 20V4M16 20v-8M22 20H2',
  'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
];

const PARTNER_SVG = {
  ms: '<rect x="4" y="4" width="7" height="7" fill="#2f5bff"/><rect x="13" y="4" width="7" height="7" fill="#ffb020"/><rect x="4" y="13" width="7" height="7" fill="#16c3ff"/><rect x="13" y="13" width="7" height="7" fill="#5a6a86"/>',
  aws: '<path d="M4 16c3 2 8 3 12 1M6 8h12l-2 5H8z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="6" r="2" fill="currentColor"/>',
  cisco: '<path d="M4 12h16M7 8v8M10 6v12M14 6v12M17 8v8" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  fortinet: '<path d="M12 3l9 5v8l-9 5-9-5V8z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v8M8 10l8 4M16 10l-8 4" stroke="currentColor" stroke-width="1.4"/>',
  gcp: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 4v8l6 3" stroke="currentColor" stroke-width="1.6"/>',
  veeam: '<path d="M4 16l4-10h3l4 10M9 16h10" fill="none" stroke="currentColor" stroke-width="1.8"/>',
};

function renderOfficeMap() {
  const frame = $('office-map');
  if (!frame || !S.map) return;
  const { lat, lng, label } = S.map;
  const query = encodeURIComponent(S.address || label || `${lat},${lng}`);
  const pad = 0.012;
  const bbox = [lng - pad, lat - pad, lng + pad, lat + pad].map((n) => n.toFixed(5)).join('%2C');
  // OpenStreetMap embed (no API key) — Google link used for directions
  frame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  frame.setAttribute(
    'title',
    label ? `Map showing ${label}` : 'Map showing Refine ICT office location'
  );

  const addr = $('map-address');
  if (addr) addr.textContent = S.address || label || '';

  const directions = $('map-directions');
  if (directions) {
    directions.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
}

function setImg(el, key) {
  if (!el || !S.images[key]) return;
  const { src, w, h, alt, fallback } = S.images[key];
  el.src = src.startsWith('/') ? src : '/' + src;
  el.width = w;
  el.height = h;
  el.alt = alt || el.alt || '';
  if (!el.hasAttribute('fetchpriority')) el.loading = el.loading || 'lazy';
  el.decoding = 'async';
  el.addEventListener('error', () => {
    if (fallback && !el.dataset.fallbackTried) {
      el.dataset.fallbackTried = '1';
      el.src = fallback.startsWith('/') ? fallback : '/' + fallback;
      return;
    }
    el.classList.add('is-broken');
    el.removeAttribute('src');
  });
}

function setHeroBackground() {
  const bg = S.images.heroBg;
  if (!bg) return;
  const img = $('img-hero');
  const webp = $('hero-bg-webp');
  const src = bg.src.startsWith('/') ? bg.src : '/' + bg.src;
  const fallback = bg.fallback
    ? bg.fallback.startsWith('/')
      ? bg.fallback
      : '/' + bg.fallback
    : src;
  if (webp) webp.srcset = src;
  if (img) {
    img.src = fallback.endsWith('.jpg') || fallback.endsWith('.jpeg') || fallback.endsWith('.png') ? fallback : src;
    // Prefer webp via picture; img is the jpg/png fallback
    if (bg.fallback) img.src = fallback;
    else img.src = src;
    img.width = bg.w;
    img.height = bg.h;
    img.alt = bg.alt || '';
    img.fetchpriority = 'high';
    img.decoding = 'async';
  }
  const brand = $('hero-brand');
  if (brand) brand.textContent = S.name;
}

function serviceCards(limit) {
  const list = limit ? S.services.slice(0, limit) : S.services;
  return list
    .map(
      (svc, i) => `
    <a class="card" href="/service.html?slug=${encodeURIComponent(svc.slug)}">
      <svg class="icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[i % ICONS.length]}"/></svg>
      <h3>${svc.title}</h3>
      <p>${svc.short}</p>
      <span class="more">Learn more →</span>
    </a>`
    )
    .join('');
}

function fillSelect(el) {
  if (!el) return;
  el.innerHTML =
    '<option value="">Not sure yet</option>' +
    S.services.map((s) => `<option value="${s.title}">${s.title}</option>`).join('');
}

function waNumber() {
  return String(S.whatsapp || S.phone || '').replace(/\D/g, '');
}

function openWhatsApp(text) {
  const n = waNumber();
  if (!n) throw new Error('WhatsApp number is not configured.');
  const url = `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** Quote / “Send request” forms → WhatsApp chat with prefilled details */
function wireQuoteToWhatsApp(formId, msgId) {
  const form = $(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = $(msgId);
    const btn = form.querySelector('button[type="submit"]');
    msg.className = 'form-msg';
    msg.textContent = '';

    if (!form.reportValidity()) {
      msg.className = 'form-msg err';
      msg.textContent = 'Please complete the required fields.';
      return;
    }

    const body = Object.fromEntries(new FormData(form));
    if (body.website) return; // honeypot

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const service = String(body.service || '').trim() || 'Not sure yet';
    const message = String(body.message || '').trim();

    const lines = [
      `Hello ${S.name}, I would like a quote.`,
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Service: ${service}`,
      '',
      'Message:',
      message,
    ].filter((line) => line != null);

    try {
      btn.disabled = true;
      openWhatsApp(lines.join('\n'));
      msg.className = 'form-msg';
      msg.textContent = '';
      form.reset();
    } catch (err) {
      msg.className = 'form-msg err';
      msg.textContent = err.message || `Please WhatsApp us on ${S.phone}.`;
    }
    btn.disabled = false;
  });
}

function wireForm(formId, msgId, endpoint) {
  const form = $(formId);
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = $(msgId);
    const btn = form.querySelector('button[type="submit"]');
    msg.className = 'form-msg';
    msg.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const body = Object.fromEntries(new FormData(form));
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Something went wrong. Please try again.');
      msg.className = 'form-msg ok';
      if (j.reference) {
        msg.textContent = `Ticket created. Your reference is ${j.reference}.`;
      } else {
        msg.textContent = 'Request sent. We will contact you shortly.';
      }
      form.reset();
    } catch (err) {
      msg.className = 'form-msg err';
      msg.textContent = err.message || `Something went wrong. Please email ${S.email}.`;
    }
    btn.disabled = false;
  });
}

function renderStats() {
  const st = $('stats');
  if (!st) return;
  st.innerHTML = S.stats
    .map((s) => `<div><b data-v="${s.value}" data-s="${s.suffix}">0${s.suffix}</b><span>${s.label}</span></div>`)
    .join('');
  if (reduceMotion) {
    st.querySelectorAll('b').forEach((b) => {
      b.textContent = b.dataset.v + b.dataset.s;
    });
    return;
  }
  new IntersectionObserver(
    (entries, ob) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        ob.disconnect();
        st.querySelectorAll('b').forEach((b) => {
          const v = +b.dataset.v;
          const dec = v % 1 ? 1 : 0;
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min((t - t0) / 1400, 1);
            b.textContent = (v * p).toFixed(dec) + b.dataset.s;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      });
    },
    { threshold: 0.4 }
  ).observe(st);
}

function animatePackets() {
  if (reduceMotion) return;
  const svg = document.querySelector('.topo');
  if (!svg) return;
  const paths = [
    'M60 220 L150 120',
    'M150 120 L260 170',
    'M260 170 L340 70',
    'M150 120 L200 40',
    'M200 40 L260 170',
    'M60 220 L260 170',
  ];
  paths.forEach((d, i) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'none');
    path.id = `edge-${i}`;
    svg.appendChild(path);
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '3.5');
    dot.setAttribute('class', 'packet');
    const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    anim.setAttribute('dur', `${2.4 + (i % 3) * 0.5}s`);
    anim.setAttribute('repeatCount', 'indefinite');
    anim.setAttribute('begin', `${i * 0.35}s`);
    const mpath = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
    mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#edge-${i}`);
    mpath.setAttribute('href', `#edge-${i}`);
    anim.appendChild(mpath);
    dot.appendChild(anim);
    svg.appendChild(dot);
  });
}

function renderPartners() {
  const el = $('partners');
  if (!el) return;
  el.innerHTML = S.partners
    .map(
      (p) => `
    <div class="partner">
      <svg viewBox="0 0 24 24" role="img" aria-label="${p.name}">${PARTNER_SVG[p.id] || PARTNER_SVG.ms}</svg>
      <span>${p.name}</span>
    </div>`
    )
    .join('');
}

function renderFaq() {
  const el = $('faq');
  if (!el) return;
  el.innerHTML = S.faq
    .map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`)
    .join('');
}

function renderPlans() {
  const el = $('plans');
  if (!el) return;
  el.innerHTML = S.plans
    .map(
      (p) => `
    <article class="plan${p.highlighted ? ' featured' : ''}">
      ${p.highlighted ? '<span class="badge">Most popular</span>' : ''}
      <h3>${p.name}</h3>
      <div class="price">${p.price}</div>
      <div class="period">${p.period}</div>
      <p class="muted">${p.blurb}</p>
      <ul>${p.features.map((f) => `<li>${f}</li>`).join('')}</ul>
      <a class="btn${p.highlighted ? '' : ' btn-ghost'}" href="/contact.html?plan=${encodeURIComponent(p.name)}">${p.cta}</a>
    </article>`
    )
    .join('');
}

function renderIndustries() {
  const el = $('industries');
  if (!el) return;
  el.innerHTML = S.industries
    .map((i) => `<article class="card"><h3>${i.title}</h3><p>${i.text}</p></article>`)
    .join('');
}

function renderCases() {
  const el = $('cases');
  if (!el) return;
  el.innerHTML = S.caseStudies
    .map(
      (c) => `
    <article class="case">
      <div class="meta">${c.client} · ${c.industry}</div>
      <h3>${c.title}</h3>
      <p class="muted">${c.summary}</p>
      <p class="result">${c.result}</p>
    </article>`
    )
    .join('');
}

async function renderPosts() {
  const el = $('posts');
  if (!el) return;
  try {
    const r = await fetch('/api/posts');
    const posts = await r.json();
    el.innerHTML = posts
      .map(
        (p) => `
      <article class="post">
        <div class="meta">${p.date}${p.tags?.length ? ' · ' + p.tags.join(', ') : ''}</div>
        <h3>${p.title}</h3>
        <p class="muted">${p.excerpt}</p>
      </article>`
      )
      .join('');
  } catch {
    el.innerHTML = '<p class="muted">News will appear here shortly.</p>';
  }
}

function renderServiceDetail() {
  const root = $('service-detail');
  if (!root) return;
  const slug = new URLSearchParams(location.search).get('slug');
  const svc = S.services.find((s) => s.slug === slug) || S.services[0];
  if (!svc) {
    root.innerHTML = '<p>Service not found.</p>';
    return;
  }
  document.title = `${svc.title} — ${S.name}`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = svc.short;
  if (svc.heroImage) {
    const og = document.querySelector('meta[property="og:image"]');
    if (og) og.content = `${S.url}${svc.heroImage.src}`;
  }

  const heroClass = svc.heroImage ? 'page-hero page-hero--bg' : 'page-hero';
  const heroBg = svc.heroImage
    ? `<div class="page-hero-bg" aria-hidden="true">
        <picture>
          <source srcset="${svc.heroImage.src}" type="image/webp">
          <img src="${svc.heroImage.fallback || svc.heroImage.src}" alt="" width="${svc.heroImage.w || 1920}" height="${svc.heroImage.h || 1080}" fetchpriority="high">
        </picture>
      </div>`
    : '';

  root.innerHTML = `
    <div class="${heroClass}">
      ${heroBg}
      <div class="page-hero-inner">
        <p class="hero-brand">${S.name}</p>
        <h1>${svc.title}</h1>
        <p class="lead">${svc.short}</p>
      </div>
    </div>
    <section class="sec">
      <p>${svc.description}</p>
      <ul class="feature-list">${svc.features.map((f) => `<li>${f}</li>`).join('')}</ul>
      <div class="cta">
        <a class="btn" href="/contact.html?service=${encodeURIComponent(svc.title)}">Request this service</a>
        <a class="btn btn-ghost" href="/services.html">All services</a>
      </div>
    </section>`;
}

function applySeoJsonLd(extra) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        name: S.name,
        url: S.url,
        email: S.email,
        telephone: S.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: S.address,
        },
        description: S.tagline,
      },
      ...(extra || []),
    ],
  };
  let el = document.getElementById('jsonld');
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'jsonld';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function applyPageMeta() {
  const page = (location.pathname.split('/').pop() || 'index.html').replace(/^\//, '');
  const map = {
    'index.html': [S.seo?.homeTitle, S.seo?.homeDescription],
    '': [S.seo?.homeTitle, S.seo?.homeDescription],
    'services.html': [S.seo?.servicesTitle, S.seo?.servicesDescription],
    'about.html': [S.seo?.aboutTitle, S.seo?.aboutDescription],
    'contact.html': [S.seo?.contactTitle, S.seo?.contactDescription],
  };
  const pair = map[page];
  if (!pair || page === 'service.html') return;
  const [title, desc] = pair;
  if (title) document.title = `${S.name} — ${title}`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && desc) meta.content = desc;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) ogTitle.content = `${S.name} — ${title}`;
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && desc) ogDesc.content = desc;
}

function pageInit() {
  applyPageMeta();
  const tag = $('h-tagline');
  if (tag) tag.textContent = S.tagline;
  const lead = $('h-lead');
  if (lead) lead.textContent = S.heroLead;
  const status = $('status-line');
  if (status) status.textContent = S.statusLine;

  if ($('hero-bg-webp') || ($('img-hero') && document.querySelector('.hero--cinema'))) {
    setHeroBackground();
  } else {
    setImg($('img-hero'), 'hero');
  }
  setImg($('img-about'), 'about');
  setImg($('img-security'), 'security');
  setImg($('img-network'), 'network');

  const sg = $('service-grid');
  if (sg) sg.innerHTML = serviceCards(sg.dataset.limit ? +sg.dataset.limit : undefined);

  const steps = $('steps');
  if (steps) {
    steps.innerHTML = S.process.map((p) => `<li><h3>${p.title}</h3><p>${p.text}</p></li>`).join('');
  }

  const quotes = $('quotes');
  if (quotes) {
    quotes.innerHTML = S.testimonials
      .map((t) => `<blockquote>“${t.quote}”<cite>${t.author}</cite></blockquote>`)
      .join('');
  }

  const aboutTitle = $('about-title');
  if (aboutTitle) aboutTitle.textContent = S.about.title;
  const aboutLead = $('about-lead');
  if (aboutLead) aboutLead.textContent = S.about.lead;
  const aboutPoints = $('about-points');
  if (aboutPoints) aboutPoints.innerHTML = S.about.points.map((p) => `<li>${p}</li>`).join('');
  const aboutStory = $('about-story');
  if (aboutStory) aboutStory.textContent = S.about.story;
  const secTitle = $('security-title');
  if (secTitle) secTitle.textContent = S.about.securityTitle;
  const secLead = $('security-lead');
  if (secLead) secLead.textContent = S.about.securityLead;
  const secCta = $('security-cta');
  if (secCta) secCta.textContent = S.about.securityCta;

  const contactInfo = $('contact-info');
  if (contactInfo) {
    contactInfo.innerHTML = `
      <span>${S.address}</span>
      <a href="mailto:${S.email}">${S.email}</a>
      <a href="tel:${S.phone.replace(/\s/g, '')}">${S.phone}</a>
      <span>${S.hours}</span>`;
  }

  renderOfficeMap();

  const contactIntro = $('contact-intro');
  if (contactIntro) contactIntro.textContent = S.contactIntro;
  const servicesIntro = $('services-intro');
  if (servicesIntro) servicesIntro.textContent = S.servicesIntro;
  const blogIntro = $('blog-intro');
  if (blogIntro) blogIntro.textContent = S.blogIntro;
  const ticketIntro = $('ticket-intro');
  if (ticketIntro) ticketIntro.textContent = S.ticketIntro;
  const setText = (id, v) => {
    const el = $(id);
    if (el && v != null) el.textContent = v;
  };
  setText('industries-intro', S.industriesIntro);
  setText('partners-intro', S.partnersIntro);
  setText('plans-intro', S.plansIntro);
  setText('cases-intro', S.casesIntro);
  setText('cta-assess', S.assessmentCta);
  setText('cta-services', S.servicesCta);
  setText('cta-view-all', S.viewAllServices);

  fillSelect($('service-select'));
  const params = new URLSearchParams(location.search);
  if (params.get('service') && $('service-select')) $('service-select').value = params.get('service');
  if (params.get('plan') && $('message')) {
    $('message').value = `I am interested in the ${params.get('plan')} support plan.`;
  }

  renderStats();
  renderPartners();
  renderFaq();
  renderPlans();
  renderIndustries();
  renderCases();
  renderPosts();
  renderServiceDetail();
  animatePackets();
  wireQuoteToWhatsApp('form', 'form-msg');
  wireForm('ticket-form', 'ticket-msg', '/api/tickets');

  applySeoJsonLd(
    S.services.map((svc) => ({
      '@type': 'Service',
      name: svc.title,
      description: svc.short,
      provider: { '@type': 'Organization', name: S.name },
      url: `${S.url}/service.html?slug=${svc.slug}`,
    }))
  );
}

pageInit();
