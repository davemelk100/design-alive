"""
Initialize database with default admin user and content
"""
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.content import SiteInfo
from app.models.product import Product, Order, InventoryLog
from app.core.security import get_password_hash
from app.core.config import settings

# Create all tables
Base.metadata.create_all(bind=engine)


def init_admin_user(db: Session):
    """Create default admin user if it doesn't exist"""
    admin_user = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
    if not admin_user:
        admin_user = User(
            username=settings.ADMIN_USERNAME,
            email=settings.ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            is_active=True,
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print(f"Created admin user: {settings.ADMIN_USERNAME}")
    else:
        print(f"Admin user already exists: {settings.ADMIN_USERNAME}")


def init_site_info(db: Session):
    """Create default site info if it doesn't exist"""
    site_info = db.query(SiteInfo).first()
    if not site_info:
        site_info = SiteInfo(
            title="Dave Melkonian",
            subtitle="Dave Melkonian",
            description="Digital Experience Designer",
            scroll_text="Scroll to explore"
        )
        db.add(site_info)
        db.commit()
        print("Created default site info")
    else:
        print("Site info already exists")


def init_sample_products(db: Session):
    """Create sample products if none exist"""
    product_count = db.query(Product).count()
    if product_count == 0:
        sample_product = Product(
            id="balm-shirt-1",
            title="BALM Chest Print Button-Up Cursive",
            main_category="buttonup",
            price=22.00,
            image="/img/balm-cursive.png",
            images=[
                "/img/balm-cursive.png",
                "/img/balm-cluh-hooded-dude.png",
                "/img/balm-skater-long-hair.png",
                "/img/balm-cursive-club.png"
            ],
            description="",
            full_description="Materials: 100% cotton. Fit: Regular fit. Care: Machine wash cold, tumble dry low. Do not bleach.",
            sizes=["L", "XL"],
            colors=["Black", "White", "Navy"],
            stock_quantity=50,
            low_stock_threshold=5,
            sku="BALM-SHIRT-001",
            visible=True,
            featured=True,
            order=0
        )
        db.add(sample_product)
        db.commit()
        print("Created sample product")
    else:
        print(f"Products already exist: {product_count} products found")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        init_admin_user(db)
        init_site_info(db)
        init_sample_products(db)
        print("Database initialization complete!")
    finally:
        db.close()

