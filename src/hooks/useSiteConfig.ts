import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

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
  const { token } = useAuth();
  const [configs, setConfigs] = useState<SiteConfigItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all public site configurations
  const loadPublicConfigs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/.netlify/functions/site-config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConfigs(data.configs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configurations');
      console.error('Error loading site configs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a specific configuration value
  const getConfig = useCallback(async (key: string): Promise<SiteConfigValue | null> => {
    try {
      const response = await fetch(`/.netlify/functions/site-config?key=${encodeURIComponent(key)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
  }, []);

  // Set a configuration value (requires authentication)
  const setConfig = useCallback(async (
    key: string,
    value: SiteConfigValue,
    description?: string,
    isPublic: boolean = false
  ): Promise<boolean> => {
    if (!token) {
      setError('Authentication required to modify site configuration');
      return false;
    }

    try {
      setError(null);

      const response = await fetch('/.netlify/functions/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ key, value, description, isPublic }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reload configs to reflect changes
      await loadPublicConfigs();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
      console.error('Error setting config:', err);
      return false;
    }
  }, [token, loadPublicConfigs]);

  // Update a configuration value (requires authentication)
  const updateConfig = useCallback(async (
    key: string,
    value: SiteConfigValue,
    description?: string,
    isPublic?: boolean
  ): Promise<boolean> => {
    if (!token) {
      setError('Authentication required to modify site configuration');
      return false;
    }

    try {
      setError(null);

      const response = await fetch('/.netlify/functions/site-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ key, value, description, isPublic }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reload configs to reflect changes
      await loadPublicConfigs();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
      console.error('Error updating config:', err);
      return false;
    }
  }, [token, loadPublicConfigs]);

  // Delete a configuration (requires authentication)
  const deleteConfig = useCallback(async (key: string): Promise<boolean> => {
    if (!token) {
      setError('Authentication required to modify site configuration');
      return false;
    }

    try {
      setError(null);

      const response = await fetch(`/.netlify/functions/site-config?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reload configs to reflect changes
      await loadPublicConfigs();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete configuration');
      console.error('Error deleting config:', err);
      return false;
    }
  }, [token, loadPublicConfigs]);

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
    setConfig,
    updateConfig,
    deleteConfig,
  };
};
