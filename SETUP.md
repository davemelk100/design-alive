# Themal - Environment & Service Setup

This guide walks through setting up all third-party services and environment variables needed to run Themal locally and in production (Netlify).

## Quick Start

```bash
cp .env.example .env
# Fill in the values following the sections below
npm install
npm run dev
```

## Table of Contents

1. [Clerk (Authentication)](#1-clerk-authentication)
2. [Google OAuth (Sign-in provider)](#2-google-oauth)
3. [Stripe (Billing)](#3-stripe-billing)
4. [GitHub Token (PR creation)](#4-github-token)
5. [Netlify (Production)](#5-netlify-production)
6. [Importing @themal/editor Into Your App](#6-importing-themal-editor-into-your-app)
7. [GitHub PR Integration](#7-github-pr-integration)
8. [Theming & Inline Style Rules](#8-theming--inline-style-rules)
9. [Environment Variable Reference](#9-environment-variable-reference)
10. [Command Reference](#10-command-reference)
11. [Making the Repo Public](#11-making-the-repo-public)

---

## 1. Clerk (Authentication)

Clerk handles user authentication via Google OAuth.

### Dashboard

[dashboard.clerk.com](https://dashboard.clerk.com)

### Setup

1. Create a new application in Clerk.
2. Go to **Configure > API Keys** and copy:
   - **Publishable key** (`pk_live_...` or `pk_test_...`) into `VITE_CLERK_PUBLISHABLE_KEY`
   - **Secret key** (`sk_live_...` or `sk_test_...`) into `CLERK_SECRET_KEY`
3. Both keys must be from the **same instance** (both live or both test).

### Custom Domain (Production)

For production, Clerk uses a CNAME so auth requests go through your domain instead of `clerk.accounts.dev`.

1. In Clerk, go to **Configure > Domains**.
2. Add a CNAME record in your DNS provider:
   - **Name:** `clerk`
   - **Value:** `frontend-api.clerk.services`
3. Click **Verify configuration** in Clerk. Once verified, the `pk_live_` key automatically routes through `clerk.yourdomain.com`.
4. No `proxyUrl` is needed in the code when using CNAME with a production publishable key.

### Important Notes

- The `pk_live_` publishable key encodes the Clerk Frontend API URL. If you decode it (base64 after the `pk_live_` prefix), you can see which domain it points to.
- For local development, you can use `pk_test_` / `sk_test_` keys from a Clerk Development instance.
- In production (Netlify), use `pk_live_` / `sk_live_` keys from the Production instance.

---

## 2. Google OAuth

Google OAuth is configured through Clerk, but you need to set up credentials in Google Cloud Console.

### Dashboard

[console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

### Setup

1. Create a project in Google Cloud Console (or use an existing one).
2. Go to **APIs & Services > OAuth consent screen**:
   - Choose **External** user type.
   - Fill in app name, support email, developer email.
   - Add your domain to **Authorized domains** (e.g., `themalive.com`).
   - **Publish the app** (move from Testing to Production). Without this, only test users can sign in.
3. Go to **APIs & Services > Credentials > Create Credentials > OAuth client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs: add your Clerk callback URL. This is your Clerk Frontend API domain + `/v1/oauth_callback`. For example:
     - `https://clerk.yourdomain.com/v1/oauth_callback`
     - `https://your-clerk-id.clerk.accounts.dev/v1/oauth_callback` (for dev)
   - Copy the **Client ID** and **Client Secret**.
4. In Clerk dashboard, go to **Configure > SSO Connections > Google** and paste the Client ID and Client Secret.

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Access blocked: Authorization Error" | OAuth consent screen is in Testing mode | Publish the app in Google Cloud Console |
| "Missing required parameter: client_id" | No OAuth client created | Create an OAuth client in Credentials |
| Redirect URI mismatch | Wrong callback URL in Google | Add the correct Clerk callback URL |

---

## 3. Stripe (Billing)

Stripe handles subscription checkout for Free/Pro tiers.

### Dashboard

[dashboard.stripe.com](https://dashboard.stripe.com)

### Setup

1. Get your API keys from **Developers > API Keys**:
   - Copy **Secret key** into `STRIPE_SECRET_KEY`
   - Note: toggle **Test mode** (top-right) to get test keys (`sk_test_...`) for development.

2. Create products and prices under **Product catalog > Add product**:
   - **Monthly Pro**: $9/month, recurring. Copy the `price_` ID into `STRIPE_MONTHLY_PRICE_ID`.
   - **Yearly Pro**: $50/year, recurring. Copy the `price_` ID into `STRIPE_YEARLY_PRICE_ID`.
   - **Test product**: $0.50, one-time. Copy the `price_` ID into `STRIPE_TEST_PRICE_ID`.

3. Set up a webhook under **Developers > Webhooks > Add endpoint**:
   - URL: `https://yourdomain.com/.netlify/functions/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret** (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.

4. To send receipt emails, go to **Settings > Business > Customer emails** and enable **Successful payments**.

### Important Notes

- **All keys and price IDs must be from the same mode** (all test or all live). Mixing test keys with live price IDs will fail.
- Price IDs start with `price_`. Product IDs start with `prod_`. You need `price_` IDs.
- Stripe requires a minimum charge of $0.50 USD.
- To find a price ID: go to **Product catalog**, click a product, find the price in the Pricing table, click the **...** menu to copy its ID.

---

## 4. GitHub Token

A personal access token enables the "Open PR" feature in the editor.

### Dashboard

[github.com/settings/tokens](https://github.com/settings/tokens)

### Setup

1. Click **Generate new token (classic)**.
2. Select the `repo` scope.
3. Generate and copy the token into `GITHUB_TOKEN`.

---

## 5. Netlify (Production)

All environment variables must also be set in Netlify for production deploys.

### Dashboard

[app.netlify.com](https://app.netlify.com) > Your site > **Site settings > Environment variables**

### Required Variables

Set all of the following in Netlify:

| Variable | Value |
|----------|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_...` (production Clerk key) |
| `CLERK_SECRET_KEY` | `sk_live_...` (production Clerk key) |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `STRIPE_MONTHLY_PRICE_ID` | `price_...` |
| `STRIPE_YEARLY_PRICE_ID` | `price_...` |
| `STRIPE_TEST_PRICE_ID` | `price_...` |
| `GITHUB_TOKEN` | `ghp_...` |

### DNS Records (for Clerk)

In **Netlify > Domain management > DNS settings**, add:

| Type | Name | Value |
|------|------|-------|
| CNAME | `clerk` | `frontend-api.clerk.services` |

### After Changing Env Vars

Netlify caches env vars per deploy. After updating a variable, trigger a new deploy: **Deploys > Trigger deploy > Clear cache and deploy site**.

---

## 6. Importing @themal/editor Into Your App

This section is for developers who install `@themal/editor` as a dependency in their own project.

### Minimal setup (no backend required)

```bash
npm install @themal/editor
```

Peer dependencies: `react` and `react-dom` (v18 or v19).
Optional: `axe-core` (accessibility auditing), `lucide-react` (icon previews).

```tsx
import { DesignSystemEditor } from '@themal/editor';
import '@themal/editor/style.css';

function App() {
  return <DesignSystemEditor />;
}
```

Run your normal dev server. No env vars, no serverless functions, no special CLI. The editor is entirely client-side. Colors, typography, cards, alerts, export, and shareable URLs all work out of the box.

### With all features enabled

```tsx
<DesignSystemEditor
  github={{
    clientId: "Iv1.abc123",
    repo: "your-org/your-repo",
    filePath: "src/globals.css",
    baseBranch: "main",
  }}
  accessibilityAudit={true}
  licenseKey="THEMAL-XXXX-XXXX-XXXX"
  upgradeUrl="/pricing"
  signInUrl="/sign-in"
/>
```

### Web component (Vue, Svelte, WordPress, Shopify, etc.)

No npm install needed. Single script tag:

```html
<script src="https://themalive.com/themal-editor.js"></script>
<themal-editor
  license-key="THEMAL-XXXX-XXXX-XXXX"
  accessibility-audit="true"
></themal-editor>
```

Bundles React internally. Works anywhere you can load a script tag.

---

## 7. GitHub PR Integration

Two modes. Choose based on your environment.

### Public mode (recommended for most users)

Uses Themal's hosted OAuth proxy for the token exchange. All GitHub API calls happen directly from the browser using the user's own OAuth token. No CSS content or repo data passes through Themal's servers.

**Setup:**

1. Create a [GitHub OAuth App](https://github.com/settings/applications/new).
2. Set callback URL to `https://themalive.com/.netlify/functions/github-oauth/callback`.
3. Copy the Client ID (starts with `Iv1.`).

```tsx
<DesignSystemEditor
  github={{
    clientId: "Iv1.abc123",
    repo: "your-org/your-repo",
  }}
/>
```

No backend, no env vars, no server functions in your app.

### Enterprise mode (self-hosted, for corporate environments)

For organizations using GitHub Enterprise Server or requiring that no credentials pass through external services. The entire flow stays within your network.

**Setup:**

1. Register a **GitHub App** on your GHE instance. Grant `Contents: Read and write` on target repos only (fine-grained, not the broad `repo` scope).
2. Deploy the OAuth proxy behind your firewall. It is a single serverless function (~30 lines) that exchanges an authorization code for a token. Source: `netlify/functions/github-oauth.ts`.
3. Set the callback URL in your GitHub App to `https://<your-proxy-host>/callback`.

```tsx
<DesignSystemEditor
  github={{
    clientId: "Iv1.your-ghe-app-id",
    repo: "internal-org/design-system",
    oauthProxyUrl: "https://internal-tools.yourcompany.com/github-oauth",
    apiBaseUrl: "https://github.yourcompany.com/api/v3",
    webBaseUrl: "https://github.yourcompany.com",
  }}
/>
```

**Proxy env vars** (on your internal proxy server):

| Variable | Value |
|----------|-------|
| `GITHUB_CLIENT_ID` | Your GitHub App client ID |
| `GITHUB_CLIENT_SECRET` | Your GitHub App client secret |
| `GITHUB_WEB_BASE_URL` | `https://github.yourcompany.com` |

### `github` prop reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `clientId` | string | required | GitHub OAuth/App client ID |
| `repo` | string | required | Target repo (`"owner/repo"`) |
| `filePath` | string | `"src/globals.css"` | CSS file with `@layer base { :root { ... } }` |
| `baseBranch` | string | `"main"` | Branch to PR against |
| `oauthProxyUrl` | string | Themal's hosted proxy | Token exchange proxy URL |
| `apiBaseUrl` | string | `https://api.github.com` | GitHub API URL (for GHE) |
| `webBaseUrl` | string | `https://github.com` | GitHub web URL (for GHE) |

### Security comparison

| Concern | Public mode | Enterprise mode |
|---------|-------------|-----------------|
| Token exchange | Themal's hosted proxy | Your self-hosted proxy |
| GitHub API calls | Browser to api.github.com | Browser to your GHE |
| Permissions | `repo` scope (OAuth App) | Fine-grained per-repo (GitHub App) |
| Token storage | User's browser localStorage | User's browser localStorage |
| CSS data in transit | Browser to GitHub directly | Browser to GHE directly |
| Network traffic to Themal | OAuth code exchange only | None |

### How the flow works

1. User clicks "Open PR" in the editor.
2. If not connected, "Connect GitHub" button appears. Clicking opens a popup to GitHub's OAuth page.
3. User authorizes. Popup exchanges the code for a token via the proxy, passes it back via `postMessage`.
4. Token stored in localStorage. Editor shows the section selector.
5. User selects sections and clicks "Submit PR".
6. Editor fetches the CSS file from the repo, merges updated variables into the `:root` block, creates a branch, commits, and opens the GitHub compare URL in a new tab.
7. User reviews the diff and creates the PR on GitHub.

### Legacy: custom PR endpoint

The `prEndpointUrl` prop is still supported for apps that want full server-side control:

```tsx
<DesignSystemEditor prEndpointUrl="/api/create-design-pr" />
```

Your endpoint receives `POST { css, sections }` and returns `{ url }`. You implement the GitHub logic on your server. See the `prEndpointUrl` row in the Props table on the [Dev Docs page](https://themalive.com/readme).

If both `github` and `prEndpointUrl` are provided, `github` takes precedence.

---

## 8. Theming & Inline Style Rules

The editor UI uses CSS custom properties for all colors. No hardcoded hex values in modals, controls, buttons, labels, or inputs. This means the editor fully adapts to whatever theme your app defines.

### Color variable mapping

| Purpose | CSS value used |
|---------|---------------|
| Modal / card backgrounds | `hsl(var(--card))` |
| Page backgrounds, inputs | `hsl(var(--background))` |
| Primary text, headings | `hsl(var(--foreground))` |
| Secondary / muted text | `hsl(var(--muted-foreground))` |
| Inactive buttons, tags | `hsl(var(--muted))` |
| Borders, dividers | `hsl(var(--border))` |
| Error text, validation | `hsl(var(--destructive))` |
| Primary action button bg | `hsl(var(--foreground))` |
| Primary action button text | `hsl(var(--background))` |
| Subtle tints (swatch grids) | `hsl(var(--foreground) / 0.04)` |
| Modal backdrop overlay | `rgba(0,0,0,0.5)` (acceptable) |

### Exceptions (acceptable hardcoded values)

- **Dynamic contrast fallbacks**: `#ffffff` / `#000000` in computed ternaries that pick white or black text based on background lightness.
- **Logo SVG fills**: Brand colors in the Themal wordmark SVG.
- **Code block backgrounds**: `#1e1e2e` for syntax-highlighted code blocks in documentation pages.

### CSS specificity rules

- Injected typography styles (`applyTypography` in `themeUtils.ts`) never use `!important`. They rely on natural specificity.
- Section headings (`.ds-h2`) use `!important` in `editor.css` to prevent injected typography from overriding structural UI.
- Nav link items (`.ds-nav-link-item`) and global action buttons (`.ds-global-btn`) in `editor.css` use CSS variables, not hex.
- All editor styles are scoped under `.ds-editor` so they do not leak into the consuming app.

---

## 9. Environment Variable Reference

| Variable | Where Used | Prefix | Where to Find |
|----------|-----------|--------|---------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Frontend (Vite) | `pk_live_` / `pk_test_` | [Clerk API Keys](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | Netlify Functions | `sk_live_` / `sk_test_` | [Clerk API Keys](https://dashboard.clerk.com) |
| `STRIPE_SECRET_KEY` | Netlify Functions | `sk_live_` / `sk_test_` | [Stripe API Keys](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Netlify Functions | `whsec_` | [Stripe Webhooks](https://dashboard.stripe.com/webhooks) |
| `STRIPE_MONTHLY_PRICE_ID` | Netlify Functions | `price_` | [Stripe Products](https://dashboard.stripe.com/products) |
| `STRIPE_YEARLY_PRICE_ID` | Netlify Functions | `price_` | [Stripe Products](https://dashboard.stripe.com/products) |
| `STRIPE_TEST_PRICE_ID` | Netlify Functions | `price_` | [Stripe Products](https://dashboard.stripe.com/products) |
| `GITHUB_TOKEN` | Netlify Functions | `ghp_` | [GitHub Tokens](https://github.com/settings/tokens) |
| `GOOGLE_CLIENT_ID` | Clerk (not app) | ends `.apps.googleusercontent.com` | [Google Credentials](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | Clerk (not app) | `GOCSPX-` | [Google Credentials](https://console.cloud.google.com/apis/credentials) |

### Notes

- Variables prefixed with `VITE_` are exposed to the browser. Never put secrets in `VITE_` variables.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are entered directly into the Clerk dashboard, not used by the app code. They're in `.env` only for reference.
- For local development, you can use Clerk test keys (`pk_test_`/`sk_test_`) and Stripe test keys (`sk_test_`). Just make sure all Stripe price IDs are also from test mode.

---

## 10. Command Reference

### Root (from repo root)

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies (root + workspaces) |
| `npm run dev` | Start the Vite dev server (localhost:5173) |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm run preview:build` | Build then preview in one step |
| `npm run test` | Run tests in watch mode (Vitest) |
| `npm run test:run` | Run tests once and exit |
| `npm run test:lighthouse` | Run Lighthouse CI audit |
| `npm run lint` | ESLint with jsx-a11y accessibility rules |

### Editor Package (from `packages/editor`)

| Command | Description |
|---------|-------------|
| `npm run build` | TypeScript check + Vite library build (outputs `dist/`) |
| `npm run dev` | Watch mode, rebuilds on file changes |

### Publishing to npm

```bash
cd packages/editor
npm run build
npm pack --dry-run          # verify tarball contents (should only include dist/)
npm version patch           # or minor / major
npm publish --access public # scoped packages require --access public on first publish
```

You must be logged in to npm (`npm login`) with publish access to the `@themal` scope. If the scope does not exist, create an npm org named `themal` first at [npmjs.com/org/create](https://www.npmjs.com/org/create).

### Netlify Dev (local functions)

```bash
npx netlify dev             # starts dev server with Netlify Functions support
```

This proxies Netlify Functions locally so you can test checkout, PR creation, and webhooks on `localhost:8888`.

### Git

| Command | Description |
|---------|-------------|
| `git status` | Check working tree status |
| `git add <files>` | Stage specific files |
| `git commit -m "message"` | Create a commit |
| `git push` | Push to remote (triggers Netlify deploy on main) |

### Stripe CLI (optional, for local webhook testing)

```bash
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
```

This forwards Stripe webhook events to your local Netlify Functions. Copy the `whsec_` signing secret it prints and use it as `STRIPE_WEBHOOK_SECRET` in your local `.env`.

Install the Stripe CLI: [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

### Useful Verification Commands

```bash
# Decode your Clerk publishable key to see which domain it points to
echo "pk_live_..." | sed 's/pk_live_//' | base64 -d

# Test your Clerk secret key
curl -s -H "Authorization: Bearer sk_live_..." https://api.clerk.com/v1/users?limit=1

# Test your Stripe secret key
curl -s -u "sk_live_...:" https://api.stripe.com/v1/prices?limit=1

# Check a Stripe price ID
curl -s -u "sk_live_...:" https://api.stripe.com/v1/prices/price_...

# Clear Vite cache (if stale builds)
rm -rf node_modules/.vite dist .vite

# Rebuild everything from scratch
rm -rf node_modules/.vite dist .vite && cd packages/editor && npm run build && cd ../.. && npm run build
```

---

## 11. Making the Repo Public

Checklist to complete before making this repo public. Do not make the repo public until all items are addressed.

### Pre-flight: audit git history for secrets

Run these commands to verify no real secrets were ever committed:

```bash
# Search for Stripe keys
git log --all -p -S 'sk_live_51' --oneline | head -20
git log --all -p -S 'sk_test_51' --oneline | head -20

# Search for GitHub tokens
git log --all -p -S 'ghp_' --oneline | head -20

# Search for Clerk secrets
git log --all -p -S 'sk_live_mol' --oneline | head -20

# Search for Google OAuth secrets
git log --all -p -S 'GOCSPX-' --oneline | head -20

# Search for webhook secrets
git log --all -p -S 'whsec_' --oneline | head -20

# Search for JWT secrets
git log --all -p -S 'JWT_SECRET' --oneline | head -20

# Check if .env was ever committed
git log --all --oneline --diff-filter=A -- .env
```

All results should point to `.env.example` (which contains only placeholder prefixes like `sk_live_...`). If any real values appear, you need to rewrite history with `git filter-repo` or `BFG Repo-Cleaner` before going public.

### Rotate all secrets

Even if git history is clean, rotate secrets before going public as a precaution. Update both your local `.env` and Netlify environment variables after each rotation.

| Secret | Where to rotate | Update in |
|--------|----------------|-----------|
| GitHub token | [github.com/settings/tokens](https://github.com/settings/tokens) - delete old, create new | `.env` + Netlify |
| Stripe secret key | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) - roll key | `.env` + Netlify |
| Stripe webhook secret | Stripe > Developers > Webhooks - roll signing secret | `.env` + Netlify |
| Clerk secret key | [dashboard.clerk.com](https://dashboard.clerk.com) - rotate key | `.env` + Netlify |
| Google OAuth secret | [console.cloud.google.com](https://console.cloud.google.com/apis/credentials) - create new credentials | Clerk dashboard |

Price IDs (`price_...`) and Clerk publishable keys (`pk_live_...`) do not need rotation. They are public by design.

### Verify .gitignore coverage

```bash
# Confirm .env patterns are ignored
grep '.env' .gitignore

# Confirm no secrets are tracked
git ls-files | grep -i -E '\.env$|secret|credential|\.pem|\.key$'
```

### Feature completeness

- [ ] GitHub OAuth integration fully wired (client-side PR flow replaces server-side `GITHUB_TOKEN` approach)
- [ ] `netlify/functions/github-oauth.ts` proxy deployed and tested
- [ ] `netlify/functions/create-design-pr.ts` hardcoded repo/token removed or deprecated
- [ ] `packages/editor/` source code reviewed for any hardcoded values

### After going public

- Monitor [GitHub secret scanning alerts](https://github.com/davemelk100/design-alive/security/secret-scanning) (enabled automatically on public repos)
- Enable Dependabot for security updates
- Add a `LICENSE` file if not already present
