import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  serializeThemeState,
  deserializeThemeState,
  generateDesignTokens,
  exportPaletteAsText,
  exportPaletteAsSvg,
} from "../../packages/editor/src/utils/themeUtils";

const mockColors: Record<string, string> = {
  "--brand": "220 70% 50%",
  "--secondary": "260 30% 60%",
  "--accent": "180 50% 45%",
  "--background": "0 0% 100%",
  "--foreground": "0 0% 10%",
};

const mockCard = {
  preset: "solid" as const,
  shadowOffsetX: 0,
  shadowOffsetY: 2,
  shadowBlur: 8,
  shadowSpread: 0,
  shadowColor: "rgba(0,0,0,0.1)",
  borderRadius: 12,
  bgType: "solid" as const,
  bgGradientAngle: 135,
  borderWidth: 0,
  backdropBlur: 0,
  bgOpacity: 1,
};

const mockTypography = {
  preset: "system" as const,
  headingFamily: "system-ui, sans-serif",
  bodyFamily: "system-ui, sans-serif",
  baseFontSize: 17,
  headingWeight: 300,
  bodyWeight: 300,
  lineHeight: 1.5,
  letterSpacing: 0,
  headingLetterSpacing: 0,
};

const mockAlert = {
  preset: "filled" as const,
  borderRadius: 8,
  borderWidth: 0,
  iconStyle: "circle" as const,
  padding: 16,
};

const mockInteraction = {
  preset: "subtle" as const,
  hoverOpacity: 0.85,
  hoverScale: 1,
  activeScale: 0.97,
  transitionDuration: 150,
  focusRingWidth: 2,
};

const mockTypoInteraction = {
  preset: "subtle" as const,
  linkHoverOpacity: 0.8,
  linkHoverScale: 1,
  linkActiveScale: 0.98,
  linkTransitionDuration: 150,
  linkUnderline: "hover" as const,
  headingHoverOpacity: 1,
  headingHoverScale: 1,
  headingTransitionDuration: 150,
};

describe("smoke tests", () => {
  it("vitest + jsdom + testing-library works", () => {
    render(
      <MemoryRouter>
        <div>hello</div>
      </MemoryRouter>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});

describe("serializeThemeState / deserializeThemeState", () => {
  it("round-trips theme state through serialize and deserialize", () => {
    const hash = serializeThemeState(
      mockColors,
      mockCard,
      mockTypography,
      mockAlert,
      mockInteraction,
      mockTypoInteraction,
    );
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);

    const result = deserializeThemeState(hash);
    expect(result).not.toBeNull();
    expect(result!.colors).toEqual(mockColors);
    expect(result!.cardStyle).toEqual(mockCard);
    expect(result!.typographyState).toEqual(mockTypography);
    expect(result!.alertStyle).toEqual(mockAlert);
    expect(result!.interactionStyle).toEqual(mockInteraction);
    expect(result!.typoInteractionStyle).toEqual(mockTypoInteraction);
  });

  it("returns null for invalid hash", () => {
    expect(deserializeThemeState("not-valid-base64!!!")).toBeNull();
    expect(deserializeThemeState("")).toBeNull();
  });

  it("returns null for valid base64 but missing fields", () => {
    const partial = btoa(JSON.stringify({ c: mockColors }));
    expect(deserializeThemeState(partial)).toBeNull();
  });
});

describe("generateDesignTokens", () => {
  it("produces a valid W3C design token structure", () => {
    const tokens = generateDesignTokens(
      mockColors,
      mockCard,
      mockTypography,
      mockAlert,
      mockInteraction,
    );

    // Color tokens
    expect(tokens.color).toBeDefined();
    const colorTokens = tokens.color as Record<string, { $value: string; $type: string }>;
    expect(colorTokens.brand.$type).toBe("color");
    expect(colorTokens.brand.$value).toBe("hsl(220 70% 50%)");
    expect(colorTokens.background.$value).toBe("hsl(0 0% 100%)");

    // Typography tokens
    const typo = tokens.typography as Record<string, Record<string, { $value: unknown; $type: string }>>;
    expect(typo.fontFamily.heading.$value).toBe("system-ui, sans-serif");
    expect(typo.fontSize.base.$value).toBe("17px");
    expect(typo.fontSize.base.$type).toBe("dimension");

    // Border radius
    const radius = tokens.borderRadius as Record<string, { $value: string; $type: string }>;
    expect(radius.card.$value).toBe("12px");
    expect(radius.alert.$value).toBe("8px");

    // Interaction tokens
    const interaction = tokens.interaction as Record<string, { $value: unknown; $type: string }>;
    expect(interaction.hoverOpacity.$value).toBe(0.85);
    expect(interaction.transitionDuration.$value).toBe("150ms");
    expect(interaction.transitionDuration.$type).toBe("duration");
  });
});

describe("exportPaletteAsText", () => {
  it("exports HEX format", () => {
    const text = exportPaletteAsText(mockColors, "hex");
    expect(text).toContain("Brand: #");
    expect(text).toContain("Background: #ffffff");
    const lines = text.split("\n");
    expect(lines.length).toBe(5);
  });

  it("exports RGB format", () => {
    const text = exportPaletteAsText(mockColors, "rgb");
    expect(text).toContain("rgb(");
    expect(text).toContain("Background: rgb(255, 255, 255)");
  });

  it("exports RGBA format", () => {
    const text = exportPaletteAsText(mockColors, "rgba");
    expect(text).toContain("rgba(");
    expect(text).toContain(", 1)");
  });
});

describe("exportPaletteAsSvg", () => {
  it("produces valid SVG markup", () => {
    const svg = exportPaletteAsSvg(mockColors);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("Brand");
    expect(svg).toContain('fill="#');
  });
});
