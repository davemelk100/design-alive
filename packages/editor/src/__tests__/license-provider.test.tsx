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
  it("grants premium when no key is provided (freemium default)", () => {
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

  it("denies premium for an invalid license key", () => {
    const { result } = renderHook(() => useLicense(), {
      wrapper: wrapper("THEMAL-AAAA-BBBB-ZZZZ"),
    });
    expect(result.current.isValid).toBe(false);
    expect(result.current.isPremium).toBe(false);
  });

  it("denies premium for a garbage string", () => {
    const { result } = renderHook(() => useLicense(), {
      wrapper: wrapper("not-a-key"),
    });
    expect(result.current.isValid).toBe(false);
    expect(result.current.isPremium).toBe(false);
  });
});
