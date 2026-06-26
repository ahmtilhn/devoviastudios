const ROOT_SELECTOR = '.dv-site';

const ZONES = [
  { selector: '.dv-hero', name: 'hero', primary: [59, 130, 246], secondary: [139, 92, 246], nav: null },
  { selector: '#services', name: 'services', primary: [14, 165, 233], secondary: [34, 211, 238], nav: '#services' },
  { selector: '#products', name: 'products', primary: [124, 58, 237], secondary: [59, 130, 246], nav: '#products' },
  { selector: '.dv-process-section', name: 'process', primary: [139, 92, 246], secondary: [236, 72, 153], nav: null },
  { selector: '.dv-updates', name: 'updates', primary: [14, 165, 233], secondary: [16, 185, 129], nav: '/updates' },
  { selector: '.dv-about', name: 'about', primary: [34, 211, 238], secondary: [99, 102, 241], nav: '#about' },
  { selector: '.dv-cta-section', name: 'cta', primary: [99, 102, 241], secondary: [236, 72, 153], nav: '/contact' },
];

const REVEAL_GROUPS = [
  '.dv-hero-copy > *',
  '.dv-hero-showcase',
  '.dv-capability-strip',
  '.dv-section-head > *',
  '.dv-service-card',
  '.dv-product',
  '.dv-process-intro > *',
  '.dv-process-grid article',
  '.dv-update-card',
  '.dv-about-visual',
  '.dv-about-copy > *',
  '.dv-cta-card > *:not(.dv-cta-orb)',
  '.dv-footer-grid > *',
];

const PARALLAX_RULES = [
  ['.dv-hero-copy', 0.035],
  ['.dv-hero-showcase', -0.055],
  ['.dv-section-head', 0.022],
  ['.dv-process-intro', 0.026],
  ['.dv-about-copy', 0.022],
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function setPalette(site, primary, secondary) {
  site.style.setProperty('--zone-r', primary[0]);
  site.style.setProperty('--zone-g', primary[1]);
  site.style.setProperty('--zone-b', primary[2]);
  site.style.setProperty('--zone2-r', secondary[0]);
  site.style.setProperty('--zone2-g', secondary[1]);
  site.style.setProperty('--zone2-b', secondary[2]);
}

function createOverlay(site) {
  const overlay = document.createElement('div');
  overlay.className = 'dv-motion-v4';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="dv-v4-wash"></div>
    <div class="dv-v4-pointer"></div>
    <div class="dv-v4-grid"></div>
    <div class="dv-v4-noise"></div>
    <div class="dv-v4-progress"></div>
  `;
  site.prepend(overlay);
  return overlay;
}

function installMotion(site) {
  if (site.dataset.motionV4 === 'ready') return () => {};
  site.dataset.motionV4 = 'ready';
  site.classList.add('has-motion-v4');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const overlay = createOverlay(site);
  const navLinks = Array.from(site.querySelectorAll('.dv-nav-links a'));

  const zones = ZONES.map((config) => {
    const element = site.querySelector(config.selector);
    if (!element) return null;
    element.dataset.motionZone = config.name;
    element.style.setProperty('--zone-local-r', config.primary[0]);
    element.style.setProperty('--zone-local-g', config.primary[1]);
    element.style.setProperty('--zone-local-b', config.primary[2]);
    return { ...config, element };
  }).filter(Boolean);

  const products = Array.from(site.querySelectorAll('.dv-product'));
  const revealElements = [];
  const parallaxElements = [];

  REVEAL_GROUPS.forEach((selector) => {
    site.querySelectorAll(selector).forEach((element, index) => {
      if (element.classList.contains('v4-reveal')) return;
      element.classList.add('v4-reveal');
      element.style.setProperty('--v4-delay', `${Math.min(index % 7, 6) * 54}ms`);
      revealElements.push(element);
    });
  });

  PARALLAX_RULES.forEach(([selector, depth]) => {
    site.querySelectorAll(selector).forEach((element) => {
      element.dataset.parallaxDepth = String(depth);
      parallaxElements.push(element);
    });
  });

  const revealObserver = reducedMotion
    ? null
    : new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealElements.forEach((element) => {
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add('is-visible');
  });

  let activeZone = zones[0] || null;
  let scrollFrame = 0;
  let lastScrollY = window.scrollY;
  let velocity = 0;

  function setActiveNavigation(zone) {
    navLinks.forEach((link) => {
      const active = Boolean(zone?.nav && link.getAttribute('href') === zone.nav);
      if (active) link.dataset.motionActive = 'true';
      else delete link.dataset.motionActive;
    });
  }

  function activateZone(zone) {
    if (!zone || zone === activeZone) return;
    activeZone = zone;
    site.dataset.activeZone = zone.name;
    setPalette(site, zone.primary, zone.secondary);
    setActiveNavigation(zone);
  }

  function updateZoneProgress(viewportHeight) {
    let closest = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    zones.forEach((zone) => {
      const rect = zone.element.getBoundingClientRect();
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
      const center = rect.top + rect.height * 0.5;
      const distance = Math.abs(center - viewportHeight * 0.46);
      zone.element.style.setProperty('--zone-progress', progress.toFixed(4));
      zone.element.classList.toggle('is-motion-zone-active', distance < viewportHeight * 0.42);
      if (distance < closestDistance) {
        closest = zone;
        closestDistance = distance;
      }
    });

    activateZone(closest);
  }

  function updateProductProgress(viewportHeight) {
    products.forEach((product) => {
      const rect = product.getBoundingClientRect();
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
      const centerDistance = Math.abs(rect.top + rect.height * 0.5 - viewportHeight * 0.5);
      product.style.setProperty('--product-progress', progress.toFixed(4));
      product.classList.toggle('is-motion-active', centerDistance < viewportHeight * 0.48);
    });
  }

  function updateParallax(viewportHeight) {
    if (reducedMotion) return;
    parallaxElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const depth = Number.parseFloat(element.dataset.parallaxDepth || '0');
      const centerOffset = rect.top + rect.height * 0.5 - viewportHeight * 0.5;
      const offset = clamp(centerOffset * depth * -0.17, -24, 24);
      element.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
    });
  }

  function updateScroll() {
    scrollFrame = 0;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const maxScroll = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
    const progress = clamp(scrollY / maxScroll, 0, 1);
    const delta = scrollY - lastScrollY;
    velocity += (clamp(Math.abs(delta) / 42, 0, 1) - velocity) * 0.24;
    lastScrollY = scrollY;

    site.style.setProperty('--scroll-progress', progress.toFixed(4));
    site.style.setProperty('--scroll-velocity', velocity.toFixed(4));
    site.classList.toggle('is-scrolled', scrollY > 26);

    updateZoneProgress(viewportHeight);
    updateProductProgress(viewportHeight);
    updateParallax(viewportHeight);
  }

  function requestScrollUpdate() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScroll);
  }

  const resizeObserver = new ResizeObserver(requestScrollUpdate);
  resizeObserver.observe(site);
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });

  setPalette(site, zones[0]?.primary || [59, 130, 246], zones[0]?.secondary || [139, 92, 246]);
  setActiveNavigation(zones[0]);
  updateScroll();

  return () => {
    revealObserver?.disconnect();
    resizeObserver.disconnect();
    window.cancelAnimationFrame(scrollFrame);
    window.removeEventListener('scroll', requestScrollUpdate);
    window.removeEventListener('resize', requestScrollUpdate);

    revealElements.forEach((element) => {
      element.classList.remove('v4-reveal', 'is-visible');
      element.style.removeProperty('--v4-delay');
    });
    parallaxElements.forEach((element) => {
      delete element.dataset.parallaxDepth;
      element.style.removeProperty('--parallax-y');
    });
    products.forEach((product) => {
      product.classList.remove('is-motion-active');
      product.style.removeProperty('--product-progress');
    });
    zones.forEach((zone) => {
      delete zone.element.dataset.motionZone;
      zone.element.classList.remove('is-motion-zone-active');
      zone.element.style.removeProperty('--zone-progress');
    });
    navLinks.forEach((link) => delete link.dataset.motionActive);
    overlay.remove();
    site.classList.remove('has-motion-v4', 'is-scrolled');
    delete site.dataset.motionV4;
    delete site.dataset.activeZone;
  };
}

let teardown = null;
let bootstrapObserver = null;

function bootstrap() {
  if ((window.location.pathname.replace(/\/+$/, '') || '/') !== '/') return true;
  const site = document.querySelector(ROOT_SELECTOR);
  if (!site) return false;
  teardown?.();
  teardown = installMotion(site);
  bootstrapObserver?.disconnect();
  bootstrapObserver = null;
  return true;
}

if (!bootstrap()) {
  bootstrapObserver = new MutationObserver(() => bootstrap());
  bootstrapObserver.observe(document.documentElement, { childList: true, subtree: true });
}

window.addEventListener('pagehide', () => {
  teardown?.();
  bootstrapObserver?.disconnect();
}, { once: true });
