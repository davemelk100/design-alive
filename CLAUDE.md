# Project Rules

## No Inline Styles

Never use inline `style={{}}` attributes in JSX. All styling must use CSS classes, either Tailwind utility classes or custom classes defined in CSS files.

- **Colors**: Use CSS classes from `globals.css` or `editor.css` (e.g., `site-nav-link`, `ds-text-fg`, `ds-bg-card`). For one-off color values, create a named class in the appropriate CSS file.
- **Layout**: Use Tailwind utilities (e.g., `max-w-[1500px]`, `max-h-screen`, `h-dvh`).
- **Dynamic values**: If a value is computed from JS state (e.g., `transform: translateX(${offset}px)`), that is the one acceptable use of inline styles. Keep only the truly dynamic property inline and move everything else to a class.
- **Overlays**: Use a CSS class for modal backdrops instead of inline `rgba()`.

### Where to define classes

| Scope | File |
|-------|------|
| Site pages (`src/`) | `src/globals.css` |
| Editor package (`packages/editor/`) | `packages/editor/src/styles/editor.css` |

### Editor-specific color utilities

The editor package has `ds-` prefixed classes for design system colors:
`ds-text-fg`, `ds-text-muted`, `ds-text-brand`, `ds-bg`, `ds-bg-card`, `ds-border`, `ds-surface`, `ds-surface-invert`, etc. Use these instead of inline `hsl(var(--foreground))`.

## Font Sizing

Never use hardcoded pixel values for font sizes. Use the Tailwind type scale (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.) which maps to `rem` units. This lets consuming apps control the entire scale by setting `font-size` on `<html>`.

- **Do**: `text-xs`, `text-sm`, `text-base`, `text-lg`
- **Don't**: `text-[13px]`, `text-[14px]`, `fontSize: "13px"`

The Tailwind scale is defined in `tailwind.config.ts` (site) and `packages/editor/tailwind.config.ts` (editor). Both use matching rem values.

For CSS files (`globals.css`, `editor.css`), use `rem` instead of `px` for font sizes. The `--ds-base-font-size` custom property also uses rem with a fallback.

## CSS Variable Colors

All colors must use CSS custom properties via `hsl(var(--varname))`. Never use hardcoded hex, rgb, or named colors in component styles. The only exceptions are:
- Error fallback UI in `main.tsx` (renders before CSS loads)
- Logo SVG fills (brand colors baked into the asset)
