import { useEffect, useRef } from "react";
import { scanHostStyles, mapPaletteToTokens, buildOverrideStylesheet } from "../utils/hostScanner";
import storage from "../utils/storage";
import { THEME_COLORS_KEY } from "../utils/styles/colorUtils";

const STYLE_TAG_ID = "themal-host-override";

export function useHostScanner(
  applyToRoot: boolean,
  setColors: (fn: (prev: Record<string, string>) => Record<string, string>) => void,
  setVar: (key: string, value: string) => void,
  editorRootRef: React.RefObject<HTMLDivElement | null>,
) {
  const hasScanned = useRef(false);

  useEffect(() => {
    if (!applyToRoot || hasScanned.current) return;
    hasScanned.current = true;

    // 1. Scan host page
    const palette = scanHostStyles(editorRootRef.current);

    // 2. Map to tokens
    const tokenMap = mapPaletteToTokens(palette);
    if (Object.keys(tokenMap).length === 0) return;

    // 3. If no stored theme, populate editor with detected colors
    const stored = storage.get<Record<string, string>>(THEME_COLORS_KEY);
    if (!stored || Object.keys(stored).length === 0) {
      for (const [key, value] of Object.entries(tokenMap)) {
        setVar(key, value);
      }
      setColors((prev) => ({ ...prev, ...tokenMap }));
    }

    // 4. Inject override stylesheet
    if (!document.getElementById(STYLE_TAG_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_TAG_ID;
      style.textContent = buildOverrideStylesheet();
      document.head.appendChild(style);
    }

    return () => {
      document.getElementById(STYLE_TAG_ID)?.remove();
    };
  }, [applyToRoot, setColors, setVar, editorRootRef]);
}
