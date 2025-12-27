# Store Code Separation Checklist

This checklist ensures the store code remains independent and can be easily extracted.

## ✅ Already Separated

- [x] All store React components in `/src/store/` directory
- [x] Store routes use `/store` prefix
- [x] Store contexts are independent (CartContext, AuthContext, StoreContext)
- [x] Backend API routes in separate `products.py` file
- [x] Database models in separate `product.py` file
- [x] Schemas in separate `product.py` file
- [x] Standalone admin panel (`store_admin.html`)
- [x] Store-specific documentation

## 🔄 When Adding New Store Features

### Frontend

- [ ] Place all new components in `/src/store/components/`
- [ ] Place all new pages in `/src/store/pages/`
- [ ] Place all new contexts in `/src/store/context/`
- [ ] Use only UI components from `/components/ui/` (easily extractable)
- [ ] Keep all store routes under `/store` prefix
- [ ] Don't import from main app contexts or utilities (except shared UI)
- [ ] Add new types to `/src/store/types/`

### Backend

- [ ] Add new endpoints to `/backend/app/api/routes/products.py`
- [ ] Add new models to `/backend/app/models/product.py`
- [ ] Add new schemas to `/backend/app/schemas/product.py`
- [ ] Keep all store routes under `/api/products` or `/api/orders` etc.
- [ ] Don't mix store and content logic

### Database

- [ ] Use separate tables (Product, Order, InventoryLog, etc.)
- [ ] Don't create foreign keys to content tables
- [ ] Keep store migrations separate if possible

### Assets

- [ ] Store all store images with `balm-` prefix in `/public/img/`
- [ ] Keep store logo as `balm-varsity.svg`
- [ ] Document any shared assets

## 🚫 What to Avoid

### DON'T:

- ❌ Import from `/src/pages/` (main app pages) into store
- ❌ Import from `/src/components/` (except when absolutely necessary)
- ❌ Use main app contexts in store components
- ❌ Mix store and content API routes
- ❌ Create database relationships between store and content tables
- ❌ Use `/store` routes for non-store features
- ❌ Add store-specific code outside `/src/store/` directory

### DO:

- ✅ Keep store code self-contained
- ✅ Use only shared UI components from `/components/ui/`
- ✅ Document any new dependencies
- ✅ Test store features independently
- ✅ Keep API routes modular
- ✅ Use environment variables for configuration

## 📋 Before Extraction

Run through this checklist before attempting to extract:

### Code Review

- [ ] Confirm all store components are in `/src/store/`
- [ ] Verify no imports from main app (except UI components)
- [ ] Check that all routes use `/store` prefix
- [ ] Ensure contexts are independent
- [ ] Review backend routes are in `products.py`
- [ ] Confirm database tables are separate

### Dependencies Audit

- [ ] List all UI components used by store
- [ ] Identify shared utilities
- [ ] Document any shared hooks
- [ ] Check for hardcoded paths or URLs
- [ ] Review environment variables needed

### Testing

- [ ] Test store routes work independently
- [ ] Verify API endpoints work standalone
- [ ] Check admin panel loads correctly
- [ ] Test checkout flow end-to-end
- [ ] Verify cart persistence
- [ ] Test authentication flows

### Documentation

- [ ] Update STORE_SEPARATION_GUIDE.md
- [ ] Document any new dependencies
- [ ] List any breaking changes
- [ ] Update API documentation
- [ ] Document environment variables

## 🛠️ Extraction Steps

When ready to extract:

1. **Prepare Target Repository**

   ```bash
   mkdir ../balm-store
   cd /path/to/dm-2025
   ```

2. **Run Extraction Script**

   ```bash
   ./scripts/extract-store.sh ../balm-store
   ```

3. **Setup Frontend**

   ```bash
   cd ../balm-store/frontend
   npm install
   cp ../.env.example .env
   # Edit .env
   npm run dev
   ```

4. **Setup Backend**

   ```bash
   cd ../balm-store/backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp ../.env.example .env
   # Edit .env
   python scripts/init_db.py
   python -m uvicorn app.main:app --reload
   ```

5. **Update Imports**

   - [ ] Update import paths in extracted files
   - [ ] Remove `/store` prefix from routes in standalone version
   - [ ] Update API base URL configuration
   - [ ] Update image paths if needed

6. **Test Standalone**

   - [ ] Frontend loads at localhost:5173
   - [ ] Backend API at localhost:8000
   - [ ] Admin panel at localhost:8000/admin/store
   - [ ] All routes work without main app
   - [ ] Authentication works
   - [ ] Cart functionality works
   - [ ] Checkout process works

7. **Initialize Version Control**
   ```bash
   cd ../balm-store
   git init
   git add .
   git commit -m "Initial commit - BALM Store standalone"
   ```

## 📊 Separation Metrics

Track these to ensure good separation:

- **Store Files**: All in `/src/store/` ✅
- **Import Dependencies**: Only UI components ✅
- **Route Prefix**: All routes under `/store` ✅
- **Database Tables**: No foreign keys to content ✅
- **API Routes**: All in `products.py` ✅
- **Contexts**: Independent (no main app imports) ✅

## 🔄 Maintenance

### Monthly Check

- Review new code for separation violations
- Update this checklist if needed
- Update STORE_SEPARATION_GUIDE.md
- Test extraction script still works

### Before Major Changes

- Review impact on store separation
- Update documentation
- Consider if change should be in both repos or just one

### If Separation Breaks

1. Identify the violation (imports, routes, database, etc.)
2. Refactor to restore separation
3. Document the lesson learned
4. Update this checklist

## 📞 Questions?

- Check `STORE_SEPARATION_GUIDE.md` for architecture details
- Review `backend/INVENTORY_SYSTEM.md` for API details
- See extraction script: `scripts/extract-store.sh`
- Review this checklist for guidelines

## 🎯 Goal

Keep the store code so well-separated that:

1. It can be extracted in under 5 minutes
2. It works standalone without modification
3. New developers can understand the boundaries
4. Changes to main app don't break store
5. Changes to store don't break main app
