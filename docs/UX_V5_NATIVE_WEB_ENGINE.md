# Devovia Studio UX V5 — Native Web Engine

## Research direction

The V5 architecture prioritizes modern browser-native capabilities over a heavy animation runtime:

- View Transition API for same-document and cross-document navigation.
- `@view-transition { navigation: auto; }` for transitions between the dedicated homepage and internal documents.
- `document.startViewTransition()` for internal React route changes.
- `pageswap` and `pagereveal` for navigation direction continuity.
- CSS scroll-driven animations with `animation-timeline: view()` and `scroll(root block)`.
- Web Animations API for low-cost press feedback and history-navigation fallback.
- Speculation Rules API prefetch with `<link rel="prefetch">` fallback.
- Existing requestAnimationFrame pointer pipelines remain the only continuous mouse loops.

## Performance policy

- No WebGL renderer is introduced for decorative motion.
- No second pointermove loop is added by the navigation engine.
- Native timelines animate opacity, translate, scale and filter only.
- Reduced-motion users receive static transitions.
- Touch devices do not render the cursor ring.
- SPA interception is limited to known public React routes.
- Privacy documents, app-ads.txt and other static routes retain normal document navigation.
- The redesigned homepage always opens as the real root document rather than the legacy React fallback.

## English-only policy

- The document language is locked to English.
- Legacy `?lang=tr` parameters are removed.
- Browser locale detection is normalized to English before React renders.
- Public copy outside the dormant legacy translation dictionary is checked for Turkish characters.
- Homepage copy and product data are checked independently.

## QA

Pull request validation runs:

1. Existing UX architecture contracts.
2. Native engine and English contracts.
3. Production Vite build, which repeats the existing UX contracts.
4. Native engine and English contracts a second time.

After merge, the generated JavaScript and CSS hashes on `gh-pages` must change before the release is considered deployed.
