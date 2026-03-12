function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface ExportCodeBlockProps {
  visible: boolean;
  code: string;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
  /** Label shown in the header bar (e.g. "Button CSS", "Design Tokens") */
  label: string;
  /** Muted color HSL string for computing copy/close button text contrast */
  mutedColor?: string;
  /** Foreground-for-background utility to compute contrasting text */
  fgForBg?: (hsl: string) => string;
}

export function ExportCodeBlock({
  visible,
  code,
  copied,
  onCopy,
  onClose,
  label,
  mutedColor,
  fgForBg,
}: ExportCodeBlockProps) {
  if (!visible) return null;

  const buttonTextColor =
    mutedColor && fgForBg
      ? `hsl(${fgForBg(mutedColor)})`
      : "hsl(var(--muted-foreground))";

  return (
    <div
      className="rounded-lg border ds-border"
    >
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b ds-border"
      >
        <span
          className="text-sm font-light uppercase tracking-wider ds-text-card"
        >
          {label}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            aria-label="Copy"
            className="p-1 rounded-lg transition-colors hover:opacity-80 ds-bg-muted"
            style={{
              color: buttonTextColor,
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg transition-colors hover:opacity-80 ds-bg-muted"
            style={{
              color: buttonTextColor,
            }}
          >
            <XIcon />
          </button>
        </div>
      </div>
      <pre
        className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono ds-text-card"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
