import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
  isAuthenticated: boolean;
}

// Create a default context value to prevent undefined errors during lazy loading
// Note: This should never be used if AuthProvider is properly set up
const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  login: () => {
    throw new Error(
      "AuthProvider not found - login called outside provider. Make sure AuthProvider wraps your component tree."
    );
  },
  loginWithEmail: async () => {
    throw new Error(
      "AuthProvider not found - loginWithEmail called outside provider. Make sure AuthProvider wraps your component tree."
    );
  },
  logout: () => {
    throw new Error(
      "AuthProvider not found - logout called outside provider. Make sure AuthProvider wraps your component tree."
    );
  },
  setToken: () => {
    throw new Error(
      "AuthProvider not found - setToken called outside provider. Make sure AuthProvider wraps your component tree."
    );
  },
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const useAuth = () => {
  const context = useContext(AuthContext);

  // In development, check if we're using the default context value
  if (import.meta.env.DEV) {
    // Check if login function throws an error (indicating default context)
    try {
      // This is a lightweight check - we don't actually call it
      const loginStr = context.login.toString();
      if (loginStr.includes("AuthProvider not found")) {
        console.error(
          "⚠️ useAuth is being called outside AuthProvider. " +
            "Make sure AuthProvider wraps your component tree in App.tsx"
        );
      }
    } catch (e) {
      // Ignore errors in the check
    }
  }

  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("store_auth_token");
  };

  const setToken = useCallback((token: string) => {
    localStorage.setItem("store_auth_token", token);
  }, []);

  const removeToken = useCallback(() => {
    localStorage.removeItem("store_auth_token");
  }, []);

  const checkSession = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // In dev, use relative path so Vite proxy handles it
      // In production, use full URL
      const url = import.meta.env.DEV
        ? "/.netlify/functions/auth-session"
        : `${window.location.origin}/.netlify/functions/auth-session`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [removeToken]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(() => {
    // In dev, use relative path so Vite proxy handles it
    // In production, use full URL
    const url = import.meta.env.DEV
      ? "/.netlify/functions/auth-login"
      : `${window.location.origin}/.netlify/functions/auth-login`;
    window.location.href = url;
  }, []);

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      // In dev, use relative path so Vite proxy handles it
      // In production, use full URL
      const url = import.meta.env.DEV
        ? "/.netlify/functions/auth-login-email"
        : `${window.location.origin}/.netlify/functions/auth-login-email`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setToken(data.token);
      setUser(data.user);
    },
    [setToken]
  );

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  // Handle auth callback
  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        setToken(token);
        // Remove token from URL
        window.history.replaceState({}, "", window.location.pathname);
        // Check session to get user info
        checkSession();
      }
    };

    if (window.location.pathname === "/store/auth/callback") {
      handleCallback();
    }
  }, [setToken, checkSession]);

  const isAuthenticated = !!user;

  const value: AuthContextType = useMemo(
    () => ({
      user,
      loading,
      login,
      loginWithEmail,
      logout,
      setToken,
      isAuthenticated,
    }),
    [user, loading, login, loginWithEmail, logout, setToken, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
