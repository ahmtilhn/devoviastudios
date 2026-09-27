const sudokuProduct = {
  name: 'Sudoku Duel',
  slug: 'sudoku-duel',
  category: 'Puzzle game',
  theme: '#7C6CFF',
  icon: '/products/sudoku-duel/icon.png',
  screenshots: [
    'https://raw.githubusercontent.com/ahmtilhn/sudoku_game/main/assets/images/ui/home_career.png',
    'https://raw.githubusercontent.com/ahmtilhn/sudoku_game/main/assets/images/ui/home_online_duel.png',
    'https://raw.githubusercontent.com/ahmtilhn/sudoku_game/main/assets/images/ui/home_profile.png',
  ],
  privacy: '/privacy/sudoku-duel',
  terms: '/privacy/sudoku-duel-terms.html',
  deletion: '/privacy/sudoku-duel-delete-account.html',
  appAds: '/apps/app-5/app-ads.txt',
  playUrl: 'https://play.google.com/store/apps/details?id=com.devoviastudio.sudoku',
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
    .sudoku-preview-gallery img{display:block;width:100%;aspect-ratio:9/16;object-fit:contain;object-position:center;border-radius:18px;background:#081321}
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
  const descriptionText = 'Sudoku Duel is available on Google Play for Android with career progression, 9×9 and 16×16 Sudoku, ranked online duels, achievements, friends and virtual rewards. The iOS release is coming soon.';
  document.title = 'Sudoku Duel — Available on Google Play | Devovia Studio';

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
  if (ogTitle) ogTitle.content = 'Sudoku Duel — Available on Google Play | Devovia Studio';
  if (ogDescription) ogDescription.content = descriptionText;
  if (ogImage) ogImage.content = sudokuProduct.icon;
}

function deviceMarkup(src, className = '') {
  return `<figure class="device ${className}" style="--theme:${sudokuProduct.theme}"><div class="device-speaker"></div><img src="${src}" alt="Sudoku Duel app artwork" loading="lazy" decoding="async" /></figure>`;
}

function renderSudokuDetail() {
  if (!sudokuPaths.has(currentPath())) return;
  const main = document.querySelector('main#top');
  if (!main || main.dataset.sudokuDevelopmentDetail === 'true') return;

  main.dataset.sudokuDevelopmentDetail = 'true';
  main.innerHTML = `
    <section class="product-hero-detail sudoku-development-detail" style="--theme:${sudokuProduct.theme}">
      <div>
        <p class="eyebrow">Game / Puzzle · Live on Google Play</p>
        <div class="product-title-row"><img src="${sudokuProduct.icon}" alt="Sudoku Duel icon" /><h1>Sudoku Duel</h1></div>
        <p class="hero-lead">Career progression meets competitive Sudoku.</p>
        <p>Sudoku Duel brings classic Sudoku into a connected competitive game: 9×9 and 16×16 boards, career progression, ranked online matches, friends and challenges, achievements, virtual rewards and daily play.</p>
        <div class="sudoku-detail-notice"><strong>Release status:</strong> Sudoku Duel is available now on Google Play for Android. The iOS version is being prepared and will be linked here when it is publicly available.</div>
        <div class="actions"><a class="button primary" href="${sudokuProduct.playUrl}" target="_blank" rel="noreferrer">Get it on Google Play →</a><a class="button secondary" href="${sudokuProduct.privacy}">Privacy & data use →</a></div>
        <div class="meta-chip-row"><span>Puzzle / Strategy</span><span>9×9 + 16×16</span><span>Career + Online Duel</span><span>Android · Google Play live</span><span>iOS coming soon</span><span>Updated Sep 2026</span></div>
      </div>
      <div class="detail-device-row">${sudokuProduct.screenshots.map((shot, index) => deviceMarkup(shot, `detail-device-${index + 1}`)).join('')}</div>
    </section>

    <section class="detail-grid">
      <article class="glass-panel"><span class="sudoku-preview-label">Core game</span><h2>Sudoku that grows into a career</h2><p>Classic Sudoku rules form the base, while career goals, difficulty progression, achievements and ranks give each completed board a longer-term purpose.</p></article>
      <article class="glass-panel wide"><span class="sudoku-preview-label">Connected systems</span><h2>Career, competition and progression</h2><div class="capability-grid"><span>Career Sudoku progression</span><span>Ranked online duels</span><span>Friends, challenges & recent opponents</span><span>Achievements, ranks & rewards</span><span>Virtual Coin economy</span><span>Firebase-backed accounts</span><span>Push notifications</span><span>Store purchase verification</span></div></article>
      <article class="glass-panel"><span class="sudoku-preview-label">Release status</span><h2>Available now on Android</h2><p>The Google Play release is live. iOS is the next store release and remains marked as coming soon until its public App Store listing is available.</p></article>
    </section>

    <section class="workflow-section">
      <article class="glass-panel gallery-panel"><span class="sudoku-preview-label">Real app artwork</span><h2>Career, competition and progression</h2><div class="gallery-row sudoku-preview-gallery">${sudokuProduct.screenshots.map((shot, index) => `<img src="${shot}" alt="Sudoku Duel ${['career','online duel','progression'][index]} preview" loading="lazy" decoding="async" />`).join('')}</div></article>
      <article class="glass-panel"><span class="sudoku-preview-label">Technical foundation</span><h2>Flutter / Firebase / Online services</h2><div class="chip-row large"><span>Flutter</span><span>Firebase Auth</span><span>Firebase App Check</span><span>Cloud Messaging</span><span>Crashlytics</span><span>Analytics controls</span><span>Google Mobile Ads</span><span>In-app purchases</span><span>Server-verified rewards</span></div></article>
    </section>

    <section class="detail-footer-grid">
      <article class="glass-panel"><span class="sudoku-preview-label">Available gameplay</span><h2>What players can do</h2><ul><li>Play classic 9×9 Sudoku and the larger 16×16 Fantasy mode.</li><li>Build career progress, achievements and competitive rank.</li><li>Enter online duels, challenge friends and revisit recent opponents.</li><li>Use daily rewards, Coins and optional store/reward systems.</li></ul><a class="text-link" href="${sudokuProduct.playUrl}" target="_blank" rel="noreferrer">Open Google Play →</a></article>
      <article class="glass-panel"><span class="sudoku-preview-label">Support</span><h2>Questions about Sudoku Duel?</h2><p>Use Devovia support for Android release, account, privacy, gameplay or upcoming iOS release questions.</p><a class="button primary" href="/support">Contact support →</a></article>
      <article class="glass-panel"><span class="sudoku-preview-label">Privacy & account controls</span><h2>Release policies and account controls are public.</h2><p>The privacy, terms and account-deletion pages cover the released Android service. iOS-specific configuration will be reviewed again before the iOS launch.</p><div class="sudoku-legal-stack"><a href="${sudokuProduct.privacy}">Privacy Policy</a><a href="${sudokuProduct.terms}">Terms of Service</a><a href="${sudokuProduct.deletion}">Delete account</a><a href="${sudokuProduct.appAds}">app-ads.txt mirror</a></div></article>
    </section>

    <section class="final-cta"><div><p class="eyebrow">Sudoku Duel · Google Play</p><h2>Competitive Sudoku is now available on Android.</h2><p>Play career and online competition on Google Play today. The iOS release is coming soon.</p></div><a class="button primary" href="${sudokuProduct.playUrl}" target="_blank" rel="noreferrer">Open Google Play →</a></section>
  `;
  setSudokuMetadata();
}

function homeProductMarkup() {
  const phones = sudokuProduct.screenshots.map((shot, index) => `<div class="dv-phone phone-${index + 1}"><div class="dv-phone-speaker"></div><img src="${shot}" alt="Sudoku Duel app artwork ${index + 1}" loading="lazy" decoding="async" width="1080" height="1920" /><span class="dv-phone-glass" aria-hidden="true"></span><span class="dv-phone-button" aria-hidden="true"></span></div>`).join('');
  return `<article class="dv-product" data-sudoku-development style="--theme:${sudokuProduct.theme}">
    <div class="dv-product-visual" style="--product-accent:${sudokuProduct.theme}"><div class="dv-product-stage" aria-hidden="true"></div><div class="dv-product-glow" aria-hidden="true"></div>${phones}<img class="dv-floating-icon" src="${sudokuProduct.icon}" alt="" loading="lazy" decoding="async" width="512" height="512" /></div>
    <div class="dv-product-copy"><div class="sudoku-status-badge">Available on Google Play</div><div class="dv-product-heading"><img src="${sudokuProduct.icon}" alt="Sudoku Duel icon" loading="lazy" decoding="async" width="512" height="512" /><div><span>Puzzle · Strategy</span><h3>Sudoku Duel</h3></div></div><p class="dv-product-tagline">Career progression meets ranked head-to-head Sudoku.</p><p>Play 9×9 and 16×16 Sudoku with career goals, online duels, ranks, achievements, friends, challenges and virtual rewards. Android is live now; iOS is coming soon.</p><div class="sudoku-home-status"><span>Career + Daily</span><span>Online duel</span><span>Android live</span><span>iOS coming soon</span></div><div class="dv-product-actions"><a class="dv-button dv-button-primary" href="/products/sudoku-duel">See Sudoku Duel →</a><a class="dv-button dv-button-ghost" href="${sudokuProduct.playUrl}" target="_blank" rel="noreferrer">Google Play</a></div></div>
  </article>`;
}

function injectHome() {
  if (currentPath() !== '/') return;
  const list = document.querySelector('.dv-product-list');
  if (list && !list.querySelector('[data-sudoku-development]')) list.insertAdjacentHTML('beforeend', homeProductMarkup());

  const eyebrow = document.querySelector('.dv-products-head .dv-eyebrow');
  if (eyebrow && eyebrow.textContent.includes('Products in the wild')) eyebrow.innerHTML = '<span></span> Published products';

  const updateGrid = document.querySelector('.dv-update-grid');
  if (updateGrid && !updateGrid.querySelector('[data-sudoku-update]')) {
    updateGrid.insertAdjacentHTML('afterbegin', `<a class="dv-update-card sudoku-update-card" data-sudoku-update href="/products/sudoku-duel" style="--update-accent:${sudokuProduct.theme}"><div class="dv-update-line"></div><div class="dv-update-meta"><span>Sudoku Duel</span><time>Sep 26, 2026</time></div><h3>Sudoku Duel is live on Google Play</h3><p>The Android release is available now with career play, 9×9 and 16×16 Sudoku, online duels and progression systems. iOS is coming soon.</p><span class="dv-update-action">See Sudoku Duel →</span></a>`);
  }
}

function productsCardMarkup() {
  return `<article class="product-card" data-sudoku-product-card style="--theme:${sudokuProduct.theme}"><div class="product-card-top"><img src="${sudokuProduct.icon}" alt="" /><div><span>Puzzle · Google Play</span><h3>Sudoku Duel</h3></div></div><p>Career Sudoku, 9×9 and 16×16 boards, ranked online duels, friends, achievements and virtual rewards in one competitive puzzle game.</p><div class="metric-row compact" aria-label="Sudoku Duel release status"><span><strong>Live</strong>Android</span><span><strong>Coming soon</strong>iOS</span><span><strong>Career + Duel</strong>Modes</span></div><div class="product-visual"><img src="${sudokuProduct.screenshots[1]}" alt="Sudoku Duel online duel product visual" loading="lazy" decoding="async" /></div><div class="chip-row"><span>Career progression</span><span>Online competition</span><span>9×9 + 16×16</span></div><div class="card-actions"><a href="/products/sudoku-duel" class="button ghost">View product →</a><a href="${sudokuProduct.playUrl}" class="button ghost" target="_blank" rel="noreferrer">Google Play</a></div></article>`;
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
  if (pageCopy && pageCopy.textContent.includes('published apps and launch-ready')) pageCopy.textContent = "Explore Devovia's published mobile apps and games across productivity, puzzles, habits and spiritual utilities.";
}

function injectSupport() {
  if (currentPath() !== '/support') return;
  const grid = document.querySelector('.support-app-grid');
  if (grid && !grid.querySelector('[data-sudoku-support-card]')) {
    grid.insertAdjacentHTML('beforeend', `<article class="support-app-card" data-sudoku-support-card><img src="${sudokuProduct.icon}" alt="" /><span class="sudoku-support-status">Google Play live</span><h3>Sudoku Duel</h3><p>Puzzle / Online competition</p><a href="${sudokuProduct.playUrl}" target="_blank" rel="noreferrer">Google Play</a><a href="${sudokuProduct.privacy}">Privacy policy</a><a href="${sudokuProduct.terms}">Terms of Service</a><a href="${sudokuProduct.deletion}">Account deletion</a><a href="/products/sudoku-duel">Product page</a></article>`);
  }
  const privacyChips = document.querySelector('.quick-privacy .chip-row');
  if (privacyChips && !privacyChips.querySelector('[data-sudoku-privacy-chip]')) privacyChips.insertAdjacentHTML('beforeend', `<a href="${sudokuProduct.privacy}" data-sudoku-privacy-chip><img src="${sudokuProduct.icon}" alt="" />Sudoku Duel</a>`);
}

function sudokuTimelineMarkup() {
  return `<article class="update-card" data-sudoku-timeline><img src="${sudokuProduct.icon}" alt="" /><div><time>September 26, 2026</time><h3>Sudoku Duel is live on Google Play</h3><p>The Android release is public with 9×9 and 16×16 Sudoku, career progression, online duels and connected player systems. The iOS release is coming soon.</p><a href="/products/sudoku-duel" class="text-link">Open product page →</a></div></article>`;
}

function sudokuStoryMarkup() {
  return `<article class="story-card" data-sudoku-story style="--theme:${sudokuProduct.theme}"><img src="${sudokuProduct.icon}" alt="" /><span class="sudoku-status-badge">Google Play live</span><h3>Sudoku Duel</h3><div class="metric-row compact"><span><strong>Android</strong>Available now</span><span><strong>iOS</strong>Coming soon</span><span><strong>Career + Duel</strong>Core modes</span></div><time>Sep 2026</time><ul><li>9×9 and 16×16 Sudoku with career progression.</li><li>Ranked online matchmaking, friends and challenges.</li><li>Achievements, Coins, rewards and account systems.</li></ul><a href="${sudokuProduct.playUrl}" class="text-link" target="_blank" rel="noreferrer">Open Google Play →</a></article>`;
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
  link.textContent = 'Sudoku Duel · Google Play';
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
