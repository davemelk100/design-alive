# @themal/editor

Interactive design system editor for React apps. Pick colors, generate harmony palettes, enforce WCAG AA contrast, customize typography, interaction states, and input styles, and export CSS custom properties — all in real time. Fully responsive — works on desktop, tablet, and mobile with a frosted-glass sidebar menu.

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

The editor writes CSS custom properties (HSL values) to `:root`. All styles are scoped to `.ds-editor` — the editor does not override your site's fonts, colors, or layout. Typography defaults to `inherit`, so headings and body text automatically use your host site's font families. Override the base font size with `--ds-base-font-size`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `licenseKey` | `string` | — | License key to unlock premium features. |
| `upgradeUrl` | `string` | `"/pricing"` | URL shown in premium gate upgrade prompts. |
| `signInUrl` | `string` | — | URL shown in premium gate sign-in prompts. |
| `prEndpointUrl` | `string` | — | URL for your server-side PR creation endpoint. The editor POSTs `{ css, sections }` and expects `{ url }` back. PR button hidden if both this and `githubConfig` are omitted. |
| `githubConfig` | `GitHubConfig` | — | Client-side GitHub config for creating PRs directly via the GitHub API using an OAuth popup flow. No backend required beyond a lightweight token exchange proxy. PR button hidden if both this and `prEndpointUrl` are omitted. |
| `accessibilityAudit` | `boolean` | `true` | Enable axe-core color contrast auditing. |
| `onChange` | `(colors: Record<string, string>) => void` | — | Callback on every color change with the full color map. |
| `onExport` | `(css: string) => void` | — | Override built-in CSS modal. Receives the generated CSS string. |
| `className` | `string` | — | Additional CSS class for the wrapper element. |
| `showHeader` | `boolean` | `true` | Show the editor header with logo and navigation. |
| `showNavLinks` | `boolean` | `true` | Show page navigation links in the header and mobile menu. |
| `headerRight` | `React.ReactNode` | — | Custom content rendered on the right side of the header (e.g. auth buttons). |
| `topNav` | `React.ReactNode` | — | Custom top navigation. When provided, replaces the built-in nav links entirely. |
| `aboutUrl` | `string` | — | URL for the About page link in the header navigation. |
| `customIcons` | `CustomIcon[]` | — | Custom icons to display in the Icons preview section. Each entry needs `name` and `icon` (a React component). |
| `iconMode` | `"append" \| "replace"` | `"append"` | `"append"` adds custom icons after the built-in lucide icons. `"replace"` hides built-ins and shows only custom icons. |
| `showLogo` | `boolean` | `true` | Show the Themal logo in the header. Set `false` for white-label or plugin usage. |
| `showSectionNav` | `boolean` | `true` | Show the sticky section navigation bar (Colors, Buttons, Cards, etc.). |
| `defaultColors` | `Record<string, string>` | — | Default color values keyed by CSS variable name (e.g. `{"--brand": "210 50% 40%"}`). Applied on mount and whenever the prop changes, taking priority over stored theme colors. "Reset theme to default" restores these instead of the Themal defaults. |
| `defaultTypography` | `Partial<TypographyState>` | — | Default typography state to restore on reset. When provided, the font dropdown shows an "App Default" option with your font name, the editor initializes with your fonts on first load, and "Reset theme to default" restores your font settings instead of the Themal defaults. |
| `sidebarLinks` | `{ to: string; label: string }[]` | — | Navigation links to display in the left sidebar. |
| `sidebarExtra` | `React.ReactNode` | — | Custom content rendered at the bottom of the left sidebar (e.g. contact forms, branding). |
| `featuresUrl` | `string` | — | URL for the Features page link in the sidebar. |

## Premium Features

The following features require a valid license key:

| Feature | Description |
|---------|-------------|
| Harmony schemes | Generate palettes using complementary, analogous, triadic, or split-complementary color relationships. |
| PR integration | Create design system pull requests directly from the editor. |
| Undo/redo | Up to 10 levels of undo for theme refreshes and image palette applications. |
| Image palette extraction | Extract color palettes from uploaded images with preview confirmation. |
| Palette export | Download palette as SVG/PNG, or copy as HEX/RGB/RGBA text. |
| Interaction states | Style hover, focus, and active states for buttons and components. |
| Typography interactions | Customize hover, active, and underline behavior for links and headings. |
| Icon import | Import icons from SVG sprites, icon font CSS (Font Awesome, Bootstrap Icons, Material Icons), or CDN packages (Lucide, Heroicons, Phosphor). |
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
| `variant` | `"section" \| "inline"` | `"section"` | `"section"` shows a lock icon and `not-allowed` cursor; `"inline"` shows a lock icon inline. Both open a modal on click. |
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

### With PR creation (server-side endpoint)

The editor can open design system PRs against your repo. Pass `prEndpointUrl` pointing to your backend endpoint. The editor POSTs JSON with `{ css, sections }` and expects a JSON response with `{ url }` (the GitHub PR or compare URL).

```tsx
<DesignSystemEditor prEndpointUrl="/api/create-design-pr" />
```

Your endpoint receives:

```json
{
  "css": ":root {\n  --brand: 210 50% 40%;\n  ...\n}",
  "sections": ["colors", "typography"]
}
```

And should return:

```json
{
  "url": "https://github.com/your-org/your-repo/pull/42"
}
```

The PR button is hidden when both `prEndpointUrl` and `githubConfig` are omitted.

### With PR creation (client-side GitHub API via prop)

Pass `githubConfig` to enable PR creation directly from the editor UI using the GitHub API. The editor handles OAuth authentication, branch creation, and file updates automatically.

```tsx
<DesignSystemEditor
  githubConfig={{
    clientId: 'your-github-oauth-client-id',
    repo: 'your-org/your-repo',
    filePath: 'src/globals.css',   // optional, default: "src/globals.css"
    baseBranch: 'main',            // optional, default: "main"
  }}
/>
```

When the user clicks "Open PR", the editor checks for a stored OAuth token. If none exists, it opens a GitHub OAuth popup. After authentication, it creates a branch, commits the updated CSS variables, and opens the GitHub compare page for the user to review and submit.

The default OAuth token exchange proxy is hosted at `themalive.com`. Override it with `oauthProxyUrl` for self-hosted setups or GitHub Enterprise.

#### GitHubConfig options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `clientId` | `string` | — | GitHub OAuth App client ID (required). |
| `repo` | `string` | — | Target repository in `owner/repo` format (required). |
| `filePath` | `string` | `"src/globals.css"` | Path to the CSS file to update. |
| `baseBranch` | `string` | `"main"` | Base branch to create PRs against. |
| `oauthProxyUrl` | `string` | `"https://themalive.com/.netlify/functions/github-oauth"` | Token exchange proxy URL. |
| `apiBaseUrl` | `string` | `"https://api.github.com"` | GitHub API base URL (for GitHub Enterprise). |
| `webBaseUrl` | `string` | `"https://github.com"` | GitHub web base URL (for GitHub Enterprise). |

### With PR creation (client-side GitHub API, manual)

For full control, use the exported utilities directly instead of the `githubConfig` prop:

```tsx
import { createDesignPr, startOAuthFlow } from '@themal/editor';

const config = {
  clientId: 'your-github-oauth-client-id',
  repo: 'your-org/your-repo',
  filePath: 'src/globals.css',
  baseBranch: 'main',
};

// 1. Authenticate via OAuth popup
const auth = await startOAuthFlow(config);

// 2. Create a PR with the current CSS
const compareUrl = await createDesignPr(config, auth.access_token, css, ['colors', 'typography']);
window.open(compareUrl, '_blank');
```

This flow opens a GitHub OAuth popup, exchanges the code for a token via a proxy, then creates a branch and commit using the GitHub API entirely from the browser.

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

### With custom top navigation

```tsx
<DesignSystemEditor
  topNav={
    <>
      <a href="/dashboard" className="ds-nav-link">Dashboard</a>
      <a href="/settings" className="ds-nav-link">Settings</a>
      <a href="/docs" className="ds-nav-link">Docs</a>
    </>
  }
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

### Import icons from the browser (Pro)

Premium users can import icons directly from the editor UI without writing code. Click the "Import" button in the Icons row to open the import modal with three tabs:

- **CDN Package** — Pick from Lucide, Heroicons, or Phosphor. Search, select, and import individual icons.
- **SVG Sprite** — Paste a URL to an SVG sprite file. The editor parses `<symbol>` elements and lets you pick which icons to import.
- **Icon Font** — Paste a CSS URL (or choose a preset for Font Awesome, Bootstrap Icons, or Material Icons). The editor detects icon classes and renders previews.

Imported icons are persisted to localStorage and rendered alongside built-in and custom icons. Each imported icon shows a remove badge on hover.

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
  BUTTON_STYLE_KEY,          // Key for button style storage
  INPUT_STYLE_KEY,           // Key for input style storage
  INTERACTION_STYLE_KEY,     // Key for interaction style storage

  // Card, typography & interaction style utilities
  applyStoredCardStyle,           // Restore card style from localStorage
  applyStoredTypography,          // Restore typography from localStorage (applies site-wide)
  applyStoredAlertStyle,          // Restore dialog alert style from localStorage
  applyStoredToastStyle,          // Restore toast style from localStorage
  BUTTON_PRESETS,                     // Subtle, Elevated, Bold button style presets
  applyStoredButtonStyle,             // Restore button style from localStorage
  INPUT_PRESETS,                      // Rounded, Sharp, Pill input style presets
  applyStoredInputStyle,              // Restore input style from localStorage
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

  // GitHub PR utilities (client-side)
  createDesignPr,       // Create a design system PR via GitHub API
  replaceRootBlock,     // Replace CSS vars in a :root block string
  getAuthenticatedUser, // Verify a GitHub token and get username
  startOAuthFlow,       // Start GitHub OAuth popup flow
  getStoredAuth,        // Retrieve stored GitHub auth from sessionStorage
  clearAuth,            // Clear stored GitHub auth
  validateStoredToken,  // Validate stored token against GitHub API

  // License utilities
  validateLicenseKey,   // Validate a THEMAL-XXXX-XXXX-XXXX key
  generateLicenseKey,   // Generate a valid license key

  // Premium components & hooks
  LicenseProvider,      // Context provider for license state
  useLicense,           // Hook: { isValid, isPremium }
  PremiumGate,          // Gate component for premium features

  // Feature flags
  FeatureFlag,          // Conditionally render children based on a feature flag
  FEATURE_FLAGS,        // Current feature flag values
} from '@themal/editor';
```

### Exported Types

```tsx
import type {
  DesignSystemEditorProps,
  TokenDefinition,
  CustomIcon,
  ImportedIconData,
  HarmonyScheme,
  CardStyleState,
  ButtonStyleState,
  InputStyleState,
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
  GitHubConfig,
  StoredGitHubAuth,
  FeatureFlagName,
} from '@themal/editor';
```

## How It Works

1. **Color picking** — Click any swatch to scroll the Colors section into view, then open the native color picker. Changing a key color (brand, secondary, accent, background) automatically derives related tokens.
2. **Harmony schemes** *(Pro)* — Generate palettes using complementary, analogous, triadic, or split-complementary color relationships.
3. **Color locks** — Lock up to 4 color tokens to preserve them during palette regeneration or harmony scheme changes. Free for all users.
4. **Contrast enforcement** — Every foreground/background pair is checked against WCAG AA (4.5:1). Failing pairs are auto-corrected by adjusting lightness. The accessibility audit shows a centered modal with results. On failure, choose "Ignore" to dismiss or "Suggest Alternative" to auto-fix contrast issues. A WCAG On/Off toggle lets you disable auto-correction for marketing or other contexts that don't require WCAG compliance. Locks are still honored when enforcement is off.
4. **Typography** — Choose heading and body fonts (including custom Google Fonts), adjust sizes, weights, line height, and letter spacing with live preview. Five built-in presets (System, Modern, Classic, Compact, Editorial). The default "Inherit (Host)" option defers to the host site's font-family rules, so the editor naturally assumes your site's heading and body fonts. Typography is scoped to `.ds-editor` and does not override the host site's fonts.
5. **Button styles** — Customize button padding, font size, font weight, border radius, shadow, and border width with presets (Subtle, Elevated, Bold).
6. **Button interactions** *(Pro)* — Fine-tune hover opacity, hover/active scale, transition duration, and focus ring width with presets (Subtle, Elevated, Bold).
7. **Typography interactions** *(Pro)* — Customize link hover/active behavior (opacity, scale, underline) and heading hover effects with live preview.
8. **Input styles** — Customize input border radius, border width, padding, font size, and focus ring width with presets (Rounded, Sharp, Pill). Live preview includes text inputs, email inputs, textareas, a custom themed select dropdown, checkboxes, radio buttons, toggle switches, and a segmented toggle.
9. **Custom select dropdowns** — All native `<select>` elements throughout the editor have been replaced with custom themed dropdowns that follow the design system's color scheme, with click-outside-to-close, chevron animation, and hover highlighting.
10. **Persistence** — All settings (colors, typography, card styles, dialog styles, toast styles, interactions, input styles) are saved to `localStorage` and restored on reload.
11. **Per-section export** — Every section header includes a CSS | Tokens split button to export CSS custom properties with Tailwind config, or W3C Design Token JSON, for that section.
12. **Shareable URLs** — Encode your full theme state in the URL hash and share it with anyone via a single link.
13. **Palette export** *(Pro)* — Download your palette as SVG or PNG, or copy as a HEX/RGB/RGBA text list.
14. **Custom fonts** *(Pro)* — Add any Google Font by name. The editor validates the font exists, loads all weights, adds it to heading/body dropdowns, and persists it across sessions.
15. **Icon import** *(Pro)* — Import icons from CDN packages (Lucide, Heroicons, Phosphor), SVG sprites, or icon font CSS files directly from the browser.
16. **Mobile friendly** — Fully responsive UI with a frosted-glass sidebar menu, section dropdown navigation, a 2D color spectrum picker for touch-based color selection, custom themed dropdowns, compact swatch labels, touch-friendly control sizing (44px+ tap targets for sliders, buttons, toggles, and checkboxes), and stacked layouts for smaller screens. A floating scroll-to-top button with frosted glass styling appears on scroll.

## Package Architecture

The editor is built with Vite in library mode and published as an ES module:

```
@themal/editor
├── dist/index.js      # ESM bundle (all components + utilities)
├── dist/index.d.ts    # TypeScript declarations
└── dist/style.css     # Pre-compiled, scoped Tailwind styles
```

### Source Structure

```
src/
├── DesignSystemEditor.tsx      # Main orchestrator component
├── sections/                   # Section components (Colors, Buttons, Cards, etc.)
├── components/                 # Shared UI (SectionHeader, modals, PremiumGate)
├── hooks/                      # Custom hooks (useColorState, useNavigationState, etc.)
├── utils/
│   ├── styles/                 # Domain-specific style utilities
│   │   ├── colorUtils.ts       # Color conversion, contrast, harmony
│   │   ├── cardStyle.ts        # Card style management
│   │   ├── buttonStyle.ts      # Button style management
│   │   ├── inputStyle.ts       # Input style management
│   │   ├── typographyStyle.ts  # Typography and custom fonts
│   │   ├── alertStyle.ts       # Alert and toast styles
│   │   ├── interactionStyle.ts # Button interaction states
│   │   └── exportUtils.ts      # Serialization, design tokens, export
│   ├── themeUtils.ts           # Barrel re-export of all style utilities
│   ├── githubApi.ts            # Client-side GitHub PR creation
│   ├── githubAuth.ts           # GitHub OAuth popup flow
│   ├── iconImport.ts           # SVG sanitizer, icon fetching
│   ├── storage.ts              # localStorage with fallbacks
│   ├── license.ts              # License key validation
│   └── featureFlags.ts         # Feature flag config for in-progress features
└── styles/editor.css           # Scoped Tailwind + custom CSS
```

### Exports Map

```json
{
  ".":            { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
  "./style.css":  "./dist/style.css"
}
```

Import the main entry point for components and utilities, and `style.css` separately for styles. This keeps CSS opt-in and avoids side effects during tree-shaking.

## Theming & Customization

The editor inherits your site's base font size by default (0.8125rem fallback). Override it with a CSS custom property:

```css
:root {
  --ds-base-font-size: 1rem;
}
```

Typography changes made in the editor are scoped to `.ds-editor` and do not override fonts on the rest of your page.

## CSS Isolation

The editor ships pre-compiled CSS via `@themal/editor/style.css`. Tailwind's global preflight is disabled — only a scoped reset applies inside `.ds-editor`, so the plugin never injects global `html`, `body`, or heading rules into your page. Utility classes are scoped using Tailwind's `important: '.ds-editor'`. The root element is automatically wrapped in `<div className="ds-editor">`.

This means:
- Your site's `font-family`, `color`, and `background` rules are never overridden.
- Host heading fonts (e.g. `h2 { font-family: "League Gothic" }`) flow through into the editor.
- No `!important` declarations leak into the global scope.

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

## Security

The editor follows these security practices:

- **SVG sanitization** — All imported SVGs are sanitized with element and attribute whitelists. Script tags, event handlers, `javascript:` URIs, and `style` attributes are stripped.
- **CSS injection prevention** — Font family names are sanitized before interpolation into `<style>` tags to prevent CSS breakout attacks.
- **HTTPS-only fetching** — Icon imports (sprites, fonts, CDN) enforce HTTPS URLs only.
- **Pinned CDN versions** — CDN icon fetches use pinned package versions instead of `@latest`.
- **Origin-checked OAuth** — GitHub OAuth `postMessage` listener validates `event.origin`.
- **Session-scoped tokens** — GitHub OAuth tokens are stored in `sessionStorage` (not `localStorage`) so they do not persist across browser sessions.
- **No runtime dependencies** — Zero production dependencies beyond React peer deps, minimizing supply chain risk.

## Testing

The project includes automated accessibility and integration testing:

```bash
# Run all unit tests (includes axe-core a11y checks)
npm run test:run

# Lint for accessibility issues
npm run lint
```

The unit test suite uses **vitest-axe** to run axe-core against rendered components. ESLint with **eslint-plugin-jsx-a11y** provides static analysis for common accessibility anti-patterns.

### Playwright Health Checks

The example consumer app (`packages/example-app`) includes a Playwright e2e health check suite that validates the plugin across all theme presets:

```bash
cd packages/example-app
npm run test:health
```

The suite covers 39 checks including:
- **CSS variables** — all required tokens resolve on every theme
- **Theme switching** — `--background` changes when switching presets
- **Section nav** — background matches `--background`, arrow sizes match section headers
- **Font inheritance** — headings use the host's heading font, body uses the host's body font, they differ when the host sets them differently
- **Contrast** — foreground/background lightness difference is sufficient on every theme
- **CSS isolation** — plugin does not override `body` font-family or background-color
- **Accessibility** — no critical/serious axe-core violations (WCAG 2 AA) on any theme
- **Premium gate** — locked features show lock icon without opacity dimming; premium toggle unlocks them
- **Sections** — all 6 sections (colors, buttons, card, alerts, typography, inputs) are present

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
