from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import secrets

from app.db.database import get_db
from app.models.product import Product, Order, InventoryLog
from app.schemas.product import (
    Product as ProductSchema,
    ProductCreate,
    ProductUpdate,
    Order as OrderSchema,
    OrderCreate,
    OrderUpdate,
    InventoryLog as InventoryLogSchema,
    InventoryAdjustment
)
from app.api.dependencies import get_current_admin_user

router = APIRouter()


# ==================== PRODUCTS ====================

@router.get("/products", response_model=List[ProductSchema])
def get_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    visible_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all products with optional filtering"""
    query = db.query(Product)
    
    if visible_only:
        query = query.filter(Product.visible == True)
    
    if category:
        query = query.filter(Product.main_category == category)
    
    query = query.order_by(Product.order, Product.created_at.desc())
    products = query.offset(skip).limit(limit).all()
    
    return products


@router.get("/products/{product_id}", response_model=ProductSchema)
def get_product(product_id: str, db: Session = Depends(get_db)):
    """Get a single product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/products", response_model=ProductSchema)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Create a new product (admin only)"""
    # Check if product ID already exists
    existing = db.query(Product).filter(Product.id == product.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product ID already exists")
    
    # Check if SKU already exists
    if product.sku:
        existing_sku = db.query(Product).filter(Product.sku == product.sku).first()
        if existing_sku:
            raise HTTPException(status_code=400, detail="SKU already exists")
    
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Log initial inventory
    if product.stock_quantity > 0:
        log = InventoryLog(
            product_id=db_product.id,
            change_type="stock_in",
            quantity_change=product.stock_quantity,
            quantity_before=0,
            quantity_after=product.stock_quantity,
            reference_type="initial",
            notes="Initial stock",
            created_by=current_user.id
        )
        db.add(log)
        db.commit()
    
    return db_product


@router.put("/products/{product_id}", response_model=ProductSchema)
def update_product(
    product_id: str,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update a product (admin only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.dict(exclude_unset=True)
    
    # Track inventory changes
    if "stock_quantity" in update_data:
        old_quantity = db_product.stock_quantity
        new_quantity = update_data["stock_quantity"]
        quantity_change = new_quantity - old_quantity
        
        if quantity_change != 0:
            log = InventoryLog(
                product_id=product_id,
                change_type="adjustment",
                quantity_change=quantity_change,
                quantity_before=old_quantity,
                quantity_after=new_quantity,
                reference_type="manual",
                notes="Manual adjustment via admin panel",
                created_by=current_user.id
            )
            db.add(log)
    
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Delete a product (admin only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}


# ==================== INVENTORY ====================

@router.get("/products/{product_id}/inventory", response_model=List[InventoryLogSchema])
def get_inventory_logs(
    product_id: str,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get inventory logs for a product (admin only)"""
    logs = db.query(InventoryLog).filter(
        InventoryLog.product_id == product_id
    ).order_by(
        InventoryLog.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return logs


@router.post("/products/{product_id}/inventory/adjust")
def adjust_inventory(
    product_id: str,
    adjustment: InventoryAdjustment,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Adjust inventory for a product (admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    old_quantity = product.stock_quantity
    new_quantity = old_quantity + adjustment.quantity_change
    
    if new_quantity < 0:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    # Update product stock
    product.stock_quantity = new_quantity
    
    # Log the change
    log = InventoryLog(
        product_id=product_id,
        change_type="adjustment",
        quantity_change=adjustment.quantity_change,
        quantity_before=old_quantity,
        quantity_after=new_quantity,
        reference_type="manual",
        notes=adjustment.notes or "Manual adjustment",
        created_by=current_user.id
    )
    db.add(log)
    
    db.commit()
    db.refresh(product)
    
    return {
        "message": "Inventory adjusted successfully",
        "product_id": product_id,
        "old_quantity": old_quantity,
        "new_quantity": new_quantity,
        "change": adjustment.quantity_change
    }


@router.get("/inventory/low-stock", response_model=List[ProductSchema])
def get_low_stock_products(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get products with low stock (admin only)"""
    products = db.query(Product).filter(
        Product.stock_quantity <= Product.low_stock_threshold,
        Product.visible == True
    ).all()
    
    return products


# ==================== ORDERS ====================

@router.get("/orders", response_model=List[OrderSchema])
def get_orders(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get all orders (admin only)"""
    query = db.query(Order)
    
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders


@router.get("/orders/{order_id}", response_model=OrderSchema)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get a single order (admin only)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/orders", response_model=OrderSchema)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order"""
    # Generate order number
    order_number = f"ORD-{secrets.token_hex(6).upper()}"
    
    db_order = Order(
        **order.dict(),
        order_number=order_number
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Deduct inventory for each item
    for item in order.items:
        product = db.query(Product).filter(Product.id == item["product_id"]).first()
        if product:
            old_quantity = product.stock_quantity
            new_quantity = old_quantity - item["quantity"]
            
            if new_quantity >= 0:
                product.stock_quantity = new_quantity
                
                # Log inventory change
                log = InventoryLog(
                    product_id=item["product_id"],
                    change_type="sale",
                    quantity_change=-item["quantity"],
                    quantity_before=old_quantity,
                    quantity_after=new_quantity,
                    reference_type="order",
                    reference_id=order_number,
                    notes=f"Sold via order {order_number}"
                )
                db.add(log)
    
    db.commit()
    return db_order


@router.put("/orders/{order_id}", response_model=OrderSchema)
def update_order(
    order_id: int,
    order: OrderUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Update an order (admin only)"""
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_data = order.dict(exclude_unset=True)
    
    # Update timestamps based on status changes
    if "status" in update_data:
        if update_data["status"] == "shipped" and not db_order.shipped_at:
            db_order.shipped_at = datetime.utcnow()
        elif update_data["status"] == "delivered" and not db_order.delivered_at:
            db_order.delivered_at = datetime.utcnow()
    
    if "payment_status" in update_data:
        if update_data["payment_status"] == "paid" and not db_order.paid_at:
            db_order.paid_at = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(db_order, field, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order


@router.get("/orders/stats/summary")
def get_order_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get order statistics (admin only)"""
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    paid_orders = db.query(Order).filter(Order.payment_status == "paid").count()
    
    # Calculate total revenue
    from sqlalchemy import func
    total_revenue = db.query(func.sum(Order.total)).filter(
        Order.payment_status == "paid"
    ).scalar() or 0
    
    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "paid_orders": paid_orders,
        "total_revenue": total_revenue
    }

