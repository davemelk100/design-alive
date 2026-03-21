import React, { createContext, useContext, useMemo } from "react";
import { type LicenseValidation } from "../utils/license";

const LicenseContext = createContext<LicenseValidation>({
  isValid: true,
  isPremium: true,
});

export interface LicenseProviderProps {
  licenseKey?: string;
  children: React.ReactNode;
}

export function LicenseProvider({ licenseKey, children }: LicenseProviderProps) {
  const value = useMemo<LicenseValidation>(() => {
    return { isValid: true, isPremium: true };
  }, [licenseKey]);

  return (
    <LicenseContext.Provider value={value}>
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicense(): LicenseValidation {
  return useContext(LicenseContext);
}
