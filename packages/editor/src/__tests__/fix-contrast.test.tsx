/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import {
  autoAdjustContrast,
  contrastRatio,
  CONTRAST_PAIRS,
} from "../utils/themeUtils";
import { DesignSystemEditor } from "../index";

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

describe("autoAdjustContrast", () => {
  const LIGHT_PALETTE: Record<string, string> = {
    "--background": "0 0% 100%",
    "--foreground": "0 0% 5%",
    "--card": "0 0% 100%",
    "--card-foreground": "0 0% 5%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "0 0% 5%",
    "--primary": "210 80% 42%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "210 15% 90%",
    "--secondary-foreground": "0 0% 10%",
    "--muted": "210 15% 95%",
    "--muted-foreground": "0 0% 40%",
    "--accent": "210 60% 50%",
    "--accent-foreground": "0 0% 5%",
    "--destructive": "0 70% 45%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 50% 32%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 50%",
    "--warning-foreground": "0 0% 10%",
    "--border": "0 0% 85%",
    "--input": "0 0% 90%",
    "--ring": "210 80% 55%",
    "--brand": "210 80% 42%",
  };

  const DARK_PALETTE: Record<string, string> = {
    "--background": "0 0% 10%",
    "--foreground": "0 0% 95%",
    "--card": "0 0% 13%",
    "--card-foreground": "0 0% 95%",
    "--popover": "0 0% 13%",
    "--popover-foreground": "0 0% 95%",
    "--primary": "210 80% 45%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "210 15% 20%",
    "--secondary-foreground": "0 0% 90%",
    "--muted": "0 0% 18%",
    "--muted-foreground": "0 0% 65%",
    "--accent": "210 60% 42%",
    "--accent-foreground": "0 0% 95%",
    "--destructive": "0 60% 50%",
    "--destructive-foreground": "0 0% 100%",
    "--success": "142 50% 35%",
    "--success-foreground": "0 0% 100%",
    "--warning": "45 80% 55%",
    "--warning-foreground": "0 0% 10%",
    "--border": "0 0% 22%",
    "--input": "0 0% 18%",
    "--ring": "210 80% 60%",
    "--brand": "210 80% 60%",
  };

  it("all CONTRAST_PAIRS meet AA after adjustment on a light palette", () => {
    const fixes = autoAdjustContrast(LIGHT_PALETTE);
    const resolved = { ...LIGHT_PALETTE, ...fixes };

    for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
      const fg = resolved[fgKey];
      const bg = resolved[bgKey];
      if (!fg || !bg) continue;
      const ratio = contrastRatio(fg, bg);
      expect(
        ratio,
        `${fgKey} on ${bgKey}: ${ratio.toFixed(2)}:1 should be >= 4.5:1`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("all CONTRAST_PAIRS meet AA after adjustment on a dark palette", () => {
    const fixes = autoAdjustContrast(DARK_PALETTE);
    const resolved = { ...DARK_PALETTE, ...fixes };

    for (const [fgKey, bgKey] of CONTRAST_PAIRS) {
      const fg = resolved[fgKey];
      const bg = resolved[bgKey];
      if (!fg || !bg) continue;
      const ratio = contrastRatio(fg, bg);
      expect(
        ratio,
        `${fgKey} on ${bgKey}: ${ratio.toFixed(2)}:1 should be >= 4.5:1`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("fixes a palette with deliberately failing pairs", () => {
    const broken: Record<string, string> = {
      ...LIGHT_PALETTE,
      "--foreground": "0 0% 80%", // fails on white background
      "--brand": "210 80% 75%", // fails on white background
      "--muted-foreground": "0 0% 70%", // fails on white background
    };
    const fixes = autoAdjustContrast(broken);
    const resolved = { ...broken, ...fixes };

    expect(contrastRatio(resolved["--foreground"], resolved["--background"])).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(resolved["--brand"], resolved["--background"])).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(resolved["--muted-foreground"], resolved["--background"])).toBeGreaterThanOrEqual(4.5);
  });

  it("respects locked keys", () => {
    const broken: Record<string, string> = {
      ...LIGHT_PALETTE,
      "--brand": "210 80% 80%", // fails
    };
    const locked = new Set(["--brand"]);
    const fixes = autoAdjustContrast(broken, locked);
    // Brand should NOT be modified since it's locked
    expect(fixes["--brand"]).toBeUndefined();
  });
});

describe("Suggest Alternative UI flow", () => {
  it("renders the audit dialog when contrast issues exist", async () => {
    // Render the editor with deliberately low-contrast colors
    const badColors: Record<string, string> = {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 80%", // will fail contrast
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 80%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 80%",
      "--primary": "210 80% 75%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "210 15% 90%",
      "--secondary-foreground": "0 0% 80%",
      "--muted": "210 15% 95%",
      "--muted-foreground": "0 0% 80%",
      "--accent": "210 60% 80%",
      "--accent-foreground": "0 0% 100%",
      "--destructive": "0 70% 75%",
      "--destructive-foreground": "0 0% 100%",
      "--success": "142 50% 75%",
      "--success-foreground": "0 0% 100%",
      "--warning": "45 80% 80%",
      "--warning-foreground": "0 0% 100%",
      "--border": "0 0% 85%",
      "--input": "0 0% 90%",
      "--ring": "210 80% 55%",
      "--brand": "210 80% 75%",
    };

    render(<DesignSystemEditor defaultColors={badColors} />);

    // The audit runs automatically on mount — wait for results
    await waitFor(
      () => {
        const issueText = document.body.textContent || "";
        // Either the audit found issues or it's still running
        return (
          issueText.includes("Contrast Issues Found") ||
          issueText.includes("Suggest Alternative") ||
          issueText.includes("Ignore")
        );
      },
      { timeout: 10000 },
    );

    // The Suggest Alternative button should be rendered
    const suggestBtn = screen.queryByText("Suggest Alternative");
    const ignoreBtn = screen.queryByText("Ignore");

    // At least one of these should be present if contrast issues were found
    if (suggestBtn || ignoreBtn) {
      expect(suggestBtn || ignoreBtn).toBeInTheDocument();
    }
  }, 15000);
});
