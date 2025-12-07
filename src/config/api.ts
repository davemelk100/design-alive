// API Configuration
// In production, this should be set via environment variables

const getApiUrl = (): string => {
  // Check for environment variable first (set during build)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Check for runtime environment variable (useful for Netlify)
  if (typeof window !== "undefined" && (window as any).__API_URL__) {
    return (window as any).__API_URL__;
  }

  // Development fallback
  if (import.meta.env.DEV) {
    return "http://localhost:8000";
  }

  // Production fallback - assumes backend is on same domain or subdomain
  // You can override this by setting VITE_API_URL during build
  const hostname = window.location.hostname;

  // If frontend is on a subdomain, try backend on same domain
  // e.g., if frontend is app.example.com, backend might be api.example.com
  if (hostname.includes(".")) {
    const parts = hostname.split(".");
    if (parts.length > 2) {
      // Subdomain detected, try api subdomain
      parts[0] = "api";
      return `https://${parts.join(".")}`;
    }
  }

  // Default: same origin (if backend is proxied or on same server)
  return window.location.origin;
};

export const API_URL = getApiUrl();

// Helper to get full API endpoint URL
export const getApiEndpoint = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_URL}/${cleanPath}`;
};

// Admin panel URLs
export const ADMIN_LOGIN_URL = `${API_URL}/login`;
export const ADMIN_PANEL_URL = `${API_URL}/admin`;
