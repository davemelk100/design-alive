import { Link } from "react-router-dom";
import SiteFooter, { SiteFooterBranding } from "../components/SiteFooter";
import usePageMeta from "../hooks/usePageMeta";

export default function Accessibility() {
  usePageMeta({
    title: "Accessibility | Themal",
    description:
      "Themal's accessibility commitment. WCAG 2.1 Level AA compliance, built-in contrast enforcement, axe-core integration, keyboard navigation, and skip-to-content support.",
  });

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/editor"
          className="inline-flex items-center gap-1 text-[14px] font-medium mb-6 hover:opacity-70 transition-opacity"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          &larr; Back to Editor
        </Link>

        <h1 className="text-3xl sm:text-4xl font-light mb-2" style={{ color: "hsl(var(--foreground))" }}>
          Themal's Accessibility Commitment
        </h1>
        <p className="text-[14px] mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          Last updated: March 3, 2026
        </p>

        <div className="space-y-6 text-[14px] leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
          <section>
            <h2 className="text-xl font-medium mb-2">Our Commitment</h2>
            <p>Themal is committed to ensuring digital accessibility for all users. We strive for <strong>WCAG 2.1 Level AA compliance</strong> across our entire application. Accessibility is not an afterthought - it is a core part of how we build and a core feature of what our product helps you achieve.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Built-In Accessibility Features</h2>
            <p>Themal actively helps you build accessible design systems:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>WCAG AA contrast enforcement:</strong> The color editor automatically checks and enforces a minimum 4.5:1 contrast ratio between foreground and background color pairs, ensuring text readability.</li>
              <li><strong>Real-time contrast ratios:</strong> Contrast ratios are displayed live as you adjust colors, so you always know where you stand.</li>
              <li><strong>Accessible color palettes:</strong> Generated harmony schemes and palette suggestions are tested against AA contrast thresholds.</li>
              <li><strong>axe-core integration:</strong> Optional integration with the axe-core accessibility engine provides automated auditing of your design system output.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Standards We Follow</h2>
            <p>We strive to conform to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>WCAG 2.1 Level AA</strong> - Our target compliance level for all user-facing pages and interactive components.</li>
              <li><strong>WAI-ARIA 1.2</strong> - Proper use of ARIA roles, states, and properties for interactive elements like sliders, modals, and navigation.</li>
              <li><strong>Section 508</strong> - Compliance with U.S. federal accessibility standards.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">What We Do</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Semantic HTML structure with proper heading hierarchy</li>
              <li>Skip-to-content link for keyboard users</li>
              <li>Full keyboard navigability across all interactive elements</li>
              <li>Visible focus indicators on all focusable elements</li>
              <li>Appropriate color contrast for all text and UI elements</li>
              <li>ARIA labels on icon-only buttons and interactive elements</li>
              <li>Modal dialogs with proper focus trapping and ARIA attributes</li>
              <li>Responsive design that works across devices and zoom levels up to 200%</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Known Limitations</h2>
            <p>While we strive for full AA compliance, some areas may have limitations:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Third-party components (Clerk authentication UI, Stripe checkout) are governed by their respective accessibility policies.</li>
              <li>Dynamically loaded Google Fonts previews may briefly lack optimal contrast during transitions.</li>
              <li>Some color swatch previews intentionally display low-contrast combinations to demonstrate the contrast issue to users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Feedback</h2>
            <p>We welcome feedback on the accessibility of Themal. If you encounter any barriers or have suggestions for improvement, please contact us:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Email: <a href="mailto:accessibility@themalive.com" className="text-[14px] underline hover:opacity-70">accessibility@themalive.com</a></li>
            </ul>
            <p className="mt-2">We aim to respond to accessibility feedback within 5 business days and to resolve reported issues as quickly as possible.</p>
          </section>
        </div>
      </div>
      <SiteFooterBranding />
      <SiteFooter />
    </div>
  );
}
