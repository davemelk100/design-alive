/// <reference types="vitest/globals" />
import {
  getStoredAuth,
  storeAuth,
  clearAuth,
  validateStoredToken,
  startOAuthFlow,
  type StoredGitHubAuth,
} from "../utils/githubAuth";
import type { GitHubConfig } from "../utils/githubApi";

// ---------------------------------------------------------------------------
// Mock githubApi
// ---------------------------------------------------------------------------
vi.mock("../utils/githubApi", () => ({
  getAuthenticatedUser: vi.fn(),
}));

import { getAuthenticatedUser } from "../utils/githubApi";
const mockedGetAuthenticatedUser = vi.mocked(getAuthenticatedUser);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STORAGE_KEY = "ds-github-token";

const sampleAuth: StoredGitHubAuth = {
  access_token: "gho_abc123",
  username: "octocat",
  stored_at: "2025-01-01T00:00:00.000Z",
};

const baseConfig: GitHubConfig = {
  clientId: "test-client-id",
  repo: "owner/repo",
};

// ---------------------------------------------------------------------------
// sessionStorage mock (jsdom provides one, but we spy on it for assertions)
// ---------------------------------------------------------------------------
let storage: Record<string, string>;

beforeEach(() => {
  storage = {};
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(
    (key: string) => storage[key] ?? null,
  );
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(
    (key: string, value: string) => { storage[key] = value; },
  );
  vi.spyOn(Storage.prototype, "removeItem").mockImplementation(
    (key: string) => { delete storage[key]; },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

// ===========================================================================
// getStoredAuth
// ===========================================================================
describe("getStoredAuth", () => {
  it("returns parsed auth when valid JSON exists in sessionStorage", () => {
    storage[STORAGE_KEY] = JSON.stringify(sampleAuth);
    const result = getStoredAuth();
    expect(result).toEqual(sampleAuth);
  });

  it("returns null when sessionStorage has no entry", () => {
    expect(getStoredAuth()).toBeNull();
  });

  it("returns null when sessionStorage contains invalid JSON", () => {
    storage[STORAGE_KEY] = "not-json{{{";
    expect(getStoredAuth()).toBeNull();
  });

  it("returns null when sessionStorage.getItem throws", () => {
    vi.mocked(sessionStorage.getItem).mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(getStoredAuth()).toBeNull();
  });
});

// ===========================================================================
// storeAuth
// ===========================================================================
describe("storeAuth", () => {
  it("stores serialized auth in sessionStorage", () => {
    storeAuth(sampleAuth);
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify(sampleAuth),
    );
    expect(storage[STORAGE_KEY]).toBe(JSON.stringify(sampleAuth));
  });

  it("does not throw when sessionStorage.setItem throws (quota exceeded)", () => {
    vi.mocked(sessionStorage.setItem).mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    expect(() => storeAuth(sampleAuth)).not.toThrow();
  });
});

// ===========================================================================
// clearAuth
// ===========================================================================
describe("clearAuth", () => {
  it("removes the auth key from sessionStorage", () => {
    storage[STORAGE_KEY] = JSON.stringify(sampleAuth);
    clearAuth();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    expect(storage[STORAGE_KEY]).toBeUndefined();
  });

  it("does not throw when sessionStorage.removeItem throws", () => {
    vi.mocked(sessionStorage.removeItem).mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(() => clearAuth()).not.toThrow();
  });
});

// ===========================================================================
// validateStoredToken
// ===========================================================================
describe("validateStoredToken", () => {
  it("returns the username when the token is valid", async () => {
    storage[STORAGE_KEY] = JSON.stringify(sampleAuth);
    mockedGetAuthenticatedUser.mockResolvedValue("octocat");

    const result = await validateStoredToken(baseConfig);
    expect(result).toBe("octocat");
    expect(mockedGetAuthenticatedUser).toHaveBeenCalledWith(baseConfig, sampleAuth.access_token);
  });

  it("returns null and clears storage when the token is invalid", async () => {
    storage[STORAGE_KEY] = JSON.stringify(sampleAuth);
    mockedGetAuthenticatedUser.mockResolvedValue(null);

    const result = await validateStoredToken(baseConfig);
    expect(result).toBeNull();
    expect(storage[STORAGE_KEY]).toBeUndefined();
  });

  it("returns null immediately when no stored auth exists", async () => {
    const result = await validateStoredToken(baseConfig);
    expect(result).toBeNull();
    expect(mockedGetAuthenticatedUser).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// startOAuthFlow
// ===========================================================================
describe("startOAuthFlow", () => {
  const TEST_STATE = "test-uuid-1234";
  const PROXY_ORIGIN = "https://themalive.com";

  beforeEach(() => {
    vi.stubGlobal("crypto", { randomUUID: vi.fn(() => TEST_STATE) });
  });

  it("resolves with auth on successful OAuth message", async () => {
    const closeFn = vi.fn();
    const mockPopup = { closed: false, close: closeFn };
    vi.spyOn(window, "open").mockReturnValue(mockPopup as unknown as Window);

    const promise = startOAuthFlow(baseConfig);

    // Simulate the OAuth callback message
    const messageEvent = new MessageEvent("message", {
      data: {
        type: "themal-github-oauth",
        access_token: "gho_new_token",
        username: "octocat",
        state: TEST_STATE,
      },
      origin: PROXY_ORIGIN,
    });
    window.dispatchEvent(messageEvent);

    const result = await promise;
    expect(result.access_token).toBe("gho_new_token");
    expect(result.username).toBe("octocat");
    expect(result.stored_at).toBeTruthy();
    // Should also persist to sessionStorage
    expect(storage[STORAGE_KEY]).toBeTruthy();
    const stored = JSON.parse(storage[STORAGE_KEY]);
    expect(stored.access_token).toBe("gho_new_token");
  });

  it("opens popup with correct authorize URL", async () => {
    const openSpy = vi.spyOn(window, "open").mockReturnValue({ closed: false, close: vi.fn() } as unknown as Window);

    const promise = startOAuthFlow(baseConfig);

    // Send a valid message to resolve the promise so it doesn't hang
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "themal-github-oauth",
          access_token: "tok",
          username: "user",
          state: TEST_STATE,
        },
        origin: PROXY_ORIGIN,
      }),
    );
    await promise;

    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain("https://github.com/login/oauth/authorize");
    expect(url).toContain(`client_id=${baseConfig.clientId}`);
    expect(url).toContain(`state=${TEST_STATE}`);
    expect(url).toContain("scope=repo");
  });

  it("rejects when the popup is blocked (window.open returns null)", async () => {
    vi.spyOn(window, "open").mockReturnValue(null);

    await expect(startOAuthFlow(baseConfig)).rejects.toThrow("Popup blocked");
  });

  it("rejects when the user closes the popup before completing OAuth", async () => {
    const mockPopup = { closed: false, close: vi.fn() };
    vi.spyOn(window, "open").mockReturnValue(mockPopup as unknown as Window);

    const promise = startOAuthFlow(baseConfig);

    // Simulate popup being closed by user
    mockPopup.closed = true;

    // The poll interval checks every 500ms
    await vi.waitFor(
      () => expect(promise).rejects.toThrow("Authorization cancelled"),
      { timeout: 2000 },
    );
  });

  it("rejects on OAuth state mismatch", async () => {
    vi.spyOn(window, "open").mockReturnValue({ closed: false, close: vi.fn() } as unknown as Window);

    const promise = startOAuthFlow(baseConfig);

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "themal-github-oauth",
          access_token: "gho_token",
          username: "octocat",
          state: "wrong-state",
        },
        origin: PROXY_ORIGIN,
      }),
    );

    await expect(promise).rejects.toThrow("OAuth state mismatch");
  });

  it("rejects when the OAuth callback reports an error", async () => {
    vi.spyOn(window, "open").mockReturnValue({ closed: false, close: vi.fn() } as unknown as Window);

    const promise = startOAuthFlow(baseConfig);

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "themal-github-oauth",
          error: "access_denied",
        },
        origin: PROXY_ORIGIN,
      }),
    );

    await expect(promise).rejects.toThrow("access_denied");
  });

  it("ignores messages with a non-matching type", async () => {
    vi.spyOn(window, "open").mockReturnValue({ closed: false, close: vi.fn() } as unknown as Window);

    const promise = startOAuthFlow(baseConfig);

    // Dispatch an unrelated message. Should be ignored.
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { type: "unrelated-event", access_token: "tok" },
        origin: PROXY_ORIGIN,
      }),
    );

    // Now dispatch the real one to resolve
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "themal-github-oauth",
          access_token: "gho_real",
          username: "user",
          state: TEST_STATE,
        },
        origin: PROXY_ORIGIN,
      }),
    );

    const result = await promise;
    expect(result.access_token).toBe("gho_real");
  });

  it("ignores messages from a non-matching origin", async () => {
    vi.spyOn(window, "open").mockReturnValue({ closed: false, close: vi.fn() } as unknown as Window);

    const promise = startOAuthFlow(baseConfig);

    // Dispatch from wrong origin. Should be ignored.
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "themal-github-oauth",
          access_token: "gho_bad",
          username: "evil",
          state: TEST_STATE,
        },
        origin: "https://evil.com",
      }),
    );

    // Now dispatch the real one
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "themal-github-oauth",
          access_token: "gho_good",
          username: "user",
          state: TEST_STATE,
        },
        origin: PROXY_ORIGIN,
      }),
    );

    const result = await promise;
    expect(result.access_token).toBe("gho_good");
  });

  it("uses custom oauthProxyUrl when provided in config", async () => {
    const customConfig: GitHubConfig = {
      ...baseConfig,
      oauthProxyUrl: "https://custom-proxy.example.com/oauth",
    };

    const openSpy = vi.spyOn(window, "open").mockReturnValue({ closed: false, close: vi.fn() } as unknown as Window);

    const promise = startOAuthFlow(customConfig);

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          type: "themal-github-oauth",
          access_token: "tok",
          username: "user",
          state: TEST_STATE,
        },
        origin: "https://custom-proxy.example.com",
      }),
    );
    await promise;

    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain(
      `redirect_uri=${encodeURIComponent("https://custom-proxy.example.com/oauth/callback")}`,
    );
  });
});
