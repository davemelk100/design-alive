import React from "react";
import { useLicense } from "../hooks/useLicense";

export interface PremiumGateProps {
  feature: string;
  /** "section" dims content; "inline" dims inline content. Default: "section" */
  variant?: "section" | "inline";
  upgradeUrl?: string;
  children: React.ReactNode;
}

export function PremiumGate({
  variant = "section",
  children,
}: PremiumGateProps) {
  const { isPremium } = useLicense();

  if (isPremium) return <>{children}</>;

  const gateStyle: React.CSSProperties = {
    opacity: 0.4,
    cursor: "not-allowed",
    userSelect: "none",
  };

  const blockInteraction = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const gateProps = {
    title: "Premium feature — Pro version required",
    onClickCapture: blockInteraction,
    onKeyDownCapture: blockInteraction,
  };

  if (variant === "inline") {
    return (
      <span
        className="ds-premium-inline"
        style={{ display: "inline-flex", alignItems: "center", ...gateStyle }}
        {...gateProps}
      >
        {children}
      </span>
    );
  }

  // variant === "section"
  return (
    <div
      className="ds-premium-section"
      style={gateStyle}
      {...gateProps}
    >
      {children}
    </div>
  );
}
