from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Site Info Schemas
class SiteInfoBase(BaseModel):
    title: str
    subtitle: str
    description: Optional[str] = None
    scroll_text: Optional[str] = None


class SiteInfoCreate(SiteInfoBase):
    pass


class SiteInfoUpdate(SiteInfoBase):
    pass


class SiteInfo(SiteInfoBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Navigation Link Schemas
class NavigationLinkBase(BaseModel):
    link_id: str
    text: str
    order: int = 0


class NavigationLinkCreate(NavigationLinkBase):
    pass


class NavigationLinkUpdate(NavigationLinkBase):
    pass


class NavigationLink(NavigationLinkBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Social Link Schemas
class SocialLinkBase(BaseModel):
    platform: str
    text: str
    url: str


class SocialLinkCreate(SocialLinkBase):
    pass


class SocialLinkUpdate(SocialLinkBase):
    pass


class SocialLink(SocialLinkBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Work Project Schemas
class WorkProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    categories: Optional[str] = None
    image: Optional[str] = None
    alt: Optional[str] = None
    url: Optional[str] = None
    visible: bool = True
    order: int = 0


class WorkProjectCreate(WorkProjectBase):
    pass


class WorkProjectUpdate(WorkProjectBase):
    pass


class WorkProject(WorkProjectBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Article Schemas
class ArticleBase(BaseModel):
    article_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    card_image: Optional[str] = None
    date: Optional[str] = None
    tags: Optional[List[str]] = None
    visible: bool = True
    order: int = 0


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(ArticleBase):
    pass


class Article(ArticleBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Story Schemas
class StoryBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    content: Optional[str] = None
    date: Optional[str] = None
    has_modal: bool = False
    visible: bool = True
    order: int = 0


class StoryCreate(StoryBase):
    pass


class StoryUpdate(StoryBase):
    pass


class Story(StoryBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Career Position Schemas
class CareerPositionBase(BaseModel):
    title: str
    company: str
    period: str
    description: List[str] = Field(default_factory=list)
    order: int = 0


class CareerPositionCreate(CareerPositionBase):
    pass


class CareerPositionUpdate(CareerPositionBase):
    pass


class CareerPosition(CareerPositionBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Current Project Schemas
class CurrentProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    demo: Optional[str] = None
    image: Optional[str] = None
    visible: bool = True
    order: int = 0


class CurrentProjectCreate(CurrentProjectBase):
    pass


class CurrentProjectUpdate(CurrentProjectBase):
    pass


class CurrentProject(CurrentProjectBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Testimonial Schemas
class TestimonialBase(BaseModel):
    quote: str
    author: str
    role: Optional[str] = None
    visible: bool = True
    order: int = 0


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(TestimonialBase):
    pass


class Testimonial(TestimonialBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

