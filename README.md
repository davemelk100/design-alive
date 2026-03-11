# Themal

An interactive design system editor that lets you pick a brand color and watch every token update in real time. Customize typography, button interactions, and link hover states. Export a CSS snapshot or open a PR to propose changes — from desktop, tablet, or phone.

**Live:** [themalive.com](https://themalive.com)

> Free tier available. Pro features require a subscription ($9/mo or $50/yr).

## How It Works

All palette colors are HSL custom properties on `:root`. From one brand color, the system derives a full token set (secondary, accent, muted, destructive) using your choice of color harmony scheme: complementary, triadic, analogous, split-complementary, or tetradic.

Every foreground/background pair is audited against WCAG AA (4.5:1) via axe-core. Failing pairs are auto-corrected by adjusting foreground lightness.

Beyond colors, the editor includes typography controls (fonts, sizes, weights, spacing with five presets, plus custom Google Font loading) that apply site-wide, button interaction states (hover, active, focus), typography interaction states (link/heading hover effects), card customization, independent dialog box and toast message styling, and an inputs section with controls for border radius, padding, font size, and focus ring — all with live preview. A sticky section nav (Colors, Buttons, Cards, Alerts, Typography, Inputs) provides quick navigation with the active section sliding to the left on desktop. A responsive left sidebar houses page links, contact/bug-report forms, and the Themal logo, with a frosted-glass mobile menu for smaller screens.

Your entire theme (colors, typography, interactions, card styles, dialog styles, toast styles, input styles) persists in localStorage across reloads. All native select dropdowns have been replaced with custom themed dropdowns that follow the design system's color scheme.

## npm Package

The editor is published to npm as [`@themal/editor`](https://www.npmjs.com/package/@themal/editor) and can be installed in any React app:

```bash
npm install @themal/editor
```

```tsx
import { DesignSystemEditor } from "@themal/editor";
import "@themal/editor/style.css";

function App() {
  return <DesignSystemEditor />;
}
```

Requires `react` and `react-dom` v18 or v19. Optionally install `axe-core` (accessibility auditing) and `lucide-react` (icon previews) for full functionality. See [`packages/editor/README.md`](packages/editor/README.md) for full API docs, props, exported utilities, and premium feature details.

## Web Component

For WordPress, static sites, or any non-React platform, use the `<themal-editor>` web component via a single `<script>` tag. See [`packages/web-component/README.md`](packages/web-component/README.md) for setup instructions.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- axe-core (WCAG AA accessibility auditing)
- Lucide React (icons)
- Netlify Functions (GitHub PR creation, Stripe checkout)
- Clerk (authentication via Google OAuth)
- Stripe (subscription billing: $9/mo or $50/yr Pro plan)

## Testing

- **Vitest + Testing Library** — unit and component tests
- **vitest-axe** — automated axe-core accessibility testing
- **ESLint + eslint-plugin-jsx-a11y** — static accessibility linting
- **Lighthouse CI** — automated performance, accessibility, SEO, and best practices auditing

```bash
npm run test        # watch mode
npm run test:run    # single run
npm run lint        # ESLint with jsx-a11y rules
```

## Getting Started

```bash
cp .env.example .env   # then fill in the values
npm install
npm run dev
```

See [`SETUP.md`](SETUP.md) for detailed instructions on configuring Clerk, Stripe, Google OAuth, and all environment variables for local development and production.

## Build

```bash
npm run build
npm run preview
```

## Deployment

Hosted on Netlify at [themalive.com](https://themalive.com). Pushes to `main` trigger automatic deploys.
