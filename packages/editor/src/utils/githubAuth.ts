/**
 * GitHub OAuth authentication for the editor.
 * Handles the OAuth popup flow, token storage, and validation.
 */

import type { GitHubConfig } from "./githubApi";
import { getAuthenticatedUser } from "./githubApi";

const STORAGE_KEY = "ds-github-token";
const DEFAULT_OAUTH_PROXY = "https://themalive.com/.netlify/functions/github-oauth";

export interface StoredGitHubAuth {
  access_token: string;
  username: string;
  stored_at: string;
}

export function getStoredAuth(): StoredGitHubAuth | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function storeAuth(auth: StoredGitHubAuth): void {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(auth)); } catch { /* quota */ }
}

export function clearAuth(): void {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}

/**
 * Validate the stored token by calling GET /user.
 * Returns the username if valid, null if invalid (and clears storage).
 */
export async function validateStoredToken(config: GitHubConfig): Promise<string | null> {
  const auth = getStoredAuth();
  if (!auth) return null;

  const username = await getAuthenticatedUser(config, auth.access_token);
  if (!username) {
    clearAuth();
    return null;
  }
  return username;
}

function oauthProxyUrl(config: GitHubConfig): string {
  return config.oauthProxyUrl || DEFAULT_OAUTH_PROXY;
}

function oauthAuthorizeUrl(config: GitHubConfig): string {
  const webBase = (config.webBaseUrl || "https://github.com").replace(/\/+$/, "");
  return `${webBase}/login/oauth/authorize`;
}

/**
 * Start the GitHub OAuth flow in a popup window.
 * Returns a promise that resolves with the access token and username,
 * or rejects if the user closes the popup or an error occurs.
 */
export function startOAuthFlow(config: GitHubConfig): Promise<StoredGitHubAuth> {
  return new Promise((resolve, reject) => {
    const state = crypto.randomUUID();
    const proxyBase = oauthProxyUrl(config);
    const redirectUri = `${proxyBase}/callback`;

    const authorizeUrl =
      `${oauthAuthorizeUrl(config)}?client_id=${config.clientId}&scope=repo&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    const width = 500;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      authorizeUrl,
      "themal-github-oauth",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`,
    );

    if (!popup) {
      reject(new Error("Popup blocked. Please allow popups for this site and try again."));
      return;
    }

    const expectedOrigin = new URL(proxyBase).origin;

    function onMessage(event: MessageEvent) {
      if (!event.data || event.data.type !== "themal-github-oauth") return;
      if (event.origin !== expectedOrigin && event.origin !== window.location.origin) return;

      cleanup();

      if (event.data.error) {
        reject(new Error(event.data.error));
        return;
      }

      if (event.data.access_token && event.data.state === state) {
        const auth: StoredGitHubAuth = {
          access_token: event.data.access_token,
          username: event.data.username || "",
          stored_at: new Date().toISOString(),
        };
        storeAuth(auth);
        resolve(auth);
      } else {
        reject(new Error("OAuth state mismatch. Please try again."));
      }
    }

    const pollInterval = setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error("Authorization cancelled."));
      }
    }, 500);

    function cleanup() {
      window.removeEventListener("message", onMessage);
      clearInterval(pollInterval);
      try { popup?.close(); } catch { /* cross-origin */ }
    }

    window.addEventListener("message", onMessage);
  });
}
