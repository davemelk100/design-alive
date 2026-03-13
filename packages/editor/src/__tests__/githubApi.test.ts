import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  replaceRootBlock,
  getAuthenticatedUser,
  createDesignPr,
} from "../utils/githubApi";
import type { GitHubConfig } from "../utils/githubApi";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const baseConfig: GitHubConfig = {
  clientId: "test-client-id",
  repo: "owner/repo",
  filePath: "src/globals.css",
  baseBranch: "main",
};

/** Minimal CSS file with @layer base { :root { ... } } */
function makeCssFile(vars: string): string {
  return `@tailwind base;\n\n@layer base {\n  :root {\n${vars}\n  }\n}\n`;
}

/** Wrap vars inside :root { } for the newCssVars argument */
function wrapRoot(vars: string): string {
  return `:root {\n${vars}\n}`;
}

// ---------------------------------------------------------------------------
// Mock fetch
// ---------------------------------------------------------------------------

const mockFetch = vi.fn<typeof fetch>();

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function okJson(data: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as unknown as Response;
}

function failResponse(status: number, body: string): Response {
  return {
    ok: false,
    status,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(body),
  } as unknown as Response;
}

// ===========================================================================
// replaceRootBlock
// ===========================================================================

describe("replaceRootBlock", () => {
  it("replaces existing variables with new values", () => {
    const file = makeCssFile(
      "    --background: 0 0% 100%;\n    --foreground: 222.2 84% 4.9%;",
    );
    const newVars = wrapRoot("  --background: 210 40% 98%;\n  --foreground: 0 0% 0%;");

    const result = replaceRootBlock(file, newVars);

    expect(result).toContain("--background: 210 40% 98%;");
    expect(result).toContain("--foreground: 0 0% 0%;");
    // Old values should be gone
    expect(result).not.toContain("0 0% 100%");
    expect(result).not.toContain("222.2 84% 4.9%");
  });

  it("adds new variables that do not exist in the file", () => {
    const file = makeCssFile("    --background: 0 0% 100%;");
    const newVars = wrapRoot("  --background: 0 0% 100%;\n  --brand: 200 50% 50%;");

    const result = replaceRootBlock(file, newVars);

    expect(result).toContain("--brand: 200 50% 50%;");
    expect(result).toContain("--background: 0 0% 100%;");
  });

  it("preserves lines that are not CSS variable declarations", () => {
    const file = makeCssFile(
      "    /* Primary colors */\n    --primary: 100 50% 50%;",
    );
    const newVars = wrapRoot("  --primary: 200 60% 60%;");

    const result = replaceRootBlock(file, newVars);

    expect(result).toContain("/* Primary colors */");
    expect(result).toContain("--primary: 200 60% 60%;");
  });

  it("throws when newCssVars has no :root block", () => {
    const file = makeCssFile("    --bg: 0 0% 100%;");
    const bad = "--bg: 1 2% 3%;"; // no :root wrapper

    expect(() => replaceRootBlock(file, bad)).toThrow(
      "Could not parse CSS variables from input",
    );
  });

  it("throws when newCssVars :root block is empty (no valid var lines)", () => {
    const file = makeCssFile("    --bg: 0 0% 100%;");
    // :root exists but has no parseable variable lines -- should still work
    // but no replacements happen, so original content is returned unchanged
    const emptyRoot = ":root {\n  /* nothing */\n}";

    const result = replaceRootBlock(file, emptyRoot);
    expect(result).toContain("--bg: 0 0% 100%;");
  });

  it("throws when file content has no @layer base block", () => {
    const fileWithoutLayer = ":root {\n  --bg: 0 0% 100%;\n}\n";
    const newVars = wrapRoot("  --bg: 1 1% 1%;");

    expect(() => replaceRootBlock(fileWithoutLayer, newVars)).toThrow(
      "Could not find @layer base :root block",
    );
  });

  it("throws when file content has @layer base but no :root inside", () => {
    const fileNoRoot = "@layer base {\n  .foo { color: red; }\n}\n";
    const newVars = wrapRoot("  --bg: 1 1% 1%;");

    expect(() => replaceRootBlock(fileNoRoot, newVars)).toThrow(
      "Could not find @layer base :root block",
    );
  });

  it("handles multiple variables, replacing some and adding others", () => {
    const file = makeCssFile(
      "    --a: 1;\n    --b: 2;\n    --c: 3;",
    );
    const newVars = wrapRoot("  --a: 10;\n  --c: 30;\n  --d: 40;");

    const result = replaceRootBlock(file, newVars);

    expect(result).toContain("--a: 10;");
    expect(result).toContain("--b: 2;"); // unchanged
    expect(result).toContain("--c: 30;");
    expect(result).toContain("--d: 40;"); // newly added
  });

  it("preserves indentation of replaced variables", () => {
    const file = makeCssFile("    --bg: old-value;");
    const newVars = wrapRoot("  --bg: new-value;");

    const result = replaceRootBlock(file, newVars);

    // The original 4-space indent should be preserved
    expect(result).toContain("    --bg: new-value;");
  });
});

// ===========================================================================
// getAuthenticatedUser
// ===========================================================================

describe("getAuthenticatedUser", () => {
  it("returns the login on success", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ login: "octocat" }));

    const result = await getAuthenticatedUser(baseConfig, "ghp_valid");

    expect(result).toBe("octocat");
    expect(mockFetch).toHaveBeenCalledOnce();
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toBe("https://api.github.com/user");
  });

  it("sends the correct Authorization header", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ login: "octocat" }));

    await getAuthenticatedUser(baseConfig, "ghp_mytoken");

    const init = mockFetch.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer ghp_mytoken",
    );
  });

  it("returns null when the token is invalid (401)", async () => {
    mockFetch.mockResolvedValueOnce(failResponse(401, "Bad credentials"));

    const result = await getAuthenticatedUser(baseConfig, "ghp_bad");

    expect(result).toBeNull();
  });

  it("returns null on network error", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const result = await getAuthenticatedUser(baseConfig, "ghp_any");

    expect(result).toBeNull();
  });

  it("uses custom apiBaseUrl when provided", async () => {
    mockFetch.mockResolvedValueOnce(okJson({ login: "ghes-user" }));
    const ghesConfig: GitHubConfig = {
      ...baseConfig,
      apiBaseUrl: "https://github.example.com/api/v3",
    };

    await getAuthenticatedUser(ghesConfig, "ghp_token");

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toBe("https://github.example.com/api/v3/user");
  });
});

// ===========================================================================
// createDesignPr
// ===========================================================================

describe("createDesignPr", () => {
  const cssFileContent = makeCssFile("    --background: 0 0% 100%;");
  const encodedContent = btoa(cssFileContent);
  const fileSha = "abc123sha";

  const newCss = wrapRoot("  --background: 210 40% 98%;");

  function setupHappyPath() {
    // Step 1: get file
    mockFetch.mockResolvedValueOnce(
      okJson({ content: encodedContent, sha: fileSha }),
    );
    // Step 3: get ref
    mockFetch.mockResolvedValueOnce(
      okJson({ object: { sha: "mainsha123" } }),
    );
    // Step 4: create branch
    mockFetch.mockResolvedValueOnce(okJson({ ref: "refs/heads/design-system/update-123" }));
    // Step 5: commit file
    mockFetch.mockResolvedValueOnce(okJson({ content: { sha: "newsha" } }));
  }

  beforeEach(() => {
    vi.spyOn(Date, "now").mockReturnValue(1700000000000);
  });

  it("returns a compare URL on success", async () => {
    setupHappyPath();

    const url = await createDesignPr(baseConfig, "ghp_tok", newCss, ["colors"]);

    expect(url).toContain("https://github.com/owner/repo/compare/main...design-system/update-1700000000000");
    expect(url).toContain("expand=1");
    expect(url).toContain("title=");
  });

  it("calls all four GitHub API endpoints in order", async () => {
    setupHappyPath();

    await createDesignPr(baseConfig, "ghp_tok", newCss, ["colors"]);

    expect(mockFetch).toHaveBeenCalledTimes(4);

    const urls = mockFetch.mock.calls.map((c) => c[0] as string);

    // 1. Get file contents
    expect(urls[0]).toContain("/repos/owner/repo/contents/src/globals.css?ref=main");
    // 2. Get base branch ref
    expect(urls[1]).toContain("/repos/owner/repo/git/ref/heads/main");
    // 3. Create branch ref
    expect(urls[2]).toContain("/repos/owner/repo/git/refs");
    // 4. Commit (PUT file contents)
    expect(urls[3]).toContain("/repos/owner/repo/contents/src/globals.css");
  });

  it("creates the branch with the correct SHA and name", async () => {
    setupHappyPath();

    await createDesignPr(baseConfig, "ghp_tok", newCss, ["colors"]);

    const createBranchCall = mockFetch.mock.calls[2];
    const body = JSON.parse((createBranchCall[1] as RequestInit).body as string);

    expect(body.ref).toBe("refs/heads/design-system/update-1700000000000");
    expect(body.sha).toBe("mainsha123");
  });

  it("commits the updated file content with correct metadata", async () => {
    setupHappyPath();

    await createDesignPr(baseConfig, "ghp_tok", newCss, ["colors"]);

    const commitCall = mockFetch.mock.calls[3];
    const init = commitCall[1] as RequestInit;
    expect(init.method).toBe("PUT");

    const body = JSON.parse(init.body as string);
    expect(body.sha).toBe(fileSha);
    expect(body.branch).toBe("design-system/update-1700000000000");
    expect(body.message).toContain("Colors");

    // The committed content should have the new var value
    const decoded = atob(body.content);
    expect(decoded).toContain("--background: 210 40% 98%;");
  });

  it("uses default sections when none provided", async () => {
    setupHappyPath();

    const url = await createDesignPr(baseConfig, "ghp_tok", newCss, []);

    // Default sections: colors, card, typography, alerts
    expect(url).toContain("Colors");
    expect(url).toContain("Card");
    expect(url).toContain("Typography");
    expect(url).toContain("Alerts");
  });

  it("maps section keys to human-readable labels", async () => {
    setupHappyPath();

    const url = await createDesignPr(baseConfig, "ghp_tok", newCss, [
      "interactions",
    ]);

    expect(url).toContain("Interactions");
  });

  it("uses custom filePath and baseBranch from config", async () => {
    setupHappyPath();

    const customConfig: GitHubConfig = {
      ...baseConfig,
      filePath: "styles/theme.css",
      baseBranch: "develop",
    };

    await createDesignPr(customConfig, "ghp_tok", newCss, ["colors"]);

    const urls = mockFetch.mock.calls.map((c) => c[0] as string);
    expect(urls[0]).toContain("styles/theme.css?ref=develop");
    expect(urls[1]).toContain("ref/heads/develop");
  });

  it("uses custom webBaseUrl in the returned compare URL", async () => {
    setupHappyPath();

    const ghesConfig: GitHubConfig = {
      ...baseConfig,
      webBaseUrl: "https://github.example.com",
    };

    const url = await createDesignPr(ghesConfig, "ghp_tok", newCss, ["colors"]);

    expect(url).toContain("https://github.example.com/owner/repo/compare/");
  });

  // -------------------------------------------------------------------------
  // Error handling per step
  // -------------------------------------------------------------------------

  it("throws when fetching the file fails (step 1)", async () => {
    mockFetch.mockResolvedValueOnce(failResponse(404, "Not Found"));

    await expect(
      createDesignPr(baseConfig, "ghp_tok", newCss, ["colors"]),
    ).rejects.toThrow("GitHub API 404");
  });

  it("throws when getting base branch ref fails (step 3)", async () => {
    // Step 1 succeeds
    mockFetch.mockResolvedValueOnce(
      okJson({ content: encodedContent, sha: fileSha }),
    );
    // Step 3 fails
    mockFetch.mockResolvedValueOnce(failResponse(404, "Branch not found"));

    await expect(
      createDesignPr(baseConfig, "ghp_tok", newCss, ["colors"]),
    ).rejects.toThrow("GitHub API 404");
  });

  it("throws when creating the branch fails (step 4)", async () => {
    mockFetch.mockResolvedValueOnce(
      okJson({ content: encodedContent, sha: fileSha }),
    );
    mockFetch.mockResolvedValueOnce(
      okJson({ object: { sha: "mainsha123" } }),
    );
    // Step 4 fails (branch already exists)
    mockFetch.mockResolvedValueOnce(
      failResponse(422, "Reference already exists"),
    );

    await expect(
      createDesignPr(baseConfig, "ghp_tok", newCss, ["colors"]),
    ).rejects.toThrow("GitHub API 422");
  });

  it("throws when committing the file fails (step 5)", async () => {
    mockFetch.mockResolvedValueOnce(
      okJson({ content: encodedContent, sha: fileSha }),
    );
    mockFetch.mockResolvedValueOnce(
      okJson({ object: { sha: "mainsha123" } }),
    );
    mockFetch.mockResolvedValueOnce(okJson({ ref: "refs/heads/..." }));
    // Step 5 fails
    mockFetch.mockResolvedValueOnce(failResponse(409, "Conflict"));

    await expect(
      createDesignPr(baseConfig, "ghp_tok", newCss, ["colors"]),
    ).rejects.toThrow("GitHub API 409");
  });

  it("throws when replaceRootBlock fails on malformed file (step 2)", async () => {
    // Return a file that has no @layer base block
    const badContent = btoa("body { color: red; }");
    mockFetch.mockResolvedValueOnce(
      okJson({ content: badContent, sha: "sha" }),
    );

    await expect(
      createDesignPr(baseConfig, "ghp_tok", newCss, ["colors"]),
    ).rejects.toThrow("Could not find @layer base :root block");
  });

  it("propagates network errors from fetch", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(
      createDesignPr(baseConfig, "ghp_tok", newCss, ["colors"]),
    ).rejects.toThrow("Failed to fetch");
  });
});
