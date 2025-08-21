import { useState, useEffect, useCallback } from "react";

export interface SiteConfigValue {
  [key: string]: any;
}

export interface SiteConfigItem {
  id: string;
  key: string;
  value: SiteConfigValue;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const useSiteConfig = () => {
  const [configs, setConfigs] = useState<SiteConfigItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all public site configurations
  const loadPublicConfigs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/.netlify/functions/site-config", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConfigs(data.configs || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load configurations"
      );
      console.error("Error loading site configs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a specific configuration value
  const getConfig = useCallback(
    async (key: string): Promise<SiteConfigValue | null> => {
      try {
        const response = await fetch(
          `/.netlify/functions/site-config?key=${encodeURIComponent(key)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.value;
      } catch (err) {
        console.error(`Error getting config ${key}:`, err);
        return null;
      }
    },
    []
  );

  // Load configurations on mount
  useEffect(() => {
    loadPublicConfigs();
  }, [loadPublicConfigs]);

  return {
    configs,
    loading,
    error,
    loadPublicConfigs,
    getConfig,
  };
};
