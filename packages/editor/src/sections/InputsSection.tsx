import React, { useState, useRef, useEffect } from "react";
import type { InputStyleState } from "../utils/themeUtils";
import { ResetConfirmModal } from "../components/ResetConfirmModal";

export interface InputsSectionProps {
  inputStyle: InputStyleState;
  updateInputStyle: (patch: Partial<InputStyleState>) => void;
  selectInputPreset: (preset: string) => void;
}

export function InputsSection({
  inputStyle,
  updateInputStyle,
  selectInputPreset,
}: InputsSectionProps) {
  const [showInputResetModal, setShowInputResetModal] = useState(false);
  const [inputToggle1, setInputToggle1] = useState(false);
  const [inputToggle2, setInputToggle2] = useState(true);
  const [inputRadio, setInputRadio] = useState("option1");
  const [inputCheck1, setInputCheck1] = useState(true);
  const [inputCheck2, setInputCheck2] = useState(false);
  const [inputCheck3, setInputCheck3] = useState(false);
  const [inputSegmented, setInputSegmented] = useState("light");
  const [inputSelectOpen, setInputSelectOpen] = useState(false);
  const [inputSelectValue, setInputSelectValue] = useState("Choose an option");
  const inputSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputSelectOpen) return;
    const close = (e: MouseEvent) => {
      if (inputSelectRef.current && !inputSelectRef.current.contains(e.target as Node)) setInputSelectOpen(false);
    };
    document.addEventListener("click", close, true);
    return () => document.removeEventListener("click", close, true);
  }, [inputSelectOpen]);

  return (
    <>
          {/* Input Reset Confirmation Modal */}
          <ResetConfirmModal
            open={showInputResetModal}
            onClose={() => setShowInputResetModal(false)}
            onConfirm={() => selectInputPreset("rounded")}
            title="Reset Input Style?"
            message="This will revert all input style settings to their defaults. Any customizations will be lost."
            id="input-reset-modal-title"
          />

          {/* Inputs section */}
          <div
            id="inputs"
            className="min-w-0 space-y-4 mt-6 mb-6 md:mt-16 md:mb-16 scroll-mt-28 lg:scroll-mt-14"
          >
            <h2
              className="text-sm sm:text-base md:text-lg font-bold tracking-wider mb-[5px] flex items-baseline gap-2 ds-text-fg"
            >
              Inputs{" "}
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

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 rounded-lg p-4">
              {/* Controls */}
              <div className="flex-1 min-w-0 space-y-3 order-2 md:order-1">
                {/* Presets */}
                <div className="flex items-center gap-2 flex-wrap" data-axe-exclude>
                  {(["rounded", "sharp", "pill"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => selectInputPreset(p)}
                      className="h-8 px-3 text-xs font-light rounded-lg border transition-colors capitalize"
                      style={{
                        borderColor: inputStyle.preset === p ? "hsl(var(--primary))" : "hsl(var(--border))",
                        backgroundColor: inputStyle.preset === p ? "hsl(var(--primary))" : "transparent",
                        color: inputStyle.preset === p ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowInputResetModal(true)}
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
                  <p
                    className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                  >
                    Shape
                  </p>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Radius: {inputStyle.borderRadius}px</span>
                    <input
                      type="range"
                      min={0}
                      max={999}
                      value={inputStyle.borderRadius}
                      onChange={(e) => updateInputStyle({ borderRadius: Number(e.target.value) })}
                      className="w-32 accent-[hsl(var(--brand))]"
                    />
                  </label>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Border: {inputStyle.borderWidth}px</span>
                    <input
                      type="range"
                      min={0}
                      max={4}
                      value={inputStyle.borderWidth}
                      onChange={(e) => updateInputStyle({ borderWidth: Number(e.target.value) })}
                      className="w-32 accent-[hsl(var(--brand))]"
                    />
                  </label>
                </div>

                {/* Size */}
                <div className="space-y-1.5">
                  <p
                    className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                  >
                    Size
                  </p>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Padding X: {inputStyle.paddingX}px</span>
                    <input
                      type="range"
                      min={4}
                      max={24}
                      value={inputStyle.paddingX}
                      onChange={(e) => updateInputStyle({ paddingX: Number(e.target.value) })}
                      className="w-32 accent-[hsl(var(--brand))]"
                    />
                  </label>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Padding Y: {inputStyle.paddingY}px</span>
                    <input
                      type="range"
                      min={2}
                      max={16}
                      value={inputStyle.paddingY}
                      onChange={(e) => updateInputStyle({ paddingY: Number(e.target.value) })}
                      className="w-32 accent-[hsl(var(--brand))]"
                    />
                  </label>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Font Size: {inputStyle.fontSize}px</span>
                    <input
                      type="range"
                      min={10}
                      max={22}
                      value={inputStyle.fontSize}
                      onChange={(e) => updateInputStyle({ fontSize: Number(e.target.value) })}
                      className="w-32 accent-[hsl(var(--brand))]"
                    />
                  </label>
                </div>

                {/* Focus */}
                <div className="space-y-1.5">
                  <p
                    className="text-sm font-light uppercase tracking-wider ds-text-subtle"
                  >
                    Focus
                  </p>
                  <label
                    className="flex items-center justify-between gap-2 text-sm font-light ds-text-fg"
                  >
                    <span>Ring Width: {inputStyle.focusRingWidth}px</span>
                    <input
                      type="range"
                      min={0}
                      max={6}
                      value={inputStyle.focusRingWidth}
                      onChange={(e) => updateInputStyle({ focusRingWidth: Number(e.target.value) })}
                      className="w-32 accent-[hsl(var(--brand))]"
                    />
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div
                className="flex-1 min-w-0 rounded-lg p-4 sm:p-6 order-1 md:order-2 ds-bg"
                data-axe-exclude
              >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Left column — text inputs */}
                <div className="space-y-4">
                  {/* Text Input */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5 ds-text-fg"
                    >
                      Text Input
                    </label>
                    <input
                      type="text"
                      placeholder="Enter some text..."
                      className="ds-input w-full border ds-surface-bg ds-border"
                      style={{
                        borderRadius: `${inputStyle.borderRadius}px`,
                        borderWidth: `${inputStyle.borderWidth}px`,
                        padding: `${inputStyle.paddingY}px ${inputStyle.paddingX}px`,
                        fontSize: `${inputStyle.fontSize}px`,
                      }}
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5 ds-text-fg"
                    >
                      Email Input
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="ds-input w-full border ds-surface-bg ds-border"
                      style={{
                        borderRadius: `${inputStyle.borderRadius}px`,
                        borderWidth: `${inputStyle.borderWidth}px`,
                        padding: `${inputStyle.paddingY}px ${inputStyle.paddingX}px`,
                        fontSize: `${inputStyle.fontSize}px`,
                      }}
                    />
                  </div>

                  {/* Textarea */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5 ds-text-fg"
                    >
                      Textarea
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write a message..."
                      className="ds-input w-full border resize-none ds-surface-bg ds-border"
                      style={{
                        borderRadius: `${inputStyle.borderRadius}px`,
                        borderWidth: `${inputStyle.borderWidth}px`,
                        padding: `${inputStyle.paddingY}px ${inputStyle.paddingX}px`,
                        fontSize: `${inputStyle.fontSize}px`,
                      }}
                    />
                  </div>

                  {/* Disabled Input */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5 ds-text-muted"
                    >
                      Disabled Input
                    </label>
                    <input
                      type="text"
                      disabled
                      placeholder="Not editable"
                      className="ds-input w-full border cursor-not-allowed opacity-60 ds-bg-muted ds-text-muted ds-border"
                      style={{
                        borderRadius: `${inputStyle.borderRadius}px`,
                        borderWidth: `${inputStyle.borderWidth}px`,
                        padding: `${inputStyle.paddingY}px ${inputStyle.paddingX}px`,
                        fontSize: `${inputStyle.fontSize}px`,
                      }}
                    />
                  </div>
                </div>

                {/* Right column — selects, checkboxes, radios, toggles */}
                <div className="space-y-5">
                  {/* Custom Select */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5 ds-text-fg"
                    >
                      Select
                    </label>
                    <div ref={inputSelectRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setInputSelectOpen(!inputSelectOpen)}
                        className="ds-input w-full border text-left flex items-center justify-between ds-surface-bg"
                        style={{
                          borderColor: inputSelectOpen ? "hsl(var(--ring))" : "hsl(var(--border))",
                          borderRadius: `${inputStyle.borderRadius}px`,
                          borderWidth: `${inputStyle.borderWidth}px`,
                          padding: `${inputStyle.paddingY}px ${inputStyle.paddingX}px`,
                          fontSize: `${inputStyle.fontSize}px`,
                          boxShadow: inputSelectOpen ? "0 0 0 2px hsl(var(--ring))" : "none",
                        }}
                      >
                        <span>{inputSelectValue}</span>
                        <svg
                          className="w-4 h-4 flex-shrink-0 ds-text-muted"
                          style={{ transform: inputSelectOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {inputSelectOpen && (
                        <div
                          className="absolute z-20 mt-1 w-full border shadow-lg overflow-hidden ds-bg ds-border"
                          style={{
                            borderRadius: `${inputStyle.borderRadius}px`,
                          }}
                        >
                          {["Choose an option", "Option A", "Option B", "Option C"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => { setInputSelectValue(opt); setInputSelectOpen(false); }}
                              className="w-full px-3 py-2 text-left transition-colors"
                              style={{
                                color: opt === inputSelectValue ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                                backgroundColor: opt === inputSelectValue ? "hsl(var(--primary) / 0.08)" : "transparent",
                              }}
                              onMouseEnter={(e) => { if (opt !== inputSelectValue) e.currentTarget.style.backgroundColor = "hsl(var(--muted))"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = opt === inputSelectValue ? "hsl(var(--primary) / 0.08)" : "transparent"; }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-2 ds-text-fg"
                    >
                      Checkboxes
                    </label>
                    <div className="space-y-2">
                      {[
                        { label: "Enable notifications", checked: inputCheck1, set: setInputCheck1 },
                        { label: "Auto-save drafts", checked: inputCheck2, set: setInputCheck2 },
                        { label: "Dark mode sync", checked: inputCheck3, set: setInputCheck3 },
                      ].map(({ label, checked, set }) => (
                        <label key={label} className="flex items-center gap-2.5 cursor-pointer">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={checked}
                            onClick={() => set(!checked)}
                            className="ds-checkbox w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0"
                            style={{
                              borderColor: checked ? "hsl(var(--primary))" : "hsl(var(--border))",
                              backgroundColor: checked ? "hsl(var(--primary))" : "transparent",
                            }}
                          >
                            {checked && (
                              <svg className="w-3 h-3" fill="none" stroke="hsl(var(--primary-foreground))" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <span className="text-sm ds-text-fg">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Radio Buttons */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-2 ds-text-fg"
                    >
                      Radio Buttons
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "option1", label: "Small" },
                        { value: "option2", label: "Medium" },
                        { value: "option3", label: "Large" },
                      ].map(({ value, label }) => (
                        <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                          <button
                            type="button"
                            role="radio"
                            aria-checked={inputRadio === value}
                            onClick={() => setInputRadio(value)}
                            className="ds-radio w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{
                              borderColor: inputRadio === value ? "hsl(var(--primary))" : "hsl(var(--border))",
                            }}
                          >
                            {inputRadio === value && (
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: "hsl(var(--primary))" }}
                              />
                            )}
                          </button>
                          <span className="text-sm ds-text-fg">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Switches */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-2 ds-text-fg"
                    >
                      Toggle Switches
                    </label>
                    <div className="space-y-3">
                      {/* On/off toggles */}
                      {[
                        { label: "Dark mode", on: inputToggle1, set: setInputToggle1 },
                        { label: "Notifications", on: inputToggle2, set: setInputToggle2 },
                      ].map(({ label, on, set }) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-sm ds-text-fg">{label}</span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={on}
                            aria-label={label}
                            onClick={() => set(!on)}
                            className="ds-toggle-track relative w-11 h-6 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: on ? "hsl(var(--primary))" : "hsl(var(--muted))",
                            }}
                          >
                            <span
                              className="ds-toggle-thumb absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-sm ds-bg"
                              style={{
                                transform: on ? "translateX(20px)" : "translateX(0)",
                              }}
                            />
                          </button>
                        </div>
                      ))}

                      {/* Segmented toggle */}
                      <div className="pt-2">
                        <span className="block text-xs font-medium mb-1.5 ds-text-fg">
                          Segmented
                        </span>
                        <div
                          className="inline-flex items-center rounded-lg overflow-hidden border ds-border"
                        >
                          {["Light", "Dark", "System"].map((opt, i) => (
                            <React.Fragment key={opt}>
                              {i > 0 && (
                                <span className="w-px h-5" style={{ backgroundColor: "hsl(var(--border))" }} />
                              )}
                              <button
                                type="button"
                                onClick={() => setInputSegmented(opt.toLowerCase())}
                                className="h-9 px-3 text-sm font-light transition-colors"
                                style={{
                                  backgroundColor: inputSegmented === opt.toLowerCase() ? "hsl(var(--primary))" : "transparent",
                                  color: inputSegmented === opt.toLowerCase() ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                                }}
                              >
                                {opt}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
    </>
  );
}
