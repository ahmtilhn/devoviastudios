import { SPOTLIGHT_SELECTOR } from './full-site-atmosphere.js';

const TILT_SELECTOR = [
  '.product-card', '.service-card', '.update-card', '.story-card', '.blog-card',
  '.glass-panel:not(.gallery-panel)', '.faq-card', '.reason-card', '.support-app-card',
  '.support-product-card', '.test-teaser', '.request-panel',
].join(',');

const MAGNETIC_SELECTOR = [
  '.button', '.text-link', '.desktop-nav a', '.mobile-menu a', '.filter-row button',
].join(',');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

let activeSpotlight = null;
let activeTilt = null;
let activeMagnet = null;

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

function installTargets(root) {
  if (!root) return;
  root.querySelectorAll(TILT_SELECTOR).forEach((element) => element.classList.add('ux-tilt-target'));
  root.querySelectorAll(MAGNETIC_SELECTOR).forEach((element) => element.classList.add('ux-magnetic-target'));
}

function updateTargets(event, root) {
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
    activeTilt.style.setProperty('--ux-card-rx', `${((0.5 - y) * 1.5).toFixed(2)}deg`);
    activeTilt.style.setProperty('--ux-card-ry', `${((x - 0.5) * 1.8).toFixed(2)}deg`);
    activeTilt.classList.add('ux-pointer-inside');
  }

  const magnet = event.target.closest?.(MAGNETIC_SELECTOR);
  if (activeMagnet && activeMagnet !== magnet) reset(activeMagnet, 'magnet');
  activeMagnet = magnet && root.contains(magnet) ? magnet : null;
  if (activeMagnet) {
    const rect = activeMagnet.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width * 0.5);
    const dy = event.clientY - (rect.top + rect.height * 0.5);
    activeMagnet.style.setProperty('--ux-magnet-x', `${clamp(dx * 0.06, -4, 4).toFixed(2)}px`);
    activeMagnet.style.setProperty('--ux-magnet-y', `${clamp(dy * 0.06, -3, 3).toFixed(2)}px`);
  }
}

function resetTargets() {
  reset(activeSpotlight, 'spotlight');
  reset(activeTilt, 'tilt');
  reset(activeMagnet, 'magnet');
  activeSpotlight = null;
  activeTilt = null;
  activeMagnet = null;
}

export { TILT_SELECTOR, MAGNETIC_SELECTOR, installTargets, updateTargets, resetTargets };
