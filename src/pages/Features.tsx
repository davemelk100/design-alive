import { Link } from "react-router-dom";
import SiteFooter, { SiteFooterBranding } from "../components/SiteFooter";
import ThemalLogo from "../components/ThemalLogo";

const features = [
  {
    version: "0.7",
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
    version: "0.6",
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
    version: "0.5",
    items: [
      "Image-based palette extraction - upload a PNG/JPG and derive a full color palette via k-means clustering",
      "Subscription management and upgrade flow with Stripe checkout",
      "Sign-in link added to premium feature gates",
      "Clerk proxy fix for local development",
    ],
  },
  {
    version: "0.4",
    items: [
      "Premium feature gating with license key support",
      "Color harmony schemes - Complementary, Analogous, Triadic, Split-Complementary",
      "Color lock - pin individual tokens during palette generation",
      "Undo last palette change",
      "Pricing page with Free and Pro tiers",
    ],
  },
  {
    version: "0.3",
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
    version: "0.2",
    items: [
      "Card style system with 4 presets - Liquid Glass, Solid Color, Gradient, Border Only",
      "Typography presets with system font option",
      "CSS export for all sections - colors, card, typography, alerts, interactions",
      "Section-level reset controls",
      "Package renamed to @theemel/editor",
    ],
  },
  {
    version: "0.1",
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
      "Web component support via <theemel-editor> custom element",
    ],
  },
];

const check = (
  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function Features() {
  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-[14px] font-medium mb-6 hover:opacity-70 transition-opacity"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          &larr; Back to Editor
        </Link>

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
              { title: "Responsive Layout", desc: "Mobile-first design with adaptive controls across all viewports." },
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
              { title: "WordPress Plugin", desc: "Install Themal as a WordPress plugin to manage your theme's design tokens from the admin dashboard." },
              { title: "Shopify App", desc: "Embed the editor in your Shopify store admin to customize storefront colors, typography, and components." },
              { title: "Figma Plugin", desc: "Sync design tokens between Themal and Figma for seamless designer-developer handoff." },
              { title: "VS Code Extension", desc: "Edit and preview design tokens directly inside your code editor." },
              { title: "Webflow App", desc: "Apply Themal design systems to Webflow sites without writing code." },
              { title: "Drupal Module", desc: "Integrate design token management into Drupal's admin interface." },
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
      <SiteFooterBranding />
      <SiteFooter />
    </div>
  );
}
