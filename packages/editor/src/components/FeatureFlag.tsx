import type { ReactNode } from "react";
import { FEATURE_FLAGS, type FeatureFlagName } from "../utils/featureFlags";

interface FeatureFlagProps {
  name: FeatureFlagName;
  children: ReactNode;
}

/** Renders children only when the named feature flag is enabled. */
export function FeatureFlag({ name, children }: FeatureFlagProps) {
  if (!FEATURE_FLAGS[name]) return null;
  return <>{children}</>;
}
