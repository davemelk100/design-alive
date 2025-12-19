# Store Module Extraction Guide

This guide provides step-by-step instructions for extracting the store module into its own standalone repository.

## Pre-Extraction Checklist

- [x] All store-related code is in `src/store/` directory
- [x] Types are centralized in `src/store/types/`
- [x] Contexts are in `src/store/context/`
- [x] Pages are in `src/store/pages/`
- [x] Data is in `src/store/data/`
- [x] Main exports are in `src/store/index.ts`

## Step 1: Create New Repository Structure

```bash
# Run from your main repository root (dm-2025)
mkdir new-store-repo
cd new-store-repo
npm init -y
cd ..  # Return to main repo root
```

## Step 2: Copy Store Module

```bash
# Run from the main repository root (dm-2025)
cp -r src/store new-store-repo/src/
```

## Step 3: Copy Required Dependencies

**Note: All commands in this section should be run from the main repository root (dm-2025)**

**Important: Create directory structure first, then copy files**

```bash
# Create the directory structure in your new repo (replace 'mi-com' with your actual repo name)
mkdir -p mi-com/components
mkdir -p mi-com/src/hooks
mkdir -p mi-com/public
```

### UI Components

```bash
# Run from main repo root (dm-2025)
# Ensure mi-com/components directory exists first (see above)
cp -r components/ui mi-com/components/
```

### Hooks

```bash
# Run from main repo root (dm-2025)
# Ensure mi-com/src/hooks directory exists first (see above)
cp -r hooks/* mi-com/src/hooks/
# Or copy specific hook:
cp hooks/use-toast.ts mi-com/src/hooks/
```

### Assets

```bash
# Run from main repo root (dm-2025)
# Ensure mi-com/public directory exists first (see above)
# Copy all product images
# Check storeProducts.ts for all image paths
cp -r public/img mi-com/public/
```

## Step 4: Update Import Paths

### In Store Pages

Update relative paths from:

- `../../../components/ui/*` → `../../components/ui/*` (adjust based on new structure)
- `@/hooks/use-toast` → `../../hooks/use-toast` or configure path alias

### Configure Path Aliases (vite.config.ts or tsconfig.json)

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  }
}
```

## Step 5: Set Up Dependencies

### package.json dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "framer-motion": "^10.x",
    "lucide-react": "^0.x",
    "@radix-ui/react-toast": "^1.x",
    "@radix-ui/react-dropdown-menu": "^2.x",
    "@radix-ui/react-avatar": "^1.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "typescript": "^5.x",
    "vite": "^5.x"
  }
}
```

## Step 6: Create Router Setup

Create `src/App.tsx` or `src/main.tsx`:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider, StoreProvider } from "./store";
import { Toaster } from "./components/ui/toaster";
import Store from "./store/pages/Store";
import ProductDetail from "./store/pages/ProductDetail";
import Checkout from "./store/pages/Checkout";
import CheckoutSuccess from "./store/pages/CheckoutSuccess";

function App() {
  return (
    <CartProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/store" element={<Store />} />
            <Route path="/store/product/:id" element={<ProductDetail />} />
            <Route path="/store/checkout" element={<Checkout />} />
            <Route
              path="/store/checkout/success"
              element={<CheckoutSuccess />}
            />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </StoreProvider>
    </CartProvider>
  );
}

export default App;
```

## Step 7: Set Up Build Configuration

### vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Step 8: Environment Configuration

### Netlify Functions (if using Stripe checkout)

Copy `netlify.toml` and `netlify/functions/` if checkout uses backend functions.

### Environment Variables

Create `.env` file if needed:

```
VITE_STRIPE_PUBLISHABLE_KEY=your_key_here
```

## Step 9: Update Styles

### Copy Global Styles

If store uses global styles, copy relevant parts from `src/globals.css`:

- Store-specific styles (`.store-page`, `.store-card-*`, etc.)
- Animation keyframes used by store
- Any custom CSS variables

## Step 10: Test the Extraction

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Test all routes:
   - `/store` - Main store page
   - `/store/product/:id` - Product detail
   - `/store/checkout` - Checkout
   - `/store/checkout/success` - Success page
4. Test functionality:
   - Add items to cart
   - Navigate between products
   - Complete checkout flow

## Step 11: Clean Up (Optional)

After confirming everything works:

- Remove any unused imports
- Remove any main-app-specific code
- Update README with store-specific information
- Add store-specific configuration

## Files to Copy Checklist

- [ ] `src/store/` (entire directory)
- [ ] `components/ui/` (all UI components)
- [ ] `hooks/use-toast.ts`
- [ ] `public/img/` (all product images)
- [ ] `netlify.toml` (if using Netlify)
- [ ] `netlify/functions/` (if using backend functions)
- [ ] Relevant parts of `src/globals.css`
- [ ] `package.json` dependencies
- [ ] Build configuration files

## Notes

- Cart data uses localStorage key `"davemelk-cart"` - consider renaming for standalone app
- All product images must be in `public/img/` directory
- The store uses a liquid glass design with animated backgrounds
- Toast notifications require Radix UI Toast components
