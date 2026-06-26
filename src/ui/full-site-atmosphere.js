const ROOT_SELECTOR = '.dv-site, .app-shell';

const SPOTLIGHT_SELECTOR = [
  '.page-hero > div:first-child',
  '.product-hero-detail > div:first-child',
  '.contact-page > div:first-child',
  '.section-header',
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
  '.final-cta',
  '.article-body',
  '.detail-device-row',
  '.hero-device-cluster',
  '.support-form',
  '.dv-hero-copy',
  '.dv-service-card',
  '.dv-product',
  '.dv-update-card',
  '.dv-process-grid article',
  '.dv-about-visual',
  '.dv-cta-card',
].join(',');

const PALETTES = {
  home: [[59, 130, 246], [139, 92, 246]],
  products: [[91, 103, 240], [34, 211, 238]],
  'product-detail': [[59, 130, 246], [124, 58, 237]],
  services: [[14, 165, 233], [99, 102, 241]],
  'test-support': [[37, 99, 235], [16, 185, 129]],
  updates: [[124, 58, 237], [236, 72, 153]],
  support: [[14, 165, 233], [16, 185, 129]],
  blog: [[99, 102, 241], [14, 165, 233]],
  'blog-article': [[79, 70, 229], [139, 92, 246]],
  contact: [[37, 99, 235], [236, 72, 153]],
  content: [[59, 130, 246], [139, 92, 246]],
};

function pageKey(path = window.location.pathname) {
  const clean = path.replace(/\/+$/, '') || '/';
  if (clean === '/') return 'home';
  if (clean === '/products' || clean === '/projects') return 'products';
  if (clean.startsWith('/products/') || clean.startsWith('/projects/')) return 'product-detail';
  if (clean === '/services/google-play-test-support') return 'test-support';
  if (clean.startsWith('/services')) return 'services';
  if (clean === '/updates') return 'updates';
  if (clean === '/support') return 'support';
  if (clean === '/blog') return 'blog';
  if (clean.startsWith('/blog/')) return 'blog-article';
  if (clean === '/contact') return 'contact';
  return 'content';
}

function setIdentity(root) {
  const key = pageKey();
  const [primary, secondary] = PALETTES[key] || PALETTES.content;
  root.dataset.uxPage = key;
  root.style.setProperty('--ux-page-r', primary[0]);
  root.style.setProperty('--ux-page-g', primary[1]);
  root.style.setProperty('--ux-page-b', primary[2]);
  root.style.setProperty('--ux-page2-r', secondary[0]);
  root.style.setProperty('--ux-page2-g', secondary[1]);
  root.style.setProperty('--ux-page2-b', secondary[2]);
  document.documentElement.dataset.uxPage = key;
}

function ensureAtmosphere(root) {
  if (root.querySelector(':scope > .ux-site-atmosphere')) return;
  const layer = document.createElement('div');
  layer.className = 'ux-site-atmosphere';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = `
    <div class="ux-cursor-cloud ux-cursor-cloud-primary"></div>
    <div class="ux-cursor-cloud ux-cursor-cloud-secondary"></div>
    <div class="ux-cursor-cloud ux-cursor-cloud-cyan"></div>
    <div class="ux-ambient-ribbon ux-ambient-ribbon-a"></div>
    <div class="ux-ambient-ribbon ux-ambient-ribbon-b"></div>
    <div class="ux-atmosphere-grid"></div>
    <div class="ux-atmosphere-noise"></div>
  `;
  root.prepend(layer);
}

function addAura(element) {
  if (element.dataset.uxSpotlight === 'ready') return;
  element.dataset.uxSpotlight = 'ready';
  element.classList.add('ux-spotlight-target');
  const aura = document.createElement('span');
  aura.className = 'ux-local-aura';
  aura.setAttribute('aria-hidden', 'true');
  element.prepend(aura);
}

function decorateMockups(root) {
  root.querySelectorAll('.device').forEach((device) => {
    device.classList.add('ux-device-frame');
    if (!device.querySelector(':scope > .ux-device-glass')) {
      const glass = document.createElement('span');
      glass.className = 'ux-device-glass';
      glass.setAttribute('aria-hidden', 'true');
      device.append(glass);
    }
  });
  root.querySelectorAll('.product-visual').forEach((visual) => visual.classList.add('ux-product-stage'));
}

export function decorateSite() {
  const root = document.querySelector(ROOT_SELECTOR);
  if (!root) return null;
  setIdentity(root);
  ensureAtmosphere(root);
  root.querySelectorAll(SPOTLIGHT_SELECTOR).forEach(addAura);
  decorateMockups(root);
  return root;
}

export { ROOT_SELECTOR, SPOTLIGHT_SELECTOR };

let frame = 0;
const schedule = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(decorateSite);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', schedule, { once: true });
} else {
  schedule();
}

const observer = new MutationObserver(schedule);
observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
window.addEventListener('popstate', schedule);
window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
