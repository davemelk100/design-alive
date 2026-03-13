import React, { useState, useEffect, useCallback } from "react";
import {
  EDITABLE_VARS,
  applyStoredThemeColors,
} from "../utils/themeUtils";
import { useContrastEnforcement } from "./useContrastEnforcement";

export function useColorState(editorRootRef: React.RefObject<HTMLDivElement | null>, wcagEnforcement: boolean = true, defaultColors?: Record<string, string>) {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [lockedKeys, setLockedKeys] = useState<Set<string>>(new Set());
  const [colorUndoStack, setColorUndoStack] = useState<Record<string, string>[]>([]);

  const readCurrentColors = useCallback(() => {
    const style = getComputedStyle(editorRootRef.current || document.documentElement);
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
        const retryStyle = getComputedStyle(editorRootRef.current || document.documentElement);
        const retried: Record<string, string> = {};
        EDITABLE_VARS.forEach(({ key }) => {
          retried[key] = retryStyle.getPropertyValue(key).trim();
        });
        setColors(retried);
      }, 100);
    }
  }, [editorRootRef]);

  useContrastEnforcement(colors, setColors, lockedKeys, wcagEnforcement, editorRootRef);

  // Stable ref to track whether this is the initial mount
  const defaultColorsRef = React.useRef(defaultColors);
  const isInitialMount = React.useRef(true);

  useEffect(() => {
    const el = editorRootRef.current || document.documentElement;
    if (isInitialMount.current) {
      if (defaultColors) {
        // Host provides colors — apply stored first, then defaultColors so host wins
        applyStoredThemeColors(el);
        Object.entries(defaultColors).forEach(([key, value]) => {
          el.style.setProperty(key, value);
        });
      } else {
        applyStoredThemeColors(el);
      }
      isInitialMount.current = false;
    } else if (defaultColors && defaultColors !== defaultColorsRef.current) {
      // Host changed defaultColors — apply them directly (overrides stored theme)
      Object.entries(defaultColors).forEach(([key, value]) => {
        el.style.setProperty(key, value);
      });
    }
    defaultColorsRef.current = defaultColors;
    readCurrentColors();

    const handlePendingUpdate = () => {
      setTimeout(() => readCurrentColors(), 50);
    };
    window.addEventListener("theme-pending-update", handlePendingUpdate);
    return () => window.removeEventListener("theme-pending-update", handlePendingUpdate);
  }, [readCurrentColors, editorRootRef, defaultColors]);

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
