import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const baseUrl = 'http://127.0.0.1:4173';
const routes = [
  '/products/stock-manager',
  '/products/arrow-escape',
  '/products/daily-hadith',
  '/products/tinysteps',
];
const widths = [320, 390];
const failures = [];
let checks = 0;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assert(name, condition, detail = '') {
  checks += 1;
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`);
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
}

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

async function main() {
  const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'devovia-composition-'));
  const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions', '--disable-background-networking',
    '--remote-debugging-port=9227', `--user-data-dir=${profile}`, '--window-size=390,844', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  let client;
  try {
    await waitForUrl(baseUrl);
    await waitForUrl('http://127.0.0.1:9227/json/version');
    const target = await (await fetch(`http://127.0.0.1:9227/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' })).json();
    client = new Cdp(target.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    async function evaluate(expression) {
      const response = await client.send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || 'Evaluation failed');
      return response.result?.value;
    }

    for (const width of widths) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true,
      });

      for (const route of routes) {
        await client.send('Page.navigate', { url: `${baseUrl}${route}` });
        await delay(520);
        const result = await evaluate(`(() => {
          const hero = document.querySelector('.v7-product-hero');
          const visual = hero?.querySelector('.detail-device-row');
          const devices = visual ? [...visual.querySelectorAll('.device')].filter((item) => getComputedStyle(item).display !== 'none') : [];
          const stage = document.querySelector('.v7-stage-column');
          const chapters = [...document.querySelectorAll('.v7-feature-chapter')];
          const chapterStyles = chapters.map((chapter) => {
            const style = getComputedStyle(chapter);
            return {
              minHeight: parseFloat(style.minHeight) || 0,
              paddingTop: parseFloat(style.paddingTop) || 0,
              paddingBottom: parseFloat(style.paddingBottom) || 0,
              overflowY: style.overflowY,
              scrollHeight: chapter.scrollHeight,
              clientHeight: chapter.clientHeight,
            };
          });
          const cards = [...document.querySelectorAll('.product-card,.service-card,.support-product-card,.reason-card,.story-card,.blog-card,.faq-card,.glass-panel')];
          return {
            heroHeight: hero?.getBoundingClientRect().height || 0,
            visualHeight: visual?.getBoundingClientRect().height || 0,
            visualOverflowX: visual ? visual.scrollWidth - visual.clientWidth : 0,
            deviceCount: devices.length,
            stagePosition: stage ? getComputedStyle(stage).position : '',
            maxChapterMinHeight: chapterStyles.reduce((max, item) => Math.max(max, item.minHeight), 0),
            maxChapterPaddingTop: chapterStyles.reduce((max, item) => Math.max(max, item.paddingTop), 0),
            maxChapterPaddingBottom: chapterStyles.reduce((max, item) => Math.max(max, item.paddingBottom), 0),
            clippedChapters: chapterStyles.filter((item) => item.overflowY !== 'visible' && item.scrollHeight > item.clientHeight + 2).length,
            pageOverflowX: document.documentElement.scrollWidth - window.innerWidth,
            oversizedCards: cards.filter((card) => card.getBoundingClientRect().width > window.innerWidth + 2).length,
          };
        })()`);

        const label = `${width}px ${route}`;
        assert(`${label} hero remains compact`, result.heroHeight > 0 && result.heroHeight <= 1400, `${Math.round(result.heroHeight)}px`);
        assert(`${label} visual is bounded`, result.visualHeight >= 300 && result.visualHeight <= 430, `${Math.round(result.visualHeight)}px`);
        assert(`${label} visual has no horizontal overflow`, result.visualOverflowX <= 2, `${Math.round(result.visualOverflowX)}px`);
        assert(`${label} uses at most two visible devices`, result.deviceCount > 0 && result.deviceCount <= 2, String(result.deviceCount));
        assert(`${label} mobile stage is not sticky`, result.stagePosition !== 'sticky', result.stagePosition);
        assert(`${label} chapters have no forced viewport min-height`, result.maxChapterMinHeight <= 2, `${Math.round(result.maxChapterMinHeight)}px`);
        assert(`${label} chapter top padding is compact`, result.maxChapterPaddingTop <= 40, `${Math.round(result.maxChapterPaddingTop)}px`);
        assert(`${label} chapter bottom padding is compact`, result.maxChapterPaddingBottom <= 40, `${Math.round(result.maxChapterPaddingBottom)}px`);
        assert(`${label} chapter content is not clipped`, result.clippedChapters === 0, String(result.clippedChapters));
        assert(`${label} page has no horizontal overflow`, result.pageOverflowX <= 2, `${Math.round(result.pageOverflowX)}px`);
        assert(`${label} cards fit viewport`, result.oversizedCards === 0, String(result.oversizedCards));
      }
    }
  } finally {
    client?.close();
    preview.kill('SIGTERM');
    chrome.kill('SIGTERM');
    await delay(250);
    fs.rmSync(profile, { recursive: true, force: true });
  }

  console.log(`\nCard composition audit: ${checks - failures.length}/${checks} checks passed.`);
  if (failures.length) {
    console.error('\nComposition failures:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
