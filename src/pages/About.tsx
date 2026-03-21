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
        text: "Themal is a drop-in design system editor for any web app. Available as a React component or a framework-agnostic web component. Pick a brand color and watch every token update in real time across colors, typography, buttons, cards, alerts, inputs, and tables. A built-in WCAG AA contrast auditor checks every foreground/background pair automatically. Export as CSS custom properties, design tokens, or open a PR directly to GitHub.",
      },
    },
    {
      "@type": "Question",
      name: "How does Themal work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Install @themal/editor from npm, import the component and stylesheet, and render <DesignSystemEditor /> with your brand colors. The editor writes CSS custom properties that any framework can read. All styles are scoped under .ds-editor so it won't touch your app's CSS. Typography inherits from the host page automatically.",
      },
    },
    {
      "@type": "Question",
      name: "Is Themal free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The core editor is free and open source (MIT). Premium features like color harmony schemes, image palette extraction, custom fonts, and interaction state styling are available with a Pro subscription at $10/month or $50/year.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use Themal with frameworks other than React?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The @themal/editor npm package is for React apps. For WordPress, static sites, or any non-React platform, use the <themal-editor> web component via a single script tag — no build step required.",
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
          <h1 className="text-3xl sm:text-4xl font-normal title-font text-fg" style={{ lineHeight: ".75" }}>
            About
          </h1>
        </div>
        <p className="text-sm leading-relaxed mb-8 text-muted-foreground">
          A drop-in design system editor for any web app. Open source, MIT licensed.
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-fg">
          <section>
            <h2 className="text-xl font-medium mb-2">What is Themal?</h2>
            <p>
              Themal is a React component that gives any web app a complete design system editor. Pick a brand color and watch every token update in real time across seven sections: colors, typography, buttons, cards, alerts, inputs, and tables. A built-in WCAG AA contrast auditor (~2KB) checks every foreground/background pair automatically and suggests fixes when violations are found.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">How It Works</h2>
            <p className="mb-3">
              Install <code className="px-1.5 py-0.5 rounded text-xs bg-muted-surface">@themal/editor</code> from npm, import the component and stylesheet, and render it with your brand colors. The editor writes CSS custom properties (HSL values) that any framework can consume. All styles are scoped under <code className="px-1.5 py-0.5 rounded text-xs bg-muted-surface">.ds-editor</code> — it won't override your app's fonts, colors, or layout.
            </p>
            <p>
              Typography inherits from the host page automatically. The rem-based font scale lets consuming apps control sizing by setting <code className="px-1.5 py-0.5 rounded text-xs bg-muted-surface">font-size</code> on the root element. Zero runtime dependencies beyond React.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 mt-2">
              <div>
                <p className="font-medium mb-1.5 text-muted-foreground uppercase tracking-wider text-xs">Core (free)</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Live color picking and palette derivation</li>
                  <li>Random palette generation</li>
                  <li>Color locks — pin colors during regeneration</li>
                  <li>Typography controls for headings and body</li>
                  <li>Button, card, alert, input, and table styling</li>
                  <li>Dialog and toast message customization</li>
                  <li>Per-section CSS and design token export</li>
                  <li>Dark mode support</li>
                  <li>WCAG AA contrast auditing with one-click Fix All</li>
                  <li>Full-site theming via applyToRoot</li>
                  <li>GitHub PR integration</li>
                  <li>Shareable theme URLs</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1.5 text-muted-foreground uppercase tracking-wider text-xs">Premium</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Color harmony schemes (complementary, analogous, triadic, split-complementary)</li>
                  <li>Image-based palette extraction</li>
                  <li>Custom Google Fonts</li>
                  <li>Hover, focus, and active state styling</li>
                  <li>Typography interaction states</li>
                  <li>Undo/redo (up to 10 levels)</li>
                  <li>Palette export as SVG, PNG, or text</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-2">For Developers</h2>
            <p className="mb-3">
              Available as <code className="px-1.5 py-0.5 rounded text-xs bg-muted-surface">@themal/editor</code> on npm. Pass your brand colors via the <code className="px-1.5 py-0.5 rounded text-xs bg-muted-surface">defaultColors</code> prop, wire up an <code className="px-1.5 py-0.5 rounded text-xs bg-muted-surface">onChange</code> callback, and ship. The README includes an AI scaffold prompt you can use to generate a complete integration for your stack.
            </p>
            <p>
              For WordPress, static sites, or any non-React platform, use the <code className="px-1.5 py-0.5 rounded text-xs bg-muted-surface">&lt;themal-editor&gt;</code> web component via a single script tag — no build step required. See the <Link to="/readme" className="underline hover:opacity-70 transition-opacity">Dev docs</Link> for full integration details.
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
