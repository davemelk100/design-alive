import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserSettings {
  theme: "light" | "dark";
  viewMode: "grid" | "list" | "small";
  activeCategory: string;
  customFeeds: any[];
  preferences: Record<string, any>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  settings: UserSettings | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    settings: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("auth_user");

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setAuthState((prev) => ({
          ...prev,
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        }));

        // Load user settings
        loadUserSettings(token);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Send magic link
  const sendMagicLink = useCallback(async (email: string) => {
    try {
      const response = await fetch("/.netlify/functions/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMagicLink",
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send magic link");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Verify magic link
  const verifyMagicLink = useCallback(async (email: string, token: string) => {
    try {
      const response = await fetch("/.netlify/functions/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "verifyMagicLink",
          email,
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify magic link");
      }

      // Store auth data
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      setAuthState((prev) => ({
        ...prev,
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      }));

      // Load user settings
      await loadUserSettings(data.token);

      return data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Load user settings
  const loadUserSettings = useCallback(async (token: string) => {
    try {
      const response = await fetch("/.netlify/functions/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "getSettings",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthState((prev) => ({
          ...prev,
          settings: data,
        }));
      }
    } catch (error) {
      console.error("Failed to load user settings:", error);
    }
  }, []);

  // Update settings
  const updateSettings = useCallback(
    async (updates: Partial<UserSettings>) => {
      if (!authState.token) return;

      try {
        const response = await fetch("/.netlify/functions/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify({
            action: "updateSettings",
            ...updates,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setAuthState((prev) => ({
            ...prev,
            settings: data,
          }));
          return data;
        } else {
          throw new Error(data.error || "Failed to update settings");
        }
      } catch (error) {
        throw error;
      }
    },
    [authState.token]
  );

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setAuthState({
      user: null,
      token: null,
      settings: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  return {
    ...authState,
    sendMagicLink,
    verifyMagicLink,
    updateSettings,
    logout,
  };
};
