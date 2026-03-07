import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ThemalLogo from "../components/ThemalLogo";
import SiteFooter, { SiteFooterBranding } from "../components/SiteFooter";

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p
        className="text-[11px] font-medium uppercase tracking-wider mb-1"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {label}
      </p>
      <div
        className="relative rounded-lg p-4"
        style={{
          backgroundColor: "hsl(var(--foreground) / 0.05)",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <pre
          className="text-[13px] font-mono leading-relaxed m-0 pr-10 whitespace-pre-wrap break-words"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {code}
        </pre>
        <button
          className="absolute top-3 right-3 p-1.5 rounded-md transition-opacity hover:opacity-70 cursor-pointer"
          style={{
            backgroundColor: "hsl(var(--foreground) / 0.08)",
            color: "hsl(var(--muted-foreground))",
            border: "none",
          }}
          onClick={() => {
            navigator.clipboard.writeText(code).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

/* Default theme values so editor changes don't bleed into the landing page */
const DEFAULT_THEME: Record<string, string> = {
  "--brand": "199.2 18.8% 26.1%",
  "--background": "0 0% 87.1%",
  "--foreground": "0 0% 0%",
  "--card": "0 0% 87.1%",
  "--card-foreground": "0 0% 0%",
  "--popover": "0 0% 87.1%",
  "--popover-foreground": "0 0% 0%",
  "--primary": "199.2 83.2% 48.0%",
  "--primary-foreground": "199.2 40% 16%",
  "--secondary": "199.2 16.1% 27.3%",
  "--secondary-foreground": "0 0% 100%",
  "--muted": "199.2 17.9% 95.3%",
  "--muted-foreground": "0 0% 38%",
  "--accent": "199.2 63.8% 49.5%",
  "--accent-foreground": "0 0% 0%",
  "--destructive": "0 20.7% 35.0%",
  "--destructive-foreground": "0 0% 100%",
  "--success": "142 16.9% 35.0%",
  "--success-foreground": "0 0% 100%",
  "--warning": "45 19.7% 40.0%",
  "--warning-foreground": "0 0% 99%",
  "--border": "0 0.0% 78.1%",
  "--input": "214.3 31.8% 91.4%",
  "--ring": "199.2 83.2% 53.3%",
  "--radius": "0.5rem",
  "--font-heading": "Roboto, sans-serif",
  "--font-body": "Roboto, sans-serif",
  "--font-size-base": "17px",
  "--font-weight-heading": "300",
  "--font-weight-body": "300",
  "--line-height": "1.5",
  "--letter-spacing": "0em",
  "--letter-spacing-heading": "0em",
  "--card-radius": "16px",
  "--card-shadow": "0px 4px 16px 0px rgba(0,0,0,0.08)",
  "--card-border": "none",
  "--card-backdrop": "blur(16px)",
};

const CODE_SNIPPET = `npm install @themal/editor`;


export default function LandingPage() {
  const [zoomDone, setZoomDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    const img = imgRef.current;
    if (!el || !img) return;
    const vh = el.clientHeight;
    const progress = el.scrollTop / vh;
    // Grow uniformly: 1x at top, 2x after one pane, 3x after two, etc.
    const s = 1 + progress;
    img.style.transform = `scale(${s})`;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <div
      ref={scrollRef}
      className="flex flex-col"
      style={{
        ...DEFAULT_THEME,
        backgroundColor: "hsl(var(--background))",
        height: "100dvh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
      } as React.CSSProperties}
    >
      {/* Background image - fixed, grows with scroll */}
      <div
        className="pointer-events-none"
        onAnimationEnd={() => setZoomDone(true)}
        style={{
          position: "fixed",
          top: "4rem",
          left: 0,
          width: "100%",
          height: "calc(100dvh - 4rem)",
          zIndex: 0,
          animation: zoomDone
            ? "heroPulse 6s ease-in-out infinite"
            : "heroZoom 16s ease-in-out forwards",
          transformOrigin: "center center",
        }}
      >
        <img
          ref={imgRef}
          src="/themal-hero-t.svg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            transformOrigin: "center top",
            transition: "transform 0.6s ease-out",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative flex-shrink-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16" style={{ minHeight: "100dvh", scrollSnapAlign: "start" }}>
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <ThemalLogo className="w-48 sm:w-64 lg:w-80" />

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Real Designs. Real Time. Real Code.
          </h1>

          <p
            className="text-base sm:text-lg max-w-xl font-light leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Plug Themal into your app. Design your elements on screen. Open a pull request right from the editor.
          </p>

          <div className="w-full max-w-md">
            <CodeBlock label="Install" code={CODE_SNIPPET} />
          </div>

          <Link
            to="/editor"
            className="inline-flex items-center justify-center transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "hsl(var(--brand))",
              color: "hsl(var(--brand-foreground, var(--background)))",
              padding: "var(--btn-py, 8px) var(--btn-px, 16px)",
              fontSize: "var(--btn-font-size, 14px)",
              fontWeight: "var(--btn-font-weight, 300)",
              borderRadius: "var(--btn-radius, 12px)",
              boxShadow: "var(--btn-shadow, 0px 1px 3px 0px rgba(0,0,0,0.1))",
              borderWidth: "var(--btn-border-width, 0px)",
              borderStyle: "solid",
              borderColor: "hsl(var(--border))",
            }}
          >
            Open the Editor
          </Link>
        </div>

        {/* Scroll indicator */}
        <button
          className="absolute bottom-6 left-0 right-0 mx-auto w-fit z-10 animate-bounce cursor-pointer bg-transparent border-none p-2"
          onClick={() => {
            const el = scrollRef.current;
            if (!el) return;
            const vh = el.clientHeight;
            const nextPane = Math.floor(el.scrollTop / vh + 1) * vh;
            el.scrollTo({ top: nextPane, behavior: "smooth" });
          }}
          aria-label="Scroll down"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </section>

      {/* Dev power */}
      <section
        className="relative z-10 flex-shrink-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-24"
        style={{ backgroundColor: "transparent", minHeight: "100dvh", scrollSnapAlign: "start" }}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-5 sm:gap-10">
          <h2
            className="text-xl sm:text-3xl font-light tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            A developer's design system, alive.
          </h2>
          <p
            className="text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Themal is a visual editor that plugs directly into your codebase.
            Adjust colors, typography, spacing, buttons, cards, and interaction
            states, then export production-ready CSS variables, Tailwind
            configs, or W3C design tokens. When you're happy with the result,
            open a pull request without leaving the browser. No more translating
            cumbersome Figma files into code. Design and ship from the same
            place.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center mt-4 sm:mt-6">
            {[
              { title: "Live Preview", detail: "Every change renders instantly across your full component library." },
              { title: "Export Anything", detail: "CSS variables, SCSS, Tailwind configs, or W3C design tokens in one click." },
              { title: "PR from the Editor", detail: "Push a design-system update straight to your repo. No context switching." },
              { title: "Accessibility Built In", detail: "Contrast ratios and WCAG checks run automatically as you design." },
            ].map((item) => (
              <div key={item.title}>
                <h3
                  className="text-sm font-medium uppercase tracking-wider mb-2"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm font-light leading-relaxed"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <Link
              to="/editor"
              className="inline-flex items-center justify-center transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "hsl(var(--brand))",
                color: "hsl(var(--brand-foreground, var(--background)))",
                padding: "8px 24px",
                fontSize: "14px",
                fontWeight: 300,
                borderRadius: "var(--btn-radius, 12px)",
                boxShadow: "var(--btn-shadow, 0px 1px 3px 0px rgba(0,0,0,0.1))",
              }}
            >
              Open the Editor
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          className="absolute bottom-6 left-0 right-0 mx-auto w-fit z-10 animate-bounce cursor-pointer bg-transparent border-none p-2"
          onClick={() => {
            const el = scrollRef.current;
            if (!el) return;
            const vh = el.clientHeight;
            const nextPane = Math.floor(el.scrollTop / vh + 1) * vh;
            el.scrollTo({ top: nextPane, behavior: "smooth" });
          }}
          aria-label="Scroll down"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </section>

      {/* Promo */}
      <section
        className="relative z-10 flex-shrink-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-24"
        style={{ backgroundColor: "transparent", minHeight: "100dvh", scrollSnapAlign: "start" }}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-5 sm:gap-10">
          <h2
            className="text-xl sm:text-3xl font-light tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Not just for developers.
          </h2>
          <p
            className="text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Product owners can present design options to stakeholders in real
            time. Marketing teams can explore brand directions without waiting on
            a dev cycle. Leadership can review and approve visual changes on the
            spot. Vendors and agencies can collaborate on shared design systems
            without exchanging static mockups. Themal puts the creative process
            in the hands of the people making the decisions. Save countless
            hours lost to design reviews, feedback rounds, and rework between
            development, design, and business teams.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center">
            {[
              { role: "Product Owners", detail: "Present comps to stakeholders without filing a ticket." },
              { role: "Marketing Teams", detail: "Explore brand directions and campaign themes on the fly." },
              { role: "Leadership", detail: "Review and approve visual changes in real time." },
              { role: "Vendor Collaborations", detail: "Share a live design system instead of static mockups." },
            ].map((item) => (
              <div key={item.role}>
                <h3
                  className="text-sm font-medium uppercase tracking-wider mb-2"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {item.role}
                </h3>
                <p
                  className="text-sm font-light leading-relaxed"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <Link
              to="/editor"
              className="inline-flex items-center justify-center transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "hsl(var(--brand))",
                color: "hsl(var(--brand-foreground, var(--background)))",
                padding: "8px 24px",
                fontSize: "14px",
                fontWeight: 300,
                borderRadius: "var(--btn-radius, 12px)",
                boxShadow: "var(--btn-shadow, 0px 1px 3px 0px rgba(0,0,0,0.1))",
              }}
            >
              Open the Editor
            </Link>
          </div>
        </div>

        {/* Scroll to top */}
        <button
          className="absolute bottom-6 left-0 right-0 mx-auto w-fit z-10 animate-bounce cursor-pointer bg-transparent border-none p-2"
          onClick={() => {
            scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </section>

      {/* Footer */}
      <div
        className="relative z-10 flex-shrink-0 [&>*]:border-t-0 [&_footer]:!bg-transparent"
        style={{
          scrollSnapAlign: "start",
          backgroundColor: "transparent",
        }}
      >
        <SiteFooterBranding />
        <SiteFooter sticky={false} />
      </div>

    </div>
  );
}
