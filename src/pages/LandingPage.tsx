import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ThemalLogo from "../components/ThemalLogo";
import { SiteFooterBranding } from "../components/SiteFooter";
import JsonLd from "../components/JsonLd";
import usePageMeta from "../hooks/usePageMeta";

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p
        className="text-[11px] font-medium uppercase tracking-wider mb-1 text-fg"
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
          className="text-xs font-mono leading-relaxed m-0 pr-10 whitespace-pre-wrap break-words text-fg"
        >
          {code}
        </pre>
        <button
          className="absolute top-3 right-3 p-1.5 rounded-md transition-opacity hover:opacity-70 cursor-pointer text-muted-foreground"
          style={{
            backgroundColor: "hsl(var(--foreground) / 0.08)",
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

const CODE_SNIPPET = `npm install @themal/editor`;


const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Themal",
  url: "https://themalive.com",
  logo: "https://themalive.com/themal-logo.png",
  description: "Interactive design system editor for the modern web.",
  foundingDate: "2025",
  founder: { "@type": "Organization", name: "Melkonian Industries", url: "https://davemelk.com" },
  contactPoint: { "@type": "ContactPoint", email: "privacy@themalive.com", contactType: "customer support" },
};

const SOFTWARE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Themal",
  url: "https://themalive.com",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  description:
    "Interactive design system editor. Pick colors, generate harmony palettes, enforce WCAG AA contrast, customize typography and interaction states, and export CSS custom properties in real time.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0",
    highPrice: "50",
    offerCount: 3,
    offers: [
      { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: "Pro Monthly", price: "9", priceCurrency: "USD", billingIncrement: "MON" },
      { "@type": "Offer", name: "Pro Yearly", price: "50", priceCurrency: "USD", billingIncrement: "ANN" },
    ],
  },
  featureList: [
    "Real-time color picking with live preview",
    "Random palette generation",
    "Color harmony schemes",
    "WCAG AA contrast enforcement",
    "Typography system with Google Fonts",
    "Card style presets",
    "Alert style presets",
    "Interaction state presets",
    "CSS and design token export",
    "GitHub PR integration",
    "Web component support",
  ],
};

export default function LandingPage() {
  usePageMeta({
    title: "Themal | Real-Time Design System Editor",
    description:
      "Interactive design system editor. Pick colors, generate harmony palettes, enforce WCAG AA contrast, and export CSS custom properties in real time. Free to use.",
    canonicalPath: "/",
  });

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
      className="flex flex-col bg-page landing-defaults"
      style={{
        height: "100dvh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
      }}
    >
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={SOFTWARE_SCHEMA} />

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
            className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-fg"
          >
            Real Designs. Real Time. Real Code.
          </h1>

          <p
            className="text-base sm:text-lg max-w-xl font-light leading-relaxed text-fg"
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

          {/* Framework logos */}
          <div className="flex flex-col items-center gap-3 mt-4">
            <p
              className="text-[11px] font-medium uppercase tracking-widest text-fg"
            >
              Works with
            </p>
            <div className="flex items-center gap-5 sm:gap-7 flex-wrap justify-center">
              {[
                {
                  name: "React",
                  svg: (
                    <svg viewBox="-11.5 -10.232 23 20.463" className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor">
                      <circle r="2.05" />
                      <g fill="none" stroke="currentColor" strokeWidth="1">
                        <ellipse rx="11" ry="4.2" />
                        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                      </g>
                    </svg>
                  ),
                },
                {
                  name: "Vue",
                  svg: (
                    <svg viewBox="0 0 261.76 226.69" className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor">
                      <path d="M161.096.001l-30.224 52.35L100.647.001H0l130.872 226.688L261.76.001z" opacity=".5" />
                      <path d="M161.096.001l-30.224 52.35L100.647.001H52.346l78.526 136.01L209.398.001z" />
                    </svg>
                  ),
                },
                {
                  name: "Angular",
                  svg: (
                    <svg viewBox="0 0 250 250" className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor">
                      <polygon points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2" opacity=".5" />
                      <polygon points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2" />
                      <path d="M125,52.1L66.8,182.6h0h21.7h0l11.7-29.2h49.4l11.7,29.2h0h21.7h0L125,52.1L125,52.1L125,52.1L125,52.1 L125,52.1z M142,135.4H108l17-40.9L142,135.4z" fill="hsl(var(--background))" />
                    </svg>
                  ),
                },
                {
                  name: "Svelte",
                  svg: (
                    <svg viewBox="0 0 98.1 118" className="w-7 h-8 sm:w-9 sm:h-10" fill="currentColor">
                      <path d="M91.8 15.6C80.9-.7 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 1.9 43.9c-1.3 7.3-.2 14.8 3.3 21.3-2.4 3.6-4 7.6-4.7 11.8-1.6 8.9.5 18.1 5.7 25.4 11 16.3 32.6 20.3 48.2 10.4l27.5-17.6c7.5-4.7 12.7-12.4 14.2-21.1 1.3-7.3.2-14.8-3.3-21.3 2.4-3.6 4-7.6 4.7-11.8 1.7-9-.4-18.2-5.7-25.4" opacity=".5" />
                      <path d="M40.9 103.9c-8.9 2.3-18.2-1.2-23.4-8.7-3.2-4.4-4.4-9.9-3.5-15.3l.6-3.1 1-3 2.8 1.8 3.1 1.7 3 1.5-.3 1.5c-.5 2.7-.2 5.4 1 7.8 1.8 3.5 5.5 5.6 9.5 5.4l1.6-.3 27.5-17.5c2.5-1.6 4.2-4.1 4.8-7 .5-2.7.2-5.4-1-7.8-1.8-3.5-5.5-5.7-9.5-5.5l-10.5 6.7c-1.6 1.1-3.4 1.8-5.3 2.2-8.9 2.3-18.2-1.2-23.4-8.7-3.2-4.4-4.4-9.9-3.5-15.3.9-5 3.8-9.4 8.1-12.1L51 9.3c1.6-1.1 3.4-1.8 5.3-2.2 8.9-2.3 18.2 1.2 23.4 8.7 3.2 4.4 4.4 9.9 3.5 15.3l-.6 3.1-1 3-2.8-1.8-3.1-1.7-3-1.5.3-1.5c.5-2.7.2-5.4-1-7.8-1.8-3.5-5.5-5.6-9.5-5.4l-1.6.3L33.5 35.4c-2.5 1.6-4.2 4.1-4.8 7-.5 2.7-.2 5.4 1 7.8 1.8 3.5 5.5 5.7 9.5 5.5l10.5-6.7c1.6-1.1 3.4-1.8 5.3-2.2 8.9-2.3 18.2 1.2 23.4 8.7 3.2 4.4 4.4 9.9 3.5 15.3-.9 5-3.8 9.4-8.1 12.1l-27.5 17.6c-1.6 1.1-3.4 1.8-5.3 2.2" />
                    </svg>
                  ),
                },
                {
                  name: "Next.js",
                  svg: (
                    <svg viewBox="0 0 180 180" className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor">
                      <mask id="nextmask" style={{ maskType: "alpha" }}>
                        <circle cx="90" cy="90" r="90" />
                      </mask>
                      <g mask="url(#nextmask)">
                        <circle cx="90" cy="90" r="90" />
                        <path d="M149.508 157.52L69.142 54H54v72.13h12.114V69.259l73.885 95.606a90.093 90.093 0 009.509-7.345z" fill="url(#next_g1)" />
                        <rect x="115" y="54" width="12" height="72" fill="url(#next_g2)" />
                      </g>
                      <defs>
                        <linearGradient id="next_g1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                          <stop stopColor="hsl(var(--background))" />
                          <stop offset="1" stopColor="hsl(var(--background))" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="next_g2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                          <stop stopColor="hsl(var(--background))" />
                          <stop offset="1" stopColor="hsl(var(--background))" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  ),
                },
                {
                  name: "Astro",
                  svg: (
                    <svg viewBox="0 0 85 107" className="w-7 h-8 sm:w-9 sm:h-10" fill="currentColor">
                      <path d="M27.5 91.5c-5-7.4-3.2-17.3 3.5-23.5 0 6.3 3.2 10.4 8.6 12.2 5.8 1.9 11.8 1.5 17.2-1.5.6 3.2.2 6.5-1.2 9.4-1.8 3.5-5 6-8.9 7-6.2 1.5-13 .2-19.2-3.6z" opacity=".7" />
                      <path d="M59.5 73.5L42.5 0l-1.2 0C33.8 24.4 26.4 48.8 19.1 73.3c6.3-4.2 13.4-6 20.7-5.3 7.4.7 14.2 3.5 19.7 5.5z" />
                    </svg>
                  ),
                },
                {
                  name: "Tailwind",
                  svg: (
                    <svg viewBox="0 0 54 33" className="w-9 h-7 sm:w-11 sm:h-8" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" />
                    </svg>
                  ),
                },
              ].map((fw) => (
                <div
                  key={fw.name}
                  className="flex flex-col items-center gap-1.5 opacity-70 hover:opacity-90 transition-opacity text-fg"
                  title={fw.name}
                >
                  {fw.svg}
                  <span className="text-[11px] sm:text-[12px] font-light tracking-wider">{fw.name}</span>
                </div>
              ))}
            </div>
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
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </section>

      {/* Dev power */}
      <section
        className="relative z-10 flex-shrink-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-24"
        style={{ minHeight: "100dvh", scrollSnapAlign: "start" }}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-5 sm:gap-10">
          <h2
            className="text-xl sm:text-3xl font-light tracking-tight text-fg"
          >
            A developer's design system, alive.
          </h2>
          <p
            className="text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed text-muted-foreground"
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
                  className="text-sm font-medium uppercase tracking-wider mb-2 text-fg"
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm font-light leading-relaxed text-muted-foreground"
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
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </section>

      {/* Promo */}
      <section
        className="relative z-10 flex-shrink-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-24"
        style={{ minHeight: "100dvh", scrollSnapAlign: "start" }}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-5 sm:gap-10">
          <h2
            className="text-xl sm:text-3xl font-light tracking-tight text-fg"
          >
            Not just for developers.
          </h2>
          <p
            className="text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed text-muted-foreground"
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
                  className="text-sm font-medium uppercase tracking-wider mb-2 text-fg"
                >
                  {item.role}
                </h3>
                <p
                  className="text-sm font-light leading-relaxed text-muted-foreground"
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
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </section>

      {/* Footer */}
      <div
        className="relative z-10 flex-shrink-0"
        style={{
          scrollSnapAlign: "start",
        }}
      >
        <SiteFooterBranding />
      </div>

    </div>
  );
}
