import React from "react";

interface ResetConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  id: string;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Reset",
  id,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={id}
    >
      <div
        className="rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 ds-surface"
      >
        <h4 id={id} className="text-2xl font-light mb-2">
          {title}
        </h4>
        <p
          className="text-sm mb-4 ds-text-card"
        >
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-light rounded-lg transition-colors hover:opacity-80 ds-text-card"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3 py-1.5 text-sm font-light rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: "hsl(var(--destructive))",
              color: "hsl(var(--destructive-foreground))",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
