import { useState, useCallback } from "react";
import type { GitHubConfig } from "../utils/githubApi";
import { createDesignPr } from "../utils/githubApi";
import { getStoredAuth, startOAuthFlow } from "../utils/githubAuth";

function isNativeCapacitor(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cap = (window as any).Capacitor;
    return cap != null && typeof cap.isNativePlatform === "function" && cap.isNativePlatform();
  } catch { return false; }
}

async function openUrl(url: string): Promise<void> {
  if (isNativeCapacitor()) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({ url });
  } else {
    window.open(url, "_blank");
  }
}

type SectionPrStatus = Record<
  string,
  {
    status: "idle" | "creating" | "created" | "error" | "rate-limited";
    url?: string;
    error?: string;
  }
>;

export function usePrSubmission(
  prEndpointUrl: string | undefined,
  prApiKey: string | undefined,
  githubConfig: GitHubConfig | undefined,
  buildSectionCss: (sections: Iterable<string>) => string,
  defaultIncludeIntegration = false,
) {
  const [showPrModal, setShowPrModal] = useState(false);
  const [prError, setPrError] = useState<string | null>(null);
  const [prSections, setPrSections] = useState<Set<string>>(
    new Set(["colors", "card", "typography", "alerts", "buttons", "interactions"]),
  );
  const [sectionPrStatus, setSectionPrStatus] = useState<SectionPrStatus>({});
  const [includeIntegration, setIncludeIntegration] = useState(defaultIncludeIntegration);

  const submitPr = useCallback(
    async (sections: Iterable<string>, statusKey: string, integration?: boolean) => {
      if (!prEndpointUrl && !githubConfig) {
        setPrError("No prEndpointUrl or githubConfig prop provided. Pass one to enable PR creation.");
        return;
      }
      setPrError(null);
      setSectionPrStatus((prev) => ({
        ...prev,
        [statusKey]: { status: "creating" },
      }));

      const css = buildSectionCss(sections);
      const sectionArr = [...sections];

      // Client-side GitHub API flow
      if (githubConfig) {
        try {
          let auth = getStoredAuth();
          if (!auth) {
            auth = await startOAuthFlow(githubConfig);
          }
          const compareUrl = await createDesignPr(githubConfig, auth.access_token, css, sectionArr, integration);
          setSectionPrStatus((prev) => ({
            ...prev,
            [statusKey]: { status: "created", url: compareUrl },
          }));
          setShowPrModal(false);
          openUrl(compareUrl);
        } catch (err) {
          setSectionPrStatus((prev) => ({
            ...prev,
            [statusKey]: { status: "error" },
          }));
          setPrError(err instanceof Error ? err.message : "Failed to create PR");
        }
        return;
      }

      // Server-side endpoint flow
      const popup = isNativeCapacitor() ? null : window.open("about:blank", "_blank");
      try {
        const res = await fetch(prEndpointUrl!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(prApiKey ? { "x-api-key": prApiKey } : {}),
          },
          body: JSON.stringify({ css, sections: sectionArr, includeIntegration: integration }),
        });
        let data: Record<string, unknown> = {};
        try {
          data = await res.json();
        } catch {
          // Response wasn't JSON (e.g. 404 HTML page)
        }
        if (!res.ok) {
          const msg =
            typeof data.error === "string"
              ? data.error
              : `PR endpoint returned ${res.status}. Make sure prEndpointUrl points to a running server.`;
          if (res.status === 429) {
            setSectionPrStatus((prev) => ({
              ...prev,
              [statusKey]: { status: "rate-limited", error: msg },
            }));
            popup?.close();
            return;
          }
          setPrError(msg);
          setSectionPrStatus((prev) => ({
            ...prev,
            [statusKey]: { status: "error" },
          }));
          popup?.close();
          return;
        }
        setSectionPrStatus((prev) => ({
          ...prev,
          [statusKey]: { status: "created", url: data.url as string },
        }));
        setShowPrModal(false);
        if (popup) {
          popup.location.href = data.url as string;
        } else {
          openUrl(data.url as string);
        }
      } catch (err) {
        setSectionPrStatus((prev) => ({
          ...prev,
          [statusKey]: { status: "error" },
        }));
        setPrError(err instanceof Error ? err.message : "Failed to create PR");
        popup?.close();
      }
    },
    [prEndpointUrl, prApiKey, githubConfig, buildSectionCss],
  );

  const openPrModal = useCallback(() => {
    setPrSections(new Set());
    setPrError(null);
    setIncludeIntegration(defaultIncludeIntegration);
    setShowPrModal(true);
  }, [defaultIncludeIntegration]);

  return {
    showPrModal,
    setShowPrModal,
    prError,
    prSections,
    setPrSections,
    sectionPrStatus,
    setSectionPrStatus,
    submitPr,
    openPrModal,
    includeIntegration,
    setIncludeIntegration,
  };
}
