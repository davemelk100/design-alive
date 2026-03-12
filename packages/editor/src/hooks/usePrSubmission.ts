import { useState, useCallback } from "react";

type SectionPrStatus = Record<
  string,
  {
    status: "idle" | "creating" | "created" | "error" | "rate-limited";
    url?: string;
    error?: string;
  }
>;

export function usePrSubmission(
  isPremium: boolean,
  prEndpointUrl: string | undefined,
  buildSectionCss: (sections: Iterable<string>) => string,
) {
  const [showPrModal, setShowPrModal] = useState(false);
  const [prError, setPrError] = useState<string | null>(null);
  const [prSections, setPrSections] = useState<Set<string>>(
    new Set(["colors", "card", "typography", "alerts", "buttons", "interactions"]),
  );
  const [sectionPrStatus, setSectionPrStatus] = useState<SectionPrStatus>({});

  const submitPr = useCallback(
    async (sections: Iterable<string>, statusKey: string) => {
      if (!isPremium) return;
      if (!prEndpointUrl) {
        setPrError("No prEndpointUrl prop provided. Pass prEndpointUrl to the editor to enable PR creation.");
        return;
      }
      setPrError(null);
      setSectionPrStatus((prev) => ({
        ...prev,
        [statusKey]: { status: "creating" },
      }));
      const popup = window.open("about:blank", "_blank");
      try {
        const css = buildSectionCss(sections);
        const sectionArr = [...sections];
        const res = await fetch(prEndpointUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ css, sections: sectionArr }),
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
          window.open(data.url as string, "_blank");
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
    [isPremium, prEndpointUrl, buildSectionCss],
  );

  const openPrModal = useCallback(() => {
    setPrSections(new Set());
    setPrError(null);
    setShowPrModal(true);
  }, []);

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
  };
}
