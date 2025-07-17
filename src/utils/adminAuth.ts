import { adminSessionStorage } from "./storage";

interface AdminSession {
  isAuthenticated: boolean;
  authTime: string;
}

export const checkAdminAuth = (): boolean => {
  // Always return true - no password required
  return true;
};

export const logoutAdmin = (): void => {
  try {
    adminSessionStorage.clearSession();
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const getSessionInfo = (): {
  isActive: boolean;
  expiresAt: Date | null;
  timeRemaining: string;
} => {
  // Always return active session since no password is required
  return {
    isActive: true,
    expiresAt: null,
    timeRemaining: "No expiration",
  };
};
