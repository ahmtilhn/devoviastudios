import React, { useEffect, useState } from 'react';
import appData from '../../data/apps.json';
import './devovia-home.css';

const products = appData.apps;

const services = [
  {
    number: '01',
    title: 'Mobile applications',
    text: 'Fast, polished Flutter products designed around real workflows and long-term maintainability.',
    icon: 'phone',
  },
  {
    number: '02',
    title: 'Indie games',
    text: 'Focused game concepts with clear mechanics, rewarding progression and store-ready presentation.',
    icon: 'game',
  },
  {
    number: '03',
    title: 'Product websites',
    text: 'Premium websites that explain the product quickly, build trust and guide visitors toward action.',
    icon: 'window',
  },
  {
    number: '04',
    title: 'Launch support',
    text: 'Google Play testing, store assets, privacy infrastructure and release systems brought into one flow.',
    icon: 'launch',
  },
];

const process = [
  ['01', 'Discover', 'We define the product, audience and the one job the experience must do exceptionally well.'],
  ['02', 'Design', 'We shape the interface, motion and content into a clear visual system before implementation.'],
  ['03', 'Build', 'We develop with clean structure, responsive behavior and the details needed for a dependable release.'],
  ['04', 'Launch', 'We prepare the store, support surface and release flow, then keep improving with real feedback.'],
];

const updates = [
  {
    product: 'Arrow Escape',
    date: 'May 27, 2026',
    title: 'Arrow Escape launched on Google Play',
    text: 'Fading arrows, timed levels, boosters and daily rewards are now live.',
    href: '/products/arrow-escape',
    accent: '#8B5CF6',
  },
  {
    product: 'Stock Manager',
    date: 'May 8, 2026',
    title: 'A more dependable backup flow',
    text: 'Android backup and restore compatibility improved with clearer file handling.',
    href: '/products/stock-manager',
    accent: '#3B82F6',
  },
  {
    product: 'Daily Hadith',
    date: 'May 5, 2026',
    title: 'Prayer alarms and notifications refined',
    text: 'Scheduling, permission handling and resume synchronization are now more stable.',
    href: '/products/daily-hadith',
    accent: '#22D3EE',
  },
];

function Icon({ name, size = 24 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'arrow') return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
  if (name === 'phone') return <svg {...common}><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M10 5h4M11.5 18.5h1" /></svg>;
  if (name === 'game') return <svg {...common}><path d="M8 7h8a5 5 0 0 1 4.6 6.9l-1 2.5a2.7 2.7 0 0 1-4.4 1l-1.3-1.2h-3.8l-1.3 1.2a2.7 2.7 0 0 1-4.4-1l-1-2.5A5 5 0 0 1 8 7Z" /><path d="M7 11v4M5 13h4M16.5 11.5h.01M18.5 14h.01" /></svg>;
  if (name === 'window') return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></svg>;
  if (name === 'launch') return <svg {...common}><path d="M14 5h5v5M13 11l6-6" /><path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" /></svg>;
  if (name === 'star') return <svg {...common}><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>;
  if (name === 'download') return <svg {...common}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>;
  if (name === 'menu') return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === 'close') return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === 'check') return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
  return null;
}

function routeFor(product) {
  return product.id === 'app-1' ? '/products/stock-manager' : `/products/${product.slug}`;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="dv-header">
      <div className="dv-shell dv-nav">
        <a className="dv-brand" href="/" aria-label="Devovia Studio home">
          <img src="/devovia-logo.png" alt="" />
          <span>Devovia Studio</span>
        </a>
        <nav className={open ? 'dv-nav-links is-open' : 'dv-nav-links'} aria-label="Primary navigation">
          <a href="#services" onClick={() => setOpen(false)}>Services</a>
          <a href="#products" onClick={() => setOpen(false)}>Products</a>
          <a href="/updates" onClick={() => setOpen(false)}>Updates</a>
          <a href="/support" onClick={() => setOpen(false)}>Support</a>
          <a className="dv-nav-cta" href="/contact" onClick={() => setOpen(false)}>Start a project <Icon name="arrow" size={17} /></a>
        </nav>
        <button className="dv-menu" type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  );
}

function ProductVisual({ product, index }) {
  const shots = product.screenshots.slice(0, 3);
  return (
    <div className={`dv-product-visual visual-${index + 1}`} style={{ '--product-accent': product.theme }}>
      <div className="dv-product-glow" />
      {shots.map((shot, shotIndex) => (
        <div className={`dv-phone phone-${shotIndex + 1}`} key={shot}>
          <div className="dv-phone-speaker" />
          <img src={shot} alt={`${product.name} app screen ${shotIndex + 1}`} loading="lazy" />
        </div>
      ))}
      <img className="dv-floating-icon" src={product.icon_url} alt="" loading="lazy" />
    </div>
  );
}

function AppMetric({ icon, value, label }) {
  return (
    <div className="dv-metric">
      <Icon name={icon} size={18} />
      <div><strong>{value}</strong><span>{label}</span></div>
    </div>
  );
}

function ProductSection({ product, index }) {
  return (
    <article className={index % 2 ? 'dv-product is-reverse' : 'dv-product'}>
      <ProductVisual product={product} index={index} />
      <div className="dv-product-copy">
        <div className="dv-product-heading">
          <img src={product.icon_url} alt={`${product.name} icon`} loading="lazy" />
          <div><span>{product.category}</span><h3>{product.name}</h3></div>
        </div>
        <p className="dv-product-tagline">{product.tagline}</p>
        <p>{product.short_desc}</p>
        <div className="dv-metrics">
          <AppMetric icon="download" value={product.downloads_text} label="Downloads" />
          <AppMetric icon="star" value={product.rating_text} label={product.reviews_text} />
        </div>
        <div className="dv-product-actions">
          <a className="dv-button dv-button-primary" href={routeFor(product)}>View product <Icon name="arrow" size={18} /></a>
          <a className="dv-button dv-button-ghost" href={product.play_url} target="_blank" rel="noreferrer">Google Play</a>
        </div>
      </div>
    </article>
  );
}

function Footer() {
  return (
    <footer className="dv-footer">
      <div className="dv-shell dv-footer-grid">
        <div className="dv-footer-brand">
          <a className="dv-brand" href="/"><img src="/devovia-logo.png" alt="" /><span>Devovia Studio</span></a>
          <p>Independent digital products, thoughtfully designed and built in the Netherlands.</p>
          <a href="mailto:info@devoviastudio.com">info@devoviastudio.com</a>
        </div>
        <div><strong>Explore</strong><a href="/products">Products</a><a href="/updates">Updates</a><a href="/blog">Blog</a></div>
        <div><strong>Company</strong><a href="#about">About</a><a href="/contact">Contact</a><a href="/support">Support</a></div>
        <div><strong>Legal</strong><a href="/support">Privacy hub</a><a href="/support">Terms & policies</a><a href="/app-ads.txt">App-ads.txt</a></div>
      </div>
      <div className="dv-shell dv-footer-bottom"><span>© 2026 Devovia Studio</span><span>Apps, games & digital products.</span></div>
    </footer>
  );
}

export default function DevoviaHome() {
  useEffect(() => {
    document.title = 'Devovia Studio — Apps, Games & Digital Products';
    const description = document.querySelector('meta[name="description"]') || document.head.appendChild(document.createElement('meta'));
    description.setAttribute('name', 'description');
    description.setAttribute('content', 'Devovia Studio designs and develops polished mobile apps, indie games and product websites.');
  }, []);

  return (
    <div className="dv-site">
      <Header />
      <main>
        <section className="dv-hero">
          <div className="dv-hero-orb orb-one" />
          <div className="dv-hero-orb orb-two" />
          <div className="dv-shell dv-hero-grid">
            <div className="dv-hero-copy">
              <div className="dv-eyebrow"><span /> Apps, games & digital products</div>
              <h1>We build digital products <em>people enjoy using.</em></h1>
              <p>Devovia Studio designs and develops thoughtful mobile apps, indie games and product experiences—from the first idea to a confident launch.</p>
              <div className="dv-hero-actions">
                <a className="dv-button dv-button-primary" href="#products">Explore products <Icon name="arrow" size={18} /></a>
                <a className="dv-button dv-button-secondary" href="/contact">Start a project</a>
              </div>
              <div className="dv-hero-proof">
                <div><strong>{products.length}</strong><span>Published products</span></div>
                <div><strong>500+</strong><span>Users reached</span></div>
                <div><strong>4.9</strong><span>Average rating</span></div>
              </div>
            </div>
            <div className="dv-hero-showcase" aria-label="Devovia product preview">
              <div className="dv-showcase-card card-blue"><span>PRODUCTIVITY</span><img src={products[0].screenshots[0]} alt="Stock Manager screen" /></div>
              <div className="dv-showcase-card card-violet"><span>PUZZLE GAME</span><img src={products[1].screenshots[0]} alt="Arrow Escape screen" /></div>
              <div className="dv-showcase-card card-cyan"><span>DAILY ROUTINE</span><img src={products[2].screenshots[0]} alt="Daily Hadith screen" /></div>
              <div className="dv-showcase-badge badge-top"><span>Built with care</span><Icon name="check" size={17} /></div>
              <div className="dv-showcase-badge badge-bottom"><strong>4.9</strong><span>user rating</span><Icon name="star" size={16} /></div>
            </div>
          </div>
        </section>

        <section className="dv-capability-strip" aria-label="Capabilities">
          <div className="dv-shell"><span>Flutter</span><i /> <span>UI / UX</span><i /> <span>Product strategy</span><i /> <span>Google Play</span><i /> <span>Web experiences</span></div>
        </section>

        <section className="dv-section" id="services">
          <div className="dv-shell">
            <div className="dv-section-head">
              <div><div className="dv-eyebrow"><span /> What we build</div><h2>From idea to a product<br />ready for real users.</h2></div>
              <p>One studio for product thinking, visual design, development and the launch details that make a digital product feel complete.</p>
            </div>
            <div className="dv-service-grid">
              {services.map((service) => (
                <article className="dv-service-card" key={service.number}>
                  <div className="dv-service-top"><span>{service.number}</span><div><Icon name={service.icon} /></div></div>
                  <h3>{service.title}</h3><p>{service.text}</p>
                  <a href="/services">Learn more <Icon name="arrow" size={17} /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dv-section dv-products-section" id="products">
          <div className="dv-shell">
            <div className="dv-section-head dv-products-head">
              <div><div className="dv-eyebrow"><span /> Selected products</div><h2>Products made to solve<br />one problem clearly.</h2></div>
              <a className="dv-text-link" href="/products">See all products <Icon name="arrow" size={18} /></a>
            </div>
            <div className="dv-product-list">
              {products.map((product, index) => <ProductSection product={product} index={index} key={product.id} />)}
            </div>
          </div>
        </section>

        <section className="dv-section dv-process-section">
          <div className="dv-shell">
            <div className="dv-process-intro">
              <div className="dv-eyebrow dv-eyebrow-light"><span /> How we work</div>
              <h2>A simple process.<br />A carefully finished result.</h2>
              <p>Every phase removes uncertainty, keeps the product focused and protects the details that users eventually feel.</p>
              <a className="dv-button dv-button-light" href="/contact">Discuss a project <Icon name="arrow" size={18} /></a>
            </div>
            <div className="dv-process-grid">
              {process.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="dv-section dv-updates" id="updates">
          <div className="dv-shell">
            <div className="dv-section-head">
              <div><div className="dv-eyebrow"><span /> Latest updates</div><h2>Products that keep<br />moving forward.</h2></div>
              <a className="dv-text-link" href="/updates">View release notes <Icon name="arrow" size={18} /></a>
            </div>
            <div className="dv-update-grid">
              {updates.map((update) => (
                <a className="dv-update-card" href={update.href} key={update.title} style={{ '--update-accent': update.accent }}>
                  <div className="dv-update-line" /><div className="dv-update-meta"><span>{update.product}</span><time>{update.date}</time></div>
                  <h3>{update.title}</h3><p>{update.text}</p><span className="dv-update-action">Read update <Icon name="arrow" size={17} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="dv-section dv-about" id="about">
          <div className="dv-shell dv-about-grid">
            <div className="dv-about-visual">
              <div className="dv-about-mark"><img src="/devovia-logo.png" alt="Devovia Studio" /></div>
              <div className="dv-about-chip chip-one">Product thinking</div>
              <div className="dv-about-chip chip-two">Visual clarity</div>
              <div className="dv-about-chip chip-three">Reliable engineering</div>
            </div>
            <div className="dv-about-copy">
              <div className="dv-eyebrow"><span /> About Devovia</div>
              <h2>Independent by choice.<br />Ambitious by design.</h2>
              <p>Devovia Studio is an independent product studio in the Netherlands. We create our own apps and games while helping other teams turn promising ideas into clear, launch-ready digital products.</p>
              <div className="dv-about-values">
                <div><strong>01</strong><span>Useful before impressive</span></div>
                <div><strong>02</strong><span>Clarity in every decision</span></div>
                <div><strong>03</strong><span>Built for the long term</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="dv-cta-section">
          <div className="dv-shell dv-cta-card">
            <div className="dv-cta-orb" />
            <div><div className="dv-eyebrow dv-eyebrow-light"><span /> Let’s make it real</div><h2>Have an idea worth building?</h2><p>Tell us what you want to create, where you are now and what a successful launch should look like.</p></div>
            <a className="dv-button dv-button-light" href="/contact">Start a conversation <Icon name="arrow" size={18} /></a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
