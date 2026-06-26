import React, { useEffect, useRef, useState } from 'react';
import appData from '../../data/apps.json';
import './devovia-home.css';

const products = appData.apps;

const services = [
  {
    number: '01',
    title: 'Mobile applications',
    text: 'We turn useful ideas into fast, friendly Flutter apps that feel clear from the very first tap.',
    icon: 'phone',
    href: '/services/mobile-app-development',
  },
  {
    number: '02',
    title: 'Indie games',
    text: 'Focused game ideas shaped into satisfying loops, polished progression and a store-ready experience.',
    icon: 'game',
    href: '/services/game-development',
  },
  {
    number: '03',
    title: 'Product websites',
    text: 'Warm, confident websites that show what your product does and make the next step easy to understand.',
    icon: 'window',
    href: '/services/web-development',
  },
  {
    number: '04',
    title: 'Launch support',
    text: 'Practical help with Google Play testing, store assets, policy pages and the details around a smooth release.',
    icon: 'launch',
    href: '/services/google-play-test-support',
  },
];

const process = [
  ['01', 'Listen', 'We start with the problem, the people using the product and what a good outcome should feel like.'],
  ['02', 'Shape', 'We bring the flow, interface, content and motion together before unnecessary complexity gets in the way.'],
  ['03', 'Build', 'We develop a responsive, maintainable product and pay attention to the small details people notice.'],
  ['04', 'Launch & learn', 'We prepare the store and support experience, then improve the product with real feedback.'],
];

const updates = [
  {
    product: 'Arrow Escape',
    date: 'May 27, 2026',
    title: 'Arrow Escape is now on Google Play',
    text: 'Fading arrows, timed levels, boosters and daily rewards are ready to play.',
    href: '/products/arrow-escape',
    accent: '#8B5CF6',
  },
  {
    product: 'Stock Manager',
    date: 'May 8, 2026',
    title: 'Backup and restore now feels simpler',
    text: 'Android file handling is clearer and moving a backup between devices is more dependable.',
    href: '/products/stock-manager',
    accent: '#3B82F6',
  },
  {
    product: 'Daily Hadith',
    date: 'May 5, 2026',
    title: 'Prayer reminders are more dependable',
    text: 'Scheduling, permission handling and resume synchronization have been refined.',
    href: '/products/daily-hadith',
    accent: '#22D3EE',
  },
];

function Icon({ name, size = 24 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

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

function usePointerMotion(siteRef) {
  useEffect(() => {
    const site = siteRef.current;
    if (!site) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (reducedMotion.matches || !finePointer.matches) return undefined;

    let frame = 0;
    const updatePointer = (event) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const normalizedX = event.clientX / window.innerWidth - 0.5;
        const normalizedY = event.clientY / window.innerHeight - 0.5;

        site.style.setProperty('--dv-pointer-x', `${event.clientX}px`);
        site.style.setProperty('--dv-pointer-y', `${event.clientY}px`);
        site.style.setProperty('--dv-shift-x', `${normalizedX * 16}px`);
        site.style.setProperty('--dv-shift-y', `${normalizedY * 12}px`);
        site.style.setProperty('--dv-shift-x-reverse', `${normalizedX * -11}px`);
        site.style.setProperty('--dv-shift-y-reverse', `${normalizedY * -8}px`);
        site.style.setProperty('--dv-tilt-x', `${normalizedY * -2.4}deg`);
        site.style.setProperty('--dv-tilt-y', `${normalizedX * 3.4}deg`);
      });
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', updatePointer);
    };
  }, [siteRef]);
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className="dv-header">
      <div className="dv-shell dv-nav">
        <a className="dv-brand" href="/" aria-label="Devovia Studio home">
          <img src="/devovia-logo.png" alt="" />
          <span>Devovia Studio</span>
        </a>
        <nav id="dv-primary-navigation" className={open ? 'dv-nav-links is-open' : 'dv-nav-links'} aria-label="Primary navigation">
          <a href="#services" onClick={() => setOpen(false)}>Services</a>
          <a href="#products" onClick={() => setOpen(false)}>Products</a>
          <a href="/updates" onClick={() => setOpen(false)}>Updates</a>
          <a href="/support" onClick={() => setOpen(false)}>Support</a>
          <a className="dv-nav-cta" href="/contact" onClick={() => setOpen(false)}>Tell us your idea <Icon name="arrow" size={17} /></a>
        </nav>
        <button
          className="dv-menu"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="dv-primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  );
}

function ProductVisual({ product, index }) {
  return (
    <div className={`dv-product-visual visual-${index + 1}`} style={{ '--product-accent': product.theme }}>
      <div className="dv-product-stage" aria-hidden="true" />
      <div className="dv-product-glow" aria-hidden="true" />
      {product.screenshots.slice(0, 3).map((shot, shotIndex) => (
        <div className={`dv-phone phone-${shotIndex + 1}`} key={shot}>
          <div className="dv-phone-speaker" />
          <img src={shot} alt={`${product.name} app screen ${shotIndex + 1}`} loading="lazy" />
          <span className="dv-phone-glass" aria-hidden="true" />
          <span className="dv-phone-button" aria-hidden="true" />
        </div>
      ))}
      <img className="dv-floating-icon" src={product.icon_url} alt="" loading="lazy" />
    </div>
  );
}

function AppMetric({ icon, value, label }) {
  return <div className="dv-metric"><Icon name={icon} size={18} /><div><strong>{value}</strong><span>{label}</span></div></div>;
}

function ProductSection({ product, index }) {
  const hasRating = Number.parseFloat(product.rating_text) > 0 && !product.reviews_text.startsWith('0');
  const ratingLabel = hasRating ? product.reviews_text.replace('comments', 'reviews') : 'Recently launched';

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
          <AppMetric icon="download" value={product.downloads_text} label="Google Play installs" />
          <AppMetric icon="star" value={hasRating ? product.rating_text : 'New'} label={ratingLabel} />
        </div>
        <div className="dv-product-actions">
          <a className="dv-button dv-button-primary" href={routeFor(product)}>See the product <Icon name="arrow" size={18} /></a>
          <a className="dv-button dv-button-ghost" href={product.play_url} target="_blank" rel="noreferrer">Open Google Play</a>
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
          <p>A small independent studio making useful apps, playful games and clear digital experiences from the Netherlands.</p>
          <a href="mailto:info@devoviastudio.com">info@devoviastudio.com</a>
        </div>
        <div><strong>Explore</strong><a href="/products">Products</a><a href="/updates">Updates</a><a href="/blog">Blog</a></div>
        <div><strong>Studio</strong><a href="#about">About</a><a href="/contact">Contact</a><a href="/support">Support</a></div>
        <div><strong>Legal</strong><a href="/support">Privacy hub</a><a href="/support">Terms & policies</a><a href="/app-ads.txt">App-ads.txt</a></div>
      </div>
      <div className="dv-shell dv-footer-bottom"><span>© 2026 Devovia Studio</span><span>Made with care in the Netherlands.</span></div>
    </footer>
  );
}

export default function DevoviaHome() {
  const siteRef = useRef(null);
  usePointerMotion(siteRef);

  useEffect(() => {
    document.title = 'Devovia Studio — Friendly Apps, Games & Digital Products';
    const description = document.querySelector('meta[name="description"]') || document.head.appendChild(document.createElement('meta'));
    description.setAttribute('name', 'description');
    description.setAttribute('content', 'Devovia Studio turns useful ideas into friendly mobile apps, indie games and product websites—from first sketch to launch.');
  }, []);

  return (
    <div className="dv-site" ref={siteRef}>
      <div className="dv-interactive-background" aria-hidden="true">
        <div className="dv-pointer-aura" />
        <div className="dv-background-grid" />
        <div className="dv-ambient-orb dv-ambient-one" />
        <div className="dv-ambient-orb dv-ambient-two" />
      </div>
      <Header />
      <main>
        <section className="dv-hero">
          <div className="dv-shell dv-hero-grid">
            <div className="dv-hero-copy">
              <div className="dv-eyebrow"><span /> Apps, games & digital products</div>
              <h1>Useful ideas, turned into products <em>people feel at home with.</em></h1>
              <p>We design and build thoughtful mobile apps, indie games and product websites. You bring the idea; we help make it clear, polished and ready for real people.</p>
              <div className="dv-hero-actions">
                <a className="dv-button dv-button-primary" href="#products">Meet our products <Icon name="arrow" size={18} /></a>
                <a className="dv-button dv-button-secondary" href="/contact">Talk about your idea</a>
              </div>
              <div className="dv-hero-proof" aria-label="Studio highlights">
                <div><strong>{products.length}</strong><span>Published products</span></div>
                <div><strong>600+</strong><span>Google Play installs</span></div>
                <div><strong>NL</strong><span>Independent studio</span></div>
              </div>
            </div>
            <div className="dv-hero-showcase" aria-label="Devovia product preview">
              <div className="dv-showcase-halo" aria-hidden="true" />
              <div className="dv-showcase-card card-blue">
                <div className="dv-device-screen"><img src={products[0].screenshots[0]} alt="Stock Manager screen" /></div>
                <div className="dv-device-caption">Productivity</div><i className="dv-device-button" aria-hidden="true" />
              </div>
              <div className="dv-showcase-card card-violet">
                <div className="dv-device-screen"><img src={products[1].screenshots[0]} alt="Arrow Escape screen" /></div>
                <div className="dv-device-caption">Puzzle game</div><i className="dv-device-button" aria-hidden="true" />
              </div>
              <div className="dv-showcase-card card-cyan">
                <div className="dv-device-screen"><img src={products[2].screenshots[0]} alt="Daily Hadith screen" /></div>
                <div className="dv-device-caption">Daily routine</div><i className="dv-device-button" aria-hidden="true" />
              </div>
              <div className="dv-showcase-badge badge-top"><span>Made with care</span><Icon name="check" size={17} /></div>
              <div className="dv-showcase-badge badge-bottom"><strong>4</strong><span>live products</span><Icon name="star" size={16} /></div>
            </div>
          </div>
        </section>

        <section className="dv-capability-strip" aria-label="Capabilities"><div className="dv-shell"><span>Flutter</span><i /><span>UI / UX</span><i /><span>Product strategy</span><i /><span>Google Play</span><i /><span>Web experiences</span></div></section>

        <section className="dv-section" id="services">
          <div className="dv-shell">
            <div className="dv-section-head"><div><div className="dv-eyebrow"><span /> How we can help</div><h2>One small team for the whole product journey.</h2></div><p>From an early idea to launch day, we keep strategy, design, development and support connected—so the experience feels like one product, not a pile of separate parts.</p></div>
            <div className="dv-service-grid">{services.map((service) => <article className="dv-service-card" key={service.number}><div className="dv-service-top"><span>{service.number}</span><div><Icon name={service.icon} /></div></div><h3>{service.title}</h3><p>{service.text}</p><a href={service.href}>See how we help <Icon name="arrow" size={17} /></a></article>)}</div>
          </div>
        </section>

        <section className="dv-section dv-products-section" id="products">
          <div className="dv-shell">
            <div className="dv-section-head dv-products-head"><div><div className="dv-eyebrow"><span /> Products in the wild</div><h2>Built around real, everyday moments.</h2></div><a className="dv-text-link" href="/products">See every product <Icon name="arrow" size={18} /></a></div>
            <div className="dv-product-list">{products.map((product, index) => <ProductSection product={product} index={index} key={product.id} />)}</div>
          </div>
        </section>

        <section className="dv-section dv-process-section">
          <div className="dv-shell">
            <div className="dv-process-intro"><div className="dv-eyebrow dv-eyebrow-light"><span /> Working together</div><h2>Clear steps.<br />No mystery.</h2><p>You always know what we are solving, what comes next and why a decision was made. The process stays practical, collaborative and focused on the people who will use the product.</p><a className="dv-button dv-button-light" href="/contact">Tell us what you are building <Icon name="arrow" size={18} /></a></div>
            <div className="dv-process-grid">{process.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
          </div>
        </section>

        <section className="dv-section dv-updates">
          <div className="dv-shell">
            <div className="dv-section-head"><div><div className="dv-eyebrow"><span /> What is new</div><h2>Small improvements that keep products moving.</h2></div><a className="dv-text-link" href="/updates">Read all release notes <Icon name="arrow" size={18} /></a></div>
            <div className="dv-update-grid">{updates.map((update) => <a className="dv-update-card" href={update.href} key={update.title} style={{ '--update-accent': update.accent }}><div className="dv-update-line" /><div className="dv-update-meta"><span>{update.product}</span><time>{update.date}</time></div><h3>{update.title}</h3><p>{update.text}</p><span className="dv-update-action">Read the update <Icon name="arrow" size={17} /></span></a>)}</div>
          </div>
        </section>

        <section className="dv-section dv-about" id="about">
          <div className="dv-shell dv-about-grid">
            <div className="dv-about-visual"><div className="dv-about-mark"><img src="/devovia-logo.png" alt="Devovia Studio" /></div><div className="dv-about-chip chip-one">Useful by default</div><div className="dv-about-chip chip-two">Clear by design</div><div className="dv-about-chip chip-three">Built to last</div></div>
            <div className="dv-about-copy"><div className="dv-eyebrow"><span /> A little about us</div><h2>Small studio.<br />Close collaboration.</h2><p>Devovia Studio is an independent product studio in the Netherlands. We make our own apps and games, and we help other teams turn promising ideas into digital products that are easier to understand, use and trust.</p><div className="dv-about-values"><div><strong>01</strong><span>We listen before we design</span></div><div><strong>02</strong><span>We choose clarity over noise</span></div><div><strong>03</strong><span>We stay involved after launch</span></div></div></div>
          </div>
        </section>

        <section className="dv-cta-section">
          <div className="dv-shell dv-cta-card"><div className="dv-cta-orb" /><div><div className="dv-eyebrow dv-eyebrow-light"><span /> Start with a conversation</div><h2>Got an idea? Let’s talk it through.</h2><p>Share what you want to make, where you are today and what feels difficult. We will help you find the clearest next step.</p></div><a className="dv-button dv-button-light" href="/contact">Tell us about it <Icon name="arrow" size={18} /></a></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
