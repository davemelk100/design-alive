# Compression Setup

## Production (Netlify)

Compression is **automatically enabled** by Netlify for all assets:

- **Gzip** and **Brotli** compression are applied automatically
- HTML files are compressed (saves ~4 KB)
- JS/CSS assets are compressed (already showing as "gzip" in build output)
- No additional configuration needed

The `netlify.toml` and `netlify/_headers` files configure caching, but compression is handled automatically by Netlify's CDN.

## Development Mode

The "No compression applied" warning in Lighthouse is **expected** for local development:

- Vite dev server doesn't compress responses by default (this is normal)
- Compression would add overhead during development
- **This only affects local testing, not production**

## Verification

After deploying to Netlify, you can verify compression is working:

1. Open DevTools → Network tab
2. Check response headers for `Content-Encoding: gzip` or `Content-Encoding: br`
3. Compare response sizes (compressed vs uncompressed)

## If Compression Still Shows as Missing in Production

If you still see "No compression applied" after deploying to Netlify:

1. Check Netlify dashboard → Site settings → Build & deploy
2. Ensure the site is deployed successfully
3. Clear browser cache and test again
4. Check response headers in Network tab

Note: Some testing tools may not detect compression if testing locally via `localhost`. Always test on the deployed Netlify URL.
