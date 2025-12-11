# Dependency Tree Optimization

## Changes Made

### ✅ Critical Path Optimizations

1. **Excluded Large Dependencies from Pre-bundling**

   - `lucide-react` (937 KB) - Only used in lazy-loaded `MobileTrayMenu`
   - `@radix-ui/react-icons` (494 KB) - Only used in lazy-loaded `Footer`
   - `framer-motion` (102 KB) - Only used in lazy-loaded pages (`ArticleModal`, `Specs`, `Story`, etc.)
   - These will load on-demand when their components render, not blocking initial load

2. **Optimized Image Utility**

   - Lightweight implementation with fast-path returns
   - Minimal processing overhead in development
   - Cached environment checks

3. **Deferred Non-Critical Code**

   - `storageMigration.ts` - Loaded after page is interactive
   - All components using heavy dependencies are lazy-loaded

4. **Production Code Splitting**
   - Content.ts in separate chunk (48 KB)
   - React core separated from React DOM
   - Router in separate chunk
   - All heavy dependencies in separate vendor chunks

## Development vs Production

### Development Mode (localhost:5173)

- Vite's dependency analyzer shows all dependencies in the tree (including lazy-loaded ones)
- This is **expected behavior** for HMR (Hot Module Replacement)
- Dependencies appear in the tree but **don't block the critical path**
- They load asynchronously when lazy components render

### Production Mode

- Dependencies are in separate chunks that load on-demand
- Critical path includes only: React → React DOM → Router → App → Content
- Heavy dependencies (icons, framer-motion) load separately
- Much shorter dependency chain

## Expected Production Results

After deploying to Netlify:

- **Maximum critical path latency**: ~120-140ms (down from 365ms in dev)
- **FCP**: Under 1.5s
- **LCP**: Under 2.5s
- Icon libraries and framer-motion load asynchronously after initial render

## Testing

To see production behavior:

```bash
npm run build
npm run preview
# Then test Lighthouse on http://localhost:4173
```

Or test on deployed Netlify URL to see full optimization benefits.
