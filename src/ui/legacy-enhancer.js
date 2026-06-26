const revealSelector = [
  '.page-hero > *',
  '.product-hero-detail > *',
  '.contact-page > *',
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
  '.detail-device-row',
].join(',');

const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
let revealObserver;
let lastPath = window.location.pathname;
let routeTimer;

function ensureProgressBar() {
  let progress = document.querySelector('.ux-progress');
  if (!progress) {
    progress = document.createElement('div');
    progress.className = 'ux-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
  }
  return progress;
}

function updateProgress() {
  const progress = ensureProgressBar();
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const value = Math.min(Math.max(window.scrollY / max, 0), 1);
  progress.style.transform = `scaleX(${value})`;
  const header = document.querySelector('.site-header');
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
}

function markNavigationState() {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.desktop-nav a, .mobile-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    const active = href === currentPath || (href !== '/' && currentPath.startsWith(`${href}/`));
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('.filter-row button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  });
  const menuButton = document.querySelector('.menu-button');
  if (menuButton) {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
  }
}

function revealElement(element, index) {
  if (element.hasAttribute('data-ux-reveal')) return;
  element.setAttribute('data-ux-reveal', '');
  element.style.setProperty('--ux-index', String(index % 6));
  if (reducedMotion || !revealObserver) element.setAttribute('data-ux-visible', 'true');
  else revealObserver.observe(element);
}

function animateRouteChange() {
  const path = window.location.pathname;
  if (path === lastPath) return;
  lastPath = path;
  const main = document.querySelector('.app-shell main');
  if (!main || reducedMotion) return;
  clearTimeout(routeTimer);
  main.classList.remove('ux-route-enter');
  requestAnimationFrame(() => main.classList.add('ux-route-enter'));
  routeTimer = window.setTimeout(() => main.classList.remove('ux-route-enter'), 520);
}

function enhance(root = document) {
  root.querySelectorAll?.(revealSelector).forEach((element, index) => revealElement(element, index));
  markNavigationState();
  animateRouteChange();
  updateProgress();
}

function start() {
  document.documentElement.classList.add('ux-enhanced');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-ux-visible', 'true');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  }
  const root = document.getElementById('root');
  const mutationObserver = new MutationObserver(() => {
    requestAnimationFrame(() => enhance(root || document));
  });
  if (root) mutationObserver.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-expanded'] });
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  window.addEventListener('popstate', () => requestAnimationFrame(() => enhance(root || document)));
  requestAnimationFrame(() => enhance(root || document));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
