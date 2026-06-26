import { ROOT_SELECTOR, decorateSite } from './full-site-atmosphere.js';
import { installTargets } from './full-site-targets.js';

const PARALLAX_RULES = [
  ['.page-hero > div:first-child', 0.035],
  ['.page-hero > :not(:first-child)', -0.05],
  ['.product-hero-detail > div:first-child', 0.035],
  ['.detail-device-row', -0.065],
  ['.hero-device-cluster', -0.06],
  ['.section-header', 0.022],
  ['.article-meta-panel', -0.025],
  ['.contact-page > div:first-child', 0.028],
  ['.dv-hero-copy', 0.04],
  ['.dv-hero-showcase', -0.055],
  ['.dv-product-visual', -0.04],
  ['.dv-product-copy', 0.025],
  ['.dv-about-visual', -0.035],
];

const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
const pointer = {
  x: window.innerWidth * 0.5,
  y: window.innerHeight * 0.32,
  targetX: window.innerWidth * 0.5,
  targetY: window.innerHeight * 0.32,
  previousX: window.innerWidth * 0.5,
  previousY: window.innerHeight * 0.32,
  speed: 0,
};

let pointerFrame = 0;
let scrollFrame = 0;
let installFrame = 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(current, target, amount) {
  return current + (target - current) * amount;
}

function root() {
  return document.querySelector(ROOT_SELECTOR);
}

function installParallax() {
  const currentRoot = decorateSite() || root();
  if (!currentRoot) return;
  installTargets();
  PARALLAX_RULES.forEach(([selector, depth]) => {
    currentRoot.querySelectorAll(selector).forEach((element) => {
      element.dataset.uxParallax = String(depth);
    });
  });
  requestScrollUpdate();
}

function scheduleInstall() {
  cancelAnimationFrame(installFrame);
  installFrame = requestAnimationFrame(installParallax);
}

function updatePointer(event) {
  pointer.targetX = event.clientX;
  pointer.targetY = event.clientY;
}

function animatePointer() {
  const currentRoot = root();
  if (currentRoot) {
    pointer.x = lerp(pointer.x, pointer.targetX, 0.105);
    pointer.y = lerp(pointer.y, pointer.targetY, 0.105);
    const dx = pointer.x - pointer.previousX;
    const dy = pointer.y - pointer.previousY;
    const rawSpeed = Math.sqrt(dx * dx + dy * dy);
    pointer.speed = lerp(pointer.speed, clamp(rawSpeed, 0, 42), 0.18);
    pointer.previousX = pointer.x;
    pointer.previousY = pointer.y;
    const nx = pointer.x / Math.max(window.innerWidth, 1) - 0.5;
    const ny = pointer.y / Math.max(window.innerHeight, 1) - 0.5;
    currentRoot.style.setProperty('--ux-mouse-x', `${pointer.x.toFixed(2)}px`);
    currentRoot.style.setProperty('--ux-mouse-y', `${pointer.y.toFixed(2)}px`);
    currentRoot.style.setProperty('--ux-mouse-nx', nx.toFixed(4));
    currentRoot.style.setProperty('--ux-mouse-ny', ny.toFixed(4));
    currentRoot.style.setProperty('--ux-mouse-speed', pointer.speed.toFixed(2));
    currentRoot.style.setProperty('--ux-depth-x', `${(nx * 20).toFixed(2)}px`);
    currentRoot.style.setProperty('--ux-depth-y', `${(ny * 16).toFixed(2)}px`);
    currentRoot.style.setProperty('--ux-depth-x-reverse', `${(nx * -16).toFixed(2)}px`);
    currentRoot.style.setProperty('--ux-depth-y-reverse', `${(ny * -13).toFixed(2)}px`);
    currentRoot.style.setProperty('--ux-cloud-scale', (1 + pointer.speed * 0.006).toFixed(3));
  }
  pointerFrame = requestAnimationFrame(animatePointer);
}

function updateScroll() {
  scrollFrame = 0;
  const currentRoot = root();
  if (!currentRoot) return;
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = clamp(window.scrollY / max, 0, 1);
  currentRoot.style.setProperty('--ux-scroll-progress', progress.toFixed(4));
  currentRoot.classList.toggle('ux-is-scrolled', window.scrollY > 24);

  if (!reducedMotion) {
    currentRoot.querySelectorAll('[data-ux-parallax]').forEach((element) => {
      const rect = element.getBoundingClientRect();
      const depth = Number.parseFloat(element.dataset.uxParallax || '0');
      const centerOffset = rect.top + rect.height * 0.5 - window.innerHeight * 0.5;
      const offset = clamp(centerOffset * depth * -0.22, -32, 32);
      element.style.setProperty('--ux-parallax-y', `${offset.toFixed(2)}px`);
    });
  }
}

function requestScrollUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateScroll);
}

const observer = new MutationObserver(scheduleInstall);
observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });
window.addEventListener('popstate', scheduleInstall);

if (finePointer && !reducedMotion) {
  window.addEventListener('pointermove', updatePointer, { passive: true });
  pointerFrame = requestAnimationFrame(animatePointer);
}

requestAnimationFrame(scheduleInstall);

window.addEventListener('pagehide', () => {
  observer.disconnect();
  cancelAnimationFrame(pointerFrame);
  cancelAnimationFrame(scrollFrame);
  cancelAnimationFrame(installFrame);
  window.removeEventListener('scroll', requestScrollUpdate);
  window.removeEventListener('resize', requestScrollUpdate);
  window.removeEventListener('popstate', scheduleInstall);
  window.removeEventListener('pointermove', updatePointer);
}, { once: true });
