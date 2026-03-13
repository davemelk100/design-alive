/**
 * Feature flags for in-progress sections/features.
 *
 * Set a flag to `true` to make it visible in the editor.
 * Features behind `false` flags are completely excluded from the build
 * when wrapped with the `<FeatureFlag>` component.
 */
export const FEATURE_FLAGS = {
  tables: false,
} as const;

export type FeatureFlagName = keyof typeof FEATURE_FLAGS;
