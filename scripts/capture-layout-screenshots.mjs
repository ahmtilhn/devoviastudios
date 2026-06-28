import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const baseUrl = 'http://127.0.0.1:4173';
const viewports = [
  { width: 390, height: 844, label: 'mobile' },
  { width: 1440, height: 1100, label: 'desktop' },
];
const routes = [
  '/', '/products', '/products/stock-manager', '/products/arrow-escape', '/products/daily-hadith', '/products/tinysteps',
  '/services', '/services/mobile-app-development', '/services/game-development', '/services/web-development',
  '/services/google-play-test-support', '/updates', '/blog',
  '/blog/google-play-closed-testing-checklist', '/blog/google-play-launch-checklist-indie-developers',
  '/blog/mobile-app-landing-page-trust', '/blog/offline-first-business-tools',
  '/blog/flutter-product-quality-release-notes', '/blog/indie-game-store-readiness',
  '/support', '/contact', '/privacy/', '/privacy/stock-manager/', '/privacy/daily-hadith/', '/privacy/tinysteps/', '/privacy/arrow-escape/',
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForUrl(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Preview is starting.
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
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket?.close();
  }
}

function fileSlug(route) {
  if (route === '/') return 'home';
  return route.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

async function main() {
  const output = path.resolve('card-layout-shots');
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });

  const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'devovia-layout-shots-'));
  const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions', '--disable-background-networking',
    '--remote-debugging-port=9226', `--user-data-dir=${profile}`, '--window-size=1440,1100', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  let client;
  try {
    await waitForUrl(baseUrl);
    await waitForUrl('http://127.0.0.1:9226/json/version');
    const target = await (await fetch(`http://127.0.0.1:9226/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' })).json();
    client = new Cdp(target.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    for (const viewport of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.width <= 768,
      });
      const directory = path.join(output, viewport.label);
      fs.mkdirSync(directory, { recursive: true });

      for (const route of routes) {
        await client.send('Page.navigate', { url: `${baseUrl}${route}` });
        await delay(420);
        await client.send('Runtime.evaluate', {
          expression: `Promise.all([
            document.fonts?.ready || Promise.resolve(),
            ...[...document.images].map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
              setTimeout(resolve, 1800);
            }))
          ])`,
          awaitPromise: true,
        });
        await client.send('Runtime.evaluate', {
          expression: `(async () => {
            const step = Math.max(window.innerHeight * .72, 420);
            const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
            for (let y = 0; y <= max; y += step) {
              window.scrollTo(0, y);
              await new Promise((resolve) => setTimeout(resolve, 55));
            }
            window.scrollTo(0, max);
            await new Promise((resolve) => setTimeout(resolve, 180));
            window.scrollTo(0, 0);
            const style = document.createElement('style');
            style.dataset.layoutQaCapture = 'true';
            style.textContent = '*,*::before,*::after{animation-play-state:paused!important;transition:none!important}';
            document.head.append(style);
            document.documentElement.classList.add('layout-qa-capture');
            await new Promise((resolve) => setTimeout(resolve, 220));
            return true;
          })()`,
          awaitPromise: true,
          returnByValue: true,
        });

        const metrics = await client.send('Page.getLayoutMetrics');
        const content = metrics.cssContentSize || metrics.contentSize;
        const capture = await client.send('Page.captureScreenshot', {
          format: 'jpeg',
          quality: 62,
          captureBeyondViewport: true,
          fromSurface: true,
          clip: {
            x: 0,
            y: 0,
            width: Math.min(content.width, viewport.width),
            height: Math.min(content.height, 14000),
            scale: 1,
          },
        });
        const targetPath = path.join(directory, `${fileSlug(route)}.jpg`);
        fs.writeFileSync(targetPath, Buffer.from(capture.data, 'base64'));
        console.log(`Captured ${viewport.label} ${route} -> ${targetPath}`);
      }
    }
  } finally {
    client?.close();
    preview.kill('SIGTERM');
    chrome.kill('SIGTERM');
    await delay(250);
    fs.rmSync(profile, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
