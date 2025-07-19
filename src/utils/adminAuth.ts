import { adminSessionStorage } from "./storage";

export const checkAdminAuth = (): boolean => {
  // Always return true - no password required
  return true;
};

export const logoutAdmin = (): void => {
  try {
    adminSessionStorage.clearSession();
      } catch (error) {
      // Error during logout
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
