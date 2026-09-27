const root = document.documentElement;
const seen = new WeakSet();
let scrollFrame = 0;
let mutationFrame = 0;
let mutationObserver;

function ensureMotionStyles() {
  if (!document.querySelector('link[data-privacy-motion-v10]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/privacy/privacy-motion-v10.css';
    link.dataset.privacyMotionV10 = 'true';
    document.head.append(link);
  }

  if (!document.querySelector('link[data-privacy-editorial-v15]')) {
    const editorial = document.createElement('link');
    editorial.rel = 'stylesheet';
    editorial.href = '/privacy/privacy-editorial-v15.css';
    editorial.dataset.privacyEditorialV15 = 'true';
    document.head.append(editorial);
  }
}

function ensureReadingProgress() {
  const topbar = document.querySelector('.privacy-topbar');
  if (!topbar || topbar.querySelector('.privacy-reading-progress')) return;
  const progress = document.createElement('span');
  progress.className = 'privacy-reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  topbar.append(progress);
}

function roleFor(element) {
  if (element.matches('.privacy-hero h1, .privacy-section-head')) return 'heading';
  if (element.matches('.privacy-summary-card, .privacy-card, .privacy-app-card, .privacy-status-visual')) return 'card';
  if (element.closest('.privacy-grid[style*="grid-template-columns:1fr"]')) return 'legal';
  return 'content';
}

function register(element, order = 0) {
  if (seen.has(element)) return;
  seen.add(element);
  element.dataset.privacyRole = roleFor(element);
  element.style.setProperty('--privacy-motion-order', String(order % 7));
  element.dataset.privacyMotion = 'visible';
}

function install(rootNode = document) {
  mutationFrame = 0;
  const selectors = [
    '.privacy-hero > div:first-child > *',
    '.privacy-status-visual',
    '.privacy-summary-card',
    '.privacy-section-head',
    '.privacy-card',
    '.privacy-app-card',
    '.privacy-grid[style*="grid-template-columns:1fr"] > *',
    '.privacy-actions',
  ];
  selectors.forEach((selector) => {
    rootNode.querySelectorAll?.(selector).forEach((element, index) => register(element, index));
  });
}

function scheduleInstall(rootNode = document) {
  if (mutationFrame) return;
  mutationFrame = requestAnimationFrame(() => install(rootNode));
}

function updateScroll() {
  scrollFrame = 0;
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  root.style.setProperty('--privacy-progress', Math.min(Math.max(window.scrollY / max, 0), 1).toFixed(4));
  root.classList.toggle('is-privacy-scrolled', window.scrollY > 20);
}

function requestScrollUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateScroll);
}

function start() {
  ensureMotionStyles();
  ensureReadingProgress();
  root.classList.add('privacy-motion-v10');
  root.classList.add('privacy-editorial-v15');

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  mutationObserver = new MutationObserver((records) => {
    const target = records.find((record) => record.addedNodes.length)?.target;
    scheduleInstall(target instanceof Element ? target : document);
  });
  mutationObserver.observe(document.querySelector('.privacy-shell') || document.body, { childList: true, subtree: true });

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });

  scheduleInstall();
  requestScrollUpdate();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();

window.addEventListener('pagehide', () => {
  mutationObserver?.disconnect();
  cancelAnimationFrame(scrollFrame);
  cancelAnimationFrame(mutationFrame);
  window.removeEventListener('scroll', requestScrollUpdate);
  window.removeEventListener('resize', requestScrollUpdate);
}, { once: true });
