import React, { useState, useEffect, useCallback } from "react";
import { useLicense } from "../hooks/useLicense";

// Shared listener so only one popover is open at a time
type CloseListener = () => void;
const closeListeners = new Set<CloseListener>();
function notifyOthers(except: CloseListener) {
  closeListeners.forEach((fn) => {
    if (fn !== except) fn();
  });
}

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

function UpgradePopover({
  upgradeUrl,
  signInUrl,
  visible,
  centered = false,
}: {
  upgradeUrl: string;
  signInUrl?: string;
  visible: boolean;
  centered?: boolean;
}) {
  const visibleStyle = visible
    ? {
        opacity: 1,
        pointerEvents: "auto" as const,
        transform: centered
          ? "translate(-50%, -50%) scale(1) translateY(0)"
          : "scale(1) translateY(0)",
        filter: "blur(0)",
      }
    : undefined;
  return (
    <div className="ds-premium-popover" style={visibleStyle}>
      <span>{lockIcon}</span>
      <span>Pro feature</span>
      {signInUrl && <a href={signInUrl}>Sign in &rarr;</a>}
      <a href={upgradeUrl}>View pricing &rarr;</a>
    </div>
  );
}

export function PremiumGate({
  variant = "section",
  upgradeUrl,
  signInUrl,
  children,
}: PremiumGateProps) {
  const { isPremium } = useLicense();
  const [hovered, setHovered] = useState(false);
  const leaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMe = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setHovered(false);
  }, []);

  useEffect(() => {
    closeListeners.add(closeMe);
    return () => {
      closeListeners.delete(closeMe);
    };
  }, [closeMe]);

  const handleEnter = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    notifyOthers(closeMe);
    setHovered(true);
    // Auto-close after 2s regardless of hover state
    leaveTimer.current = setTimeout(() => setHovered(false), 2000);
  };
  const handleLeave = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    leaveTimer.current = setTimeout(() => setHovered(false), 300);
  };

  if (isPremium) return <>{children}</>;

  const pricingHref = upgradeUrl || "/pricing";

  if (variant === "inline") {
    return (
      <span className="ds-premium-gated-inline">
        <span className="ds-premium-locked-content">{children}</span>
        <span
          className="ds-premium-lock"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          style={
            hovered ? { opacity: 1, color: "hsl(var(--brand))" } : undefined
          }
        >
          {lockIcon}
        </span>
        <UpgradePopover
          upgradeUrl={pricingHref}
          signInUrl={signInUrl}
          visible={hovered}
        />
      </span>
    );
  }

  return (
    <div className="ds-premium-gated-section" style={{ position: "relative" }}>
      <div style={{ opacity: 0.4, pointerEvents: "none", filter: "grayscale(0.5)", userSelect: "none" }}>
        {children}
      </div>
      <span
        className="ds-premium-lock ds-premium-section-lock"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          cursor: "pointer",
          ...(hovered ? { opacity: 1, color: "hsl(var(--brand))" } : undefined),
        }}
      >
        {lockIcon}
        <UpgradePopover upgradeUrl={pricingHref} signInUrl={signInUrl} visible={hovered} />
      </span>
    </div>
  );
}
