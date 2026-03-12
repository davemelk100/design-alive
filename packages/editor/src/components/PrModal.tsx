import React from "react";

export interface PrModalProps {
  prSections: Set<string>;
  setPrSections: React.Dispatch<React.SetStateAction<Set<string>>>;
  prError: string | null;
  sectionPrStatus: Record<
    string,
    {
      status: "idle" | "creating" | "created" | "error" | "rate-limited";
      url?: string;
      error?: string;
    }
  >;
  submitPr: (sections: Iterable<string>, statusKey: string) => void;
  onClose: () => void;
}

export function PrModal({
  prSections,
  setPrSections,
  prError,
  sectionPrStatus,
  submitPr,
  onClose,
}: PrModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 w-[340px] shadow-xl"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[18px] font-light mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Open Pull Request
        </h3>
        <p
          className="text-[14px] font-light mb-4"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Select sections to include:
        </p>
        <div className="flex flex-col gap-3 mb-6">
          {(
            [
              "colors",
              "card",
              "typography",
              "alerts",
              "buttons",
              "interactions",
            ] as const
          ).map((section) => {
            const labels: Record<string, string> = {
              colors: "Colors",
              card: "Cards",
              typography: "Typography",
              alerts: "Alerts",
              buttons: "Buttons",
              interactions: "Interactions",
            };
            return (
              <label
                key={section}
                className="flex items-center gap-3 cursor-pointer text-[14px] font-light"
              >
                <input
                  type="checkbox"
                  name="export-section"
                  checked={prSections.has(section)}
                  onChange={() => {
                    setPrSections((prev) => {
                      const next = new Set(prev);
                      if (next.has(section)) next.delete(section);
                      else next.add(section);
                      return next;
                    });
                  }}
                  className="w-4 h-4 rounded"
                />
                {labels[section]}
              </label>
            );
          })}
        </div>
        {prError && (
          <div
            className="text-[13px] font-light rounded-lg p-3 mb-4"
            style={{ backgroundColor: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
          >
            {prError}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: "transparent",
              color: "hsl(var(--card-foreground))",
            }}
          >
            Cancel
          </button>
          <button
            disabled={
              prSections.size === 0 ||
              sectionPrStatus["main"]?.status === "creating"
            }
            onClick={() => {
              submitPr(prSections, "main");
            }}
            className="px-4 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80 disabled:opacity-50"
            style={{
              backgroundColor: "hsl(var(--muted))",
              color: "hsl(var(--foreground))",
              boxShadow:
                "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {sectionPrStatus["main"]?.status === "creating"
              ? "Preparing..."
              : `Submit PR (${prSections.size})`}
          </button>
        </div>
      </div>
    </div>
  );
}
