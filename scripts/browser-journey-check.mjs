import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const baseUrl = 'http://127.0.0.1:4173';
const failures = [];
let assertions = 0;

function check(name, condition, detail = '') {
  assertions += 1;
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForUrl(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // Service is still starting.
    }
    await delay(200);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class CdpClient {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      const handlers = this.listeners.get(message.method) || [];
      handlers.forEach((handler) => handler(message.params));
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, handler) {
    const handlers = this.listeners.get(method) || [];
    handlers.push(handler);
    this.listeners.set(method, handlers);
    return () => this.listeners.set(method, handlers.filter((item) => item !== handler));
  }

  waitFor(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const off = this.on(method, (params) => {
        clearTimeout(timer);
        off();
        resolve(params);
      });
      const timer = setTimeout(() => {
        off();
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeout);
    });
  }

  close() {
    this.socket?.close();
  }
}

async function main() {
  const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  preview.stdout.on('data', (chunk) => process.stdout.write(`[preview] ${chunk}`));
  preview.stderr.on('data', (chunk) => process.stderr.write(`[preview] ${chunk}`));

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devovia-chrome-'));
  const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-background-networking',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1100',
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  chrome.stderr.on('data', () => {});

  let client;
  const runtimeErrors = [];
  try {
    await waitForUrl(baseUrl);
    await waitForUrl('http://127.0.0.1:9222/json/version');
    const targetResponse = await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' });
    const target = await targetResponse.json();
    client = new CdpClient(target.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Log.enable');
    client.on('Runtime.exceptionThrown', (params) => runtimeErrors.push(params.exceptionDetails?.text || 'Runtime exception'));

    async function evaluate(expression) {
      const result = await client.send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
        userGesture: true,
      });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Evaluation failed');
      return result.result?.value;
    }

    async function navigate(route) {
      const loaded = client.waitFor('Page.loadEventFired').catch(() => null);
      await client.send('Page.navigate', { url: `${baseUrl}${route}` });
      await loaded;
      await delay(260);
    }

    const routes = [
      '/', '/products', '/products/stock-manager', '/products/arrow-escape', '/products/daily-hadith', '/products/tinysteps',
      '/services', '/services/mobile-app-development', '/services/game-development', '/services/web-development',
      '/services/google-play-test-support', '/updates', '/blog',
      '/blog/google-play-closed-testing-checklist', '/blog/google-play-launch-checklist-indie-developers',
      '/blog/mobile-app-landing-page-trust', '/blog/offline-first-business-tools',
      '/blog/flutter-product-quality-release-notes', '/blog/indie-game-store-readiness',
      '/support', '/contact', '/privacy.html', '/privacy/app-1.html', '/privacy/app-2.html', '/privacy/app-3.html', '/privacy/app-4.html',
    ];

    const internalTargets = new Set();
    let anchorCount = 0;
    let buttonCount = 0;

    for (const route of routes) {
      const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' });
      check(`HTTP route ${route}`, response.status >= 200 && response.status < 400, String(response.status));
      await navigate(route);
      const snapshot = await evaluate(`(() => {
        const visible = (element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        };
        const anchors = [...document.querySelectorAll('a[href]')].map((anchor) => ({
          href: anchor.href,
          raw: anchor.getAttribute('href'),
          text: anchor.textContent.replace(/\\s+/g, ' ').trim(),
          target: anchor.target,
          rel: anchor.rel,
          visible: visible(anchor),
        }));
        const buttons = [...document.querySelectorAll('button')].map((button) => ({
          text: button.textContent.replace(/\\s+/g, ' ').trim(),
          label: button.getAttribute('aria-label') || '',
          visible: visible(button),
          disabled: button.disabled,
        }));
        return {
          title: document.title,
          heading: document.querySelector('h1,h2')?.textContent?.trim() || '',
          bodyLength: document.body.innerText.trim().length,
          anchors,
          buttons,
          brokenImages: [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
          oldPolicies: anchors.filter((a) => a.href.includes('sites.google.com/view/devoviastudio/privacy-policy')).map((a) => a.href),
          appAds: anchors.filter((a) => /app-ads\\.txt/i.test(a.href)).map((a) => a.href),
          hashErrors: anchors.filter((a) => a.raw?.startsWith('#') && !document.getElementById(a.raw.slice(1))).map((a) => a.raw),
        };
      })()`);

      check(`${route} has a title`, Boolean(snapshot.title));
      check(`${route} has a visible page heading`, Boolean(snapshot.heading));
      check(`${route} renders meaningful content`, snapshot.bodyLength > 80, String(snapshot.bodyLength));
      check(`${route} has no broken loaded images`, snapshot.brokenImages.length === 0, snapshot.brokenImages.join(', '));
      check(`${route} has no old Google policy link`, snapshot.oldPolicies.length === 0, snapshot.oldPolicies.join(', '));
      check(`${route} exposes no app-ads link`, snapshot.appAds.length === 0, snapshot.appAds.join(', '));
      check(`${route} hash links point to real targets`, snapshot.hashErrors.length === 0, snapshot.hashErrors.join(', '));

      anchorCount += snapshot.anchors.length;
      buttonCount += snapshot.buttons.length;
      for (const anchor of snapshot.anchors) {
        if (!anchor.visible) continue;
        check(`${route} anchor has an accessible label`, Boolean(anchor.text || anchor.raw?.startsWith('#')), anchor.raw || anchor.href);
        if (anchor.target === '_blank') {
          check(`${route} external tab link is isolated`, /noopener|noreferrer/.test(anchor.rel), anchor.href);
        }
        const url = new URL(anchor.href);
        if (url.origin === baseUrl && !url.hash) internalTargets.add(url.pathname + url.search);
        if (url.protocol === 'mailto:') check(`${route} mail link is valid`, url.pathname.includes('@'), anchor.href);
      }
      for (const button of snapshot.buttons.filter((item) => item.visible)) {
        check(`${route} button has an accessible label`, Boolean(button.text || button.label));
      }
    }

    for (const target of internalTargets) {
      const response = await fetch(`${baseUrl}${target}`, { redirect: 'manual' });
      check(`Internal destination ${target}`, response.status >= 200 && response.status < 400, String(response.status));
    }

    await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await navigate('/');
    const mobileMenu = await evaluate(`(() => {
      const button = document.querySelector('.dv-menu');
      button?.click();
      const opened = button?.getAttribute('aria-expanded') === 'true' && document.querySelector('#dv-primary-navigation')?.classList.contains('is-open');
      button?.click();
      const closed = button?.getAttribute('aria-expanded') === 'false' && !document.querySelector('#dv-primary-navigation')?.classList.contains('is-open');
      return { opened, closed };
    })()`);
    check('Mobile menu opens', mobileMenu.opened);
    check('Mobile menu closes', mobileMenu.closed);

    await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
    await navigate('/');
    const homeHash = await evaluate(`(async () => {
      document.querySelector('a[href="#products"]')?.click();
      await new Promise((resolve) => setTimeout(resolve, 160));
      return location.hash === '#products' && Boolean(document.getElementById('products'));
    })()`);
    check('Home product CTA reaches the product section', homeHash);

    await navigate('/products');
    const modifierResult = await evaluate(`(async () => {
      const before = location.pathname;
      const anchor = document.querySelector('.product-card a[href^="/products/"]');
      anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true, view: window }));
      await new Promise((resolve) => setTimeout(resolve, 120));
      return { before, after: location.pathname };
    })()`);
    check('Ctrl/Cmd product click does not hijack the current tab', modifierResult.before === modifierResult.after, `${modifierResult.before} -> ${modifierResult.after}`);

    const filterResult = await evaluate(`(() => {
      const results = [];
      for (const button of document.querySelectorAll('.filter-row button')) {
        button.click();
        results.push({ label: button.textContent.trim(), active: button.classList.contains('active'), content: document.querySelectorAll('.product-card, .support-product-card').length });
      }
      return results;
    })()`);
    for (const result of filterResult) check(`Products filter ${result.label}`, result.active && result.content > 0, JSON.stringify(result));

    await navigate('/products');
    const transitionResult = await evaluate(`(async () => {
      const supported = typeof document.startViewTransition === 'function';
      window.__transitionCalls = 0;
      if (supported) {
        const original = document.startViewTransition.bind(document);
        document.startViewTransition = (callback) => {
          window.__transitionCalls += 1;
          return original(callback);
        };
      }
      document.querySelector('.product-card a[href^="/products/"]')?.click();
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { supported, calls: window.__transitionCalls, path: location.pathname };
    })()`);
    check('Product button navigates to its detail route', /^\/products\/.+/.test(transitionResult.path) && transitionResult.path !== '/products', transitionResult.path);
    if (transitionResult.supported) check('SPA product transition invokes View Transition API', transitionResult.calls > 0, String(transitionResult.calls));

    await navigate('/updates');
    const updateFilters = await evaluate(`(() => [...document.querySelectorAll('.filter-row button')].map((button) => { button.click(); return { label: button.textContent.trim(), active: button.classList.contains('active'), count: document.querySelectorAll('.update-card, .story-card, .launch-support-row').length }; }))()`);
    for (const result of updateFilters) check(`Updates filter ${result.label}`, result.active && result.count > 0, JSON.stringify(result));

    await navigate('/blog');
    const blogFilters = await evaluate(`(() => [...document.querySelectorAll('.filter-row button')].map((button) => { button.click(); return { label: button.textContent.trim(), active: button.classList.contains('active'), count: document.querySelectorAll('.blog-card').length }; }))()`);
    for (const result of blogFilters) check(`Blog filter ${result.label}`, result.active && result.count > 0, JSON.stringify(result));

    await navigate('/services/google-play-test-support');
    const serviceHashes = await evaluate(`(() => [...document.querySelectorAll('a[href^="#"]')].map((anchor) => ({ hash: anchor.getAttribute('href'), exists: Boolean(document.getElementById(anchor.getAttribute('href').slice(1))) })))()`);
    for (const result of serviceHashes) check(`Test Support target ${result.hash}`, result.exists);

    for (const route of ['/support', '/contact']) {
      await navigate(route);
      const formResult = await evaluate(`(() => {
        const form = document.querySelector('form');
        const invalidBefore = form ? !form.checkValidity() : false;
        form?.querySelectorAll('input[required], textarea[required]').forEach((field) => {
          field.value = field.type === 'email' ? 'audit@example.com' : 'Automated interaction audit';
          field.dispatchEvent(new Event('input', { bubbles: true }));
        });
        form?.querySelectorAll('select[required]').forEach((field) => { field.selectedIndex = 1; field.dispatchEvent(new Event('change', { bubbles: true })); });
        return { exists: Boolean(form), invalidBefore, validAfter: form?.checkValidity() || false };
      })()`);
      check(`${route} form exists`, formResult.exists);
      check(`${route} form blocks empty submission`, formResult.invalidBefore);
      check(`${route} form accepts valid required fields`, formResult.validAfter);
    }

    await client.send('Emulation.setScriptExecutionDisabled', { value: true });
    for (const [route, marker] of [
      ['/privacy/app-1.html', '22. Contact'],
      ['/privacy/app-2.html', 'Terms of Service'],
      ['/privacy/app-4.html', '21. Contact'],
    ]) {
      await navigate(route);
      const readable = await evaluate(`document.body.innerText.includes(${JSON.stringify(marker)})`);
      check(`${route} remains readable without JavaScript`, readable, marker);
    }
    await client.send('Emulation.setScriptExecutionDisabled', { value: false });

    check('No uncaught browser runtime errors', runtimeErrors.length === 0, runtimeErrors.join(' | '));
    console.log(`\nBrowser journey summary: ${assertions - failures.length}/${assertions} checks passed across ${routes.length} routes, ${anchorCount} anchors and ${buttonCount} buttons.`);
  } finally {
    client?.close();
    preview.kill('SIGTERM');
    chrome.kill('SIGTERM');
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }

  if (failures.length) {
    console.error('\nBrowser journey failures:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
