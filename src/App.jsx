import React from 'react';
import appData from '../data/apps.json';

const products = appData.apps;

const trustItems = ['8pt grid', 'Dynamic themes', 'Play Store data', 'Patch notes'];

const services = [
  ['Problem scan', 'We review test blockers, store readiness, policy links and release risks.'],
  ['Closed test flow', 'Tester guidance, feedback collection and 14-day process tracking.'],
  ['Launch polish', 'Descriptions, screenshots, privacy pages and store compliance assets stay consistent.'],
  ['Post-release support', 'Patch notes, support routing and product updates stay visible after launch.'],
];

const updates = [
  ['27 May 2026', 'Arrow Escape release', 'Fading arrows, timed puzzle levels, boosters and daily rewards went live on Google Play.'],
  ['08 May 2026', 'Stock Manager backup update', 'Android backup file handling and mobile file picker behavior were improved.'],
  ['05 May 2026', 'Daily Hadith stability update', 'Prayer alarm scheduling, notification permissions and resume sync were improved.'],
  ['25 Dec 2025', 'TinySteps performance update', 'Startup work, habit reads and statistics calculations were optimized.'],
];

function appHref(app) {
  return `/projects/${app.slug}`;
}

function getFeatures(app) {
  return app.long_desc
    .split('\n')
    .filter((line) => line.trim().startsWith('-'))
    .slice(0, 5)
    .map((line) => line.replace('-', '').trim());
}

function AppMockup({ app, index = 0 }) {
  return (
    <div className={`phone phone-${index + 1}`} style={{ '--theme': app.theme }} aria-label={`${app.name} mobile preview`}>
      <div className="phone-top">
        <span></span>
        <span></span>
      </div>
      <div className="phone-icon">
        <img src={app.icon_url} alt={`${app.name} icon`} loading={index === 0 ? 'eager' : 'lazy'} />
      </div>
      <p>{app.category}</p>
      <h3>{app.name}</h3>
      <div className="phone-lines">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="phone-cta">Open app</div>
    </div>
  );
}

function ProductDetail({ app, index }) {
  const features = getFeatures(app);

  return (
    <article className="product-detail" id={`product-${app.id}`} style={{ '--theme': app.theme }}>
      <div className="detail-media">
        <div className="trailer-frame">
          <img src={app.screenshots[0]} alt={`${app.name} screenshot`} loading="lazy" />
        </div>
        <AppMockup app={app} index={index} />
      </div>
      <div className="detail-copy">
        <p className="eyebrow">{app.category} / {app.downloads_text} downloads / updated {app.updated_on}</p>
        <h3>{app.name}</h3>
        <p className="lead">{app.tagline}</p>
        <p>{app.short_desc}</p>
        <div className="screenshot-row" aria-label={`${app.name} screenshots`}>
          {app.screenshots.slice(0, 3).map((src) => <img src={src} alt="" loading="lazy" key={src} />)}
        </div>
        <div className="feature-strip">
          {features.map((feature) => <span key={feature}>{feature}</span>)}
        </div>
        <div className="developer-note">
          <span>Technical stack</span>
          <strong>{app.tech_stack}</strong>
        </div>
        <div className="metric-row">
          <span><strong>{app.downloads_text}</strong> downloads</span>
          <span><strong>{app.rating_text}</strong> rating</span>
          <span><strong>{app.reviews_text}</strong></span>
        </div>
        <div className="actions">
          <a className="button primary" href={app.play_url} target="_blank" rel="noreferrer">Google Play</a>
          <a className="button secondary" href={appHref(app)}>Details</a>
          <a className="button secondary" href={app.privacy_url}>Privacy</a>
        </div>
      </div>
    </article>
  );
}

function AppFeature({ app, feature, index }) {
  const reverse = index % 2 === 1;
  const image = app.screenshots[index % app.screenshots.length];

  return (
    <article className={`app-feature ${reverse ? 'reverse' : ''}`}>
      <VisualPanel app={app} image={image} title={feature.title} />
      <div className="feature-copy">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <h2>{feature.title}</h2>
        <p>{feature.description}</p>
      </div>
    </article>
  );
}

function VisualPanel({ app, image, title }) {
  return (
    <div className="feature-image">
      <img src={image} alt={`${app.name} - ${title}`} loading="lazy" />
      <div className="visual-overlay">
        <img src={app.icon_url} alt="" />
        <span>{app.name}</span>
        <strong>{title}</strong>
      </div>
    </div>
  );
}

function AppPage({ app }) {
  return (
    <div className="site-shell app-page" style={{ '--theme': app.theme }}>
      <header className="nav-shell">
        <a className="brand" href="/" aria-label="Devovia Studio home">
          <span className="brand-mark"><img src="/devovia-logo.png" alt="" /></span>
          <span>Devovia</span>
        </a>
        <nav aria-label="Application navigation">
          <a href="/">Home</a>
          <a href="#features">Features</a>
          <a href="#support">Support</a>
        </nav>
        <a className="button compact" href={app.play_url} target="_blank" rel="noreferrer">Google Play</a>
      </header>

      <main>
        <section className="app-hero">
          <div className="app-hero-copy">
            <p className="eyebrow">{app.category} / updated {app.updated_on}</p>
            <img src={app.icon_url} alt="" className="app-icon-large" />
            <h1>{app.name}</h1>
            <p className="hero-title">{app.tagline}</p>
            <p className="hero-text">{app.short_desc}</p>
            <div className="metric-panel">
              <span><strong>{app.downloads_text}</strong> downloads</span>
              <span><strong>{app.rating_text}</strong> Google Play rating</span>
              <span><strong>{app.reviews_text}</strong></span>
            </div>
            <div className="actions">
              <a className="button primary" href={app.play_url} target="_blank" rel="noreferrer">Download on Google Play</a>
              <a className="button secondary" href={app.privacy_url}>Privacy policy</a>
            </div>
          </div>
          <div className="app-hero-media">
            <img src={app.screenshots[0]} alt={`${app.name} hero screenshot`} />
            <div className="visual-overlay hero-overlay">
              <img src={app.icon_url} alt="" />
              <span>{app.name}</span>
              <strong>{app.category} experience</strong>
            </div>
          </div>
        </section>

        <section className="section app-features" id="features">
          <div className="section-heading">
            <p className="eyebrow">Feature system</p>
            <h2>Every feature gets a visual, a promise and a clear explanation.</h2>
          </div>
          {app.feature_details.map((feature, index) => (
            <AppFeature app={app} feature={feature} index={index} key={feature.title} />
          ))}
        </section>

        <section className="section app-meta-section">
          <div>
            <p className="eyebrow">Technical note</p>
            <h2>{app.tech_stack}</h2>
          </div>
          <div className="note-card single-note">
            <img src={app.icon_url} alt="" />
            <div>
              <span>Latest update</span>
              <time>{app.updated_on}</time>
            </div>
            <ul>
              {app.release_notes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
        </section>

        <section className="section permissions-section">
          <div>
            <p className="eyebrow">Privacy & permissions</p>
            <h2>Clear data handling before users install.</h2>
          </div>
          <div className="permission-list">
            {app.privacy_points.map((point) => <p key={point}>{point}</p>)}
            <div className="actions">
              <a className="button secondary" href={app.privacy_url}>Privacy summary</a>
              {app.terms_url && <a className="button text" href={app.terms_url} target="_blank" rel="noreferrer">Terms of Service</a>}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="support">
          <div className="contact-copy">
            <p className="eyebrow">Support</p>
            <h2>Need help with {app.name}?</h2>
            <p>For account, privacy, billing, bug reports or feature requests.</p>
            <a className="email-link" href={`mailto:info@devoviastudio.com?subject=${encodeURIComponent(`${app.name} support`)}`}>info@devoviastudio.com</a>
          </div>

          <form className="contact-form" action="mailto:info@devoviastudio.com" method="POST" encType="text/plain">
            <label>Name<input name="name" type="text" placeholder="Your name" required /></label>
            <label>Email<input name="email" type="email" placeholder="you@example.com" required /></label>
            <label>Product<input name="product" type="text" value={app.name} readOnly /></label>
            <label>Request<select name="service" defaultValue="App support"><option>App support</option><option>Privacy policy question</option><option>Bug report</option><option>Feature request</option></select></label>
            <label className="full">Message<textarea name="message" rows="5" placeholder="Tell us what you need help with" required></textarea></label>
            <button className="button primary full" type="submit">Send request</button>
          </form>
        </section>
      </main>

      <a className="mobile-cta" href="#support">Contact Devovia</a>
    </div>
  );
}

function App() {
  const featured = products[0];
  const params = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const projectSlug = pathParts[0] === 'projects' ? pathParts[1] : null;
  const currentApp = products.find((app) => app.id === params.get('app') || app.slug === projectSlug);

  if (currentApp) return <AppPage app={currentApp} />;

  return (
    <div className="site-shell">
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label="Devovia Studio home">
          <span className="brand-mark"><img src="/devovia-logo.png" alt="" /></span>
          <span>Devovia</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#apps">Apps</a>
          <a href="#testing">Testing</a>
          <a href="#updates">Updates</a>
          <a href="#support">Support</a>
        </nav>
        <a className="button compact" href="#support">Contact</a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Mobile app studio / Netherlands</p>
            <h1>Devovia</h1>
            <p className="hero-title">Mobil Dünyada Devovia İmzası.</p>
            <p className="hero-text">
              Premium mobile apps, games, Play Store launch systems and support pages built with clean engineering.
            </p>
            <div className="actions">
              <a className="button primary" href="#apps">Explore apps</a>
              <a className="button secondary" href="https://play.google.com/store/apps/dev?id=8503755770254696496" target="_blank" rel="noreferrer">
                Google Play
              </a>
            </div>
          </div>

          <div className="hero-stage" aria-label="Featured Devovia applications">
            <div className="stage-glow"></div>
            {products.map((app, index) => <AppMockup app={app} index={index} key={app.id} />)}
          </div>
        </section>

        <section className="trust-band" aria-label="Studio capabilities">
          {trustItems.map((item) => <span key={item}>{item}</span>)}
        </section>

        <section className="section intro-section">
          <div>
            <p className="eyebrow">Design direction</p>
            <h2>A design system for both art direction and engineering discipline.</h2>
          </div>
          <p>
            Inter/Outfit typography, #F9F9F9 background, #1A1A1A text, #2563EB brand accent, 8pt spacing, borderless soft shadows and ease-out-expo motion define the Devovia visual DNA.
          </p>
        </section>

        <section className="section apps-section" id="apps">
          <div className="section-heading">
            <p className="eyebrow">Application detail pages</p>
            <h2>Trailer-first product blocks from the live Google Play catalog.</h2>
          </div>
          <div className="product-stack">
            {products.map((app, index) => <ProductDetail app={app} index={index} key={app.id} />)}
          </div>
        </section>

        <section className="section testing-section" id="testing">
          <div className="testing-copy">
            <p className="eyebrow">Google Play test support</p>
            <h2>Google Play Test Sürecinde Tıkandınız mı?</h2>
            <p>
              Devovia ile 14 gün kuralını, test gereksinimlerini, store hazırlığını ve yayın öncesi kontrolleri düzenli bir süreçle yönetin.
            </p>
            <a className="button primary" href="#support">Request support</a>
          </div>
          <div className="service-list">
            {services.map(([title, text], index) => (
              <article className="service-row" key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section updates-section" id="updates">
          <div className="section-heading">
            <p className="eyebrow">Patch notes</p>
            <h2>Devovia yenilikleri, ürün bazlı ve kronolojik.</h2>
          </div>
          <div className="timeline">
            {updates.map(([date, title, text]) => (
              <article className="timeline-item" key={`${date}-${title}`}>
                <time>{date}</time>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section notes-section">
          <div className="section-heading">
            <p className="eyebrow">Per-product patch notes</p>
            <h2>Each app keeps its own release story.</h2>
          </div>
          <div className="notes-grid">
            {products.map((app) => (
              <article className="note-card" style={{ '--theme': app.theme }} key={`${app.id}-notes`}>
                <img src={app.icon_url} alt="" />
                <div>
                  <span>{app.name}</span>
                  <time>{app.updated_on}</time>
                </div>
                <ul>
                  {app.release_notes.map((note) => <li key={note}>{note}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section policy-section">
          <div>
            <p className="eyebrow">Navigation system</p>
            <h2>Privacy policies stay visible without exposing technical monetization files.</h2>
          </div>
          <div className="policy-grid">
            {products.map((app) => (
              <a className="policy-link" href={app.privacy_url} key={`${app.id}-privacy`}>
                <img src={app.icon_url} alt="" />
                <span>{app.name} Privacy</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section contact-section" id="support">
          <div className="contact-copy">
            <p className="eyebrow">Support</p>
            <h2>Tell us what your app or user needs next.</h2>
            <p>For privacy, billing, bugs, feature requests or Play Store testing support.</p>
            <a className="email-link" href="mailto:info@devoviastudio.com">info@devoviastudio.com</a>
          </div>

          <form className="contact-form" action="mailto:info@devoviastudio.com" method="POST" encType="text/plain">
            <label>Name<input name="name" type="text" placeholder="Your name" required /></label>
            <label>Email<input name="email" type="email" placeholder="you@example.com" required /></label>
            <label>Product<select name="product" defaultValue={featured?.name || 'General support'}>{products.map((app) => <option key={app.id}>{app.name}</option>)}<option>General support</option><option>Play testing support</option></select></label>
            <label>Request<select name="service" defaultValue="App support"><option>App support</option><option>Play testing support</option><option>Privacy policy question</option><option>Bug report</option><option>Feature request</option></select></label>
            <label className="full">Message<textarea name="message" rows="5" placeholder="Tell us what you need help with" required></textarea></label>
            <button className="button primary full" type="submit">Send request</button>
          </form>
        </section>
      </main>

      <a className="mobile-cta" href="#support">Contact Devovia</a>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Devovia Studio</span>
        <span>Mobile apps, games, policies and support.</span>
      </footer>
    </div>
  );
}

export default App;
