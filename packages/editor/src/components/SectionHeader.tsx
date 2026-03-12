import { CustomSelect } from "./CustomSelect";

interface SectionHeaderAction {
  value: string;
  label: string;
  onClick: () => void;
}

interface SectionHeaderProps {
  title: string;
  sectionId: string;
  onToggleCss: () => void;
  onToggleTokens: () => void;
  onReset: () => void;
  cssActive: boolean;
  tokensActive: boolean;
  /** Brand color HSL string (e.g. "210 100% 50%") for active button styling */
  brandColor?: string;
  /** Foreground-for-background utility to compute contrasting text */
  fgForBg?: (hsl: string) => string;
  /** Extra actions added after Tokens in the mobile dropdown and as extra desktop buttons */
  extraActions?: SectionHeaderAction[];
}

export function SectionHeader({
  title,
  sectionId: _sectionId,
  onToggleCss,
  onToggleTokens,
  onReset,
  cssActive,
  tokensActive,
  brandColor,
  fgForBg,
  extraActions,
}: SectionHeaderProps) {
  const mobileOptions = [
    { value: "css", label: "CSS" },
    { value: "tokens", label: "Tokens" },
    ...(extraActions
      ? extraActions.map((a) => ({ value: a.value, label: a.label }))
      : []),
    { value: "reset", label: "Reset" },
  ];

  const handleMobileChange = (v: string) => {
    if (v === "css") onToggleCss();
    else if (v === "tokens") onToggleTokens();
    else if (v === "reset") onReset();
    else {
      const action = extraActions?.find((a) => a.value === v);
      action?.onClick();
    }
  };

  const activeBg = "hsl(var(--brand))";
  const activeColor =
    brandColor && fgForBg ? `hsl(${fgForBg(brandColor)})` : "#fff";
  const inactiveColor = "hsl(var(--muted-foreground))";

  return (
    <div
      className="flex items-center flex-wrap gap-2 sm:gap-4"
      data-axe-exclude
    >
      <h2
        className="text-[14px] sm:text-[16px] md:text-[20px] font-bold tracking-wider mb-[5px] flex items-baseline gap-2"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {title}{" "}
        <a
          href="#top"
          className="ds-h2-link opacity-30"
          aria-label="Back to top"
        >
          <svg
            className="w-[1em] h-[1em]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19V5m0 0l-7 7m7-7l7 7"
            />
          </svg>
        </a>
      </h2>
      <div className="ml-auto flex items-center">
        {/* Mobile: dropdown */}
        <CustomSelect
          ariaLabel={`${title} actions`}
          className="sm:hidden"
          placeholder="Actions\u2026"
          size="sm"
          width="120px"
          value=""
          onChange={handleMobileChange}
          options={mobileOptions}
        />
        {/* Desktop: buttons */}
        <div className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
          <div
            className="flex items-center rounded-lg overflow-hidden border"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <button
              onClick={onToggleCss}
              className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
              style={{
                backgroundColor: cssActive ? activeBg : "transparent",
                color: cssActive ? activeColor : inactiveColor,
              }}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span className="truncate">CSS</span>
            </button>
            <span
              className="w-px h-5"
              style={{ backgroundColor: "hsl(var(--border))" }}
            />
            <button
              onClick={onToggleTokens}
              className="h-10 px-2 sm:px-3 text-[14px] font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
              style={{
                backgroundColor: tokensActive ? activeBg : "transparent",
                color: tokensActive ? activeColor : inactiveColor,
              }}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16"
                />
              </svg>
              <span className="truncate">Tokens</span>
            </button>
          </div>
          {extraActions?.map((action) => (
            <button
              key={action.value}
              onClick={action.onClick}
              className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
              style={{ color: inactiveColor }}
            >
              <span className="truncate">{action.label}</span>
            </button>
          ))}
          <button
            onClick={onReset}
            className="h-10 px-2 sm:px-3 text-[14px] font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1"
            style={{ color: inactiveColor }}
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z"
              />
            </svg>
            <span className="truncate">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
