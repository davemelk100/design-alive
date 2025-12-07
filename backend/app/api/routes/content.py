from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.database import get_db
from app.models.content import (
    SiteInfo, NavigationLink, SocialLink, WorkProject, Article,
    Story, CareerPosition, CurrentProject, Testimonial
)
from app.schemas.content import (
    SiteInfo as SiteInfoSchema, SiteInfoCreate, SiteInfoUpdate,
    NavigationLink as NavigationLinkSchema, NavigationLinkCreate, NavigationLinkUpdate,
    SocialLink as SocialLinkSchema, SocialLinkCreate, SocialLinkUpdate,
    WorkProject as WorkProjectSchema, WorkProjectCreate, WorkProjectUpdate,
    Article as ArticleSchema, ArticleCreate, ArticleUpdate,
    Story as StorySchema, StoryCreate, StoryUpdate,
    CareerPosition as CareerPositionSchema, CareerPositionCreate, CareerPositionUpdate,
    CurrentProject as CurrentProjectSchema, CurrentProjectCreate, CurrentProjectUpdate,
    Testimonial as TestimonialSchema, TestimonialCreate, TestimonialUpdate
)
from app.api.dependencies import get_current_admin_user
from app.models.user import User

router = APIRouter(prefix="/content", tags=["content"])


# Site Info Routes
@router.get("/site-info", response_model=SiteInfoSchema)
async def get_site_info(db: Session = Depends(get_db)):
    """Get site information"""
    site_info = db.query(SiteInfo).first()
    if not site_info:
        raise HTTPException(status_code=404, detail="Site info not found")
    return site_info


@router.put("/site-info", response_model=SiteInfoSchema, dependencies=[Depends(get_current_admin_user)])
async def update_site_info(
    site_info: SiteInfoUpdate,
    db: Session = Depends(get_db)
):
    """Update site information (admin only)"""
    db_site_info = db.query(SiteInfo).first()
    if not db_site_info:
        # Create if doesn't exist
        db_site_info = SiteInfo(**site_info.dict())
        db.add(db_site_info)
    else:
        for key, value in site_info.dict().items():
            setattr(db_site_info, key, value)
    db.commit()
    db.refresh(db_site_info)
    return db_site_info


# Navigation Links Routes
@router.get("/navigation-links", response_model=List[NavigationLinkSchema])
async def get_navigation_links(db: Session = Depends(get_db)):
    """Get all navigation links"""
    return db.query(NavigationLink).order_by(NavigationLink.order).all()


@router.post("/navigation-links", response_model=NavigationLinkSchema, dependencies=[Depends(get_current_admin_user)])
async def create_navigation_link(
    link: NavigationLinkCreate,
    db: Session = Depends(get_db)
):
    """Create a navigation link (admin only)"""
    db_link = NavigationLink(**link.dict())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link


@router.put("/navigation-links/{link_id}", response_model=NavigationLinkSchema, dependencies=[Depends(get_current_admin_user)])
async def update_navigation_link(
    link_id: str,
    link: NavigationLinkUpdate,
    db: Session = Depends(get_db)
):
    """Update a navigation link (admin only)"""
    db_link = db.query(NavigationLink).filter(NavigationLink.link_id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Navigation link not found")
    for key, value in link.dict().items():
        setattr(db_link, key, value)
    db.commit()
    db.refresh(db_link)
    return db_link


@router.delete("/navigation-links/{link_id}", dependencies=[Depends(get_current_admin_user)])
async def delete_navigation_link(
    link_id: str,
    db: Session = Depends(get_db)
):
    """Delete a navigation link (admin only)"""
    db_link = db.query(NavigationLink).filter(NavigationLink.link_id == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Navigation link not found")
    db.delete(db_link)
    db.commit()
    return {"message": "Navigation link deleted"}


# Social Links Routes
@router.get("/social-links", response_model=List[SocialLinkSchema])
async def get_social_links(db: Session = Depends(get_db)):
    """Get all social links"""
    return db.query(SocialLink).all()


@router.put("/social-links/{platform}", response_model=SocialLinkSchema, dependencies=[Depends(get_current_admin_user)])
async def update_social_link(
    platform: str,
    link: SocialLinkUpdate,
    db: Session = Depends(get_db)
):
    """Update a social link (admin only)"""
    db_link = db.query(SocialLink).filter(SocialLink.platform == platform).first()
    if not db_link:
        # Create if doesn't exist
        db_link = SocialLink(**link.dict())
        db.add(db_link)
    else:
        for key, value in link.dict().items():
            setattr(db_link, key, value)
    db.commit()
    db.refresh(db_link)
    return db_link


# Work Projects Routes
@router.get("/work-projects", response_model=List[WorkProjectSchema])
async def get_work_projects(
    visible_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get all work projects"""
    query = db.query(WorkProject)
    if visible_only:
        query = query.filter(WorkProject.visible == True)
    return query.order_by(WorkProject.order).all()


@router.post("/work-projects", response_model=WorkProjectSchema, dependencies=[Depends(get_current_admin_user)])
async def create_work_project(
    project: WorkProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a work project (admin only)"""
    db_project = WorkProject(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.put("/work-projects/{project_id}", response_model=WorkProjectSchema, dependencies=[Depends(get_current_admin_user)])
async def update_work_project(
    project_id: int,
    project: WorkProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update a work project (admin only)"""
    db_project = db.query(WorkProject).filter(WorkProject.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Work project not found")
    for key, value in project.dict().items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete("/work-projects/{project_id}", dependencies=[Depends(get_current_admin_user)])
async def delete_work_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Delete a work project (admin only)"""
    db_project = db.query(WorkProject).filter(WorkProject.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Work project not found")
    db.delete(db_project)
    db.commit()
    return {"message": "Work project deleted"}


# Articles Routes
@router.get("/articles", response_model=List[ArticleSchema])
async def get_articles(
    visible_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get all articles"""
    query = db.query(Article)
    if visible_only:
        query = query.filter(Article.visible == True)
    return query.order_by(desc(Article.date), Article.order).all()


@router.post("/articles", response_model=ArticleSchema, dependencies=[Depends(get_current_admin_user)])
async def create_article(
    article: ArticleCreate,
    db: Session = Depends(get_db)
):
    """Create an article (admin only)"""
    db_article = Article(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


@router.put("/articles/{article_id}", response_model=ArticleSchema, dependencies=[Depends(get_current_admin_user)])
async def update_article(
    article_id: int,
    article: ArticleUpdate,
    db: Session = Depends(get_db)
):
    """Update an article (admin only)"""
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    for key, value in article.dict().items():
        setattr(db_article, key, value)
    db.commit()
    db.refresh(db_article)
    return db_article


@router.delete("/articles/{article_id}", dependencies=[Depends(get_current_admin_user)])
async def delete_article(
    article_id: int,
    db: Session = Depends(get_db)
):
    """Delete an article (admin only)"""
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    db.delete(db_article)
    db.commit()
    return {"message": "Article deleted"}


# Stories Routes
@router.get("/stories", response_model=List[StorySchema])
async def get_stories(
    visible_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get all stories"""
    query = db.query(Story)
    if visible_only:
        query = query.filter(Story.visible == True)
    return query.order_by(Story.order).all()


@router.post("/stories", response_model=StorySchema, dependencies=[Depends(get_current_admin_user)])
async def create_story(
    story: StoryCreate,
    db: Session = Depends(get_db)
):
    """Create a story (admin only)"""
    db_story = Story(**story.dict())
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story


@router.put("/stories/{story_id}", response_model=StorySchema, dependencies=[Depends(get_current_admin_user)])
async def update_story(
    story_id: int,
    story: StoryUpdate,
    db: Session = Depends(get_db)
):
    """Update a story (admin only)"""
    db_story = db.query(Story).filter(Story.id == story_id).first()
    if not db_story:
        raise HTTPException(status_code=404, detail="Story not found")
    for key, value in story.dict().items():
        setattr(db_story, key, value)
    db.commit()
    db.refresh(db_story)
    return db_story


@router.delete("/stories/{story_id}", dependencies=[Depends(get_current_admin_user)])
async def delete_story(
    story_id: int,
    db: Session = Depends(get_db)
):
    """Delete a story (admin only)"""
    db_story = db.query(Story).filter(Story.id == story_id).first()
    if not db_story:
        raise HTTPException(status_code=404, detail="Story not found")
    db.delete(db_story)
    db.commit()
    return {"message": "Story deleted"}


# Career Positions Routes
@router.get("/career-positions", response_model=List[CareerPositionSchema])
async def get_career_positions(db: Session = Depends(get_db)):
    """Get all career positions"""
    return db.query(CareerPosition).order_by(CareerPosition.order).all()


@router.post("/career-positions", response_model=CareerPositionSchema, dependencies=[Depends(get_current_admin_user)])
async def create_career_position(
    position: CareerPositionCreate,
    db: Session = Depends(get_db)
):
    """Create a career position (admin only)"""
    db_position = CareerPosition(**position.dict())
    db.add(db_position)
    db.commit()
    db.refresh(db_position)
    return db_position


@router.put("/career-positions/{position_id}", response_model=CareerPositionSchema, dependencies=[Depends(get_current_admin_user)])
async def update_career_position(
    position_id: int,
    position: CareerPositionUpdate,
    db: Session = Depends(get_db)
):
    """Update a career position (admin only)"""
    db_position = db.query(CareerPosition).filter(CareerPosition.id == position_id).first()
    if not db_position:
        raise HTTPException(status_code=404, detail="Career position not found")
    for key, value in position.dict().items():
        setattr(db_position, key, value)
    db.commit()
    db.refresh(db_position)
    return db_position


@router.delete("/career-positions/{position_id}", dependencies=[Depends(get_current_admin_user)])
async def delete_career_position(
    position_id: int,
    db: Session = Depends(get_db)
):
    """Delete a career position (admin only)"""
    db_position = db.query(CareerPosition).filter(CareerPosition.id == position_id).first()
    if not db_position:
        raise HTTPException(status_code=404, detail="Career position not found")
    db.delete(db_position)
    db.commit()
    return {"message": "Career position deleted"}


# Current Projects Routes
@router.get("/current-projects", response_model=List[CurrentProjectSchema])
async def get_current_projects(
    visible_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get all current projects"""
    query = db.query(CurrentProject)
    if visible_only:
        query = query.filter(CurrentProject.visible == True)
    return query.order_by(CurrentProject.order).all()


@router.post("/current-projects", response_model=CurrentProjectSchema, dependencies=[Depends(get_current_admin_user)])
async def create_current_project(
    project: CurrentProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a current project (admin only)"""
    db_project = CurrentProject(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.put("/current-projects/{project_id}", response_model=CurrentProjectSchema, dependencies=[Depends(get_current_admin_user)])
async def update_current_project(
    project_id: int,
    project: CurrentProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update a current project (admin only)"""
    db_project = db.query(CurrentProject).filter(CurrentProject.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Current project not found")
    for key, value in project.dict().items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete("/current-projects/{project_id}", dependencies=[Depends(get_current_admin_user)])
async def delete_current_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Delete a current project (admin only)"""
    db_project = db.query(CurrentProject).filter(CurrentProject.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Current project not found")
    db.delete(db_project)
    db.commit()
    return {"message": "Current project deleted"}


# Testimonials Routes
@router.get("/testimonials", response_model=List[TestimonialSchema])
async def get_testimonials(
    visible_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get all testimonials"""
    query = db.query(Testimonial)
    if visible_only:
        query = query.filter(Testimonial.visible == True)
    return query.order_by(Testimonial.order).all()


@router.post("/testimonials", response_model=TestimonialSchema, dependencies=[Depends(get_current_admin_user)])
async def create_testimonial(
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db)
):
    """Create a testimonial (admin only)"""
    db_testimonial = Testimonial(**testimonial.dict())
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial


@router.put("/testimonials/{testimonial_id}", response_model=TestimonialSchema, dependencies=[Depends(get_current_admin_user)])
async def update_testimonial(
    testimonial_id: int,
    testimonial: TestimonialUpdate,
    db: Session = Depends(get_db)
):
    """Update a testimonial (admin only)"""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for key, value in testimonial.dict().items():
        setattr(db_testimonial, key, value)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial


@router.delete("/testimonials/{testimonial_id}", dependencies=[Depends(get_current_admin_user)])
async def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db)
):
    """Delete a testimonial (admin only)"""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(db_testimonial)
    db.commit()
    return {"message": "Testimonial deleted"}

