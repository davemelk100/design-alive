# @themal/editor

Interactive design system editor for React apps. Pick colors, generate harmony palettes, enforce WCAG AA contrast, customize typography and interaction states, and export CSS custom properties — all in real time. Fully responsive — works on desktop, tablet, and mobile.

> Free tier available with core features. Pro features ($9/mo or $50/yr) require a subscription.

## Install

```bash
npm install @themal/editor
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
import { DesignSystemEditor } from '@themal/editor';
import '@themal/editor/style.css';

function App() {
  return <DesignSystemEditor />;
}
```

The editor writes CSS custom properties (HSL values) to `:root` and injects global typography styles, so colors and fonts apply across your entire site.

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
| `showNavLinks` | `boolean` | `true` | Show page navigation links in the header and mobile menu. |
| `headerRight` | `React.ReactNode` | — | Custom content rendered on the right side of the header (e.g. auth buttons). |
| `aboutUrl` | `string` | — | URL for the About page link in the header navigation. |
| `customIcons` | `CustomIcon[]` | — | Custom icons to display in the Icons preview section. Each entry needs `name` and `icon` (a React component). |
| `iconMode` | `"append" \| "replace"` | `"append"` | `"append"` adds custom icons after the built-in lucide icons. `"replace"` hides built-ins and shows only custom icons. |
| `showLogo` | `boolean` | `true` | Show the Themal logo in the header. Set `false` for white-label or plugin usage. |
| `defaultColors` | `Record<string, string>` | — | Default color values to restore on reset, keyed by CSS variable name (e.g. `{"--brand": "210 50% 40%"}`). When provided, "Reset theme to default" restores these instead of the Themal defaults. |
| `defaultTypography` | `Partial<TypographyState>` | — | Default typography state to restore on reset. When provided, the font dropdown shows an "App Default" option with your font name, the editor initializes with your fonts on first load, and "Reset theme to default" restores your font settings instead of the Themal defaults. |

## Premium Features

The following features require a valid license key:

| Feature | Description |
|---------|-------------|
| Harmony schemes | Generate palettes using complementary, analogous, triadic, or split-complementary color relationships. |
| Color locks | Lock up to 4 colors to preserve them during palette regeneration. |
| PR integration | Create design system pull requests directly from the editor. |
| Undo/redo | Up to 10 levels of undo for theme refreshes and image palette applications. |
| Image palette extraction | Extract color palettes from uploaded images with preview confirmation. |
| Palette export | Download palette as SVG/PNG, or copy as HEX/RGB/RGBA text. |
| Interaction states | Style hover, focus, and active states for buttons and components. |
| Typography interactions | Customize hover, active, and underline behavior for links and headings. |
| Custom fonts | Add any Google Font by name — validated, loaded, and persisted across sessions. |

### License Key Format

Keys follow the format `THEMAL-XXXX-XXXX-XXXX` with a checksum-validated third segment. Use `generateLicenseKey()` to create valid keys.

### PremiumGate Component

Wrap any feature in `PremiumGate` to gate it behind a license key. Clicking a gated feature opens a modal with upgrade and sign-in options:

```tsx
import { PremiumGate } from '@themal/editor';

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
import { LicenseProvider } from '@themal/editor';

<LicenseProvider licenseKey="THEMAL-XXXX-XXXX-XXXX">
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
  licenseKey="THEMAL-XXXX-XXXX-XXXX"
  upgradeUrl="/pricing"
  signInUrl="/sign-in"
/>
```

### With custom header content

```tsx
<DesignSystemEditor
  headerRight={<button onClick={handleSignIn}>Sign In</button>}
  aboutUrl="/about"
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

### With custom icons

```tsx
import { Rocket, Star, Flame } from 'lucide-react';
// Or use any React component that accepts className
import { MyBrandIcon } from './icons';

<DesignSystemEditor
  customIcons={[
    { name: "Rocket", icon: Rocket },
    { name: "Star", icon: Star },
    { name: "Flame", icon: Flame },
    { name: "Brand", icon: MyBrandIcon },
  ]}
/>
```

### Replace built-in icons entirely

```tsx
<DesignSystemEditor
  customIcons={[
    { name: "Brand", icon: MyBrandIcon },
    { name: "Product", icon: ProductIcon },
  ]}
  iconMode="replace"
/>
```

The Icons section includes a "Hide All" / "Show All" toggle so users can collapse the icon grid.

### Embedded / headless

```tsx
<DesignSystemEditor
  showHeader={false}
  showNavLinks={false}
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

  // localStorage key constants
  CARD_STYLE_KEY,            // Key for card style storage
  TYPOGRAPHY_KEY,            // Key for typography storage
  ALERT_STYLE_KEY,           // Key for dialog alert style storage
  TOAST_STYLE_KEY,           // Key for toast style storage
  INTERACTION_STYLE_KEY,     // Key for interaction style storage

  // Card, typography & interaction style utilities
  applyStoredCardStyle,           // Restore card style from localStorage
  applyStoredTypography,          // Restore typography from localStorage (applies site-wide)
  applyStoredAlertStyle,          // Restore dialog alert style from localStorage
  applyStoredToastStyle,          // Restore toast style from localStorage
  applyStoredInteractionStyle,    // Restore button interaction style from localStorage

  // Shareable URL utilities
  serializeThemeState,            // Encode full theme state as base64 string
  deserializeThemeState,          // Decode base64 string back to theme state

  // Export utilities
  generateDesignTokens,           // Generate W3C Design Token JSON from theme state
  exportPaletteAsText,            // Export palette as HEX, RGB, or RGBA text
  exportPaletteAsSvg,             // Export palette as SVG string
  exportPaletteAsPng,             // Export palette as PNG Blob

  // Custom font utilities
  getCustomFonts,       // Load custom fonts from localStorage
  addCustomFont,        // Validate & add a Google Font by name
  removeCustomFont,     // Remove a custom font by label
  initCustomFonts,      // Re-register all custom fonts on startup

  // License utilities
  validateLicenseKey,   // Validate a THEMAL-XXXX-XXXX-XXXX key
  generateLicenseKey,   // Generate a valid license key

  // Premium components & hooks
  LicenseProvider,      // Context provider for license state
  useLicense,           // Hook: { isValid, isPremium }
  PremiumGate,          // Gate component for premium features
} from '@themal/editor';
```

### Exported Types

```tsx
import type {
  DesignSystemEditorProps,
  TokenDefinition,
  CustomIcon,
  HarmonyScheme,
  CardStyleState,
  TypographyState,
  AlertStyleState,
  ToastStyleState,
  InteractionStyleState,
  TypoInteractionStyleState,
  CustomFontEntry,
  PremiumFeature,
  LicenseValidation,
  LicenseProviderProps,
  PremiumGateProps,
} from '@themal/editor';
```

## How It Works

1. **Color picking** — Click any swatch to scroll the Colors section into view, then open the native color picker. Changing a key color (brand, secondary, accent, background) automatically derives related tokens.
2. **Harmony schemes** *(Pro)* — Generate palettes using complementary, analogous, triadic, or split-complementary color relationships.
3. **Contrast enforcement** — Every foreground/background pair is checked against WCAG AA (4.5:1). Failing pairs are auto-corrected by adjusting lightness. The accessibility audit shows a centered modal with results. On failure, choose "Ignore" to dismiss or "Suggest Alternative" to auto-fix contrast issues. A WCAG On/Off toggle lets you disable auto-correction for marketing or other contexts that don't require WCAG compliance. Locks are still honored when enforcement is off.
4. **Typography** — Choose heading and body fonts (including custom Google Fonts), adjust sizes, weights, line height, and letter spacing with live preview. Five built-in presets (System, Modern, Classic, Compact, Editorial). Typography applies site-wide, not just within the editor component, so toggling fonts updates the entire page.
5. **Button interactions** *(Pro)* — Fine-tune hover opacity, hover/active scale, transition duration, and focus ring width with presets (Subtle, Elevated, Bold).
6. **Typography interactions** *(Pro)* — Customize link hover/active behavior (opacity, scale, underline) and heading hover effects with live preview.
7. **Persistence** — All settings (colors, typography, card styles, dialog styles, toast styles, interactions) are saved to `localStorage` and restored on reload.
8. **Per-section export** — Every section header includes a CSS | Tokens split button to export CSS custom properties with Tailwind config, or W3C Design Token JSON, for that section.
9. **Shareable URLs** — Encode your full theme state in the URL hash and share it with anyone via a single link.
10. **Palette export** *(Pro)* — Download your palette as SVG or PNG, or copy as a HEX/RGB/RGBA text list.
11. **Custom fonts** *(Pro)* — Add any Google Font by name. The editor validates the font exists, loads all weights, adds it to heading/body dropdowns, and persists it across sessions.
12. **Mobile friendly** — Fully responsive UI with a 2D color spectrum picker (saturation/lightness canvas + hue slider) for intuitive touch-based color selection, mobile-optimized dropdowns, compact swatch labels, and stacked layouts for smaller screens.

## Package Architecture

The editor is built with Vite in library mode and published as an ES module:

```
@themal/editor
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

The editor ships pre-compiled CSS via `@themal/editor/style.css`. Styles are scoped using Tailwind's `important: '.ds-editor'` so they don't conflict with your app's styles. The root element is automatically wrapped in `<div className="ds-editor">`.

## Web Component

The editor is also available as a `<themal-editor>` custom element for non-React sites (WordPress, Shopify, plain HTML).

### Basic usage

```html
<script src="https://unpkg.com/@themal/editor/dist/themal-editor.js"></script>
<themal-editor></themal-editor>
```

### Attributes

All props that accept strings or booleans can be set as HTML attributes using kebab-case:

```html
<themal-editor
  license-key="THEMAL-XXXX-XXXX-XXXX"
  show-header="false"
  show-nav-links="false"
  icon-mode="replace"
  show-logo="true"
  accessibility-audit="true"
  upgrade-url="/pricing"
  sign-in-url="/sign-in"
  about-url="/about"
  pr-endpoint-url="/api/create-design-pr"
></themal-editor>
```

Note: The Themal logo is hidden by default in the web component. Set `show-logo="true"` to display it.

### Custom icons via JavaScript

Since HTML attributes can only pass strings, custom icons are set programmatically with the `setIcons()` method. Pass an array of `{ name, svg }` objects where `svg` is a raw SVG string:

```html
<script src="https://unpkg.com/@themal/editor/dist/themal-editor.js"></script>
<themal-editor icon-mode="replace"></themal-editor>

<script>
  const editor = document.querySelector('themal-editor');
  editor.setIcons([
    {
      name: "Heart",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    },
    {
      name: "Star",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
    },
  ]);
</script>
```

Set `icon-mode="replace"` to hide the built-in icons and show only your custom set, or omit it (defaults to `"append"`) to add yours alongside the built-ins.

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

## Testing

The project includes automated accessibility testing:

```bash
# Run all tests (includes axe-core a11y checks)
npm run test:run

# Lint for accessibility issues
npm run lint
```

The test suite uses **vitest-axe** to run axe-core against rendered components, catching WCAG violations automatically. ESLint with **eslint-plugin-jsx-a11y** provides static analysis for common accessibility anti-patterns.

## Publishing to npm

The package is published as `@themal/editor` on npm. To publish a new version:

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

You must be logged in to npm (`npm login`) with publish access to the `@themal` scope.

## License

MIT
