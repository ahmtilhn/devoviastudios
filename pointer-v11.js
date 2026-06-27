(() => {
  if (window.__DEVOVIA_POINTER_V11__) return;
  window.__DEVOVIA_POINTER_V11__ = true;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)');
  const nativeSelector = 'input, textarea, select, option, [contenteditable="true"], iframe, video[controls], .monaco-editor, [data-native-cursor]';
  const dockSelector = 'a[href], button:not([disabled]), [role="button"], summary, label[for], [data-pointer-dock]';
  const surfaceSelector = [
    '.product-card', '.dv-product', '.service-card', '.dv-service-card',
    '.update-card', '.dv-update-card', '.story-card', '.blog-card',
    '.glass-panel', '.faq-card', '.reason-card', '.support-app-card',
    '.support-product-card', '.request-panel', '.test-teaser',
    '.privacy-summary-card', '.privacy-card', '.privacy-app-card',
    '.privacy-status-visual', '[data-m10-surface]', '[data-pointer-surface]',
  ].join(', ');

  if (location.pathname === '/admin' || reducedMotion?.matches || !finePointer?.matches) return;

  let layer;
  let canvas;
  let context;
  let aura;
  let ring;
  let core;
  let glyph;
  let mutationObserver;
  let animationFrame = 0;
  let resizeFrame = 0;
  let dockFrame = 0;
  let started = false;
  let currentSurface = null;
  let currentDock = null;
  let dpr = 1;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let paletteTick = 0;

  const state = {
    pointerX: viewportWidth * .5,
    pointerY: viewportHeight * .35,
    coreX: viewportWidth * .5,
    coreY: viewportHeight * .35,
    ringX: viewportWidth * .5,
    ringY: viewportHeight * .35,
    auraX: viewportWidth * .5,
    auraY: viewportHeight * .35,
    inputX: viewportWidth * .5,
    inputY: viewportHeight * .35,
    inputTime: performance.now(),
    velocityX: 0,
    velocityY: 0,
    speed: 0,
    angle: 0,
    mode: 'free',
    active: false,
    pressed: false,
    dockRect: null,
    lastTimestamp: null,
    primary: [59, 130, 246],
    secondary: [139, 92, 246],
  };

  const trailPoints = Array.from({ length: 11 }, () => ({ x: state.pointerX, y: state.pointerY }));

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const frameEase = (base, deltaFrames) => 1 - Math.pow(base, deltaFrames);

  function createLayer() {
    layer = document.createElement('div');
    layer.className = 'p11-layer';
    layer.dataset.mode = 'free';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `
      <canvas class="p11-trail"></canvas>
      <span class="p11-aura"></span>
      <span class="p11-ring">
        <span class="p11-glyph">→</span>
        <span class="p11-satellite s1"></span>
        <span class="p11-satellite s2"></span>
      </span>
      <span class="p11-core"></span>
    `;
    document.body.append(layer);
    canvas = layer.querySelector('.p11-trail');
    context = canvas.getContext('2d', { alpha: true, desynchronized: true });
    aura = layer.querySelector('.p11-aura');
    ring = layer.querySelector('.p11-ring');
    core = layer.querySelector('.p11-core');
    glyph = layer.querySelector('.p11-glyph');
    root.classList.add('pointer-v11-active');
    resizeCanvas();
    readPalette();
  }

  function parseChannel(value, fallback) {
    const parsed = Number.parseFloat(String(value).trim());
    return Number.isFinite(parsed) ? clamp(parsed, 0, 255) : fallback;
  }

  function parseTriplet(value) {
    const channels = String(value).trim().split(/[\s,]+/).map(Number).filter(Number.isFinite);
    return channels.length >= 3 ? channels.slice(0, 3).map((channel) => clamp(channel, 0, 255)) : null;
  }

  function readPalette() {
    const style = getComputedStyle(root);
    const privacy = parseTriplet(style.getPropertyValue('--privacy-theme-rgb'));
    const m10Primary = [
      parseChannel(style.getPropertyValue('--m10-r'), 59),
      parseChannel(style.getPropertyValue('--m10-g'), 130),
      parseChannel(style.getPropertyValue('--m10-b'), 246),
    ];
    const m10Secondary = [
      parseChannel(style.getPropertyValue('--m10-r2'), 139),
      parseChannel(style.getPropertyValue('--m10-g2'), 92),
      parseChannel(style.getPropertyValue('--m10-b2'), 246),
    ];
    state.primary = privacy || m10Primary;
    state.secondary = privacy
      ? [clamp(privacy[0] * .55 + 90, 0, 255), clamp(privacy[1] * .55 + 70, 0, 255), clamp(privacy[2] * .55 + 100, 0, 255)]
      : m10Secondary;
    layer.style.setProperty('--p11-r', state.primary[0].toFixed(0));
    layer.style.setProperty('--p11-g', state.primary[1].toFixed(0));
    layer.style.setProperty('--p11-b', state.primary[2].toFixed(0));
    layer.style.setProperty('--p11-r2', state.secondary[0].toFixed(0));
    layer.style.setProperty('--p11-g2', state.secondary[1].toFixed(0));
    layer.style.setProperty('--p11-b2', state.secondary[2].toFixed(0));
  }

  function resizeCanvas() {
    resizeFrame = 0;
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.max(1, Math.round(viewportWidth * dpr));
    canvas.height = Math.max(1, Math.round(viewportHeight * dpr));
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${viewportHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    scheduleDockRefresh();
  }

  function scheduleResize() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(resizeCanvas);
  }

  function registerSurfaces(scope = document) {
    scope.querySelectorAll?.(surfaceSelector).forEach((element) => {
      element.dataset.p11Surface = 'true';
    });
  }

  function clearSurface() {
    if (!currentSurface) return;
    delete currentSurface.dataset.p11Hover;
    currentSurface = null;
  }

  function updateSurface(target, clientX, clientY) {
    const surface = target?.closest?.(surfaceSelector);
    if (surface !== currentSurface) {
      clearSurface();
      currentSurface = surface || null;
      if (currentSurface) currentSurface.dataset.p11Hover = 'true';
    }
    if (!currentSurface) return;
    const rect = currentSurface.getBoundingClientRect();
    const x = ((clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const y = ((clientY - rect.top) / Math.max(rect.height, 1)) * 100;
    currentSurface.style.setProperty('--p11-local-x', `${clamp(x, 0, 100).toFixed(2)}%`);
    currentSurface.style.setProperty('--p11-local-y', `${clamp(y, 0, 100).toFixed(2)}%`);
  }

  function glyphFor(element) {
    if (!element) return '→';
    if (element.matches('a[target="_blank"], a[rel~="external"]')) return '↗';
    if (element.matches('summary')) return '+';
    if (element.matches('button[type="submit"], .button.primary, .dv-button-primary, .privacy-button.primary')) return '↗';
    if (element.closest('.filter-row')) return '•';
    return '→';
  }

  function setRingGeometry(width, height, radius) {
    const safeWidth = clamp(width, 30, 340);
    const safeHeight = clamp(height, 30, 132);
    ring.style.width = `${safeWidth.toFixed(2)}px`;
    ring.style.height = `${safeHeight.toFixed(2)}px`;
    ring.style.marginLeft = `${(-safeWidth * .5).toFixed(2)}px`;
    ring.style.marginTop = `${(-safeHeight * .5).toFixed(2)}px`;
    ring.style.borderRadius = `${clamp(radius, 16, 999).toFixed(2)}px`;
    ring.style.setProperty('--p11-orbit-radius', `${Math.max(safeWidth, safeHeight) * .5 + 5}px`);
  }

  function setMode(mode, element = null) {
    if (state.mode === mode && currentDock === element) return;
    state.mode = mode;
    currentDock = element;
    layer.dataset.mode = mode;
    root.dataset.pointerV11Mode = mode;

    if (mode === 'dock' && element) {
      refreshDockRect();
      glyph.textContent = glyphFor(element);
      return;
    }

    state.dockRect = null;
    if (mode === 'surface') setRingGeometry(48, 48, 999);
    else setRingGeometry(34, 34, 999);
  }

  function refreshDockRect() {
    dockFrame = 0;
    if (!currentDock || !currentDock.isConnected) {
      setMode(currentSurface ? 'surface' : 'free');
      return;
    }
    const rect = currentDock.getBoundingClientRect();
    const visible = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
    if (!visible || rect.width > 330 || rect.height > 122) {
      setMode(currentSurface ? 'surface' : 'free');
      return;
    }
    const style = getComputedStyle(currentDock);
    const parsedRadius = Number.parseFloat(style.borderTopLeftRadius) || Math.min(rect.height * .5, 22);
    state.dockRect = rect;
    setRingGeometry(rect.width + 12, rect.height + 12, parsedRadius + 6);
  }

  function scheduleDockRefresh() {
    if (state.mode !== 'dock' || dockFrame) return;
    dockFrame = requestAnimationFrame(refreshDockRect);
  }

  function targetMode(target) {
    if (!target || target.closest?.(nativeSelector)) return ['native', null];
    const dock = target.closest?.(dockSelector);
    if (dock) return ['dock', dock];
    const surface = target.closest?.(surfaceSelector);
    if (surface) return ['surface', null];
    return ['free', null];
  }

  function handlePointerMove(event) {
    const samples = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : null;
    const point = samples?.length ? samples[samples.length - 1] : event;
    const now = performance.now();
    const elapsed = Math.max(now - state.inputTime, 1);
    const dx = point.clientX - state.inputX;
    const dy = point.clientY - state.inputY;
    const scale = 16.667 / elapsed;
    const nextVelocityX = dx * scale;
    const nextVelocityY = dy * scale;
    state.velocityX += (nextVelocityX - state.velocityX) * .34;
    state.velocityY += (nextVelocityY - state.velocityY) * .34;
    state.inputX = point.clientX;
    state.inputY = point.clientY;
    state.inputTime = now;
    state.pointerX = point.clientX;
    state.pointerY = point.clientY;
    state.active = true;

    root.style.setProperty('--p11-pointer-x', `${point.clientX}px`);
    root.style.setProperty('--p11-pointer-y', `${point.clientY}px`);
    updateSurface(event.target, point.clientX, point.clientY);
    const [mode, element] = targetMode(event.target);
    setMode(mode, element);
    layer.classList.add('is-active');
  }

  function handlePointerOver(event) {
    const [mode, element] = targetMode(event.target);
    setMode(mode, element);
    updateSurface(event.target, state.pointerX, state.pointerY);
  }

  function handlePointerOut(event) {
    if (event.relatedTarget) return;
    clearSurface();
    setMode('hidden');
    layer.classList.remove('is-active');
    state.active = false;
  }

  function createWave(x, y) {
    const wave = document.createElement('span');
    wave.className = 'p11-wave';
    wave.style.transform = `translate3d(${x}px, ${y}px, 0) scale(.45)`;
    layer.append(wave);
    const animation = wave.animate([
      { opacity: .72, transform: `translate3d(${x}px, ${y}px, 0) scale(.45)` },
      { opacity: 0, transform: `translate3d(${x}px, ${y}px, 0) scale(4.8)` },
    ], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
    animation.finished.then(() => wave.remove(), () => wave.remove());
  }

  function handlePointerDown(event) {
    if (state.mode === 'native' || event.button !== 0) return;
    state.pressed = true;
    layer.classList.add('is-pressed');
    createWave(event.clientX, event.clientY);
  }

  function handlePointerUp() {
    state.pressed = false;
    layer.classList.remove('is-pressed');
  }

  function hidePointer() {
    state.active = false;
    clearSurface();
    setMode('hidden');
    layer.classList.remove('is-active', 'is-pressed');
  }

  function updateTrail(deltaFrames) {
    const headEase = frameEase(.34, deltaFrames);
    trailPoints[0].x += (state.pointerX - trailPoints[0].x) * headEase;
    trailPoints[0].y += (state.pointerY - trailPoints[0].y) * headEase;
    for (let index = 1; index < trailPoints.length; index += 1) {
      const follow = frameEase(clamp(.68 + index * .018, .68, .86), deltaFrames);
      trailPoints[index].x += (trailPoints[index - 1].x - trailPoints[index].x) * follow;
      trailPoints[index].y += (trailPoints[index - 1].y - trailPoints[index].y) * follow;
    }
  }

  function drawTrail() {
    context.clearRect(0, 0, viewportWidth, viewportHeight);
    if (!state.active || state.mode === 'native' || state.speed < .22) return;

    const tail = trailPoints[trailPoints.length - 1];
    const head = trailPoints[0];
    const gradient = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
    const speedAlpha = clamp(state.speed / 32, 0, 1);
    gradient.addColorStop(0, `rgba(${state.secondary[0]}, ${state.secondary[1]}, ${state.secondary[2]}, 0)`);
    gradient.addColorStop(.52, `rgba(${state.secondary[0]}, ${state.secondary[1]}, ${state.secondary[2]}, ${(.05 + speedAlpha * .08).toFixed(3)})`);
    gradient.addColorStop(1, `rgba(${state.primary[0]}, ${state.primary[1]}, ${state.primary[2]}, ${(.12 + speedAlpha * .18).toFixed(3)})`);

    context.save();
    context.beginPath();
    context.moveTo(tail.x, tail.y);
    for (let index = trailPoints.length - 2; index > 0; index -= 1) {
      const point = trailPoints[index];
      const next = trailPoints[index - 1];
      const middleX = (point.x + next.x) * .5;
      const middleY = (point.y + next.y) * .5;
      context.quadraticCurveTo(point.x, point.y, middleX, middleY);
    }
    context.quadraticCurveTo(head.x, head.y, state.pointerX, state.pointerY);
    context.strokeStyle = gradient;
    context.lineWidth = 1.15 + speedAlpha * 2.6;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.shadowBlur = 12 + speedAlpha * 18;
    context.shadowColor = `rgba(${state.primary[0]}, ${state.primary[1]}, ${state.primary[2]}, ${(.08 + speedAlpha * .16).toFixed(3)})`;
    context.stroke();
    context.restore();
  }

  function animate(timestamp) {
    const elapsed = state.lastTimestamp == null ? 16.667 : clamp(timestamp - state.lastTimestamp, 4, 42);
    state.lastTimestamp = timestamp;
    const deltaFrames = elapsed / 16.667;

    const speedTarget = Math.hypot(state.velocityX, state.velocityY);
    state.speed += (speedTarget - state.speed) * frameEase(.72, deltaFrames);
    state.velocityX *= Math.pow(.82, deltaFrames);
    state.velocityY *= Math.pow(.82, deltaFrames);
    if (state.speed > .04) state.angle = Math.atan2(state.velocityY, state.velocityX) * 180 / Math.PI;

    const coreEase = frameEase(.12, deltaFrames);
    state.coreX += (state.pointerX - state.coreX) * coreEase;
    state.coreY += (state.pointerY - state.coreY) * coreEase;

    let ringTargetX = state.pointerX;
    let ringTargetY = state.pointerY;
    if (state.mode === 'dock' && state.dockRect) {
      ringTargetX = state.dockRect.left + state.dockRect.width * .5;
      ringTargetY = state.dockRect.top + state.dockRect.height * .5;
    }
    const ringEase = frameEase(state.mode === 'dock' ? .76 : .66, deltaFrames);
    state.ringX += (ringTargetX - state.ringX) * ringEase;
    state.ringY += (ringTargetY - state.ringY) * ringEase;

    const auraEase = frameEase(.86, deltaFrames);
    state.auraX += (state.pointerX - state.auraX) * auraEase;
    state.auraY += (state.pointerY - state.auraY) * auraEase;

    const stretch = state.mode === 'free' ? clamp(state.speed / 42, 0, .34) : 0;
    const ringTransform = state.mode === 'dock'
      ? `translate3d(${state.ringX.toFixed(2)}px, ${state.ringY.toFixed(2)}px, 0)`
      : `translate3d(${state.ringX.toFixed(2)}px, ${state.ringY.toFixed(2)}px, 0) rotate(${state.angle.toFixed(2)}deg) scale(${(1 + stretch).toFixed(3)}, ${(1 - stretch * .42).toFixed(3)})`;
    ring.style.transform = ringTransform;
    core.style.transform = `translate3d(${state.coreX.toFixed(2)}px, ${state.coreY.toFixed(2)}px, 0)`;
    aura.style.transform = `translate3d(${state.auraX.toFixed(2)}px, ${state.auraY.toFixed(2)}px, 0) scale(${(1 + clamp(state.speed / 90, 0, .18)).toFixed(3)})`;

    updateTrail(deltaFrames);
    drawTrail();
    paletteTick += 1;
    if (paletteTick % 18 === 0) readPalette();
    animationFrame = requestAnimationFrame(animate);
  }

  function handleVisibility() {
    if (document.hidden) hidePointer();
  }

  function start() {
    if (started || reducedMotion?.matches || !finePointer?.matches || location.pathname === '/admin') return;
    started = true;
    createLayer();
    registerSurfaces();
    mutationObserver = new MutationObserver((records) => {
      const target = records.find((record) => record.addedNodes.length)?.target;
      registerSurfaces(target instanceof Element ? target : document);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('pointerout', handlePointerOut, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('pointercancel', handlePointerUp, { passive: true });
    window.addEventListener('resize', scheduleResize, { passive: true });
    window.addEventListener('scroll', scheduleDockRefresh, { passive: true });
    window.addEventListener('blur', hidePointer);
    document.addEventListener('visibilitychange', handleVisibility);
    animationFrame = requestAnimationFrame(animate);
  }

  function destroy() {
    mutationObserver?.disconnect();
    cancelAnimationFrame(animationFrame);
    cancelAnimationFrame(resizeFrame);
    cancelAnimationFrame(dockFrame);
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerover', handlePointerOver);
    document.removeEventListener('pointerout', handlePointerOut);
    document.removeEventListener('pointerdown', handlePointerDown);
    document.removeEventListener('pointerup', handlePointerUp);
    document.removeEventListener('pointercancel', handlePointerUp);
    window.removeEventListener('resize', scheduleResize);
    window.removeEventListener('scroll', scheduleDockRefresh);
    window.removeEventListener('blur', hidePointer);
    document.removeEventListener('visibilitychange', handleVisibility);
    clearSurface();
    layer?.remove();
    root.classList.remove('pointer-v11-active');
    delete root.dataset.pointerV11Mode;
    started = false;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();

  window.addEventListener('pageshow', (event) => {
    if (event.persisted && !started) start();
  });
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) destroy();
  });
})();
