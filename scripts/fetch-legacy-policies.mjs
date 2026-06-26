import { execFileSync } from 'node:child_process';

const pages = {
  'STOCK_MANAGER': 'https://sites.google.com/view/devoviastudio/privacy-policy/SM-PP',
  'TINYSTEPS': 'https://sites.google.com/view/devoviastudio/privacy-policy/TS-PP',
  'DAILY_HADITH': 'https://sites.google.com/view/devoviastudio/privacy-policy/DH-PP',
  'ARROW_ESCAPE': 'https://sites.google.com/view/devoviastudio/privacy-policy/pp-arrow-escape',
};

function decodeEntities(value) {
  return value
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function readableText(html) {
  return decodeEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '\n')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '\n')
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(?:p|div|section|article|h1|h2|h3|h4|li)>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((line, index, all) => index === 0 || line !== all[index - 1])
    .join('\n');
}

for (const [name, url] of Object.entries(pages)) {
  const html = execFileSync(
    'google-chrome',
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--virtual-time-budget=12000',
      '--dump-dom',
      url,
    ],
    { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 },
  );

  console.log(`\n===== ${name}_POLICY_START =====`);
  console.log(readableText(html));
  console.log(`===== ${name}_POLICY_END =====\n`);
}
