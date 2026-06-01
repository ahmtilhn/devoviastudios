import React, { useEffect } from 'react';

const routeTypes = ['Hike', 'Gravel', 'Road', 'MTB'];

const featuredRoutes = [
  {
    title: 'Veluwe forest loop',
    meta: 'Hike · 12.4 km · 220 m climb',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Dune coast ride',
    meta: 'Gravel · 48 km · 310 m climb',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Lake morning run',
    meta: 'Run · 8.2 km · easy surface',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  },
];

const plannerFacts = [
  ['Distance', '38.6 km'],
  ['Elevation', '640 m'],
  ['Surface', '62% trail'],
  ['Time', '3h 45m'],
];

const steps = [
  ['Discover', 'Find nearby routes, highlights and quiet places worth saving.'],
  ['Plan', 'Shape your route with waypoints, surface notes and elevation detail.'],
  ['Navigate', 'Use offline-ready guidance built for places with weak signal.'],
  ['Share', 'Turn completed routes into useful recommendations for others.'],
];

function useScrollReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll('[data-reveal]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -80px' });

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function RouteMap() {
  return (
    <div className="route-map" aria-label="Route planner preview">
      <div className="terrain-layer"></div>
      <svg className="route-line" viewBox="0 0 520 420" role="img" aria-label="Planned route line">
        <path className="route-shadow" d="M74 332 C132 264 138 184 216 176 C298 166 304 78 390 92 C454 104 450 176 402 218 C338 274 382 342 456 336" />
        <path className="route-active" d="M74 332 C132 264 138 184 216 176 C298 166 304 78 390 92 C454 104 450 176 402 218 C338 274 382 342 456 336" />
      </svg>
      <span className="map-pin start">A</span>
      <span className="map-pin middle">2</span>
      <span className="map-pin finish">B</span>
      <div className="map-label ridge">forest ridge</div>
      <div className="map-label water">lake path</div>
      <div className="elevation-strip">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
    </div>
  );
}

function PlannerPreview() {
  return (
    <section className="planner-section" id="planner" data-reveal>
      <div className="planner-copy">
        <p className="kicker">Route planner</p>
        <h2>Build a route that matches the ground beneath your feet.</h2>
        <p>
          Pick a sport, add waypoints, review climb and surface detail, then save the route before heading out.
        </p>
        <div className="planner-facts">
          {plannerFacts.map(([label, value]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="planner-workspace">
        <aside className="planner-panel">
          <div className="mode-tabs">
            {routeTypes.map((type, index) => (
              <button className={index === 1 ? 'active' : ''} type="button" key={type}>{type}</button>
            ))}
          </div>
          <label>
            Start
            <input value="Arnhem station" readOnly />
          </label>
          <label>
            Finish
            <input value="Posbank viewpoint" readOnly />
          </label>
          <div className="waypoint-list">
            <span>Include quiet roads</span>
            <span>Prefer natural surfaces</span>
            <span>Avoid busy crossings</span>
          </div>
          <button className="plan-button" type="button">Save route</button>
        </aside>
        <RouteMap />
      </div>
    </section>
  );
}

function App() {
  useScrollReveal();

  return (
    <div className="explore-site">
      <header className="explore-header">
        <a className="explore-brand" href="#top" aria-label="Devovia Explore home">
          <span className="brand-symbol">D</span>
          <span>Devovia Explore</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#discover">Discover</a>
          <a href="#planner">Planner</a>
          <a href="#features">Features</a>
          <a href="#support">Support</a>
        </nav>
        <a className="header-action" href="#planner">Plan route</a>
      </header>

      <main id="top">
        <section className="explore-hero">
          <div className="hero-image" aria-hidden="true"></div>
          <div className="hero-overlay"></div>
          <div className="hero-content" data-reveal>
            <p className="kicker">Outdoor planning concept by Devovia Studio</p>
            <h1>Rotaları keşfet, planla ve yola çık.</h1>
            <p>
              Trails, road rides and weekend escapes in one calm planning experience.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#discover">Explore routes</a>
              <a className="secondary-action" href="#planner">Open planner</a>
            </div>
          </div>
          <div className="hero-route-card" data-reveal>
            <span>Today near Arnhem</span>
            <strong>38.6 km gravel route</strong>
            <div className="mini-profile"><i></i><i></i><i></i><i></i><i></i></div>
          </div>
        </section>

        <section className="intro-band" data-reveal>
          <div>
            <strong>150+</strong>
            <span>curated route ideas</span>
          </div>
          <div>
            <strong>4</strong>
            <span>sport profiles</span>
          </div>
          <div>
            <strong>Offline</strong>
            <span>map-first navigation</span>
          </div>
        </section>

        <section className="discover-section" id="discover">
          <div className="section-head" data-reveal>
            <p className="kicker">Discover</p>
            <h2>Start with places that already feel worth the trip.</h2>
          </div>
          <div className="route-gallery">
            {featuredRoutes.map((route, index) => (
              <article className="route-tile" style={{ '--delay': `${index * 90}ms`, backgroundImage: `url(${route.image})` }} data-reveal key={route.title}>
                <div>
                  <span>{route.meta}</span>
                  <h3>{route.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <PlannerPreview />

        <section className="feature-section" id="features">
          <div className="section-head" data-reveal>
            <p className="kicker">End to end</p>
            <h2>From a first idea to a route others can trust.</h2>
          </div>
          <div className="feature-rail">
            {steps.map(([title, text], index) => (
              <article data-reveal style={{ '--delay': `${index * 80}ms` }} key={title}>
                <span>{`0${index + 1}`}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="device-section" data-reveal>
          <div className="phone-preview">
            <div className="phone-map">
              <RouteMap />
            </div>
          </div>
          <div>
            <p className="kicker">Use it anywhere</p>
            <h2>Plan on desktop. Carry the route outside.</h2>
            <p>
              A route platform needs fast planning at home and readable guidance in the field: saved routes, offline maps, alerts and clear route stats.
            </p>
            <div className="store-row">
              <span>iOS concept</span>
              <span>Android concept</span>
              <span>GPX export</span>
            </div>
          </div>
        </section>

        <section className="support-section" id="support" data-reveal>
          <div>
            <p className="kicker">Devovia Studio</p>
            <h2>Want this turned into a real product?</h2>
            <p>
              Send a note about route planning, mobile navigation, app publishing or your next outdoor product idea.
            </p>
            <a className="mail-link" href="mailto:info@devoviastudio.com">info@devoviastudio.com</a>
          </div>
          <form className="contact-form" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden-field"><label>Do not fill this field <input name="bot-field" /></label></p>
            <label>Name<input name="name" type="text" placeholder="Your name" required /></label>
            <label>Email<input name="email" type="email" placeholder="you@example.com" required /></label>
            <label className="full">Request type<select name="service" defaultValue="Product concept"><option>Product concept</option><option>App support</option><option>Route planner prototype</option><option>Publishing help</option></select></label>
            <label className="full">Message<textarea name="message" rows="5" placeholder="Tell us what you want to build" required></textarea></label>
            <button className="primary-action full" type="submit">Send request</button>
          </form>
        </section>
      </main>

      <footer className="explore-footer">
        <span>© {new Date().getFullYear()} Devovia Studio.</span>
        <span>Original route-planning concept. No affiliation with komoot.</span>
      </footer>
    </div>
  );
}

export default App;
