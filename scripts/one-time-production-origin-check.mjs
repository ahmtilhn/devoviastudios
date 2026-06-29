import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const pageUrl = 'https://devoviastudio.com/contact';
const chromePort = 9231;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForUrl(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // Chrome is still starting.
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class CdpClient {
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
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, 35000);
      this.pending.set(id, {
        resolve: (value) => { clearTimeout(timer); resolve(value); },
        reject: (error) => { clearTimeout(timer); reject(error); },
      });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket?.close();
  }
}

async function main() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devovia-production-upload-'));
  const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-extensions',
    '--ignore-certificate-errors',
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1280,900',
    pageUrl,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });

  let client;
  try {
    await waitForUrl(`http://127.0.0.1:${chromePort}/json/version`);
    const targets = await (await fetch(`http://127.0.0.1:${chromePort}/json`)).json();
    const target = targets.find((item) => item.type === 'page');
    if (!target?.webSocketDebuggerUrl) throw new Error('Chrome page target was not found');

    client = new CdpClient(target.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Runtime.enable');
    await delay(3500);

    const expression = `(async () => {
      const data = new FormData();
      data.append('access_key', '156fd324-7568-4397-adee-20b99ad68190');
      data.append('subject', '[QA] Devovia production-origin file attachment test');
      data.append('from_name', 'Devovia Production Browser QA');
      data.append('name', 'Production Browser QA');
      data.append('email', 'info@devoviastudio.com');
      data.append('message', 'One-time production-origin verification of the website file attachment flow.');
      data.append('attachment_1', new File(['Devovia production attachment test'], 'attachment-test.txt', { type: 'text/plain' }));
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, signal: controller.signal });
        const text = await response.text();
        let body;
        try { body = JSON.parse(text); } catch { body = { raw: text }; }
        return { status: response.status, ok: response.ok, body, origin: location.origin, url: location.href };
      } catch (error) {
        return { status: 0, ok: false, body: { name: error.name, message: error.message }, origin: location.origin, url: location.href };
      } finally {
        clearTimeout(timer);
      }
    })()`;

    const evaluated = await client.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
      userGesture: true,
    });
    if (evaluated.exceptionDetails) throw new Error(evaluated.exceptionDetails.text || 'Evaluation failed');
    const result = evaluated.result?.value;
    console.log(`PRODUCTION_ATTACHMENT_RESULT=${JSON.stringify(result)}`);
    if (!result?.ok || result?.body?.success !== true) {
      throw new Error(result?.body?.message || `HTTP ${result?.status ?? 0}`);
    }
    console.log('PASS Production-origin attachment was accepted by Web3Forms.');
  } finally {
    client?.close();
    chrome.kill('SIGTERM');
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exit(1);
});
