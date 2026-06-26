import { ROOT_SELECTOR, SPOTLIGHT_SELECTOR, decorateSite } from './full-site-atmosphere.js';

export const TILT_SELECTOR = [
  '.product-card', '.service-card', '.update-card', '.story-card', '.blog-card',
  '.glass-panel:not(.gallery-panel)', '.faq-card', '.reason-card', '.support-app-card',
  '.support-product-card', '.test-teaser', '.request-panel', '.dv-service-card',
  '.dv-product', '.dv-update-card', '.dv-process-grid article', '.dv-about-visual',
].join(',');

export const MAGNETIC_SELECTOR = [
  '.button', '.text-link', '.desktop-nav a', '.mobile-menu a', '.filter-row button',
  '.dv-button', '.dv-nav-cta', '.dv-text-link', '.dv-service-card > a', '.dv-update-action',
].join(',');

const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
let activeSpotlight = null;
let activeTilt = null;
let activeMagnet = null;
let frame = 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function reset(element, type) {
  if (!element) return;
  if (type === 'spotlight') element.classList.remove('ux-pointer-inside');
  if (type === 'tilt') {
    element.style.setProperty('--ux-card-rx', '0deg');
    element.style.setProperty('--ux-card-ry', '0deg');
    element.classList.remove('ux-pointer-inside');
  }
  if (type === 'magnet') {
    element.style.setProperty('--ux-magnet-x', '0px');
    element.style.setProperty('--ux-magnet-y', '0px');
  }
}

export function installTargets() {
  const root = decorateSite() || document.querySelector(ROOT_SELECTOR);
  if (!root) return;
  root.querySelectorAll(TILT_SELECTOR).forEach((element) => element.classList.add('ux-tilt-target'));
  root.querySelectorAll(MAGNETIC_SELECTOR).forEach((element) => element.classList.add('ux-magnetic-target'));
}

function pointerMove(event) {
  const root = document.querySelector(ROOT_SELECTOR);
  if (!root) return;

  const spotlight = event.target.closest?.(SPOTLIGHT_SELECTOR);
  if (activeSpotlight && activeSpotlight !== spotlight) reset(activeSpotlight, 'spotlight');
  activeSpotlight = spotlight && root.contains(spotlight) ? spotlight : null;
  if (activeSpotlight) {
    const rect = activeSpotlight.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
    const y = clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
    activeSpotlight.style.setProperty('--ux-local-x', `${(x * 100).toFixed(2)}%`);
    activeSpotlight.style.setProperty('--ux-local-y', `${(y * 100).toFixed(2)}%`);
    activeSpotlight.classList.add('ux-pointer-inside');
  }

  const tilt = event.target.closest?.(TILT_SELECTOR);
  if (activeTilt && activeTilt !== tilt) reset(activeTilt, 'tilt');
  activeTilt = tilt && root.contains(tilt) ? tilt : null;
  if (activeTilt) {
    const rect = activeTilt.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
    const y = clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
    activeTilt.style.setProperty('--ux-card-rx', `${((0.5 - y) * 3.6).toFixed(2)}deg`);
    activeTilt.style.setProperty('--ux-card-ry', `${((x - 0.5) * 4.4).toFixed(2)}deg`);
    activeTilt.classList.add('ux-pointer-inside');
  }

  const magnet = event.target.closest?.(MAGNETIC_SELECTOR);
  if (activeMagnet && activeMagnet !== magnet) reset(activeMagnet, 'magnet');
  activeMagnet = magnet && root.contains(magnet) ? magnet : null;
  if (activeMagnet) {
    const rect = activeMagnet.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width * 0.5);
    const dy = event.clientY - (rect.top + rect.height * 0.5);
    activeMagnet.style.setProperty('--ux-magnet-x', `${clamp(dx * 0.1, -7, 7).toFixed(2)}px`);
    activeMagnet.style.setProperty('--ux-magnet-y', `${clamp(dy * 0.1, -5, 5).toFixed(2)}px`);
  }
}

const schedule = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(installTargets);
};

const observer = new MutationObserver(schedule);
observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
window.addEventListener('popstate', schedule);
if (finePointer && !reducedMotion) window.addEventListener('pointermove', pointerMove, { passive: true });
requestAnimationFrame(schedule);

window.addEventListener('pagehide', () => {
  observer.disconnect();
  cancelAnimationFrame(frame);
  window.removeEventListener('popstate', schedule);
  window.removeEventListener('pointermove', pointerMove);
}, { once: true });
