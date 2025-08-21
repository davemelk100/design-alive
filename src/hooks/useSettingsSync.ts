import { useCallback, useState, useEffect } from "react";

export const useSettingsSync = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "small">("list");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [customFeeds, setCustomFeeds] = useState<any[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem("viewMode") as
      | "grid"
      | "list"
      | "small";
    const savedActiveCategory = localStorage.getItem("activeCategory");
    const savedCustomFeeds = localStorage.getItem("customFeeds");
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";

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

  // Get current settings for the component
  const getCurrentSettings = useCallback(() => {
    return {
      viewMode,
      activeCategory,
      customFeeds,
      theme,
    };
  }, [viewMode, activeCategory, customFeeds, theme]);

  return {
    syncViewMode,
    syncActiveCategory,
    syncCustomFeeds,
    syncTheme,
    getCurrentSettings,
    viewMode,
    activeCategory,
    customFeeds,
    theme,
  };
};
