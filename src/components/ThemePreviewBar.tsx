import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import storage from "../utils/storage";

const THEME_COLORS_KEY = "ds-theme-colors";
const PENDING_COLORS_KEY = "ds-pending-colors";
const COLOR_HISTORY_KEY = "ds-color-history";

const EDITABLE_VARS = [
  "--brand", "--background", "--foreground", "--primary", "--primary-foreground",
  "--secondary", "--secondary-foreground", "--muted", "--muted-foreground",
  "--accent", "--accent-foreground", "--destructive", "--destructive-foreground",
  "--border", "--ring",
];

const AFFECTED_PAGES: Record<string, { label: string; path: string }[]> = {
  "--brand": [
    { label: "Portfolio Nav", path: "/portfolio" },
    { label: "Contact", path: "/portfolio/contact" },
    { label: "Design System", path: "/portfolio/design-system" },
  ],
  "--primary": [
    { label: "Design System", path: "/portfolio/design-system" },
    { label: "Design", path: "/portfolio/design" },
    { label: "Articles", path: "/portfolio/articles" },
    { label: "Lab", path: "/portfolio/lab" },
    { label: "Specs", path: "/specs" },
    { label: "Articles (detail)", path: "/article/:slug" },
  ],
  "--primary-foreground": [
    { label: "Design System", path: "/portfolio/design-system" },
  ],
  "--secondary": [
    { label: "Design System", path: "/portfolio/design-system" },
  ],
  "--secondary-foreground": [
    { label: "Design System", path: "/portfolio/design-system" },
  ],
  "--muted-foreground": [
    { label: "Portfolio", path: "/portfolio" },
    { label: "Design System", path: "/portfolio/design-system" },
    { label: "Consulting", path: "/consult" },
    { label: "Case Studies", path: "/case-studies" },
    { label: "JSON", path: "/json" },
  ],
  "--accent": [
    { label: "Design System", path: "/portfolio/design-system" },
  ],
  "--accent-foreground": [
    { label: "Design System", path: "/portfolio/design-system" },
  ],
  "--destructive": [
    { label: "Design System", path: "/portfolio/design-system" },
  ],
  "--destructive-foreground": [
    { label: "Design System", path: "/portfolio/design-system" },
  ],
  "--background": [
    { label: "Design System", path: "/portfolio/design-system" },
    { label: "All pages (global)", path: "/portfolio" },
  ],
  "--foreground": [
    { label: "Design System", path: "/portfolio/design-system" },
    { label: "All pages (global)", path: "/portfolio" },
  ],
  "--border": [
    { label: "Design System", path: "/portfolio/design-system" },
  ],
  "--ring": [
    { label: "Design System", path: "/portfolio/design-system" },
  ],
};

// Map CSS variable to class substrings for finding affected DOM elements
const VAR_TO_CLASS_PATTERNS: Record<string, string[]> = {
  "--brand": ["bg-brand-dynamic", "text-brand-dynamic", "ring-brand-dynamic", "border-brand"],
  "--primary": ["bg-primary", "text-primary", "border-primary"],
  "--primary-foreground": ["text-primary-foreground"],
  "--secondary": ["bg-secondary"],
  "--secondary-foreground": ["text-secondary-foreground"],
  "--muted": ["bg-muted"],
  "--muted-foreground": ["text-muted-foreground"],
  "--accent": ["bg-accent"],
  "--accent-foreground": ["text-accent-foreground"],
  "--destructive": ["bg-destructive", "text-destructive", "border-destructive"],
  "--destructive-foreground": ["text-destructive-foreground"],
  "--background": ["bg-background"],
  "--foreground": ["text-foreground"],
  "--border": ["border-border"],
  "--ring": ["ring-ring"],
};

function highlightElements(varName: string) {
  const patterns = VAR_TO_CLASS_PATTERNS[varName];
  if (!patterns) return;

  // Build a selector that matches elements containing any of these class substrings
  const selector = patterns.map((p) => `[class*='${p}']`).join(", ");

  // Inject highlight animation styles if not already present
  if (!document.getElementById("theme-highlight-styles")) {
    const style = document.createElement("style");
    style.id = "theme-highlight-styles";
    style.textContent = `
      @keyframes theme-highlight-pulse {
        0%, 100% { outline-color: rgba(234, 179, 8, 0); box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
        50% { outline-color: rgba(234, 179, 8, 0.9); box-shadow: 0 0 12px 2px rgba(234, 179, 8, 0.4); }
      }
      .theme-highlight {
        outline: 3px solid rgba(234, 179, 8, 0.9);
        outline-offset: 3px;
        animation: theme-highlight-pulse 1.2s ease-in-out 3;
        position: relative;
        z-index: 10;
      }
    `;
    document.head.appendChild(style);
  }

  try {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    // Scroll the first visible element into view
    const firstVisible = Array.from(elements).find((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    if (firstVisible) {
      firstVisible.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Add highlight class to all matching elements
    elements.forEach((el) => el.classList.add("theme-highlight"));

    // Remove highlights after animation completes (~3.6s for 3 pulses)
    setTimeout(() => {
      elements.forEach((el) => el.classList.remove("theme-highlight"));
    }, 4000);
  } catch {
    // Invalid selector, skip
  }
}

export default function ThemePreviewBar() {
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [historyLength, setHistoryLength] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const readPending = useCallback(() => {
    const pending = storage.get<Record<string, string>>(PENDING_COLORS_KEY);
    setPendingChanges(pending || {});
    const history = storage.get<{ key: string; previousValue: string }[]>(COLOR_HISTORY_KEY) || [];
    setHistoryLength(history.length);
  }, []);

  useEffect(() => {
    readPending();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === PENDING_COLORS_KEY || e.key === null) {
        readPending();
      }
    };

    const handleCustom = () => readPending();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("theme-pending-update", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("theme-pending-update", handleCustom);
    };
  }, [readPending]);

  // Handle highlight after navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlightVar = params.get("highlight");
    if (highlightVar) {
      // Wait for lazy-loaded page to render
      const timer = setTimeout(() => {
        highlightElements(highlightVar);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.search]);

  const changedVars = Object.keys(pendingChanges);
  const changeCount = changedVars.length;

  if (changeCount === 0) return null;

  const handleSave = () => {
    const saved = storage.get<Record<string, string>>(THEME_COLORS_KEY) || {};
    const merged = { ...saved, ...pendingChanges };
    storage.set(THEME_COLORS_KEY, merged);
    storage.remove(PENDING_COLORS_KEY);
    storage.remove(COLOR_HISTORY_KEY);
    setPendingChanges({});
    setHistoryLength(0);
    window.dispatchEvent(new Event("theme-pending-update"));
  };

  const handleDiscard = () => {
    EDITABLE_VARS.forEach((key) => {
      document.documentElement.style.removeProperty(key);
    });
    storage.remove(THEME_COLORS_KEY);
    storage.remove(PENDING_COLORS_KEY);
    storage.remove(COLOR_HISTORY_KEY);
    setPendingChanges({});
    setHistoryLength(0);
    window.dispatchEvent(new Event("theme-pending-update"));
  };

  const handleUndo = () => {
    // Reset to defaults (same as discard)
    EDITABLE_VARS.forEach((key) => {
      document.documentElement.style.removeProperty(key);
    });
    storage.remove(THEME_COLORS_KEY);
    storage.remove(PENDING_COLORS_KEY);
    storage.remove(COLOR_HISTORY_KEY);
    setPendingChanges({});
    setHistoryLength(0);
    window.dispatchEvent(new Event("theme-pending-update"));
  };

  const handlePageClick = (path: string, varName: string) => {
    if (path === location.pathname) {
      // Already on this page, just highlight
      highlightElements(varName);
    } else {
      navigate(`${path}?highlight=${encodeURIComponent(varName)}`);
    }
  };

  // Collect unique affected pages across all changed vars
  const affectedPages = Array.from(
    new Map(
      changedVars.flatMap((varName) =>
        (AFFECTED_PAGES[varName] || [])
          .filter((p) => !p.path.includes(":"))
          .map((p) => [p.path, p] as const)
      )
    ).values()
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/95 shadow-2xl backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse flex-shrink-0" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200 whitespace-nowrap flex-shrink-0">
              Previewing {changeCount} unsaved {changeCount === 1 ? "change" : "changes"}
            </span>
            {affectedPages.length > 0 && (() => {
              const idx = pageIndex % affectedPages.length;
              const currentPage = affectedPages[idx];
              return (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 mx-1">|</span>
                  <button
                    onClick={() => {
                      const newIdx = (pageIndex - 1 + affectedPages.length) % affectedPages.length;
                      setPageIndex(newIdx);
                      const page = affectedPages[newIdx];
                      handlePageClick(page.path, changedVars[0]);
                    }}
                    className="p-0.5 text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors"
                    aria-label="Previous page"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                      currentPage.path === location.pathname
                        ? "bg-yellow-300 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 font-medium"
                        : "bg-yellow-200/60 dark:bg-yellow-800/40 text-yellow-700 dark:text-yellow-300"
                    }`}
                  >
                    {currentPage.label}
                  </span>
                  <button
                    onClick={() => {
                      const newIdx = (pageIndex + 1) % affectedPages.length;
                      setPageIndex(newIdx);
                      const page = affectedPages[newIdx];
                      handlePageClick(page.path, changedVars[0]);
                    }}
                    className="p-0.5 text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors"
                    aria-label="Next page"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">{idx + 1}/{affectedPages.length}</span>
                </div>
              );
            })()}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleDiscard}
              className="px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleUndo}
              disabled={historyLength === 0}
              className="px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Undo
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
