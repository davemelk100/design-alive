/// <reference types="vitest/globals" />
import { renderHook, act } from "@testing-library/react";
import { usePrSubmission } from "../hooks/usePrSubmission";
import type { GitHubConfig } from "../utils/githubApi";

// Mock the github modules
vi.mock("../utils/githubApi", () => ({
  createDesignPr: vi.fn(),
}));

vi.mock("../utils/githubAuth", () => ({
  getStoredAuth: vi.fn(),
  startOAuthFlow: vi.fn(),
}));

// Import mocked functions for control in tests
import { createDesignPr } from "../utils/githubApi";
import { getStoredAuth, startOAuthFlow } from "../utils/githubAuth";

const mockedCreateDesignPr = vi.mocked(createDesignPr);
const mockedGetStoredAuth = vi.mocked(getStoredAuth);
const mockedStartOAuthFlow = vi.mocked(startOAuthFlow);

const buildSectionCss = vi.fn(() => "/* generated css */");

const GITHUB_CONFIG: GitHubConfig = {
  clientId: "test-client-id",
  repo: "owner/repo",
};

const PR_ENDPOINT = "https://example.com/api/create-pr";

describe("usePrSubmission", () => {
  let windowOpenSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    windowOpenSpy = vi.spyOn(window, "open").mockReturnValue(null);
    global.fetch = vi.fn();
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  // ---------- 1. Initial state ----------

  describe("initial state", () => {
    it("has showPrModal false", () => {
      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );
      expect(result.current.showPrModal).toBe(false);
    });

    it("has no prError", () => {
      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );
      expect(result.current.prError).toBeNull();
    });

    it("has default sections", () => {
      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );
      const sections = result.current.prSections;
      expect(sections).toBeInstanceOf(Set);
      expect(sections).toContain("colors");
      expect(sections).toContain("card");
      expect(sections).toContain("typography");
      expect(sections).toContain("alerts");
      expect(sections).toContain("buttons");
      expect(sections).toContain("interactions");
      expect(sections.size).toBe(6);
    });

    it("has empty sectionPrStatus", () => {
      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );
      expect(result.current.sectionPrStatus).toEqual({});
    });
  });

  // ---------- 2. openPrModal ----------

  describe("openPrModal", () => {
    it("clears sections, clears error, and sets showPrModal to true", () => {
      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      // Sections start with defaults
      expect(result.current.prSections.size).toBe(6);

      act(() => result.current.openPrModal());

      expect(result.current.showPrModal).toBe(true);
      expect(result.current.prError).toBeNull();
      expect(result.current.prSections.size).toBe(0);
    });

    it("clears a pre-existing error", async () => {
      const { result } = renderHook(() =>
        usePrSubmission(undefined, undefined, undefined, buildSectionCss),
      );

      // Trigger an error first (no endpoint and no githubConfig)
      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });
      expect(result.current.prError).toBeTruthy();

      // openPrModal should clear it
      act(() => result.current.openPrModal());
      expect(result.current.prError).toBeNull();
    });
  });

  // ---------- 3. submitPr with prEndpointUrl ----------

  describe("submitPr with prEndpointUrl", () => {
    it("creates PR on success and opens the URL", async () => {
      const prUrl = "https://github.com/owner/repo/pull/42";
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ url: prUrl }),
      } as Response);

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      // Open modal first so showPrModal is true
      act(() => result.current.openPrModal());
      expect(result.current.showPrModal).toBe(true);

      await act(async () => {
        await result.current.submitPr(["colors", "typography"], "all");
      });

      // Should have called fetch with the right payload (no api key)
      expect(global.fetch).toHaveBeenCalledWith(PR_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          css: "/* generated css */",
          sections: ["colors", "typography"],
          includeIntegration: undefined,
        }),
      });

      // buildSectionCss was called with the sections
      expect(buildSectionCss).toHaveBeenCalledWith(["colors", "typography"]);

      // Status should be "created" with the URL
      expect(result.current.sectionPrStatus.all).toEqual({
        status: "created",
        url: prUrl,
      });

      // Modal should close on success
      expect(result.current.showPrModal).toBe(false);
      expect(result.current.prError).toBeNull();
    });

    it("sends x-api-key header when prApiKey is provided", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ url: "https://github.com/owner/repo/pull/99" }),
      } as Response);

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, "my-secret-key", undefined, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(global.fetch).toHaveBeenCalledWith(PR_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "my-secret-key" },
        body: JSON.stringify({
          css: "/* generated css */",
          sections: ["colors"],
          includeIntegration: undefined,
        }),
      });
    });

    it("handles non-OK response with error message from server", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Server exploded" }),
      } as Response);

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(result.current.prError).toBe("Server exploded");
      expect(result.current.sectionPrStatus.all).toEqual({ status: "error" });
    });

    it("handles non-OK response without error field", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response);

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(result.current.prError).toBe(
        "PR endpoint returned 404. Make sure prEndpointUrl points to a running server.",
      );
      expect(result.current.sectionPrStatus.all).toEqual({ status: "error" });
    });

    it("handles non-JSON response body gracefully", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: async (): Promise<Record<string, unknown>> => {
          throw new Error("not JSON");
        },
      } as Response);

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      // data is {} so no data.error string, falls back to status message
      expect(result.current.prError).toBe(
        "PR endpoint returned 502. Make sure prEndpointUrl points to a running server.",
      );
    });

    it("handles 429 rate-limited response", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: "Too many requests" }),
      } as Response);

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(result.current.sectionPrStatus.all).toEqual({
        status: "rate-limited",
        error: "Too many requests",
      });
      // prError should NOT be set for rate limiting (early return)
      expect(result.current.prError).toBeNull();
    });

    it("handles network error", async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network failure"));

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(result.current.prError).toBe("Network failure");
      expect(result.current.sectionPrStatus.all).toEqual({ status: "error" });
    });

    it("handles non-Error thrown objects in catch", async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce("string error");

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(result.current.prError).toBe("Failed to create PR");
    });

    it("opens a blank popup before fetch and redirects it on success", async () => {
      const mockPopup = { location: { href: "" }, close: vi.fn() };
      windowOpenSpy.mockReturnValueOnce(mockPopup as unknown as Window);

      const prUrl = "https://github.com/owner/repo/pull/1";
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ url: prUrl }),
      } as Response);

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      // First call is the popup open with about:blank
      expect(windowOpenSpy).toHaveBeenCalledWith("about:blank", "_blank");
      // Popup location should be redirected
      expect(mockPopup.location.href).toBe(prUrl);
    });

    it("closes popup on error", async () => {
      const mockPopup = { location: { href: "" }, close: vi.fn() };
      windowOpenSpy.mockReturnValueOnce(mockPopup as unknown as Window);

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "fail" }),
      } as Response);

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(mockPopup.close).toHaveBeenCalled();
    });

    it("sets status to creating before fetch completes", async () => {
      let resolveFetch!: (value: Response) => void;
      vi.mocked(global.fetch).mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
      );

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );

      // Start the submission but don't await
      let promise: Promise<void>;
      act(() => {
        promise = result.current.submitPr(["colors"], "myKey");
      });

      // Status should be "creating" while fetch is in-flight
      expect(result.current.sectionPrStatus.myKey).toEqual({ status: "creating" });

      // Resolve to finish up
      await act(async () => {
        resolveFetch({
          ok: true,
          status: 200,
          json: async () => ({ url: "https://example.com" }),
        } as Response);
        await promise!;
      });
    });
  });

  // ---------- 4. submitPr with githubConfig ----------

  describe("submitPr with githubConfig", () => {
    it("uses stored auth and creates PR on success", async () => {
      const compareUrl = "https://github.com/owner/repo/compare/main...design-tokens";
      mockedGetStoredAuth.mockReturnValueOnce({
        access_token: "gho_abc123",
        username: "testuser",
        stored_at: "2024-01-01",
      });
      mockedCreateDesignPr.mockResolvedValueOnce(compareUrl);

      const { result } = renderHook(() =>
        usePrSubmission(undefined, undefined, GITHUB_CONFIG, buildSectionCss),
      );

      act(() => result.current.openPrModal());

      await act(async () => {
        await result.current.submitPr(["colors", "buttons"], "all");
      });

      expect(mockedGetStoredAuth).toHaveBeenCalled();
      expect(mockedCreateDesignPr).toHaveBeenCalledWith(
        GITHUB_CONFIG,
        "gho_abc123",
        "/* generated css */",
        ["colors", "buttons"],
        undefined,
      );
      expect(result.current.sectionPrStatus.all).toEqual({
        status: "created",
        url: compareUrl,
      });
      expect(result.current.showPrModal).toBe(false);
      expect(windowOpenSpy).toHaveBeenCalledWith(compareUrl, "_blank");
    });

    it("triggers OAuth flow when no stored auth", async () => {
      const compareUrl = "https://github.com/owner/repo/compare/main...tokens";
      mockedGetStoredAuth.mockReturnValueOnce(null);
      mockedStartOAuthFlow.mockResolvedValueOnce({
        access_token: "gho_new",
        username: "newuser",
        stored_at: "2024-01-01",
      });
      mockedCreateDesignPr.mockResolvedValueOnce(compareUrl);

      const { result } = renderHook(() =>
        usePrSubmission(undefined, undefined, GITHUB_CONFIG, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(mockedStartOAuthFlow).toHaveBeenCalledWith(GITHUB_CONFIG);
      expect(mockedCreateDesignPr).toHaveBeenCalledWith(
        GITHUB_CONFIG,
        "gho_new",
        "/* generated css */",
        ["colors"],
        undefined,
      );
      expect(result.current.sectionPrStatus.all).toEqual({
        status: "created",
        url: compareUrl,
      });
    });

    it("handles createDesignPr error", async () => {
      mockedGetStoredAuth.mockReturnValueOnce({
        access_token: "gho_abc",
        username: "testuser",
        stored_at: "2024-01-01",
      });
      mockedCreateDesignPr.mockRejectedValueOnce(new Error("GitHub API error"));

      const { result } = renderHook(() =>
        usePrSubmission(undefined, undefined, GITHUB_CONFIG, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(result.current.prError).toBe("GitHub API error");
      expect(result.current.sectionPrStatus.all).toEqual({ status: "error" });
    });

    it("handles OAuth flow error", async () => {
      mockedGetStoredAuth.mockReturnValueOnce(null);
      mockedStartOAuthFlow.mockRejectedValueOnce(new Error("OAuth popup closed"));

      const { result } = renderHook(() =>
        usePrSubmission(undefined, undefined, GITHUB_CONFIG, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(result.current.prError).toBe("OAuth popup closed");
      expect(result.current.sectionPrStatus.all).toEqual({ status: "error" });
    });

    it("handles non-Error thrown in github flow", async () => {
      mockedGetStoredAuth.mockReturnValueOnce(null);
      mockedStartOAuthFlow.mockRejectedValueOnce("unexpected");

      const { result } = renderHook(() =>
        usePrSubmission(undefined, undefined, GITHUB_CONFIG, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(result.current.prError).toBe("Failed to create PR");
    });

    it("does not call fetch when using githubConfig", async () => {
      mockedGetStoredAuth.mockReturnValueOnce({
        access_token: "gho_abc",
        username: "testuser",
        stored_at: "2024-01-01",
      });
      mockedCreateDesignPr.mockResolvedValueOnce("https://example.com");

      const { result } = renderHook(() =>
        usePrSubmission(undefined, undefined, GITHUB_CONFIG, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("prefers githubConfig over prEndpointUrl when both are provided", async () => {
      mockedGetStoredAuth.mockReturnValueOnce({
        access_token: "gho_abc",
        username: "testuser",
        stored_at: "2024-01-01",
      });
      mockedCreateDesignPr.mockResolvedValueOnce("https://example.com");

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, GITHUB_CONFIG, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      // Should use githubConfig path, not fetch
      expect(mockedCreateDesignPr).toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // ---------- 5. submitPr with neither endpoint nor githubConfig ----------

  describe("submitPr with no prEndpointUrl or githubConfig", () => {
    it("sets an error message", async () => {
      const { result } = renderHook(() =>
        usePrSubmission(undefined, undefined, undefined, buildSectionCss),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all");
      });

      expect(result.current.prError).toBe(
        "No prEndpointUrl or githubConfig prop provided. Pass one to enable PR creation.",
      );
      expect(global.fetch).not.toHaveBeenCalled();
      expect(result.current.sectionPrStatus).toEqual({});
    });
  });

  // ---------- 6. includeIntegration state ----------

  describe("includeIntegration", () => {
    it("defaults to false when no defaultIncludeIntegration", () => {
      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss),
      );
      expect(result.current.includeIntegration).toBe(false);
    });

    it("defaults to true when defaultIncludeIntegration is true", () => {
      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss, true),
      );
      expect(result.current.includeIntegration).toBe(true);
    });

    it("openPrModal resets includeIntegration to default", () => {
      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss, true),
      );

      // Toggle it off
      act(() => result.current.setIncludeIntegration(false));
      expect(result.current.includeIntegration).toBe(false);

      // Open modal resets to default (true)
      act(() => result.current.openPrModal());
      expect(result.current.includeIntegration).toBe(true);
    });

    it("passes includeIntegration to createDesignPr via githubConfig flow", async () => {
      mockedGetStoredAuth.mockReturnValueOnce({
        access_token: "gho_abc",
        username: "testuser",
        stored_at: "2024-01-01",
      });
      mockedCreateDesignPr.mockResolvedValueOnce("https://example.com");

      const { result } = renderHook(() =>
        usePrSubmission(undefined, undefined, GITHUB_CONFIG, buildSectionCss, true),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all", true);
      });

      expect(mockedCreateDesignPr).toHaveBeenCalledWith(
        GITHUB_CONFIG,
        "gho_abc",
        "/* generated css */",
        ["colors"],
        true,
      );
    });

    it("includes includeIntegration in server-side endpoint body", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ url: "https://example.com" }),
      } as Response);

      const { result } = renderHook(() =>
        usePrSubmission(PR_ENDPOINT, undefined, undefined, buildSectionCss, true),
      );

      await act(async () => {
        await result.current.submitPr(["colors"], "all", true);
      });

      const fetchBody = JSON.parse(
        (vi.mocked(global.fetch).mock.calls[0][1] as RequestInit).body as string,
      );
      expect(fetchBody.includeIntegration).toBe(true);
    });
  });
});
