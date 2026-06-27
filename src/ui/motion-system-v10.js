const root = document.documentElement;
const reduceQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia?.('(hover: hover) and (pointer: fine)');
const transitionStoreKey = 'devovia-motion-v10-transition';
const sharedTitleStoreKey = 'devovia-motion-v10-shared-title';
const seen = new WeakSet();
const surfaces = new WeakSet();
const regions = new WeakSet();
let revealObserver;
let mutationObserver;
let frame = 0;
let scrollFrame = 0;
let filterFrame = 0;
let lastPath = normalizedPath();
let lastScrollY = window.scrollY;
let scrollVelocity = 0;
let beforeFilter = null;
let activeRegion = null;
let sharedCleanup = 0;
let started = false;

const palettes = {
  home: [[59, 130, 246], [139, 92, 246]],
  catalog: [[59, 130, 246], [14, 165, 233]],
  product: [[124, 58, 237], [59, 130, 246]],
  services: [[14, 165, 233], [34, 211, 238]],
  service: [[14, 165, 233], [99, 102, 241]],
  updates: [[14, 165, 233], [16, 185, 129]],
  blog: [[99, 102, 241], [139, 92, 246]],
  article: [[99, 102, 241], [236, 72, 153]],
  support: [[16, 185, 129], [14, 165, 233]],
  contact: [[124, 58, 237], [236, 72, 153]],
  generic: [[59, 130, 246], [139, 92, 246]],
};

const revealRules = [
  ['.dv-hero-copy .dv-eyebrow, .page-hero > div > .eyebrow, .product-hero-detail > div > .eyebrow, .test-support-page .eyebrow, .contact-page .eyebrow', 'kicker'],
  ['.dv-hero-copy h1, .page-hero > div > h1, .product-hero-detail h1, .contact-page h1', 'title'],
  ['.dv-hero-copy > p, .page-hero > div > p, .product-hero-detail .hero-lead, .product-hero-detail > div > p, .contact-page > p, .section-header > div > p:last-child', 'copy'],
  ['.dv-hero-actions, .dv-hero-proof, .page-hero .actions, .product-hero-detail .actions, .meta-chip-row, .privacy-actions, .article-actions', 'action'],
  ['.dv-hero-showcase, .hero-device-cluster, .detail-device-row, .v7-feature-stage, .gallery-panel, .article-meta-panel, .support-app-grid', 'visual'],
  ['.dv-section-head, .section-header, .dv-process-intro, .dv-about-copy, .final-cta > div, .privacy-section-head', 'heading'],
  ['.dv-service-card, .service-card, .process-grid article, .dv-process-grid article', 'surface'],
  ['.dv-product, .product-card, .support-product-card, .workflow-section .glass-panel, .detail-grid .glass-panel, .detail-footer-grid .glass-panel', 'surface'],
  ['.dv-update-card, .update-card, .story-card, .blog-card, .article-body > section, .launch-support-row', 'editorial'],
  ['.glass-panel, .faq-card, .reason-card, .support-app-card, .support-product-card, .request-panel, .test-teaser, .capability-strip article, .dv-about-visual, .dv-cta-card', 'utility'],
  ['.support-form, .quick-privacy, .support-choice-grid, .privacy-link-stack', 'utility'],
];

const surfaceRules = [
  ['.dv-service-card, .service-card', 'service'],
  ['.dv-product, .product-card, .support-product-card, .gallery-panel', 'product'],
  ['.dv-update-card, .update-card, .story-card, .blog-card, .article-body > section, .launch-support-row', 'editorial'],
  ['.glass-panel, .faq-card, .reason-card, .support-app-card, .request-panel, .test-teaser, .dv-about-visual, .dv-cta-card', 'utility'],
];

const regionSelectors = [
  '.dv-hero, .hero-section, .page-hero, .product-hero-detail, .test-support-page',
  '#services, .service-grid.full-grid, .problem-grid',
  '#products, .products-grid, .detail-grid',
  '.dv-process-section, .process-grid, .workflow-section',
  '.dv-updates, .updates-layout, .blog-grid, .article-body',
  '.dv-about, .support-layout, .contact-page',
  '.dv-cta-section, .final-cta, .detail-footer-grid',
];

function normalizedPath(url = window.location.href) {
  return new URL(url, window.location.href).pathname.replace(/\/+$/, '') || '/';
}

function profileFor(path) {
  if (path === '/') return 'home';
  if (path === '/products') return 'catalog';
  if (/^\/products\/[^/]+$/.test(path) || /^\/projects\/[^/]+$/.test(path)) return 'product-detail';
  if (path === '/services') return 'services';
  if (/^\/services\/[^/]+$/.test(path)) return 'service-detail';
  if (path === '/updates') return 'updates';
  if (path === '/blog') return 'blog';
  if (/^\/blog\/[^/]+$/.test(path)) return 'article';
  if (path === '/support') return 'support';
  if (path === '/contact') return 'contact';
  return 'generic';
}

function paletteKeyFor(profile) {
  if (profile === 'product-detail') return 'product';
  if (profile === 'service-detail') return 'service';
  return profile;
}

function setPalette(profile, index = 0) {
  const key = paletteKeyFor(profile);
  const base = palettes[key] || palettes.generic;
  const alternates = [
    base,
    [base[1], base[0]],
    [[16, 185, 129], base[0]],
    [[124, 58, 237], [236, 72, 153]],
  ];
  const palette = alternates[index % alternates.length];
  root.style.setProperty('--m10-r', palette[0][0]);
  root.style.setProperty('--m10-g', palette[0][1]);
  root.style.setProperty('--m10-b', palette[0][2]);
  root.style.setProperty('--m10-r2', palette[1][0]);
  root.style.setProperty('--m10-g2', palette[1][1]);
  root.style.setProperty('--m10-b2', palette[1][2]);
}

function classifyTransition(fromPath, toPath) {
  if (fromPath === '/' && toPath !== '/') return 'home-depart';
  if (fromPath !== '/' && toPath === '/') return 'home-return';
  if (fromPath === '/products' && /^\/products\/[^/]+$/.test(toPath)) return 'drill';
  if (/^\/products\/[^/]+$/.test(fromPath) && toPath === '/products') return 'return';
  if (fromPath === '/blog' && /^\/blog\/[^/]+$/.test(toPath)) return 'editorial';
  if (/^\/blog\/[^/]+$/.test(fromPath) && toPath === '/blog') return 'return';
  if (['/support', '/contact'].includes(toPath) || toPath.startsWith('/privacy')) return 'utility';
  if (fromPath.split('/')[1] === toPath.split('/')[1]) return 'lateral';
  return 'section';
}

function storeTransition(type, fromPath, toPath) {
  root.dataset.motionTransition = type;
  try {
    sessionStorage.setItem(transitionStoreKey, JSON.stringify({ type, fromPath, toPath, at: Date.now() }));
  } catch {
    // Motion continuity remains optional in restrictive privacy modes.
  }
}

function restoreTransition() {
  try {
    const value = JSON.parse(sessionStorage.getItem(transitionStoreKey) || 'null');
    if (!value || Date.now() - value.at > 7000) return;
    root.dataset.motionTransition = value.type;
  } catch {
    // Optional enhancement only.
  }
}

function ensureAtmosphere() {
  if (document.querySelector('.m10-atmosphere')) return;
  const layer = document.createElement('div');
  layer.className = 'm10-atmosphere';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = '<i></i>';
  (document.getElementById('root') || document.body).prepend(layer);
}

function activate(element) {
  element.dataset.m10State = 'visible';
  revealObserver?.unobserve(element);
}

function registerReveal(element, role, order) {
  if (seen.has(element)) return;
  seen.add(element);
  element.dataset.m10Role = role;
  element.style.setProperty('--m10-order', String(order % 7));
  element.dataset.m10State = reduceQuery?.matches ? 'visible' : 'pending';
  if (reduceQuery?.matches || !revealObserver) activate(element);
  else revealObserver.observe(element);
}

function registerSurface(element, type) {
  if (surfaces.has(element)) return;
  surfaces.add(element);
  element.dataset.m10Surface = type;
}

function registerRegion(element, index) {
  if (regions.has(element)) return;
  regions.add(element);
  element.dataset.m10Region = String(index);
  element.style.setProperty('--m10-region-progress', '0');
}

function installSharedTarget() {
  let state;
  try { state = JSON.parse(sessionStorage.getItem(sharedTitleStoreKey) || 'null'); } catch { state = null; }
  if (!state || Date.now() - state.at > 5000) return;
  const path = normalizedPath();
  if (path !== state.toPath) return;
  const target = document.querySelector('.page-hero h1, .product-hero-detail h1');
  if (!target) return;
  target.style.setProperty('view-transition-name', 'm10-shared-title');
  clearTimeout(sharedCleanup);
  sharedCleanup = window.setTimeout(() => {
    target.style.removeProperty('view-transition-name');
    try { sessionStorage.removeItem(sharedTitleStoreKey); } catch { /* optional */ }
  }, 1200);
}

function install(rootNode = document) {
  frame = 0;
  const path = normalizedPath();
  const profile = profileFor(path);
  root.classList.add('motion-system-v10');
  root.dataset.motionPage = profile;
  setPalette(profile);
  ensureAtmosphere();

  revealRules.forEach(([selector, role]) => {
    rootNode.querySelectorAll?.(selector).forEach((element, index) => registerReveal(element, role, index));
  });
  surfaceRules.forEach(([selector, type]) => {
    rootNode.querySelectorAll?.(selector).forEach((element) => registerSurface(element, type));
  });
  regionSelectors.forEach((selector, index) => {
    document.querySelectorAll(selector).forEach((element) => registerRegion(element, index));
  });
  installSharedTarget();
  requestScrollUpdate();
}

function scheduleInstall(rootNode = document) {
  if (frame) return;
  frame = requestAnimationFrame(() => install(rootNode));
}

function keyForCard(element) {
  const title = element.querySelector('h1,h2,h3,strong')?.textContent?.replace(/\s+/g, ' ').trim() || '';
  const image = element.querySelector('img')?.getAttribute('src') || '';
  return `${element.className}|${title}|${image}`;
}

function captureFilterLayout() {
  const selector = '.product-card, .support-product-card, .update-card, .story-card, .launch-support-row, .blog-card';
  beforeFilter = new Map([...document.querySelectorAll(selector)].map((element) => [keyForCard(element), element.getBoundingClientRect()]));
}

function runFilterFlip() {
  filterFrame = 0;
  if (!beforeFilter || reduceQuery?.matches) {
    beforeFilter = null;
    delete root.dataset.m10Filtering;
    return;
  }
  const selector = '.product-card, .support-product-card, .update-card, .story-card, .launch-support-row, .blog-card';
  const current = [...document.querySelectorAll(selector)];
  current.forEach((element, index) => {
    const previous = beforeFilter.get(keyForCard(element));
    const next = element.getBoundingClientRect();
    if (previous) {
      const dx = previous.left - next.left;
      const dy = previous.top - next.top;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        element.animate([
          { transform: `translate3d(${dx}px, ${dy}px, 0)`, opacity: .84 },
          { transform: 'translate3d(0,0,0)', opacity: 1 },
        ], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
    } else {
      element.animate([
        { opacity: 0, transform: 'translate3d(0,14px,0) scale(.985)' },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
      ], { duration: 580, delay: Math.min(index, 5) * 34, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
    }
  });
  beforeFilter = null;
  window.setTimeout(() => delete root.dataset.m10Filtering, 680);
}

function scheduleFilterFlip() {
  if (filterFrame) cancelAnimationFrame(filterFrame);
  filterFrame = requestAnimationFrame(() => requestAnimationFrame(runFilterFlip));
}

function markSharedTitle(anchor, toPath) {
  const source = anchor.closest('.blog-card, .service-card, .dv-service-card');
  if (!source) return;
  const heading = source.querySelector('h2,h3');
  if (!heading) return;
  heading.style.setProperty('view-transition-name', 'm10-shared-title');
  try { sessionStorage.setItem(sharedTitleStoreKey, JSON.stringify({ toPath, at: Date.now() })); } catch { /* optional */ }
  clearTimeout(sharedCleanup);
  sharedCleanup = window.setTimeout(() => heading.style.removeProperty('view-transition-name'), 1600);
}

function handleClickCapture(event) {
  const filter = event.target.closest?.('.filter-row button');
  if (filter) {
    captureFilterLayout();
    root.dataset.m10Filtering = 'true';
    scheduleFilterFlip();
    return;
  }

  const anchor = event.target.closest?.('a[href]');
  if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) return;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  const fromPath = normalizedPath();
  const toPath = normalizedPath(url.href);
  if (fromPath === toPath && url.hash) return;
  const type = classifyTransition(fromPath, toPath);
  storeTransition(type, fromPath, toPath);
  if ((fromPath === '/blog' && /^\/blog\/[^/]+$/.test(toPath)) || (fromPath === '/services' && /^\/services\/[^/]+$/.test(toPath))) {
    markSharedTitle(anchor, toPath);
  }
}

function handlePointerMove(event) {
  root.style.setProperty('--m10-x', `${event.clientX}px`);
  root.style.setProperty('--m10-y', `${event.clientY}px`);
  const nx = event.clientX / Math.max(window.innerWidth, 1) - .5;
  const ny = event.clientY / Math.max(window.innerHeight, 1) - .5;
  root.style.setProperty('--m10-ambient-x', `${(nx * 12).toFixed(2)}px`);
  root.style.setProperty('--m10-ambient-y', `${(ny * 9).toFixed(2)}px`);
  root.style.setProperty('--m10-ambient-x-reverse', `${(nx * -9).toFixed(2)}px`);
  root.style.setProperty('--m10-ambient-y-reverse', `${(ny * -7).toFixed(2)}px`);

  const surface = event.target.closest?.('[data-m10-surface]');
  document.querySelectorAll('[data-m10-surface].is-m10-pointer').forEach((element) => {
    if (element !== surface) element.classList.remove('is-m10-pointer');
  });
  if (surface) {
    const rect = surface.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
    surface.style.setProperty('--m10-local-x', `${x.toFixed(2)}%`);
    surface.style.setProperty('--m10-local-y', `${y.toFixed(2)}%`);
    surface.classList.add('is-m10-pointer');
  }

  const magnetic = event.target.closest?.('.button, .dv-button, .text-link, .dv-text-link');
  document.querySelectorAll('[data-m10-magnetic="true"]').forEach((element) => {
    if (element !== magnetic) {
      element.style.setProperty('--m10-magnet-x', '0px');
      element.style.setProperty('--m10-magnet-y', '0px');
      delete element.dataset.m10Magnetic;
    }
  });
  if (magnetic) {
    const rect = magnetic.getBoundingClientRect();
    const magneticX = ((event.clientX - rect.left) / Math.max(rect.width, 1) - .5) * 2;
    const magneticY = ((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 2;
    magnetic.style.setProperty('--m10-magnet-x', `${(magneticX * 2.4).toFixed(2)}px`);
    magnetic.style.setProperty('--m10-magnet-y', `${(magneticY * 1.8).toFixed(2)}px`);
    magnetic.dataset.m10Magnetic = 'true';
  }
}

function updateRegions(viewportHeight) {
  let closest = null;
  let closestDistance = Number.POSITIVE_INFINITY;
  document.querySelectorAll('[data-m10-region]').forEach((element) => {
    const rect = element.getBoundingClientRect();
    const progress = Math.min(Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0), 1);
    element.style.setProperty('--m10-region-progress', progress.toFixed(4));
    const distance = Math.abs(rect.top + rect.height * .5 - viewportHeight * .44);
    if (distance < closestDistance) {
      closest = element;
      closestDistance = distance;
    }
  });
  if (closest && closest !== activeRegion) {
    activeRegion = closest;
    setPalette(root.dataset.motionPage || 'generic', Number(closest.dataset.m10Region || 0));
  }
}

function updateScroll() {
  scrollFrame = 0;
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
  const delta = scrollY - lastScrollY;
  scrollVelocity += (Math.min(Math.abs(delta) / 44, 1) - scrollVelocity) * .22;
  lastScrollY = scrollY;
  root.style.setProperty('--m10-scroll', (scrollY / maxScroll).toFixed(4));
  root.style.setProperty('--m10-velocity', scrollVelocity.toFixed(4));
  updateRegions(viewportHeight);
}

function requestScrollUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateScroll);
}

function handlePopState(event) {
  const nextPath = normalizedPath();
  const type = classifyTransition(lastPath, nextPath);
  storeTransition(type, lastPath, nextPath);
  lastPath = nextPath;

  // React's navigation engine dispatches a synthetic popstate inside its own
  // View Transition update. Only real browser history traversal starts a new one.
  if (!event.isTrusted) {
    scheduleInstall();
    return;
  }

  if (!reduceQuery?.matches && document.startViewTransition) {
    const transition = document.startViewTransition(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    transition.finished.catch(() => {});
  }
  scheduleInstall();
}

function handlePageReveal() {
  restoreTransition();
  lastPath = normalizedPath();
  scheduleInstall();
  requestScrollUpdate();
}

function start() {
  if (started) {
    handlePageReveal();
    return;
  }
  started = true;
  restoreTransition();
  root.classList.add('motion-system-v10');
  revealObserver = reduceQuery?.matches ? null : new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activate(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -9% 0px' });

  mutationObserver = new MutationObserver((records) => {
    const target = records.find((record) => record.addedNodes.length)?.target;
    scheduleInstall(target instanceof Element ? target : document);
    if (beforeFilter) scheduleFilterFlip();
  });
  mutationObserver.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });

  document.addEventListener('click', handleClickCapture, { capture: true });
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  window.addEventListener('popstate', handlePopState);
  window.addEventListener('pagereveal', handlePageReveal);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) handlePageReveal();
  });
  if (!reduceQuery?.matches && finePointerQuery?.matches) {
    document.addEventListener('pointermove', handlePointerMove, { passive: true });
  }
  scheduleInstall();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();

window.addEventListener('pagehide', (event) => {
  if (event.persisted) return;
  revealObserver?.disconnect();
  mutationObserver?.disconnect();
  cancelAnimationFrame(frame);
  cancelAnimationFrame(scrollFrame);
  cancelAnimationFrame(filterFrame);
  clearTimeout(sharedCleanup);
  document.removeEventListener('click', handleClickCapture, { capture: true });
  document.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('scroll', requestScrollUpdate);
  window.removeEventListener('resize', requestScrollUpdate);
  window.removeEventListener('popstate', handlePopState);
  window.removeEventListener('pagereveal', handlePageReveal);
  started = false;
}, { once: true });
