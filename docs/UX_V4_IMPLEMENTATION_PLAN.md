# Devovia Studio UX V4 implementation and QA plan

## Audit findings

1. The homepage had three overlapping motion systems: a React pointer hook, the immersive motion controller and the shared full-site controller.
2. Internal pages split atmosphere, pointer targets and scroll motion across three independent observers/listeners.
3. Several effects used stronger 3D rotation than the light, calm Google/Figma/Behance-style brand direction requires.
4. Motion was visually rich but not sufficiently tied to page structure or section progress.
5. The production workflow built the site but did not enforce motion architecture, reduced-motion support or route coverage.

## V4 implementation

- Homepage now uses one global pointer source and one scroll/section orchestrator.
- Internal pages use one orchestrator for decoration, reveal, pointer, parallax and section progress.
- Homepage and internal pages are explicitly separated to prevent duplicate listeners and duplicate atmosphere layers.
- Added section-local progress, active-zone color transitions and product-story progress.
- Added restrained reveal masks, lower-amplitude parallax, softer card response and directional action arrows.
- Added sticky product visuals on desktop without changing the mobile reading order.
- Added `content-visibility` and intrinsic sizing for long internal pages.
- Preserved touch and `prefers-reduced-motion` fallbacks.

## Double validation policy

Every pull-request run performs:

1. UX contract validation pass 1.
2. Production build, which runs UX contract validation pass 2 before Vite compilation.

After both passes succeed, the merge commit is validated again through the production deployment workflow and the generated asset hashes are checked on `gh-pages`.

## UX contract coverage

The automated contract verifies:

- Homepage and internal-page motion are separated.
- No duplicate global observers exist in atmosphere/target modules.
- Only one pointer listener exists per page family.
- Legacy homepage motion styles are no longer imported.
- Reduced-motion fallbacks exist for both page families.
- Section/product progress choreography is installed.
- Performance containment is enabled.
- Major public route families remain present.
