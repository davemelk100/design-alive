"""
Import existing content from content.ts into the database
This script reads the TypeScript content file and imports it into the database
"""
import json
import re
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.content import (
    SiteInfo, NavigationLink, SocialLink, WorkProject, Article,
    Story, CareerPosition, CurrentProject, Testimonial
)


def parse_typescript_content(file_path: str) -> dict:
    """Parse TypeScript content file and extract content object"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove export const content = and as const
    content = content.replace('export const content =', '').replace('as const;', '')
    
    # Convert TypeScript object to JSON-compatible format
    # This is a simplified parser - for production, consider using a proper TS parser
    # For now, we'll use regex to extract the main structure
    
    # Extract siteInfo
    site_info_match = re.search(r'siteInfo:\s*\{([^}]+)\}', content, re.DOTALL)
    # Extract navigation
    nav_match = re.search(r'navigation:\s*\{([^}]+)\}', content, re.DOTALL)
    
    # This is a basic implementation - you may need to manually adjust
    # or use a more sophisticated parser
    return {}


def import_site_info(db: Session, data: dict):
    """Import site info"""
    site_info = db.query(SiteInfo).first()
    if not site_info:
        site_info = SiteInfo(
            title=data.get('title', 'Dave Melkonian'),
            subtitle=data.get('subtitle', 'Dave Melkonian'),
            description=data.get('description', 'Digital Experience Designer'),
            scroll_text=data.get('scrollText', 'Scroll to explore')
        )
        db.add(site_info)
        db.commit()
        print("Imported site info")


def import_navigation_links(db: Session, links: list):
    """Import navigation links"""
    for idx, link in enumerate(links):
        existing = db.query(NavigationLink).filter(
            NavigationLink.link_id == link.get('id')
        ).first()
        if not existing:
            nav_link = NavigationLink(
                link_id=link.get('id'),
                text=link.get('text'),
                order=idx
            )
            db.add(nav_link)
    db.commit()
    print(f"Imported {len(links)} navigation links")


def import_social_links(db: Session, social: dict):
    """Import social links"""
    for platform, data in social.items():
        existing = db.query(SocialLink).filter(
            SocialLink.platform == platform
        ).first()
        if not existing:
            social_link = SocialLink(
                platform=platform,
                text=data.get('text', ''),
                url=data.get('url', '')
            )
            db.add(social_link)
    db.commit()
    print("Imported social links")


# Note: This is a template - you'll need to manually import content
# or create a more sophisticated parser for the TypeScript file
if __name__ == "__main__":
    print("Content import script")
    print("Note: Manual import may be required for complex TypeScript structures")
    print("Consider using the API endpoints to import content programmatically")

