# Store Code Separation Guide

This document outlines how the store code is organized to be easily extracted into a separate repository.

## Overview

The BALM store is currently integrated into the main dm-2025 project but is structured to be completely independent and can be extracted into a standalone repository with minimal effort.

## Store-Specific Files and Directories

### Frontend (React/TypeScript)

#### Core Store Directory

**Location:** `/src/store/`

All store-specific React components, pages, contexts, and types:

```
src/store/
├── components/          # Store-specific UI components
│   ├── ImageModal.tsx
│   ├── LegalModal.tsx
│   ├── ProtectedRoute.tsx
│   └── StoreHeader.tsx
├── context/            # Store state management
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── StoreContext.tsx
├── data/               # Product data
│   └── storeProducts.ts
├── pages/              # Store pages (routes)
│   ├── AuthCallback.tsx
│   ├── Checkout.tsx
│   ├── CheckoutSuccess.tsx
│   ├── Login.tsx
│   ├── ProductDetail.tsx
│   ├── Signup.tsx
│   └── Store.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── index.ts           # Store barrel export
├── EXTRACTION_GUIDE.md
└── README.md
```

#### Store Assets

**Location:** `/public/img/` (store-specific images)

Store-specific images to extract:

- `balm-varsity.svg` - Store logo
- `balm-shirt-*.png` - Product images
- Any other BALM-branded assets

### Backend (Python/FastAPI)

#### API Routes

**Location:** `/backend/app/api/routes/products.py`

All product, inventory, and order management endpoints:

- CRUD operations for products
- Inventory management
- Order processing
- Dashboard statistics

#### Database Models

**Location:** `/backend/app/models/product.py`

SQLAlchemy models:

- `Product` - Product catalog
- `Order` - Customer orders
- `InventoryLog` - Inventory tracking

#### Schemas

**Location:** `/backend/app/schemas/product.py`

Pydantic validation schemas:

- Product schemas (create, update, response)
- Order schemas
- Inventory log schemas
- Dashboard statistics

#### Admin Panel

**Location:** `/backend/store_admin.html`

Standalone HTML admin interface for store management.

#### Database Initialization

**Location:** `/backend/scripts/init_db.py`

Contains `init_sample_products()` function for seeding store data.

#### Documentation

- `/backend/INVENTORY_SYSTEM.md`
- `/backend/INVENTORY_QUICKSTART.md`
- `/backend/INVENTORY_IMPLEMENTATION.md`

### Configuration Files

Store-specific configurations to consider:

- Environment variables for Stripe API keys
- Database connection for store tables
- Authentication secrets

## Shared Dependencies

These are UI components from the main project that the store currently uses. When extracting, you'll need to either:

1. Copy these to the new repo, or
2. Replace with alternative implementations

### UI Components (from `/components/ui/`)

- `button.tsx`
- `card.tsx`
- `input.tsx`
- `label.tsx`
- `dropdown-menu.tsx`
- `avatar.tsx`
- `separator.tsx`
- `alert.tsx`

### Utilities

- `/lib/utils.ts` - Contains `cn()` utility for Tailwind class merging

### Hooks

- `/hooks/use-toast.ts` - Toast notifications

## Integration Points in Main App

### App.tsx Integration

The store is currently integrated into `/src/App.tsx`:

```typescript
// Imports
import { CartProvider, StoreProvider, AuthProvider } from "./store";
import { ProtectedRoute } from "./store/components/ProtectedRoute";

// Lazy loaded pages
const Store = lazy(() => import("./store/pages/Store"));
const ProductDetail = lazy(() => import("./store/pages/ProductDetail"));
// ... etc

// Routes (all under /store path)
<Route path="/store" element={<Store />} />
<Route path="/store/product/:id" element={<ProductDetail />} />
<Route path="/store/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
// ... etc

// Context Providers
<StoreProvider>
  <AuthProvider>
    <CartProvider>
      {/* routes */}
    </CartProvider>
  </AuthProvider>
</StoreProvider>
```

### Backend Integration

In `/backend/app/main.py`:

```python
# Import store router
from app.api.routes.products import router as products_router

# Include store routes
app.include_router(products_router)

# Store admin panel route
@app.get("/admin/store", response_class=HTMLResponse)
async def serve_store_admin():
    # Serves store_admin.html
```

## Extraction Process

### Step 1: Create New Repository Structure

```
balm-store/
├── frontend/
│   ├── src/
│   │   ├── components/     # Copy from src/store/components
│   │   ├── context/        # Copy from src/store/context
│   │   ├── data/          # Copy from src/store/data
│   │   ├── pages/         # Copy from src/store/pages
│   │   ├── types/         # Copy from src/store/types
│   │   ├── ui/            # Copy needed components from components/ui
│   │   ├── lib/           # Copy utils.ts
│   │   ├── hooks/         # Copy needed hooks
│   │   ├── App.tsx        # New root component
│   │   └── main.tsx       # Entry point
│   ├── public/
│   │   └── img/           # Copy store-specific images
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── products.py
│   │   ├── models/
│   │   │   └── product.py
│   │   ├── schemas/
│   │   │   └── product.py
│   │   ├── core/          # Copy config and auth
│   │   ├── db/            # Copy database setup
│   │   └── main.py        # Simplified for store only
│   ├── scripts/
│   │   └── init_db.py     # Store-specific version
│   ├── store_admin.html
│   ├── requirements.txt
│   └── README.md
├── .env.example
├── netlify.toml          # If deploying to Netlify
└── README.md
```

### Step 2: Update Imports

1. **Frontend**: Change all imports from `../../components/ui/` to relative paths within the new structure
2. **Backend**: Update any shared utility imports to be store-specific
3. **Remove** dependencies on main app contexts or utilities

### Step 3: Create Standalone Configuration

1. **New package.json** with only store dependencies
2. **New vite.config.ts** with store-specific settings
3. **Environment variables** for store only
4. **Database** setup for store tables only

### Step 4: Update Routing

Create a new `App.tsx` in the standalone repo that doesn't use `/store` prefix:

```typescript
// Instead of /store/checkout
<Route path="/checkout" element={<Checkout />} />

// Instead of /store/product/:id
<Route path="/product/:id" element={<ProductDetail />} />
```

### Step 5: API Configuration

Update API base URL in store code to point to the new backend location:

```typescript
// In src/config/api.ts or similar
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

## Testing the Extraction

### Frontend Testing

```bash
cd balm-store/frontend
npm install
npm run dev
# Should run independently on localhost:5173
```

### Backend Testing

```bash
cd balm-store/backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# Should run independently on localhost:8000
```

### Database Setup

```bash
python scripts/init_db.py
# Should create store tables only
```

## Maintaining Both Versions

If you want to maintain both:

1. Keep the store in the main repo as-is
2. Create the standalone repo as described above
3. Use git submodules or monorepo tools if you want to sync changes
4. Or manually sync major updates between repos

## Benefits of This Structure

✅ **Clear Separation**: All store code is in `/src/store/` directory  
✅ **Minimal Dependencies**: Only uses standard UI components  
✅ **Independent Backend**: Store API routes are self-contained  
✅ **Own Database Tables**: Store uses separate Product, Order, InventoryLog tables  
✅ **Separate Admin**: store_admin.html is standalone  
✅ **Path-based Routing**: All store routes under `/store` prefix  
✅ **Independent Contexts**: CartContext, AuthContext, StoreContext don't depend on main app

## Current Status

✅ Store code is already well-isolated in `/src/store/`  
✅ Backend routes are modular and independent  
✅ Admin panel is standalone HTML  
✅ Database models are separate from content models  
✅ All store routes use `/store` prefix

⚠️ Dependencies to extract:

- UI components from `/components/ui/`
- `utils.ts` from `/lib/`
- Toast hook from `/hooks/`

## Next Steps

When you're ready to extract:

1. Follow the extraction process above
2. Test standalone deployment
3. Update documentation for the new repo
4. Set up CI/CD for the standalone store
5. Configure environment variables for production

## Questions or Issues?

Refer to:

- `/src/store/EXTRACTION_GUIDE.md` (if exists)
- `/backend/INVENTORY_SYSTEM.md` for backend details
- This guide for overall structure
