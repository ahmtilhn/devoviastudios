import { useEffect } from 'react';

const services = [
  {
    icon: '01',
    title: 'Mobile App Development',
    text: 'Android and iOS apps with premium interfaces, smooth user flows and scalable product foundations.',
  },
  {
    icon: '02',
    title: 'Website Development',
    text: 'Fast, responsive and professional websites that make your business look serious from the first visit.',
  },
  {
    icon: '03',
    title: 'Custom Software',
    text: 'Dashboards, internal tools and automations built around the way your business actually works.',
  },
  {
    icon: '04',
    title: 'UI/UX & Product Design',
    text: 'Clean structure, clear journeys and interface decisions that help users understand your product fast.',
  },
];

const processSteps = [
  ['01', 'Discover', 'We clarify your idea, goals, users and the result your business needs.'],
  ['02', 'Design', 'We shape the experience with clean screens, strong structure and a clear user journey.'],
  ['03', 'Develop', 'We build the product with modern code, responsive layouts and reliable foundations.'],
  ['04', 'Launch', 'We publish, test and improve the final version so it is ready for real users.'],
];

const projectTypes = [
  'Mobile apps',
  'Business websites',
  'Admin dashboards',
  'Booking systems',
  'Inventory tools',
  'Automation flows',
  'Internal portals',
  'Landing pages',
];

const storyFragments = [
  ['Strategy', 'Clear scope before design'],
  ['Interface', 'Premium product screens'],
  ['Development', 'Fast, scalable build'],
  ['Launch', 'Tested and ready'],
];

function useScrollExperience() {
  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll('.reveal'));
    const scenes = Array.from(document.querySelectorAll('[data-scroll-scene]'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -70px' },
    );

    revealItems.forEach((item) => observer.observe(item));

    let frame = null;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const ease = (value) => value * value * (3 - 2 * value);

    const updateScenes = () => {
      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const viewport = window.innerHeight || 1;
        const scrollable = Math.max(rect.height - viewport, 1);
        const progress = clamp(-rect.top / scrollable, 0, 1);
        const smooth = ease(progress);

        scene.style.setProperty('--scene-progress', progress.toFixed(4));
        scene.style.setProperty('--progress-width', `${Math.round(progress * 100)}%`);
        scene.style.setProperty('--fragment-opacity', `${0.56 + smooth * 0.44}`);
        scene.style.setProperty('--core-scale', `${1 - smooth * 0.08}`);

        scene.style.setProperty('--piece-a-x', `${-112 * smooth}px`);
        scene.style.setProperty('--piece-a-y', `${-42 * smooth}px`);
        scene.style.setProperty('--piece-a-r', `${-8 * smooth}deg`);

        scene.style.setProperty('--piece-b-x', `${96 * smooth}px`);
        scene.style.setProperty('--piece-b-y', `${-88 * smooth}px`);
        scene.style.setProperty('--piece-b-r', `${9 * smooth}deg`);

        scene.style.setProperty('--piece-c-x', `${-92 * smooth}px`);
        scene.style.setProperty('--piece-c-y', `${102 * smooth}px`);
        scene.style.setProperty('--piece-c-r', `${7 * smooth}deg`);

        scene.style.setProperty('--piece-d-x', `${110 * smooth}px`);
        scene.style.setProperty('--piece-d-y', `${72 * smooth}px`);
        scene.style.setProperty('--piece-d-r', `${-7 * smooth}deg`);
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

function App() {
  useScrollExperience();

  return (
    <div className="site-shell">
      <header className="header">
        <a className="brand" href="#top" aria-label="Devovia Studio home">
          <span className="brand-mark">D</span>
          <span>Devovia Studio</span>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#studio-system">Experience</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-cta" href="mailto:info@devoviastudio.com">Start a project</a>
      </header>

      <main id="top">
        <section className="hero section-grid">
          <div className="hero-copy reveal is-visible">
            <p className="eyebrow">Android • iOS • Websites • Software</p>
            <h1>
              <span>Digital products</span>
              <span>that feel premium.</span>
            </h1>
            <p className="hero-text">
              Devovia Studio designs and develops modern mobile apps, websites and custom software for businesses that want to look stronger, move faster and grow online.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#contact">Start your project</a>
              <a className="button secondary" href="#studio-system">See the experience</a>
            </div>
            <div className="trust-row" aria-label="Core strengths">
              <span>Premium design</span>
              <span>Clean code</span>
              <span>Business-focused</span>
            </div>
          </div>

          <div className="hero-card reveal is-visible" aria-label="Devovia Studio capability card">
            <div className="orb orb-one"></div>
            <div className="orb orb-two"></div>
            <div className="screen-card main-screen">
              <span className="status-dot"></span>
              <p>Devovia Product Engine</p>
              <h2>Design. Build. Launch.</h2>
              <div className="metric-grid">
                <div><strong>Apps</strong><span>Android & iOS</span></div>
                <div><strong>Web</strong><span>Company sites</span></div>
                <div><strong>Tools</strong><span>Dashboards</span></div>
                <div><strong>Growth</strong><span>Launch support</span></div>
              </div>
            </div>
            <div className="floating-card one">UI/UX Design</div>
            <div className="floating-card two">Automation</div>
            <div className="floating-card three">React • Flutter</div>
          </div>
        </section>

        <section className="story-section" id="studio-system" data-scroll-scene>
          <div className="story-sticky">
            <div className="story-copy reveal">
              <p className="eyebrow">Scroll experience</p>
              <h2>As you scroll, the product breaks into its core layers.</h2>
              <p>
                This is the feeling we want for Devovia Studio: one strong digital product, then each layer separates and explains itself — strategy, interface, development and launch.
              </p>
              <div className="story-progress" aria-label="Scroll progress">
                <span></span>
              </div>
            </div>

            <div className="build-visual" aria-label="Animated product layers">
              <div className="product-core">
                <div className="browser-bar">
                  <span></span><span></span><span></span>
                </div>
                <div className="core-glow"></div>
                <p>Complete product</p>
                <h3>Devovia Studio</h3>
                <div className="core-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              {storyFragments.map(([title, text], index) => (
                <article className={`fragment-card fragment-${index + 1}`} key={title}>
                  <span>{`0${index + 1}`}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}

              <div className="code-shard shard-one">mobile_app.dart</div>
              <div className="code-shard shard-two">website.jsx</div>
              <div className="code-shard shard-three">launch.json</div>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-heading reveal">
            <p className="eyebrow">What we do</p>
            <h2>Digital solutions designed for real business needs.</h2>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article className="service-card reveal" style={{ '--delay': `${index * 70}ms` }} key={service.title}>
                <span className="card-index">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section split-section reveal">
          <div>
            <p className="eyebrow">Why Devovia</p>
            <h2>Small studio focus, premium product standards.</h2>
          </div>
          <div className="feature-list">
            <p>We create digital products that look professional, work smoothly on every screen and support your business instead of complicating it.</p>
            <ul>
              <li>Responsive design for mobile, tablet and desktop</li>
              <li>Clear user journeys and simple navigation</li>
              <li>Modern frontend foundations ready for growth</li>
              <li>Launch support, maintenance and improvements</li>
            </ul>
          </div>
        </section>

        <section className="section" id="process">
          <div className="section-heading reveal">
            <p className="eyebrow">Our process</p>
            <h2>From idea to launch without unnecessary complexity.</h2>
          </div>
          <div className="process-grid">
            {processSteps.map(([number, title, text], index) => (
              <article className="process-card reveal" style={{ '--delay': `${index * 80}ms` }} key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section projects-section reveal">
          <div className="section-heading">
            <p className="eyebrow">Project types</p>
            <h2>We build the digital pieces your business needs.</h2>
          </div>
          <div className="pill-grid">
            {projectTypes.map((item, index) => <span style={{ '--delay': `${index * 40}ms` }} key={item}>{item}</span>)}
          </div>
        </section>

        <section className="section contact-section reveal" id="contact">
          <div className="contact-copy">
            <p className="eyebrow">Contact</p>
            <h2>Have an app, website or software idea?</h2>
            <p>Tell us what you want to build. We will help shape the idea into a clear digital product plan.</p>
            <a className="email-link" href="mailto:info@devoviastudio.com">info@devoviastudio.com</a>
          </div>

          <form className="contact-form" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden-field">
              <label>Do not fill this field <input name="bot-field" /></label>
            </p>
            <label>
              Name
              <input name="name" type="text" placeholder="Your name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>
            <label>
              Company
              <input name="company" type="text" placeholder="Company name" />
            </label>
            <label>
              Service
              <select name="service" defaultValue="Mobile App Development">
                <option>Mobile App Development</option>
                <option>Website Development</option>
                <option>Custom Software</option>
                <option>UI/UX & Product Design</option>
              </select>
            </label>
            <label className="full">
              Message
              <textarea name="message" rows="5" placeholder="Tell us about your project" required></textarea>
            </label>
            <button className="button primary full" type="submit">Send message</button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Devovia Studio. All rights reserved.</span>
        <span>Based in the Netherlands.</span>
      </footer>
    </div>
  );
}

export default App;
