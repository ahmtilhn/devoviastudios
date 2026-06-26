# Devovia Studio UX V6 — Product Storytelling

## Scope

- Product-detail storytelling for Stock Manager, Arrow Escape, Daily Hadith and TinySteps.
- Bespoke motion language for sixteen feature scenes.
- Shared-element transitions from product cards to product-detail heroes.
- Google Play Test Support layout and release-readiness visual system.
- Complete redesign of the privacy center and four local privacy summaries.
- Initial-load and continuous-pointer performance improvements.

## Performance changes

- Internal pointer animation now starts only when pointer input changes and stops after the spring settles.
- Scroll and parallax targets are cached instead of queried on every scroll frame.
- Heavy atmosphere layers fade in after first paint and idle time.
- Long-task observation can automatically enable a lighter motion mode.
- Hidden tabs pause decorative animation.
- Page transition keyframes use opacity, transform and clip-path instead of blur.
- Long product stories use `content-visibility` and intrinsic-size placeholders.

## Product experience system

Each published app receives four feature stories using real screenshots and app-specific motion:

- Stock Manager: scanner, stock timeline, dashboard and offline protection.
- Arrow Escape: fading directions, timer pressure, boosters and rewards.
- Daily Hadith: daily reflection, prayer rhythm, Qibla compass and audio sharing.
- TinySteps: flexible habits, reminders, widget completion and streak statistics.

The sections describe user outcomes before technical implementation and provide feature-specific benefit lists.

## Page transitions

When a product card opens a product detail, the application icon and a product preview participate in shared View Transition groups. The general page transition remains as a fallback and reduced-motion users receive a static change.

## Privacy redesign

The privacy center and all local product privacy pages now:

- use English content,
- share the current Devovia visual language,
- link back to the real product route,
- expose official policy and support links,
- explain permissions and platform services in plain language,
- opt into cross-document transitions,
- support reduced motion and responsive layouts.

## Validation

The V6 contract runs twice in pull-request CI in addition to the existing UX, native-engine and production-build validation.
