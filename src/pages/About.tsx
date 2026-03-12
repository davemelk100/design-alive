import { Link } from "react-router-dom";
import ThemalLogo from "../components/ThemalLogo";
import JsonLd from "../components/JsonLd";
import usePageMeta from "../hooks/usePageMeta";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Themal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Themal is a visual design system editor that lets you pick a brand color and watch every token update in real time. Customize typography, buttons, cards, and alerts while every foreground/background pair is checked against WCAG AA contrast standards. Export CSS custom properties, design tokens, or open a PR directly to your GitHub repository.",
      },
    },
    {
      "@type": "Question",
      name: "How does Themal work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start by choosing a primary brand color. Themal automatically derives a complete, harmonious palette using perceptual color science. Every change is live. Every combination is accessibility-checked. When you're ready, export your theme as CSS custom properties, Tailwind config, or design tokens.",
      },
    },
    {
      "@type": "Question",
      name: "Is Themal free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All features are currently free during early access, with no account required. A Pro plan at $9/month or $50/year adds advanced features like color harmony schemes, image palette extraction, and GitHub PR integration.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use Themal with frameworks other than React?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The @themal/editor npm package is for React apps. For all other frameworks (Vue, Svelte, Astro, Next.js, WordPress, Shopify, and more), use the <themal-editor> web component, which bundles React internally and works anywhere you can load a script tag.",
      },
    },
    {
      "@type": "Question",
      name: "Who built Themal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Themal is a Melkonian Industries production.",
      },
    },
  ],
};

export default function About() {
  usePageMeta({
    title: "About Themal | Real-Time Design System Editor",
    description:
      "Learn what Themal is, how it works, and what features it offers. A real-time design system editor with WCAG AA contrast enforcement, color harmony schemes, and CSS export.",
  });

  return (
    <div className="flex-1 flex flex-col bg-page">
      <JsonLd data={FAQ_SCHEMA} />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-end gap-3 mb-3 text-fg">
          <ThemalLogo className="h-10 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-light title-font text-fg" style={{ lineHeight: ".75" }}>
            About
          </h1>
        </div>
        <p className="text-sm leading-relaxed mb-8 text-muted">
          A real-time design system editor for the modern web.
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-fg">
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
              Themal is available as an npm package (<code className="px-1.5 py-0.5 rounded text-xs bg-muted-surface">@themal/editor</code>) that you can embed in your own application. Pass a brand color, configure callbacks, and let your users customize their own design system. See the <Link to="/readme" className="underline hover:opacity-70 transition-opacity">Dev docs</Link> for integration details.
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
    </div>
  );
}
