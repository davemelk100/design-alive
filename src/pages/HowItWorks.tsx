import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import ThemalLogo from "../components/ThemalLogo";

export default function HowItWorks() {
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

        <div className="flex items-end gap-3 mb-8" style={{ color: "hsl(var(--foreground))" }}>
          <ThemalLogo className="h-10 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-light title-font" style={{ color: "hsl(var(--foreground))", lineHeight: ".75" }}>
            How It Works
          </h1>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Overview
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
              The editor manages 23 HSL CSS custom properties on <code className="font-mono">:root</code>. Pick any of the five primary colors (Brand, Secondary, Accent, Background, Foreground) and the system derives the remaining 18 tokens in real time — semantic colors, foregrounds, borders, and more. Lock up to four colors to preserve them during regeneration. Export a CSS snapshot or open a pull request to propose changes directly to the repo.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Color Derivation
            </h2>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
              When you change a primary color, <code className="font-mono">derivePaletteFromChange()</code> cascades updates through the full token set:
            </p>
            <ul className="text-[14px] leading-relaxed list-disc pl-5 space-y-2" style={{ color: "hsl(var(--foreground))" }}>
              <li><span className="font-medium">Brand</span> — Hue-shifts primary, secondary, muted, accent, border, and ring. Re-derives semantic colors: destructive (hue 0), success (hue 142), and warning (hue 45), each with calibrated saturation and lightness offsets.</li>
              <li><span className="font-medium">Secondary</span> — Shifts accent hue, updates border, re-derives semantic colors.</li>
              <li><span className="font-medium">Accent</span> — Derives accent-foreground, updates muted and border.</li>
              <li><span className="font-medium">Background</span> — Card and popover inherit the new value. All foregrounds recalculated via <code className="font-mono">fgForBg()</code> (optimal black or white). Border lightness adjusted ±9-12% from background.</li>
              <li><span className="font-medium">Foreground</span> — Card-foreground and popover-foreground inherit the new value.</li>
            </ul>
            <p className="text-[14px] leading-relaxed mt-3" style={{ color: "hsl(var(--foreground))" }}>
              Locked colors are excluded from all derivation calculations, so the system works around your choices.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Color Harmony
            </h2>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
              The Variations dropdown generates palettes using color theory. Four harmony schemes are available, each applying specific hue offsets from the brand color:
            </p>
            <ul className="text-[14px] leading-relaxed list-disc pl-5 space-y-1" style={{ color: "hsl(var(--foreground))" }}>
              <li><span className="font-medium">Complementary</span> — Secondary +180°, Accent +150°</li>
              <li><span className="font-medium">Analogous</span> — Secondary +30°, Accent -30°</li>
              <li><span className="font-medium">Triadic</span> — Secondary +120°, Accent +240°</li>
              <li><span className="font-medium">Split-Complementary</span> — Secondary +150°, Accent +210°</li>
            </ul>
            <p className="text-[14px] leading-relaxed mt-3" style={{ color: "hsl(var(--foreground))" }}>
              Secondary saturation is set to 85% of brand, accent to 90%. Lightness is slightly offset and clamped to 5-95%. After hue-shifting, the full derivation and contrast enforcement pipeline runs.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Random Palette Generation
            </h2>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
              The Refresh button generates a completely new palette. For each unlocked color:
            </p>
            <ul className="text-[14px] leading-relaxed list-disc pl-5 space-y-2" style={{ color: "hsl(var(--foreground))" }}>
              <li><span className="font-medium">Brand</span> — Random hue (0-360°), saturation 55-90%, lightness 35-60% (light mode) or 50-70% (dark mode).</li>
              <li><span className="font-medium">Secondary & Accent</span> — Hue offsets of 90-270° and 30-150° from brand, with randomized saturation and lightness.</li>
              <li><span className="font-medium">Background</span> — Light mode: 95-100% lightness (with a 30% chance of a dark 5-20% variant). Dark mode: 3-10% lightness. Derived from brand hue + 20° offset.</li>
              <li><span className="font-medium">Remaining tokens</span> — Muted, border, foregrounds, and semantic colors all derived automatically.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Accessibility Enforcement
            </h2>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
              Every foreground/background pair is enforced to a minimum 4.6:1 contrast ratio (exceeding WCAG AA's 4.5:1 requirement). The <code className="font-mono">autoAdjustContrast()</code> algorithm uses a multi-level fallback strategy:
            </p>
            <ol className="text-[14px] leading-relaxed list-decimal pl-5 space-y-2" style={{ color: "hsl(var(--foreground))" }}>
              <li><span className="font-medium">Brand vs Background</span> — Checks contrast between brand and background first. Adjusts the unlocked color's lightness in steps of 3 (up to 34 iterations) until the ratio passes.</li>
              <li><span className="font-medium">12 Contrast Pairs</span> — Iterates through all defined pairs (foreground/background, primary-foreground/primary, etc.). For each failing pair, adjusts the unlocked foreground lightness. If that fails, tries adjusting the background. Tries both directions (lighter and darker) to find the best fit.</li>
              <li><span className="font-medium">Final Cleanup</span> — Sets optimal foreground for background via <code className="font-mono">fgForBg()</code>, ensures card and popover foregrounds match, and fixes muted-foreground contrast.</li>
            </ol>
            <p className="text-[14px] leading-relaxed mt-3" style={{ color: "hsl(var(--foreground))" }}>
              After algorithmic enforcement, an optional axe-core audit scans the live DOM for any element-level contrast violations. Remaining issues trigger an animated fix sequence that scrolls to each element, highlights it, and iterates through lightness adjustments until the element passes.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Contrast Learning Loop
            </h2>
            <ol className="text-[14px] leading-relaxed list-decimal pl-5 space-y-3" style={{ color: "hsl(var(--foreground))" }}>
              <li>
                <span className="font-medium">Detection & Fix</span> — When a contrast correction is applied (either algorithmically or via the animated fix sequence), the system calls <code className="font-mono">saveContrastCorrection()</code>.
              </li>
              <li>
                <span className="font-medium">Knowledge Storage</span> — Each correction is saved to localStorage under <code className="font-mono">ds-contrast-knowledge</code>. A correction records the background hue range (±15°), background lightness range (±10%), the foreground key that was fixed, and the corrected HSL value. Up to 100 corrections are stored (FIFO).
              </li>
              <li>
                <span className="font-medium">Proactive Application</span> — When generating new palettes, <code className="font-mono">applyKnownCorrections()</code> runs before <code className="font-mono">autoAdjustContrast()</code>. If the new background falls within a previously-seen hue/lightness range and the foreground is unlocked, the known-good value is pre-applied.
              </li>
            </ol>
            <p className="text-[14px] leading-relaxed mt-3" style={{ color: "hsl(var(--foreground))" }}>
              This means the system gets smarter over time — palettes with similar backgrounds benefit from previously learned fixes, reducing the number of contrast violations before the audit even runs.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Card Style System
            </h2>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
              Four card presets control <code className="font-mono">--card-radius</code>, <code className="font-mono">--card-shadow</code>, <code className="font-mono">--card-border</code>, <code className="font-mono">--card-bg</code>, and <code className="font-mono">--card-backdrop</code>:
            </p>
            <ul className="text-[14px] leading-relaxed list-disc pl-5 space-y-1" style={{ color: "hsl(var(--foreground))" }}>
              <li><span className="font-medium">Liquid Glass</span> — 25% opacity background with 16px backdrop blur, creating a frosted-glass effect. 16px radius, 1px border.</li>
              <li><span className="font-medium">Solid Color</span> — Opaque background using the <code className="font-mono">--card</code> color. 12px radius, subtle shadow.</li>
              <li><span className="font-medium">Gradient</span> — 135° linear gradient flowing through brand, secondary, and accent colors.</li>
              <li><span className="font-medium">Border Only</span> — Transparent background with a 2px border. No shadow.</li>
            </ul>
            <p className="text-[14px] leading-relaxed mt-3" style={{ color: "hsl(var(--foreground))" }}>
              All properties are individually adjustable via sliders: shadow offset/blur/spread, border radius, border width, background opacity, backdrop blur, and gradient angle.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Typography System
            </h2>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
              Four typography presets control heading/body fonts, weights, sizes, line height, and letter spacing:
            </p>
            <ul className="text-[14px] leading-relaxed list-disc pl-5 space-y-1" style={{ color: "hsl(var(--foreground))" }}>
              <li><span className="font-medium">Modern</span> — Roboto 300 weight, 17px base, 1.5 line height.</li>
              <li><span className="font-medium">Classic</span> — Georgia headings (700), system-ui body (400), 1.6 line height.</li>
              <li><span className="font-medium">Compact</span> — System-ui, smaller 15px base, tighter 1.35 line height.</li>
              <li><span className="font-medium">Editorial</span> — Playfair Display headings (700), Georgia body, 19px base, negative heading letter spacing.</li>
            </ul>
            <p className="text-[14px] leading-relaxed mt-3" style={{ color: "hsl(var(--foreground))" }}>
              Google Fonts (Playfair Display, Space Grotesk, Inter) are loaded on demand when selected. Eleven font families are available. All properties are individually adjustable.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Alert Style System
            </h2>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
              Four alert presets control appearance across success, warning, error, and info variants:
            </p>
            <ul className="text-[14px] leading-relaxed list-disc pl-5 space-y-1" style={{ color: "hsl(var(--foreground))" }}>
              <li><span className="font-medium">Filled</span> — Solid semantic color background with contrasting text. 8px radius.</li>
              <li><span className="font-medium">Soft</span> — 12% opacity semantic color background with semantic color text.</li>
              <li><span className="font-medium">Outline</span> — Transparent background with a 2px semantic color border.</li>
              <li><span className="font-medium">Minimal</span> — No background or border, just a 3px left accent line.</li>
            </ul>
            <p className="text-[14px] leading-relaxed mt-3" style={{ color: "hsl(var(--foreground))" }}>
              Border radius, border width, and padding are adjustable via sliders. Properties are persisted as <code className="font-mono">--alert-radius</code>, <code className="font-mono">--alert-border-width</code>, and <code className="font-mono">--alert-padding</code>.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Interaction States
            </h2>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
              Four interaction style presets control hover, focus, and active states across the design system:
            </p>
            <ul className="text-[14px] leading-relaxed list-disc pl-5 space-y-1" style={{ color: "hsl(var(--foreground))" }}>
              <li><span className="font-medium">Subtle</span> — Gentle opacity and slight scale changes on hover.</li>
              <li><span className="font-medium">Elevated</span> — Shadow lift and upward translation on hover, ring on focus.</li>
              <li><span className="font-medium">Bold</span> — Background color shifts and stronger scale transforms.</li>
              <li><span className="font-medium">Minimal</span> — Underline and color change only, no motion.</li>
            </ul>
            <p className="text-[14px] leading-relaxed mt-3" style={{ color: "hsl(var(--foreground))" }}>
              Properties include hover opacity, scale, shadow, translate, transition duration, and focus ring width/offset. All are adjustable via sliders and persisted as CSS custom properties.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Persistence & Export
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
              All customizations persist in localStorage across reloads — colors, card style, typography, alert style, interaction states, and the contrast knowledge base. The Show CSS button generates a <code className="font-mono">{`:root { ... }`}</code> block with all current values. The Open PR button lets you select which sections to include (Colors, Card Style, Typography, Alerts, Interactions) and submits them as a GitHub pull request to the repo.
            </p>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Web Component
            </h2>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
              The editor is also available as a <code className="font-mono">&lt;theemel-editor&gt;</code> web component for use on WordPress, static sites, or any platform — no React knowledge required. A single script tag bundles React, the editor, and all styles into one self-contained file.
            </p>
            <pre className="rounded-lg p-4 text-[14px] overflow-x-auto mb-3" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
              <code>{`<script src="https://cdn.example.com/theemel-editor.js"></script>
<theemel-editor license-key="THEEMEL-XXXX-XXXX-XXXX"></theemel-editor>`}</code>
            </pre>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "hsl(var(--foreground))" }}>
              The custom element uses Shadow DOM for style isolation and maps HTML attributes to React props:
            </p>
            <ul className="text-[14px] leading-relaxed list-disc pl-5 space-y-1" style={{ color: "hsl(var(--foreground))" }}>
              <li><code className="font-mono">license-key</code> — License key to unlock premium features</li>
              <li><code className="font-mono">pr-endpoint-url</code> — URL for the PR creation endpoint</li>
              <li><code className="font-mono">accessibility-audit</code> — Enable/disable axe-core auditing (<code className="font-mono">"true"</code>/<code className="font-mono">"false"</code>)</li>
              <li><code className="font-mono">show-nav-links</code> — Show/hide documentation nav links</li>
              <li><code className="font-mono">show-header</code> — Show/hide the header bar</li>
              <li><code className="font-mono">upgrade-url</code> — Custom URL for the upgrade link</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[14px] font-medium uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Responsive Behavior
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
              The editor uses a mobile-first layout. On screens below 1024px (tablets and phones), the desktop navigation collapses into a hamburger menu with a bottom tray. Section content layouts switch from side-by-side to stacked at the 768px breakpoint.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
