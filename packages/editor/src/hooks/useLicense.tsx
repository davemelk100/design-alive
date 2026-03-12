import React, { createContext, useContext, useMemo } from "react";
import { type LicenseValidation, validateLicenseKey } from "../utils/license";

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
    if (!licenseKey) return { isValid: true, isPremium: true };
    const result = validateLicenseKey(licenseKey);
    return { isValid: result.isValid, isPremium: result.isValid };
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
