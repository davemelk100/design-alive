from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ProductBase(BaseModel):
    title: str
    main_category: str
    price: float
    image: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    stock_quantity: int = 0
    low_stock_threshold: int = 5
    sku: Optional[str] = None
    visible: bool = True
    featured: bool = False
    order: int = 0


class ProductCreate(ProductBase):
    id: str


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    main_category: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    full_description: Optional[str] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    stock_quantity: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    sku: Optional[str] = None
    visible: Optional[bool] = None
    featured: Optional[bool] = None
    order: Optional[int] = None


class Product(ProductBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class OrderItemBase(BaseModel):
    product_id: str
    title: str
    quantity: int
    price: float


class OrderBase(BaseModel):
    email: str
    items: List[dict]
    subtotal: float
    tax: float = 0
    shipping: float = 0
    total: float
    shipping_address: Optional[dict] = None


class OrderCreate(OrderBase):
    stripe_session_id: Optional[str] = None
    stripe_payment_intent: Optional[str] = None
    user_id: Optional[int] = None


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
    tracking_number: Optional[str] = None
    shipping_address: Optional[dict] = None


class Order(OrderBase):
    id: int
    user_id: Optional[int] = None
    order_number: str
    stripe_session_id: Optional[str] = None
    stripe_payment_intent: Optional[str] = None
    status: str
    payment_status: str
    tracking_number: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class InventoryLogBase(BaseModel):
    product_id: str
    change_type: str
    quantity_change: int
    quantity_before: int
    quantity_after: int
    reference_type: Optional[str] = None
    reference_id: Optional[str] = None
    notes: Optional[str] = None


class InventoryLogCreate(InventoryLogBase):
    created_by: Optional[int] = None


class InventoryLog(InventoryLogBase):
    id: int
    created_by: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class InventoryAdjustment(BaseModel):
    quantity_change: int
    notes: Optional[str] = None

