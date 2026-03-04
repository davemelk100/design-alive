# Themal

An interactive design system editor that lets you pick a brand color and watch every token update in real time. Customize typography, button interactions, and link hover states. Export a CSS snapshot or open a PR to propose changes — from desktop, tablet, or phone.

## How It Works

All palette colors are HSL custom properties on `:root`. From one brand color, the system derives a full token set (secondary, accent, muted, destructive) using your choice of color harmony scheme: complementary, triadic, analogous, split-complementary, or tetradic.

Every foreground/background pair is audited against WCAG AA (4.5:1) via axe-core. Failing pairs are auto-corrected by adjusting foreground lightness.

Beyond colors, the editor includes typography controls (fonts, sizes, weights, spacing with five presets — plus custom Google Font loading), button interaction states (hover, active, focus), typography interaction states (link/heading hover effects), card customization, and alert styling — all with live preview. A sticky section nav (Colors, Cards, Alerts, Typography, Buttons) provides quick navigation. Premium features are gated behind a license key with a click-to-upgrade modal.

Your entire theme (colors, typography, interactions, card styles, alerts) persists in localStorage across reloads.

## npm Package

The editor is published to npm as [`@theemel/editor`](https://www.npmjs.com/package/@theemel/editor) and can be installed in any React app:

```bash
npm install @theemel/editor
```

```tsx
import { DesignSystemEditor } from "@theemel/editor";
import "@theemel/editor/style.css";

function App() {
  return <DesignSystemEditor />;
}
```

Requires `react` and `react-dom` v18 or v19. Optionally install `axe-core` (accessibility auditing) and `lucide-react` (icon previews) for full functionality. See [`packages/editor/README.md`](packages/editor/README.md) for full API docs, props, exported utilities, and premium feature details.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- axe-core (WCAG AA accessibility auditing)
- Lucide React (icons)
- Netlify Functions (GitHub PR creation)

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Hosted on Netlify. Pushes to `main` trigger automatic deploys.
