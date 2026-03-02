# @design-alive/editor

Interactive design system editor for React apps. Pick colors, generate harmony palettes, enforce WCAG AA contrast, and export CSS custom properties — all in real time.

## Install

```bash
npm install @design-alive/editor
```

Peer dependencies: `react` and `react-dom` (v18+).

Optional peers for full functionality:
- `axe-core` — accessibility auditing
- `lucide-react` — icon previews

## Quick Start

```tsx
import { DesignSystemEditor } from '@design-alive/editor';
import '@design-alive/editor/style.css';

function App() {
  return <DesignSystemEditor />;
}
```

The editor writes CSS custom properties (HSL values) to `:root`, so it works with any framework that consumes CSS variables.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `prEndpointUrl` | `string` | — | URL for PR creation endpoint. PR button hidden if omitted. |
| `accessibilityAudit` | `boolean` | `true` | Enable axe-core color contrast auditing. |
| `onChange` | `(colors: Record<string, string>) => void` | — | Callback on every color change with the full color map. |
| `onExport` | `(css: string) => void` | — | Override built-in CSS modal. Receives the generated CSS string. |
| `className` | `string` | — | Additional CSS class for the wrapper element. |

## Usage Examples

### Basic — color picker only

```tsx
<DesignSystemEditor accessibilityAudit={false} />
```

### With PR creation

```tsx
<DesignSystemEditor prEndpointUrl="/api/create-design-pr" />
```

### Listen for changes

```tsx
<DesignSystemEditor
  onChange={(colors) => {
    console.log('Brand color:', colors['--brand']);
  }}
/>
```

### Custom export handler

```tsx
<DesignSystemEditor
  onExport={(css) => {
    // Send to your own modal, clipboard, or API
    navigator.clipboard.writeText(css);
  }}
/>
```

## Exported Utilities

The package also exports utility functions for working with the color system:

```tsx
import {
  hslStringToHex,    // "210 50% 40%" → "#336699"
  hexToHslString,    // "#336699" → "210.0 50.0% 40.0%"
  contrastRatio,     // WCAG contrast ratio between two HSL strings
  fgForBg,           // Best foreground (black/white) for a background HSL
  EDITABLE_VARS,     // Array of { key, label } token definitions
  HARMONY_SCHEMES,   // ['Complementary', 'Analogous', 'Triadic', 'Split-Complementary']
  applyStoredThemeColors, // Restore persisted theme from localStorage
} from '@design-alive/editor';
```

## How It Works

1. **Color picking** — Click any swatch to open the native color picker. Changing a key color (brand, secondary, accent, background) automatically derives related tokens.
2. **Harmony schemes** — Generate palettes using complementary, analogous, triadic, or split-complementary color relationships.
3. **Contrast enforcement** — Every foreground/background pair is checked against WCAG AA (4.5:1). Failing pairs are auto-corrected by adjusting lightness.
4. **Persistence** — Theme colors are saved to `localStorage` and restored on reload.
5. **CSS export** — Generate a `:root` CSS block and Tailwind config snippet for your custom theme.

## Tailwind Scoping

The editor ships pre-compiled CSS via `@design-alive/editor/style.css`. Styles are scoped using Tailwind's `important: '.ds-editor'` so they don't conflict with your app's styles. The root element is automatically wrapped in `<div className="ds-editor">`.

## Development

```bash
# From the repo root
npm install

# Build the package
cd packages/editor
npm run build

# Watch mode
npm run dev
```

## License

MIT
