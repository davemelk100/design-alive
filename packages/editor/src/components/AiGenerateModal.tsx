import { useState } from "react";
import type { AiGenerateResult } from "../types";

export interface AiGenerateModalProps {
  onAiGenerate: (prompt: string) => Promise<AiGenerateResult>;
  onApply: (result: AiGenerateResult) => void;
  onClose: () => void;
}

export function AiGenerateModal({
  onAiGenerate,
  onApply,
  onClose,
}: AiGenerateModalProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiPreview, setAiPreview] = useState<AiGenerateResult | null>(null);

  const handleClose = () => {
    setAiPrompt("");
    setAiPreview(null);
    setAiError("");
    onClose();
  };

  const handleGenerate = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const result = await onAiGenerate(aiPrompt);
      setAiPreview(result);
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleApply = () => {
    if (!aiPreview) return;
    onApply(aiPreview);
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="rounded-xl shadow-xl p-6 w-full max-w-md mx-4 ds-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {aiPreview === null ? (
          <>
            <h3 className="text-xl font-light mb-4 ds-text-fg">
              AI Generate Theme
            </h3>
            <textarea
              rows={4}
              className="w-full rounded-lg border p-3 text-sm font-light resize-none focus:outline-none focus:ring-2 focus:ring-offset-1 ds-surface-bg ds-border"
              placeholder="Describe the theme you want, e.g. warm earthy tones for a coffee shop website..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              disabled={aiLoading}
            />
            {aiError && (
              <p className="mt-2 text-xs ds-text-destructive">
                {aiError}
              </p>
            )}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-light rounded-lg transition-opacity hover:opacity-70 ds-text-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!aiPrompt.trim() || aiLoading}
                className="px-4 py-2 text-sm font-light rounded-lg transition-opacity hover:opacity-80 disabled:opacity-40 flex items-center gap-2 ds-surface-invert"
              >
                {aiLoading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {aiLoading ? "Generating..." : "Generate"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-light mb-4 ds-text-fg">
              Preview AI Theme
            </h3>
            {aiPreview.colors && Object.keys(aiPreview.colors).length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-light mb-2 ds-text-muted">
                  Colors
                </p>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(aiPreview.colors).map(([varName, value]) => (
                    <div key={varName} className="flex flex-col items-center gap-1">
                      <div
                        className="w-8 h-8 rounded border ds-border"
                        style={{
                          backgroundColor: `hsl(${value})`,
                        }}
                      />
                      <span className="text-[11px] font-light ds-text-muted">
                        {varName.replace("--", "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {aiPreview.typography && Object.keys(aiPreview.typography).length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-light mb-2 ds-text-muted">
                  Typography
                </p>
                <div className="flex flex-col gap-1">
                  {Object.entries(aiPreview.typography).map(([key, value]) => (
                    <div key={key} className="text-xs font-light ds-text-muted">
                      <span className="ds-text-fg">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setAiPreview(null)}
                className="px-4 py-2 text-sm font-light rounded-lg transition-opacity hover:opacity-70 ds-text-muted"
              >
                Back
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-light rounded-lg transition-opacity hover:opacity-70 ds-text-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 text-sm font-light rounded-lg transition-opacity hover:opacity-80 ds-surface-invert"
              >
                Apply
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
