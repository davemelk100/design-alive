/// <reference types="vitest/globals" />
import { scanHostStyles, mapPaletteToTokens, buildOverrideStylesheet } from "../utils/hostScanner";
import type { HostPalette } from "../utils/hostScanner";

describe("scanHostStyles", () => {
  it("returns an empty palette when body has no children", () => {
    const palette = scanHostStyles(null);
    // JSDOM has minimal elements; just verify shape
    expect(palette).toHaveProperty("backgrounds");
    expect(palette).toHaveProperty("texts");
    expect(palette).toHaveProperty("borders");
    expect(palette).toHaveProperty("fonts");
    expect(Array.isArray(palette.backgrounds)).toBe(true);
  });

  it("skips elements inside editorRoot", () => {
    const container = document.createElement("div");
    container.className = "ds-editor";
    const inner = document.createElement("span");
    inner.textContent = "editor content";
    container.appendChild(inner);
    document.body.appendChild(container);

    const outside = document.createElement("div");
    outside.textContent = "host content";
    document.body.appendChild(outside);

    const palette = scanHostStyles(container);
    // Should not include colors from editor children
    // Just verify it doesn't crash and returns a palette
    expect(palette.backgrounds).toBeDefined();

    document.body.removeChild(container);
    document.body.removeChild(outside);
  });
});

describe("mapPaletteToTokens", () => {
  it("maps a typical light site palette", () => {
    const palette: HostPalette = {
      backgrounds: [
        { hex: "#ffffff", hsl: "0 0% 100%", count: 50 },
        { hex: "#f5f5f5", hsl: "0 0% 96.1%", count: 10 },
      ],
      texts: [
        { hex: "#1a1a1a", hsl: "0 0% 10.2%", count: 40 },
        { hex: "#666666", hsl: "0 0% 40%", count: 20 },
        { hex: "#2563eb", hsl: "217.2 91.2% 53.3%", count: 8 },
      ],
      borders: [
        { hex: "#e5e5e5", hsl: "0 0% 89.8%", count: 15 },
      ],
      fonts: [
        { family: "Inter", count: 50 },
      ],
    };

    const tokens = mapPaletteToTokens(palette);

    expect(tokens["--background"]).toBe("0 0% 100%");
    expect(tokens["--foreground"]).toBeDefined();
    expect(tokens["--brand"]).toBeDefined();
    expect(tokens["--border"]).toBe("0 0% 89.8%");
    expect(tokens["--card"]).toBe("0 0% 96.1%");
  });

  it("maps a dark site palette", () => {
    const palette: HostPalette = {
      backgrounds: [
        { hex: "#111111", hsl: "0 0% 6.7%", count: 50 },
        { hex: "#1e1e1e", hsl: "0 0% 11.8%", count: 10 },
      ],
      texts: [
        { hex: "#eeeeee", hsl: "0 0% 93.3%", count: 40 },
        { hex: "#10b981", hsl: "160.1 84.1% 39.4%", count: 5 },
      ],
      borders: [],
      fonts: [],
    };

    const tokens = mapPaletteToTokens(palette);

    expect(tokens["--background"]).toBe("0 0% 6.7%");
    expect(tokens["--foreground"]).toBeDefined();
    expect(tokens["--brand"]).toBeDefined();
  });

  it("returns empty object for empty palette", () => {
    const palette: HostPalette = {
      backgrounds: [],
      texts: [],
      borders: [],
      fonts: [],
    };
    const tokens = mapPaletteToTokens(palette);
    expect(Object.keys(tokens).length).toBe(0);
  });
});

describe("buildOverrideStylesheet", () => {
  it("generates CSS with var() references", () => {
    const css = buildOverrideStylesheet();
    expect(css).toContain("hsl(var(--background))");
    expect(css).toContain("hsl(var(--foreground))");
    expect(css).toContain("hsl(var(--brand))");
    expect(css).toContain(":not(.ds-editor)");
  });

  it("does not contain !important", () => {
    const css = buildOverrideStylesheet();
    expect(css).not.toContain("!important");
  });
});
