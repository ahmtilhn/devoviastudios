import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const baseUrl = 'http://127.0.0.1:4173';
const failures = [];
let checks = 0;

function assert(name, condition, detail = '') {
  checks += 1;
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`);
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForUrl(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Keep polling while the process starts.
    }
    await delay(150);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class Cdp {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
    this.events = new Map();
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
      (this.events.get(message.method) || []).forEach((handler) => handler(message.params));
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
    const handlers = this.events.get(method) || [];
    handlers.push(handler);
    this.events.set(method, handlers);
    return () => this.events.set(method, handlers.filter((item) => item !== handler));
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
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'devovia-focused-'));
  const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions',
    '--disable-background-networking', '--remote-debugging-port=9223',
    `--user-data-dir=${profile}`, '--window-size=1440,1100', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  let client;
  const runtimeErrors = [];
  try {
    await waitForUrl(baseUrl);
    await waitForUrl('http://127.0.0.1:9223/json/version');
    const target = await (await fetch(`http://127.0.0.1:9223/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' })).json();
    client = new Cdp(target.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');
    client.on('Runtime.exceptionThrown', ({ exceptionDetails = {} }) => {
      const exception = exceptionDetails.exception || {};
      const description = exception.description || String(exception.value || exceptionDetails.text || 'Runtime exception');
      runtimeErrors.push(description);
    });

    async function evaluate(expression) {
      const result = await client.send('Runtime.evaluate', {
        expression, returnByValue: true, awaitPromise: true, userGesture: true,
      });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Evaluation failed');
      return result.result?.value;
    }

    async function navigate(route) {
      const loaded = client.waitFor('Page.loadEventFired').catch(() => null);
      await client.send('Page.navigate', { url: `${baseUrl}${route}` });
      await loaded;
      await delay(320);
    }

    async function navigateToCanonical(route, expectedPath, timeout = 5000) {
      await client.send('Page.navigate', { url: `${baseUrl}${route}` });
      const started = Date.now();
      let currentPath = '';
      while (Date.now() - started < timeout) {
        try {
          currentPath = await evaluate('location.pathname.replace(/\\/+$/, "") || "/"');
          if (currentPath === expectedPath) return currentPath;
        } catch {
          // The execution context can be replaced while a redirect is committing.
        }
        await delay(100);
      }
      return currentPath;
    }

    await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await navigate('/');
    const menu = await evaluate(`(async () => {
      const button = document.querySelector('.dv-menu');
      button.click();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const opened = button.getAttribute('aria-expanded') === 'true' && document.querySelector('#dv-primary-navigation').classList.contains('is-open');
      button.click();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const closed = button.getAttribute('aria-expanded') === 'false' && !document.querySelector('#dv-primary-navigation').classList.contains('is-open');
      return { opened, closed };
    })()`);
    assert('Mobile menu opens after React paint', menu.opened);
    assert('Mobile menu closes after React paint', menu.closed);

    await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });

    async function testFilters(route, contentSelector, labels) {
      await navigate(route);
      const results = await evaluate(`(async () => {
        const results = [];
        const buttons = [...document.querySelectorAll('.filter-row button')]
          .filter((button) => !button.hidden && getComputedStyle(button).display !== 'none');
        for (const button of buttons) {
          button.click();
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          results.push({
            label: button.textContent.trim(),
            active: button.classList.contains('active'),
            count: document.querySelectorAll(${JSON.stringify(contentSelector)}).length,
          });
        }
        return results;
      })()`);
      for (const label of labels) {
        const result = results.find((item) => item.label === label);
        assert(`${route} filter ${label}`, Boolean(result?.active && result.count > 0), JSON.stringify(result));
      }
    }

    await navigate('/products');
    const utilityHidden = await evaluate(`(() => {
      const button = [...document.querySelectorAll('.filter-row button')].find((item) => item.textContent.trim() === 'Utility');
      return Boolean(button?.hidden && button.getAttribute('aria-hidden') === 'true');
    })()`);
    assert('Products page hides the empty Utility filter', utilityHidden);

    await testFilters('/products', '.product-card, .support-product-card', ['All', 'Productivity', 'Games', 'Spiritual', 'Launch Systems']);
    await testFilters('/updates', '.update-card, .story-card, .launch-support-row', ['All', 'Stock Manager', 'Arrow Escape', 'Daily Hadith', 'TinySteps', 'Studio']);
    await testFilters('/blog', '.blog-card', ['All', 'Google Play', 'Flutter', 'Mobile Apps', 'Game Development', 'UI/UX', 'Product Launch']);

    await navigate('/products');
    runtimeErrors.length = 0;
    const transition = await evaluate(`(async () => {
      const supported = typeof document.startViewTransition === 'function';
      window.__transitionCalls = 0;
      if (supported) {
        const original = document.startViewTransition.bind(document);
        document.startViewTransition = (callback) => {
          window.__transitionCalls += 1;
          return original(callback);
        };
      }
      document.querySelector('.product-card a[href^="/products/"]').click();
      await new Promise((resolve) => setTimeout(resolve, 700));
      const forwardPath = location.pathname;
      history.back();
      await new Promise((resolve) => setTimeout(resolve, 550));
      return { supported, calls: window.__transitionCalls, forwardPath, backPath: location.pathname };
    })()`);
    assert('Product CTA opens a detail page', /^\/products\/.+/.test(transition.forwardPath) && transition.forwardPath !== '/products', transition.forwardPath);
    assert('Browser back returns to products', transition.backPath === '/products', transition.backPath);
    if (transition.supported) assert('View Transition API runs for SPA navigation', transition.calls > 0, String(transition.calls));

    await client.send('Emulation.setScriptExecutionDisabled', { value: true });
    for (const [route, marker] of [
      ['/privacy/stock-manager/', '22. Contact'],
      ['/privacy/daily-hadith/', 'Terms of Service'],
      ['/privacy/arrow-escape/', '21. Contact'],
    ]) {
      await navigate(route);
      const documentNode = await client.send('DOM.getDocument', { depth: 1, pierce: true });
      const { outerHTML } = await client.send('DOM.getOuterHTML', { nodeId: documentNode.root.nodeId });
      assert(`${route.replace(/\/$/, '')} is complete without JavaScript`, outerHTML.includes(marker), marker);
    }
    await client.send('Emulation.setScriptExecutionDisabled', { value: false });

    for (const [legacyRoute, canonicalRoute] of [
      ['/privacy.html', '/privacy'],
      ['/privacy/app-1.html', '/privacy/stock-manager'],
      ['/privacy/app-2.html', '/privacy/daily-hadith'],
      ['/privacy/app-3.html', '/privacy/tinysteps'],
      ['/privacy/app-4.html', '/privacy/arrow-escape'],
      ['/projects/stockflow-inventory', '/products/stock-manager'],
    ]) {
      const finalPath = await navigateToCanonical(legacyRoute, canonicalRoute);
      assert(`${legacyRoute} redirects to ${canonicalRoute}`, finalPath === canonicalRoute, finalPath);
    }

    const actionable = runtimeErrors.filter((error) => !/AbortError|ViewTransition.*skip|Transition was skipped/i.test(error));
    assert('Interactions produce no uncaught runtime errors', actionable.length === 0, actionable.join(' | '));

    console.log(`\nFocused interaction audit: ${checks - failures.length}/${checks} checks passed.`);
  } finally {
    client?.close();
    preview.kill('SIGTERM');
    chrome.kill('SIGTERM');
    await delay(250);
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {
      // Chrome can briefly retain profile files while shutting down.
    }
  }

  if (failures.length) {
    console.error('\nFocused failures:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
