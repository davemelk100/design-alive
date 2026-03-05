import { Link } from "react-router-dom";
import ThemalLogo from "../components/ThemalLogo";
import SiteFooter, { SiteFooterBranding } from "../components/SiteFooter";

const features = [
  {
    title: "Real-Time Theming",
    desc: "Tweak colors, typography, and spacing\u2014see every change reflected instantly across your entire design system.",
  },
  {
    title: "Accessibility Built In",
    desc: "Contrast ratios and WCAG compliance checks run automatically so your designs are usable by everyone.",
  },
  {
    title: "Export Anywhere",
    desc: "Generate production-ready CSS variables, Tailwind configs, or design tokens for any framework in one click.",
  },
];

export default function LandingPage() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <img
          src="/themal-hero-t.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-contain object-left pointer-events-none"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            WebkitMaskSize: "100% 300%",
            maskSize: "100% 300%",
            animation: "heroWipeDown 60s ease-in-out infinite",
          }}
        />
        <img
          src="/themal-hero-t.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-contain object-right pointer-events-none"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            WebkitMaskSize: "100% 300%",
            maskSize: "100% 300%",
            animation: "heroWipeUp 60s ease-in-out infinite",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <ThemalLogo className="w-48 sm:w-64 lg:w-80" />

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Design Systems, In Real Time, with real code.
          </h1>

          <p
            className="text-base sm:text-lg max-w-xl font-light leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Themal is a visual design-system editor that lets you craft, preview,
            and export production-ready themes without writing a single line of
            CSS.
          </p>

          <Link
            to="/editor"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "hsl(var(--brand))",
              color: "hsl(var(--brand-foreground, var(--background)))",
            }}
          >
            Open the Editor
          </Link>
        </div>
      </section>

      {/* Feature highlights */}
      <section
        className="border-t"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center sm:text-left">
              <h2
                className="text-base font-medium mb-2"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {f.title}
              </h2>
              <p
                className="text-sm font-light leading-relaxed"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <SiteFooterBranding />
      <SiteFooter />
    </div>
  );
}
