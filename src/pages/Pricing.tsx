import { Link } from "react-router-dom";
import SiteFooter, { SiteFooterBranding } from "../components/SiteFooter";
import ThemalLogo from "../components/ThemalLogo";

const check = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[2px]">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const allFeatures = [
  "Color picking & live derivation",
  "Random palette generation (Refresh)",
  "Card style, typography, alerts customization",
  "Per-section CSS + Tailwind and Design Token export",
  "Shareable theme URLs",
  "Reset to defaults",
  "Dark mode support",
  "Color harmony schemes (complementary, analogous, triadic, split-complementary)",
  "Color locks - pin colors during regeneration",
  "Image-based palette extraction",
  "Export palette as SVG, PNG, or HEX/RGB/RGBA text",
  "GitHub PR integration",
  "WCAG AA accessibility audit with auto-fix",
  "Undo support for theme refreshes",
  "Hover & active state customization",
];

/* --- Pro / Test tiers commented out for now ---
const proFeatures = [
  "Everything in Free, plus:",
  "Color harmony schemes (complementary, analogous, triadic, split-complementary)",
  "Color locks - pin colors during regeneration",
  "Image-based palette extraction",
  "Export palette as SVG, PNG, or HEX/RGB/RGBA text",
  "GitHub PR integration",
  "WCAG AA accessibility audit with auto-fix",
  "Undo support for theme refreshes",
  "Hover & active state customization",
];
--- end commented out pricing --- */

export default function Pricing() {
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

        <div className="flex items-end gap-3 mb-3" style={{ color: "hsl(var(--foreground))" }}>
          <ThemalLogo className="h-10 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-light title-font" style={{ color: "hsl(var(--foreground))", lineHeight: ".75" }}>
            Pricing
          </h1>
        </div>
        <p className="text-[14px] leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          All features are currently free while we're in early access.
        </p>

        {/* Limited-time banner */}
        <div
          className="rounded-lg px-4 py-3 mb-8 text-[14px] font-medium"
          style={{
            backgroundColor: "hsl(var(--primary) / 0.1)",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--primary) / 0.25)",
          }}
        >
          Limited time: All Pro features are unlocked for free during early access. No account required.
        </div>

        <div className="max-w-md mx-auto">
          {/* Free tier — all features */}
          <div
            className="rounded-xl p-6 flex flex-col"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "2px solid hsl(var(--primary))",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                Free
              </h2>
              <span
                className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                Early Access
              </span>
            </div>
            <div className="mb-6">
              <span className="text-2xl font-semibold" style={{ color: "hsl(var(--foreground))" }}>$0</span>
              <span className="text-[14px] ml-1" style={{ color: "hsl(var(--muted-foreground))" }}>during early access</span>
            </div>
            <p className="text-[14px] mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Full access to every feature — no sign-up needed.
            </p>
            <ul className="space-y-3 flex-1">
              {allFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px]" style={{ color: "hsl(var(--foreground))" }}>
                  {check}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pro and Test tiers commented out for now */}
      </div>
      <SiteFooterBranding />
      <SiteFooter />
    </div>
  );
}
