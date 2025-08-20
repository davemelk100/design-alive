import { useCallback } from 'react';
import { useAuth } from './useAuth';

export const useSettingsSync = () => {
  const { user, settings, updateSettings, isAuthenticated } = useAuth();

  // Sync view mode changes
  const syncViewMode = useCallback(async (viewMode: 'grid' | 'list' | 'small') => {
    if (isAuthenticated && user) {
      try {
        await updateSettings({ viewMode });
      } catch (error) {
        console.error('Failed to save view mode:', error);
      }
    }
  }, [isAuthenticated, user, updateSettings]);

  // Sync active category changes
  const syncActiveCategory = useCallback(async (category: string) => {
    if (isAuthenticated && user) {
      try {
        await updateSettings({ activeCategory: category });
      } catch (error) {
        console.error('Failed to save active category:', error);
      }
    }
  }, [isAuthenticated, user, updateSettings]);

  // Sync custom feeds changes
  const syncCustomFeeds = useCallback(async (feeds: any[]) => {
    if (isAuthenticated && user) {
      try {
        await updateSettings({ customFeeds: feeds });
      } catch (error) {
        console.error('Failed to save custom feeds:', error);
      }
    }
  }, [isAuthenticated, user, updateSettings]);

  // Sync theme changes
  const syncTheme = useCallback(async (theme: 'light' | 'dark') => {
    if (isAuthenticated && user) {
      try {
        await updateSettings({ theme });
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    }
  }, [isAuthenticated, user, updateSettings]);

  // Get current settings for the component
  const getCurrentSettings = useCallback(() => {
    if (isAuthenticated && settings) {
      return {
        viewMode: settings.viewMode,
        activeCategory: settings.activeCategory,
        customFeeds: settings.customFeeds,
        theme: settings.theme,
      };
    }
    return null;
  }, [isAuthenticated, settings]);

  return {
    syncViewMode,
    syncActiveCategory,
    syncCustomFeeds,
    syncTheme,
    getCurrentSettings,
    isAuthenticated,
    user,
    settings,
  };
};
