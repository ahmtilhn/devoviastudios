const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
const seen = new WeakSet();
const surfaceSeen = new WeakSet();
let revealObserver;
let mutationObserver;
let frame = 0;

const roleSelectors = [
  ['.dv-hero h1, .page-hero h1, .product-hero-detail h1, .contact-page h1', 'hero'],
  ['.dv-section-head h2, .section-header h2, .v7-feature-chapter h3, .privacy-section-head h2', 'heading'],
  ['.dv-eyebrow, .eyebrow, .v7-feature-label, .privacy-eyebrow', 'eyebrow'],
  ['.dv-hero-copy > p, .page-hero p, .section-header p, .v7-feature-description, .privacy-lead', 'copy'],
  ['.product-card, .service-card, .update-card, .story-card, .blog-card, .glass-panel, .faq-card, .reason-card, .support-app-card, .support-product-card, .dv-service-card, .dv-update-card, .dv-process-grid article, .v7-promise-grid article, .v7-fact-panel', 'surface'],
  ['.hero-device-cluster, .detail-device-row, .dv-hero-showcase, .dv-product-visual, .v7-feature-stage, .v7-screen-card', 'visual'],
];

const surfaceSelector = '.product-card, .service-card, .update-card, .story-card, .blog-card, .glass-panel, .faq-card, .reason-card, .support-app-card, .support-product-card, .dv-service-card, .dv-update-card, .dv-process-grid article, .v7-promise-grid article, .v7-fact-panel';

function activate(element) {
  element.dataset.pmState = 'visible';
  revealObserver?.unobserve(element);
}

function registerSurface(element) {
  if (surfaceSeen.has(element)) return;
  surfaceSeen.add(element);
  element.classList.add('pm-surface');
  if (!finePointer || reduced) return;
  element.addEventListener('pointermove', (event) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
    element.style.setProperty('--pm-local-x', `${x.toFixed(2)}%`);
    element.style.setProperty('--pm-local-y', `${y.toFixed(2)}%`);
  }, { passive: true });
}

function register(element, role, order) {
  if (seen.has(element)) return;
  seen.add(element);
  element.dataset.pmRole = role;
  element.dataset.pmOrder = String(order % 6);
  element.dataset.pmState = reduced ? 'visible' : 'pending';
  if (element.matches(surfaceSelector)) registerSurface(element);
  if (!reduced) revealObserver.observe(element);
}

function install(root = document) {
  frame = 0;
  roleSelectors.forEach(([selector, role]) => {
    root.querySelectorAll?.(selector).forEach((element, index) => register(element, role, index));
  });
  document.documentElement.classList.add('premium-motion-v8');
}

function schedule(root = document) {
  if (frame) return;
  frame = requestAnimationFrame(() => install(root));
}

function replaceLegacyBackAnimation() {
  requestAnimationFrame(() => {
    const main = document.querySelector('.app-shell main');
    if (!main || reduced) return;
    main.getAnimations().forEach((animation) => animation.cancel());
    main.animate([
      { opacity: 0, transform: 'translate3d(-12px,0,0) scale(.997)' },
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
    ], { duration: 720, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
  });
}

function start() {
  revealObserver = reduced ? null : new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting && activate(entry.target));
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  mutationObserver = new MutationObserver((records) => {
    const target = records.find((record) => record.addedNodes.length)?.target;
    schedule(target instanceof Element ? target : document);
  });
  mutationObserver.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  window.addEventListener('popstate', replaceLegacyBackAnimation);
  schedule();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
window.addEventListener('pagehide', () => {
  revealObserver?.disconnect();
  mutationObserver?.disconnect();
  cancelAnimationFrame(frame);
  window.removeEventListener('popstate', replaceLegacyBackAnimation);
}, { once: true });
