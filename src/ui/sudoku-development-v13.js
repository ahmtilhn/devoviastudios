const sudokuProduct = {
  name: 'Sudoku Duel',
  slug: 'sudoku-duel',
  category: 'Puzzle game',
  theme: '#7C6CFF',
  icon: '/products/sudoku-duel/icon.svg',
  screenshots: [
    '/products/sudoku-duel/preview-1.svg',
    '/products/sudoku-duel/preview-2.svg',
    '/products/sudoku-duel/preview-3.svg',
  ],
  privacy: '/privacy/sudoku-duel',
  terms: '/privacy/sudoku-duel-terms.html',
  deletion: '/privacy/sudoku-duel-delete-account.html',
  appAds: '/apps/app-5/app-ads.txt',
};

const sudokuPaths = new Set(['/products/sudoku-duel', '/projects/sudoku-duel']);
const styleId = 'sudoku-development-v13-styles';

function currentPath() {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

function injectStyles() {
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .sudoku-status-badge{display:inline-flex;align-items:center;gap:.48rem;width:max-content;max-width:100%;padding:.45rem .78rem;border:1px solid rgba(124,108,255,.26);border-radius:999px;background:rgba(124,108,255,.08);color:#5f55cf;font:800 .72rem/1 Sora,system-ui,sans-serif;letter-spacing:.055em;text-transform:uppercase}
    .sudoku-status-badge::before{content:'';flex:0 0 auto;width:.46rem;height:.46rem;border-radius:50%;background:#7c6cff;box-shadow:0 0 0 .2rem rgba(124,108,255,.12)}
    .sudoku-preview-label{display:inline-flex;margin-bottom:.7rem;color:#665bd9;font:800 .7rem/1 Sora,system-ui,sans-serif;letter-spacing:.075em;text-transform:uppercase}
    .sudoku-static-button{cursor:default;user-select:none}
    .sudoku-detail-notice{margin-top:1.15rem;padding:1rem 1.05rem;border:1px solid rgba(124,108,255,.18);border-radius:18px;background:rgba(124,108,255,.055);color:#53607e;line-height:1.65}
    .sudoku-detail-notice strong{color:#17213e}
    .sudoku-legal-stack{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:1rem}
    .sudoku-legal-stack a{display:inline-flex;align-items:center;min-height:38px;padding:.55rem .76rem;border:1px solid rgba(100,116,139,.18);border-radius:999px;background:#fff;color:#374151;font-size:.8rem;font-weight:750;text-decoration:none}
    .sudoku-home-status{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0 1.15rem}
    .sudoku-home-status span{padding:.48rem .68rem;border:1px solid rgba(124,108,255,.16);border-radius:999px;background:rgba(124,108,255,.055);color:#53607e;font-size:.76rem;font-weight:700}
    .sudoku-support-status{display:inline-flex;margin:.1rem 0 .5rem;color:#665bd9;font-size:.7rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
    .sudoku-update-card .dv-update-line{background:linear-gradient(90deg,#5de4ff,#7c6cff,#d98bff)}

    .dv-product[data-sudoku-development]{overflow:hidden;min-width:0}
    .dv-product[data-sudoku-development] .dv-product-visual,
    .dv-product[data-sudoku-development] .dv-product-copy{min-width:0;width:100%}
    .dv-product[data-sudoku-development] .dv-product-copy{justify-self:start;max-width:560px}
    .dv-product[data-sudoku-development] .dv-product-heading{align-items:center}
    .dv-product[data-sudoku-development] .dv-product-heading>div{min-width:0}
    .dv-product[data-sudoku-development] .dv-product-actions{display:flex;flex-wrap:wrap;align-items:center;gap:.7rem}
    .dv-product[data-sudoku-development] .dv-phone img,
    .sudoku-development-detail .device img{width:100%;height:100%;object-fit:cover;object-position:top}

    .products-grid [data-sudoku-product-card]{display:flex;min-width:0;height:100%;flex-direction:column;align-self:stretch}
    .products-grid [data-sudoku-product-card] .product-card-top{align-items:center}
    .products-grid [data-sudoku-product-card] .product-card-top>div{min-width:0}
    .products-grid [data-sudoku-product-card] .product-visual{display:grid;width:100%;min-height:260px;place-items:center;overflow:hidden}
    .products-grid [data-sudoku-product-card] .product-visual img{display:block;width:100%;height:100%;max-height:420px;object-fit:cover;object-position:top}
    .products-grid [data-sudoku-product-card] .card-actions{margin-top:auto;display:flex;flex-wrap:wrap;gap:.55rem}
    .products-grid [data-sudoku-product-card] .metric-row{grid-template-columns:repeat(3,minmax(0,1fr))}
    .products-grid [data-sudoku-product-card] .metric-row span{min-width:0}
    .products-grid [data-sudoku-product-card] .metric-row strong{font-size:.88rem;overflow-wrap:anywhere}

    .sudoku-development-detail{align-items:start}
    .sudoku-development-detail>div{min-width:0}
    .sudoku-development-detail .detail-device-row{min-width:0;align-items:flex-start;justify-content:center}
    .sudoku-development-detail .detail-device-row .device{min-width:0}
    .sudoku-preview-gallery{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px!important;align-items:start}
    .sudoku-preview-gallery img{display:block;width:100%;aspect-ratio:9/16;object-fit:cover;object-position:top;border-radius:18px}
    [data-sudoku-support-card]{min-width:0}
    [data-sudoku-support-card] a{overflow-wrap:anywhere}

    @media(max-width:900px){
      .dv-product[data-sudoku-development]{grid-template-columns:1fr!important;min-height:auto!important;gap:28px!important;padding:28px!important}
      .dv-product[data-sudoku-development] .dv-product-visual{order:0!important;min-height:390px!important}
      .dv-product[data-sudoku-development] .dv-product-copy{order:1!important;max-width:none}
      .sudoku-development-detail .detail-device-row{overflow-x:auto;justify-content:flex-start;scroll-snap-type:x proximity;padding-bottom:8px}
      .sudoku-development-detail .detail-device-row .device{flex:0 0 min(72vw,300px);scroll-snap-align:center}
      .sudoku-preview-gallery{grid-template-columns:repeat(3,minmax(180px,1fr));overflow-x:auto;padding-bottom:8px;scroll-snap-type:x proximity}
      .sudoku-preview-gallery img{scroll-snap-align:center}
    }

    @media(max-width:620px){
      .dv-product[data-sudoku-development]{padding:22px!important;border-radius:24px!important}
      .dv-product[data-sudoku-development] .dv-product-visual{min-height:330px!important}
      .products-grid [data-sudoku-product-card] .metric-row{grid-template-columns:1fr}
      .products-grid [data-sudoku-product-card] .product-visual{min-height:220px}
      .sudoku-legal-stack{gap:.4rem}
    }
  `;
  document.head.appendChild(style);
}

function setSudokuMetadata() {
  if (!sudokuPaths.has(currentPath())) return;
  const descriptionText = 'Sudoku Duel is a Flutter Sudoku game in active development with career progression, ranked online duels, achievements, friends, virtual rewards and cross-platform release foundations.';
  document.title = 'Sudoku Duel — In Development | Devovia Studio';

  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement('meta');
    description.name = 'description';
    document.head.appendChild(description);
  }
  description.content = descriptionText;

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogTitle) ogTitle.content = 'Sudoku Duel — In Development | Devovia Studio';
  if (ogDescription) ogDescription.content = descriptionText;
  if (ogImage) ogImage.content = sudokuProduct.icon;
}

function deviceMarkup(src, className = '') {
  return `<figure class="device ${className}" style="--theme:${sudokuProduct.theme}"><div class="device-speaker"></div><img src="${src}" alt="Sudoku Duel development preview" loading="lazy" decoding="async" /></figure>`;
}

function renderSudokuDetail() {
  if (!sudokuPaths.has(currentPath())) return;
  const main = document.querySelector('main#top');
  if (!main || main.dataset.sudokuDevelopmentDetail === 'true') return;

  main.dataset.sudokuDevelopmentDetail = 'true';
  main.innerHTML = `
    <section class="product-hero-detail sudoku-development-detail" style="--theme:${sudokuProduct.theme}">
      <div>
        <p class="eyebrow">Game preview / Puzzle · In development</p>
        <div class="product-title-row"><img src="${sudokuProduct.icon}" alt="Sudoku Duel icon" /><h1>Sudoku Duel</h1></div>
        <p class="hero-lead">Career progression meets competitive Sudoku.</p>
        <p>Sudoku Duel is being built as a full game system rather than a single puzzle screen: structured career progression, ranked online matches, friends and challenges, achievements, virtual rewards and a store-ready Android/iOS foundation.</p>
        <div class="sudoku-detail-notice"><strong>Development status:</strong> the game is actively being developed and tested. These are development previews and no public-store metrics are being claimed before launch.</div>
        <div class="actions"><span class="button primary sudoku-static-button">● In active development</span><a class="button secondary" href="${sudokuProduct.privacy}">Privacy & data use →</a></div>
        <div class="meta-chip-row"><span>Puzzle / Strategy</span><span>Career + Online Duel</span><span>Android + iOS planned</span><span>Flutter + Firebase</span><span>Updated Aug 2026</span></div>
      </div>
      <div class="detail-device-row">${sudokuProduct.screenshots.map((shot, index) => deviceMarkup(shot, `detail-device-${index + 1}`)).join('')}</div>
    </section>

    <section class="detail-grid">
      <article class="glass-panel"><span class="sudoku-preview-label">Core game</span><h2>Sudoku that grows into a career</h2><p>Classic Sudoku rules form the base, while career goals, difficulty progression, achievements and ranks give each completed board a longer-term purpose.</p></article>
      <article class="glass-panel wide"><span class="sudoku-preview-label">Connected systems</span><h2>Career, competition and progression</h2><div class="capability-grid"><span>Career Sudoku progression</span><span>Ranked online duels</span><span>Friends, challenges & recent opponents</span><span>Achievements, ranks & rewards</span><span>Virtual Coin economy</span><span>Firebase-backed accounts</span><span>Push notifications</span><span>Store purchase verification</span></div></article>
      <article class="glass-panel"><span class="sudoku-preview-label">Status</span><h2>Pre-release, not a fake store listing</h2><p>No fabricated install count, rating or review score is shown. Store badges will replace this state only when the public listings are actually ready.</p></article>
    </section>

    <section class="workflow-section">
      <article class="glass-panel gallery-panel"><span class="sudoku-preview-label">Development previews</span><h2>Career, competition and progression</h2><div class="gallery-row sudoku-preview-gallery">${sudokuProduct.screenshots.map((shot, index) => `<img src="${shot}" alt="Sudoku Duel ${['career','online duel','progression'][index]} preview" loading="lazy" decoding="async" />`).join('')}</div></article>
      <article class="glass-panel"><span class="sudoku-preview-label">Technical foundation</span><h2>Flutter / Firebase / Online services</h2><div class="chip-row large"><span>Flutter</span><span>Firebase Auth</span><span>Firebase App Check</span><span>Cloud Messaging</span><span>Crashlytics</span><span>Analytics controls</span><span>Google Mobile Ads</span><span>In-app purchases</span><span>Server-verified rewards</span></div></article>
    </section>

    <section class="detail-footer-grid">
      <article class="glass-panel"><span class="sudoku-preview-label">Development notes</span><h2>What is being prepared</h2><ul><li>Career-mode progression and achievement flows.</li><li>Online matchmaking, rating, friends and challenge systems.</li><li>Virtual Coin ledger, rewarded-ad verification and store purchase validation.</li><li>Android/iOS release, privacy, consent and account-management readiness.</li></ul><a class="text-link" href="/updates">Follow studio updates →</a></article>
      <article class="glass-panel"><span class="sudoku-preview-label">Support</span><h2>Questions about Sudoku Duel?</h2><p>Use Devovia support for development, account, privacy or future release questions.</p><a class="button primary" href="/support">Contact support →</a></article>
      <article class="glass-panel"><span class="sudoku-preview-label">Privacy & account controls</span><h2>Pre-release legal surface is already public.</h2><p>The policy documents reflect the current architecture and identify items that still require a final production review before launch.</p><div class="sudoku-legal-stack"><a href="${sudokuProduct.privacy}">Privacy Policy</a><a href="${sudokuProduct.terms}">Terms of Service</a><a href="${sudokuProduct.deletion}">Delete account</a><a href="${sudokuProduct.appAds}">app-ads.txt mirror</a></div></article>
    </section>

    <section class="final-cta"><div><p class="eyebrow">Sudoku Duel · Development</p><h2>Built as a competitive Sudoku product, not just a board.</h2><p>Career, online competition, account systems and store readiness are being developed as one connected experience.</p></div><a class="button primary" href="/support">Ask about the game →</a></section>
  `;
  setSudokuMetadata();
}

function homeProductMarkup() {
  const phones = sudokuProduct.screenshots.map((shot, index) => `<div class="dv-phone phone-${index + 1}"><div class="dv-phone-speaker"></div><img src="${shot}" alt="Sudoku Duel development preview ${index + 1}" loading="lazy" decoding="async" width="1080" height="1920" /><span class="dv-phone-glass" aria-hidden="true"></span><span class="dv-phone-button" aria-hidden="true"></span></div>`).join('');
  return `<article class="dv-product" data-sudoku-development style="--theme:${sudokuProduct.theme}">
    <div class="dv-product-visual" style="--product-accent:${sudokuProduct.theme}"><div class="dv-product-stage" aria-hidden="true"></div><div class="dv-product-glow" aria-hidden="true"></div>${phones}<img class="dv-floating-icon" src="${sudokuProduct.icon}" alt="" loading="lazy" decoding="async" width="512" height="512" /></div>
    <div class="dv-product-copy"><div class="sudoku-status-badge">In development</div><div class="dv-product-heading"><img src="${sudokuProduct.icon}" alt="Sudoku Duel icon" loading="lazy" decoding="async" width="512" height="512" /><div><span>Puzzle · Strategy</span><h3>Sudoku Duel</h3></div></div><p class="dv-product-tagline">Career progression meets ranked head-to-head Sudoku.</p><p>A Flutter Sudoku game being built around career goals, online duels, ranks, achievements, friends, challenges and verified virtual rewards.</p><div class="sudoku-home-status"><span>Career mode</span><span>Online duel</span><span>Android + iOS planned</span></div><div class="dv-product-actions"><a class="dv-button dv-button-primary" href="/products/sudoku-duel">See development preview →</a><a class="dv-button dv-button-ghost" href="${sudokuProduct.privacy}">Privacy</a></div></div>
  </article>`;
}

function injectHome() {
  if (currentPath() !== '/') return;
  const list = document.querySelector('.dv-product-list');
  if (list && !list.querySelector('[data-sudoku-development]')) list.insertAdjacentHTML('beforeend', homeProductMarkup());

  const eyebrow = document.querySelector('.dv-products-head .dv-eyebrow');
  if (eyebrow && eyebrow.textContent.includes('Products in the wild')) eyebrow.innerHTML = '<span></span> Products & works in progress';

  const updateGrid = document.querySelector('.dv-update-grid');
  if (updateGrid && !updateGrid.querySelector('[data-sudoku-update]')) {
    updateGrid.insertAdjacentHTML('afterbegin', `<a class="dv-update-card sudoku-update-card" data-sudoku-update href="/products/sudoku-duel" style="--update-accent:${sudokuProduct.theme}"><div class="dv-update-line"></div><div class="dv-update-meta"><span>Sudoku Duel</span><time>Aug 19, 2026</time></div><h3>Sudoku Duel is in active development</h3><p>Career progression, ranked online duels, account systems, virtual rewards and release foundations are being built together.</p><span class="dv-update-action">See the development preview →</span></a>`);
  }
}

function productsCardMarkup() {
  return `<article class="product-card" data-sudoku-product-card style="--theme:${sudokuProduct.theme}"><div class="product-card-top"><img src="${sudokuProduct.icon}" alt="" /><div><span>Puzzle · In development</span><h3>Sudoku Duel</h3></div></div><p>Career Sudoku, ranked online duels, friends, achievements and virtual rewards built as one competitive puzzle system.</p><div class="metric-row compact" aria-label="Sudoku Duel development status"><span><strong>Building</strong>Status</span><span><strong>Career + Duel</strong>Modes</span><span><strong>Android + iOS</strong>Planned</span></div><div class="product-visual"><img src="${sudokuProduct.screenshots[1]}" alt="Sudoku Duel online duel development preview" loading="lazy" decoding="async" /></div><div class="chip-row"><span>Career progression</span><span>Online competition</span><span>Achievements & ranks</span></div><div class="card-actions"><a href="/products/sudoku-duel" class="button ghost">View development preview →</a><a href="${sudokuProduct.privacy}" class="button ghost">Privacy</a></div></article>`;
}

function injectProducts() {
  if (!['/products', '/projects'].includes(currentPath())) return;
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  const active = document.querySelector('.filter-row button.active')?.textContent.trim() || 'All';
  const shouldShow = active === 'All' || active === 'Games';
  let card = grid.querySelector('[data-sudoku-product-card]');
  if (shouldShow && !card) {
    grid.insertAdjacentHTML('beforeend', productsCardMarkup());
    card = grid.querySelector('[data-sudoku-product-card]');
  }
  if (card) card.hidden = !shouldShow;

  const pageCopy = document.querySelector('.page-hero > div > p:last-child');
  if (pageCopy && pageCopy.textContent.includes('published apps and launch-ready')) pageCopy.textContent = "Explore Devovia's published apps and products in active development across productivity, games, habits and spiritual utilities.";
}

function injectSupport() {
  if (currentPath() !== '/support') return;
  const grid = document.querySelector('.support-app-grid');
  if (grid && !grid.querySelector('[data-sudoku-support-card]')) {
    grid.insertAdjacentHTML('beforeend', `<article class="support-app-card" data-sudoku-support-card><img src="${sudokuProduct.icon}" alt="" /><span class="sudoku-support-status">In development</span><h3>Sudoku Duel</h3><p>Puzzle / Online competition</p><a href="${sudokuProduct.privacy}">Privacy policy</a><a href="${sudokuProduct.terms}">Terms of Service</a><a href="${sudokuProduct.deletion}">Account deletion</a><a href="/products/sudoku-duel">Product preview</a></article>`);
  }
  const privacyChips = document.querySelector('.quick-privacy .chip-row');
  if (privacyChips && !privacyChips.querySelector('[data-sudoku-privacy-chip]')) privacyChips.insertAdjacentHTML('beforeend', `<a href="${sudokuProduct.privacy}" data-sudoku-privacy-chip><img src="${sudokuProduct.icon}" alt="" />Sudoku Duel</a>`);
}

function sudokuTimelineMarkup() {
  return `<article class="update-card" data-sudoku-timeline><img src="${sudokuProduct.icon}" alt="" /><div><time>August 19, 2026</time><h3>Sudoku Duel development page and privacy surface added</h3><p>Career, online-duel, account, economy and release foundations are represented as an in-development Devovia product without fabricated store metrics.</p><a href="/products/sudoku-duel" class="text-link">Open product preview →</a></div></article>`;
}

function sudokuStoryMarkup() {
  return `<article class="story-card" data-sudoku-story style="--theme:${sudokuProduct.theme}"><img src="${sudokuProduct.icon}" alt="" /><span class="sudoku-status-badge">In development</span><h3>Sudoku Duel</h3><div class="metric-row compact"><span><strong>Career + Duel</strong>Core modes</span><span><strong>Flutter</strong>Client</span><span><strong>Firebase</strong>Online foundation</span></div><time>Aug 2026</time><ul><li>Career progression and achievement systems.</li><li>Ranked online matchmaking, friends and challenges.</li><li>Verified virtual rewards, purchases and privacy/consent flows.</li></ul><a href="/products/sudoku-duel" class="text-link">Read development notes →</a></article>`;
}

function updateSudokuUpdateVisibility() {
  const active = document.querySelector('.filter-row button.active')?.textContent.trim() || 'All';
  const visible = active === 'All' || active === 'Sudoku Duel';
  document.querySelectorAll('[data-sudoku-timeline],[data-sudoku-story]').forEach((node) => { node.hidden = !visible; });

  if (active === 'Sudoku Duel') {
    document.querySelectorAll('.timeline-list > .update-card:not([data-sudoku-timeline]), .story-grid > :not([data-sudoku-story])').forEach((node) => {
      node.dataset.sudokuFilterHidden = 'true';
      node.hidden = true;
    });
  } else {
    document.querySelectorAll('[data-sudoku-filter-hidden="true"]').forEach((node) => {
      delete node.dataset.sudokuFilterHidden;
      node.hidden = false;
    });
  }
}

function injectUpdates() {
  if (currentPath() !== '/updates') return;
  const timeline = document.querySelector('.timeline-list');
  const story = document.querySelector('.story-grid');
  if (timeline && !timeline.querySelector('[data-sudoku-timeline]')) timeline.insertAdjacentHTML('afterbegin', sudokuTimelineMarkup());
  if (story && !story.querySelector('[data-sudoku-story]')) story.insertAdjacentHTML('afterbegin', sudokuStoryMarkup());

  const filterRow = document.querySelector('.filter-row');
  if (filterRow && !filterRow.querySelector('[data-sudoku-filter]')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.sudokuFilter = 'true';
    button.textContent = 'Sudoku Duel';
    button.addEventListener('click', () => {
      filterRow.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      updateSudokuUpdateVisibility();
    });
    filterRow.appendChild(button);
  }
  updateSudokuUpdateVisibility();
}

function injectFooter() {
  if (currentPath() === '/') return;
  const productColumn = document.querySelector('.site-footer > div:nth-child(2)');
  if (!productColumn || productColumn.querySelector('[data-sudoku-footer]')) return;
  const link = document.createElement('a');
  link.href = '/products/sudoku-duel';
  link.dataset.sudokuFooter = 'true';
  link.textContent = 'Sudoku Duel · In development';
  productColumn.appendChild(link);
}

function applySudokuDevelopmentSurfaces() {
  injectStyles();
  renderSudokuDetail();
  injectHome();
  injectProducts();
  injectSupport();
  injectUpdates();
  injectFooter();
  setSudokuMetadata();
}

let animationFrame = 0;
let settleTimer = 0;
let lateTimer = 0;

function schedule() {
  if (!animationFrame) {
    animationFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animationFrame = 0;
        applySudokuDevelopmentSurfaces();
      });
    });
  }

  clearTimeout(settleTimer);
  clearTimeout(lateTimer);
  settleTimer = window.setTimeout(applySudokuDevelopmentSurfaces, 140);
  lateTimer = window.setTimeout(applySudokuDevelopmentSurfaces, 420);
}

function wrapHistoryMethod(method) {
  const original = history[method];
  if (!original || original.__sudokuWrapped) return;
  const wrapped = function (...args) {
    const result = original.apply(this, args);
    schedule();
    return result;
  };
  wrapped.__sudokuWrapped = true;
  history[method] = wrapped;
}

wrapHistoryMethod('pushState');
wrapHistoryMethod('replaceState');
window.addEventListener('popstate', schedule);
window.addEventListener('pageshow', schedule);
document.addEventListener('click', (event) => {
  if (event.target.closest?.('.filter-row button')) window.setTimeout(schedule, 0);
}, { passive: true });

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
else schedule();
