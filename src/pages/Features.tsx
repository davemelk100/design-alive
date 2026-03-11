import ThemalLogo from "../components/ThemalLogo";
import JsonLd from "../components/JsonLd";
import usePageMeta from "../hooks/usePageMeta";

const features = [
  {
    version: "0.19",
    items: [
      "App Default fonts - when a consuming app provides defaultTypography, the font dropdown shows an \"App Default\" option with the app's font name pre-selected on first load",
      "Plugin contrast hardening - typography controls (Fonts, Size & Weight, Spacing) now use fixed colors so labels and inputs remain readable on any host theme",
      "Case-insensitive font search - custom Google Font lookups now accept lowercase input and title-case it automatically",
      "Custom reset defaults - new defaultColors and defaultTypography props let consuming apps define their own baseline for \"Reset theme to default\"",
      "Site-wide typography - font changes now apply across the entire page, not just within the editor, using prioritized CSS injection",
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
      "Accessibility audit via axe-core",
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
    "Web Component",
  ].map((name) => ({ "@type": "PropertyValue", name })),
};

export default function Features() {
  usePageMeta({
    title: "Features | Themal Design System Editor",
    description:
      "21 features including real-time color picking, color harmony schemes, WCAG AA contrast, typography presets, card styles, GitHub PR integration, and web component support. Plus changelog.",
  });

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: "hsl(var(--background))" }}>
      <JsonLd data={PRODUCT_SCHEMA} />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-end gap-3 mb-8" style={{ color: "hsl(var(--foreground))" }}>
          <ThemalLogo className="h-10 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-light title-font" style={{ color: "hsl(var(--foreground))", lineHeight: ".75" }}>
            Features
          </h1>
        </div>

        <p className="text-[14px] leading-relaxed mb-10" style={{ color: "hsl(var(--foreground))" }}>
          Everything you can do with the Themal design system editor.
        </p>

        <section className="mb-16">
          <h2
            className="text-xl font-medium mb-6 pb-2 border-b"
            style={{ color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
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
              { title: "Accessibility Audit", desc: "Built-in axe-core audit with inline violation reporting." },
              { title: "GitHub PR Integration", desc: "Open design system PRs directly from the editor." },
              { title: "Color Locks", desc: "Pin individual color tokens during palette generation." },
              { title: "Responsive Layout", desc: "Mobile-first design with a 2D color spectrum picker for touch, adaptive controls across all viewports." },
              { title: "Plugin Mode", desc: "Embed the editor in any React app with props for custom default colors, typography, header content, and white-label branding." },
              { title: "Custom Icons", desc: "Pass your own icon components to the Icons preview section, or replace the built-in set entirely." },
              { title: "Web Component", desc: "Drop into Vue, Svelte, Astro, WordPress, Shopify, or any platform via a single script tag." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: "hsl(var(--brand))" }}>{check}</span>
                <div>
                  <p className="text-[14px] font-medium" style={{ color: "hsl(var(--foreground))" }}>{title}</p>
                  <p className="text-[13px] font-light" style={{ color: "hsl(var(--muted-foreground))" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2
            className="text-xl font-medium mb-6 pb-2 border-b"
            style={{ color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
          >
            Upcoming
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              { title: "Figma Plugin", desc: "Sync design tokens between Themal and Figma for seamless designer-developer handoff." },
              { title: "VS Code Extension", desc: "Edit and preview design tokens directly inside your code editor." },
              { title: "AI-Assisted Design", desc: "Describe your brand or mood and let AI generate a complete design system with colors, typography, and component styles." },
              { title: "Mobile App", desc: "Edit and preview your design system on the go with a native iOS and Android app." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" strokeDasharray="4 3" />
                </svg>
                <div>
                  <p className="text-[14px] font-medium" style={{ color: "hsl(var(--foreground))" }}>{title}</p>
                  <p className="text-[13px] font-light" style={{ color: "hsl(var(--muted-foreground))" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <h2
          className="text-xl font-medium mb-6 pb-2 border-b"
          style={{ color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
        >
          Changelog
        </h2>

        <div className="space-y-10">
          {features.map(({ version, items }) => (
            <section key={version}>
              <h2
                className="text-xl font-medium mb-4 pb-2 border-b"
                style={{ color: "hsl(var(--foreground))", borderColor: "hsl(var(--border))" }}
              >
                v{version}
              </h2>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[14px] font-light"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <span style={{ color: "hsl(var(--brand))" }}>{check}</span>
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
