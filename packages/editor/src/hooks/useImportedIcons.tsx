import { useState, useMemo, useEffect, useCallback } from "react";
import type { CustomIcon } from "../types";
import type { ImportedIconData } from "../utils/iconImport";
import { sanitizeSvg } from "../utils/iconImport";
import { storage } from "../utils/storage";

const IMPORTED_ICONS_KEY = "themal:imported-icons";

// Track injected font stylesheets to avoid duplicates
const injectedStylesheets = new Set<string>();

function ensureFontStylesheet(url: string) {
  if (injectedStylesheets.has(url)) return;
  const existing = document.querySelector(`link[href="${CSS.escape(url)}"]`);
  if (existing) {
    injectedStylesheets.add(url);
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
  injectedStylesheets.add(url);
}

function createSvgComponent(svgMarkup: string) {
  // Sanitize SVG markup before rendering to prevent XSS
  const sanitized = sanitizeSvg(svgMarkup);
  return function SvgIcon({ className, ...props }: { className?: string; [key: string]: unknown }) {
    return (
      <span
        className={className}
        {...props}
        style={{ display: "inline-flex", width: "1em", height: "1em", ...((props.style as object) || {}) }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  };
}

function createFontComponent(iconClassName: string, fontStylesheet: string, displayName: string) {
  return function FontIcon({ className, ...props }: { className?: string; [key: string]: unknown }) {
    ensureFontStylesheet(fontStylesheet);
    // Material Icons use ligatures
    if (iconClassName === "material-icons") {
      return (
        <i
          className={`${iconClassName} ${className || ""}`}
          {...props}
          style={{ fontSize: "1em", ...((props.style as object) || {}) }}
        >
          {displayName.toLowerCase().replace(/ /g, "_")}
        </i>
      );
    }
    return (
      <i
        className={`${iconClassName} ${className || ""}`}
        {...props}
        style={{ fontSize: "1em", ...((props.style as object) || {}) }}
      />
    );
  };
}

export function useImportedIcons() {
  const [icons, setIcons] = useState<ImportedIconData[]>(() => {
    return storage.get<ImportedIconData[]>(IMPORTED_ICONS_KEY) || [];
  });

  // Persist on change
  useEffect(() => {
    if (icons.length === 0) {
      storage.remove(IMPORTED_ICONS_KEY);
    } else {
      storage.set(IMPORTED_ICONS_KEY, icons);
    }
  }, [icons]);

  // Re-inject font stylesheets on mount
  useEffect(() => {
    const sheets = new Set<string>();
    icons.forEach((ic) => {
      if (ic.fontStylesheet) sheets.add(ic.fontStylesheet);
    });
    sheets.forEach(ensureFontStylesheet);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addIcons = useCallback((newIcons: ImportedIconData[]) => {
    setIcons((prev) => {
      const ids = new Set(prev.map((i) => i.id));
      const toAdd = newIcons.filter((i) => !ids.has(i.id));
      return [...prev, ...toAdd];
    });
  }, []);

  const removeIcon = useCallback((id: string) => {
    setIcons((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const removeBySource = useCallback((sourceUrl: string) => {
    setIcons((prev) => prev.filter((i) => i.sourceUrl !== sourceUrl));
  }, []);

  const clearAll = useCallback(() => {
    setIcons([]);
  }, []);

  // Convert stored data to CustomIcon components
  const customIcons: CustomIcon[] = useMemo(() => {
    return icons.map((ic) => {
      let component: CustomIcon["icon"];
      if (ic.source === "font" && ic.className && ic.fontStylesheet) {
        component = createFontComponent(ic.className, ic.fontStylesheet, ic.name);
      } else if (ic.svgMarkup) {
        component = createSvgComponent(ic.svgMarkup);
      } else {
        // Fallback: empty placeholder
        component = ({ className }: { className?: string }) => (
          <span className={className}>?</span>
        );
      }
      return { name: ic.name, icon: component };
    });
  }, [icons]);

  return {
    importedIcons: customIcons,
    importedIconData: icons,
    addIcons,
    removeIcon,
    removeBySource,
    clearAll,
    count: icons.length,
  };
}
