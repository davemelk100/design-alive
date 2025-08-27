import { useCallback, useState, useEffect } from "react";

export const useSettingsSync = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "small">("list");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [customFeeds, setCustomFeeds] = useState<any[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontFamily, setFontFamily] = useState<"sans" | "serif">("sans");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem("viewMode") as
      | "grid"
      | "list"
      | "small";
    const savedActiveCategory = localStorage.getItem("activeCategory");
    const savedCustomFeeds = localStorage.getItem("customFeeds");
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const savedFontFamily = localStorage.getItem("fontFamily") as
      | "sans"
      | "serif";

    if (savedViewMode) setViewMode(savedViewMode);
    if (savedActiveCategory) setActiveCategory(savedActiveCategory);
    if (savedCustomFeeds) {
      try {
        setCustomFeeds(JSON.parse(savedCustomFeeds));
      } catch {
        setCustomFeeds([]);
      }
    }
    if (savedTheme) setTheme(savedTheme);
    if (savedFontFamily) setFontFamily(savedFontFamily);
  }, []);

  // Sync view mode changes
  const syncViewMode = useCallback(
    async (newViewMode: "grid" | "list" | "small") => {
      setViewMode(newViewMode);
      localStorage.setItem("viewMode", newViewMode);
    },
    []
  );

  // Sync active category changes
  const syncActiveCategory = useCallback(async (category: string) => {
    setActiveCategory(category);
    localStorage.setItem("activeCategory", category);
  }, []);

  // Sync custom feeds changes
  const syncCustomFeeds = useCallback(async (feeds: any[]) => {
    setCustomFeeds(feeds);
    localStorage.setItem("customFeeds", JSON.stringify(feeds));
  }, []);

  // Sync theme changes
  const syncTheme = useCallback(async (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, []);

  // Sync font family changes
  const syncFontFamily = useCallback(
    async (newFontFamily: "sans" | "serif") => {
      setFontFamily(newFontFamily);
      localStorage.setItem("fontFamily", newFontFamily);
    },
    []
  );

  // Get current settings for the component
  const getCurrentSettings = useCallback(() => {
    return {
      viewMode,
      activeCategory,
      customFeeds,
      theme,
      fontFamily,
    };
  }, [viewMode, activeCategory, customFeeds, theme, fontFamily]);

  return {
    syncViewMode,
    syncActiveCategory,
    syncCustomFeeds,
    syncTheme,
    syncFontFamily,
    getCurrentSettings,
    viewMode,
    activeCategory,
    customFeeds,
    theme,
    fontFamily,
  };
};
