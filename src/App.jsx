const services = [
  {
    title: 'Android App Development',
    text: 'Native-feeling Android apps with clean interfaces, scalable structure and smooth user flows.',
  },
  {
    title: 'iOS App Development',
    text: 'Modern iPhone apps designed for performance, trust and a premium Apple-style experience.',
  },
  {
    title: 'Website Development',
    text: 'Fast, responsive and professional websites for companies that need a stronger digital presence.',
  },
  {
    title: 'Software Solutions',
    text: 'Custom digital tools, dashboards and automations that help businesses work faster and smarter.',
  },
];

const processSteps = [
  ['01', 'Discover', 'We understand your idea, goals, users and business needs.'],
  ['02', 'Design', 'We shape the structure, interface and user journey before development.'],
  ['03', 'Develop', 'We build the product with clean code, responsive layouts and reliable foundations.'],
  ['04', 'Launch', 'We publish, test and improve the final product so it is ready for real users.'],
];

const projectTypes = [
  'Mobile apps',
  'Business websites',
  'Admin panels',
  'Booking systems',
  'Inventory tools',
  'Automation flows',
];

function App() {
  return (
    <div className="site-shell">
      <header className="header">
        <a className="brand" href="#top" aria-label="Devovia Studio home">
          <span className="brand-mark">D</span>
          <span>Devovia Studio</span>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-cta" href="mailto:info@devoviastudio.com">Start a project</a>
      </header>

      <main id="top">
        <section className="hero section-grid">
          <div className="hero-copy">
            <p className="eyebrow">Android • iOS • Websites • Software</p>
            <h1>Modern apps and websites for businesses that want to grow.</h1>
            <p className="hero-text">
              Devovia Studio builds clean, fast and reliable digital products — from mobile apps to company websites and custom software solutions.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#contact">Start your project</a>
              <a className="button secondary" href="#services">View services</a>
            </div>
            <div className="trust-row" aria-label="Core strengths">
              <span>Mobile-first</span>
              <span>Fast delivery</span>
              <span>Business-focused</span>
            </div>
          </div>

          <div className="hero-card" aria-label="Devovia Studio capability card">
            <div className="screen-card main-screen">
              <span className="status-dot"></span>
              <p>Digital Product Studio</p>
              <h2>Build. Launch. Improve.</h2>
              <div className="metric-grid">
                <div><strong>Android</strong><span>Apps</span></div>
                <div><strong>iOS</strong><span>Apps</span></div>
                <div><strong>Web</strong><span>Sites</span></div>
                <div><strong>Custom</strong><span>Tools</span></div>
              </div>
            </div>
            <div className="floating-card one">UI/UX Design</div>
            <div className="floating-card two">Automation</div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-heading">
            <p className="eyebrow">What we do</p>
            <h2>Digital solutions designed for real business needs.</h2>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section split-section">
          <div>
            <p className="eyebrow">Why Devovia</p>
            <h2>Clean design, strong structure and practical execution.</h2>
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
          <div className="section-heading">
            <p className="eyebrow">Our process</p>
            <h2>From idea to launch without unnecessary complexity.</h2>
          </div>
          <div className="process-grid">
            {processSteps.map(([number, title, text]) => (
              <article className="process-card" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section projects-section">
          <div className="section-heading">
            <p className="eyebrow">Project types</p>
            <h2>We build the digital pieces your business needs.</h2>
          </div>
          <div className="pill-grid">
            {projectTypes.map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-copy">
            <p className="eyebrow">Contact</p>
            <h2>Have an app, website or software idea?</h2>
            <p>Tell us what you want to build. We will help shape the idea into a clear digital product plan.</p>
            <a className="email-link" href="mailto:info@devoviastudio.com">info@devoviastudio.com</a>
          </div>

          <form className="contact-form" name="contact" method="POST" data-netlify="true">
            <input type="hidden" name="form-name" value="contact" />
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
              <select name="service" defaultValue="Android App Development">
                <option>Android App Development</option>
                <option>iOS App Development</option>
                <option>Website Development</option>
                <option>Software Solution</option>
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
