import React, { useState } from "react";
import { useLicense } from "../hooks/useLicense";

export interface PremiumGateProps {
  feature: string;
  /** "section" blocks content; "inline" shows lock inline. Default: "section" */
  variant?: "section" | "inline";
  upgradeUrl?: string;
  signInUrl?: string;
  children: React.ReactNode;
}

const lockIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function UpgradeModal({
  upgradeUrl,
  signInUrl,
  feature,
  onClose,
}: {
  upgradeUrl: string;
  signInUrl?: string;
  feature: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 w-[360px] shadow-xl"
        style={{ backgroundColor: "#fff", color: "#111" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f3f4f6" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h3 className="text-[18px] font-medium" style={{ color: "#111" }}>Pro Feature</h3>
            <p className="text-[13px]" style={{ color: "#888" }}>{feature.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
          </div>
        </div>
        <p className="text-[14px] font-light mb-5" style={{ color: "#555" }}>
          This feature requires a Themal Pro license. Upgrade to unlock all premium features including harmony schemes, color locks, interaction controls, and more.
        </p>
        <div className="flex flex-col gap-2">
          <a
            href={upgradeUrl}
            className="w-full text-center px-4 py-2.5 text-[14px] font-medium rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#111", color: "#fff" }}
          >
            View Pricing
          </a>
          {signInUrl && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onClose();
                window.dispatchEvent(new CustomEvent("theemel:sign-in"));
              }}
              className="w-full text-center px-4 py-2.5 text-[14px] font-light rounded-lg transition-opacity hover:opacity-70"
              style={{ backgroundColor: "#f3f4f6", color: "#111" }}
            >
              Already have a license? Sign in
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg transition-opacity hover:opacity-70"
          style={{ color: "#999" }}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function PremiumGate({
  feature,
  variant = "section",
  upgradeUrl,
  signInUrl,
  children,
}: PremiumGateProps) {
  const { isPremium } = useLicense();
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  if (isPremium) return <>{children}</>;

  const pricingHref = upgradeUrl || "/pricing";

  if (variant === "inline") {
    return (
      <>
        <div className="ds-premium-gated-inline" style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <span className="ds-premium-locked-content">{children}</span>
          <span
            className="ds-premium-lock"
            onClick={handleClick}
          >
            {lockIcon}
          </span>
        </div>
        {open && <UpgradeModal upgradeUrl={pricingHref} signInUrl={signInUrl} feature={feature} onClose={() => setOpen(false)} />}
      </>
    );
  }

  return (
    <div className="ds-premium-gated-section" style={{ position: "relative" }}>
      <div
        style={{ opacity: 0.4, pointerEvents: "auto", filter: "grayscale(0.5)", userSelect: "none", cursor: "pointer" }}
        onClick={handleClick}
      >
        {children}
      </div>
      <span
        className="ds-premium-lock ds-premium-section-lock"
        onClick={handleClick}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          cursor: "pointer",
        }}
      >
        {lockIcon}
      </span>
      {open && <UpgradeModal upgradeUrl={pricingHref} signInUrl={signInUrl} feature={feature} onClose={() => setOpen(false)} />}
    </div>
  );
}
