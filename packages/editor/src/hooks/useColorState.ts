import { useState, useEffect, useCallback } from "react";
import {
  EDITABLE_VARS,
  applyStoredThemeColors,
} from "../utils/themeUtils";
import { useContrastEnforcement } from "./useContrastEnforcement";

export function useColorState(wcagEnforcement: boolean = true, defaultColors?: Record<string, string>) {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [lockedKeys, setLockedKeys] = useState<Set<string>>(new Set());
  const [colorUndoStack, setColorUndoStack] = useState<Record<string, string>[]>([]);

  const readCurrentColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    const current: Record<string, string> = {};
    let hasEmpty = false;
    EDITABLE_VARS.forEach(({ key }) => {
      const val = style.getPropertyValue(key).trim();
      current[key] = val;
      if (!val) hasEmpty = true;
    });
    setColors(current);
    if (hasEmpty) {
      setTimeout(() => {
        const retryStyle = getComputedStyle(document.documentElement);
        const retried: Record<string, string> = {};
        EDITABLE_VARS.forEach(({ key }) => {
          retried[key] = retryStyle.getPropertyValue(key).trim();
        });
        setColors(retried);
      }, 100);
    }
  }, []);

  useContrastEnforcement(colors, setColors, lockedKeys, wcagEnforcement);

  useEffect(() => {
    // Apply defaultColors first as the baseline, then layer saved colors on top
    if (defaultColors) {
      Object.entries(defaultColors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
    applyStoredThemeColors();
    readCurrentColors();

    const handlePendingUpdate = () => {
      setTimeout(() => readCurrentColors(), 50);
    };
    window.addEventListener("theme-pending-update", handlePendingUpdate);
    return () => window.removeEventListener("theme-pending-update", handlePendingUpdate);
  }, [readCurrentColors]);

  return {
    colors,
    setColors,
    lockedKeys,
    setLockedKeys,
    colorUndoStack,
    setColorUndoStack,
    readCurrentColors,
  };
}
