import { Link } from "react-router-dom";

const check = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[2px]">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const freeFeatures = [
  "Color picking & live derivation",
  "Random palette generation (Refresh)",
  "Card style, typography, alerts customization",
  "Show / copy CSS",
  "Reset to defaults",
  "Dark mode support",
];

const proFeatures = [
  "Everything in Free, plus:",
  "Color harmony schemes (complementary, analogous, triadic, split-complementary)",
  "Color locks — pin colors during regeneration",
  "GitHub PR integration",
  "WCAG AA accessibility audit with auto-fix",
  "Undo support",
];

export default function Pricing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-[14px] font-medium mb-6 hover:opacity-70 transition-opacity"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          &larr; Back to Editor
        </Link>

        <h1 className="text-3xl sm:text-4xl font-light mb-3 title-font" style={{ color: "hsl(var(--foreground))" }}>
          Pricing
        </h1>
        <p className="text-[14px] leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          Start for free, upgrade when you need more.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free tier */}
          <div
            className="rounded-xl p-6 flex flex-col"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <h2 className="text-xl font-semibold mb-1" style={{ color: "hsl(var(--foreground))" }}>
              Free
            </h2>
            <p className="text-[14px] mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Everything you need to get started.
            </p>
            <ul className="space-y-3 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px]" style={{ color: "hsl(var(--foreground))" }}>
                  {check}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro tier */}
          <div
            className="rounded-xl p-6 flex flex-col"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "2px solid hsl(var(--primary))",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                Pro
              </h2>
              <span
                className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                Recommended
              </span>
            </div>
            <p className="text-[14px] mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Full power for professionals.
            </p>
            <ul className="space-y-3 flex-1">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px]" style={{ color: "hsl(var(--foreground))" }}>
                  {check}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://theemel.com/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
