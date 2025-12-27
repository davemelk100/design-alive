# Inventory System - Quick Start Guide

## What's Been Created

A complete inventory management system with:

✅ **Backend Models & Database**
- Product model with full inventory tracking
- Order model for purchase management  
- InventoryLog model for audit trails

✅ **API Endpoints**
- Full CRUD operations for products
- Order management and tracking
- Inventory adjustment endpoints
- Statistics and reporting

✅ **Admin Panel**
- Modern UI at `/admin/store`
- Real-time inventory dashboard
- Product management interface
- Order tracking system

## Quick Start

### 1. Initialize Database (Required First Time)

```bash
cd backend
python scripts/init_db.py
```

This creates:
- All database tables
- Admin user (from your .env)
- Sample product

### 2. Start Backend Server

```bash
cd backend
python run.py
```

Server runs on `http://localhost:8000`

### 3. Access Admin Panel

1. Go to: `http://localhost:8000/login`
2. Login with admin credentials
3. Navigate to: `http://localhost:8000/admin/store`

## Key URLs

- **Store Admin Panel**: `http://localhost:8000/admin/store`
- **Content Admin Panel**: `http://localhost:8000/admin`
- **Login**: `http://localhost:8000/login`
- **API Docs**: `http://localhost:8000/docs`

## Admin Panel Features

### Dashboard Stats
- Total Products
- Low Stock Items
- Total Orders  
- Total Revenue

### Products Management
- Add/Edit/Delete products
- Set prices and inventory
- Upload images
- Manage visibility

### Inventory Control
- Track stock levels
- Low stock alerts
- Manual adjustments
- Audit logging

### Order Management
- View all orders
- Track status
- Process fulfillment
- Monitor payments

## File Structure

```
backend/
├── app/
│   ├── models/
│   │   └── product.py          # Product, Order, InventoryLog models
│   ├── schemas/
│   │   └── product.py          # Pydantic schemas
│   ├── api/
│   │   └── routes/
│   │       └── products.py     # API endpoints
│   └── main.py                 # Updated with product routes
├── scripts/
│   └── init_db.py              # Updated with sample products
├── store_admin.html            # Admin panel UI
└── INVENTORY_SYSTEM.md         # Full documentation
```

## Common Tasks

### Add a New Product
1. Go to Store Admin → Products tab
2. Click "+ Add Product"
3. Fill in details (ID, title, price, stock, etc.)
4. Click "Create"

### Adjust Inventory
1. Products tab or Inventory tab
2. Find the product
3. Click "Adjust" or "Restock"
4. Enter quantity change (+ to add, - to remove)
5. Add notes for the change
6. Click "Adjust"

### View Orders
1. Go to Orders tab
2. Click "View" on any order
3. See items, customer, payment status

## API Integration

### Get Products (Frontend)
```typescript
const products = await fetch('http://localhost:8000/api/products');
```

### Create Order (From Checkout)
```typescript
await fetch('http://localhost:8000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: customer.email,
    items: cartItems,
    total: totalAmount,
    stripe_session_id: sessionId
  })
});
```

## Next Steps

1. **Run Database Init**: `python backend/scripts/init_db.py`
2. **Start Server**: `python backend/run.py`
3. **Login to Admin**: Navigate to `/admin/store`
4. **Add Your Products**: Use the admin panel
5. **Integrate with Frontend**: Update store to use API endpoints

## Notes

- All admin endpoints require authentication
- Inventory is automatically deducted when orders are created
- All inventory changes are logged for auditing
- Low stock threshold alerts when stock ≤ threshold
- Products can be hidden without deleting them

## Support

See `INVENTORY_SYSTEM.md` for complete documentation including:
- Full API reference
- Database schema details
- Security information
- Frontend integration examples
- Troubleshooting guide

