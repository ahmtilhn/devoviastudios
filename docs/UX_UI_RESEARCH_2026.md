# Devovia Studio — UX/UI Research Foundation (2026)

## Experience direction

Devovia should feel like a premium independent product studio: airy, calm, product-led and trustworthy. Real screenshots and real product data must carry the visual story. Motion should explain hierarchy, progression and interaction—not decorate every element.

## Research conclusions

### Visual hierarchy

Nielsen Norman Group’s guidance consistently emphasizes contrast, scale, grouping and whitespace. Applied to Devovia:

- One dominant message per viewport.
- Maximum three major type scales in a section.
- Strong contrast reserved for the primary action and key proof.
- Related items grouped with spacing before adding borders.
- Generous breathing room around the most important content.

Sources:

- https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- https://www.nngroup.com/articles/principles-visual-design/
- https://www.nngroup.com/articles/ten-usability-heuristics/
- https://www.nngroup.com/articles/progressive-disclosure/

### Motion

Motion for React is the best fit for component state, layout and scroll animation in React. GSAP ScrollTrigger is reserved for advanced pinned storytelling and scrubbed timelines. Devovia’s default layer should remain lightweight CSS and IntersectionObserver.

Motion rules:

- Micro interactions: 160–240ms.
- Section entrances: 420–700ms.
- Animate opacity and transform where possible.
- Reveal once; avoid repeated scroll animation.
- No global scroll-jacking.
- Respect `prefers-reduced-motion` everywhere.

Sources:

- https://motion.dev/docs/react
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://web.dev/articles/animations-guide
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html

### Accessible primitives

Radix Primitives is appropriate for future dialogs, dropdowns and tooltips. React Aria is stronger for complex forms, internationalization and adaptive interaction. Simple links, cards and current forms should stay native to avoid unnecessary bundle weight.

Sources:

- https://www.radix-ui.com/primitives/docs/overview/introduction
- https://react-aria.adobe.com/

## Chosen visual system

### Typography

- Display/headings: Sora.
- Body/UI: Manrope.
- Reading width: 65–72 characters.
- Page title: 48–72px desktop, 32–42px mobile.
- Body: 16–18px with 1.65–1.8 line height.

### Color

- Canvas `#F7F9FC`
- Surface `#FFFFFF`
- Primary text `#0F172A`
- Secondary text `#526175`
- Muted text `#8290A5`
- Border `#E3E9F2`
- Blue `#3B82F6`
- Violet `#8B5CF6`
- Cyan `#22D3EE`

Blue is the main interaction color. Violet and cyan create atmosphere. Red is reserved for errors.

### Layout

- 8px spacing system.
- Main width 1180–1240px.
- Section spacing 96–128px desktop, 56–72px mobile.
- Card radius 22–32px.
- Soft, wide shadows; no heavy black shadows.

### Motion language

- Page entrance: opacity 0→1, translateY 20→0.
- Sibling stagger: 60–90ms.
- Hover: translateY -4px, scale max 1.015.
- Product mockups: slow low-amplitude float.
- Header gains surface/shadow after scroll.
- 2px scroll progress indicator.
- Reduced-motion mode disables translation and floating.

## Implementation principles

1. One primary action per page.
2. Secondary actions must not compete with it.
3. Product proof appears before long explanation.
4. Support and privacy links stay visible in product contexts.
5. Filters have clear selected and keyboard-focus states.
6. Forms use persistent labels, grouped fields and clear status feedback.
7. Motion never delays task completion.
8. Every route must feel unmistakably Devovia in the first viewport.
9. Mobile is designed as a first-class flow.
10. Every page shares the same tokens, typography, card treatment and spacing rhythm.
