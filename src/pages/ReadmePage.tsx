import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";

export default function ReadmePage() {
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
            @theemel/editor
          </h1>
        </div>

        <p className="text-[14px] leading-relaxed mb-8" style={{ color: "hsl(var(--foreground))" }}>
          Interactive design system editor for React apps. Pick colors, generate harmony palettes, enforce WCAG AA contrast, customize typography and interaction states, and export CSS custom properties — all in real time.
        </p>

        {/* Install */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3" style={{ color: "hsl(var(--foreground))" }}>Install</h2>
          <pre className="rounded-lg p-4 text-[14px] overflow-x-auto" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>npm install @theemel/editor</code>
          </pre>
          <p className="text-[14px] mt-2" style={{ color: "hsl(var(--muted-foreground))" }}>
            Peer dependencies: <code className="font-mono text-[14px]">react</code> and <code className="font-mono text-[14px]">react-dom</code> (v18 or v19).
          </p>
          <p className="text-[14px] mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Optional peers: <code className="font-mono text-[14px]">axe-core</code> (accessibility auditing), <code className="font-mono text-[14px]">lucide-react</code> (icon previews).
          </p>
        </section>

        {/* Quick Start */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3" style={{ color: "hsl(var(--foreground))" }}>Quick Start</h2>
          <pre className="rounded-lg p-4 text-[14px] overflow-x-auto" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`import { DesignSystemEditor } from '@theemel/editor';
import '@theemel/editor/style.css';

function App() {
  return <DesignSystemEditor />;
}`}</code>
          </pre>
          <p className="text-[14px] mt-2" style={{ color: "hsl(var(--muted-foreground))" }}>
            The editor writes CSS custom properties (HSL values) to <code className="font-mono text-[14px]">:root</code>, so it works with any framework that consumes CSS variables.
          </p>
        </section>

        {/* Props */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3" style={{ color: "hsl(var(--foreground))" }}>Props</h2>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
            <table className="w-full text-[14px]">
              <thead>
                <tr style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
                  <th className="text-left px-4 py-2 font-medium">Prop</th>
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">Default</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody style={{ color: "hsl(var(--foreground))" }}>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">prEndpointUrl</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">URL for PR creation endpoint. PR button hidden if omitted.</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">accessibilityAudit</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">true</td>
                  <td className="px-4 py-2">Enable axe-core color contrast auditing.</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">onChange</td>
                  <td className="px-4 py-2 font-mono text-xs">{`(colors: Record<string, string>) => void`}</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">Callback on every color change with the full color map.</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">onExport</td>
                  <td className="px-4 py-2 font-mono text-xs">{`(css: string) => void`}</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">Override built-in CSS modal. Receives the generated CSS string.</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">className</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">Additional CSS class for the wrapper element.</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">showNavLinks</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">true</td>
                  <td className="px-4 py-2">Show "How It Works", "README", and "Pricing" nav links.</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">licenseKey</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">License key to unlock premium features.</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">signInUrl</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">URL for the sign-in prompt in premium gate modals.</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">showHeader</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">true</td>
                  <td className="px-4 py-2">Show the sticky header bar. Set false for embedded/plugin usage.</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">upgradeUrl</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">Custom URL for the "Upgrade" link shown on gated features.</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">headerRight</td>
                  <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">Content rendered at the far right of the header (e.g. auth buttons).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3" style={{ color: "hsl(var(--foreground))" }}>Usage Examples</h2>

          <h3 className="text-[14px] font-medium mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Basic — color picker only</h3>
          <pre className="rounded-lg p-4 text-[14px] overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor accessibilityAudit={false} />`}</code>
          </pre>

          <h3 className="text-[14px] font-medium mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>With PR creation</h3>
          <pre className="rounded-lg p-4 text-[14px] overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor prEndpointUrl="/api/create-design-pr" />`}</code>
          </pre>

          <h3 className="text-[14px] font-medium mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Listen for changes</h3>
          <pre className="rounded-lg p-4 text-[14px] overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  onChange={(colors) => {
    console.log('Brand color:', colors['--brand']);
  }}
/>`}</code>
          </pre>

          <h3 className="text-[14px] font-medium mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Custom export handler</h3>
          <pre className="rounded-lg p-4 text-[14px] overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  onExport={(css) => {
    navigator.clipboard.writeText(css);
  }}
/>`}</code>
          </pre>
        </section>

        {/* Exported Utilities */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3" style={{ color: "hsl(var(--foreground))" }}>Exported Utilities</h2>
          <pre className="rounded-lg p-4 text-[14px] overflow-x-auto" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`import {
  hslStringToHex,    // "210 50% 40%" → "#336699"
  hexToHslString,    // "#336699" → "210.0 50.0% 40.0%"
  contrastRatio,     // WCAG contrast ratio between two HSL strings
  fgForBg,           // Best foreground (black/white) for a background HSL
  EDITABLE_VARS,     // Array of { key, label } token definitions
  HARMONY_SCHEMES,   // ['Complementary', 'Analogous', ...]
  applyStoredThemeColors,      // Restore persisted theme from localStorage
  applyStoredCardStyle,        // Restore card style from localStorage
  applyStoredTypography,       // Restore typography from localStorage
  applyStoredAlertStyle,       // Restore alert style from localStorage
  applyStoredInteractionStyle, // Restore interaction style from localStorage
} from '@theemel/editor';`}</code>
          </pre>
        </section>

        {/* Embedded / Headless */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3" style={{ color: "hsl(var(--foreground))" }}>Embedded Usage</h2>
          <pre className="rounded-lg p-4 text-[14px] overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  showHeader={false}
  showNavLinks={false}
/>`}</code>
          </pre>
          <p className="text-[14px] mt-2" style={{ color: "hsl(var(--muted-foreground))" }}>
            Hides the sticky header and nav links for embedding inside another app or plugin.
          </p>
        </section>

        {/* Mobile */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3" style={{ color: "hsl(var(--foreground))" }}>Mobile Friendly</h2>
          <p className="text-[14px] leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
            Themal is fully responsive — you can tweak your design system and open a PR straight from your phone. Color pickers, typography controls, and the PR button all work on mobile viewports, so you can iterate on the go.
          </p>
        </section>

        {/* Web Component */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3" style={{ color: "hsl(var(--foreground))" }}>Web Component</h2>
          <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
            For WordPress, static sites, or any non-React platform, use the <code className="font-mono text-[14px]">&lt;theemel-editor&gt;</code> web component. A single script tag bundles everything — no build step required.
          </p>
          <pre className="rounded-lg p-4 text-[14px] overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<script src="https://cdn.example.com/theemel-editor.js"></script>
<theemel-editor license-key="THEEMEL-XXXX-XXXX-XXXX"></theemel-editor>`}</code>
          </pre>
          <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
            Supported attributes:
          </p>
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "hsl(var(--border))" }}>
            <table className="w-full text-[14px]">
              <thead>
                <tr style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
                  <th className="text-left px-4 py-2 font-medium">Attribute</th>
                  <th className="text-left px-4 py-2 font-medium">Maps to prop</th>
                </tr>
              </thead>
              <tbody style={{ color: "hsl(var(--foreground))" }}>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">license-key</td>
                  <td className="px-4 py-2 font-mono text-xs">licenseKey</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">pr-endpoint-url</td>
                  <td className="px-4 py-2 font-mono text-xs">prEndpointUrl</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">accessibility-audit</td>
                  <td className="px-4 py-2 font-mono text-xs">accessibilityAudit</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">show-nav-links</td>
                  <td className="px-4 py-2 font-mono text-xs">showNavLinks</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">show-header</td>
                  <td className="px-4 py-2 font-mono text-xs">showHeader</td>
                </tr>
                <tr className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-2 font-mono text-xs">upgrade-url</td>
                  <td className="px-4 py-2 font-mono text-xs">upgradeUrl</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[14px] mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            The web component uses Shadow DOM for style isolation. React, ReactDOM, and all editor styles are bundled into the single JS file.
          </p>
        </section>

        {/* Tailwind Scoping */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3" style={{ color: "hsl(var(--foreground))" }}>Tailwind Scoping</h2>
          <p className="text-[14px] leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
            The editor ships pre-compiled CSS via <code className="font-mono text-[14px]">@theemel/editor/style.css</code>. Styles are scoped using Tailwind's <code className="font-mono text-[14px]">{`important: '.ds-editor'`}</code> so they don't conflict with your app's styles. The root element is automatically wrapped in <code className="font-mono text-[14px]">{`<div className="ds-editor">`}</code>.
          </p>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
