from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import User as UserSchema, UserCreate
from app.api.dependencies import get_current_admin_user, get_current_user
from app.core.security import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserSchema)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information"""
    return current_user


@router.get("/", response_model=List[UserSchema], dependencies=[Depends(get_current_admin_user)])
async def get_users(
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    return db.query(User).all()


@router.post("/", response_model=UserSchema, dependencies=[Depends(get_current_admin_user)])
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """Create a new user (admin only)"""
    # Check if username or email already exists
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        is_active=user.is_active,
        is_admin=user.is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

