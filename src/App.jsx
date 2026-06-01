import React from 'react';
import appData from '../data/apps.json';

const products = appData.apps;

const trustItems = ['Google Play ready', 'Policy center', 'App support', 'Update notes'];

const services = [
  ['Test plan', 'Closed testing flow, tester guidance and Play Console readiness before release.'],
  ['Store assets', 'Screenshots, descriptions, privacy links and app-ads files kept consistent.'],
  ['Support layer', 'Product-specific contact paths for privacy, billing, bugs and feedback.'],
];

const updates = [
  ['01 Jun 2026', 'Website system refresh', 'Devovia moved to the new premium mobile studio design system.'],
  ['01 Jun 2026', 'Product hub connected', 'Published apps, privacy policies and app-ads files now share one public surface.'],
  ['Next', 'App detail expansion', 'Trailer-first product pages and richer release notes will be added per app.'],
];

function getFeatures(app) {
  return app.long_desc
    .split('\n')
    .filter((line) => line.trim().startsWith('-'))
    .slice(0, 5)
    .map((line) => line.replace('-', '').trim());
}

function AppMockup({ app, index = 0 }) {
  return (
    <div className={`phone phone-${index + 1}`} aria-label={`${app.name} mobile preview`}>
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
    <article className="product-detail" id={`product-${app.id}`}>
      <div className="detail-media">
        <AppMockup app={app} index={index} />
      </div>
      <div className="detail-copy">
        <p className="eyebrow">{app.category} / {app.downloads_text} downloads</p>
        <h3>{app.name}</h3>
        <p className="lead">{app.tagline}</p>
        <p>{app.short_desc}</p>
        <div className="feature-strip">
          {features.map((feature) => <span key={feature}>{feature}</span>)}
        </div>
        <div className="actions">
          <a className="button primary" href={app.play_url} target="_blank" rel="noreferrer">Google Play</a>
          <a className="button secondary" href={app.privacy_url}>Privacy</a>
          <a className="button text" href={app.app_ads_file_url}>app-ads.txt</a>
        </div>
      </div>
    </article>
  );
}

function App() {
  const featured = products[0];

  return (
    <div className="site-shell">
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label="Devovia Studio home">
          <span className="brand-mark">D</span>
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
            <p className="hero-title">Premium mobile products with clean launch systems.</p>
            <p className="hero-text">
              Apps, games, privacy pages, Play Store assets and user support in one calm public product home.
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
            <h2>Apple-like motion, indie studio clarity and product-first storytelling.</h2>
          </div>
          <p>
            The new system uses an 8pt rhythm, Inter/Outfit typography, borderless soft-shadow surfaces and focused mobile previews so every app feels ready for store visitors.
          </p>
        </section>

        <section className="section apps-section" id="apps">
          <div className="section-heading">
            <p className="eyebrow">Application detail pages</p>
            <h2>Trailer-first product blocks for each published app.</h2>
          </div>
          <div className="product-stack">
            {products.map((app, index) => <ProductDetail app={app} index={index} key={app.id} />)}
          </div>
        </section>

        <section className="section testing-section" id="testing">
          <div className="testing-copy">
            <p className="eyebrow">Google Play test support</p>
            <h2>Release preparation for Play Store testing pain points.</h2>
            <p>
              A conversion-focused support surface for closed testing, store readiness, policy links and launch checks.
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
            <h2>Chronological updates with a simple release feed.</h2>
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

        <section className="section policy-section">
          <div>
            <p className="eyebrow">Navigation system</p>
            <h2>Policies and app-ads files stay reachable from the main flow.</h2>
          </div>
          <div className="policy-grid">
            {products.map((app) => (
              <a className="policy-link" href={app.privacy_url} key={`${app.id}-privacy`}>
                <img src={app.icon_url} alt="" />
                <span>{app.name} Privacy</span>
              </a>
            ))}
            {products.map((app) => (
              <a className="policy-link" href={app.app_ads_file_url} key={`${app.id}-ads`}>
                <img src={app.icon_url} alt="" />
                <span>{app.name} app-ads</span>
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
