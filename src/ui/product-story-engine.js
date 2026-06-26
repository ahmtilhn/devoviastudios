import appData from '../../data/apps.json';

const products = appData.apps;
const routeAliases = {
  'stock-manager': 'app-1',
  'stockflow-inventory': 'app-1',
  'arrow-escape': 'app-4',
  'daily-hadith': 'app-2',
  tinysteps: 'app-3',
};

const experienceCopy = {
  'app-1': {
    eyebrow: 'Inventory intelligence, explained clearly',
    title: 'Every stock action stays visible, fast and under control.',
    intro: 'Stock Manager turns daily inventory work into a connected flow: capture products, understand movement, act on low stock and keep business records available even without a connection.',
    variants: ['scanner', 'timeline', 'dashboard', 'shield'],
    benefits: [
      ['Capture products faster', 'Keep manual entry available', 'Reduce repetitive catalog work'],
      ['See every movement in context', 'Trace sales and incoming stock', 'Spot unusual changes sooner'],
      ['Understand value and low-stock risk', 'Export useful business records', 'Make reorder decisions with confidence'],
      ['Work offline when needed', 'Keep core records on the device', 'Move backups between devices'],
    ],
    labels: ['Camera-assisted capture', 'Chronological stock history', 'Business overview', 'Offline-first data'],
  },
  'app-4': {
    eyebrow: 'A puzzle loop built around memory and momentum',
    title: 'Simple rules become a fast, focused challenge.',
    intro: 'Arrow Escape combines fading information, time pressure and controlled recovery tools to create short puzzle sessions that feel tense without becoming confusing.',
    variants: ['focus', 'timer', 'boost', 'rewards'],
    benefits: [
      ['Read the route before it fades', 'Train short-term visual memory', 'Stay focused on the board'],
      ['React before the timer ends', 'Manage limited mistakes', 'Feel pressure without complex rules'],
      ['Use recovery tools strategically', 'Protect a strong run', 'Learn difficult board patterns'],
      ['Return for daily goals', 'Build streak momentum', 'Earn coins through play'],
    ],
    labels: ['Fading direction memory', 'Timed puzzle pressure', 'Strategic recovery', 'Daily progression'],
  },
  'app-2': {
    eyebrow: 'A calmer spiritual routine in one place',
    title: 'Daily guidance and practical tools without visual noise.',
    intro: 'Daily Hadith brings reading, reminders, direction and reflection tools together in a calm interface designed for short, meaningful moments throughout the day.',
    variants: ['daily', 'prayer', 'compass', 'audio'],
    benefits: [
      ['Open to one focused daily reading', 'Save meaningful content', 'Return without navigating a complex feed'],
      ['Follow daily prayer timing', 'Receive permission-aware reminders', 'Keep the routine visible'],
      ['Find Qibla direction', 'Use smart tasbih feedback', 'Access core utilities together'],
      ['Listen through text-to-speech', 'Create visual quote cards', 'Share content in a useful format'],
    ],
    labels: ['Daily reflection', 'Prayer rhythm', 'Direction and tasbih', 'Listen, save and share'],
  },
  'app-3': {
    eyebrow: 'Habit building with less friction',
    title: 'Plan the routine, complete it quickly and see real consistency.',
    intro: 'TinySteps keeps habit tracking deliberately simple. Flexible schedules, timely reminders, fast widget actions and readable progress make consistency easier to maintain.',
    variants: ['habits', 'reminder', 'widget', 'streak'],
    benefits: [
      ['Create daily or weekly targets', 'Use flexible custom schedules', 'Avoid complicated project-style setup'],
      ['Bring habits back at the right time', 'Keep routines visible', 'Use richer schedules when needed'],
      ['Complete habits from the home screen', 'Reduce taps and navigation', 'Make the action feel immediate'],
      ['Read streaks at a glance', 'Understand completion rate', 'Focus on consistency rather than noise'],
    ],
    labels: ['Flexible targets', 'Timely prompts', 'Widget-first action', 'Readable progress'],
  },
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function currentProduct() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (!['products', 'projects'].includes(parts[0]) || !parts[1]) return null;
  const id = routeAliases[parts[1]];
  return products.find((product) => product.id === id || product.slug === parts[1]);
}

function variantMarkup(variant) {
  const overlays = {
    scanner: '<span class="story-scan-line"></span><span class="story-corner c1"></span><span class="story-corner c2"></span><span class="story-corner c3"></span><span class="story-corner c4"></span>',
    timeline: '<span class="story-route"></span><i class="story-node n1"></i><i class="story-node n2"></i><i class="story-node n3"></i><i class="story-node n4"></i>',
    dashboard: '<span class="story-bars"><i></i><i></i><i></i><i></i></span><span class="story-metric">LIVE</span>',
    shield: '<span class="story-shield">✓</span><span class="story-ring r1"></span><span class="story-ring r2"></span>',
    focus: '<span class="story-arrow a1">→</span><span class="story-arrow a2">↑</span><span class="story-arrow a3">←</span><span class="story-arrow a4">↓</span>',
    timer: '<span class="story-timer"><i></i></span><span class="story-count">12</span>',
    boost: '<span class="story-power p1">VISION</span><span class="story-power p2">FREEZE</span><span class="story-power p3">HINT</span>',
    rewards: '<span class="story-coin c1">★</span><span class="story-coin c2">★</span><span class="story-coin c3">★</span>',
    daily: '<span class="story-sun"></span><span class="story-quote">“</span>',
    prayer: '<span class="story-prayer-arc"></span><i class="story-prayer-dot d1"></i><i class="story-prayer-dot d2"></i><i class="story-prayer-dot d3"></i>',
    compass: '<span class="story-compass"><i></i></span><span class="story-direction">QIBLA</span>',
    audio: '<span class="story-wave"><i></i><i></i><i></i><i></i><i></i><i></i></span>',
    habits: '<span class="story-habit-grid"><i>✓</i><i></i><i>✓</i><i>✓</i><i></i><i>✓</i></span>',
    reminder: '<span class="story-bell">◉</span><span class="story-pulse p1"></span><span class="story-pulse p2"></span>',
    widget: '<span class="story-widget-card"><i>✓</i><b>Morning routine</b></span>',
    streak: '<span class="story-streak"><i></i><i></i><i></i><i></i><i></i></span><span class="story-flame">◆</span>',
  };
  return overlays[variant] || '';
}

function storySection(product, copy) {
  const features = product.feature_details || [];
  const stories = features.map((feature, index) => {
    const screenshot = product.screenshots[index % product.screenshots.length];
    const variant = copy.variants[index] || 'dashboard';
    const benefits = copy.benefits[index] || [];
    const number = String(index + 1).padStart(2, '0');
    return `
      <article class="product-feature-story story-${variant} ${index % 2 ? 'is-reversed' : ''}" style="--story-theme:${escapeHtml(product.theme)}; --story-index:${index}">
        <div class="product-feature-copy">
          <span class="feature-number">${number}</span>
          <p class="feature-label">${escapeHtml(copy.labels[index] || 'Product capability')}</p>
          <h3>${escapeHtml(feature.title)}</h3>
          <p class="feature-description">${escapeHtml(feature.description || '')}</p>
          <ul>${benefits.map((item) => `<li><span>✓</span>${escapeHtml(item)}</li>`).join('')}</ul>
        </div>
        <figure class="product-feature-visual" aria-label="${escapeHtml(feature.title)} visual demonstration">
          <div class="feature-ambient"></div>
          <div class="feature-device-shell">
            <span class="feature-device-speaker"></span>
            <img src="${escapeHtml(screenshot)}" alt="${escapeHtml(product.name)} — ${escapeHtml(feature.title)}" loading="lazy" decoding="async" />
            <span class="feature-device-glass"></span>
          </div>
          <div class="feature-motion-layer" aria-hidden="true">${variantMarkup(variant)}</div>
          <figcaption>${escapeHtml(copy.labels[index] || feature.title)}</figcaption>
        </figure>
      </article>
    `;
  }).join('');

  return `
    <section class="product-story-section" data-product-story="${escapeHtml(product.id)}" style="--story-theme:${escapeHtml(product.theme)}">
      <header class="product-story-intro">
        <p class="eyebrow">${escapeHtml(copy.eyebrow)}</p>
        <h2>${escapeHtml(copy.title)}</h2>
        <p>${escapeHtml(copy.intro)}</p>
      </header>
      <div class="product-story-list">${stories}</div>
      <div class="product-outcome-strip">
        <div><strong>${features.length}</strong><span>Explained feature systems</span></div>
        <div><strong>${product.screenshots.length}</strong><span>Real product screens</span></div>
        <div><strong>Fast</strong><span>Native scroll choreography</span></div>
        <div><strong>Clear</strong><span>User outcomes before technical detail</span></div>
      </div>
    </section>
  `;
}

function installProductStory() {
  const product = currentProduct();
  if (!product || document.querySelector('[data-product-story]')) return;
  const detailGrid = document.querySelector('.product-hero-detail + .detail-grid, .detail-grid');
  if (!detailGrid) return;
  const copy = experienceCopy[product.id];
  if (!copy) return;

  detailGrid.insertAdjacentHTML('afterend', storySection(product, copy));
  document.querySelector('.product-hero-detail')?.classList.add('has-product-story');

  if (!CSS.supports('animation-timeline: view()')) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-story-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.product-feature-story, .product-story-intro, .product-outcome-strip').forEach((element) => observer.observe(element));
  }
}

function installTestSupportExperience() {
  const page = document.querySelector('.test-support-page');
  if (!page || page.dataset.v6Ready === 'true') return;
  page.dataset.v6Ready = 'true';
  const hero = page.querySelector('.page-hero');
  if (hero && !hero.querySelector('.test-support-visual-v6')) {
    hero.insertAdjacentHTML('beforeend', `
      <div class="test-support-visual-v6" aria-label="Google Play release readiness system">
        <div class="release-core"><span>READY</span><strong>Release system</strong><small>Store · Test · Policy · Support</small></div>
        <span class="release-orbit orbit-one"><i>01</i> Test flow</span>
        <span class="release-orbit orbit-two"><i>02</i> Store assets</span>
        <span class="release-orbit orbit-three"><i>03</i> Policy pages</span>
        <span class="release-orbit orbit-four"><i>04</i> Launch review</span>
        <span class="release-ring ring-one"></span><span class="release-ring ring-two"></span>
      </div>
    `);
  }

  const firstSection = page.querySelector('.test-main .compact-section');
  if (firstSection && !page.querySelector('.support-proof-strip-v6')) {
    firstSection.insertAdjacentHTML('beforebegin', `
      <section class="support-proof-strip-v6">
        <article><strong>01</strong><span>Identify the exact blocker</span></article>
        <article><strong>02</strong><span>Build a repeatable test flow</span></article>
        <article><strong>03</strong><span>Align store and policy surfaces</span></article>
        <article><strong>04</strong><span>Submit with a final readiness check</span></article>
      </section>
    `);
  }

  page.querySelectorAll('.problem-grid .glass-panel, .process-grid .glass-panel').forEach((card, index) => {
    card.style.setProperty('--support-card-index', String(index));
  });

  const requestPanel = page.querySelector('.request-panel');
  if (requestPanel && !requestPanel.querySelector('.request-panel-intro-v6')) {
    requestPanel.insertAdjacentHTML('afterbegin', `
      <div class="request-panel-intro-v6">
        <span>Release readiness review</span>
        <h2>Tell us what is blocking your launch.</h2>
        <p>We will route the request into a clear review path instead of sending a generic response.</p>
      </div>
    `);
  }
}

let frame = 0;
function install() {
  frame = 0;
  installProductStory();
  installTestSupportExperience();
}
function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(install);
}

const observer = new MutationObserver(schedule);
observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
else schedule();
window.addEventListener('popstate', schedule);
window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
