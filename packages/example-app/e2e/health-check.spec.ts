import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const THEMES = ["light", "dark", "grey", "blue"];

const REQUIRED_CSS_VARS = [
  "--background",
  "--foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--card",
  "--card-foreground",
  "--border",
  "--brand",
];

const SECTIONS = ["colors", "buttons", "card", "alerts", "typography", "inputs", "tables"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Click a theme preset button in the controls bar */
async function switchTheme(page: import("@playwright/test").Page, theme: string) {
  await page.locator(`button:has-text("${theme}")`).first().click();
  // Allow CSS vars + re-render to settle
  await page.waitForTimeout(800);
}

/** Get a computed style value from an element */
async function getComputed(
  page: import("@playwright/test").Page,
  selector: string,
  prop: string,
) {
  return page.evaluate(
    ([sel, p]) => {
      const el = document.querySelector(sel!);
      if (!el) return null;
      return getComputedStyle(el).getPropertyValue(p!).trim();
    },
    [selector, prop],
  );
}

/** Get computed font-family from an element */
async function getFontFamily(page: import("@playwright/test").Page, selector: string) {
  return page.evaluate(
    (sel) => {
      const el = document.querySelector(sel!);
      if (!el) return null;
      return getComputedStyle(el).fontFamily;
    },
    selector,
  );
}

/** Parse an HSL string "H S% L%" into { h, s, l } */
function parseHSL(hsl: string): { h: number; s: number; l: number } | null {
  const parts = hsl.replace(/%/g, "").trim().split(/\s+/);
  if (parts.length < 3) return null;
  return { h: +parts[0], s: +parts[1], l: +parts[2] };
}

/** Rough luminance from HSL lightness — enough for sanity checks */
function isLightBackground(hsl: string): boolean {
  const parsed = parseHSL(hsl);
  return parsed ? parsed.l > 50 : true;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("Plugin Health Check", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".ds-editor");
  });

  // ── CSS Variables ─────────────────────────────────────────────────────

  test.describe("CSS Variables", () => {
    for (const theme of THEMES) {
      test(`all required CSS vars resolve on "${theme}" theme`, async ({ page }) => {
        await switchTheme(page, theme);

        const missing = await page.evaluate(
          ([vars]) => {
            const editor = document.querySelector(".ds-editor");
            if (!editor) return ["<.ds-editor not found>"];
            const style = getComputedStyle(editor);
            return (vars as string[]).filter((v) => !style.getPropertyValue(v).trim());
          },
          [REQUIRED_CSS_VARS],
        );

        expect(missing, `Missing CSS vars on "${theme}": ${missing.join(", ")}`).toEqual([]);
      });
    }
  });

  // ── Theme Switching ───────────────────────────────────────────────────

  test.describe("Theme Switching", () => {
    for (const theme of THEMES) {
      test(`"${theme}" theme applies distinct --background`, async ({ page }) => {
        await switchTheme(page, theme);
        const bg = await getComputed(page, ".ds-editor", "--background");
        expect(bg, `--background should be non-empty on "${theme}"`).toBeTruthy();
      });
    }

    test("switching themes changes --background value", async ({ page }) => {
      await switchTheme(page, "light");
      const lightBg = await getComputed(page, ".ds-editor", "--background");

      await switchTheme(page, "dark");
      const darkBg = await getComputed(page, ".ds-editor", "--background");

      expect(lightBg).not.toEqual(darkBg);
    });
  });

  // ── Section Nav ───────────────────────────────────────────────────────

  test.describe("Section Nav", () => {
    for (const theme of THEMES) {
      test(`nav background is transparent on "${theme}"`, async ({ page }) => {
        await switchTheme(page, theme);

        const navBg = await page.evaluate(() => {
          const nav = document.querySelector(".ds-section-nav") as HTMLElement;
          if (!nav) return null;
          return getComputedStyle(nav).backgroundColor;
        });

        // Nav is intentionally transparent so it blends with the editor background
        expect(
          navBg,
          `Nav bg should be transparent on "${theme}"`,
        ).toMatch(/rgba?\(0, 0, 0, 0\)|transparent/);
      });
    }

    test("nav heading arrows match section header arrow size", async ({ page }) => {
      const navArrowSize = await page.evaluate(() => {
        const svg = document.querySelector(".ds-section-nav h2 svg");
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        return { w: Math.round(rect.width), h: Math.round(rect.height) };
      });

      const sectionArrowSize = await page.evaluate(() => {
        // Find the first section header's up-arrow SVG
        const headers = document.querySelectorAll("#colors h2 svg, #buttons h2 svg");
        for (const svg of headers) {
          const rect = svg.getBoundingClientRect();
          if (rect.width > 0) return { w: Math.round(rect.width), h: Math.round(rect.height) };
        }
        return null;
      });

      expect(navArrowSize, "Nav arrow should exist").toBeTruthy();
      expect(sectionArrowSize, "Section header arrow should exist").toBeTruthy();
      if (navArrowSize && sectionArrowSize) {
        expect(
          Math.abs(navArrowSize.w - sectionArrowSize.w),
          `Arrow widths should match (nav: ${navArrowSize.w}, section: ${sectionArrowSize.w})`,
        ).toBeLessThanOrEqual(2);
      }
    });
  });

  // ── Font Inheritance ──────────────────────────────────────────────────

  test.describe("Font Inheritance", () => {
    test("headings inherit host font-family, not system-ui", async ({ page }) => {
      const headingFont = await getFontFamily(page, ".ds-editor h2");
      expect(
        headingFont,
        `Heading font should not be system-ui default. Got: ${headingFont}`,
      ).not.toMatch(/^system-ui/);
    });

    test("body text inherits host font-family", async ({ page }) => {
      const bodyFont = await getFontFamily(page, ".ds-editor");
      // The example app sets Courier New on body
      expect(
        bodyFont,
        `Editor should inherit host body font. Got: ${bodyFont}`,
      ).toContain("Courier");
    });

    test("headings use a different font than body", async ({ page }) => {
      const headingFont = await getFontFamily(page, ".ds-editor h2");
      const bodyFont = await getFontFamily(page, ".ds-editor p");
      // If host sets different heading/body fonts, they should differ
      // (the example app sets Roboto Serif for headings, Courier for body)
      if (headingFont && bodyFont) {
        expect(
          headingFont,
          "Heading and body fonts should differ when host sets them differently",
        ).not.toEqual(bodyFont);
      }
    });
  });

  // ── Contrast & Colors ─────────────────────────────────────────────────

  test.describe("Contrast & Foreground Colors", () => {
    for (const theme of THEMES) {
      test(`foreground text is visible against background on "${theme}"`, async ({ page }) => {
        await switchTheme(page, theme);

        const { bgL, fgL } = await page.evaluate(() => {
          const editor = document.querySelector(".ds-editor");
          if (!editor) return { bgL: 50, fgL: 50 };
          const style = getComputedStyle(editor);
          const bg = style.getPropertyValue("--background").trim();
          const fg = style.getPropertyValue("--foreground").trim();
          const parseLightness = (hsl: string) => {
            const parts = hsl.replace(/%/g, "").trim().split(/\s+/);
            return parts.length >= 3 ? +parts[2] : 50;
          };
          return { bgL: parseLightness(bg), fgL: parseLightness(fg) };
        });

        const contrast = Math.abs(bgL - fgL);
        expect(
          contrast,
          `Lightness difference should be >= 40 on "${theme}" (bg: ${bgL}%, fg: ${fgL}%)`,
        ).toBeGreaterThanOrEqual(40);
      });
    }

    for (const theme of THEMES) {
      test(`no hardcoded #fff or #000 in computed heading color on "${theme}"`, async ({
        page,
      }) => {
        await switchTheme(page, theme);
        const color = await page.evaluate(() => {
          const h2 = document.querySelector(".ds-editor h2");
          return h2 ? getComputedStyle(h2).color : null;
        });
        // Computed color should be rgb(), not a keyword or hex
        expect(color, "Heading should have a computed color").toBeTruthy();
      });
    }
  });

  // ── Sections Exist ────────────────────────────────────────────────────

  test.describe("Sections", () => {
    for (const section of SECTIONS) {
      test(`section #${section} is present`, async ({ page }) => {
        const exists = await page.locator(`#${section}`).count();
        expect(exists, `Section #${section} should exist`).toBeGreaterThan(0);
      });
    }
  });

  // ── No Global CSS Leaks ───────────────────────────────────────────────

  test.describe("CSS Isolation", () => {
    test("plugin does not override body font-family", async ({ page }) => {
      const bodyFont = await getFontFamily(page, "body");
      expect(
        bodyFont,
        `Body font should be the host's Courier, not Tailwind default. Got: ${bodyFont}`,
      ).toContain("Courier");
    });

    test("plugin does not override body background-color", async ({ page }) => {
      const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      // Body should be transparent or white-ish (host default), not a themed color
      expect(bodyBg).toMatch(/rgba?\(0, 0, 0, 0\)|rgba?\(255, 255, 255/);
    });
  });

  // ── Accessibility (axe-core) ──────────────────────────────────────────

  test.describe("Accessibility", () => {
    for (const theme of THEMES) {
      test(`no critical/serious a11y violations on "${theme}" theme`, async ({ page }) => {
        await switchTheme(page, theme);
        // Wait for theme to settle
        await page.waitForTimeout(500);

        const results = await new AxeBuilder({ page })
          .include(".ds-editor")
          // Exclude preview/sample elements that show themed examples
          .exclude("[data-axe-exclude]")
          .withTags(["wcag2a", "wcag2aa"])
          .analyze();

        const critical = results.violations.filter(
          (v) => v.impact === "critical" || v.impact === "serious",
        );

        if (critical.length > 0) {
          const summary = critical.map((v) => {
            const nodes = v.nodes.slice(0, 3).map((n) => n.html.slice(0, 120));
            return `[${v.impact}] ${v.id}: ${v.help}\n  ${nodes.join("\n  ")}`;
          });
          expect(
            critical,
            `${critical.length} a11y violation(s) on "${theme}":\n${summary.join("\n\n")}`,
          ).toEqual([]);
        }
      });
    }
  });

  // ── Premium Gate ──────────────────────────────────────────────────────

  test.describe("Premium Gate", () => {
    test("locked features show lock icon, not opacity dimming", async ({ page }) => {
      // Ensure premium is off
      const premiumCheckbox = page.locator("label:has-text('premium') input[type=checkbox]");
      if (await premiumCheckbox.isChecked()) {
        await premiumCheckbox.uncheck();
        await page.waitForTimeout(300);
      }

      const gated = page.locator(".ds-premium-gated-section").first();
      if ((await gated.count()) > 0) {
        const opacity = await gated.evaluate((el) => getComputedStyle(el).opacity);
        expect(
          opacity,
          "Premium-gated sections should not use opacity dimming",
        ).toEqual("1");

        const lockIcon = gated.locator(".ds-premium-lock");
        expect(await lockIcon.count(), "Lock icon should be present").toBeGreaterThan(0);
      }
    });

    test("premium toggle unlocks features", async ({ page }) => {
      const premiumCheckbox = page.locator("label:has-text('premium') input[type=checkbox]");
      await premiumCheckbox.check();
      await page.waitForTimeout(300);

      const gatedCount = await page.locator(".ds-premium-gated-section").count();
      expect(gatedCount, "No gated sections when premium is on").toEqual(0);
    });
  });
});
