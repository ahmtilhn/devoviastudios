import { ROOT_SELECTOR, decorateSite } from './full-site-atmosphere.js';
import { installTargets, updateTargets, resetTargets } from './full-site-targets.js';

const REVEAL_SELECTOR = [
  '.page-hero > *',
  '.product-hero-detail > *',
  '.contact-page > *',
  '.section-header > *',
  '.filter-row',
  '.product-card',
  '.service-card',
  '.update-card',
  '.story-card',
  '.blog-card',
  '.glass-panel',
  '.faq-card',
  '.reason-card',
  '.support-app-card',
  '.support-product-card',
  '.test-teaser',
  '.request-panel',
  '.final-cta > *',
  '.article-body > *',
  '.site-footer > *',
].join(',');

const PARALLAX_RULES = [
  ['.page-hero > div:first-child', 0.024],
  ['.page-hero > :not(:first-child)', -0.032],
  ['.product-hero-detail > div:first-child', 0.024],
  ['.detail-device-row', -0.04],
  ['.hero-device-cluster', -0.038],
  ['.section-header', 0.016],
  ['.article-meta-panel', -0.018],
  ['.contact-page > div:first-child', 0.018],
];

const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (from, to, amount) => from + (to - from) * amount;

const pointer = {
  x: window.innerWidth * 0.5,
  y: window.innerHeight * 0.32,
  targetX: window.innerWidth * 0.5,
  targetY: window.innerHeight * 0.32,
  previousX: window.innerWidth * 0.5,
  previousY: window.innerHeight * 0.32,
  speed: 0,
};

let root = null;
let mutationObserver = null;
let revealObserver = null;
let pointerFrame = 0;
let scrollFrame = 0;
let installFrame = 0;
let lastScrollY = window.scrollY;
let velocity = 0;

function installRevealTargets(currentRoot) {
  currentRoot.querySelectorAll(REVEAL_SELECTOR).forEach((element, index) => {
    if (element.hasAttribute('data-ux-reveal')) return;
    element.setAttribute('data-ux-reveal', '');
    element.style.setProperty('--ux-index', String(index % 7));
    if (reducedMotion || !revealObserver) element.setAttribute('data-ux-visible', 'true');
    else revealObserver.observe(element);
  });
}

function installParallax(currentRoot) {
  PARALLAX_RULES.forEach(([selector, depth]) => {
    currentRoot.querySelectorAll(selector).forEach((element) => {
      element.dataset.uxParallax = String(depth);
    });
  });
}

function installSections(currentRoot) {
  currentRoot.querySelectorAll('main > section, main > article, .section, .compact-section').forEach((element, index) => {
    element.dataset.uxSection = String(index + 1);
  });
}

function install() {
  installFrame = 0;
  const currentRoot = decorateSite();
  if (!currentRoot) return;
  root = currentRoot;
  installTargets(root);
  installRevealTargets(root);
  installParallax(root);
  installSections(root);
  requestScrollUpdate();
}

function scheduleInstall() {
  if (installFrame) return;
  installFrame = requestAnimationFrame(install);
}

function updatePointer(event) {
  if (!root) return;
  pointer.targetX = event.clientX;
  pointer.targetY = event.clientY;
  updateTargets(event, root);
}

function animatePointer() {
  if (root) {
    pointer.x = lerp(pointer.x, pointer.targetX, 0.095);
    pointer.y = lerp(pointer.y, pointer.targetY, 0.095);

    const dx = pointer.x - pointer.previousX;
    const dy = pointer.y - pointer.previousY;
    pointer.speed = lerp(pointer.speed, clamp(Math.hypot(dx, dy), 0, 36), 0.16);
    pointer.previousX = pointer.x;
    pointer.previousY = pointer.y;

    const nx = pointer.x / Math.max(window.innerWidth, 1) - 0.5;
    const ny = pointer.y / Math.max(window.innerHeight, 1) - 0.5;
    root.style.setProperty('--ux-mouse-x', `${pointer.x.toFixed(2)}px`);
    root.style.setProperty('--ux-mouse-y', `${pointer.y.toFixed(2)}px`);
    root.style.setProperty('--ux-mouse-nx', nx.toFixed(4));
    root.style.setProperty('--ux-mouse-ny', ny.toFixed(4));
    root.style.setProperty('--ux-mouse-speed', pointer.speed.toFixed(2));
    root.style.setProperty('--ux-depth-x', `${(nx * 12).toFixed(2)}px`);
    root.style.setProperty('--ux-depth-y', `${(ny * 10).toFixed(2)}px`);
    root.style.setProperty('--ux-depth-x-reverse', `${(nx * -9).toFixed(2)}px`);
    root.style.setProperty('--ux-depth-y-reverse', `${(ny * -8).toFixed(2)}px`);
    root.style.setProperty('--ux-cloud-scale', (1 + pointer.speed * 0.004).toFixed(3));
  }
  pointerFrame = requestAnimationFrame(animatePointer);
}

function updateSectionProgress(viewportHeight) {
  root.querySelectorAll('[data-ux-section]').forEach((element) => {
    const rect = element.getBoundingClientRect();
    const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
    const distance = Math.abs(rect.top + rect.height * 0.5 - viewportHeight * 0.5);
    element.style.setProperty('--ux-section-progress', progress.toFixed(4));
    element.classList.toggle('ux-section-active', distance < viewportHeight * 0.55);
  });
}

function updateParallax(viewportHeight) {
  if (reducedMotion) return;
  root.querySelectorAll('[data-ux-parallax]').forEach((element) => {
    const rect = element.getBoundingClientRect();
    const depth = Number.parseFloat(element.dataset.uxParallax || '0');
    const centerOffset = rect.top + rect.height * 0.5 - viewportHeight * 0.5;
    const offset = clamp(centerOffset * depth * -0.16, -20, 20);
    element.style.setProperty('--ux-parallax-y', `${offset.toFixed(2)}px`);
  });
}

function updateScroll() {
  scrollFrame = 0;
  if (!root) return;
  const viewportHeight = window.innerHeight;
  const max = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
  const progress = clamp(window.scrollY / max, 0, 1);
  const delta = window.scrollY - lastScrollY;
  velocity += (clamp(Math.abs(delta) / 44, 0, 1) - velocity) * 0.22;
  lastScrollY = window.scrollY;

  root.style.setProperty('--ux-scroll-progress', progress.toFixed(4));
  root.style.setProperty('--ux-scroll-velocity', velocity.toFixed(4));
  root.classList.toggle('ux-is-scrolled', window.scrollY > 24);
  updateSectionProgress(viewportHeight);
  updateParallax(viewportHeight);
}

function requestScrollUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateScroll);
}

function start() {
  revealObserver = reducedMotion
    ? null
    : new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-ux-visible', 'true');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });

  mutationObserver = new MutationObserver(scheduleInstall);
  mutationObserver.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  window.addEventListener('popstate', scheduleInstall);

  if (finePointer && !reducedMotion) {
    window.addEventListener('pointermove', updatePointer, { passive: true });
    pointerFrame = requestAnimationFrame(animatePointer);
  }

  requestAnimationFrame(scheduleInstall);
}

function stop() {
  mutationObserver?.disconnect();
  revealObserver?.disconnect();
  resetTargets();
  cancelAnimationFrame(pointerFrame);
  cancelAnimationFrame(scrollFrame);
  cancelAnimationFrame(installFrame);
  window.removeEventListener('scroll', requestScrollUpdate);
  window.removeEventListener('resize', requestScrollUpdate);
  window.removeEventListener('popstate', scheduleInstall);
  window.removeEventListener('pointermove', updatePointer);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
window.addEventListener('pagehide', stop, { once: true });
