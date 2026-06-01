import React, { useEffect } from 'react';
import appData from '../data/apps.json';

const products = appData.apps;

const services = [
  ['01', 'Mobile Apps', 'Google Play products, future iOS listings, store assets, support paths and update pages.'],
  ['02', 'Games & Utilities', 'Small useful tools, mobile games, habit systems and business workflows built for daily use.'],
  ['03', 'Compliance Hub', 'Privacy policies, app-ads files, support forms and public trust pages kept in one place.'],
  ['04', 'Launch Systems', 'Landing pages, product updates, roadmap notes and customer communication after release.'],
];

const inDevelopment = [
  ['Master Measure', 'Construction measurement app', 'Project records, exports and job-site measurement tools.'],
  ['Arrow Escape', 'Puzzle game', 'Fast arrow-tile puzzle gameplay with sharp motion and clean level flow.'],
  ['Grow Nest', 'Family collaboration app', 'Shared family routines, permissions, reminders and household visibility.'],
];

const updates = [
  ['Now', 'Product hub live', 'Devovia Studio connects published apps with support, policies and store assets.'],
  ['Next', 'iOS expansion', 'Future iOS listings will connect into the same public product system.'],
  ['Soon', 'Game pipeline', 'Upcoming game projects will receive launch pages, updates and support surfaces.'],
];

function useScrollExperience() {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll('.reveal'));
    const scenes = Array.from(document.querySelectorAll('[data-scroll-scene]'));
    const root = document.documentElement;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -70px' });

    revealItems.forEach((item) => observer.observe(item));

    let frame = null;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const ease = (value) => value * value * (3 - 2 * value);

    const updateScenes = () => {
      const scrollMax = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const pageProgress = clamp(window.scrollY / scrollMax, 0, 1);
      root.style.setProperty('--page-progress', pageProgress.toFixed(4));
      root.style.setProperty('--bg-slide', `${Math.round(pageProgress * -420)}px`);
      root.style.setProperty('--bg-rotate', `${Math.round(pageProgress * 38)}deg`);

      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const viewport = window.innerHeight || 1;
        const scrollable = Math.max(rect.height - viewport, 1);
        const progress = clamp(-rect.top / scrollable, 0, 1);
        const smooth = ease(progress);

        scene.style.setProperty('--scene-progress', progress.toFixed(4));
        scene.style.setProperty('--progress-width', `${Math.round(progress * 100)}%`);
        scene.style.setProperty('--fragment-opacity', `${0.58 + smooth * 0.42}`);
        scene.style.setProperty('--core-scale', `${1 - smooth * 0.08}`);
        scene.style.setProperty('--piece-a-x', `${-124 * smooth}px`);
        scene.style.setProperty('--piece-a-y', `${-52 * smooth}px`);
        scene.style.setProperty('--piece-a-r', `${-9 * smooth}deg`);
        scene.style.setProperty('--piece-b-x', `${104 * smooth}px`);
        scene.style.setProperty('--piece-b-y', `${-96 * smooth}px`);
        scene.style.setProperty('--piece-b-r', `${10 * smooth}deg`);
        scene.style.setProperty('--piece-c-x', `${-98 * smooth}px`);
        scene.style.setProperty('--piece-c-y', `${108 * smooth}px`);
        scene.style.setProperty('--piece-c-r', `${8 * smooth}deg`);
        scene.style.setProperty('--piece-d-x', `${118 * smooth}px`);
        scene.style.setProperty('--piece-d-y', `${78 * smooth}px`);
        scene.style.setProperty('--piece-d-r', `${-8 * smooth}deg`);
      });

      frame = null;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScenes);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}

function ProductDevice({ app, index }) {
  return (
    <div className="product-device studio-device" aria-label={`${app.name} animated preview`}>
      <div className="trailer-screen">
        <span className="motion-line line-one"></span>
        <span className="motion-line line-two"></span>
        <span className="motion-line line-three"></span>
        <span className="motion-orb orb-a"></span>
        <span className="motion-orb orb-b"></span>
        <span className="pulse-ring ring-one"></span>
        <span className="pulse-ring ring-two"></span>
      </div>
      <div className="icon-glass">
        <img src={app.icon_url} alt={`${app.name} icon`} loading={index === 0 ? 'eager' : 'lazy'} />
      </div>
      <div className="glass-fade"></div>
    </div>
  );
}

function ProductShowcase({ app, index }) {
  const reverse = index % 2 === 1;
  const features = app.long_desc
    .split('\n')
    .filter((line) => line.trim().startsWith('-'))
    .slice(0, 4)
    .map((line) => line.replace('-', '').trim());

  return (
    <article className={`product-showcase reveal ${reverse ? 'reverse' : ''}`} id={`product-${app.id}`}>
      <ProductDevice app={app} index={index} />
      <div className="product-copy">
        <p className="eyebrow">{app.category} • {app.downloads_text} downloads</p>
        <h3>{app.name}</h3>
        <p className="product-tagline">{app.tagline}</p>
        <p>{app.short_desc}</p>
        <div className="mini-feature-grid">
          {features.map((feature) => <span key={feature}>{feature}</span>)}
        </div>
        <div className="product-actions">
          <a className="button primary" href={app.play_url} target="_blank" rel="noreferrer">Google Play</a>
          <a className="button secondary" href={app.privacy_url}>Privacy Policy</a>
          <a className="button ghost" href={app.app_ads_file_url}>app-ads.txt</a>
        </div>
      </div>
    </article>
  );
}

function HeroOrbit() {
  return (
    <div className="hero-product-wall studio-orbit reveal is-visible" aria-label="Animated Devovia product system">
      <div className="orbit-ring ring-a"></div>
      <div className="orbit-ring ring-b"></div>
      <div className="orbit-core">
        <span>Devovia</span>
        <strong>Product OS</strong>
        <small>apps · games · policies · support</small>
      </div>
      {products.map((app, index) => (
        <a className={`hero-app-card card-${index + 1}`} href={`#product-${app.id}`} key={app.id}>
          <img src={app.icon_url} alt={`${app.name} icon`} />
          <span>{app.name}</span>
        </a>
      ))}
      <div className="launch-strip">
        <span>store page</span>
        <span>privacy</span>
        <span>app-ads</span>
        <span>support</span>
      </div>
    </div>
  );
}

function App() {
  useScrollExperience();

  return (
    <div className="site-shell studio-shell">
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>

      <header className="header">
        <a className="brand" href="#top" aria-label="Devovia Studio home">
          <span className="brand-mark">D</span>
          <span>Devovia Studio</span>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#products">Products</a>
          <a href="#services">Studio</a>
          <a href="#legal">Policies</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#support">Support</a>
        </nav>
        <a className="nav-cta" href="#support">Contact</a>
      </header>

      <main id="top">
        <section className="hero section-grid studio-hero">
          <div className="hero-copy reveal is-visible">
            <p className="eyebrow">Mobile apps • games • Google Play • product systems</p>
            <h1><span>Devovia Studio</span><span>builds useful digital products.</span></h1>
            <p className="hero-text">
              A public home for our apps, games, privacy pages, app-ads files, customer support and future product launches.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#products">Explore products</a>
              <a className="button secondary" href="https://play.google.com/store/apps/dev?id=8503755770254696496" target="_blank" rel="noreferrer">Google Play developer page</a>
            </div>
            <div className="trust-row" aria-label="Core studio areas">
              <span>Android apps live</span><span>iOS next</span><span>Games pipeline</span><span>Support center</span>
            </div>
          </div>
          <HeroOrbit />
        </section>

        <section className="story-section" id="experience" data-scroll-scene>
          <div className="story-sticky">
            <div className="story-copy reveal">
              <p className="eyebrow">Animated product system</p>
              <h2>Every app gets a launch surface, trust layer and support path.</h2>
              <p>
                The site moves like a product pipeline: published apps stay visible, compliance files stay reachable and future releases have a place to grow.
              </p>
              <div className="story-progress" aria-label="Scroll progress"><span></span></div>
            </div>
            <div className="build-visual" aria-label="Animated website composition">
              <div className="product-core">
                <div className="browser-bar"><span></span><span></span><span></span></div>
                <div className="core-glow"></div>
                <p>Devovia Studio</p>
                <h3>Launch hub</h3>
                <div className="core-lines"><span></span><span></span><span></span></div>
              </div>
              <article className="fragment-card fragment-1"><span>01</span><h3>Products</h3><p>Google Play and future iOS pages</p></article>
              <article className="fragment-card fragment-2"><span>02</span><h3>Policies</h3><p>Privacy and app-ads files</p></article>
              <article className="fragment-card fragment-3"><span>03</span><h3>Updates</h3><p>Release notes and roadmap</p></article>
              <article className="fragment-card fragment-4"><span>04</span><h3>Support</h3><p>User messages and mail flow</p></article>
              <div className="code-shard shard-one">privacy/app-1.html</div>
              <div className="code-shard shard-two">data/apps.json</div>
              <div className="code-shard shard-three">netlify form</div>
            </div>
          </div>
        </section>

        <section className="section" id="products">
          <div className="section-heading reveal">
            <p className="eyebrow">Published products</p>
            <h2>Live apps with their store links, policies and support files.</h2>
            <p>Each product block connects presentation, Play Store access, privacy pages and monetization compliance files.</p>
          </div>
          <div className="product-stack">
            {products.map((app, index) => <ProductShowcase app={app} index={index} key={app.id} />)}
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-heading reveal">
            <p className="eyebrow">Studio system</p>
            <h2>We build, publish and keep products understandable after launch.</h2>
          </div>
          <div className="service-grid">
            {services.map(([icon, title, text], index) => (
              <article className="service-card reveal" style={{ '--delay': `${index * 70}ms` }} key={title}>
                <span className="card-index">{icon}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section split-section reveal" id="about">
          <div><p className="eyebrow">Who we are</p><h2>Independent mobile product studio based in the Netherlands.</h2></div>
          <div className="feature-list">
            <p>We create useful apps, mobile games and business tools with a focus on clean interfaces, practical features, store compliance and long-term product improvement.</p>
            <ul>
              <li>Google Play products are connected directly from the website</li>
              <li>iOS App Store presence will be added when listings are published</li>
              <li>Privacy policies and app support stay visible and easy to reach</li>
              <li>Future apps and active development work are shown publicly</li>
            </ul>
          </div>
        </section>

        <section className="section legal-section" id="legal">
          <div className="section-heading reveal"><p className="eyebrow">Legal & trust center</p><h2>Policies, app-ads and product trust pages.</h2></div>
          <div className="policy-list reveal studio-policy-list">
            {products.map((app) => (
              <a href={app.privacy_url} key={app.id}><img src={app.icon_url} alt="" /><span>{app.name} Privacy Policy</span></a>
            ))}
            {products.map((app) => (
              <a href={app.app_ads_file_url} key={`${app.id}-ads`}><img src={app.icon_url} alt="" /><span>{app.name} app-ads.txt</span></a>
            ))}
          </div>
        </section>

        <section className="section roadmap-section" id="roadmap">
          <div className="section-heading reveal"><p className="eyebrow">In development</p><h2>Products and systems currently being shaped.</h2></div>
          <div className="roadmap-grid">
            {inDevelopment.map(([name, type, text], index) => (
              <article className="roadmap-card reveal" style={{ '--delay': `${index * 90}ms` }} key={name}>
                <span>{type}</span><h3>{name}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section updates-section" id="updates">
          <div className="section-heading reveal"><p className="eyebrow">Product updates</p><h2>Clear communication for users and store visitors.</h2></div>
          <div className="timeline">
            {updates.map(([date, title, text], index) => (
              <article className="timeline-item reveal" style={{ '--delay': `${index * 80}ms` }} key={`${date}-${title}`}>
                <span>{date}</span><div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section contact-section reveal" id="support">
          <div className="contact-copy">
            <p className="eyebrow">Support center</p>
            <h2>Users can send product questions directly from here.</h2>
            <p>For privacy, account, billing, feature request or bug reports, users can contact Devovia Studio through this form or email.</p>
            <a className="email-link" href="mailto:info@devoviastudio.com">info@devoviastudio.com</a>
          </div>

          <form className="contact-form" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden-field"><label>Do not fill this field <input name="bot-field" /></label></p>
            <label>Name<input name="name" type="text" placeholder="Your name" required /></label>
            <label>Email<input name="email" type="email" placeholder="you@example.com" required /></label>
            <label>Product<select name="product" defaultValue={products[0]?.name || 'General support'}>{products.map((app) => <option key={app.id}>{app.name}</option>)}<option>General support</option><option>Future collaboration</option></select></label>
            <label>Request type<select name="service" defaultValue="App support"><option>App support</option><option>Privacy policy question</option><option>Customer agreement</option><option>Bug report</option><option>Feature request</option></select></label>
            <label className="full">Message<textarea name="message" rows="5" placeholder="Tell us what you need help with" required></textarea></label>
            <button className="button primary full" type="submit">Send support request</button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Devovia Studio. All rights reserved.</span>
        <span>Google Play now live. iOS App Store coming next.</span>
      </footer>
    </div>
  );
}

export default App;
