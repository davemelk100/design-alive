# Lighthouse Testing Guide

## Important: Test Production Build, Not Dev Server

**Lighthouse errors about JavaScript minification (7,344 KiB savings) occur when testing the dev server.**

### The Issue

When you run Lighthouse on `http://localhost:5173` (dev server), JavaScript is **not minified** because:
- Dev mode prioritizes fast rebuilds and debugging
- Source maps are included
- Code is not optimized or minified
- This is expected behavior for development

### The Solution

**Always test Lighthouse on the production build:**

```bash
# 1. Build the production version
npm run build

# 2. Preview the production build
npm run preview

# 3. Run Lighthouse on the preview server
# Open http://localhost:4173 in Chrome
# Run Lighthouse from Chrome DevTools
```

### Expected Results in Production

After testing the production build (`localhost:4173`), you should see:
- ✅ JavaScript is minified (no "Minify JavaScript" warnings)
- ✅ Smaller bundle sizes
- ✅ Better performance scores
- ✅ Proper code splitting

### Current Build Configuration

The build is configured with:
- ✅ Terser minification with 3 passes
- ✅ Aggressive compression options
- ✅ Tree-shaking enabled
- ✅ Code splitting configured

### If You Still See Minification Warnings

1. **Verify you're testing the production build** (`localhost:4173`, not `localhost:5173`)
2. **Clear browser cache** before running Lighthouse
3. **Check the build output** - files should be minified (no whitespace, short variable names)
4. **Verify Terser is installed**: `npm list terser`

### Network Dependency Tree Issues

The "Network dependency tree" and "Document request latency" warnings are often:
- **Dev mode artifacts** - dependencies load differently in dev vs production
- **Expected in dev** - Vite pre-bundles dependencies for HMR
- **Not present in production** - production build uses proper code splitting

### Image Delivery Optimization

The "Improve image delivery" warning (3,525 KiB savings) is about:
- Converting images to WebP format
- Using responsive images
- **Status**: Netlify Image CDN handles this automatically in production

### Layout Shift & LCP

These metrics improve significantly in production builds due to:
- Proper code splitting
- Lazy loading
- Optimized bundle sizes
- Better caching

## Summary

**Always run Lighthouse on the production build (`npm run preview` → `localhost:4173`), not the dev server (`npm run dev` → `localhost:5173`).**

