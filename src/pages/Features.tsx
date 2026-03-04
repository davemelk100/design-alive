import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";

const features = [
  {
    version: "0.6",
    items: [
      "Buttons section — renamed from Interactions, split into Types (color swatches) and Interactions (premium controls) side-by-side",
      "Button color swatches — read-only swatches for Primary, Secondary, Destructive, Muted, Success, Warning, and Brand",
      "PremiumGate section variant — gated content now renders disabled (dimmed, non-interactive) instead of hidden",
      "Nav icons — section navigation items now have inline icons for visual alignment",
      "Legal pages — Privacy Policy, Cookies Policy, Terms & Conditions, and Accessibility page",
      "Accessibility commitment — WCAG 2.1 Level AA compliance statement",
      "Cookie consent banner — first-visit notification with localStorage persistence",
      "Contact form — Netlify Forms integration with honeypot spam protection",
      "Test suite — Vitest + Testing Library + jsdom with smoke tests",
      "Lighthouse CI — automated performance, accessibility, SEO, and best practices auditing",
    ],
  },
  {
    version: "0.5",
    items: [
      "Image-based palette extraction — upload a PNG/JPG and derive a full color palette via k-means clustering",
      "Subscription management and upgrade flow with Stripe checkout",
      "Sign-in link added to premium feature gates",
      "Clerk proxy fix for local development",
    ],
  },
  {
    version: "0.4",
    items: [
      "Premium feature gating with license key support",
      "Color harmony schemes — Complementary, Analogous, Triadic, Split-Complementary",
      "Color lock — pin individual tokens during palette generation",
      "Undo last palette change",
      "Pricing page with Free and Pro tiers",
    ],
  },
  {
    version: "0.3",
    items: [
      "Typography system with 4 presets — Modern, Classic, Compact, Editorial",
      "Alert style system with 4 presets — Filled, Soft, Outline, Minimal",
      "Interaction state presets — Subtle, Elevated, Bold, Minimal",
      "GitHub PR integration — open design system PRs directly from the editor",
      "Navigation links between editor, docs, and pricing pages",
      "Restored stored typography on load",
    ],
  },
  {
    version: "0.2",
    items: [
      "Card style system with 4 presets — Liquid Glass, Solid Color, Gradient, Border Only",
      "Typography presets with system font option",
      "CSS export for all sections — colors, card, typography, alerts, interactions",
      "Section-level reset controls",
      "Package renamed to @theemel/editor",
    ],
  },
  {
    version: "0.1",
    items: [
      "23 HSL CSS custom properties for full design system coverage",
      "Real-time color picking with live preview",
      "SVG elements update dynamically — inline SVGs using currentColor and CSS variables respond to theme changes in real time",
      "Random palette generation with smart derivation",
      "WCAG AA contrast enforcement (4.6:1 ratio)",
      "Contrast learning loop — saves corrections to localStorage",
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

        <div className="flex items-end gap-3 mb-8">
          <img src="/themal-logo-wide.svg" alt="Themal" className="h-10 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-light title-font" style={{ color: "hsl(var(--foreground))", lineHeight: ".75" }}>
            Features
          </h1>
        </div>

        <p className="text-[14px] leading-relaxed mb-10" style={{ color: "hsl(var(--foreground))" }}>
          A running log of everything shipped in the Themal design system editor.
        </p>

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
      <SiteFooter />
    </div>
  );
}
