import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mock global fetch ────────────────────────────────────────────────────────

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// ── Import handler (and the module, which exposes rateMap indirectly) ────────

const mod = await import("../../../../netlify/functions/create-design-pr");
const { handler } = mod;

// ── Helpers ──────────────────────────────────────────────────────────────────

const SAMPLE_GLOBALS_CSS = `
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --border: 214.3 31.8% 91.4%;
  }
}
`.trim();

const SAMPLE_CSS_INPUT = `:root {
  --background: 210 50% 98%;
  --foreground: 220 80% 10%;
  --brand-new-var: 100 50% 50%;
}`;

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    httpMethod: "POST",
    headers: {
      origin: "https://themalive.com",
      "x-forwarded-for": `192.168.1.${Math.floor(Math.random() * 255)}`,
    },
    body: JSON.stringify({ css: SAMPLE_CSS_INPUT, sections: ["colors"] }),
    ...overrides,
  };
}

function parseBody(result: { body: string }) {
  return JSON.parse(result.body);
}

/**
 * Set up mockFetch to succeed for the standard 4-call GitHub flow:
 *   1. GET file contents
 *   2. GET ref/heads/main
 *   3. POST create ref (branch)
 *   4. PUT update file
 */
function setupGitHubMocks() {
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: Buffer.from(SAMPLE_GLOBALS_CSS).toString("base64"),
        sha: "abc123",
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ object: { sha: "main-sha-456" } }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ref: "refs/heads/design-system/update-xxx" }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: { sha: "new-sha-789" } }),
    });
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("create-design-pr", () => {
  const ORIG_ENV = { ...process.env };

  beforeEach(() => {
    process.env.GITHUB_TOKEN = "ghp_test_token";
    mockFetch.mockReset();
  });

  afterEach(() => {
    process.env = { ...ORIG_ENV };
    vi.clearAllMocks();
  });

  // ── CORS ───────────────────────────────────────────────────────────────

  describe("CORS", () => {
    it("returns 200 with CORS headers for OPTIONS preflight", async () => {
      const result = await handler(
        makeEvent({ httpMethod: "OPTIONS" }),
      );
      expect(result.statusCode).toBe(200);
      expect(result.headers["Access-Control-Allow-Origin"]).toBe("https://themalive.com");
    });

    it("falls back to default origin for unknown origins", async () => {
      const result = await handler(
        makeEvent({
          httpMethod: "OPTIONS",
          headers: { origin: "https://evil.com", "x-forwarded-for": "1.2.3.4" },
        }),
      );
      expect(result.headers["Access-Control-Allow-Origin"]).toBe("https://themalive.com");
    });
  });

  // ── Method ─────────────────────────────────────────────────────────────

  it("returns 405 for non-POST methods", async () => {
    const result = await handler(makeEvent({ httpMethod: "GET" }));
    expect(result.statusCode).toBe(405);
    expect(parseBody(result).error).toBe("Method not allowed");
  });

  // ── Rate limiting ──────────────────────────────────────────────────────

  describe("rate limiting", () => {
    it("returns 429 on second request from the same IP within the window", async () => {
      setupGitHubMocks();
      const ip = "10.0.0.42";
      const event = makeEvent({
        headers: { origin: "https://themalive.com", "x-forwarded-for": ip },
      });

      // First request succeeds
      const first = await handler(event);
      expect(first.statusCode).toBe(200);

      // Second request from same IP is rate-limited
      const second = await handler(event);
      expect(second.statusCode).toBe(429);
      expect(parseBody(second).error).toMatch(/Rate limited/);
      expect(second.headers["Retry-After"]).toBeDefined();
    });

    it("allows requests from different IPs", async () => {
      setupGitHubMocks();
      const event1 = makeEvent({
        headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.100" },
      });
      const first = await handler(event1);
      expect(first.statusCode).toBe(200);

      setupGitHubMocks();
      const event2 = makeEvent({
        headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.101" },
      });
      const second = await handler(event2);
      expect(second.statusCode).toBe(200);
    });
  });

  // ── Missing config ─────────────────────────────────────────────────────

  it("returns 500 when GITHUB_TOKEN is missing", async () => {
    delete process.env.GITHUB_TOKEN;
    const result = await handler(
      makeEvent({
        headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.200" },
      }),
    );
    expect(result.statusCode).toBe(500);
    expect(parseBody(result).error).toBe("GITHUB_TOKEN not configured");
  });

  // ── Missing css field ──────────────────────────────────────────────────

  it("returns 400 when css field is missing from body", async () => {
    const result = await handler(
      makeEvent({
        body: JSON.stringify({ sections: ["colors"] }),
        headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.201" },
      }),
    );
    expect(result.statusCode).toBe(400);
    expect(parseBody(result).error).toBe("Missing css field");
  });

  // ── replaceRootBlock (CSS variable replacement) ────────────────────────

  describe("replaceRootBlock via handler", () => {
    it("replaces existing variables and appends new ones", async () => {
      setupGitHubMocks();
      const result = await handler(
        makeEvent({
          headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.202" },
        }),
      );
      expect(result.statusCode).toBe(200);

      // The 4th fetch call is the PUT to update the file.
      // Its body contains the base64-encoded updated content.
      const putCall = mockFetch.mock.calls[3];
      const putBody = JSON.parse(putCall[1].body);
      const updatedContent = Buffer.from(putBody.content, "base64").toString("utf-8");

      // Existing vars should be updated
      expect(updatedContent).toContain("--background: 210 50% 98%;");
      expect(updatedContent).toContain("--foreground: 220 80% 10%;");
      // New var should be appended
      expect(updatedContent).toContain("--brand-new-var: 100 50% 50%;");
      // Unmodified var should remain
      expect(updatedContent).toContain("--border: 214.3 31.8% 91.4%;");
    });

    it("returns error when CSS input has no :root block", async () => {
      // ghFetch for file contents will succeed, but replaceRootBlock will throw
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: Buffer.from(SAMPLE_GLOBALS_CSS).toString("base64"),
          sha: "abc123",
        }),
      });

      const result = await handler(
        makeEvent({
          body: JSON.stringify({ css: "body { color: red; }", sections: ["colors"] }),
          headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.203" },
        }),
      );
      expect(result.statusCode).toBe(500);
      expect(parseBody(result).error).toContain("Could not parse CSS variables");
    });
  });

  // ── GitHub API calls ───────────────────────────────────────────────────

  describe("GitHub API flow", () => {
    it("makes 4 GitHub API calls in the correct order", async () => {
      setupGitHubMocks();
      await handler(
        makeEvent({
          headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.204" },
        }),
      );

      expect(mockFetch).toHaveBeenCalledTimes(4);

      // 1. GET file
      const [url1] = mockFetch.mock.calls[0];
      expect(url1).toContain("/contents/src/globals.css?ref=main");

      // 2. GET main ref
      const [url2] = mockFetch.mock.calls[1];
      expect(url2).toContain("/git/ref/heads/main");

      // 3. POST create branch
      const [url3, opts3] = mockFetch.mock.calls[2];
      expect(url3).toContain("/git/refs");
      expect(opts3.method).toBe("POST");
      const body3 = JSON.parse(opts3.body);
      expect(body3.ref).toMatch(/^refs\/heads\/design-system\/update-/);
      expect(body3.sha).toBe("main-sha-456");

      // 4. PUT update file
      const [url4, opts4] = mockFetch.mock.calls[3];
      expect(url4).toContain("/contents/src/globals.css");
      expect(opts4.method).toBe("PUT");
    });

    it("passes Authorization header with GitHub token to all API calls", async () => {
      setupGitHubMocks();
      await handler(
        makeEvent({
          headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.205" },
        }),
      );

      for (const [, opts] of mockFetch.mock.calls) {
        expect(opts.headers.Authorization).toBe("Bearer ghp_test_token");
      }
    });

    it("returns a compare URL on success", async () => {
      setupGitHubMocks();
      const result = await handler(
        makeEvent({
          headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.206" },
        }),
      );
      expect(result.statusCode).toBe(200);
      const body = parseBody(result);
      expect(body.url).toContain("github.com/davemelk100/design-alive/compare/main...");
    });
  });

  // ── Section labels ─────────────────────────────────────────────────────

  it("uses human-readable section labels in commit message", async () => {
    setupGitHubMocks();
    await handler(
      makeEvent({
        body: JSON.stringify({
          css: SAMPLE_CSS_INPUT,
          sections: ["colors", "typography"],
        }),
        headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.207" },
      }),
    );

    // The PUT call (4th) should have the commit message
    const putBody = JSON.parse(mockFetch.mock.calls[3][1].body);
    expect(putBody.message).toBe("Update design system: Colors, Typography");
  });

  it("defaults to all sections when none provided", async () => {
    setupGitHubMocks();
    await handler(
      makeEvent({
        body: JSON.stringify({ css: SAMPLE_CSS_INPUT }),
        headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.208" },
      }),
    );

    const putBody = JSON.parse(mockFetch.mock.calls[3][1].body);
    expect(putBody.message).toBe("Update design system: Colors, Card Style, Typography, Alerts");
  });

  // ── GitHub API errors ──────────────────────────────────────────────────

  it("returns 500 when a GitHub API call fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    const result = await handler(
      makeEvent({
        headers: { origin: "https://themalive.com", "x-forwarded-for": "10.0.0.209" },
      }),
    );
    expect(result.statusCode).toBe(500);
    expect(parseBody(result).error).toContain("GitHub API 404");
  });
});
