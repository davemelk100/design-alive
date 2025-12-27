from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.db.database import Base


class Product(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True, index=True)  # e.g., "balm-shirt-1"
    title = Column(String, nullable=False)
    main_category = Column(String, nullable=False)  # art, music, sports
    price = Column(Float, nullable=False)
    image = Column(String)  # Main image URL
    images = Column(JSON)  # Array of additional image URLs
    description = Column(Text)
    full_description = Column(Text)
    sizes = Column(JSON)  # Array of available sizes
    colors = Column(JSON)  # Array of available colors
    
    # Inventory fields
    stock_quantity = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=5)
    sku = Column(String, unique=True, index=True)
    
    # Metadata
    visible = Column(Boolean, default=True)
    featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)  # Can be null for guest checkouts
    email = Column(String, nullable=False)
    
    # Order details
    order_number = Column(String, unique=True, nullable=False, index=True)
    stripe_session_id = Column(String, unique=True, index=True)
    stripe_payment_intent = Column(String, index=True)
    
    # Items and totals
    items = Column(JSON, nullable=False)  # Array of {product_id, title, quantity, price}
    subtotal = Column(Float, nullable=False)
    tax = Column(Float, default=0)
    shipping = Column(Float, default=0)
    total = Column(Float, nullable=False)
    
    # Status
    status = Column(String, default="pending")  # pending, paid, processing, shipped, delivered, cancelled
    payment_status = Column(String, default="unpaid")  # unpaid, paid, refunded
    
    # Shipping info
    shipping_address = Column(JSON)  # {name, address, city, state, zip, country}
    tracking_number = Column(String)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    paid_at = Column(DateTime(timezone=True))
    shipped_at = Column(DateTime(timezone=True))
    delivered_at = Column(DateTime(timezone=True))


class InventoryLog(Base):
    __tablename__ = "inventory_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, nullable=False, index=True)
    
    # Change details
    change_type = Column(String, nullable=False)  # stock_in, stock_out, adjustment, sale, return
    quantity_change = Column(Integer, nullable=False)  # Positive for additions, negative for subtractions
    quantity_before = Column(Integer, nullable=False)
    quantity_after = Column(Integer, nullable=False)
    
    # Reference
    reference_type = Column(String)  # order, manual, restock
    reference_id = Column(String)  # Order ID or other reference
    notes = Column(Text)
    
    # Metadata
    created_by = Column(Integer)  # Admin user ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())

