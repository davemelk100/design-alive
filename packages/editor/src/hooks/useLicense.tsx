import React, { createContext, useContext } from "react";
import { type LicenseValidation } from "../utils/license";

const LicenseContext = createContext<LicenseValidation>({
  isValid: true,
  isPremium: true,
});

export interface LicenseProviderProps {
  licenseKey?: string;
  children: React.ReactNode;
}

export function LicenseProvider({ children }: LicenseProviderProps) {
  return (
    <LicenseContext.Provider value={{ isValid: true, isPremium: true }}>
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicense(): LicenseValidation {
  return useContext(LicenseContext);
}
