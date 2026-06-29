import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const baseUrl = 'http://127.0.0.1:4175';
const failures = [];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assert(name, condition, detail = '') {
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`);
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

async function waitForUrl(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await delay(150);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class Cdp {
  constructor(url) { this.url = url; this.id = 0; this.pending = new Map(); }
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
  close() { this.socket?.close(); }
}

async function main() {
  const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { stdio: ['ignore', 'ignore', 'ignore'] });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'devovia-footer-'));
  const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions',
    '--disable-background-networking', '--remote-debugging-port=9228',
    `--user-data-dir=${profile}`, '--window-size=1440,1100', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  let client;
  try {
    await waitForUrl(baseUrl);
    await waitForUrl('http://127.0.0.1:9228/json/version');
    const target = await (await fetch(`http://127.0.0.1:9228/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' })).json();
    client = new Cdp(target.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    async function evaluate(expression) {
      const result = await client.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Evaluation failed');
      return result.result?.value;
    }

    for (const width of [1440, 768, 390]) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: width === 390 ? 844 : 1100,
        deviceScaleFactor: 1,
        mobile: width <= 768,
      });
      await client.send('Page.navigate', { url: baseUrl });
      await delay(500);
      const result = await evaluate(`(() => {
        const footer = document.querySelector('.dv-footer-grid');
        const groups = [...footer.children];
        const rects = groups.map((group) => {
          const rect = group.getBoundingClientRect();
          return { left: rect.left, top: rect.top, width: rect.width };
        });
        return { columns: getComputedStyle(footer).gridTemplateColumns, rects };
      })()`);

      if (width >= 768) {
        const sameRow = result.rects.slice(1).every((rect) => Math.abs(rect.top - result.rects[1].top) < 3);
        const ordered = result.rects.slice(1).every((rect, index, list) => index === 0 || rect.left > list[index - 1].left);
        assert(`${width}px footer menu headings share one row`, sameRow, JSON.stringify(result.rects));
        assert(`${width}px footer menu columns progress horizontally`, ordered, result.columns);
      } else {
        const brandAbove = result.rects.slice(1).every((rect) => rect.top > result.rects[0].top + 20);
        const firstTwoSideBySide = result.rects[2].left > result.rects[1].left;
        assert('390px footer brand remains above navigation', brandAbove, JSON.stringify(result.rects));
        assert('390px footer navigation uses compact side-by-side columns', firstTwoSideBySide, result.columns);
      }
    }
  } finally {
    client?.close();
    preview.kill('SIGTERM');
    chrome.kill('SIGTERM');
    await delay(200);
    fs.rmSync(profile, { recursive: true, force: true });
  }

  if (failures.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
