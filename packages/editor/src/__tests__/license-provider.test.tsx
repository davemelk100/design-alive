/// <reference types="vitest/globals" />
import React from "react";
import { renderHook } from "@testing-library/react";
import { LicenseProvider, useLicense } from "../hooks/useLicense";
import { generateLicenseKey } from "../utils/license";

function wrapper(licenseKey?: string) {
  return ({ children }: { children: React.ReactNode }) => (
    <LicenseProvider licenseKey={licenseKey}>{children}</LicenseProvider>
  );
}

describe("LicenseProvider", () => {
  // Paywall is currently disabled — all users get premium access
  it("grants premium when no key is provided (paywall off)", () => {
    const { result } = renderHook(() => useLicense(), { wrapper: wrapper() });
    expect(result.current.isValid).toBe(true);
    expect(result.current.isPremium).toBe(true);
  });

  it("grants premium for a valid license key", () => {
    const key = generateLicenseKey();
    const { result } = renderHook(() => useLicense(), { wrapper: wrapper(key) });
    expect(result.current.isValid).toBe(true);
    expect(result.current.isPremium).toBe(true);
  });

  it("grants premium for any key (paywall off)", () => {
    const { result } = renderHook(() => useLicense(), {
      wrapper: wrapper("THEMAL-AAAA-BBBB-ZZZZ"),
    });
    expect(result.current.isValid).toBe(true);
    expect(result.current.isPremium).toBe(true);
  });

  it("grants premium for a garbage string (paywall off)", () => {
    const { result } = renderHook(() => useLicense(), {
      wrapper: wrapper("not-a-key"),
    });
    expect(result.current.isValid).toBe(true);
    expect(result.current.isPremium).toBe(true);
  });
});
