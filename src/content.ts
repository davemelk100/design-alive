export const content = {
  designSystem: {
    sections: {
      colors: "Colors",
    },
    specsContent: `All palette colors are HSL custom properties on :root - shift a hue by 180° for complementary, ±150° for split-complementary, and so on. From one brand color the system derives the full token set (secondary, accent, muted, destructive) using your choice of harmony scheme: complementary, triadic, analogous, split-complementary, or tetradic.

Every foreground/background pair is audited against WCAG AA (4.5:1) via a built-in contrast auditor. Failing pairs are auto-corrected by adjusting foreground lightness, and fixes are cached so subsequent visits skip the redundant audit. Your theme persists in localStorage across reloads.`,
  },
} as const;

export default content;
