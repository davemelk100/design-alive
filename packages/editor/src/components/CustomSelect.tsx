import { useState, useRef, useEffect } from "react";

interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  width?: string;
  size?: "sm" | "md";
  /** When set, shows this text as the trigger label and doesn't highlight any option as selected */
  placeholder?: string;
  /** Options that should be conditionally shown — pass full filtered options array directly */
  dropUp?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
  disabled = false,
  width,
  size = "md",
  placeholder,
  dropUp = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close, true);
    return () => document.removeEventListener("click", close, true);
  }, [open]);

  const isActionMenu = placeholder !== undefined;
  const displayLabel = isActionMenu
    ? placeholder
    : (options.find((o) => o.value === value)?.label ?? value);
  const h = size === "sm" ? "h-8" : "h-9";
  const text = size === "sm" ? "text-xs" : "text-sm";
  const px = size === "sm" ? "px-2" : "px-3";
  const py = size === "sm" ? "py-1" : "py-2";

  return (
    <div ref={ref} className={`relative ${className}`} style={width ? { width } : undefined}>
      <button
        type="button"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`ds-input w-full ${px} ${py} ${h} ${text} font-light rounded-md border text-left flex items-center justify-between gap-1 ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        style={{
          backgroundColor: disabled ? "hsl(var(--muted))" : "hsl(var(--background))",
          color: disabled ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))",
          borderColor: open ? "hsl(var(--ring))" : "hsl(var(--border))",
          boxShadow: open ? "0 0 0 2px hsl(var(--ring))" : "none",
        }}
      >
        <span className="truncate">{displayLabel}</span>
        <svg
          className="w-3.5 h-3.5 flex-shrink-0 ds-text-muted"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.15s",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className={`absolute z-30 w-full rounded-md border shadow-lg overflow-hidden max-h-[280px] overflow-y-auto ${dropUp ? "bottom-full mb-1" : "mt-1"}`}
          style={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
          }}
        >
          {options.map((opt) => {
            const isSelected = !isActionMenu && opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full ${px} py-1.5 text-left ${text} font-light transition-colors`}
                style={{
                  color: isSelected ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                  backgroundColor: isSelected ? "hsl(var(--primary) / 0.08)" : "transparent",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "hsl(var(--muted))"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isSelected ? "hsl(var(--primary) / 0.08)" : "transparent"; }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
