# @theemel/editor

Interactive design system editor for React apps. Pick colors, generate harmony palettes, enforce WCAG AA contrast, customize typography and interaction states, and export CSS custom properties — all in real time. Fully responsive — works on desktop, tablet, and mobile.

## Install

```bash
npm install @theemel/editor
```

### Peer Dependencies

| Package | Version | Required |
|---------|---------|----------|
| `react` | `^18.0.0 \|\| ^19.0.0` | Yes |
| `react-dom` | `^18.0.0 \|\| ^19.0.0` | Yes |
| `axe-core` | `>=4.0.0` | Optional — enables accessibility auditing |
| `lucide-react` | `>=0.294.0` | Optional — enables icon previews |

Install optional peers for full functionality:

```bash
npm install axe-core lucide-react
```

## Quick Start

```tsx
import { DesignSystemEditor } from '@theemel/editor';
import '@theemel/editor/style.css';

function App() {
  return <DesignSystemEditor />;
}
```

The editor writes CSS custom properties (HSL values) to `:root`, so it works with any framework that consumes CSS variables.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `licenseKey` | `string` | — | License key to unlock premium features. |
| `upgradeUrl` | `string` | `"/pricing"` | URL shown in premium gate upgrade prompts. |
| `signInUrl` | `string` | — | URL shown in premium gate sign-in prompts. |
| `prEndpointUrl` | `string` | — | URL for PR creation endpoint. PR button hidden if omitted. |
| `accessibilityAudit` | `boolean` | `true` | Enable axe-core color contrast auditing. |
| `onChange` | `(colors: Record<string, string>) => void` | — | Callback on every color change with the full color map. |
| `onExport` | `(css: string) => void` | — | Override built-in CSS modal. Receives the generated CSS string. |
| `className` | `string` | — | Additional CSS class for the wrapper element. |
| `showHeader` | `boolean` | `true` | Show the editor header with logo and navigation. |
| `showNavLinks` | `boolean` | — | Show section navigation links in the header. |
| `headerRight` | `React.ReactNode` | — | Custom content rendered on the right side of the header. |

## Premium Features

The following features require a valid license key:

| Feature | Description |
|---------|-------------|
| Harmony schemes | Generate palettes using complementary, analogous, triadic, or split-complementary color relationships. |
| Color locks | Lock up to 4 colors to preserve them during palette regeneration. |
| PR integration | Create design system pull requests directly from the editor. |
| Undo/redo | History management for color changes. |
| Image palette extraction | Extract color palettes from uploaded images with preview confirmation. |
| Palette export | Download palette as SVG/PNG, or copy as HEX/RGB/RGBA text. |
| Interaction states | Style hover, focus, and active states for buttons and components. |
| Typography interactions | Customize hover, active, and underline behavior for links and headings. |

### License Key Format

Keys follow the format `THEEMEL-XXXX-XXXX-XXXX` with a checksum-validated third segment. Use `generateLicenseKey()` to create valid keys.

### PremiumGate Component

Wrap any feature in `PremiumGate` to gate it behind a license key. Clicking a gated feature opens a modal with upgrade and sign-in options:

```tsx
import { PremiumGate } from '@theemel/editor';

<PremiumGate feature="harmony-schemes" upgradeUrl="/pricing" signInUrl="/sign-in">
  <HarmonyControls />
</PremiumGate>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `feature` | `string` | — | Name of the premium feature being gated. |
| `variant` | `"section" \| "inline"` | `"section"` | `"section"` dims content with a lock overlay; `"inline"` shows a lock icon inline. Both open a modal on click. |
| `upgradeUrl` | `string` | `"/pricing"` | URL for the upgrade prompt. |
| `signInUrl` | `string` | — | URL for the sign-in prompt. |

### LicenseProvider

If using `PremiumGate` or `useLicense` outside of `DesignSystemEditor`, wrap your tree in `LicenseProvider`:

```tsx
import { LicenseProvider } from '@theemel/editor';

<LicenseProvider licenseKey="THEEMEL-XXXX-XXXX-XXXX">
  <App />
</LicenseProvider>
```

## Usage Examples

### Basic — color picker only

```tsx
<DesignSystemEditor accessibilityAudit={false} />
```

### With PR creation

```tsx
<DesignSystemEditor prEndpointUrl="/api/create-design-pr" />
```

### With premium features

```tsx
<DesignSystemEditor
  licenseKey="THEEMEL-XXXX-XXXX-XXXX"
  upgradeUrl="/pricing"
  signInUrl="/sign-in"
/>
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
    navigator.clipboard.writeText(css);
  }}
/>
```

## Exported Utilities

```tsx
import {
  // Color utilities
  hslStringToHex,    // "210 50% 40%" -> "#336699"
  hexToHslString,    // "#336699" -> "210.0 50.0% 40.0%"
  contrastRatio,     // WCAG contrast ratio between two HSL strings
  fgForBg,           // Best foreground (black/white) for a background HSL
  EDITABLE_VARS,     // Array of { key, label } token definitions
  HARMONY_SCHEMES,   // ['Complementary', 'Analogous', 'Triadic', 'Split-Complementary']
  applyStoredThemeColors, // Restore persisted theme from localStorage

  // Card, typography & interaction style utilities
  applyStoredCardStyle,           // Restore card style from localStorage
  applyStoredTypography,          // Restore typography from localStorage
  applyStoredAlertStyle,          // Restore alert style from localStorage
  applyStoredInteractionStyle,    // Restore button interaction style from localStorage

  // Shareable URL utilities
  serializeThemeState,            // Encode full theme state as base64 string
  deserializeThemeState,          // Decode base64 string back to theme state

  // Export utilities
  generateDesignTokens,           // Generate W3C Design Token JSON from theme state
  exportPaletteAsText,            // Export palette as HEX, RGB, or RGBA text
  exportPaletteAsSvg,             // Export palette as SVG string
  exportPaletteAsPng,             // Export palette as PNG Blob

  // License utilities
  validateLicenseKey,   // Validate a THEEMEL-XXXX-XXXX-XXXX key
  generateLicenseKey,   // Generate a valid license key

  // Premium components & hooks
  LicenseProvider,      // Context provider for license state
  useLicense,           // Hook: { isValid, isPremium }
  PremiumGate,          // Gate component for premium features
} from '@theemel/editor';
```

## How It Works

1. **Color picking** — Click any swatch to open the native color picker. Changing a key color (brand, secondary, accent, background) automatically derives related tokens.
2. **Harmony schemes** *(Pro)* — Generate palettes using complementary, analogous, triadic, or split-complementary color relationships.
3. **Contrast enforcement** — Every foreground/background pair is checked against WCAG AA (4.5:1). Failing pairs are auto-corrected by adjusting lightness.
4. **Typography** — Choose heading and body fonts, adjust sizes, weights, line height, and letter spacing with live preview. Five built-in presets (System, Modern, Classic, Compact, Editorial).
5. **Button interactions** *(Pro)* — Fine-tune hover opacity, hover/active scale, transition duration, and focus ring width with presets (Subtle, Elevated, Bold).
6. **Typography interactions** *(Pro)* — Customize link hover/active behavior (opacity, scale, underline) and heading hover effects with live preview.
7. **Persistence** — All settings (colors, typography, card styles, alerts, interactions) are saved to `localStorage` and restored on reload.
8. **Per-section export** — Every section header includes a CSS | Tokens split button to export CSS custom properties with Tailwind config, or W3C Design Token JSON, for that section.
9. **Shareable URLs** — Encode your full theme state in the URL hash and share it with anyone via a single link.
10. **Palette export** *(Pro)* — Download your palette as SVG or PNG, or copy as a HEX/RGB/RGBA text list.
11. **Mobile friendly** — Fully responsive UI lets you tweak your design system and open PRs from any device.

## Package Architecture

The editor is built with Vite in library mode and published as an ES module:

```
@theemel/editor
├── dist/index.js      # ESM bundle (all components + utilities)
├── dist/index.d.ts    # TypeScript declarations
└── dist/style.css     # Pre-compiled, scoped Tailwind styles
```

### Exports Map

```json
{
  ".":            { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
  "./style.css":  "./dist/style.css"
}
```

Import the main entry point for components and utilities, and `style.css` separately for styles. This keeps CSS opt-in and avoids side effects during tree-shaking.

## Tailwind Scoping

The editor ships pre-compiled CSS via `@theemel/editor/style.css`. Styles are scoped using Tailwind's `important: '.ds-editor'` so they don't conflict with your app's styles. The root element is automatically wrapped in `<div className="ds-editor">`.

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

## Publishing to npm

The package is published as `@theemel/editor` on npm. To publish a new version:

```bash
# 1. Build
cd packages/editor
npm run build

# 2. Verify the tarball contents (should only include dist/)
npm pack --dry-run

# 3. Bump the version
npm version patch   # or minor / major

# 4. Publish (scoped packages require --access public on first publish)
npm publish --access public
```

You must be logged in to npm (`npm login`) with publish access to the `@theemel` scope.

## License

MIT
