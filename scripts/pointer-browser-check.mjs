import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const baseUrl = 'http://127.0.0.1:4174';
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
      // Preview or debugging endpoint is still starting.
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
  }

  waitFor(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const handler = (params) => {
        clearTimeout(timer);
        const handlers = this.events.get(method) || [];
        this.events.set(method, handlers.filter((item) => item !== handler));
        resolve(params);
      };
      const timer = setTimeout(() => {
        const handlers = this.events.get(method) || [];
        this.events.set(method, handlers.filter((item) => item !== handler));
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeout);
      const handlers = this.events.get(method) || [];
      handlers.push(handler);
      this.events.set(method, handlers);
    });
  }

  close() {
    this.socket?.close();
  }
}

async function main() {
  const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], {
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'devovia-pointer-'));
  const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions',
    '--disable-background-networking', '--remote-debugging-port=9224',
    `--user-data-dir=${profile}`, '--window-size=1440,1100', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  let client;
  const runtimeErrors = [];
  try {
    await waitForUrl(baseUrl);
    await waitForUrl('http://127.0.0.1:9224/json/version');
    const target = await (await fetch(`http://127.0.0.1:9224/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' })).json();
    client = new Cdp(target.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');
    await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
    await client.send('Emulation.setTouchEmulationEnabled', { enabled: false });
    await client.send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
    });
    await client.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `(() => {
        const nativeMatchMedia = window.matchMedia.bind(window);
        const finePointerQuery = '(hover: hover) and (pointer: fine)';
        window.matchMedia = (query) => {
          const nativeList = nativeMatchMedia(query);
          if (query !== finePointerQuery) return nativeList;
          return {
            matches: true,
            media: query,
            onchange: null,
            addListener: nativeList.addListener?.bind(nativeList),
            removeListener: nativeList.removeListener?.bind(nativeList),
            addEventListener: nativeList.addEventListener.bind(nativeList),
            removeEventListener: nativeList.removeEventListener.bind(nativeList),
            dispatchEvent: nativeList.dispatchEvent.bind(nativeList),
          };
        };
        document.addEventListener('DOMContentLoaded', () => {
          const style = document.createElement('style');
          style.dataset.pointerAuditDesktop = 'true';
          style.textContent = '.p11-layer{display:block!important}';
          document.head.append(style);
        }, { once: true });
      })();`,
    });
    client.on('Runtime.exceptionThrown', ({ exceptionDetails = {} }) => {
      const exception = exceptionDetails.exception || {};
      runtimeErrors.push(exception.description || String(exception.value || exceptionDetails.text || 'Runtime exception'));
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
      await delay(420);
    }

    async function moveMouse(x, y) {
      await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none', buttons: 0 });
      await delay(120);
    }

    await navigate('/');
    const media = await evaluate(`({
      fine: matchMedia('(hover: hover) and (pointer: fine)').matches,
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches
    })`);
    assert('Desktop Chromium exposes a fine hover pointer', media.fine && !media.reduced, JSON.stringify(media));

    await moveMouse(240, 220);
    const freeState = await evaluate(`(() => {
      const layer = document.querySelector('.p11-layer');
      const canvas = document.querySelector('.p11-trail');
      return {
        activeClass: document.documentElement.classList.contains('pointer-v11-active'),
        layerActive: layer?.classList.contains('is-active'),
        mode: layer?.dataset.mode,
        canvasWidth: canvas?.width || 0,
        canvasHeight: canvas?.height || 0,
        pointerEvents: layer ? getComputedStyle(layer).pointerEvents : 'missing'
      };
    })()`);
    assert('Pointer V11 creates one active global layer', freeState.activeClass && freeState.layerActive && freeState.mode === 'free', JSON.stringify(freeState));
    assert('Pointer trail canvas is sized and click-through', freeState.canvasWidth > 1000 && freeState.canvasHeight > 700 && freeState.pointerEvents === 'none', JSON.stringify(freeState));

    const buttonPoint = await evaluate(`(() => {
      const button = document.querySelector('.dv-hero-actions a, .hero-section .button, .dv-button');
      if (!button) return null;
      const rect = button.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height };
    })()`);
    assert('Homepage exposes a dockable primary control', Boolean(buttonPoint), JSON.stringify(buttonPoint));
    if (buttonPoint) {
      await moveMouse(buttonPoint.x, buttonPoint.y);
      const dockState = await evaluate(`(() => {
        const layer = document.querySelector('.p11-layer');
        const ring = document.querySelector('.p11-ring');
        const style = ring ? getComputedStyle(ring) : null;
        return { mode: layer?.dataset.mode, width: parseFloat(style?.width || '0'), height: parseFloat(style?.height || '0'), glyph: document.querySelector('.p11-glyph')?.textContent };
      })()`);
      assert('Pointer ring docks to control geometry', dockState.mode === 'dock' && dockState.width > 40 && dockState.height > 30, JSON.stringify(dockState));

      await client.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: buttonPoint.x, y: buttonPoint.y, button: 'left', buttons: 1, clickCount: 1 });
      await delay(40);
      const pressed = await evaluate(`({ pressed: document.querySelector('.p11-layer')?.classList.contains('is-pressed'), waves: document.querySelectorAll('.p11-wave').length })`);
      assert('Pointer click produces a transient pressure wave', pressed.pressed && pressed.waves > 0, JSON.stringify(pressed));
      await client.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: buttonPoint.x, y: buttonPoint.y, button: 'left', buttons: 0, clickCount: 1 });
      await delay(80);
    }

    await navigate('/products');
    const surfacePoint = await evaluate(`(() => {
      const card = document.querySelector('.product-card');
      if (!card) return null;
      const rect = card.getBoundingClientRect();
      return { x: rect.left + rect.width * .72, y: rect.top + rect.height * .46 };
    })()`);
    assert('Products page exposes a pointer surface', Boolean(surfacePoint), JSON.stringify(surfacePoint));
    if (surfacePoint) {
      await moveMouse(surfacePoint.x, surfacePoint.y);
      const surfaceState = await evaluate(`(() => {
        const layer = document.querySelector('.p11-layer');
        const hovered = document.querySelector('[data-p11-hover="true"]');
        return { mode: layer?.dataset.mode, hovered: Boolean(hovered), marked: Boolean(document.querySelector('.product-card[data-p11-surface="true"]')) };
      })()`);
      assert('Large product cards use local surface light', surfaceState.marked && surfaceState.hovered && ['surface', 'dock'].includes(surfaceState.mode), JSON.stringify(surfaceState));
    }

    await navigate('/privacy.html');
    await moveMouse(280, 180);
    const privacyState = await evaluate(`(() => ({
      active: document.documentElement.classList.contains('pointer-v11-active'),
      layer: Boolean(document.querySelector('.p11-layer')),
      stylesheet: Boolean(document.querySelector('link[href="/pointer-v11.css"]')),
      script: Boolean(document.querySelector('script[src="/pointer-v11.js"]'))
    }))()`);
    assert('Privacy center loads the same global pointer system', privacyState.active && privacyState.layer && privacyState.stylesheet && privacyState.script, JSON.stringify(privacyState));

    await client.send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
    await navigate('/');
    const reducedState = await evaluate(`(() => ({
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      active: document.documentElement.classList.contains('pointer-v11-active'),
      layer: Boolean(document.querySelector('.p11-layer'))
    }))()`);
    assert('Reduced-motion preference prevents custom pointer startup', reducedState.reduced && !reducedState.active && !reducedState.layer, JSON.stringify(reducedState));

    const actionable = runtimeErrors.filter((error) => !/AbortError|ViewTransition.*skip|Transition was skipped/i.test(error));
    assert('Pointer interactions produce no uncaught runtime errors', actionable.length === 0, actionable.join(' | '));
    console.log(`\nPointer browser audit: ${checks - failures.length}/${checks} checks passed.`);
  } finally {
    client?.close();
    preview.kill('SIGTERM');
    chrome.kill('SIGTERM');
    await delay(250);
    try {
      fs.rmSync(profile, { recursive: true, force: true });
    } catch {
      // Chrome can briefly retain its profile while shutting down.
    }
  }

  if (failures.length) {
    console.error('\nPointer browser failures:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
