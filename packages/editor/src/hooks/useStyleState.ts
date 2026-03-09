import { useState, useCallback } from "react";

/**
 * Generic hook for style state management with preset support.
 * Eliminates the duplicated update/select pattern used across
 * card, typography, alert, toast, button, interaction, and typo-interaction styles.
 *
 * @param initialState - Default state or lazy initializer function
 * @param presets - Map of preset names to partial state overrides
 */
export function useStyleState<T extends { preset: string }>(
  initialState: T | (() => T),
  presets: Record<string, Partial<T>>,
) {
  const [state, setState] = useState<T>(initialState);

  /** Merge a partial patch into current state. Auto-sets preset to "custom" if not explicitly provided. */
  const update = useCallback((patch: Partial<T>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      if (patch.preset === undefined && prev.preset !== "custom") {
        next.preset = "custom" as T["preset"];
      }
      return next;
    });
  }, []);

  /** Apply a named preset, spreading its values over the current state. */
  const selectPreset = useCallback(
    (presetKey: string) => {
      const preset = presets[presetKey];
      if (preset) {
        setState((prev) => ({ ...prev, ...preset }));
      }
    },
    [presets],
  );

  return { state, setState, update, selectPreset } as const;
}
