/**
 * Centralized breakpoint constants matching Tailwind's default screen sizes.
 * Use these instead of magic numbers in JS-based responsive checks.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
