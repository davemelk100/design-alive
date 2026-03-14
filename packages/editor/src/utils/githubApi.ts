/**
 * Client-side GitHub API module for creating design system PRs directly from the browser.
 * No backend required from the consuming app beyond a lightweight OAuth token exchange proxy.
 */

export interface GitHubConfig {
  /** GitHub OAuth App client ID (public, safe for browser) */
  clientId: string;
  /** Token exchange proxy URL. Default: "https://themalive.com/.netlify/functions/github-oauth" */
  oauthProxyUrl?: string;
  /** GitHub API base URL. Default: "https://api.github.com". Set for GitHub Enterprise Server. */
  apiBaseUrl?: string;
  /** GitHub web base URL. Default: "https://github.com". Set for GitHub Enterprise Server. */
  webBaseUrl?: string;
  /** Target repository in "owner/repo" format */
  repo: string;
  /** Path to the CSS file to update. Default: "src/globals.css" */
  filePath?: string;
  /** Base branch to create PRs against. Default: "main" */
  baseBranch?: string;
}

const DEFAULT_API_BASE = "https://api.github.com";
const DEFAULT_WEB_BASE = "https://github.com";
const DEFAULT_FILE_PATH = "src/globals.css";
const DEFAULT_BRANCH = "main";

function apiBase(config: GitHubConfig): string {
  return (config.apiBaseUrl || DEFAULT_API_BASE).replace(/\/+$/, "");
}

function webBase(config: GitHubConfig): string {
  return (config.webBaseUrl || DEFAULT_WEB_BASE).replace(/\/+$/, "");
}

async function ghFetch(
  config: GitHubConfig,
  token: string,
  path: string,
  options: RequestInit = {},
): Promise<unknown> {
  const res = await fetch(`${apiBase(config)}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

const SECTION_LABELS: Record<string, string> = {
  colors: "Colors",
  card: "Card Style",
  typography: "Typography",
  alerts: "Alerts",
  interactions: "Interactions",
};

/** Integration CSS rules that wire CSS variables to base HTML elements. */
export const INTEGRATION_CSS = `/* themal:integration-start */
body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
h1, h2, h3, h4, h5, h6 {
  color: hsl(var(--foreground));
}
a {
  color: hsl(var(--brand));
}
.card, [class*='card'] {
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
}
hr, .border {
  border-color: hsl(var(--border));
}
nav, header, footer {
  background-color: hsl(var(--card, var(--background)));
  color: hsl(var(--foreground));
}
/* themal:integration-end */`;

/**
 * Replace CSS custom properties inside an `@layer base { :root { ... } }` block.
 * Ported from the server-side Netlify function to run in the browser.
 */
export function replaceRootBlock(fileContent: string, newCssVars: string): string {
  const varMatch = newCssVars.match(/:root\s*\{([^}]+)\}/s);
  if (!varMatch) throw new Error("Could not parse CSS variables from input");

  const newVars: Record<string, string> = {};
  for (const line of varMatch[1].split("\n")) {
    const m = line.match(/--([\w-]+)\s*:\s*(.+?)\s*;/);
    if (m) newVars[`--${m[1]}`] = m[2];
  }

  const layerBaseRegex = /(@layer\s+base\s*\{[\s\S]*?:root\s*\{)([\s\S]*?)(\})/;
  const match = fileContent.match(layerBaseRegex);
  if (!match) throw new Error("Could not find @layer base :root block in the target CSS file");

  const existingBlock = match[2];
  const updatedLines: string[] = [];
  const matched = new Set<string>();

  for (const line of existingBlock.split("\n")) {
    const varLineMatch = line.match(/^(\s*)(--[\w-]+)\s*:\s*.+;$/);
    if (varLineMatch && newVars[varLineMatch[2]] !== undefined) {
      updatedLines.push(`${varLineMatch[1]}${varLineMatch[2]}: ${newVars[varLineMatch[2]]};`);
      matched.add(varLineMatch[2]);
    } else {
      updatedLines.push(line);
    }
  }

  const newEntries = Object.entries(newVars).filter(([k]) => !matched.has(k));
  if (newEntries.length > 0) {
    let insertIdx = updatedLines.length - 1;
    while (insertIdx > 0 && updatedLines[insertIdx].trim() === "") insertIdx--;
    const indent = "    ";
    const newLines = newEntries.map(([k, v]) => `${indent}${k}: ${v};`);
    updatedLines.splice(insertIdx + 1, 0, ...newLines);
  }

  return fileContent.replace(layerBaseRegex, `${match[1]}${updatedLines.join("\n")}${match[3]}`);
}

/**
 * Insert or replace a `/* themal:integration-start *​/ … /* themal:integration-end *​/` block.
 * If a block already exists it is replaced in place; otherwise it is appended after
 * the `@layer base { … }` closing brace.
 */
export function upsertIntegrationBlock(fileContent: string, integrationCss: string): string {
  const markerRe = /\/\* themal:integration-start \*\/[\s\S]*?\/\* themal:integration-end \*\//;
  if (markerRe.test(fileContent)) {
    return fileContent.replace(markerRe, integrationCss);
  }

  // Find the closing brace of @layer base by counting depth
  const layerStart = fileContent.search(/@layer\s+base\s*\{/);
  if (layerStart === -1) {
    // No @layer base — append at end
    return fileContent.trimEnd() + "\n\n" + integrationCss + "\n";
  }

  const openIdx = fileContent.indexOf("{", layerStart);
  let depth = 0;
  let closeIdx = -1;
  for (let i = openIdx; i < fileContent.length; i++) {
    if (fileContent[i] === "{") depth++;
    else if (fileContent[i] === "}") {
      depth--;
      if (depth === 0) {
        closeIdx = i;
        break;
      }
    }
  }

  if (closeIdx === -1) {
    return fileContent.trimEnd() + "\n\n" + integrationCss + "\n";
  }

  return (
    fileContent.slice(0, closeIdx + 1) +
    "\n\n" +
    integrationCss +
    "\n" +
    fileContent.slice(closeIdx + 1)
  );
}

/**
 * Verify the token is valid and return the authenticated GitHub username.
 * Returns null if the token is invalid or expired.
 */
export async function getAuthenticatedUser(
  config: GitHubConfig,
  token: string,
): Promise<string | null> {
  try {
    const user = (await ghFetch(config, token, "/user")) as { login: string };
    return user.login;
  } catch {
    return null;
  }
}

/**
 * Create a design system PR via the GitHub API, entirely from the browser.
 * Returns the GitHub compare URL for the user to review and submit.
 */
export async function createDesignPr(
  config: GitHubConfig,
  token: string,
  css: string,
  sections: string[],
  includeIntegration?: boolean,
): Promise<string> {
  const repo = config.repo;
  const filePath = config.filePath || DEFAULT_FILE_PATH;
  const baseBranch = config.baseBranch || DEFAULT_BRANCH;

  const sectionList = sections.length > 0 ? sections : ["colors", "card", "typography", "alerts"];
  const sectionLabel = sectionList.map((s) => SECTION_LABELS[s] || s).join(", ");

  // 1. Get current file from base branch
  const fileData = (await ghFetch(
    config,
    token,
    `/repos/${repo}/contents/${filePath}?ref=${baseBranch}`,
  )) as { content: string; sha: string };
  const currentContent = atob(fileData.content.replace(/\n/g, ""));

  // 2. Replace :root variables
  let updatedContent = replaceRootBlock(currentContent, css);

  // 2b. Optionally inject integration CSS rules
  if (includeIntegration) {
    updatedContent = upsertIntegrationBlock(updatedContent, INTEGRATION_CSS);
  }

  // 3. Get base branch SHA
  const mainRef = (await ghFetch(
    config,
    token,
    `/repos/${repo}/git/ref/heads/${baseBranch}`,
  )) as { object: { sha: string } };

  // 4. Create branch
  const branchName = `design-system/update-${Date.now()}`;
  await ghFetch(config, token, `/repos/${repo}/git/refs`, {
    method: "POST",
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: mainRef.object.sha,
    }),
  });

  // 5. Commit updated file
  await ghFetch(config, token, `/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Update design system: ${sectionLabel}`,
      content: btoa(updatedContent),
      sha: fileData.sha,
      branch: branchName,
    }),
  });

  // 6. Return compare URL
  const title = encodeURIComponent(`Update design system: ${sectionLabel}`);
  const integrationNote = includeIntegration
    ? "\n\nAlso includes integration CSS rules that apply design system variables to base HTML elements."
    : "";
  const body = encodeURIComponent(
    `Updates CSS custom properties in \`${filePath}\` from the Themal design system editor.\n\nSections: ${sectionLabel}${integrationNote}`,
  );
  return `${webBase(config)}/${repo}/compare/${baseBranch}...${branchName}?expand=1&title=${title}&body=${body}`;
}
