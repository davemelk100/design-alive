// Storage utility for persisting data locally
// Supports localStorage with sessionStorage and memory fallbacks

interface StorageBackend {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear(): void;
}

class LocalStorageBackend implements StorageBackend {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  remove(key: string): void {
    try { localStorage.removeItem(key); } catch { /* noop */ }
  }
  clear(): void {
    try { localStorage.clear(); } catch { /* noop */ }
  }
}

class SessionStorageBackend implements StorageBackend {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }
  set(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }
  remove(key: string): void {
    try { sessionStorage.removeItem(key); } catch { /* noop */ }
  }
  clear(): void {
    try { sessionStorage.clear(); } catch { /* noop */ }
  }
}

class MemoryStorageBackend implements StorageBackend {
  private store = new Map<string, string>();
  get(key: string): string | null { return this.store.get(key) || null; }
  set(key: string, value: string): void { this.store.set(key, value); }
  remove(key: string): void { this.store.delete(key); }
  clear(): void { this.store.clear(); }
}

class StorageManager {
  private primary: StorageBackend;
  private fallback: StorageBackend;

  constructor() {
    if (this.test("localStorage")) {
      this.primary = new LocalStorageBackend();
      this.fallback = new SessionStorageBackend();
    } else if (this.test("sessionStorage")) {
      this.primary = new SessionStorageBackend();
      this.fallback = new MemoryStorageBackend();
    } else {
      this.primary = new MemoryStorageBackend();
      this.fallback = new MemoryStorageBackend();
    }
  }

  private test(type: "localStorage" | "sessionStorage"): boolean {
    try {
      const s = window[type];
      s.setItem("__test__", "1");
      s.removeItem("__test__");
      return true;
    } catch {
      return false;
    }
  }

  get<T>(key: string, defaultValue?: T, validator?: (v: unknown) => v is T): T | null {
    try {
      const value = this.primary.get(key);
      if (value === null) return defaultValue !== undefined ? defaultValue : null;
      const parsed = JSON.parse(value);
      if (validator && !validator(parsed)) return defaultValue !== undefined ? defaultValue : null;
      if (parsed === null || parsed === undefined) return defaultValue !== undefined ? defaultValue : null;
      if (typeof parsed !== "object" && typeof parsed !== "string" && typeof parsed !== "number" && typeof parsed !== "boolean" && !Array.isArray(parsed)) {
        return defaultValue !== undefined ? defaultValue : null;
      }
      return parsed;
    } catch {
      try {
        const fb = this.fallback.get(key);
        if (fb === null) return defaultValue !== undefined ? defaultValue : null;
        const parsed = JSON.parse(fb);
        if (validator && !validator(parsed)) return defaultValue !== undefined ? defaultValue : null;
        return parsed;
      } catch {
        return defaultValue !== undefined ? defaultValue : null;
      }
    }
  }

  set<T>(key: string, value: T): void {
    const s = JSON.stringify(value);
    this.primary.set(key, s);
    this.fallback.set(key, s);
  }

  remove(key: string): void {
    this.primary.remove(key);
    this.fallback.remove(key);
  }
}

const mgr = new StorageManager();

export const storage = {
  get: <T>(key: string, defaultValue?: T, validator?: (v: unknown) => v is T): T | null => mgr.get(key, defaultValue, validator),
  set: <T>(key: string, value: T): void => mgr.set(key, value),
  remove: (key: string): void => mgr.remove(key),
};

export default storage;
