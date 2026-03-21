import { isNativePlatform, getPlatform } from "../utils/platform";

describe("platform detection", () => {
  afterEach(() => {
    delete window.Capacitor;
  });

  describe("isNativePlatform", () => {
    it("returns false when Capacitor is not on window", () => {
      expect(isNativePlatform()).toBe(false);
    });

    it("returns true when Capacitor reports native", () => {
      window.Capacitor = {
        isNativePlatform: () => true,
        getPlatform: () => "ios",
      };
      expect(isNativePlatform()).toBe(true);
    });

    it("returns false when Capacitor reports web", () => {
      window.Capacitor = {
        isNativePlatform: () => false,
        getPlatform: () => "web",
      };
      expect(isNativePlatform()).toBe(false);
    });

    it("returns false when Capacitor.isNativePlatform throws", () => {
      window.Capacitor = {
        isNativePlatform: () => {
          throw new Error("broken");
        },
        getPlatform: () => "web",
      };
      expect(isNativePlatform()).toBe(false);
    });
  });

  describe("getPlatform", () => {
    it('returns "web" when Capacitor is absent', () => {
      expect(getPlatform()).toBe("web");
    });

    it('returns "ios" on iOS native', () => {
      window.Capacitor = {
        isNativePlatform: () => true,
        getPlatform: () => "ios",
      };
      expect(getPlatform()).toBe("ios");
    });

    it('returns "android" on Android native', () => {
      window.Capacitor = {
        isNativePlatform: () => true,
        getPlatform: () => "android",
      };
      expect(getPlatform()).toBe("android");
    });

    it('returns "web" for unrecognized platform strings', () => {
      window.Capacitor = {
        isNativePlatform: () => false,
        getPlatform: () => "electron",
      };
      expect(getPlatform()).toBe("web");
    });

    it('returns "web" when getPlatform throws', () => {
      window.Capacitor = {
        isNativePlatform: () => true,
        getPlatform: () => {
          throw new Error("broken");
        },
      };
      expect(getPlatform()).toBe("web");
    });
  });
});
