import { useState } from "react";
import {
  fgForBg,
  generateSectionDesignTokens,
} from "../utils/themeUtils";
import type {
  TableStyleState,
  CardStyleState,
  TypographyState,
  AlertStyleState,
  InteractionStyleState,
  TypoInteractionStyleState,
  ButtonStyleState,
  InputStyleState,
} from "../utils/themeUtils";
import { CustomSelect } from "../components/CustomSelect";
import { ResetConfirmModal } from "../components/ResetConfirmModal";

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

export interface TablesSectionProps {
  colors: Record<string, string>;
  tableStyle: TableStyleState;
  updateTableStyle: (patch: Partial<TableStyleState>) => void;
  selectTablePreset: (preset: string) => void;
  cardStyle: CardStyleState;
  typographyState: TypographyState;
  alertStyle: AlertStyleState;
  interactionStyle: InteractionStyleState;
  typoInteractionStyle: TypoInteractionStyleState;
  buttonStyle: ButtonStyleState;
  inputStyle: InputStyleState;
}

const HEADER_WEIGHTS: { value: TableStyleState["headerWeight"]; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
];

const WEIGHT_CLASS: Record<TableStyleState["headerWeight"], string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const SAMPLE_DATA = [
  { name: "Alice Johnson", role: "Engineer", status: "Active", joined: "Jan 2024" },
  { name: "Bob Chen", role: "Designer", status: "Active", joined: "Mar 2024" },
  { name: "Carol White", role: "Manager", status: "Away", joined: "Nov 2023" },
  { name: "Dan Kim", role: "Developer", status: "Active", joined: "Jun 2024" },
];

const COLUMNS = ["Name", "Role", "Status", "Joined"];

export function TablesSection({
  colors,
  tableStyle,
  updateTableStyle,
  selectTablePreset,
  cardStyle,
  typographyState,
  alertStyle,
  interactionStyle,
  typoInteractionStyle,
  buttonStyle,
  inputStyle,
}: TablesSectionProps) {
  const [showResetModal, setShowResetModal] = useState(false);
  const [tableCssVisible, setTableCssVisible] = useState(false);
  const [tableCssCopied, setTableCssCopied] = useState(false);
  const [tableExportFormat, setTableExportFormat] = useState<"css" | "tokens">("css");

  const cellStyle = {
    padding: `${tableStyle.cellPaddingY}px ${tableStyle.cellPaddingX}px`,
  };

  return (
    <>
      <ResetConfirmModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={() => selectTablePreset("default")}
        title="Reset Table Style?"
        message="This will revert all table style settings to their defaults. Any customizations will be lost."
        id="table-reset-modal-title"
      />

      <div
        id="tables"
        className="min-w-0 space-y-4 mt-6 pb-[50vh] md:mt-16 scroll-mt-40 lg:scroll-mt-24"
      >
        <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-wider mb-[5px] flex items-baseline gap-2 ds-text-fg">
          Tables{" "}
          <a
            href="#top"
            className="ds-h2-link opacity-30"
            aria-label="Back to top"
            onClick={(e) => { e.preventDefault(); const el = document.getElementById("top"); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 160; window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); } }}
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
          <span className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Mobile: dropdown */}
            <CustomSelect
              ariaLabel="Table actions"
              className="sm:hidden"
              placeholder="Actions…"
              size="sm"
              width="120px"
              value=""
              onChange={(v) => {
                if (v === "css") { setTableExportFormat("css"); setTableCssVisible(true); }
                else if (v === "tokens") { setTableExportFormat("tokens"); setTableCssVisible(true); }
                else if (v === "reset") setShowResetModal(true);
              }}
              options={[
                { value: "css", label: "CSS" },
                { value: "tokens", label: "Tokens" },
                { value: "reset", label: "Reset" },
              ]}
            />
            {/* Desktop: buttons */}
            <span className="hidden sm:flex flex-wrap items-center gap-1 sm:gap-2">
              <span
                className="flex items-center rounded-lg overflow-hidden border ds-border"
              >
                <button
                  onClick={() => {
                    if (tableCssVisible && tableExportFormat === "css") { setTableCssVisible(false); return; }
                    setTableExportFormat("css");
                    setTableCssVisible(true);
                  }}
                  className="h-8 px-3 sm:px-4 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{
                    backgroundColor: tableCssVisible && tableExportFormat === "css" ? "hsl(var(--brand))" : "transparent",
                    color: tableCssVisible && tableExportFormat === "css"
                      ? colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "hsl(var(--primary-foreground))"
                      : "hsl(var(--muted-foreground))",
                  }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="truncate">CSS</span>
                </button>
                <span className="w-px h-5" style={{ backgroundColor: "hsl(var(--border))" }} />
                <button
                  onClick={() => {
                    if (tableCssVisible && tableExportFormat === "tokens") { setTableCssVisible(false); return; }
                    setTableExportFormat("tokens");
                    setTableCssVisible(true);
                  }}
                  className="h-8 px-3 sm:px-4 text-sm font-light transition-colors hover:opacity-70 flex items-center justify-center gap-1"
                  style={{
                    backgroundColor: tableCssVisible && tableExportFormat === "tokens" ? "hsl(var(--brand))" : "transparent",
                    color: tableCssVisible && tableExportFormat === "tokens"
                      ? colors["--brand"] ? `hsl(${fgForBg(colors["--brand"])})` : "hsl(var(--primary-foreground))"
                      : "hsl(var(--muted-foreground))",
                  }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M7 8L3 12l4 4M14 4l-4 16" />
                  </svg>
                  <span className="truncate">Tokens</span>
                </button>
              </span>
              <button
                onClick={() => setShowResetModal(true)}
                className="h-8 px-2 sm:px-3 text-sm font-light rounded-lg transition-colors hover:opacity-70 flex items-center justify-center gap-1 ds-text-muted"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z" />
                </svg>
                <span className="truncate">Reset</span>
              </button>
            </span>
          </span>
        </h2>

        {/* Table CSS/Tokens output */}
        {tableCssVisible && (() => {
          const tableCss = `:root {\n  --table-radius: ${tableStyle.borderRadius}px;\n  --table-border-width: ${tableStyle.borderWidth}px;\n  --table-cell-px: ${tableStyle.cellPaddingX}px;\n  --table-cell-py: ${tableStyle.cellPaddingY}px;\n  --table-header-weight: ${tableStyle.headerWeight};\n}`;
          const tableTokens = JSON.stringify(
            generateSectionDesignTokens(
              "tables",
              cardStyle,
              typographyState,
              alertStyle,
              interactionStyle,
              typoInteractionStyle,
              buttonStyle,
              inputStyle,
              tableStyle,
            ),
            null,
            2,
          );
          const output = tableExportFormat === "tokens" ? tableTokens : tableCss;
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
                  {tableExportFormat === "tokens" ? "Table Tokens" : "Table CSS"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(output);
                      setTableCssCopied(true);
                      setTimeout(() => setTableCssCopied(false), 2000);
                    }}
                    aria-label="Copy" className="p-1 rounded-lg transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: "hsl(var(--muted))",
                      color: colors["--muted"]
                        ? `hsl(${fgForBg(colors["--muted"])})`
                        : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {tableCssCopied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                  <button
                    onClick={() => setTableCssVisible(false)}
                    aria-label="Close"
                    className="p-1 rounded-lg transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: "hsl(var(--muted))",
                      color: colors["--muted"]
                        ? `hsl(${fgForBg(colors["--muted"])})`
                        : "hsl(var(--muted-foreground))",
                    }}
                  >
                    <XIcon />
                  </button>
                </div>
              </div>
              <pre
                className="p-3 overflow-x-auto max-h-64 text-xs leading-relaxed font-mono ds-text-card"
              >
                <code>{output}</code>
              </pre>
            </div>
          );
        })()}

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 rounded-lg p-4">
          {/* Controls */}
          <div className="flex-1 min-w-0 space-y-3 order-2 md:order-1">
            {/* Presets */}
            <div className="flex items-center gap-2 flex-wrap" data-axe-exclude>
              {(["default", "striped", "bordered", "minimal"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => selectTablePreset(p)}
                  className={`h-8 px-3 text-xs font-light rounded-lg border transition-colors capitalize ${
                    tableStyle.preset === p
                      ? "ds-surface-primary"
                      : "ds-surface"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="h-8 px-3 text-xs font-light rounded-lg transition-colors hover:opacity-70 flex items-center gap-1 ml-auto ds-text-muted"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            </div>

            {/* Shape */}
            <div className="space-y-1.5">
              <p className="text-sm font-light uppercase tracking-wider ds-text-subtle">
                Shape
              </p>
              <label className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg">
                <span>Radius: {tableStyle.borderRadius}px</span>
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={tableStyle.borderRadius}
                  onChange={(e) => updateTableStyle({ borderRadius: Number(e.target.value) })}
                  className="w-32 accent-[hsl(var(--brand))]"
                />
              </label>
              <label className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg">
                <span>Border: {tableStyle.borderWidth}px</span>
                <input
                  type="range"
                  min={0}
                  max={4}
                  value={tableStyle.borderWidth}
                  onChange={(e) => updateTableStyle({ borderWidth: Number(e.target.value) })}
                  className="w-32 accent-[hsl(var(--brand))]"
                />
              </label>
            </div>

            {/* Spacing */}
            <div className="space-y-1.5">
              <p className="text-sm font-light uppercase tracking-wider ds-text-subtle">
                Spacing
              </p>
              <label className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg">
                <span>Cell Padding X: {tableStyle.cellPaddingX}px</span>
                <input
                  type="range"
                  min={4}
                  max={32}
                  value={tableStyle.cellPaddingX}
                  onChange={(e) => updateTableStyle({ cellPaddingX: Number(e.target.value) })}
                  className="w-32 accent-[hsl(var(--brand))]"
                />
              </label>
              <label className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg">
                <span>Cell Padding Y: {tableStyle.cellPaddingY}px</span>
                <input
                  type="range"
                  min={2}
                  max={24}
                  value={tableStyle.cellPaddingY}
                  onChange={(e) => updateTableStyle({ cellPaddingY: Number(e.target.value) })}
                  className="w-32 accent-[hsl(var(--brand))]"
                />
              </label>
            </div>

            {/* Header */}
            <div className="space-y-1.5">
              <p className="text-sm font-light uppercase tracking-wider ds-text-subtle">
                Header
              </p>
              <label className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg">
                <span>Weight</span>
                <div className="flex gap-1">
                  {HEADER_WEIGHTS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateTableStyle({ headerWeight: value })}
                      className={`h-7 px-2 text-xs rounded transition-colors ${
                        tableStyle.headerWeight === value
                          ? "ds-surface-primary"
                          : "ds-surface-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </label>
            </div>

            {/* Options */}
            <div className="space-y-1.5">
              <p className="text-sm font-light uppercase tracking-wider ds-text-subtle">
                Options
              </p>
              {[
                { key: "striped" as const, label: "Striped rows" },
                { key: "hoverable" as const, label: "Row hover" },
                { key: "compact" as const, label: "Compact" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg">
                  <span>{label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={tableStyle[key]}
                    aria-label={label}
                    onClick={() => updateTableStyle({ [key]: !tableStyle[key] })}
                    className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors ${
                      tableStyle[key] ? "ds-bg-brand" : "ds-bg-muted"
                    }`}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow-sm ds-bg transition-transform"
                      style={{
                        transform: tableStyle[key] ? "translateX(16px)" : "translateX(0)",
                      }}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="flex-1 min-w-0 rounded-lg p-4 sm:p-6 order-1 md:order-2 ds-bg overflow-x-auto"
            data-audit-target
          >
            {/* Desktop: standard table */}
            <div className="ds-table-desktop">
              <table
                className="w-full text-sm ds-text-fg"
                style={{
                  borderRadius: `${tableStyle.borderRadius}px`,
                  borderWidth: `${tableStyle.borderWidth}px`,
                  borderColor: "hsl(var(--border))",
                  borderStyle: tableStyle.borderWidth > 0 ? "solid" : "none",
                  borderCollapse: tableStyle.borderWidth > 0 ? "separate" : "collapse",
                  borderSpacing: 0,
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr className="ds-bg-muted">
                    {COLUMNS.map((col) => (
                      <th
                        key={col}
                        className={`text-left ${WEIGHT_CLASS[tableStyle.headerWeight]} ds-text-fg`}
                        style={{
                          ...cellStyle,
                          ...(tableStyle.compact ? { padding: `${Math.max(tableStyle.cellPaddingY - 4, 2)}px ${tableStyle.cellPaddingX}px` } : {}),
                          borderBottomWidth: `${tableStyle.borderWidth}px`,
                          borderBottomColor: "hsl(var(--border))",
                          borderBottomStyle: tableStyle.borderWidth > 0 ? "solid" : "none",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_DATA.map((row, i) => (
                    <tr
                      key={row.name}
                      className={`
                        ${tableStyle.hoverable ? "ds-table-row-hover" : ""}
                        ${tableStyle.striped && i % 2 === 1 ? "ds-bg-muted" : ""}
                      `}
                    >
                      <td
                        className="font-medium"
                        style={{
                          ...cellStyle,
                          ...(tableStyle.compact ? { padding: `${Math.max(tableStyle.cellPaddingY - 4, 2)}px ${tableStyle.cellPaddingX}px` } : {}),
                          borderBottomWidth: i < SAMPLE_DATA.length - 1 ? `${tableStyle.borderWidth}px` : "0",
                          borderBottomColor: "hsl(var(--border))",
                          borderBottomStyle: i < SAMPLE_DATA.length - 1 && tableStyle.borderWidth > 0 ? "solid" : "none",
                        }}
                      >
                        {row.name}
                      </td>
                      <td
                        className="ds-text-muted"
                        style={{
                          ...cellStyle,
                          ...(tableStyle.compact ? { padding: `${Math.max(tableStyle.cellPaddingY - 4, 2)}px ${tableStyle.cellPaddingX}px` } : {}),
                          borderBottomWidth: i < SAMPLE_DATA.length - 1 ? `${tableStyle.borderWidth}px` : "0",
                          borderBottomColor: "hsl(var(--border))",
                          borderBottomStyle: i < SAMPLE_DATA.length - 1 && tableStyle.borderWidth > 0 ? "solid" : "none",
                        }}
                      >
                        {row.role}
                      </td>
                      <td
                        style={{
                          ...cellStyle,
                          ...(tableStyle.compact ? { padding: `${Math.max(tableStyle.cellPaddingY - 4, 2)}px ${tableStyle.cellPaddingX}px` } : {}),
                          borderBottomWidth: i < SAMPLE_DATA.length - 1 ? `${tableStyle.borderWidth}px` : "0",
                          borderBottomColor: "hsl(var(--border))",
                          borderBottomStyle: i < SAMPLE_DATA.length - 1 && tableStyle.borderWidth > 0 ? "solid" : "none",
                        }}
                      >
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.status === "Active"
                              ? "ds-badge-success"
                              : "ds-badge-warning"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td
                        className="ds-text-muted"
                        style={{
                          ...cellStyle,
                          ...(tableStyle.compact ? { padding: `${Math.max(tableStyle.cellPaddingY - 4, 2)}px ${tableStyle.cellPaddingX}px` } : {}),
                          borderBottomWidth: i < SAMPLE_DATA.length - 1 ? `${tableStyle.borderWidth}px` : "0",
                          borderBottomColor: "hsl(var(--border))",
                          borderBottomStyle: i < SAMPLE_DATA.length - 1 && tableStyle.borderWidth > 0 ? "solid" : "none",
                        }}
                      >
                        {row.joined}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: description list */}
            <dl className="ds-table-mobile space-y-3">
              {SAMPLE_DATA.map((row, i) => (
                <div
                  key={row.name}
                  className={`rounded-lg border p-3 ds-border ${
                    tableStyle.striped && i % 2 === 1 ? "ds-bg-muted" : "ds-bg-card"
                  }`}
                  style={{
                    borderRadius: `${tableStyle.borderRadius}px`,
                    borderWidth: `${tableStyle.borderWidth}px`,
                  }}
                >
                  {COLUMNS.map((col, ci) => {
                    const value = [row.name, row.role, row.status, row.joined][ci];
                    return (
                      <div
                        key={col}
                        className={`flex justify-between items-center ${
                          ci < COLUMNS.length - 1 ? "mb-1.5 pb-1.5 border-b ds-border" : ""
                        }`}
                        style={{
                          padding: `${Math.max(tableStyle.cellPaddingY / 2, 2)}px 0`,
                        }}
                      >
                        <dt className={`text-xs uppercase tracking-wider ds-text-muted ${WEIGHT_CLASS[tableStyle.headerWeight]}`}>
                          {col}
                        </dt>
                        <dd className="text-sm ds-text-fg">
                          {col === "Status" ? (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                value === "Active"
                                  ? "ds-badge-success"
                                  : "ds-badge-warning"
                              }`}
                            >
                              {value}
                            </span>
                          ) : (
                            value
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
