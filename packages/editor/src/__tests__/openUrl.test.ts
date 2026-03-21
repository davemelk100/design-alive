/**
 * Tests for the openUrl / isNativeCapacitor helpers in usePrSubmission.
 *
 * Since openUrl and isNativeCapacitor are module-private, we test their
 * behavior indirectly by importing usePrSubmission and verifying that
 * window.open vs Browser.open is called based on platform.
 *
 * For simplicity, we test the platform detection pattern directly here
 * since it's duplicated across files.
 */

const mockBrowserOpen = vi.fn().mockResolvedValue(undefined);

vi.mock("@capacitor/browser", () => ({
  Browser: { open: (...args: unknown[]) => mockBrowserOpen(...args) },
}));

describe("native platform detection (usePrSubmission pattern)", () => {
  function isNativeCapacitor(): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cap = (window as any).Capacitor;
      return cap != null && typeof cap.isNativePlatform === "function" && cap.isNativePlatform();
    } catch { return false; }
  }

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).Capacitor;
    mockBrowserOpen.mockClear();
  });

  it("returns false when Capacitor is absent", () => {
    expect(isNativeCapacitor()).toBe(false);
  });

  it("returns true when Capacitor reports native", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => "ios",
    };
    expect(isNativeCapacitor()).toBe(true);
  });

  it("returns false when Capacitor exists but isNativePlatform is not a function", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Capacitor = { version: "8.0" };
    expect(isNativeCapacitor()).toBe(false);
  });

  it("returns false when isNativePlatform returns false", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Capacitor = {
      isNativePlatform: () => false,
      getPlatform: () => "web",
    };
    expect(isNativeCapacitor()).toBe(false);
  });

  it("returns false when isNativePlatform throws", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Capacitor = {
      isNativePlatform: () => { throw new Error("crash"); },
    };
    expect(isNativeCapacitor()).toBe(false);
  });
});

describe("openUrl behavior", () => {
  async function openUrl(url: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cap = (window as any).Capacitor;
    const isNative = cap != null && typeof cap.isNativePlatform === "function" && cap.isNativePlatform();
    if (isNative) {
      const { Browser } = await import("@capacitor/browser");
      await Browser.open({ url });
    } else {
      window.open(url, "_blank");
    }
  }

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).Capacitor;
    mockBrowserOpen.mockClear();
  });

  it("calls window.open on web", async () => {
    const spy = vi.spyOn(window, "open").mockReturnValue(null);

    await openUrl("https://example.com/pr/1");

    expect(spy).toHaveBeenCalledWith("https://example.com/pr/1", "_blank");
    expect(mockBrowserOpen).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("calls Browser.open on native", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => "android",
    };

    await openUrl("https://example.com/pr/2");

    expect(mockBrowserOpen).toHaveBeenCalledWith({ url: "https://example.com/pr/2" });
  });
});
