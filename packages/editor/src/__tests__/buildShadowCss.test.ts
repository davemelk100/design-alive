/// <reference types="vitest/globals" />
import { buildShadowCss } from "../utils/themeUtils";

describe("buildShadowCss", () => {
  it('returns "none" when all shadow values are zero', () => {
    expect(
      buildShadowCss({
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowSpread: 0,
        shadowColor: "rgba(0,0,0,0.1)",
      }),
    ).toBe("none");
  });

  it("returns a valid CSS shadow string when blur is non-zero", () => {
    expect(
      buildShadowCss({
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        shadowBlur: 8,
        shadowSpread: 0,
        shadowColor: "rgba(0,0,0,0.1)",
      }),
    ).toBe("0px 2px 8px 0px rgba(0,0,0,0.1)");
  });

  it("returns a valid CSS shadow string when offset is non-zero", () => {
    expect(
      buildShadowCss({
        shadowOffsetX: 3,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowSpread: 0,
        shadowColor: "rgba(0,0,0,0.2)",
      }),
    ).toBe("3px 0px 0px 0px rgba(0,0,0,0.2)");
  });

  it("returns a valid CSS shadow string when spread is non-zero", () => {
    expect(
      buildShadowCss({
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        shadowSpread: 4,
        shadowColor: "#000",
      }),
    ).toBe("0px 0px 0px 4px #000");
  });

  it("includes all values in the output string", () => {
    const result = buildShadowCss({
      shadowOffsetX: 1,
      shadowOffsetY: 2,
      shadowBlur: 3,
      shadowSpread: 4,
      shadowColor: "red",
    });
    expect(result).toBe("1px 2px 3px 4px red");
  });
});
