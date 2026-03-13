import React, { useState } from "react";
import { useLicense } from "../hooks/useLicense";
import { validateLicenseKey } from "../utils/license";

export interface PremiumGateProps {
  feature: string;
  /** "section" blocks content; "inline" shows lock inline. Default: "section" */
  variant?: "section" | "inline";
  /** Hide the external lock icon (e.g. when the button already has one inside) */
  hideLock?: boolean;
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
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState("");

  const handleActivate = () => {
    const result = validateLicenseKey(licenseInput);
    if (result.isValid) {
      window.dispatchEvent(new CustomEvent("themal:license-activate", { detail: { activated: true } }));
      onClose();
    } else {
      setLicenseError("Invalid license key. Please check and try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 w-[360px] shadow-xl relative ds-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center ds-bg-muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium ds-text-fg">Pro Feature</h3>
            <p className="text-xs ds-text-muted">{feature.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
          </div>
        </div>
        <p className="text-sm font-light mb-5 ds-text-fg">
          This feature requires a Themal Pro license. Upgrade to unlock all premium features including harmony schemes, color locks, interaction controls, and more.
        </p>
        <div className="flex flex-col gap-2">
          <a
            href={upgradeUrl}
            className="w-full text-center px-4 py-2.5 text-sm font-medium rounded-lg transition-opacity hover:opacity-90 ds-surface-invert"
          >
            View Pricing
          </a>
          {signInUrl && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onClose();
                window.dispatchEvent(new CustomEvent("themal:sign-in"));
              }}
              className="w-full text-center px-4 py-2.5 text-sm font-light rounded-lg transition-opacity hover:opacity-70 ds-surface-muted"
            >
              Already have a license? Sign in
            </button>
          )}
          {!showLicenseInput ? (
            <button
              onClick={() => setShowLicenseInput(true)}
              className="w-full text-center px-4 py-2 text-xs font-light transition-opacity hover:opacity-70 ds-text-muted"
            >
              Enter license key
            </button>
          ) : (
            <div className="mt-1 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="license-key"
                  autoComplete="off"
                  value={licenseInput}
                  onChange={(e) => { setLicenseInput(e.target.value); setLicenseError(""); }}
                  placeholder="THEMAL-XXXX-XXXX-XXXX"
                  className="flex-1 px-3 py-2 text-xs font-light rounded-lg border outline-none ds-text-fg ds-bg-card"
                  style={{ borderColor: licenseError ? "hsl(var(--destructive))" : "hsl(var(--border))" }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleActivate(); }}
                  autoFocus
                />
                <button
                  onClick={handleActivate}
                  className="px-3 py-2 text-xs font-medium rounded-lg transition-opacity hover:opacity-90 ds-surface-invert"
                >
                  Activate
                </button>
              </div>
              {licenseError && <p className="text-[12px] ds-text-destructive">{licenseError}</p>}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg transition-opacity hover:opacity-70 ds-text-muted"
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
  hideLock = false,
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
        <div className="ds-premium-gated-inline" style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "not-allowed" }} onClick={handleClick}>
          <span className="ds-premium-locked-content">{children}</span>
          {!hideLock && <span
            className="ds-premium-lock"
            onClick={handleClick}
          >
            {lockIcon}
          </span>}
        </div>
        {open && <UpgradeModal upgradeUrl={pricingHref} signInUrl={signInUrl} feature={feature} onClose={() => setOpen(false)} />}
      </>
    );
  }

  return (
    <div className="ds-premium-gated-section" style={{ position: "relative" }}>
      <div
        style={{ pointerEvents: "auto", cursor: "not-allowed" }}
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
