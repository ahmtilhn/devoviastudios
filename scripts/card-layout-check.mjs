import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const baseUrl = 'http://127.0.0.1:4173';
const widths = [320, 390, 768, 1440];
const routes = [
  '/', '/products', '/products/stock-manager', '/products/arrow-escape', '/products/daily-hadith', '/products/tinysteps',
  '/services', '/services/mobile-app-development', '/services/game-development', '/services/web-development',
  '/services/google-play-test-support', '/updates', '/blog',
  '/blog/google-play-closed-testing-checklist', '/blog/google-play-launch-checklist-indie-developers',
  '/blog/mobile-app-landing-page-trust', '/blog/offline-first-business-tools',
  '/blog/flutter-product-quality-release-notes', '/blog/indie-game-store-readiness',
  '/support', '/contact', '/privacy/', '/privacy/stock-manager/', '/privacy/daily-hadith/', '/privacy/tinysteps/', '/privacy/arrow-escape/',
];

const issues = [];
let assertions = 0;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForUrl(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Preview is still starting.
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

  close() {
    this.socket?.close();
  }
}

function printResult(route, width, result) {
  assertions += 1;
  const ok = result.issues.length === 0;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${width}px ${route}  cards=${result.cardCount} issues=${result.issues.length}`);
  for (const issue of result.issues) {
    const enriched = { route, width, ...issue };
    issues.push(enriched);
    console.log(`  - ${issue.type}: ${issue.card} :: ${issue.detail}`);
  }
}

async function main() {
  const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'devovia-card-layout-'));
  const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-extensions', '--disable-background-networking',
    '--remote-debugging-port=9225', `--user-data-dir=${profile}`, '--window-size=1440,1100', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  let client;
  try {
    await waitForUrl(baseUrl);
    await waitForUrl('http://127.0.0.1:9225/json/version');
    const target = await (await fetch(`http://127.0.0.1:9225/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' })).json();
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
        height: width <= 390 ? 844 : width <= 768 ? 1024 : 1100,
        deviceScaleFactor: 1,
        mobile: width <= 768,
      });

      for (const route of routes) {
        await client.send('Page.navigate', { url: `${baseUrl}${route}` });
        await delay(260);
        await evaluate(`document.fonts?.ready || Promise.resolve()`);
        await delay(80);

        const result = await evaluate(`(() => {
          const cardSelector = [
            '.dv-service-card', '.dv-product', '.dv-process-grid article', '.dv-update-card', '.dv-cta-card',
            '.product-card', '.service-card', '.support-product-card', '.reason-card', '.update-card', '.story-card',
            '.launch-support-row', '.support-app-card', '.faq-card', '.blog-card', '.glass-panel', '.test-teaser',
            '.request-panel', '.final-cta', '.privacy-summary-card', '.privacy-card', '.privacy-app-card',
            '.privacy-status-visual', '.capability-strip article'
          ].join(',');
          const textSelector = 'h1,h2,h3,p,li,time,a,button,strong,label';
          const mediaSelector = 'img,.product-visual,.dv-product-visual,.detail-device-row,.gallery-row';
          const allowedClipSelector = '.product-visual,.dv-product-visual,.detail-device-row,.gallery-row,.dv-hero-showcase,.dv-about-visual';
          const decorativeSelector = '[aria-hidden="true"],.dv-device-caption,.dv-showcase-badge,.dv-floating-icon,.dv-product-stage,.dv-product-glow,.privacy-float-chip';
          const visible = (element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.01 && rect.width > 1 && rect.height > 1;
          };
          const nameOf = (element) => {
            const classes = [...element.classList].slice(0, 3).join('.');
            return classes ? element.tagName.toLowerCase() + '.' + classes : element.tagName.toLowerCase();
          };
          const outside = (inner, outer, tolerance = 3) => inner.left < outer.left - tolerance || inner.right > outer.right + tolerance || inner.top < outer.top - tolerance || inner.bottom > outer.bottom + tolerance;
          const intersection = (a, b) => {
            const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
            const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
            return { width, height, area: width * height };
          };
          const localIssues = [];
          const cards = [...document.querySelectorAll(cardSelector)].filter(visible);

          if (document.documentElement.scrollWidth > window.innerWidth + 3) {
            localIssues.push({
              type: 'page-horizontal-overflow',
              card: 'document',
              detail: 'scrollWidth=' + document.documentElement.scrollWidth + ' viewport=' + window.innerWidth,
            });
          }

          for (const card of cards) {
            const cardRect = card.getBoundingClientRect();
            const cardName = nameOf(card);
            const texts = [...card.querySelectorAll(textSelector)].filter((element) => visible(element) && !element.closest(decorativeSelector));
            const media = [...card.querySelectorAll(mediaSelector)].filter((element) => visible(element) && !element.closest(decorativeSelector));

            for (const element of texts) {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              const hasOwnConstraint = style.overflow !== 'visible' || style.maxWidth !== 'none' || style.whiteSpace === 'nowrap';
              if (hasOwnConstraint && (element.scrollWidth > element.clientWidth + 3 || element.scrollHeight > element.clientHeight + 3)) {
                localIssues.push({
                  type: 'text-clipped',
                  card: cardName,
                  detail: nameOf(element) + ' scroll=' + element.scrollWidth + 'x' + element.scrollHeight + ' client=' + element.clientWidth + 'x' + element.clientHeight,
                });
              }
              const allowedClip = element.closest(allowedClipSelector);
              if (!allowedClip && outside(rect, cardRect)) {
                localIssues.push({
                  type: 'content-outside-card',
                  card: cardName,
                  detail: nameOf(element) + ' rect=' + [rect.left, rect.top, rect.right, rect.bottom].map(Math.round).join(','),
                });
              }
            }

            for (const element of media) {
              const rect = element.getBoundingClientRect();
              const allowedClip = element.closest(allowedClipSelector);
              if (!allowedClip && outside(rect, cardRect, 5)) {
                localIssues.push({
                  type: 'media-outside-card',
                  card: cardName,
                  detail: nameOf(element) + ' rect=' + [rect.left, rect.top, rect.right, rect.bottom].map(Math.round).join(','),
                });
              }
            }

            for (let i = 0; i < texts.length; i += 1) {
              const a = texts[i];
              const aRect = a.getBoundingClientRect();
              for (let j = i + 1; j < texts.length; j += 1) {
                const b = texts[j];
                if (a.contains(b) || b.contains(a)) continue;
                const aDisplay = getComputedStyle(a).display;
                const bDisplay = getComputedStyle(b).display;
                if (aDisplay.startsWith('inline') && bDisplay.startsWith('inline')) continue;
                const hit = intersection(aRect, b.getBoundingClientRect());
                if (hit.width > 4 && hit.height > 4 && hit.area > 24) {
                  localIssues.push({
                    type: 'text-overlap',
                    card: cardName,
                    detail: nameOf(a) + ' overlaps ' + nameOf(b) + ' by ' + Math.round(hit.width) + 'x' + Math.round(hit.height),
                  });
                }
              }
            }

            for (const text of texts) {
              const textRect = text.getBoundingClientRect();
              for (const visual of media) {
                if (text.contains(visual) || visual.contains(text)) continue;
                if (text.closest(allowedClipSelector) === visual || visual.closest(allowedClipSelector) === text) continue;
                const hit = intersection(textRect, visual.getBoundingClientRect());
                const minArea = Math.min(textRect.width * textRect.height, visual.getBoundingClientRect().width * visual.getBoundingClientRect().height);
                if (hit.width > 6 && hit.height > 6 && hit.area > 36 && hit.area / Math.max(minArea, 1) > 0.025) {
                  localIssues.push({
                    type: 'text-media-overlap',
                    card: cardName,
                    detail: nameOf(text) + ' overlaps ' + nameOf(visual) + ' by ' + Math.round(hit.width) + 'x' + Math.round(hit.height),
                  });
                }
              }
            }
          }

          return {
            cardCount: cards.length,
            issues: localIssues.filter((issue, index, array) => array.findIndex((candidate) => JSON.stringify(candidate) === JSON.stringify(issue)) === index),
          };
        })()`);

        printResult(route, width, result);
      }
    }
  } finally {
    client?.close();
    preview.kill('SIGTERM');
    chrome.kill('SIGTERM');
    await delay(250);
    fs.rmSync(profile, { recursive: true, force: true });
  }

  fs.writeFileSync('card-layout-audit.json', JSON.stringify({ assertions, issues }, null, 2));
  console.log(`\nCard layout audit: ${assertions - new Set(issues.map((issue) => issue.route + ':' + issue.width)).size}/${assertions} route-width checks clean.`);
  console.log(`Total layout issues: ${issues.length}`);
  if (issues.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
