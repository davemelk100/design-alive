// Storage utility for persisting data locally and in production
// Supports localStorage, sessionStorage, and potential future backends

export interface StorageBackend {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear(): void;
}

class LocalStorageBackend implements StorageBackend {
  get(key: string): string | null {
    try {
      const value = localStorage.getItem(key);
      return value;
    } catch (error) {
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      throw error;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Failed to remove from localStorage
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      // Failed to clear localStorage
    }
  }
}

class SessionStorageBackend implements StorageBackend {
  get(key: string): string | null {
    try {
      const value = sessionStorage.getItem(key);
      return value;
    } catch (error) {
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      throw error;
    }
  }

  remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      // Failed to remove from sessionStorage
    }
  }

  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      // Failed to clear sessionStorage
    }
  }
}

// Fallback storage using in-memory storage
class MemoryStorageBackend implements StorageBackend {
  private storage = new Map<string, string>();

  get(key: string): string | null {
    const value = this.storage.get(key) || null;
    return value;
  }

  set(key: string, value: string): void {
    this.storage.set(key, value);
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

// Storage manager that handles different backends and fallbacks
class StorageManager {
  private primaryBackend: StorageBackend;
  private fallbackBackend: StorageBackend;
  private isAvailable: boolean = true;

  constructor() {
    // Try localStorage first, then sessionStorage, then memory
    if (this.testStorageAvailability("localStorage")) {
      this.primaryBackend = new LocalStorageBackend();
      this.fallbackBackend = new SessionStorageBackend();
    } else if (this.testStorageAvailability("sessionStorage")) {
      this.primaryBackend = new SessionStorageBackend();
      this.fallbackBackend = new MemoryStorageBackend();
    } else {
      this.primaryBackend = new MemoryStorageBackend();
      this.fallbackBackend = new MemoryStorageBackend();
      this.isAvailable = false;
    }
  }

  private testStorageAvailability(
    type: "localStorage" | "sessionStorage"
  ): boolean {
    try {
      const storage = window[type];
      const testKey = "__storage_test__";
      storage.setItem(testKey, "test");
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const value = this.primaryBackend.get(key);
      if (value === null) {
        return defaultValue !== undefined ? defaultValue : null;
      }
      const parsed = JSON.parse(value);
      return parsed;
    } catch (error) {
      try {
        const fallbackValue = this.fallbackBackend.get(key);
        if (fallbackValue === null) {
          return defaultValue !== undefined ? defaultValue : null;
        }
        const parsed = JSON.parse(fallbackValue);
        return parsed;
      } catch (fallbackError) {
        return defaultValue !== undefined ? defaultValue : null;
      }
    }
  }

  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      this.primaryBackend.set(key, serializedValue);
      // Also save to fallback for redundancy
      this.fallbackBackend.set(key, serializedValue);
    } catch (error) {
      throw error;
    }
  }

  remove(key: string): void {
    this.primaryBackend.remove(key);
    this.fallbackBackend.remove(key);
  }

  clear(): void {
    this.primaryBackend.clear();
    this.fallbackBackend.clear();
  }

  getStorageAvailability(): boolean {
    return this.isAvailable;
  }

  // Export data for backup/transfer
  exportData(): Record<string, any> {
    const data: Record<string, any> = {};
    try {
      if (this.primaryBackend instanceof LocalStorageBackend) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key);
            if (value) {
              try {
                data[key] = JSON.parse(value);
              } catch {
                data[key] = value;
              }
            }
          }
        }
      }
    } catch (error) {
      // Failed to export data
    }
    return data;
  }

  // Import data from backup
  importData(data: Record<string, any>): void {
    try {
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
    } catch (error) {
      throw error;
    }
  }
}

// Create singleton instance
const storageManager = new StorageManager();

// Convenience functions
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null =>
    storageManager.get(key, defaultValue),

  set: <T>(key: string, value: T): void => storageManager.set(key, value),

  remove: (key: string): void => storageManager.remove(key),

  clear: (): void => storageManager.clear(),

  isAvailable: (): boolean => storageManager.getStorageAvailability(),

  export: (): Record<string, any> => storageManager.exportData(),

  import: (data: Record<string, any>): void => storageManager.importData(data),
};

// Storage keys for consistent usage across the app
export const STORAGE_KEYS = {
  WRITING_GALLERY_PIECES: "writingGalleryPieces",
  ADMIN_SESSION: "adminSession",
  MUSIC_PLAYER_SETTINGS: "musicPlayerSettings",
  THEME_PREFERENCES: "themePreferences",
  USER_PREFERENCES: "userPreferences",
} as const;

// Type-safe storage helpers
export const writingGalleryStorage = {
  getPieces: () => storage.get(STORAGE_KEYS.WRITING_GALLERY_PIECES, []),
  setPieces: (pieces: any[]) =>
    storage.set(STORAGE_KEYS.WRITING_GALLERY_PIECES, pieces),
  clearPieces: () => storage.remove(STORAGE_KEYS.WRITING_GALLERY_PIECES),
};

export const adminSessionStorage = {
  getSession: () => storage.get(STORAGE_KEYS.ADMIN_SESSION, null),
  setSession: (session: any) =>
    storage.set(STORAGE_KEYS.ADMIN_SESSION, session),
  clearSession: () => storage.remove(STORAGE_KEYS.ADMIN_SESSION),
};

export const musicPlayerStorage = {
  getSettings: () => storage.get(STORAGE_KEYS.MUSIC_PLAYER_SETTINGS, {}),
  setSettings: (settings: any) =>
    storage.set(STORAGE_KEYS.MUSIC_PLAYER_SETTINGS, settings),
  clearSettings: () => storage.remove(STORAGE_KEYS.MUSIC_PLAYER_SETTINGS),
};

export const themeStorage = {
  getPreferences: () => storage.get(STORAGE_KEYS.THEME_PREFERENCES, {}),
  setPreferences: (preferences: any) =>
    storage.set(STORAGE_KEYS.THEME_PREFERENCES, preferences),
  clearPreferences: () => storage.remove(STORAGE_KEYS.THEME_PREFERENCES),
};

export const userPreferencesStorage = {
  getPreferences: () => storage.get(STORAGE_KEYS.USER_PREFERENCES, {}),
  setPreferences: (preferences: any) =>
    storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences),
  clearPreferences: () => storage.remove(STORAGE_KEYS.USER_PREFERENCES),
};

export default storage;
