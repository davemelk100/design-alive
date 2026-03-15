import ThemalLogo from "../components/ThemalLogo";
import JsonLd from "../components/JsonLd";
import usePageMeta from "../hooks/usePageMeta";

const TECH_ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "@themal/editor - Developer Documentation",
  description:
    "Installation, props, usage examples, web component setup, and framework compatibility for the @themal/editor npm package.",
  url: "https://themalive.com/readme",
  author: { "@type": "Organization", name: "Themal", url: "https://themalive.com" },
  about: [
    { "@type": "Thing", name: "React component library" },
    { "@type": "Thing", name: "Design system editor" },
    { "@type": "Thing", name: "CSS custom properties" },
    { "@type": "Thing", name: "Web component" },
  ],
  proficiencyLevel: "Beginner",
};

export default function ReadmePage() {
  usePageMeta({
    title: "Developer Docs | @themal/editor",
    description:
      "Install @themal/editor in React, Vue, Svelte, Next.js, Astro, WordPress, or Shopify. Props reference, usage examples, web component setup, and exported utilities.",
  });

  return (
    <div className="flex-1 flex flex-col bg-page">
      <JsonLd data={TECH_ARTICLE_SCHEMA} />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-fg">
        <div className="flex items-end gap-3 mb-8 text-fg">
          <ThemalLogo className="h-10 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-light title-font text-fg" style={{ lineHeight: ".75" }}>
            @themal/editor
          </h1>
        </div>

        <p className="text-sm leading-relaxed mb-8 text-fg">
          Interactive design system editor for React apps. Pick colors, generate harmony palettes, enforce WCAG AA contrast, customize typography and interaction states, and export CSS custom properties - all in real time.
        </p>

        {/* Install */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Install</h2>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>npm install @themal/editor</code>
          </pre>
          <p className="text-sm mt-2 text-muted-foreground">
            Peer dependencies: <code className="font-mono text-sm">react</code> and <code className="font-mono text-sm">react-dom</code> (v18 or v19).
          </p>
          <p className="text-sm mt-1 text-muted-foreground">
            WCAG AA contrast auditing is built in with zero additional dependencies. Optionally install <code className="font-mono text-sm">lucide-react</code> for icon previews.
          </p>
        </section>

        {/* Quick Start */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Quick Start</h2>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`import { DesignSystemEditor } from '@themal/editor';
import '@themal/editor/style.css';

function App() {
  return <DesignSystemEditor />;
}`}</code>
          </pre>
          <p className="text-sm mt-2 text-muted-foreground">
            The editor writes CSS custom properties (HSL values) to <code className="font-mono text-sm">:root</code>, so it works with any framework that consumes CSS variables.
          </p>
        </section>

        {/* Props */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Props</h2>
          <div className="overflow-x-auto rounded-lg border border-theme">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
                  <th className="text-left px-4 py-2 font-medium">Prop</th>
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">Default</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-fg">
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">github</td>
                  <td className="px-4 py-2 font-mono text-xs">GitHubConfig</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">GitHub integration config. Enables client-side PR creation via OAuth. No backend needed. See GitHub Integration below.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">prEndpointUrl</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Legacy: URL for a custom server-side PR endpoint. Use <code className="font-mono text-xs">github</code> instead for zero-backend setup.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">accessibilityAudit</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">true</td>
                  <td className="px-4 py-2">Enable built-in WCAG AA contrast auditing.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">onChange</td>
                  <td className="px-4 py-2 font-mono text-xs">{`(colors: Record<string, string>) => void`}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Callback on every color change with the full color map.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">onExport</td>
                  <td className="px-4 py-2 font-mono text-xs">{`(css: string) => void`}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Override built-in CSS modal. Receives the generated CSS string.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">className</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Additional CSS class for the wrapper element.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">showNavLinks</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">true</td>
                  <td className="px-4 py-2">Show "How It Works", "README", and "Pricing" nav links.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">licenseKey</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">License key to unlock premium features.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">signInUrl</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">URL for the sign-in prompt in premium gate modals.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">showHeader</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">true</td>
                  <td className="px-4 py-2">Show the sticky header bar. Set false for embedded/plugin usage.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">upgradeUrl</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Custom URL for the "Upgrade" link shown on gated features.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">headerRight</td>
                  <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Content rendered at the far right of the header (e.g. auth buttons).</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">topNav</td>
                  <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Custom top navigation. When provided, replaces the built-in nav links entirely.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">aboutUrl</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">URL for the About page link in header navigation.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">customIcons</td>
                  <td className="px-4 py-2 font-mono text-xs">{"CustomIcon[]"}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Custom icons to display in the Icons preview section. Each entry needs <code className="font-mono text-xs">name</code> and <code className="font-mono text-xs">icon</code> (a React component).</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">iconMode</td>
                  <td className="px-4 py-2 font-mono text-xs">{`"append" | "replace"`}</td>
                  <td className="px-4 py-2 font-mono text-xs">"append"</td>
                  <td className="px-4 py-2">"append" adds custom icons after built-ins. "replace" hides built-ins and shows only custom icons.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">showLogo</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">true</td>
                  <td className="px-4 py-2">Show the Themal logo in the header. Set false for white-label or plugin usage.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">showSectionNav</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">true</td>
                  <td className="px-4 py-2">Show the sticky section navigation bar (Colors, Buttons, Cards, etc.).</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">defaultColors</td>
                  <td className="px-4 py-2 font-mono text-xs">{`Record<string, string>`}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Default color values keyed by CSS variable name. "Reset theme to default" restores these instead of the Themal defaults.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">defaultTypography</td>
                  <td className="px-4 py-2 font-mono text-xs">{`Partial<TypographyState>`}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Default typography state to restore on reset. Shows an "App Default" option in font dropdowns.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">onAiGenerate</td>
                  <td className="px-4 py-2 font-mono text-xs">{`(prompt: string) => Promise<AiGenerateResult>`}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">AI theme generation callback. When provided, an "AI Generate" button appears in Global Actions.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">devMode</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">false</td>
                  <td className="px-4 py-2">Show a "Purge Storage" button that clears all Themal localStorage keys.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">sidebarLinks</td>
                  <td className="px-4 py-2 font-mono text-xs">{`{ to: string; label: string }[]`}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Navigation links to display in the left sidebar.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">sidebarExtra</td>
                  <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">Custom content rendered at the bottom of the left sidebar.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">applyToRoot</td>
                  <td className="px-4 py-2 font-mono text-xs">boolean</td>
                  <td className="px-4 py-2 font-mono text-xs">false</td>
                  <td className="px-4 py-2">Mirror CSS custom properties to :root for full-site theming. Shows a developer prompt with integration CSS.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">onAiPaletteMap</td>
                  <td className="px-4 py-2 font-mono text-xs">{`(prompt: string) => Promise<Record<string, string>>`}</td>
                  <td className="px-4 py-2">-</td>
                  <td className="px-4 py-2">AI palette mapping callback. When provided and the aiPaletteMapping flag is enabled, an "AI Map" button appears in the scan confirmation modal.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Usage Examples</h2>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Basic - color picker only</h3>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor accessibilityAudit={false} />`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">With GitHub PR integration</h3>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  githubConfig={{
    clientId: "Iv1.abc123",
    repo: "your-org/your-repo",
  }}
/>`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">With premium features</h3>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  licenseKey="THEMAL-XXXX-XXXX-XXXX"
  upgradeUrl="/pricing"
  signInUrl="/sign-in"
/>`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Listen for changes</h3>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  onChange={(colors) => {
    console.log('Brand color:', colors['--brand']);
  }}
/>`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Custom export handler</h3>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  onExport={(css) => {
    navigator.clipboard.writeText(css);
  }}
/>`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Custom top navigation</h3>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  topNav={
    <>
      <a href="/dashboard" className="ds-nav-link">Dashboard</a>
      <a href="/settings" className="ds-nav-link">Settings</a>
      <a href="/docs" className="ds-nav-link">Docs</a>
    </>
  }
/>`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Full-site theming</h3>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-2" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor applyToRoot />`}</code>
          </pre>
          <p className="text-sm mb-3 text-muted-foreground">
            When <code className="font-mono text-sm">applyToRoot</code> is enabled, the editor mirrors all CSS variables to <code className="font-mono text-sm">:root</code>, scans the host page to detect its color palette, and shows a banner with a "View CSS" button. The modal provides a tailored, copyable CSS snippet so your entire site responds to theme changes:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`/* Add to your global stylesheet */
body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
a {
  color: hsl(var(--brand));
}
/* ... more rules based on your detected palette */`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 mt-6 text-muted-foreground">Scoped Color Utilities</h3>
          <p className="text-sm mb-3 text-fg">
            The editor provides scoped utility classes for text and surface colors inside <code className="font-mono text-sm">.ds-editor</code>.
            Modal labels use <code className="font-mono text-sm">ds-text-subtle</code> (foreground at 60% opacity) to guarantee contrast on any surface.
            Primary action buttons use brand colors. The <code className="font-mono text-sm">ds-text-muted</code> class uses <code className="font-mono text-sm">--muted-foreground</code> which
            may not contrast on all surfaces — prefer <code className="font-mono text-sm">ds-text-subtle</code> for labels inside modals and cards.
          </p>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Embedded / headless</h3>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor showHeader={false} showNavLinks={false} />`}</code>
          </pre>
        </section>

        {/* GitHub Integration */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">GitHub Integration</h2>
          <p className="text-sm leading-relaxed mb-3 text-fg">
            The editor can open GitHub pull requests directly from the browser. Users click "Connect GitHub", authorize via OAuth, and the editor creates branches, commits CSS changes, and returns a compare URL. No backend required from the consuming app.
          </p>
          <p className="text-sm leading-relaxed mb-3 text-fg">
            If neither <code className="font-mono text-sm">github</code> nor <code className="font-mono text-sm">prEndpointUrl</code> is provided, the PR button is hidden entirely.
          </p>

          <h3 className="text-sm font-medium mb-2 mt-6 text-muted-foreground">Public mode (recommended for most users)</h3>
          <p className="text-sm leading-relaxed mb-3 text-fg">
            Uses Themal's hosted OAuth proxy for the token exchange. The user authenticates with their own GitHub account, and the editor calls the GitHub API directly from the browser using their token. The only thing that passes through the proxy is the OAuth authorization code (exchanged for a token). No CSS content or repository data ever touches Themal's servers.
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  githubConfig={{
    clientId: "Iv1.abc123",        // Your GitHub OAuth App client ID
    repo: "your-org/your-repo",    // Target repository
    filePath: "src/globals.css",   // CSS file to update (default)
    baseBranch: "main",            // Branch to PR against (default)
  }}
/>`}</code>
          </pre>
          <p className="text-sm leading-relaxed mb-2 text-fg">
            Setup steps:
          </p>
          <ol className="text-sm leading-relaxed list-decimal pl-5 space-y-1 mb-4 text-fg">
            <li>Create a <a href="https://github.com/settings/applications/new" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">GitHub OAuth App</a>. Set the authorization callback URL to <code className="font-mono text-sm">https://themalive.com/.netlify/functions/github-oauth/callback</code>.</li>
            <li>Copy the Client ID (starts with <code className="font-mono text-sm">Iv1.</code>) and pass it as <code className="font-mono text-sm">github.clientId</code>.</li>
            <li>That's it. No backend, no server-side token, no environment variables needed in your app.</li>
          </ol>

          <h3 className="text-sm font-medium mb-2 mt-6 text-muted-foreground">Enterprise mode (self-hosted, for corporate environments)</h3>
          <p className="text-sm leading-relaxed mb-3 text-fg">
            For organizations using GitHub Enterprise Server or requiring that no credentials pass through external services, the entire flow can be self-hosted. You deploy your own OAuth proxy (a single serverless function that exchanges an authorization code for a token) and register your own GitHub App with fine-grained permissions.
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  githubConfig={{
    clientId: "Iv1.your-ghe-app",
    repo: "internal-org/design-system",
    oauthProxyUrl: "https://internal-tools.yourcompany.com/github-oauth",
    apiBaseUrl: "https://github.yourcompany.com/api/v3",
    webBaseUrl: "https://github.yourcompany.com",
  }}
/>`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 mt-4 text-muted-foreground">Enterprise setup steps</h3>
          <ol className="text-sm leading-relaxed list-decimal pl-5 space-y-2 mb-4 text-fg">
            <li>
              <span className="font-medium">Register a GitHub App</span> on your GitHub Enterprise Server instance. Use a GitHub App (not an OAuth App) for fine-grained permissions. Grant only <code className="font-mono text-sm">Contents: Read and write</code> on the specific repositories you want Themal to target. This avoids the broad <code className="font-mono text-sm">repo</code> scope that OAuth Apps require.
            </li>
            <li>
              <span className="font-medium">Deploy the OAuth proxy.</span> It is a single function (~30 lines) that exchanges an authorization code for a token by calling your GHE instance's token endpoint with the client secret. Deploy it behind your corporate firewall. The proxy source is available in the Themal repo at <code className="font-mono text-sm">netlify/functions/github-oauth.ts</code>.
            </li>
            <li>
              <span className="font-medium">Set the callback URL</span> in your GitHub App to <code className="font-mono text-sm">{"https://<your-proxy-host>/callback"}</code>.
            </li>
            <li>
              <span className="font-medium">Configure the editor</span> with your <code className="font-mono text-sm">clientId</code>, <code className="font-mono text-sm">oauthProxyUrl</code>, <code className="font-mono text-sm">apiBaseUrl</code>, and <code className="font-mono text-sm">webBaseUrl</code>.
            </li>
          </ol>

          <h3 className="text-sm font-medium mb-2 mt-6 text-muted-foreground">Security model</h3>
          <ul className="text-sm leading-relaxed list-disc pl-5 space-y-2 mb-4 text-fg">
            <li><span className="font-medium">Token ownership.</span> Each user authenticates with their own GitHub account. The editor stores the OAuth token in <code className="font-mono text-sm">localStorage</code> on their browser. No shared service account or static token is involved.</li>
            <li><span className="font-medium">Proxy scope.</span> The OAuth proxy only handles the code-to-token exchange. All GitHub API calls (reading files, creating branches, committing) happen directly from the browser to the GitHub API. No CSS content or repository data passes through the proxy.</li>
            <li><span className="font-medium">Fine-grained permissions.</span> Enterprise deployments using GitHub Apps can scope permissions to specific repositories and grant only <code className="font-mono text-sm">Contents: Read and write</code>. Public deployments using OAuth Apps request <code className="font-mono text-sm">repo</code> scope (GitHub's limitation for OAuth Apps).</li>
            <li><span className="font-medium">Token lifecycle.</span> GitHub OAuth tokens do not expire. Users can disconnect from the editor (clears <code className="font-mono text-sm">localStorage</code>) or revoke access from their GitHub Settings at any time. If a token is revoked, the editor detects the 401 and prompts re-authentication.</li>
            <li><span className="font-medium">Self-hostable.</span> In enterprise mode, no traffic leaves your network. The proxy runs behind your firewall, the GitHub API calls go to your GHE instance, and the editor runs on your domain under your CSP headers.</li>
          </ul>

          <h3 className="text-sm font-medium mb-2 mt-6 text-muted-foreground">github prop reference</h3>
          <div className="overflow-x-auto rounded-lg border mb-4 border-theme">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
                  <th className="text-left px-4 py-2 font-medium">Property</th>
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">Default</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-fg">
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">clientId</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">required</td>
                  <td className="px-4 py-2">GitHub OAuth App or GitHub App client ID. Safe to expose in client code.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">repo</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2">required</td>
                  <td className="px-4 py-2">Target repository in <code className="font-mono text-xs">"owner/repo"</code> format.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">filePath</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2 font-mono text-xs">"src/globals.css"</td>
                  <td className="px-4 py-2">Path to the CSS file containing the <code className="font-mono text-xs">@layer base {"{"} :root {"{"} ... {"}"} {"}"}</code> block.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">baseBranch</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2 font-mono text-xs">"main"</td>
                  <td className="px-4 py-2">Branch to create PRs against.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">oauthProxyUrl</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2 font-mono text-xs" style={{ fontSize: "10px" }}>themalive.com proxy</td>
                  <td className="px-4 py-2">Token exchange proxy URL. Override for self-hosted enterprise deployments.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">apiBaseUrl</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2 font-mono text-xs">api.github.com</td>
                  <td className="px-4 py-2">GitHub API base URL. Set for GitHub Enterprise Server.</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">webBaseUrl</td>
                  <td className="px-4 py-2 font-mono text-xs">string</td>
                  <td className="px-4 py-2 font-mono text-xs">github.com</td>
                  <td className="px-4 py-2">GitHub web base URL. Set for GitHub Enterprise Server.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-sm font-medium mb-2 mt-6 text-muted-foreground">How it works</h3>
          <ol className="text-sm leading-relaxed list-decimal pl-5 space-y-1 mb-4 text-fg">
            <li>User clicks "Open PR" in the editor.</li>
            <li>If not connected, a "Connect GitHub" button appears. Clicking it opens a popup to GitHub's OAuth authorization page.</li>
            <li>After the user authorizes, the popup exchanges the authorization code for a token via the proxy and passes it back to the editor via <code className="font-mono text-sm">postMessage</code>.</li>
            <li>The editor stores the token in <code className="font-mono text-sm">localStorage</code> and shows the section selector.</li>
            <li>On submit, the editor fetches the target CSS file from the repo, merges the updated CSS variables into the <code className="font-mono text-sm">@layer base {"{"} :root {"{"} ... {"}"} {"}"}</code> block, creates a new branch, commits the change, and opens the GitHub compare URL in a new tab.</li>
            <li>The user reviews the diff and creates the PR on GitHub.</li>
          </ol>

          <h3 className="text-sm font-medium mb-2 mt-6 text-muted-foreground">CSS variables by section</h3>
          <p className="text-sm leading-relaxed mb-2 text-fg">
            The PR includes CSS custom properties for whichever sections the user selected:
          </p>
          <ul className="text-sm leading-relaxed list-disc pl-5 space-y-1 mb-4 text-fg">
            <li><span className="font-medium">colors</span> — <code className="font-mono text-sm">--brand</code>, <code className="font-mono text-sm">--primary</code>, <code className="font-mono text-sm">--accent</code>, <code className="font-mono text-sm">--foreground</code>, <code className="font-mono text-sm">--background</code>, <code className="font-mono text-sm">--border</code>, <code className="font-mono text-sm">--muted</code>, <code className="font-mono text-sm">--muted-foreground</code>, <code className="font-mono text-sm">--destructive</code>, <code className="font-mono text-sm">--success</code>, <code className="font-mono text-sm">--warning</code>, and their foreground pairs</li>
            <li><span className="font-medium">typography</span> — <code className="font-mono text-sm">--font-heading</code>, <code className="font-mono text-sm">--font-body</code>, <code className="font-mono text-sm">--font-size-base</code>, <code className="font-mono text-sm">--font-weight-heading</code>, <code className="font-mono text-sm">--font-weight-body</code>, <code className="font-mono text-sm">--line-height</code>, <code className="font-mono text-sm">--letter-spacing</code>, <code className="font-mono text-sm">--letter-spacing-heading</code></li>
            <li><span className="font-medium">card</span> — <code className="font-mono text-sm">--card-radius</code>, <code className="font-mono text-sm">--card-shadow</code>, <code className="font-mono text-sm">--card-border</code>, <code className="font-mono text-sm">--card-backdrop</code></li>
            <li><span className="font-medium">alerts</span> — <code className="font-mono text-sm">--alert-radius</code>, <code className="font-mono text-sm">--alert-border-width</code>, <code className="font-mono text-sm">--alert-padding</code></li>
            <li><span className="font-medium">interactions</span> — <code className="font-mono text-sm">--hover-opacity</code>, <code className="font-mono text-sm">--hover-scale</code>, <code className="font-mono text-sm">--active-scale</code>, <code className="font-mono text-sm">--transition-duration</code>, <code className="font-mono text-sm">--focus-ring-width</code>, <code className="font-mono text-sm">--focus-ring-color</code></li>
          </ul>

          <h3 className="text-sm font-medium mb-2 mt-6 text-muted-foreground">Legacy: custom PR endpoint</h3>
          <p className="text-sm leading-relaxed mb-3 text-fg">
            The <code className="font-mono text-sm">prEndpointUrl</code> prop is still supported for apps that want full control over the server-side PR logic. When provided, the editor POSTs <code className="font-mono text-sm">{`{ css, sections }`}</code> to your endpoint and expects <code className="font-mono text-sm">{`{ url }`}</code> back. See the <code className="font-mono text-sm">prEndpointUrl</code> row in the Props table above.
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-3" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`// Request:  POST { css: ":root { ... }", sections: ["colors", ...] }
// Response: { url: "https://github.com/owner/repo/compare/main...branch" }

<DesignSystemEditor prEndpointUrl="/api/create-design-pr" />`}</code>
          </pre>
          <p className="text-sm leading-relaxed mb-4 text-fg">
            If both <code className="font-mono text-sm">github</code> and <code className="font-mono text-sm">prEndpointUrl</code> are provided, <code className="font-mono text-sm">github</code> takes precedence.
          </p>
        </section>

        {/* Exported Utilities */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Exported Utilities</h2>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`import {
  // Color utilities
  hslStringToHex,    // "210 50% 40%" → "#336699"
  hexToHslString,    // "#336699" → "210.0 50.0% 40.0%"
  contrastRatio,     // WCAG contrast ratio between two HSL strings
  fgForBg,           // Best foreground (black/white) for a background HSL
  EDITABLE_VARS,     // Array of { key, label } token definitions
  HARMONY_SCHEMES,   // ['Complementary', 'Analogous', ...]
  applyStoredThemeColors,      // Restore persisted theme from localStorage

  // Persistence utilities
  applyStoredCardStyle,        // Restore card style from localStorage
  applyStoredTypography,       // Restore typography from localStorage
  applyStoredAlertStyle,       // Restore alert style from localStorage
  applyStoredInteractionStyle, // Restore interaction style from localStorage

  // Shareable URL utilities
  serializeThemeState,         // Encode full theme state as base64
  deserializeThemeState,       // Decode base64 back to theme state

  // Export utilities
  generateDesignTokens,        // W3C Design Token JSON
  exportPaletteAsText,         // HEX, RGB, or RGBA text
  exportPaletteAsSvg,          // SVG string
  exportPaletteAsPng,          // PNG Blob

  // Custom font utilities
  getCustomFonts,              // Load custom fonts from localStorage
  addCustomFont,               // Validate & add a Google Font
  removeCustomFont,            // Remove a custom font
  initCustomFonts,             // Re-register fonts on startup

  // License utilities
  validateLicenseKey,          // Validate a THEMAL key
  generateLicenseKey,          // Generate a valid key

  // GitHub PR utilities
  createDesignPr,              // Create a PR via GitHub API
  startOAuthFlow,              // Start GitHub OAuth popup
  getStoredAuth,               // Retrieve stored GitHub auth
  clearAuth,                   // Clear stored GitHub auth
  validateStoredToken,         // Validate token against GitHub

  // Premium components & hooks
  LicenseProvider,             // Context provider
  useLicense,                  // Hook: { isValid, isPremium }
  PremiumGate,                 // Gate component

  // Feature flags
  FeatureFlag,                 // Conditional rendering by flag
  FEATURE_FLAGS,               // Current flag values

  // Host style scanner
  scanHostStyles,              // Scan host page DOM for colors
  mapPaletteToTokens,          // Map detected palette to tokens
  buildIntegrationCss,         // Generate integration CSS snippet
} from '@themal/editor';`}</code>
          </pre>
        </section>

        {/* Embedded / Headless */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Embedded Usage</h2>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<DesignSystemEditor
  showHeader={false}
  showNavLinks={false}
/>`}</code>
          </pre>
          <p className="text-sm mt-2 text-muted-foreground">
            Hides the sticky header and nav links for embedding inside another app or plugin.
          </p>
        </section>

        {/* Mobile */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Mobile Friendly</h2>
          <p className="text-sm leading-relaxed text-fg">
            Themal is fully responsive - you can tweak your design system and open a PR straight from your phone. Color pickers, typography controls, and the PR button all work on mobile viewports, so you can iterate on the go.
          </p>
        </section>

        {/* Web Component */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Web Component</h2>
          <p className="text-sm leading-relaxed mb-3 text-fg">
            For WordPress, static sites, or any non-React platform, use the <code className="font-mono text-sm">&lt;themal-editor&gt;</code> web component. A single script tag bundles everything - no build step required.
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<script src="https://themalive.com/themal-editor.js"></script>
<themal-editor license-key="THEMAL-XXXX-XXXX-XXXX"></themal-editor>`}</code>
          </pre>
          <p className="text-sm leading-relaxed mb-3 text-fg">
            Supported attributes:
          </p>
          <div className="overflow-x-auto rounded-lg border border-theme">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
                  <th className="text-left px-4 py-2 font-medium">Attribute</th>
                  <th className="text-left px-4 py-2 font-medium">Maps to prop</th>
                </tr>
              </thead>
              <tbody className="text-fg">
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">license-key</td>
                  <td className="px-4 py-2 font-mono text-xs">licenseKey</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">pr-endpoint-url</td>
                  <td className="px-4 py-2 font-mono text-xs">prEndpointUrl</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">accessibility-audit</td>
                  <td className="px-4 py-2 font-mono text-xs">accessibilityAudit</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">show-nav-links</td>
                  <td className="px-4 py-2 font-mono text-xs">showNavLinks</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">show-header</td>
                  <td className="px-4 py-2 font-mono text-xs">showHeader</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">upgrade-url</td>
                  <td className="px-4 py-2 font-mono text-xs">upgradeUrl</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">sign-in-url</td>
                  <td className="px-4 py-2 font-mono text-xs">signInUrl</td>
                </tr>
                <tr className="border-t border-theme">
                  <td className="px-4 py-2 font-mono text-xs">about-url</td>
                  <td className="px-4 py-2 font-mono text-xs">aboutUrl</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-3 text-muted-foreground">
            The web component uses Shadow DOM for style isolation. React, ReactDOM, and all editor styles are bundled into the single JS file.
          </p>
        </section>

        {/* Framework Compatibility */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Framework Compatibility</h2>
          <p className="text-sm leading-relaxed mb-3 text-fg">
            The <code className="font-mono text-sm">@themal/editor</code> npm package is for React apps. For all other frameworks, use the <code className="font-mono text-sm">&lt;themal-editor&gt;</code> web component — it bundles React internally and works anywhere you can load a script tag.
          </p>

          <h3 className="text-sm font-medium mb-2 mt-4 text-muted-foreground">Vue 3</h3>
          <p className="text-sm mb-2 text-fg">
            1. Load the script in your <code className="font-mono text-sm">index.html</code> or import it in a component:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-2" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<!-- index.html -->
<script src="https://themalive.com/themal-editor.js"></script>`}</code>
          </pre>
          <p className="text-sm mb-2 text-fg">
            2. Use the custom element in any component:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-2" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<template>
  <themal-editor></themal-editor>
</template>`}</code>
          </pre>
          <p className="text-sm mb-2 text-fg">
            3. Tell Vue to treat it as a custom element in <code className="font-mono text-sm">vite.config.js</code>:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'themal-editor'
        }
      }
    })
  ]
}`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Svelte / SvelteKit</h3>
          <p className="text-sm mb-2 text-fg">
            1. Add the script to your <code className="font-mono text-sm">app.html</code> or load it in a component:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-2" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<!-- app.html -->
<script src="https://themalive.com/themal-editor.js"></script>`}</code>
          </pre>
          <p className="text-sm mb-2 text-fg">
            2. Use in any Svelte component:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<themal-editor></themal-editor>`}</code>
          </pre>
          <p className="text-sm mb-4 text-muted-foreground">
            Svelte supports custom elements natively — no extra configuration needed.
          </p>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Astro</h3>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`---
// src/pages/design.astro
---
<html>
  <head>
    <script src="https://themalive.com/themal-editor.js"></script>
  </head>
  <body>
    <themal-editor></themal-editor>
  </body>
</html>`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Next.js</h3>
          <p className="text-sm mb-2 text-fg">
            The web component must render client-side only. Use <code className="font-mono text-sm">next/script</code> and a client component:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`'use client'
import Script from 'next/script'

export default function DesignEditor() {
  return (
    <>
      <Script
        src="https://themalive.com/themal-editor.js"
        strategy="lazyOnload"
      />
      <themal-editor></themal-editor>
    </>
  )
}`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Nuxt</h3>
          <p className="text-sm mb-2 text-fg">
            Wrap in <code className="font-mono text-sm">&lt;ClientOnly&gt;</code> to prevent SSR:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-2" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<template>
  <ClientOnly>
    <themal-editor></themal-editor>
  </ClientOnly>
</template>

<script setup>
useHead({
  script: [{ src: 'https://themalive.com/themal-editor.js' }]
})
</script>`}</code>
          </pre>
          <p className="text-sm mb-4 text-muted-foreground">
            Add the custom element config to <code className="font-mono text-sm">nuxt.config.ts</code>:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`// nuxt.config.ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'themal-editor'
    }
  }
})`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">WordPress</h3>
          <p className="text-sm mb-2 text-fg">
            Add a Custom HTML block to any page or post:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-2" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<script src="https://themalive.com/themal-editor.js"></script>
<themal-editor></themal-editor>`}</code>
          </pre>
          <p className="text-sm mb-4 text-muted-foreground">
            Or enqueue via <code className="font-mono text-sm">functions.php</code> or create a shortcode plugin. See the <a href="https://github.com/user/themal" target="_blank" rel="noopener noreferrer" className="text-sm underline hover:opacity-70 transition-opacity text-brand">web component README</a> for detailed WordPress setup options.
          </p>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Shopify</h3>
          <p className="text-sm mb-2 text-fg">
            Add to any Liquid template or custom page:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<script src="https://themalive.com/themal-editor.js"></script>
<themal-editor show-header="false"></themal-editor>`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Static Sites (Hugo, Jekyll, Eleventy)</h3>
          <p className="text-sm mb-2 text-fg">
            Add to any HTML template or page:
          </p>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<script src="https://themalive.com/themal-editor.js"></script>
<themal-editor></themal-editor>`}</code>
          </pre>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">PHP (Laravel, Symfony, Drupal)</h3>
          <pre className="rounded-lg p-4 text-sm overflow-x-auto mb-4" style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
            <code>{`<!-- In any Blade/Twig/PHP template -->
<script src="https://themalive.com/themal-editor.js"></script>
<themal-editor></themal-editor>`}</code>
          </pre>
        </section>

        {/* Tailwind Scoping */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Tailwind Scoping</h2>
          <p className="text-sm leading-relaxed text-fg">
            The editor ships pre-compiled CSS via <code className="font-mono text-sm">@themal/editor/style.css</code>. Styles are scoped using Tailwind's <code className="font-mono text-sm">{`important: '.ds-editor'`}</code> so they don't conflict with your app's styles. The root element is automatically wrapped in <code className="font-mono text-sm">{`<div className="ds-editor">`}</code>.
          </p>
        </section>

        {/* Theming & Styling */}
        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3 text-fg">Theming & Styling</h2>
          <p className="text-sm leading-relaxed mb-3 text-fg">
            Every editor UI element (modals, controls, buttons, labels, inputs) uses CSS custom properties for colors. This means the editor fully respects whatever theme your app defines. There are no hardcoded hex colors in the editor chrome.
          </p>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Color variable mapping</h3>
          <div className="overflow-x-auto rounded-lg border mb-4 border-theme">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#1e1e2e", color: "#cdd6f4" }}>
                  <th className="text-left p-3 font-medium">Purpose</th>
                  <th className="text-left p-3 font-medium">Variable used</th>
                </tr>
              </thead>
              <tbody className="text-fg">
                {[
                  ["Modal / card backgrounds", "hsl(var(--card))"],
                  ["Page backgrounds, inputs", "hsl(var(--background))"],
                  ["Primary text, headings", "hsl(var(--foreground))"],
                  ["Secondary / muted text", "hsl(var(--muted-foreground))"],
                  ["Inactive buttons, tags", "hsl(var(--muted))"],
                  ["Borders, dividers", "hsl(var(--border))"],
                  ["Error text, validation", "hsl(var(--destructive))"],
                  ["Primary action button bg", "hsl(var(--foreground))"],
                  ["Primary action button text", "hsl(var(--background))"],
                  ["Subtle tints (swatch grids)", "hsl(var(--foreground) / 0.04)"],
                  ["Modal backdrop overlay", "rgba(0,0,0,0.5)"],
                ].map(([purpose, variable], i) => (
                  <tr key={i} className="border-t border-theme">
                    <td className="p-3 font-light">{purpose}</td>
                    <td className="p-3 font-mono text-xs">{variable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-sm font-medium mb-2 text-muted-foreground">CSS specificity</h3>
          <ul className="list-disc pl-5 text-sm space-y-1.5 font-light text-fg">
            <li>Injected typography styles (<code className="font-mono text-xs">applyTypography</code>) never use <code className="font-mono text-xs">!important</code>. They rely on natural specificity so your classes can override them.</li>
            <li>Section heading (<code className="font-mono text-xs">.ds-h2</code>) and nav link (<code className="font-mono text-xs">.ds-nav-link-item</code>) classes in <code className="font-mono text-xs">editor.css</code> use <code className="font-mono text-xs">!important</code> only where needed to prevent injected typography from overriding structural UI.</li>
            <li>All editor styles are scoped under <code className="font-mono text-xs">.ds-editor</code> so they do not leak into your app.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
