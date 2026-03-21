import { hslStringToHex } from "../utils/styles/colorUtils";
import type { ContrastIssue } from "../utils/styles/colorUtils";

export interface ContrastResolutionPanelProps {
  issues: ContrastIssue[];
  onApplyOne: (issue: ContrastIssue) => void;
  onApplyAll: () => void;
  onDismiss: () => void;
}

export function ContrastResolutionPanel({
  issues,
  onApplyOne,
  onApplyAll,
  onDismiss,
}: ContrastResolutionPanelProps) {
  return (
    <>
      <div className="flex justify-center">
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#dc2626"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-base font-medium">
        {issues.length} Contrast Issue{issues.length !== 1 ? "s" : ""} Found
      </p>
      <div className="ds-audit-issue-list text-left">
        {issues.map((issue) => {
          const currentFgHex = hslStringToHex(issue.currentFgHsl);
          const currentBgHex = hslStringToHex(issue.currentBgHsl);
          const fixedFgHsl =
            issue.fixedKey === issue.fgKey
              ? issue.fixedValue
              : issue.currentFgHsl;
          const fixedBgHsl =
            issue.fixedKey === issue.bgKey
              ? issue.fixedValue
              : issue.currentBgHsl;
          const fixedFgHex = hslStringToHex(fixedFgHsl);
          const fixedBgHex = hslStringToHex(fixedBgHsl);

          const passes = issue.fixedRatio >= 4.5;
          return (
            <div
              key={`${issue.fgKey}:${issue.bgKey}`}
              className="ds-audit-issue-row"
            >
              {/* Current pair */}
              <div className="ds-audit-pair">
                <span
                  className="ds-audit-swatch"
                  title={`${issue.fgLabel}: ${currentFgHex}`}
                  style={{ backgroundColor: currentFgHex }}
                />
                <span
                  className="ds-audit-swatch"
                  title={`${issue.bgLabel}: ${currentBgHex}`}
                  style={{ backgroundColor: currentBgHex }}
                />
              </div>
              <span className="ds-audit-ratio-fail">
                {issue.currentRatio.toFixed(1)}:1
              </span>

              {/* Arrow */}
              <svg
                className="ds-audit-arrow w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5-5 5M6 12h12"
                />
              </svg>

              {/* Suggested pair */}
              <div className="ds-audit-pair">
                <span
                  className="ds-audit-swatch"
                  title={`${issue.fgLabel}: ${fixedFgHex}`}
                  style={{ backgroundColor: fixedFgHex }}
                />
                <span
                  className="ds-audit-swatch"
                  title={`${issue.bgLabel}: ${fixedBgHex}`}
                  style={{ backgroundColor: fixedBgHex }}
                />
              </div>
              <span className={passes ? "ds-audit-ratio-pass" : "ds-audit-ratio-fail"}>
                {issue.fixedRatio.toFixed(1)}:1
              </span>

              {/* Label */}
              <span className="ds-audit-pair-label">
                {issue.fgLabel} / {issue.bgLabel}
              </span>

              {/* Spacer + apply button */}
              <span className="flex-1" />
              <button
                className="ds-audit-btn-apply"
                onClick={() => onApplyOne(issue)}
              >
                Fix
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-xs font-light" style={{ color: "#737373" }}>
        Each row shows the failing text/background pair and its suggested fix.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onDismiss}
          className="px-4 py-2 text-sm font-light rounded-lg transition-colors ds-audit-btn-secondary"
        >
          Ignore
        </button>
        <button
          onClick={onApplyAll}
          className="px-4 py-2 text-sm font-light rounded-lg transition-colors ds-audit-btn-primary"
        >
          Fix All
        </button>
      </div>
    </>
  );
}
