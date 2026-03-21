import ThemalLogo from "../components/ThemalLogo";
import JsonLd from "../components/JsonLd";
import usePageMeta from "../hooks/usePageMeta";

const features = [
  {
    version: "0.39",
    items: [
      "scanHostPage prop - control whether the host palette scanner runs when applyToRoot is enabled (default: true). Set to false to suppress the \"Site palette detected\" modal",
      "Fix All confirmation summary - after applying WCAG contrast fixes, a summary shows every color that changed (old/new hex with swatches) and prompts to re-export CSS/Tokens",
      "Modal opacity bulletproofing - all modal backdrops and children forced to opacity:1 via CSS, preventing hover:opacity Tailwind classes from making the scrim translucent",
      "Unscoped audit dialog CSS - ds-audit-dialog selectors no longer require .ds-editor ancestor, fixing invisible buttons when the fixed-position modal escapes the editor wrapper",
      "Unscoped modal color classes - ds-modal-panel .ds-bg-destructive and related selectors work without .ds-editor ancestor for reset confirmation modals",
      "Section nav alignment fix - removed translateX-based nav item reordering so section nav labels always left-align with their corresponding section headers",
      "Section nav padding aligned with content area - nav and content use matching horizontal padding at all breakpoints",
      "applyToRoot enabled on Themal site - design system color changes now affect the entire page, not just the editor plugin area",
      "Pricing update - monthly Pro plan changed from $9 to $10/month, yearly remains $50/year",
      "Preset button contrast fix - inactive preset buttons (Alerts, Buttons, Typography) now use --muted-foreground for guaranteed readability on --muted backgrounds in dark themes",
      "Placeholder text contrast fix - input/textarea placeholders use foreground at 45% opacity with browser opacity override to ensure visibility on all themes",
      "Table heading contrast fix - header text color dynamically computed via fgForBg() against the --muted background, guaranteeing contrast in any theme",
      "Audit dialog button specificity fix - !important on audit button colors to beat the .ds-editor scoped reset that was overriding blue backgrounds with transparent",
      "onMount callback prop - called once per browser session with the editor version string for telemetry. The editor itself makes zero network requests, resolving the Snyk \"Network access\" supply chain finding",
      "EDITOR_VERSION export - consumers can import the version string for logging or diagnostics",
      "Clerk SDK upgraded from v4 to v5 (clerk-sdk-node 4.13.23 → 5.1.6)",
      "Dependency security fixes - updated undici and flatted to resolve high-severity advisories in dev dependencies",
    ],
  },
  {
    version: "0.38",
    items: [
      "CSS/Tokens/Reset export buttons added to Inputs and Tables sections - all 7 sections now have per-section export",
      "Section locks feature (behind sectionLocks feature flag) - lock any section to preserve its styles during global reset",
      "Targeted contrast audit - auditor only scans elements marked with data-audit-target instead of the entire content area, eliminating false positives from code blocks and editor chrome",
      "Scroll-to-top arrows account for sticky headers - 160px offset prevents content from hiding behind the header",
      "Increased scroll-mt on section headings (scroll-mt-40 lg:scroll-mt-24) for proper scroll-into-view with sticky navs",
      "Mobile full-width layout - reduced horizontal padding to px-2 on narrow viewports so content uses the full screen",
      "Site header improvements - section nav animation on tablet, Tables added to section nav, background matches theme on editor page",
      "AI theme generation - new Netlify function (ai-generate-theme) calls Claude Sonnet 4.6 with prompt caching for 90% input cost reduction on repeat requests",
    ],
  },
  {
    version: "0.37",
    items: [
      "Replaced axe-core (~580KB) with a built-in lightweight contrast auditor (~2KB) - 43% reduction in total JS bundle size",
      "Error notification for contrast auditor failures - displays a dialog with details and a retry button instead of failing silently",
      "Theme-independent audit dialog - fixed opaque background, hardcoded accessible button colors, and icon colors that render correctly regardless of user theme",
      "Removed section wrapper borders from Colors, Typography, Buttons, Cards, Inputs, Tables, Dialog Boxes, and Toast Messages sections for a cleaner UI",
      "Removed axe-core from peer dependencies - WCAG AA contrast auditing now works out of the box with zero additional dependencies",
      "Fix CSS/Tokens/Reset button contrast - switched from ds-text-muted to ds-text-subtle for guaranteed readability on light themes (0.37.1)",
      "Fallback palette for consuming apps - editor renders a default light theme when no defaultColors prop, stored theme, or host CSS variables exist (0.37.2)",
      "Inherit host theme variables - reads CSS custom properties from both editor element and :root, only fills gaps with fallbacks (0.37.3)",
      "Fix section nav alignment - moved SectionNav inside the main content area so it left-aligns with section headings at all viewport widths (0.37.4)",
      "Fix fallback timing - apply fallback palette synchronously so first render is never blank (0.37.5)",
      "CSS isolation for anchors and buttons - reset host background-color on all a and button elements inside .ds-editor to prevent consuming app styles from bleeding through (0.37.6)",
      "Fix lock icon visibility on swatches - use foreground at 60% opacity instead of muted-foreground (0.37.7)",
      "Fix host button styles leaking into CSS/Tokens/Reset buttons - explicit transparent background on inactive state (0.37.8)",
      "Contrast audit now covers all preview content - removed data-axe-exclude from 9 preview areas across Colors, Buttons, Cards, Alerts, Tables, Inputs, and Typography sections (0.37.9)",
      "Header layout - nav links render on their own row below the logo instead of beside it (0.37.10)",
      "Stronger CSS isolation - doubled-class selector (.ds-editor.ds-editor) for a/button/nav background resets to beat common host specificity patterns; inline transparent background on nav element (0.37.10)",
      "Comprehensive scoped CSS reset - resets background-color, border, box-shadow, padding, margin, and text-transform on all interactive and structural elements inside .ds-editor to prevent any host-app style bleed-through (0.37.11)",
      "Fix checkbox and radio button sizing - locked to 1.25rem with min/max constraints so host styles can't inflate them (0.37.11)",
      "Roll back over-aggressive CSS reset that broke editor's own select dropdowns, checkboxes, and preset buttons - narrowed to only background-color and text-decoration on a/button/nav; boosted audit dialog specificity (0.37.12)",
      "Fallback-safe modals - ds-modal-panel falls back to white when --card is undefined; added --card, --popover, --ring, --input to fallback palette; reset handlers re-apply fallbacks when no defaultColors exist (0.37.13)",
    ],
  },
  {
    version: "0.36",
    items: [
      "Removed Icons section from the editor",
    ],
  },
  {
    version: "0.35",
    items: [
      "Auto-inject integration CSS when applyToRoot is enabled - body, headings, links, cards, borders, and nav/header/footer are themed automatically via a managed <style> tag",
      "Include integration rules in PRs - the Open PR modal defaults to including integration CSS rules so sites work after merge without manual stylesheet edits",
      "Fix brand button contrast - brand-colored buttons now use computed foreground color for accessible text",
    ],
  },
  {
    version: "0.34",
    items: [
      "Modal theming CSS custom properties - consumers can now override --themal-modal-backdrop-bg, --themal-modal-bg, --themal-modal-fg, and --themal-modal-shadow to theme all editor modals without !important or high-specificity selectors",
      "ds-modal-backdrop utility class - replaces hardcoded bg-black/50 and inline rgba backdrop styles across all modals",
      "ds-modal-panel utility class - replaces ds-surface + shadow-xl on modal content panels with a single themeable class",
      "All 7 modal components updated - ResetConfirmModal, AiGenerateModal, CssImportModal, IconImportModal, ImagePaletteModal, PrModal, and UpgradeModal now use the new utility classes",
      "Simplified .env.example - removed Stripe, Clerk, database, and Google OAuth variables; only GITHUB_TOKEN and ANTHROPIC_API_KEY remain for consumers",
      "Subsection label contrast fix - all uppercase subsection headings (Size, Text, Shadow, Preview, etc.) across all 7 sections now use ds-text-subtle instead of ds-text-muted for guaranteed accessible contrast on any theme",
    ],
  },
  {
    version: "0.33",
    items: [
      "Fix build failure and contrast-aware swatch labels - palette swatch labels now compute text color against page background instead of relying on --foreground variable",
      "onAiPaletteMap prop - provider-agnostic AI palette mapping callback behind the aiPaletteMapping feature flag",
      "buildAiPalettePrompt utility - generates a structured prompt describing the detected host palette for AI-assisted token mapping",
      "aiPaletteMapping feature flag - Phase 2 AI palette mapping hidden behind feature flag (disabled by default)",
      "ds-text-subtle utility class - foreground at 60% opacity for guaranteed contrast on any surface, used across all modal labels",
      "Modal contrast fix - all modal labels, buttons, and form inputs now use surface-relative colors (ds-text-subtle, brand buttons) instead of muted-foreground which could mismatch the modal background",
    ],
  },
  {
    version: "0.32",
    items: [
      "Host style scanner - detects the consuming page's existing color palette (backgrounds, text, borders, fonts) on mount",
      "Integration guide prompt - banner with \"View CSS\" button shows a tailored, copyable CSS snippet based on detected host page colors",
      "Dismissable developer prompt - persists dismissal to localStorage, includes \"Don't show again\" option",
      "buildIntegrationCss utility - generates context-aware CSS with var() references, includes detected palette summary as comments",
    ],
  },
  {
    version: "0.31",
    items: [
      "Host palette scanner - scanHostStyles() walks the DOM outside .ds-editor, extracts computed colors and fonts, groups similar colors within perceptual distance",
      "Heuristic token mapper - mapPaletteToTokens() maps detected colors to Themal tokens (most common bg, highest contrast text, most saturated brand, etc.)",
      "Auto-populate initial theme - when no stored theme exists and applyToRoot is enabled, editor initializes with the detected host palette",
      "New exports: scanHostStyles, mapPaletteToTokens, buildIntegrationCss, HostPalette, ColorEntry, FontEntry",
    ],
  },
  {
    version: "0.30",
    items: [
      "applyToRoot prop - mirrors all CSS custom properties to :root so the theme applies beyond the .ds-editor scope",
      "setVar helper - centralized CSS variable setter that applies to both the editor root and document root when applyToRoot is enabled",
      "Cleanup on unmount - CSS variables are removed from :root when the editor unmounts",
      "All style.setProperty calls unified through setVar for consistent behavior",
    ],
  },
  {
    version: "0.29",
    items: [
      "Contrast auto-fix rewrite - \"Suggest Alternative\" now fixes CSS variables directly, persists to localStorage, and updates design tokens in sync",
      "Second-pass contrast enforcement - iterates all foreground/background pairs with fgForBg fallback for any remaining failures",
      "Transparent section nav - nav bar no longer forces a background color, works cleanly on any host site",
      "Early access mode - all Pro features unlocked for free, no account required",
    ],
  },
  {
    version: "0.28",
    items: [
      "Color locks free for all users - no longer gated behind premium",
      "Feature flag system - FeatureFlag component and featureFlags.ts for hiding in-progress features behind a toggle",
      "Root color sync - MutationObserver mirrors editor color changes to :root so host site header/footer stay in sync",
      "Premium modal contrast fix - body text uses foreground color for readable contrast",
      "Sidebar background fix - sidebar inherits host background transparently",
      "Example app heading font changed to Roboto Serif",
    ],
  },
  {
    version: "0.27",
    items: [
      "CSS isolation - disabled Tailwind preflight globally, replaced with a scoped reset inside .ds-editor only to prevent leaking styles into the host site",
      "Font inheritance by default - typography defaults to \"inherit\" so the editor picks up the host site's heading and body fonts without overriding them",
      "Inherit (Host) font option - new first option in font dropdowns that omits font-family entirely, letting host CSS cascade through",
      "Playwright health check suite - 39 e2e tests across 4 theme presets covering CSS variables, theme switching, font inheritance, contrast, a11y (WCAG AA), CSS isolation, and premium gate",
      "Accessibility fixes - ds-text-muted specificity corrected to beat button color reset, explicit background-color/color on .ds-editor for accurate contrast detection",
      "SectionNav arrow sizing - arrows now use em units inside headings so they scale consistently with section header arrows",
      "Purge info icon - moved inline with the Purge button label instead of a separate button",
      "defaultColors priority - host-provided defaultColors now correctly override stored theme on initial mount",
      "Premium modal contrast fix - modal body text uses foreground color instead of muted for readable contrast",
      "Custom select dropdowns replaced all native selects site-wide",
    ],
  },
  {
    version: "0.26",
    items: [
      "Font-family and color inherit - editor CSS now inherits font-family and color from the host site so consumers don't need overrides",
      "Muted-foreground color adjustment in globals.css",
      "SiteFooter branding image and layout improvements",
    ],
  },
  {
    version: "0.25",
    items: [
      "prApiKey prop - send an x-api-key header with PR endpoint requests for authenticated server-side endpoints",
      "Security fixes - SVG sanitizer hardened, license bypass patched, PR endpoint auth enforced",
      "Dialog and toast reset modals - independent reset buttons for alert and toast style sections",
      "Priority 1 test coverage - mobile header contrast, scroll margin, dropdown styling",
      "Purge info tooltip - moved inline with Purge button label",
    ],
  },
  {
    version: "0.24",
    items: [
      "Client-side GitHub PR integration - new githubConfig prop for creating PRs directly via the GitHub API using an OAuth popup flow",
      "Mobile touch-friendly design - 44px+ tap targets, touch-optimized controls",
      "Left sidebar navigation added to all non-editor site pages",
      "Font sizes converted to rem-based Tailwind scale, inline styles removed",
      "GitHub PR utilities exported (createDesignPr, startOAuthFlow, etc.)",
    ],
  },
  {
    version: "0.23",
    items: [
      "Major refactor - DesignSystemEditor split from 9,500 lines into focused section components, domain hooks, and shared UI",
      "Modular style utilities - themeUtils split into 9 domain-specific modules (colorUtils, cardStyle, buttonStyle, etc.)",
      "Security hardening - SVG sanitizer strips style attributes, font family CSS injection prevention, HTTPS-only icon fetching, pinned CDN versions, origin-checked OAuth, session-scoped GitHub tokens",
      "Scoped typography - font changes no longer override the host site's styles, scoped to the editor only",
      "Customizable base font size - new --ds-base-font-size CSS variable (defaults to 13px) lets importing apps control editor text size",
      "Responsive arrows - section nav and heading arrows scale with text size using em units",
      "Accessibility fix - toggle switches now include aria-label for screen readers",
      "30 new security and regression tests added",
    ],
  },
  {
    version: "0.22",
    items: [
      "Compact base font size - editor UI text reduced to 13px for a tighter, more professional layout",
      "Section nav matches headings - top navigation items now use the same font size, weight, and letter-spacing as section headings",
      "Left nav border removed - cleaner sidebar appearance without the right border",
    ],
  },
  {
    version: "0.21",
    items: [
      "Left sidebar navigation - section links moved to a persistent left sidebar with collapsible layout",
      "Shared site layout - consistent header, footer, and sidebar across all pages",
      "Security hardening - stricter CSP headers and input sanitization",
      "Export icons - per-section export buttons now include inline icons for clarity",
    ],
  },
  {
    version: "0.20",
    items: [
      "Icon import (Pro) - import icons from CDN packages (Lucide, Heroicons, Phosphor), SVG sprites, or icon font CSS directly from the browser",
      "Custom select dropdowns - all native selects replaced with themed dropdowns that follow the design system color scheme",
      "Input styles section - customize input border radius, border width, padding, font size, and focus ring with presets (Rounded, Sharp, Pill)",
      "Segmented toggle - new toggle component for input previews with checkbox, radio, and switch variants",
      "Top nav prop - new topNav prop to replace the built-in navigation with custom links for plugin usage",
      "Dev mode - devMode prop with storage purge utility for development",
    ],
  },
  {
    version: "0.19",
    items: [
      "App Default fonts - when a consuming app provides defaultTypography, the font dropdown shows an \"App Default\" option with the app's font name pre-selected on first load",
      "Plugin contrast hardening - typography controls (Fonts, Size & Weight, Spacing) now use fixed colors so labels and inputs remain readable on any host theme",
      "Case-insensitive font search - custom Google Font lookups now accept lowercase input and title-case it automatically",
      "Custom reset defaults - new defaultColors and defaultTypography props let consuming apps define their own baseline for \"Reset theme to default\"",
      "Scoped typography injection - font changes applied via prioritized CSS injection, scoped to the editor component",
      "Editor chrome contrast fixes - section nav, modals (Extract Palette, WCAG audit), and action buttons all use fixed colors to prevent contrast issues on dark-themed host sites",
      "Autoscroll scoping - clicking typography inputs and dropdowns no longer triggers the scroll-to-top behavior meant for color swatches",
    ],
  },
  {
    version: "0.18",
    items: [
      "Mobile color spectrum picker - 2D saturation/lightness canvas with hue slider replaces the 3 separate HSL sliders for a more intuitive touch experience",
      "Custom icon support - new customIcons prop accepts an array of React components for the Icons preview section",
      "Icon mode toggle - iconMode prop to append custom icons after built-ins or replace them entirely",
      "Show/hide logo - new showLogo prop for white-label and plugin usage",
    ],
  },
  {
    version: "0.17",
    items: [
      "Early access mode - all Pro features unlocked for free, no account required",
      "Independent dialog and toast styling - each section has its own preset buttons, shape controls, CSS/Tokens export, and reset",
      "Toast style presets - Filled, Soft, Outline, Minimal with independent persistence",
      "Button preview improvements - Types and Interactions sections now reflect dynamic border radius and interaction styles in real time",
      "Mobile color picker scroll - page auto-scrolls to keep swatches visible when the native color picker opens on mobile",
      "Consistent typography - paragraph and list text sizes now match across all pages",
    ],
  },
  {
    version: "0.16",
    items: [
      "Shareable URLs - encode full theme state in URL hash, copy link to clipboard with one click",
      "Per-section CSS and Design Token export - every section header (colors, card, alerts, typography, interactions) has a split-button toggle for CSS + Tailwind or W3C Design Token JSON",
      "Premium palette export - download palette as SVG or PNG, copy as HEX, RGB, or RGBA text list",
      "Image palette confirmation modal - preview uploaded image and extracted colors before applying",
      "Share button - new header action to generate and copy shareable theme links",
      "Report Bug form - Netlify Forms integration in site footer for bug reports",
      "Themal logo component - inline SVG with currentColor support for proper dark mode rendering",
    ],
  },
  {
    version: "0.15",
    items: [
      "Buttons section - renamed from Interactions, split into Types (color swatches) and Interactions (premium controls) side-by-side",
      "Button color swatches - read-only swatches for Primary, Secondary, Destructive, Muted, Success, Warning, and Brand",
      "PremiumGate section variant - gated content now renders disabled (dimmed, non-interactive) instead of hidden",
      "Nav icons - section navigation items now have inline icons for visual alignment",
      "Legal pages - Privacy Policy, Cookies Policy, Terms & Conditions, and Accessibility page",
      "Accessibility commitment - WCAG 2.1 Level AA compliance statement",
      "Cookie consent banner - first-visit notification with localStorage persistence",
      "Contact form - Netlify Forms integration with honeypot spam protection",
      "Test suite - Vitest + Testing Library + jsdom with smoke tests",
      "Lighthouse CI - automated performance, accessibility, SEO, and best practices auditing",
    ],
  },
  {
    version: "0.14",
    items: [
      "Image-based palette extraction - upload a PNG/JPG and derive a full color palette via k-means clustering",
      "Subscription management and upgrade flow with Stripe checkout",
      "Sign-in link added to premium feature gates",
      "Clerk proxy fix for local development",
    ],
  },
  {
    version: "0.13",
    items: [
      "Premium feature gating with license key support",
      "Color harmony schemes - Complementary, Analogous, Triadic, Split-Complementary",
      "Color lock - pin individual tokens during palette generation",
      "Undo last palette change",
      "Pricing page with Free and Pro tiers",
    ],
  },
  {
    version: "0.12",
    items: [
      "Typography system with 4 presets - Modern, Classic, Compact, Editorial",
      "Alert style system with 4 presets - Filled, Soft, Outline, Minimal",
      "Interaction state presets - Subtle, Elevated, Bold, Minimal",
      "GitHub PR integration - open design system PRs directly from the editor",
      "Navigation links between editor, docs, and pricing pages",
      "Restored stored typography on load",
    ],
  },
  {
    version: "0.11",
    items: [
      "Card style system with 4 presets - Liquid Glass, Solid Color, Gradient, Border Only",
      "Typography presets with system font option",
      "CSS export for all sections - colors, card, typography, alerts, interactions",
      "Section-level reset controls",
      "Package renamed to @themal/editor",
    ],
  },
  {
    version: "0.10",
    items: [
      "23 HSL CSS custom properties for full design system coverage",
      "Real-time color picking with live preview",
      "SVG elements update dynamically - inline SVGs using currentColor and CSS variables respond to theme changes in real time",
      "Random palette generation with smart derivation",
      "WCAG AA contrast enforcement (4.6:1 ratio)",
      "Contrast learning loop - saves corrections to localStorage",
      "Dark mode support with automatic foreground/background swap",
      "Built-in WCAG AA contrast auditor (zero dependencies)",
      "Responsive mobile-first layout with hamburger menu",
      "Web component support via <themal-editor> custom element",
    ],
  },
];

const check = (
  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Themal Editor",
  description: "Interactive design system editor with real-time color picking, harmony palettes, WCAG AA contrast, typography, and CSS export.",
  brand: { "@type": "Brand", name: "Themal" },
  url: "https://themalive.com/features",
  additionalProperty: [
    "Real-Time Color Picking",
    "Random Palette Generation",
    "Color Harmony Schemes",
    "Image Palette Extraction",
    "Dark Mode",
    "WCAG AA Contrast",
    "Typography System",
    "Card Style Presets",
    "Alert Style Presets",
    "Interaction States",
    "CSS & Design Token Export",
    "Palette Export",
    "Shareable URLs",
    "Accessibility Audit",
    "GitHub PR Integration",
    "Color Locks",
    "Responsive Layout",
    "Plugin Mode",
    "Custom Icons",
    "Full-Site Theming",
    "Host Style Scanner",
    "Web Component",
    "Contrast Fix Summary",
  ].map((name) => ({ "@type": "PropertyValue", name })),
};

export default function Features() {
  usePageMeta({
    title: "Features | Themal Design System Editor",
    description:
      "30+ features including real-time color picking, color harmony schemes, WCAG AA contrast, typography presets, card styles, input styles, icon import, security hardening, GitHub PR integration, and web component support. Plus changelog.",
  });

  return (
    <div className="flex-1 flex flex-col bg-page">
      <JsonLd data={PRODUCT_SCHEMA} />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-end gap-3 mb-8 text-fg">
          <ThemalLogo className="h-10 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-normal title-font text-fg" style={{ lineHeight: ".75" }}>
            Features
          </h1>
        </div>

        <p className="text-sm leading-relaxed mb-10 text-fg">
          Everything you can do with the Themal design system editor.
        </p>

        <section className="mb-16">
          <h2
            className="text-xl font-medium mb-6 pb-2 border-b text-fg border-theme"
          >
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              { title: "Real-Time Color Picking", desc: "Pick a brand color and watch every token update instantly with live preview." },
              { title: "Random Palette Generation", desc: "Generate harmonious palettes with smart derivation from a single brand color." },
              { title: "Color Harmony Schemes", desc: "Complementary, Analogous, Triadic, and Split-Complementary schemes." },
              { title: "Image Palette Extraction", desc: "Upload a photo and extract a full color palette via k-means clustering." },
              { title: "Dark Mode", desc: "Automatic foreground/background swap with one click." },
              { title: "WCAG AA Contrast", desc: "Every foreground/background pair is checked against a 4.6:1 contrast ratio." },
              { title: "Typography System", desc: "4 presets (Modern, Classic, Compact, Editorial) with custom Google Fonts support." },
              { title: "Card Style Presets", desc: "Liquid Glass, Solid Color, Gradient, and Border Only card styles." },
              { title: "Alert Style Presets", desc: "Filled, Soft, Outline, and Minimal alert styles with toast message previews." },
              { title: "Button Previews", desc: "Color swatches for Primary, Secondary, Destructive, Muted, Success, Warning, and Brand." },
              { title: "Interaction States", desc: "Subtle, Elevated, and Bold hover/focus/active presets." },
              { title: "CSS & Design Token Export", desc: "Per-section export of CSS custom properties or W3C Design Token JSON." },
              { title: "Palette Export", desc: "Download palette as SVG or PNG, copy as HEX, RGB, or RGBA." },
              { title: "Shareable URLs", desc: "Encode full theme state in a URL hash and share with one click." },
              { title: "Accessibility Audit", desc: "Built-in WCAG AA contrast auditor with inline violation reporting, one-click Fix All with a confirmation summary showing every color changed." },
              { title: "GitHub PR Integration", desc: "Open design system PRs via your server endpoint or directly through the GitHub API with built-in OAuth." },
              { title: "Color Locks", desc: "Pin individual color tokens during palette generation." },
              { title: "Responsive Layout", desc: "Mobile-first design with a 2D color spectrum picker for touch, adaptive controls across all viewports." },
              { title: "Plugin Mode", desc: "Embed the editor in any web app — React component or framework-agnostic web component. Customize with props for default colors, typography, header content, and white-label branding." },
              { title: "Custom Icons", desc: "Pass your own icon components to the Icons preview section, or replace the built-in set entirely." },
              { title: "Full-Site Theming", desc: "applyToRoot mirrors CSS variables to :root. Optional host style scanner detects your page's palette and generates integration CSS. Control scanning with scanHostPage prop." },
              { title: "Modal Theming", desc: "Override modal backdrop, background, text, and shadow via CSS custom properties — no !important needed." },
              { title: "Web Component", desc: "Drop into Vue, Svelte, Astro, WordPress, Shopify, or any platform via a single script tag." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-2">
                <span className="mt-0.5 text-brand">{check}</span>
                <div>
                  <p className="text-sm font-medium text-fg">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2
            className="text-xl font-medium mb-6 pb-2 border-b text-fg border-theme"
          >
            Upcoming
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              { title: "VS Code Extension", desc: "Edit and preview design tokens directly inside your code editor." },
              { title: "Mobile App", desc: "Edit and preview your design system on the go with a native iOS and Android app." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" strokeDasharray="4 3" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-fg">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <h2
          className="text-xl font-medium mb-6 pb-2 border-b text-fg border-theme"
        >
          Changelog
        </h2>

        <div className="space-y-10">
          {features.map(({ version, items }) => (
            <section key={version}>
              <h2
                className="text-xl font-medium mb-4 pb-2 border-b text-fg border-theme"
              >
                v{version}
              </h2>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm font-normal text-fg"
                  >
                    <span className="text-brand">{check}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
