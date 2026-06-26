const ROOT_SELECTOR = '.dv-site';
const MOTION_CLASS = 'has-immersive-motion';

const ZONES = [
  { selector: '.dv-hero', name: 'hero', primary: [59, 130, 246], secondary: [139, 92, 246] },
  { selector: '#services', name: 'services', primary: [14, 165, 233], secondary: [34, 211, 238] },
  { selector: '#products', name: 'products', primary: [124, 58, 237], secondary: [59, 130, 246] },
  { selector: '.dv-process-section', name: 'process', primary: [139, 92, 246], secondary: [236, 72, 153] },
  { selector: '.dv-updates', name: 'updates', primary: [14, 165, 233], secondary: [16, 185, 129] },
  { selector: '.dv-about', name: 'about', primary: [34, 211, 238], secondary: [99, 102, 241] },
  { selector: '.dv-cta-section', name: 'cta', primary: [99, 102, 241], secondary: [236, 72, 153] },
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
  ['.dv-hero-copy', 0.055],
  ['.dv-hero-showcase', -0.08],
  ['.dv-showcase-badge', -0.14],
  ['.dv-section-head', 0.035],
  ['.dv-product-visual', -0.05],
  ['.dv-product-copy', 0.035],
  ['.dv-process-intro', 0.04],
  ['.dv-about-visual', -0.05],
  ['.dv-about-copy', 0.035],
  ['.dv-cta-orb', -0.09],
];

const TILT_SELECTOR = [
  '.dv-service-card',
  '.dv-product',
  '.dv-update-card',
  '.dv-process-grid article',
  '.dv-about-visual',
].join(',');

const MAGNETIC_SELECTOR = [
  '.dv-button',
  '.dv-nav-cta',
  '.dv-text-link',
  '.dv-service-card > a',
  '.dv-update-action',
].join(',');

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(current, target, amount) {
  return current + (target - current) * amount;
}

function setRgbVariables(site, primary, secondary) {
  site.style.setProperty('--zone-r', primary[0]);
  site.style.setProperty('--zone-g', primary[1]);
  site.style.setProperty('--zone-b', primary[2]);
  site.style.setProperty('--zone2-r', secondary[0]);
  site.style.setProperty('--zone2-g', secondary[1]);
  site.style.setProperty('--zone2-b', secondary[2]);
}

function installImmersiveMotion(site) {
  if (site.dataset.immersiveMotion === 'ready') return () => {};

  site.dataset.immersiveMotion = 'ready';
  site.classList.add(MOTION_CLASS);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const interactivePointer = finePointer.matches && !reducedMotion.matches;

  const overlay = document.createElement('div');
  overlay.className = 'dv-motion-v2';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="dv-zone-wash"></div>
    <div class="dv-aurora-field">
      <i class="dv-aurora-ribbon ribbon-a"></i>
      <i class="dv-aurora-ribbon ribbon-b"></i>
      <i class="dv-aurora-ribbon ribbon-c"></i>
    </div>
    <div class="dv-pointer-orbit orbit-large"></div>
    <div class="dv-pointer-orbit orbit-small"></div>
    <div class="dv-particle-field"></div>
    <div class="dv-film-grain"></div>
    <div class="dv-scroll-progress" role="presentation"><span></span></div>
  `;
  site.prepend(overlay);

  const zones = ZONES.map((config) => {
    const element = site.querySelector(config.selector);
    if (!element) return null;
    element.dataset.motionZone = config.name;
    element.style.setProperty('--zone-local-r', config.primary[0]);
    element.style.setProperty('--zone-local-g', config.primary[1]);
    element.style.setProperty('--zone-local-b', config.primary[2]);
    return { ...config, element };
  }).filter(Boolean);

  if (zones.length) {
    site.dataset.activeZone = zones[0].name;
    setRgbVariables(site, zones[0].primary, zones[0].secondary);
  }

  const revealElements = [];
  REVEAL_GROUPS.forEach((selector) => {
    site.querySelectorAll(selector).forEach((element, index) => {
      if (element.classList.contains('motion-reveal')) return;
      element.classList.add('motion-reveal');
      element.style.setProperty('--reveal-index', String(index % 8));
      element.style.setProperty('--reveal-delay', `${(index % 8) * 62}ms`);
      revealElements.push(element);
    });
  });

  const revealObserver = reducedMotion.matches
    ? null
    : new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  revealElements.forEach((element) => {
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add('is-visible');
  });

  const parallaxElements = [];
  PARALLAX_RULES.forEach(([selector, depth]) => {
    site.querySelectorAll(selector).forEach((element) => {
      element.dataset.parallaxDepth = String(depth);
      parallaxElements.push(element);
    });
  });

  const tiltElements = Array.from(site.querySelectorAll(TILT_SELECTOR));
  tiltElements.forEach((element) => element.classList.add('motion-tilt'));

  const magneticElements = Array.from(site.querySelectorAll(MAGNETIC_SELECTOR));
  magneticElements.forEach((element) => element.classList.add('motion-magnetic'));

  const pointer = {
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.34,
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.34,
    previousX: window.innerWidth * 0.5,
    previousY: window.innerHeight * 0.34,
    speed: 0,
    angle: 0,
    active: false,
  };

  let activeZone = zones[0] || null;
  let scrollFrame = 0;
  let pointerFrame = 0;
  let animationFrame = 0;
  let lastScrollY = window.scrollY;
  let scrollDirection = 1;

  function activateZone(zone) {
    if (!zone || zone === activeZone) return;
    activeZone = zone;
    site.dataset.activeZone = zone.name;
    setRgbVariables(site, zone.primary, zone.secondary);
  }

  function zoneFromPoint(x, y) {
    const target = document.elementFromPoint(x, y);
    const section = target?.closest?.('[data-motion-zone]');
    if (!section) return null;
    return zones.find((zone) => zone.element === section) || null;
  }

  function closestZoneToViewportCenter() {
    const center = window.innerHeight * 0.46;
    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    zones.forEach((zone) => {
      const rect = zone.element.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height * 0.5;
      const distance = Math.abs(sectionCenter - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = zone;
      }
    });

    return best;
  }

  function updateScrollEffects() {
    scrollFrame = 0;
    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = clamp(scrollY / maxScroll, 0, 1);
    scrollDirection = scrollY >= lastScrollY ? 1 : -1;
    lastScrollY = scrollY;

    site.style.setProperty('--scroll-progress', progress.toFixed(4));
    site.style.setProperty('--scroll-y', `${scrollY}px`);
    site.style.setProperty('--scroll-direction', String(scrollDirection));
    site.classList.toggle('is-scrolled', scrollY > 28);

    if (!pointer.active) activateZone(closestZoneToViewportCenter());

    if (!reducedMotion.matches) {
      parallaxElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const centerOffset = rect.top + rect.height * 0.5 - window.innerHeight * 0.5;
        const depth = Number.parseFloat(element.dataset.parallaxDepth || '0');
        const y = clamp(centerOffset * depth * -0.16, -34, 34);
        element.style.setProperty('--parallax-y', `${y.toFixed(2)}px`);
      });
    }
  }

  function requestScrollUpdate() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollEffects);
  }

  function updatePointerTarget(event) {
    pointer.active = true;
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;

    window.clearTimeout(pointerFrame);
    pointerFrame = window.setTimeout(() => {
      pointer.active = false;
      activateZone(closestZoneToViewportCenter());
    }, 1250);

    const zone = zoneFromPoint(event.clientX, event.clientY);
    if (zone) activateZone(zone);
  }

  function animatePointer() {
    pointer.x = lerp(pointer.x, pointer.targetX, 0.115);
    pointer.y = lerp(pointer.y, pointer.targetY, 0.115);

    const deltaX = pointer.x - pointer.previousX;
    const deltaY = pointer.y - pointer.previousY;
    const rawSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    pointer.speed = lerp(pointer.speed, clamp(rawSpeed, 0, 42), 0.18);
    pointer.angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    pointer.previousX = pointer.x;
    pointer.previousY = pointer.y;

    const nx = pointer.x / Math.max(window.innerWidth, 1) - 0.5;
    const ny = pointer.y / Math.max(window.innerHeight, 1) - 0.5;

    site.style.setProperty('--motion-x', `${pointer.x.toFixed(2)}px`);
    site.style.setProperty('--motion-y', `${pointer.y.toFixed(2)}px`);
    site.style.setProperty('--motion-nx', nx.toFixed(4));
    site.style.setProperty('--motion-ny', ny.toFixed(4));
    site.style.setProperty('--motion-speed', pointer.speed.toFixed(2));
    site.style.setProperty('--motion-angle', `${pointer.angle.toFixed(2)}deg`);
    site.style.setProperty('--motion-depth-x', `${(nx * 18).toFixed(2)}px`);
    site.style.setProperty('--motion-depth-y', `${(ny * 14).toFixed(2)}px`);
    site.style.setProperty('--motion-depth-x-reverse', `${(nx * -14).toFixed(2)}px`);
    site.style.setProperty('--motion-depth-y-reverse', `${(ny * -11).toFixed(2)}px`);
    site.style.setProperty('--motion-orbit-large', `${(260 + pointer.speed * 4).toFixed(2)}px`);
    site.style.setProperty('--motion-orbit-small', `${(82 + pointer.speed * 1.8).toFixed(2)}px`);
    site.style.setProperty('--motion-orbit-opacity', clamp(0.22 + pointer.speed * 0.009, 0.22, 0.62).toFixed(3));
    site.style.setProperty('--motion-aurora-angle', `${(pointer.angle * 0.025).toFixed(2)}deg`);
    site.style.setProperty('--motion-cta-angle', `${(pointer.angle * 0.018).toFixed(2)}deg`);

    animationFrame = window.requestAnimationFrame(animatePointer);
  }

  function handleTiltMove(event) {
    if (!interactivePointer) return;
    const card = event.target.closest(TILT_SELECTOR);
    if (!card || !site.contains(card)) return;

    const rect = card.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    const rotateY = (x - 0.5) * 5.2;
    const rotateX = (0.5 - y) * 4.4;

    card.style.setProperty('--card-rx', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--card-ry', `${rotateY.toFixed(2)}deg`);
    card.style.setProperty('--card-glow-x', `${(x * 100).toFixed(1)}%`);
    card.style.setProperty('--card-glow-y', `${(y * 100).toFixed(1)}%`);
    card.classList.add('is-pointer-over');
  }

  function handlePointerOut(event) {
    const card = event.target.closest?.(TILT_SELECTOR);
    if (card && !card.contains(event.relatedTarget)) {
      card.style.setProperty('--card-rx', '0deg');
      card.style.setProperty('--card-ry', '0deg');
      card.classList.remove('is-pointer-over');
    }

    const magnetic = event.target.closest?.(MAGNETIC_SELECTOR);
    if (magnetic && !magnetic.contains(event.relatedTarget)) {
      magnetic.style.setProperty('--magnet-x', '0px');
      magnetic.style.setProperty('--magnet-y', '0px');
    }
  }

  function handleMagneticMove(event) {
    if (!interactivePointer) return;
    const element = event.target.closest(MAGNETIC_SELECTOR);
    if (!element || !site.contains(element)) return;

    const rect = element.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width * 0.5);
    const dy = event.clientY - (rect.top + rect.height * 0.5);
    const strength = element.classList.contains('dv-button') ? 0.14 : 0.1;

    element.style.setProperty('--magnet-x', `${clamp(dx * strength, -8, 8).toFixed(2)}px`);
    element.style.setProperty('--magnet-y', `${clamp(dy * strength, -6, 6).toFixed(2)}px`);
  }

  function handlePointerMove(event) {
    updatePointerTarget(event);
    handleTiltMove(event);
    handleMagneticMove(event);
  }

  function handleResize() {
    pointer.targetX = clamp(pointer.targetX, 0, window.innerWidth);
    pointer.targetY = clamp(pointer.targetY, 0, window.innerHeight);
    requestScrollUpdate();
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });

  if (interactivePointer) {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    animationFrame = window.requestAnimationFrame(animatePointer);
  } else {
    site.classList.add('motion-static');
  }

  updateScrollEffects();

  return () => {
    revealObserver?.disconnect();
    window.cancelAnimationFrame(scrollFrame);
    window.cancelAnimationFrame(animationFrame);
    window.clearTimeout(pointerFrame);
    window.removeEventListener('scroll', requestScrollUpdate);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerout', handlePointerOut);

    revealElements.forEach((element) => {
      element.classList.remove('motion-reveal', 'is-visible');
      element.style.removeProperty('--reveal-index');
      element.style.removeProperty('--reveal-delay');
    });

    parallaxElements.forEach((element) => {
      delete element.dataset.parallaxDepth;
      element.style.removeProperty('--parallax-y');
    });

    tiltElements.forEach((element) => {
      element.classList.remove('motion-tilt', 'is-pointer-over');
      element.style.removeProperty('--card-rx');
      element.style.removeProperty('--card-ry');
      element.style.removeProperty('--card-glow-x');
      element.style.removeProperty('--card-glow-y');
    });

    magneticElements.forEach((element) => {
      element.classList.remove('motion-magnetic');
      element.style.removeProperty('--magnet-x');
      element.style.removeProperty('--magnet-y');
    });

    zones.forEach((zone) => delete zone.element.dataset.motionZone);
    overlay.remove();
    site.classList.remove(MOTION_CLASS, 'motion-static', 'is-scrolled');
    delete site.dataset.immersiveMotion;
    delete site.dataset.activeZone;
  };
}

let teardown = null;
let bootstrapObserver = null;

function bootstrap() {
  if (window.location.pathname.replace(/\/+$/, '') !== '') return true;
  const site = document.querySelector(ROOT_SELECTOR);
  if (!site) return false;

  teardown?.();
  teardown = installImmersiveMotion(site);
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
