/// <reference types="vitest/globals" />
import * as lazyIcons from "../utils/lazyIcons";

describe("lazyIcons", () => {
  const expectedIcons = [
    "LazyHome",
    "LazyPalette",
    "LazyBookOpen",
    "LazyBriefcase",
    "LazySearch",
    "LazySun",
    "LazyMoon",
    "LazyEye",
    "LazyHeart",
    "LazyCheck",
    "LazyExternalLink",
    "LazyLink2",
    "LazyFlaskConical",
    "LazyUsers",
    "LazyAlertCircle",
    "LazyZap",
    "LazyGlobe",
    "LazyShield",
    "LazySettings",
    "LazyCode",
    "LazyDatabase",
    "LazySmartphone",
    "LazyCamera",
    "LazyMail",
    "LazyBell",
    "LazyClock",
    "LazyDownload",
  ];

  it("exports all 27 lazy icon components", () => {
    expect(Object.keys(lazyIcons)).toHaveLength(27);
  });

  it.each(expectedIcons)("exports %s", (name) => {
    expect(lazyIcons).toHaveProperty(name);
  });

  it("each export has $$typeof for React.lazy", () => {
    for (const name of expectedIcons) {
      const icon = (lazyIcons as Record<string, unknown>)[name] as { $$typeof: symbol };
      expect(icon.$$typeof).toBeDefined();
    }
  });
});
