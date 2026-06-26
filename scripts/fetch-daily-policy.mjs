import { execFileSync } from 'node:child_process';

const policySlug = ['SM', 'PP'].join('-');
const policyUrl = `https://sites.google.com/view/devoviastudio/privacy-policy/${policySlug}`;
const html = execFileSync('google-chrome', [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--virtual-time-budget=12000',
  '--dump-dom',
  policyUrl,
], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });

const text = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '\n')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '\n')
  .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '\n')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/(?:p|div|section|article|h1|h2|h3|h4|li)>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replaceAll('&nbsp;', ' ')
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>');

const lines = text.split(/\r?\n/)
  .map((line) => line.replace(/\s+/g, ' ').trim())
  .filter(Boolean)
  .filter((line, index, all) => index === 0 || line !== all[index - 1]);

const start = lines.findIndex((line) => line === '17. Sensitive Data');
console.log('STOCK_MANAGER_TAIL_JSON=' + JSON.stringify(start >= 0 ? lines.slice(start) : lines));
