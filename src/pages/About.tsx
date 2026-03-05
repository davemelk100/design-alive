import { Link } from "react-router-dom";
import SiteFooter, { SiteFooterBranding } from "../components/SiteFooter";
import ThemalLogo from "../components/ThemalLogo";

export default function About() {
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

        <div className="flex items-end gap-3 mb-3" style={{ color: "hsl(var(--foreground))" }}>
          <ThemalLogo className="h-10 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-light title-font" style={{ color: "hsl(var(--foreground))", lineHeight: ".75" }}>
            About
          </h1>
        </div>
        <p className="text-[14px] leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          A real-time design system editor for the modern web.
        </p>

        <div className="space-y-8 text-[14px] leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
          <section>
            <h2 className="text-xl font-medium mb-2">What is Themal?</h2>
            <p>
              Themal is a visual design system editor that lets you pick a brand color and watch every token update in real time. Customize typography, buttons, cards, and alerts - all while every foreground/background pair is checked against WCAG AA contrast standards. Export CSS custom properties, design tokens, or open a PR directly to your GitHub repository.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">How It Works</h2>
            <p>
              Start by choosing a primary brand color. Themal automatically derives a complete, harmonious palette - secondary, accent, background, foreground, and semantic colors - using perceptual color science. Every change is live. Every combination is accessibility-checked. When you're ready, export your theme as CSS custom properties, Tailwind config, or design tokens.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Features</h2>
            <p className="mb-2">All features are currently free during early access — no account required.</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Color picking and live derivation</li>
              <li>Random palette generation</li>
              <li>Color harmony schemes (complementary, analogous, triadic, split-complementary)</li>
              <li>Color locks - pin colors during regeneration</li>
              <li>Image-based palette extraction</li>
              <li>Card style, typography, and alert customization</li>
              <li>Independent dialog box and toast message styling</li>
              <li>Hover and active state customization</li>
              <li>Per-section CSS, Tailwind, and design token export</li>
              <li>Export palette as SVG, PNG, or text</li>
              <li>Shareable theme URLs</li>
              <li>Dark mode support</li>
              <li>WCAG AA contrast checking with auto-fix</li>
              <li>GitHub PR integration</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">For Developers</h2>
            <p>
              Themal is available as an npm package (<code className="px-1.5 py-0.5 rounded text-[13px]" style={{ backgroundColor: "hsl(var(--muted))" }}>@theemel/editor</code>) that you can embed in your own application. Pass a brand color, configure callbacks, and let your users customize their own design system. See the <Link to="/readme" className="underline hover:opacity-70 transition-opacity">Dev docs</Link> for integration details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Built By</h2>
            <p>
              Themal is a{" "}
              <a
                href="https://davemelk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-70 transition-opacity"
              >
                Melkonian Industries
              </a>{" "}
              production.
            </p>
          </section>
        </div>
      </div>
      <SiteFooterBranding />
      <SiteFooter />
    </div>
  );
}
