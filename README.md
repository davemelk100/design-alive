# Theemal

An interactive design system that lets you pick a brand color and watch every token update in real time. Export a CSS snapshot or open a PR to propose changes.

## How It Works

All palette colors are HSL custom properties on `:root`. From one brand color, the system derives a full token set (secondary, accent, muted, destructive) using your choice of color harmony scheme: complementary, triadic, analogous, split-complementary, or tetradic.

Every foreground/background pair is audited against WCAG AA (4.5:1) via axe-core. Failing pairs are auto-corrected by adjusting foreground lightness. Your theme persists in localStorage across reloads.

## npm Package

The editor is published to npm as [`@design-alive/editor`](https://www.npmjs.com/package/@design-alive/editor) and can be installed in any React app:

```bash
npm install @design-alive/editor
```

```tsx
import { DesignSystemEditor } from "@design-alive/editor";
import "@design-alive/editor/style.css";

function App() {
  return <DesignSystemEditor />;
}
```

Requires `react` and `react-dom` v18+. Optionally install `axe-core` (accessibility auditing) and `lucide-react` (icon previews) for full functionality. See [`packages/editor/README.md`](packages/editor/README.md) for full API docs, props, and exported utilities.

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
