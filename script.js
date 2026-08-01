/* ════════════════════════════════════════
   NAV SCROLL
════════════════════════════════════════ */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), { passive: true });

/* ════════════════════════════════════════
   MOBILE MENU
════════════════════════════════════════ */
let menuOpen = false;
function toggleMenu(btn) {
  menuOpen = !menuOpen;
  btn.classList.toggle('open', menuOpen);
  document.getElementById('mobileDrawer').classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}
function closeMenu() {
  menuOpen = false;
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });

function watchReveal(el) {
  el.classList.add('reveal');
  revObs.observe(el);
}

/* ════════════════════════════════════════
   HOMEPAGE COLLECTIONS
   Shows 6 items filtered by category
════════════════════════════════════════ */
const HOME_LIMIT = 6;
let activeHomeCat = 'all';

/* build category chip buttons */
function buildHomeCatFilters() {
  const bar = document.getElementById('homeCatFilters');
  if (!bar || typeof SIVA_DATA === 'undefined') return;

  SIVA_DATA.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className   = 'home-cat-chip' + (cat.id === 'all' ? ' active' : '');
    btn.textContent = cat.label;
    btn.onclick     = () => switchHomeCat(cat.id, btn);
    bar.appendChild(btn);
  });
}

/* switch category — re-render 6 items */
function switchHomeCat(catId, clickedBtn) {
  activeHomeCat = catId;
  document.querySelectorAll('.home-cat-chip').forEach(b => b.classList.remove('active'));
  clickedBtn.classList.add('active');
  renderHomeCollections();
}

/* render 6 items for current category */
function renderHomeCollections() {
  const grid = document.getElementById('collectionsGrid');
  if (!grid || typeof SIVA_DATA === 'undefined') return;

  // filter
  const all      = SIVA_DATA.collections;
  const filtered = activeHomeCat === 'all'
    ? all
    : all.filter(i => i.category === activeHomeCat);

  // take first 6
  const slice = filtered.slice(0, HOME_LIMIT);

  // clear + re-render with fade
  grid.style.opacity = '0';
  setTimeout(() => {
    grid.innerHTML = '';
    slice.forEach((item, i) => {
      const badge = item.badge ? `<span class="card-badge">${item.badge}</span>` : '';
      const no    = (item.no || '').trim();
      const noTag = no ? `<span class="card-no">No. ${no}</span>` : '';
      const card  = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="card-img-wrap">
          ${noTag}
          <img src="${item.img}" alt="${item.name}" class="card-img" loading="lazy" decoding="async"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="card-img-fallback">💍</div>
          ${badge}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">${item.name}</div>
            <div class="card-sub">${item.sub}</div>
          </div>
          <div class="card-weight">${item.weight}</div>
        </div>`;
      grid.appendChild(card);
      setTimeout(() => watchReveal(card), i * 60);
    });

    // if no items in category
    if (slice.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px 20px;
          font-family:'Cormorant Garamond',serif;font-style:italic;
          color:#888;font-size:1.1rem;">
          No items in this category yet.<br>
          <a href="collections.html" style="color:var(--gold-dark);font-size:.75rem;
            font-family:'Cinzel',serif;letter-spacing:.1em;">Browse All Collections →</a>
        </div>`;
    }

    grid.style.opacity = '1';
    grid.style.transition = 'opacity .35s ease';
  }, 180);
}

/* ════════════════════════════════════════
   HOMEPAGE GALLERY — 6 featured items
════════════════════════════════════════ */
function renderHomeGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid || typeof SIVA_DATA === 'undefined') return;

  /* 5 items = 1 feature cell (2 wide) + 4 normal.
     That is the only count that tiles with no gaps at 2, 3 and 4 columns —
     a 6th item leaves an empty slot in the last row. */
  const featured  = SIVA_DATA.items.filter(i => i.gallery && i.featured).slice(0, 5);
  const bgClasses = ['g1','g2','g3','g4','g5'];

  featured.forEach((item, i) => {
    const cell = document.createElement('div');
    cell.className = `gallery-cell ${i === 0 ? 'wide' : ''} ${bgClasses[i]}`;
    const no    = (item.no || '').trim();
    const label = item.name + (no ? ` — No. ${no}` : '');
    cell.onclick   = () => openLightbox(item.img, label);
    cell.innerHTML = `
      <img src="${item.img}" alt="${label}" class="gallery-img" loading="lazy" decoding="async"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <span class="gallery-fallback">🏺</span>`;
    grid.appendChild(cell);
  });
}

/* ════════════════════════════════════════
   PRESS CAROUSEL DOTS
════════════════════════════════════════ */
const ps   = document.getElementById('pressScroll');
const dots = document.querySelectorAll('.press-dot');
function scrollPress(i) {
  const cards = ps && ps.querySelectorAll('.press-card');
  if (cards && cards[i]) ps.scrollTo({ left: cards[i].offsetLeft - 16, behavior: 'smooth' });
}
if (ps) {
  ps.addEventListener('scroll', () => {
    const w = ps.clientWidth;
    const i = Math.round(ps.scrollLeft / (w * 0.8));
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
  }, { passive: true });
}

/* ════════════════════════════════════════
   FOOTER LAYOUT
════════════════════════════════════════ */
function footerLayout() {
  const d  = window.innerWidth >= 1024;
  const fd = document.getElementById('footerDesktop');
  const fm = document.getElementById('footerMobile');
  if (fd) fd.style.display = d ? 'grid'  : 'none';
  if (fm) fm.style.display = d ? 'none'  : 'block';
}
footerLayout();
window.addEventListener('resize', footerLayout);

/* ════════════════════════════════════════
   FOOTER ACCORDION
════════════════════════════════════════ */
function toggleAcc(btn) {
  const body = btn.nextElementSibling;
  const was  = body.classList.contains('open');
  document.querySelectorAll('.footer-acc-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.footer-acc-btn').forEach(b  => b.classList.remove('open'));
  if (!was) { body.classList.add('open'); btn.classList.add('open'); }
}
function closeAcc() {
  document.querySelectorAll('.footer-acc-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.footer-acc-btn').forEach(b  => b.classList.remove('open'));
}

/* ════════════════════════════════════════
   LIGHTBOX
════════════════════════════════════════ */
function openLightbox(imgSrc, altText) {
  const img = document.getElementById('lightboxImg');
  const fb  = document.getElementById('lightboxFallback');
  if (!img) return;
  img.src = imgSrc; img.alt = altText || '';
  img.style.display = 'block'; fb.style.display = 'none';
  img.onerror = () => {
    img.style.display = 'none';
    fb.style.display  = 'block';
    fb.textContent    = '🏺';
  };
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  const img = document.getElementById('lightboxImg');
  if (img) img.removeAttribute('src');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ════════════════════════════════════════
   CONTACT FORM — Web3Forms Integration
   Replace YOUR_WEB3FORMS_ACCESS_KEY in index.html with your real key
   Get your free key at: https://web3forms.com
════════════════════════════════════════ */
async function handleSubmit(e) {
  e.preventDefault();

  const btn      = document.getElementById('cf-submit');
  const feedback = document.getElementById('cf-feedback');
  const form     = document.getElementById('contactForm');

  /* ── client-side validation ── */
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const phone   = document.getElementById('cf-phone').value.trim();
  const message = document.getElementById('cf-message').value.trim();

  if (!name) {
    showFeedback('Please enter your name.', false);
    document.getElementById('cf-name').focus();
    return;
  }
  if (!email && !phone) {
    showFeedback('Please enter your email address or phone number.', false);
    document.getElementById('cf-email').focus();
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFeedback('Please enter a valid email address.', false);
    document.getElementById('cf-email').focus();
    return;
  }
  if (!message) {
    showFeedback('Please describe your desired piece.', false);
    document.getElementById('cf-message').focus();
    return;
  }

  /* ── loading state — disable button, show spinner text ── */
  btn.disabled    = true;
  btn.textContent = 'Sending…';
  btn.style.opacity = '0.7';
  hideFeedback();

  try {
    const formData = new FormData(form);

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body:   formData,
      headers: { 'Accept': 'application/json' }
    });

    const result = await response.json();

    if (response.ok && result.success) {
      /* ── success ── */
      showFeedback('✓  Your enquiry has been sent! We will get back to you within 24 hours.', true);
      form.reset();
    } else {
      /* ── server-side error ── */
      showFeedback(
        result.message || 'Something went wrong. Please try again or WhatsApp us directly.',
        false
      );
    }
  } catch (err) {
    /* ── network error ── */
    showFeedback(
      'Unable to send your message. Please check your connection and try again.',
      false
    );
  } finally {
    /* ── always restore button ── */
    btn.disabled    = false;
    btn.textContent = 'Send Enquiry';
    btn.style.opacity = '';
  }
}

/* helpers — only style the feedback div, touch nothing else */
function showFeedback(msg, success) {
  const el = document.getElementById('cf-feedback');
  if (!el) return;
  el.textContent    = msg;
  el.style.display  = 'block';
  el.style.color    = success ? '#C9A84C' : '#e07070';
  el.style.borderColor = success ? 'rgba(201,168,76,.4)' : 'rgba(224,112,112,.4)';
  el.style.background  = success ? 'rgba(201,168,76,.06)' : 'rgba(224,112,112,.06)';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function hideFeedback() {
  const el = document.getElementById('cf-feedback');
  if (el) el.style.display = 'none';
}

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildHomeCatFilters();    // category chips: All, Rings, Necklaces ...
  renderHomeCollections();  // 6 items for active category
  renderHomeGallery();      // 6 featured gallery photos
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
});