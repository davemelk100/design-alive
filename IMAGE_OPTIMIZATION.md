# Image Optimization Guide

## Current Status

All images now have:

- ✅ `loading="lazy"` - Lazy loads images below the fold
- ✅ `decoding="async"` - Allows async decoding to prevent blocking
- ✅ `width` and `height` attributes - Prevents layout shift (CLS)
- ✅ **Automatic WebP conversion via Netlify Image CDN** - Images are automatically converted to WebP format in production

## Implementation

All image references now use the `getOptimizedImage()` utility function which:

- Automatically converts PNG/JPG to WebP format in production via Netlify Image CDN
- Applies width optimization based on display size
- Falls back to original images in development
- Works transparently without manual image conversion needed

## Additional Optimizations (Optional)

### 1. Manual Image Format Conversion (WebP/AVIF) - Optional

**Note**: This is now **optional** as Netlify Image CDN automatically converts images to WebP in production. Manual conversion can provide even better control over quality and file sizes.

The Lighthouse report indicates significant savings from converting PNG images to modern formats:

- **WebP**: ~30-50% smaller than PNG with same quality
- **AVIF**: ~50-70% smaller than PNG with same quality

**Recommended images to convert:**

- `/img/tunnel-article.png` (670 KB → ~200-300 KB with WebP)
- `/img/vintage-phone.png` (660 KB → ~200-300 KB with WebP)
- `/img/propio-story.png` (577 KB → ~170-290 KB with WebP)
- `/img/ht.png` (471 KB → ~140-235 KB with WebP)
- `/img/delta-story.png` (339 KB → ~100-170 KB with WebP)
- `/img/delta-search.png` (322 KB → ~95-160 KB with WebP)
- `/img/hex-orange.png` (173 KB → ~50-85 KB with WebP)
- `/img/nfl-logos.png` (122 KB → ~35-60 KB with WebP)
- `/img/figma-mobile-2.png` (84 KB → ~25-40 KB with WebP)
- `/img/figma-wire.png` (62 KB → ~18-30 KB with WebP)
- `/img/dpanez.png` (55 KB → ~15-25 KB with WebP)

**Tools to convert:**

- Online: https://squoosh.app/ (supports WebP and AVIF)
- CLI: `sharp` or `imagemin-webp` npm packages
- Netlify plugin: `netlify-plugin-image-optim` (auto-converts on deploy)

**After conversion, update references in `src/content.ts` to use `.webp` or `.avif` extensions.**

### 2. Responsive Images (srcset)

For large images that display at different sizes on different screens, add `srcset`:

```jsx
<img
  src="/img/tunnel-article.webp"
  srcSet="/img/tunnel-article-400.webp 400w,
          /img/tunnel-article-800.webp 800w,
          /img/tunnel-article-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="..."
  loading="lazy"
  decoding="async"
/>
```

This requires generating multiple image sizes:

- Small: ~400px width
- Medium: ~800px width
- Large: ~1200px width

### 3. Netlify Image CDN (Recommended)

Consider using Netlify's built-in image optimization:

- Automatically converts to WebP/AVIF
- Generates responsive sizes
- Serves from CDN

Update image URLs to use Netlify's image CDN:

```jsx
// Before
src = "/img/tunnel-article.png";

// After (with Netlify Image CDN)
src = "/.netlify/images?url=/img/tunnel-article.png&w=800&q=80&fm=webp";
```

Or use a plugin: `netlify-plugin-image-optim` for automatic optimization.

## Estimated Savings

After implementing WebP conversion:

- **Current total**: ~3,540 KB
- **Estimated with WebP**: ~1,200-1,500 KB
- **Savings**: ~2,000-2,300 KB (60-65% reduction)

This would significantly improve:

- LCP (Largest Contentful Paint)
- Page Load Time
- Mobile performance
- Bandwidth usage
