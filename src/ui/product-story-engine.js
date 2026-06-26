import appData from '../../data/apps.json';
import { productExperienceV7 } from './product-experience-v7-data.js';
import { renderProductVisual } from './product-visuals-v7.js';

const products = appData.apps;
const routeAliases = {
  'stock-manager': 'app-1',
  'stockflow-inventory': 'app-1',
  'arrow-escape': 'app-4',
  'daily-hadith': 'app-2',
  tinysteps: 'app-3',
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function currentProduct() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (!['products', 'projects'].includes(parts[0]) || !parts[1]) return null;
  const id = routeAliases[parts[1]];
  return products.find((product) => product.id === id || product.slug === parts[1]);
}

function chapterMarkup(feature, index) {
  return `
    <article class="v7-feature-chapter" data-feature-index="${index}" data-motion="${escapeHtml(feature.motion)}">
      <div class="v7-chapter-index"><span>${String(index + 1).padStart(2, '0')}</span><i></i></div>
      <p class="v7-feature-label">${escapeHtml(feature.label)}</p>
      <h3>${escapeHtml(feature.title)}</h3>
      <p class="v7-feature-description">${escapeHtml(feature.description)}</p>
      <ul class="v7-outcome-list">
        ${feature.outcomes.map((outcome) => `<li><span>✓</span>${escapeHtml(outcome)}</li>`).join('')}
      </ul>
      <div class="v7-feature-proof"><span>Product proof</span><strong>${escapeHtml(feature.proof)}</strong></div>
    </article>
  `;
}

function productExperienceMarkup(product, experience) {
  const featureCount = experience.features.length;
  const screenshots = product.screenshots.map((shot, index) => `
    <figure class="v7-screen-card">
      <div class="v7-screen-phone"><img src="${escapeHtml(shot)}" alt="${escapeHtml(product.name)} application screen ${index + 1}" loading="lazy" decoding="async" /></div>
      <figcaption>Product screen ${String(index + 1).padStart(2, '0')}</figcaption>
    </figure>
  `).join('');

  return `
    <section class="v7-product-experience" data-product-v7="${escapeHtml(product.id)}" style="--v7-theme:${escapeHtml(product.theme)}">
      <header class="v7-product-overview">
        <div class="v7-overview-copy">
          <p class="eyebrow">${escapeHtml(experience.eyebrow)}</p>
          <h2>${escapeHtml(experience.headline)}</h2>
          <p>${escapeHtml(experience.intro)}</p>
        </div>
        <div class="v7-promise-grid">
          ${experience.promise.map(([title, text], index) => `
            <article><span>${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>
          `).join('')}
        </div>
      </header>

      <div class="v7-story-layout">
        <aside class="v7-stage-column" aria-label="Animated product feature demonstration">
          <div class="v7-feature-stage" data-active-feature="0">
            <div class="v7-stage-header">
              <div><span class="v7-stage-kicker">Feature demonstration</span><strong data-stage-title>${escapeHtml(experience.features[0].label)}</strong></div>
              <span data-stage-counter>01 / ${String(featureCount).padStart(2, '0')}</span>
            </div>
            <div class="v7-stage-canvas" data-stage-motion="${escapeHtml(experience.features[0].motion)}">
              <div class="v7-vector-scene" data-stage-scene>${renderProductVisual(experience.features[0].visual, product.theme)}</div>
              <div class="v7-live-phone" aria-hidden="true">
                <span class="v7-phone-speaker"></span>
                <img data-stage-screenshot src="${escapeHtml(product.screenshots[experience.features[0].screenshot % product.screenshots.length])}" alt="" />
                <span class="v7-phone-glass"></span>
              </div>
              <span class="v7-stage-signal signal-a"></span>
              <span class="v7-stage-signal signal-b"></span>
            </div>
            <div class="v7-stage-footer">
              <div class="v7-stage-progress"><i data-stage-progress></i></div>
              <nav class="v7-stage-nav" aria-label="Product features">
                ${experience.features.map((feature, index) => `<button type="button" data-feature-jump="${index}" aria-label="Show ${escapeHtml(feature.label)}" class="${index === 0 ? 'is-active' : ''}"><span>${String(index + 1).padStart(2, '0')}</span></button>`).join('')}
              </nav>
            </div>
          </div>
        </aside>

        <div class="v7-feature-track">
          ${experience.features.map(chapterMarkup).join('')}
        </div>
      </div>

      <section class="v7-product-screens">
        <div class="v7-section-heading">
          <p class="eyebrow">Real product interface</p>
          <h2>The feature story is connected to screens that already exist in the app.</h2>
          <p>These are published product screens—not invented dashboard placeholders. The vector scenes explain the workflow while the device previews preserve the real interface.</p>
        </div>
        <div class="v7-screen-grid">${screenshots}</div>
      </section>

      <section class="v7-product-facts">
        <div class="v7-fact-panel">
          <p class="eyebrow">Designed for</p>
          <h2>Clear use cases, not a generic audience.</h2>
          <div class="v7-audience-list">${experience.audiences.map((audience) => `<span>${escapeHtml(audience)}</span>`).join('')}</div>
        </div>
        <div class="v7-fact-panel">
          <p class="eyebrow">Product foundation</p>
          <h2>${escapeHtml(product.tech_stack)}</h2>
          <div class="v7-fact-metrics">
            <div><strong>${escapeHtml(product.downloads_text)}</strong><span>Google Play downloads</span></div>
            <div><strong>${Number(product.rating_text) > 0 ? `${escapeHtml(product.rating_text)}/5` : 'New'}</strong><span>Current listing status</span></div>
            <div><strong>${featureCount}</strong><span>Core systems explained</span></div>
          </div>
        </div>
        <div class="v7-fact-panel v7-release-panel">
          <p class="eyebrow">Latest release work</p>
          <h2>Recent improvements</h2>
          <ul>${product.release_notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}</ul>
        </div>
      </section>

      <section class="v7-product-cta">
        <div><p class="eyebrow">Explore the live product</p><h2>See ${escapeHtml(product.name)} on Google Play or ask about the product workflow.</h2></div>
        <div class="v7-cta-actions">
          <a class="button primary" href="${escapeHtml(product.play_url)}" target="_blank" rel="noreferrer">View on Google Play →</a>
          <a class="button secondary" href="/support">Contact support</a>
        </div>
      </section>
    </section>
  `;
}

function installProductExperience() {
  const product = currentProduct();
  const appShell = document.querySelector('.app-shell');
  if (!product || !appShell || appShell.dataset.productV7 === product.id) return;

  const experience = productExperienceV7[product.id];
  const hero = document.querySelector('.product-hero-detail');
  if (!experience || !hero) return;

  document.querySelectorAll('[data-product-story], [data-product-v7]').forEach((element) => element.remove());
  hero.insertAdjacentHTML('afterend', productExperienceMarkup(product, experience));
  appShell.dataset.productV7 = product.id;
  appShell.classList.add('v7-product-detail-ready');
  hero.classList.add('v7-product-hero');

  const section = document.querySelector('[data-product-v7]');
  const stage = section.querySelector('.v7-feature-stage');
  const canvas = section.querySelector('.v7-stage-canvas');
  const scene = section.querySelector('[data-stage-scene]');
  const screenshot = section.querySelector('[data-stage-screenshot]');
  const title = section.querySelector('[data-stage-title]');
  const counter = section.querySelector('[data-stage-counter]');
  const progressBar = section.querySelector('[data-stage-progress]');
  const chapters = Array.from(section.querySelectorAll('.v7-feature-chapter'));
  const navButtons = Array.from(section.querySelectorAll('[data-feature-jump]'));
  const track = section.querySelector('.v7-feature-track');
  let activeIndex = -1;
  let scrollFrame = 0;
  let storyVisible = false;

  function activateFeature(index) {
    const nextIndex = Math.max(0, Math.min(index, experience.features.length - 1));
    if (nextIndex === activeIndex) return;
    const feature = experience.features[nextIndex];
    activeIndex = nextIndex;

    stage.classList.add('is-switching');
    stage.dataset.activeFeature = String(nextIndex);
    canvas.dataset.stageMotion = feature.motion;
    title.textContent = feature.label;
    counter.textContent = `${String(nextIndex + 1).padStart(2, '0')} / ${String(experience.features.length).padStart(2, '0')}`;
    scene.innerHTML = renderProductVisual(feature.visual, product.theme);
    screenshot.src = product.screenshots[feature.screenshot % product.screenshots.length];
    screenshot.alt = `${product.name} — ${feature.label}`;

    chapters.forEach((chapter, chapterIndex) => chapter.classList.toggle('is-active', chapterIndex === nextIndex));
    navButtons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === nextIndex);
      button.setAttribute('aria-current', buttonIndex === nextIndex ? 'step' : 'false');
    });

    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('is-switching')));
  }

  function updateStoryProgress() {
    scrollFrame = 0;
    if (!storyVisible) return;
    const trackRect = track.getBoundingClientRect();
    const viewport = window.innerHeight;
    const distance = Math.max(trackRect.height - viewport * 0.7, 1);
    const progress = Math.max(0, Math.min(1, (viewport * 0.34 - trackRect.top) / distance));
    section.style.setProperty('--v7-story-progress', progress.toFixed(4));
    progressBar.style.transform = `scaleX(${progress})`;

    chapters.forEach((chapter) => {
      const rect = chapter.getBoundingClientRect();
      const local = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
      chapter.style.setProperty('--v7-chapter-progress', local.toFixed(4));
    });
  }

  function requestStoryProgress() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateStoryProgress);
  }

  const activeObserver = new IntersectionObserver((entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * 0.36) - Math.abs(b.boundingClientRect.top - window.innerHeight * 0.36));
    if (visibleEntries[0]) activateFeature(Number(visibleEntries[0].target.dataset.featureIndex));
  }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-24% 0px -42% 0px' });

  const storyObserver = new IntersectionObserver(([entry]) => {
    storyVisible = entry.isIntersecting;
    if (storyVisible) requestStoryProgress();
  }, { rootMargin: '35% 0px 35% 0px' });

  chapters.forEach((chapter) => activeObserver.observe(chapter));
  storyObserver.observe(section.querySelector('.v7-story-layout'));
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      chapters[Number(button.dataset.featureJump)]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  window.addEventListener('scroll', requestStoryProgress, { passive: true });
  window.addEventListener('resize', requestStoryProgress, { passive: true });

  activateFeature(0);
  requestStoryProgress();
}

function installTestSupportExperience() {
  const page = document.querySelector('.test-support-page');
  if (!page || page.dataset.v6Ready === 'true') return;
  page.dataset.v6Ready = 'true';
  const hero = page.querySelector('.page-hero');
  if (hero && !hero.querySelector('.test-support-visual-v6')) {
    hero.insertAdjacentHTML('beforeend', `
      <div class="test-support-visual-v6" aria-label="Google Play release readiness system">
        <div class="release-core"><span>READY</span><strong>Release system</strong><small>Store · Test · Policy · Support</small></div>
        <span class="release-orbit orbit-one"><i>01</i> Test flow</span>
        <span class="release-orbit orbit-two"><i>02</i> Store assets</span>
        <span class="release-orbit orbit-three"><i>03</i> Policy pages</span>
        <span class="release-orbit orbit-four"><i>04</i> Launch review</span>
        <span class="release-ring ring-one"></span><span class="release-ring ring-two"></span>
      </div>
    `);
  }

  const firstSection = page.querySelector('.test-main .compact-section');
  if (firstSection && !page.querySelector('.support-proof-strip-v6')) {
    firstSection.insertAdjacentHTML('beforebegin', `
      <section class="support-proof-strip-v6">
        <article><strong>01</strong><span>Identify the exact blocker</span></article>
        <article><strong>02</strong><span>Build a repeatable test flow</span></article>
        <article><strong>03</strong><span>Align store and policy surfaces</span></article>
        <article><strong>04</strong><span>Submit with a final readiness check</span></article>
      </section>
    `);
  }

  const requestPanel = page.querySelector('.request-panel');
  if (requestPanel && !requestPanel.querySelector('.request-panel-intro-v6')) {
    requestPanel.insertAdjacentHTML('afterbegin', `
      <div class="request-panel-intro-v6">
        <span>Release readiness review</span>
        <h2>Tell us what is blocking your launch.</h2>
        <p>We will route the request into a clear review path instead of sending a generic response.</p>
      </div>
    `);
  }
}

let frame = 0;
function install() {
  frame = 0;
  installProductExperience();
  installTestSupportExperience();
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(install);
}

const observer = new MutationObserver(schedule);
observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
else schedule();
window.addEventListener('popstate', schedule);
window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
