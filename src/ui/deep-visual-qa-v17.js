import appData from '../../data/apps.json';

const products = appData.apps || [];
const byId = (id) => products.find((product) => product.id === id);

const serviceDetailData = {
  '/services/mobile-app-development': {
    key: 'mobile',
    eyebrow: 'Service / Mobile App Development',
    title: 'Mobile products built around real use, not feature lists.',
    intro: 'We shape the product flow, interface, data model and release path as one system so the application feels coherent from the first screen through store launch and ongoing support.',
    proof: [
      ['Flutter-first delivery', 'One product system across Android and iOS when cross-platform delivery is the right fit.'],
      ['Offline & connected workflows', 'Local-first, backup, sync and notification patterns selected around the actual product need.'],
      ['Release-ready from the start', 'Store assets, support paths, privacy surfaces and update planning are considered before launch.'],
    ],
    capabilities: [
      ['01', 'Product architecture', 'Turn the product problem into a clear screen map, data flow and technical foundation before implementation becomes expensive.'],
      ['02', 'Interface & interaction', 'Build focused user journeys with readable hierarchy, responsive states and interaction patterns that stay consistent as features grow.'],
      ['03', 'Data, device & cloud', 'Choose local storage, Firebase, backup, notifications, media and device integrations according to the workflow instead of forcing one architecture everywhere.'],
      ['04', 'Launch & product care', 'Prepare store-facing assets, privacy/support routes, release notes and the maintenance path needed after the first version ships.'],
    ],
    process: [
      ['Discover', 'Clarify the user, the repeated task and what the first release must prove.'],
      ['Shape', 'Define journeys, technical boundaries and a realistic launch scope.'],
      ['Build', 'Implement the interface and product systems as one maintainable codebase.'],
      ['Release', 'Verify store readiness, support surfaces and the next iteration path.'],
    ],
    productIds: ['app-1', 'app-2', 'app-3'],
  },
  '/services/game-development': {
    key: 'game',
    eyebrow: 'Service / Game Development',
    title: 'Game systems where mechanic, feedback and progression reinforce each other.',
    intro: 'A small game becomes memorable when the core action is readable, the feedback is immediate and progression gives players a reason to return. We design those systems together rather than as separate layers.',
    proof: [
      ['Mechanic before decoration', 'The player should understand what to do, why it matters and what changed after every action.'],
      ['Progression with purpose', 'Levels, rewards, missions and boosters are connected to the core loop instead of sitting beside it.'],
      ['Store-aware delivery', 'Performance, monetization surfaces, privacy and release communication are planned around the shipped game.'],
    ],
    capabilities: [
      ['01', 'Core loop & controls', 'Prototype the repeated player action first, then refine timing, clarity and failure feedback until the loop reads instantly.'],
      ['02', 'Level & difficulty systems', 'Create progression rules that add pressure and variation without hiding the logic behind arbitrary difficulty spikes.'],
      ['03', 'Rewards & retention', 'Connect missions, streaks, coins, stars, boosters or achievements to meaningful play instead of using rewards as noise.'],
      ['04', 'Launch systems', 'Prepare store presentation, rewarded-ad or purchase surfaces where relevant, support routes and release notes for the live product.'],
    ],
    process: [
      ['Prototype', 'Prove the mechanic and input feel with the smallest useful loop.'],
      ['Systemize', 'Add level rules, feedback, progression and reusable content structures.'],
      ['Polish', 'Tune readability, motion, sound/feedback hooks and device performance.'],
      ['Launch', 'Package the store experience and keep the live game maintainable.'],
    ],
    productIds: ['app-4'],
  },
  '/services/web-development': {
    key: 'web',
    eyebrow: 'Service / Product Websites',
    title: 'Product websites that make the product easier to understand and trust.',
    intro: 'The website should explain the product quickly, prove that it exists, answer the practical questions around it and give visitors an obvious next step without burying them in decorative effects.',
    proof: [
      ['Product proof first', 'Real screenshots, release status and concrete capability replace vague agency claims.'],
      ['Responsive by composition', 'Desktop and mobile layouts are designed for their own reading rhythm, not simply squeezed versions of one grid.'],
      ['Support infrastructure included', 'Privacy, support, update and contact routes stay visible so the product feels maintained after the landing page.'],
    ],
    capabilities: [
      ['01', 'Positioning & hierarchy', 'Turn the product into a clear headline, proof structure and action path that visitors can understand in seconds.'],
      ['02', 'Responsive interface', 'Build page compositions that keep type, media and cards balanced from wide desktop screens down to small mobile widths.'],
      ['03', 'Product storytelling', 'Use real interface screens, release evidence and focused editorial sections instead of relying on generic stock visuals.'],
      ['04', 'Operational pages', 'Connect contact, support, privacy, updates and product detail surfaces so the public site works as a complete product system.'],
    ],
    process: [
      ['Structure', 'Map the information visitors need before visual treatment begins.'],
      ['Design', 'Build hierarchy, responsive rhythm and proof-led components.'],
      ['Implement', 'Ship fast, accessible pages with maintainable responsive behavior.'],
      ['Verify', 'Review every route and viewport for clipping, broken actions and weak visual balance.'],
    ],
    productIds: ['app-1', 'app-4'],
  },
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function productHref(product) {
  if (!product) return '/products';
  if (product.id === 'app-1') return '/products/stock-manager';
  return `/products/${product.slug}`;
}

function serviceVisualMarkup(detail) {
  const relevant = detail.productIds.map(byId).filter(Boolean);
  if (detail.key === 'web') {
    return `
      <div class="service-browser-v17" aria-label="Product website system preview">
        <div class="service-browser-bar-v17"><i></i><i></i><i></i><span>devovia / product system</span></div>
        <div class="service-browser-body-v17">
          <div class="service-browser-hero-v17"><small>PRODUCT PROOF</small><strong>Clear value.<br>Real interface.<br>One next step.</strong><span></span></div>
          <div class="service-browser-proof-v17">
            <article><small>01</small><b>Product</b><span>Real screens and capabilities</span></article>
            <article><small>02</small><b>Support</b><span>Reachable help and policies</span></article>
            <article><small>03</small><b>Updates</b><span>Visible release momentum</span></article>
          </div>
        </div>
      </div>`;
  }

  const shots = detail.key === 'game' && relevant[0]
    ? relevant[0].screenshots
    : relevant.map((product) => product.screenshots?.[0]).filter(Boolean);
  return `
    <div class="service-device-stage-v17 service-device-stage-${detail.key}" aria-label="Shipped product interface examples">
      ${shots.slice(0, 3).map((shot, index) => `
        <figure class="service-phone-v17 phone-${index + 1}"><span></span><img src="${escapeHtml(shot)}" alt="Shipped Devovia product interface" loading="lazy" decoding="async"></figure>
      `).join('')}
    </div>`;
}

function serviceProductsMarkup(detail) {
  const relevant = detail.productIds.map(byId).filter(Boolean);
  if (!relevant.length) return '';
  return `
    <section class="service-proof-v17">
      <div class="service-section-heading-v17">
        <div><p class="eyebrow">Proof from shipped work</p><h2>Systems already visible in real products.</h2></div>
        <p>The point is not to decorate a service page with mockups. These screens come from products Devovia has actually built and maintained.</p>
      </div>
      <div class="service-proof-grid-v17 ${relevant.length === 1 ? 'is-single' : ''}">
        ${relevant.map((product) => `
          <article class="service-proof-card-v17" style="--service-product:${escapeHtml(product.theme)}">
            <div class="service-proof-copy-v17">
              <div class="service-proof-title-v17"><img src="${escapeHtml(product.icon_url)}" alt=""><div><small>${escapeHtml(product.category)}</small><h3>${escapeHtml(product.name)}</h3></div></div>
              <p>${escapeHtml(product.short_desc)}</p>
              <div class="service-proof-meta-v17"><span>${escapeHtml(product.downloads_text)} downloads</span><span>${Number(product.rating_text) > 0 ? `${escapeHtml(product.rating_text)}/5` : 'New listing'}</span></div>
              <a href="${productHref(product)}">View product <span>→</span></a>
            </div>
            <div class="service-proof-image-v17"><img src="${escapeHtml(product.screenshots[0])}" alt="${escapeHtml(product.name)} product screen" loading="lazy" decoding="async"></div>
          </article>
        `).join('')}
      </div>
    </section>`;
}

function serviceDetailMarkup(detail) {
  return `
    <div class="service-detail-v17 service-detail-${detail.key}" data-service-detail-content-v17>
      <section class="service-hero-v17">
        <div class="service-hero-copy-v17">
          <p class="eyebrow">${escapeHtml(detail.eyebrow)}</p>
          <h1>${escapeHtml(detail.title)}</h1>
          <p>${escapeHtml(detail.intro)}</p>
          <div class="service-actions-v17"><a class="button primary" href="/contact">Start a project <span>→</span></a><a class="button secondary" href="/products">See shipped products</a></div>
        </div>
        ${serviceVisualMarkup(detail)}
      </section>

      <section class="service-proof-strip-v17">
        ${detail.proof.map(([title, text], index) => `<article><span>0${index + 1}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join('')}
      </section>

      <section class="service-capabilities-v17">
        <div class="service-section-heading-v17">
          <div><p class="eyebrow">What the engagement covers</p><h2>One product system, four connected responsibilities.</h2></div>
          <p>Each area is designed with the others in mind, which avoids the common handoff gaps between strategy, interface work, engineering and release preparation.</p>
        </div>
        <div class="service-capability-grid-v17">
          ${detail.capabilities.map(([num, title, text], index) => `<article class="service-capability-v17 capability-${index + 1}"><span>${num}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join('')}
        </div>
      </section>

      ${serviceProductsMarkup(detail)}

      <section class="service-process-v17">
        <div class="service-process-copy-v17"><p class="eyebrow">Working model</p><h2>A direct path from decision to release.</h2><p>Enough structure to protect quality, without turning a small product into an enterprise process.</p></div>
        <div class="service-process-grid-v17">
          ${detail.process.map(([title, text], index) => `<article><span>0${index + 1}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join('')}
        </div>
      </section>

      <section class="service-cta-v17"><div><p class="eyebrow">Have a product in mind?</p><h2>Bring the problem, context and ambition. We will shape the delivery path.</h2></div><a class="button primary" href="/contact">Start a project <span>→</span></a></section>
    </div>`;
}

function installServiceDetail() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const detail = serviceDetailData[path];
  const shell = document.querySelector('.app-shell');
  const main = shell?.querySelector('main#top');
  if (!shell || !main) return;

  if (!detail) {
    delete shell.dataset.serviceDetailV17;
    main.querySelector('[data-service-detail-content-v17]')?.remove();
    return;
  }

  if (shell.dataset.serviceDetailV17 === detail.key && main.querySelector('[data-service-detail-content-v17]')) return;
  main.querySelector('[data-service-detail-content-v17]')?.remove();
  shell.dataset.serviceDetailV17 = detail.key;
  main.insertAdjacentHTML('beforeend', serviceDetailMarkup(detail));
  document.title = `${detail.eyebrow.replace('Service / ', '')} - Devovia Studio`;
}

function restructureTestSupport() {
  const page = document.querySelector('.test-support-page');
  const main = page?.querySelector('.test-main');
  const request = page?.querySelector(':scope > .request-panel');
  const hero = main?.querySelector(':scope > .page-hero');
  if (!page || !main || !request || !hero || page.dataset.deepQaV17 === 'ready') return;

  const top = document.createElement('div');
  top.className = 'test-support-top-v17';
  main.insertBefore(top, hero);
  top.appendChild(hero);
  top.appendChild(request);
  page.dataset.deepQaV17 = 'ready';
}

function normalizeMetrics(root = document) {
  root.querySelectorAll('.metric-row span, .v7-fact-metrics div').forEach((item) => {
    const strong = item.querySelector('strong');
    if (!strong) return;
    const original = strong.textContent || '';
    const normalized = original
      .replace(/\s+comments?\b/gi, '')
      .replace(/\s+reviews?\b/gi, '')
      .trim();
    if (normalized && normalized !== original) strong.textContent = normalized;
  });
}

function enforceMobileProductHero() {
  if (!window.matchMedia('(max-width: 760px)').matches) return;
  document.querySelectorAll('.app-shell.v7-product-detail-ready .detail-device-row').forEach((row) => {
    const devices = [...row.querySelectorAll('.device')];
    if (!devices.length) return;
    devices.forEach((device, index) => {
      device.style.setProperty('display', index === 0 ? 'block' : 'none', 'important');
    });
    const first = devices[0];
    first.style.setProperty('position', 'absolute', 'important');
    first.style.setProperty('inset', '18px', 'important');
    first.style.setProperty('width', 'calc(100% - 36px)', 'important');
    first.style.setProperty('height', 'calc(100% - 36px)', 'important');
    first.style.setProperty('max-width', 'none', 'important');
    first.style.setProperty('margin', '0', 'important');
    first.style.setProperty('padding', '0', 'important');
    first.style.setProperty('border', '0', 'important');
    first.style.setProperty('background', 'transparent', 'important');
    first.style.setProperty('box-shadow', 'none', 'important');
    first.style.setProperty('transform', 'none', 'important');
    const image = first.querySelector('img');
    if (image) {
      image.style.setProperty('width', '100%', 'important');
      image.style.setProperty('height', '100%', 'important');
      image.style.setProperty('object-fit', 'contain', 'important');
      image.style.setProperty('object-position', 'center', 'important');
    }
    first.querySelector('.device-speaker')?.style.setProperty('display', 'none', 'important');
    first.querySelector('.ux-device-glass')?.style.setProperty('display', 'none', 'important');
  });
}

let scheduled = 0;
function install() {
  scheduled = 0;
  installServiceDetail();
  restructureTestSupport();
  normalizeMetrics();
  enforceMobileProductHero();
}

function schedule() {
  if (!scheduled) scheduled = requestAnimationFrame(install);
}

const observer = new MutationObserver(schedule);
observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
window.addEventListener('popstate', schedule);
window.addEventListener('resize', schedule, { passive: true });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
else schedule();
