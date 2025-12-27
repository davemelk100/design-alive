# Store Inventory & Admin System

## Overview

This document describes the complete inventory management and admin system for the BALM store. The system includes product management, inventory tracking, order management, and a comprehensive admin panel.

## Features

### 1. Product Management
- Create, read, update, and delete products
- Product categories (art, music, sports)
- Multiple product images support
- Size and color variants
- Product visibility controls
- Featured products

### 2. Inventory Tracking
- Real-time stock quantity tracking
- Low stock alerts and thresholds
- Automatic inventory deduction on orders
- Inventory adjustment logs
- Manual inventory adjustments with notes

### 3. Order Management
- Order creation and tracking
- Order status management (pending, processing, shipped, delivered, cancelled)
- Payment status tracking
- Order history
- Automatic inventory deduction on purchase
- Revenue and order statistics

### 4. Admin Panel
- **Store Admin Panel**: `/admin/store` - Modern inventory and order management interface
- **Content Admin Panel**: `/admin` - Portfolio content management
- **Login Page**: `/login` - Admin authentication

## Database Schema

### Products Table
```python
- id: String (primary key)
- title: String
- main_category: String (art, music, sports)
- price: Float
- image: String (URL)
- images: JSON (array of URLs)
- description: Text
- full_description: Text
- sizes: JSON (array)
- colors: JSON (array)
- stock_quantity: Integer
- low_stock_threshold: Integer
- sku: String (unique)
- visible: Boolean
- featured: Boolean
- order: Integer
- created_at: DateTime
- updated_at: DateTime
```

### Orders Table
```python
- id: Integer (primary key)
- user_id: Integer (nullable)
- email: String
- order_number: String (unique)
- stripe_session_id: String
- stripe_payment_intent: String
- items: JSON (array of items)
- subtotal: Float
- tax: Float
- shipping: Float
- total: Float
- status: String (pending, paid, processing, shipped, delivered, cancelled)
- payment_status: String (unpaid, paid, refunded)
- shipping_address: JSON
- tracking_number: String
- created_at: DateTime
- updated_at: DateTime
- paid_at: DateTime
- shipped_at: DateTime
- delivered_at: DateTime
```

### Inventory Logs Table
```python
- id: Integer (primary key)
- product_id: String
- change_type: String (stock_in, stock_out, adjustment, sale, return)
- quantity_change: Integer
- quantity_before: Integer
- quantity_after: Integer
- reference_type: String (order, manual, restock)
- reference_id: String
- notes: Text
- created_by: Integer (admin user ID)
- created_at: DateTime
```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional filtering)
  - Query params: `skip`, `limit`, `category`, `visible_only`
- `GET /api/products/{product_id}` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/{product_id}` - Update product (admin only)
- `DELETE /api/products/{product_id}` - Delete product (admin only)

### Inventory
- `GET /api/products/{product_id}/inventory` - Get inventory logs (admin only)
- `POST /api/products/{product_id}/inventory/adjust` - Adjust inventory (admin only)
- `GET /api/inventory/low-stock` - Get low stock products (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
  - Query params: `skip`, `limit`, `status`
- `GET /api/orders/{order_id}` - Get single order (admin only)
- `POST /api/orders` - Create order
- `PUT /api/orders/{order_id}` - Update order (admin only)
- `GET /api/orders/stats/summary` - Get order statistics (admin only)

## Setup Instructions

### 1. Backend Setup

1. Make sure you have Python 3.8+ installed

2. Install dependencies (if not already installed):
```bash
cd backend
pip install -r requirements.txt
```

3. Initialize the database:
```bash
cd backend
python scripts/init_db.py
```

This will create:
- Admin user (from .env config)
- Default site info
- Sample product

4. Start the backend server:
```bash
cd backend
python run.py
```

The API will be available at `http://localhost:8000`

### 2. Admin Access

1. Navigate to `http://localhost:8000/login`

2. Login with admin credentials:
   - Username: `admin` (or from .env `ADMIN_USERNAME`)
   - Password: From .env `ADMIN_PASSWORD`

3. Access admin panels:
   - Store Admin: `http://localhost:8000/admin/store`
   - Content Admin: `http://localhost:8000/admin`

### 3. API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Admin Panel Features

### Store Admin Dashboard

#### Statistics Overview
- Total Products
- Low Stock Items
- Total Orders
- Total Revenue

#### Products Tab
- View all products in a table
- Add new products
- Edit existing products
- Delete products
- Visual low stock indicators
- Product image previews

#### Inventory Tab
- View all low stock items
- Quick restock functionality
- Inventory adjustment with notes
- Real-time stock updates

#### Orders Tab
- View all orders
- Filter by status
- View order details
- Order status badges
- Payment status tracking
- Customer information

### Product Form Fields
- **Product ID**: Unique identifier
- **Title**: Product name
- **Category**: art, music, or sports
- **Price**: Product price in USD
- **Image URL**: Main product image
- **Description**: Short description
- **Full Description**: Detailed product information
- **Stock Quantity**: Current inventory
- **Low Stock Threshold**: Alert threshold
- **SKU**: Stock keeping unit
- **Visible**: Show/hide on store
- **Featured**: Mark as featured product

### Inventory Management
- **Adjust Inventory**: Add or remove stock
- **Quantity Change**: Positive to add, negative to remove
- **Notes**: Reason for adjustment
- **Automatic Logging**: All changes are logged with timestamp and admin user

### Order Management
- View order details
- See all items in order
- Track order status
- Monitor payment status
- Access customer information
- View order timestamps

## Security

- All admin endpoints require authentication
- JWT token-based authentication
- Admin-only role checking
- Secure password hashing
- CORS configuration for API access

## Frontend Integration

### Using Products in Frontend

```typescript
// Fetch products from API
const response = await fetch('http://localhost:8000/api/products');
const products = await response.json();

// Filter by category
const artProducts = await fetch('http://localhost:8000/api/products?category=art');

// Get single product
const product = await fetch('http://localhost:8000/api/products/balm-shirt-1');
```

### Creating Orders

```typescript
// Create order (from Stripe checkout)
const orderData = {
  email: "customer@example.com",
  items: [
    {
      product_id: "balm-shirt-1",
      title: "BALM Chest Print",
      quantity: 2,
      price: 22.00
    }
  ],
  subtotal: 44.00,
  tax: 0,
  shipping: 0,
  total: 44.00,
  stripe_session_id: "cs_xxx",
  stripe_payment_intent: "pi_xxx"
};

const response = await fetch('http://localhost:8000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
});
```

## Inventory Flow

### When a Product is Created
1. Product is added to database
2. Initial stock is set
3. If stock > 0, an inventory log is created (type: "stock_in")

### When an Order is Placed
1. Order is created in database
2. For each item in order:
   - Product stock is reduced by quantity
   - Inventory log is created (type: "sale", reference: order_number)
3. Order status is set to "pending"

### Manual Inventory Adjustment
1. Admin adjusts stock via admin panel
2. Stock quantity is updated
3. Inventory log is created (type: "adjustment")
4. Notes are saved for audit trail

### Low Stock Alerts
- Products with stock <= low_stock_threshold appear in "Low Stock Items"
- Visual indicators in products table
- Dedicated inventory tab for quick restocking

## Best Practices

1. **Regular Stock Checks**: Monitor low stock items regularly
2. **SKU Management**: Assign unique SKUs to all products
3. **Inventory Adjustments**: Always add notes when manually adjusting inventory
4. **Order Processing**: Update order status as they progress through fulfillment
5. **Product Visibility**: Hide products when out of stock or not ready for sale

## Troubleshooting

### Products Not Showing
- Check product `visible` field is true
- Verify stock_quantity > 0
- Check API endpoint is accessible

### Orders Not Creating
- Verify Stripe integration is configured
- Check product IDs exist in database
- Ensure sufficient stock is available

### Admin Panel Not Loading
- Verify backend server is running
- Check authentication token is valid
- Clear browser cache and localStorage

## Future Enhancements

Potential additions to the system:
- Product variants (size/color combinations)
- Bulk import/export
- Advanced reporting and analytics
- Email notifications for low stock
- Customer accounts and order history
- Return/refund management
- Promotional codes and discounts

## Support

For issues or questions about the inventory system:
- Check API documentation at `/docs`
- Review database logs
- Verify admin permissions
- Check inventory logs for audit trail

