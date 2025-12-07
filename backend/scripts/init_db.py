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


if __name__ == "__main__":
    db = SessionLocal()
    try:
        init_admin_user(db)
        init_site_info(db)
        print("Database initialization complete!")
    finally:
        db.close()

