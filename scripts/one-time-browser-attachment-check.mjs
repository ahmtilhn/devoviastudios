import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const baseUrl = 'http://127.0.0.1:4173';
const chromePort = 9227;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForUrl(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // The local service is still starting.
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
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devovia-upload-check-'));
  const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-background-networking',
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1280,900',
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  let client;
  try {
    await waitForUrl(baseUrl);
    await waitForUrl(`http://127.0.0.1:${chromePort}/json/version`);
    const targetResponse = await fetch(`http://127.0.0.1:${chromePort}/json/new?${encodeURIComponent(`${baseUrl}/contact`)}`, { method: 'PUT' });
    const target = await targetResponse.json();
    client = new CdpClient(target.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Runtime.enable');
    await delay(800);

    const appSource = fs.readFileSync('src/App.jsx', 'utf8');
    const keyMatch = appSource.match(/formAccessKey\s*=\s*'([^']+)'/);
    if (!keyMatch) throw new Error('Web3Forms access key was not found.');
    const accessKey = JSON.stringify(keyMatch[1]);

    const expression = `(async () => {
      const data = new FormData();
      data.append('access_key', ${accessKey});
      data.append('subject', '[QA] Devovia browser file attachment integration test');
      data.append('from_name', 'Devovia Automated Browser QA');
      data.append('name', 'Automated Browser QA');
      data.append('email', 'info@devoviastudio.com');
      data.append('message', 'Automated one-time browser verification of the website file attachment flow.');
      data.append('attachment_1', new File(['Devovia browser attachment integration test.\\n'], 'attachment-test.txt', { type: 'text/plain' }));
      try {
        const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
        const text = await response.text();
        let body;
        try { body = JSON.parse(text); } catch { body = { raw: text }; }
        return { status: response.status, ok: response.ok, body };
      } catch (error) {
        return { status: 0, ok: false, body: { message: error?.message || String(error) } };
      }
    })()`;

    const evaluated = await client.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
      userGesture: true,
    });
    if (evaluated.exceptionDetails) throw new Error(evaluated.exceptionDetails.text || 'Browser evaluation failed.');

    const result = evaluated.result?.value;
    console.log(`ATTACHMENT_API_RESULT=${JSON.stringify(result)}`);
    if (!result?.ok || result?.body?.success !== true) {
      throw new Error(result?.body?.message || `Web3Forms returned HTTP ${result?.status ?? 0}.`);
    }
    console.log('PASS Browser-origin file attachment was accepted by Web3Forms.');
  } finally {
    client?.close();
    chrome.kill('SIGTERM');
    preview.kill('SIGTERM');
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exit(1);
});
