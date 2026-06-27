const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const seen = new WeakSet();
let pointerFrame = 0;
let scrollFrame = 0;
let mutationFrame = 0;
let pointerX = window.innerWidth * 0.78;
let pointerY = window.innerHeight * 0.08;
let revealObserver;
let mutationObserver;

function ensureMotionStyles() {
  if (document.querySelector('link[data-privacy-motion-v10]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/privacy/privacy-motion-v10.css';
  link.dataset.privacyMotionV10 = 'true';
  document.head.append(link);
}

function ensureGlobalPointer() {
  if (!document.querySelector('link[data-pointer-v11]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/pointer-v11.css';
    link.dataset.pointerV11 = 'true';
    document.head.append(link);
  }
  if (!document.querySelector('script[data-pointer-v11]')) {
    const script = document.createElement('script');
    script.src = '/pointer-v11.js';
    script.defer = true;
    script.dataset.pointerV11 = 'true';
    document.head.append(script);
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

function activate(element) {
  element.dataset.privacyMotion = 'visible';
  revealObserver?.unobserve(element);
}

function register(element, order = 0) {
  if (seen.has(element)) return;
  seen.add(element);
  element.dataset.privacyRole = roleFor(element);
  element.style.setProperty('--privacy-motion-order', String(order % 7));
  element.dataset.privacyMotion = reducedMotion.matches ? 'visible' : 'pending';
  if (reducedMotion.matches || !revealObserver) activate(element);
  else revealObserver.observe(element);
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
  document.querySelectorAll('.privacy-float-chip').forEach((chip, index) => {
    chip.style.setProperty('--privacy-chip-order', String(index));
  });
}

function scheduleInstall(rootNode = document) {
  if (mutationFrame) return;
  mutationFrame = requestAnimationFrame(() => install(rootNode));
}

function updatePointer(event) {
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    pointerFrame = 0;
    root.style.setProperty('--privacy-x', `${(pointerX / Math.max(window.innerWidth, 1) * 100).toFixed(2)}%`);
    root.style.setProperty('--privacy-y', `${(pointerY / Math.max(window.innerHeight, 1) * 100).toFixed(2)}%`);

    const card = event.target.closest?.('.privacy-summary-card, .privacy-card, .privacy-app-card');
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
      card.style.setProperty('--privacy-local-x', `${x.toFixed(2)}%`);
      card.style.setProperty('--privacy-local-y', `${y.toFixed(2)}%`);
    }

    const magnetic = event.target.closest?.('.privacy-button, .privacy-nav a');
    document.querySelectorAll('[data-privacy-magnetic="true"]').forEach((element) => {
      if (element === magnetic) return;
      element.style.setProperty('--privacy-magnet-x', '0px');
      element.style.setProperty('--privacy-magnet-y', '0px');
      delete element.dataset.privacyMagnetic;
    });
    if (magnetic) {
      const rect = magnetic.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / Math.max(rect.width, 1) - .5) * 2;
      const ny = ((event.clientY - rect.top) / Math.max(rect.height, 1) - .5) * 2;
      magnetic.style.setProperty('--privacy-magnet-x', `${(nx * 1.8).toFixed(2)}px`);
      magnetic.style.setProperty('--privacy-magnet-y', `${(ny * 1.3).toFixed(2)}px`);
      magnetic.dataset.privacyMagnetic = 'true';
    }
  });
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
  ensureGlobalPointer();
  ensureReadingProgress();
  root.classList.add('privacy-motion-v10');
  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  revealObserver = reducedMotion.matches ? null : new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activate(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

  mutationObserver = new MutationObserver((records) => {
    const target = records.find((record) => record.addedNodes.length)?.target;
    scheduleInstall(target instanceof Element ? target : document);
  });
  mutationObserver.observe(document.querySelector('.privacy-shell') || document.body, { childList: true, subtree: true });

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  if (!reducedMotion.matches && finePointer.matches) {
    window.addEventListener('pointermove', updatePointer, { passive: true });
  }

  scheduleInstall();
  requestScrollUpdate();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();

window.addEventListener('pagehide', () => {
  revealObserver?.disconnect();
  mutationObserver?.disconnect();
  cancelAnimationFrame(pointerFrame);
  cancelAnimationFrame(scrollFrame);
  cancelAnimationFrame(mutationFrame);
  window.removeEventListener('scroll', requestScrollUpdate);
  window.removeEventListener('resize', requestScrollUpdate);
  window.removeEventListener('pointermove', updatePointer);
}, { once: true });
