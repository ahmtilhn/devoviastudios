# Devovia Studio Full-Site UX Audit

## Reviewed routes

Home, Products, every product detail, Services, Google Play Test Support, Updates, Support and Privacy, Blog, Blog articles and Contact.

## Main issues found

- Home and internal pages used different motion systems.
- Internal pages only had basic reveal motion.
- Product cards showed flat screenshots rather than device mockups.
- Hidden overflow cropped rotated phones, shadows and decorative layers.
- Product-detail heroes positioned only four devices but rendered every screenshot.
- Service cards were compressed into a uniform grid.
- Updates, support, blog and form pages lacked consistent hierarchy and spacing.
- Pointer, touch and reduced-motion behavior was not controlled by one shared policy.

## Shared fixes implemented

- Route-aware color atmosphere for every page type.
- MiMo-inspired mouse-following blurred clouds.
- Local spotlight behind text, cards, forms and mockups.
- Soft card tilt, magnetic actions and scroll parallax on desktop.
- Shared reveal timing and page transitions.
- Professional phone frames and animated screenshot stages.
- Four-device limit in product heroes; remaining screenshots stay in the workflow gallery.
- Unified shell width, card depth, shadows, spacing and responsive breakpoints.
- Touch and `prefers-reduced-motion` fallbacks.

## Page work

- **Products:** larger cards, device-stage mockups, stronger filters and support blocks.
- **Product details:** clipping fixes, professional device cluster, clearer capability and gallery panels.
- **Services:** 12-column bento layout instead of a compressed four-card row.
- **Test Support:** balanced content/form columns and safer sticky behavior.
- **Updates:** larger animated hero and clearer timeline/story hierarchy.
- **Support:** improved app-card grid, form column and privacy access.
- **Blog:** editorial grid, larger lead story and improved reading layout.
- **Contact:** balanced sticky introduction and form composition.
- **Home:** shared local blur atmosphere added without removing its existing immersive scene.

## Responsive policy

Dedicated corrections apply at 1180, 1080, 820, 720, 620 and 560px. Tilt and magnetic effects are disabled on touch devices. Parallax, ambient motion and reveal transitions become static when reduced motion is requested.

## Validation

Deployment requires the existing GitHub Actions workflow to pass `npm ci` and `npm run build`.
