"""
Import content from src/content.ts into the database
This script parses the TypeScript content file and imports all content into the database.
"""
import json
import re
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.content import (
    SiteInfo, NavigationLink, SocialLink, WorkProject, Article,
    Story, CareerPosition, CurrentProject, Testimonial
)


def extract_object_from_ts(content: str, key: str) -> dict:
    """Extract a nested object from TypeScript content"""
    # Find the key and its value
    pattern = rf'{key}:\s*\{{(.*?)\}}'
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        return {}
    
    obj_str = match.group(1)
    # Remove comments
    obj_str = re.sub(r'//.*?$', '', obj_str, flags=re.MULTILINE)
    obj_str = re.sub(r'/\*.*?\*/', '', obj_str, flags=re.DOTALL)
    
    # Try to parse as JSON-like structure
    # Replace single quotes with double quotes (carefully)
    obj_str = re.sub(r"'([^']*)':", r'"\1":', obj_str)
    obj_str = re.sub(r":\s*'([^']*)'", r': "\1"', obj_str)
    
    # Remove trailing commas
    obj_str = re.sub(r',(\s*[}\]])', r'\1', obj_str)
    
    # Wrap in braces
    obj_str = '{' + obj_str + '}'
    
    try:
        return json.loads(obj_str)
    except:
        return {}


def extract_array_from_ts(content: str, key: str) -> list:
    """Extract an array from TypeScript content"""
    # Find the key and its array value
    pattern = rf'{key}:\s*\[(.*?)\]'
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        return []
    
    array_str = match.group(1)
    # Remove comments
    array_str = re.sub(r'//.*?$', '', array_str, flags=re.MULTILINE)
    array_str = re.sub(r'/\*.*?\*/', '', array_str, flags=re.DOTALL)
    
    # Split by objects (rough approximation)
    items = []
    depth = 0
    current_item = []
    
    for char in array_str:
        if char == '{':
            depth += 1
            current_item.append(char)
        elif char == '}':
            depth -= 1
            current_item.append(char)
            if depth == 0:
                items.append(''.join(current_item))
                current_item = []
        elif depth > 0:
            current_item.append(char)
    
    return items


def parse_item(item_str: str) -> dict:
    """Parse a single item from TypeScript object string"""
    item = {}
    
    # Extract key-value pairs
    # Match patterns like: key: value, or key: "value", or key: 'value'
    patterns = [
        (r'(\w+):\s*"([^"]*)"', '"'),
        (r"(\w+):\s*'([^']*)'", "'"),
        (r'(\w+):\s*(\d+)', 'num'),
        (r'(\w+):\s*(true|false)', 'bool'),
        (r'(\w+):\s*`([^`]*)`', 'template'),
    ]
    
    for pattern, ptype in patterns:
        for match in re.finditer(pattern, item_str):
            key = match.group(1)
            value = match.group(2)
            
            if ptype == 'num':
                value = int(value)
            elif ptype == 'bool':
                value = value == 'true'
            elif ptype == 'template':
                value = value.replace('\\n', '\n').replace('\\"', '"')
            
            item[key] = value
    
    return item


def import_site_info(db: Session, content: str):
    """Import site info"""
    site_info_match = re.search(r'siteInfo:\s*\{([^}]+)\}', content, re.DOTALL)
    if not site_info_match:
        print("⚠ No site info found")
        return
    
    site_info_str = site_info_match.group(1)
    site_info = {}
    
    for match in re.finditer(r'(\w+):\s*"([^"]*)"', site_info_str):
        site_info[match.group(1)] = match.group(2)
    
    # Handle scrollText (camelCase)
    scroll_text_match = re.search(r'scrollText:\s*"([^"]*)"', site_info_str)
    if scroll_text_match:
        site_info['scroll_text'] = scroll_text_match.group(1)
    
    db_site_info = db.query(SiteInfo).first()
    if not db_site_info:
        db_site_info = SiteInfo(
            title=site_info.get('title', 'Dave Melkonian'),
            subtitle=site_info.get('subtitle', 'Dave Melkonian'),
            description=site_info.get('description', 'Digital Experience Designer'),
            scroll_text=site_info.get('scroll_text', 'Scroll to explore')
        )
        db.add(db_site_info)
    else:
        db_site_info.title = site_info.get('title', db_site_info.title)
        db_site_info.subtitle = site_info.get('subtitle', db_site_info.subtitle)
        db_site_info.description = site_info.get('description', db_site_info.description)
        db_site_info.scroll_text = site_info.get('scroll_text', db_site_info.scroll_text)
    
    db.commit()
    print("✓ Imported site info")


def import_navigation_links(db: Session, content: str):
    """Import navigation links"""
    links_match = re.search(r'links:\s*\[(.*?)\]', content, re.DOTALL)
    if not links_match:
        print("⚠ No navigation links found")
        return
    
    links_str = links_match.group(1)
    links = []
    
    # Extract each link object
    for link_match in re.finditer(r'\{[^}]*id:\s*"([^"]*)",\s*text:\s*"([^"]*)"[^}]*\}', links_str):
        links.append({
            'id': link_match.group(1),
            'text': link_match.group(2)
        })
    
    for idx, link in enumerate(links):
        existing = db.query(NavigationLink).filter(
            NavigationLink.link_id == link['id']
        ).first()
        
        if not existing:
            nav_link = NavigationLink(
                link_id=link['id'],
                text=link['text'],
                order=idx
            )
            db.add(nav_link)
        else:
            existing.text = link['text']
            existing.order = idx
    
    db.commit()
    print(f"✓ Imported {len(links)} navigation links")


def import_social_links(db: Session, content: str):
    """Import social links"""
    platforms = {}
    
    # Extract linkedin directly from content
    linkedin_match = re.search(r'linkedin:\s*\{[^}]*text:\s*"([^"]*)"[^}]*url:\s*"([^"]*)"[^}]*\}', content, re.DOTALL)
    if linkedin_match:
        platforms['linkedin'] = {
            'text': linkedin_match.group(1),
            'url': linkedin_match.group(2)
        }
    
    # Extract dribbble directly from content
    dribbble_match = re.search(r'dribbble:\s*\{[^}]*text:\s*"([^"]*)"[^}]*url:\s*"([^"]*)"[^}]*\}', content, re.DOTALL)
    if dribbble_match:
        platforms['dribbble'] = {
            'text': dribbble_match.group(1),
            'url': dribbble_match.group(2)
        }
    
    for platform, data in platforms.items():
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
        else:
            existing.text = data.get('text', existing.text)
            existing.url = data.get('url', existing.url)
    
    db.commit()
    print(f"✓ Imported {len(platforms)} social links")


def import_work_projects(db: Session, content: str):
    """Import work projects"""
    projects_match = re.search(r'projects:\s*\[(.*?)\]', content, re.DOTALL)
    if not projects_match:
        print("⚠ No work projects found")
        return
    
    projects_str = projects_match.group(1)
    projects = []
    
    # Extract each project (more complex parsing)
    project_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
    for project_match in re.finditer(project_pattern, projects_str):
        project_str = project_match.group(0)
        
        # Skip commented out projects
        if '//' in project_str.split('\n')[0]:
            continue
        
        project = {}
        
        # Extract title
        title_match = re.search(r'title:\s*"([^"]*)"', project_str)
        if title_match:
            project['title'] = title_match.group(1)
        else:
            continue  # Skip if no title
        
        # Extract other fields
        for field in ['description', 'categories', 'image', 'alt', 'url']:
            field_match = re.search(rf'{field}:\s*"([^"]*)"', project_str)
            if field_match:
                project[field] = field_match.group(1)
            else:
                project[field] = ''
        
        projects.append(project)
    
    for idx, project in enumerate(projects):
        existing = db.query(WorkProject).filter(
            WorkProject.title == project['title']
        ).first()
        
        if not existing:
            work_project = WorkProject(
                title=project['title'],
                description=project.get('description', ''),
                categories=project.get('categories', ''),
                image=project.get('image', ''),
                alt=project.get('alt', ''),
                url=project.get('url', ''),
                visible=True,
                order=idx
            )
            db.add(work_project)
        else:
            existing.description = project.get('description', existing.description)
            existing.categories = project.get('categories', existing.categories)
            existing.image = project.get('image', existing.image)
            existing.alt = project.get('alt', existing.alt)
            existing.url = project.get('url', existing.url)
            existing.order = idx
    
    db.commit()
    print(f"✓ Imported {len(projects)} work projects")


def import_articles(db: Session, content: str):
    """Import articles"""
    # Find the start of articles items array
    articles_start = content.find('articles:')
    if articles_start == -1:
        print("⚠ No articles section found")
        return
    
    # Find items: [
    items_start = content.find('items: [', articles_start)
    if items_start == -1:
        print("⚠ No articles items found")
        return
    
    # Find the matching closing bracket for the items array
    bracket_start = items_start + len('items: [')
    bracket_count = 1
    i = bracket_start
    
    while i < len(content) and bracket_count > 0:
        if content[i] == '[':
            bracket_count += 1
        elif content[i] == ']':
            bracket_count -= 1
        i += 1
    
    articles_str = content[bracket_start:i-1]  # -1 to exclude the closing bracket
    articles = []
    
    # Parse articles - find each article object
    i = 0
    while i < len(articles_str):
        # Skip whitespace, commas, newlines
        while i < len(articles_str) and articles_str[i] in ' \n\t\r,':
            i += 1
        
        if i >= len(articles_str):
            break
        
        # Skip comments
        if articles_str[i:i+2] == '//':
            while i < len(articles_str) and articles_str[i] != '\n':
                i += 1
            continue
        
        # Look for opening brace
        if articles_str[i] == '{':
            brace_count = 1
            article_start = i
            i += 1
            
            # Find matching closing brace, handling template literals
            while i < len(articles_str) and brace_count > 0:
                if articles_str[i] == '`':
                    # Template literal - find closing backtick
                    i += 1
                    while i < len(articles_str) and articles_str[i] != '`':
                        i += 1
                    if i < len(articles_str):
                        i += 1
                elif articles_str[i] == '{':
                    brace_count += 1
                    i += 1
                elif articles_str[i] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        # Found complete article
                        article_str = articles_str[article_start:i+1]
                        
                        # Skip if commented
                        if article_str.strip().startswith('//'):
                            i += 1
                            continue
                        
                        article = {}
                        
                        # Extract title (required)
                        title_match = re.search(r'title:\s*"([^"]*)"', article_str)
                        if not title_match:
                            i += 1
                            continue
                        article['title'] = title_match.group(1)
                        
                        # Extract other fields
                        desc_match = re.search(r'description:\s*"([^"]*)"', article_str, re.DOTALL)
                        article['description'] = desc_match.group(1).strip() if desc_match else ''
                        
                        url_match = re.search(r'url:\s*"([^"]*)"', article_str)
                        article['url'] = url_match.group(1) if url_match else ''
                        
                        # Extract content (template literal)
                        content_match = re.search(r'content:\s*`([^`]*)`', article_str, re.DOTALL)
                        if content_match:
                            article['content'] = content_match.group(1)
                        else:
                            article['content'] = ''
                        
                        image_match = re.search(r'image:\s*"([^"]*)"', article_str)
                        article['image'] = image_match.group(1) if image_match else ''
                        
                        date_match = re.search(r'date:\s*"([^"]*)"', article_str)
                        article['date'] = date_match.group(1) if date_match else ''
                        
                        articles.append(article)
                        i += 1
                    else:
                        i += 1
                else:
                    i += 1
        else:
            i += 1
    
    for idx, article in enumerate(articles):
        existing = db.query(Article).filter(
            Article.title == article['title']
        ).first()
        
        if not existing:
            db_article = Article(
                title=article['title'],
                description=article.get('description', ''),
                content=article.get('content', ''),
                date=article.get('date', ''),
                image=article.get('image', ''),
                url=article.get('url', ''),
                visible=True,
                order=idx
            )
            db.add(db_article)
        else:
            existing.description = article.get('description', existing.description)
            existing.content = article.get('content', existing.content)
            existing.date = article.get('date', existing.date)
            existing.image = article.get('image', existing.image)
            existing.url = article.get('url', existing.url)
            existing.order = idx
    
    db.commit()
    print(f"✓ Imported {len(articles)} articles")


def import_stories(db: Session, content: str):
    """Import stories - simplified version"""
    stories_match = re.search(r'stories:\s*\{[^}]*items:\s*\[(.*?)\]', content, re.DOTALL)
    if stories_match:
        print("⚠ Stories import is complex - skipping for now")
        print("  (Stories contain long content that requires more sophisticated parsing)")
    else:
        print("⚠ No stories found")


def import_career_positions(db: Session, content: str):
    """Import career positions"""
    # Find career section - need to match the full positions array including nested arrays
    # Look for career: { ... positions: [ ... ] }
    career_match = re.search(r'career:\s*\{[^}]*positions:\s*\[', content, re.DOTALL)
    if not career_match:
        print("⚠ No career positions found")
        return
    
    # Find the start of positions array
    start_pos = career_match.end()
    
    # Now find matching closing bracket, accounting for nested brackets
    bracket_count = 1
    i = start_pos
    end_pos = start_pos
    
    while i < len(content) and bracket_count > 0:
        if content[i] == '[':
            bracket_count += 1
        elif content[i] == ']':
            bracket_count -= 1
            if bracket_count == 0:
                end_pos = i
                break
        i += 1
    
    if bracket_count != 0:
        print("⚠ Could not parse career positions array")
        return
    
    positions_str = content[start_pos:end_pos]
    
    positions = []
    
    # Now extract each position object from the array
    # Each position is: { title: "...", company: "...", period: "...", description: [...] }
    # We need to handle nested arrays in description
    
    i = 0
    while i < len(positions_str):
        # Find start of position object
        obj_start = positions_str.find('{', i)
        if obj_start == -1:
            break
        
        # Find matching closing brace, accounting for nested braces and arrays
        brace_count = 1
        j = obj_start + 1
        obj_end = -1
        
        while j < len(positions_str) and brace_count > 0:
            if positions_str[j] == '{':
                brace_count += 1
            elif positions_str[j] == '}':
                brace_count -= 1
                if brace_count == 0:
                    obj_end = j
                    break
            j += 1
        
        if obj_end == -1:
            break
        
        pos_str = positions_str[obj_start:obj_end + 1]
        
        # Skip if it's just an empty object or comment
        if not pos_str.strip() or '//' in pos_str.split('\n')[0]:
            i = obj_end + 1
            continue
        
        position = {}
        
        # Extract title, company, period
        for field in ['title', 'company', 'period']:
            field_match = re.search(rf'{field}:\s*"([^"]*)"', pos_str)
            if field_match:
                position[field] = field_match.group(1)
        
        if not position.get('title'):
            i = obj_end + 1
            continue
        
        # Extract description - handle nested array
        # Look for description: [ ... ]
        desc_match = re.search(r'description:\s*\[', pos_str)
        if desc_match:
            desc_start = desc_match.end()
            # Find matching closing bracket
            bracket_count = 1
            k = desc_start
            desc_end = -1
            
            while k < len(pos_str) and bracket_count > 0:
                if pos_str[k] == '[':
                    bracket_count += 1
                elif pos_str[k] == ']':
                    bracket_count -= 1
                    if bracket_count == 0:
                        desc_end = k
                        break
                k += 1
            
            if desc_end != -1:
                desc_array_str = pos_str[desc_start:desc_end]
                # Extract all quoted strings from the array
                desc_items = re.findall(r'"([^"]*)"', desc_array_str)
                position['description'] = '\n'.join(desc_items)
            else:
                position['description'] = ''
        else:
            # Try to match as a simple string
            desc_str_match = re.search(r'description:\s*"([^"]*)"', pos_str)
            if desc_str_match:
                position['description'] = desc_str_match.group(1)
            else:
                position['description'] = ''
        
        positions.append(position)
        i = obj_end + 1
    
    for idx, position in enumerate(positions):
        existing = db.query(CareerPosition).filter(
            CareerPosition.title == position['title'],
            CareerPosition.company == position.get('company', '')
        ).first()
        
        if not existing:
            db_position = CareerPosition(
                title=position['title'],
                company=position.get('company', ''),
                period=position.get('period', ''),
                description=position.get('description', ''),
                order=idx
            )
            db.add(db_position)
        else:
            existing.period = position.get('period', existing.period)
            existing.description = position.get('description', existing.description)
            existing.order = idx
    
    db.commit()
    print(f"✓ Imported {len(positions)} career positions")


def import_current_projects(db: Session, content: str):
    """Import current projects"""
    projects_match = re.search(r'currentProjects:\s*\{[^}]*projects:\s*\[(.*?)\]', content, re.DOTALL)
    if not projects_match:
        print("⚠ No current projects found")
        return
    
    projects_str = projects_match.group(1)
    projects = []
    
    # Extract each project - handle nested structures
    depth = 0
    brace_count = 0
    current_proj = []
    i = 0
    
    while i < len(projects_str):
        char = projects_str[i]
        if char == '{':
            brace_count += 1
            current_proj.append(char)
        elif char == '}':
            brace_count -= 1
            current_proj.append(char)
            if brace_count == 0 and current_proj:
                proj_str = ''.join(current_proj)
                
                project = {}
                
                # Extract title, description, demo
                for field in ['title', 'description', 'demo']:
                    field_match = re.search(rf'{field}:\s*"([^"]*)"', proj_str)
                    if field_match:
                        project[field] = field_match.group(1)
                
                if project.get('title'):
                    projects.append(project)
                
                current_proj = []
        elif brace_count > 0:
            current_proj.append(char)
        i += 1
    
    for idx, project in enumerate(projects):
        existing = db.query(CurrentProject).filter(
            CurrentProject.title == project['title']
        ).first()
        
        if not existing:
            db_project = CurrentProject(
                title=project['title'],
                description=project.get('description', ''),
                demo=project.get('demo', ''),
                visible=True,
                order=idx
            )
            db.add(db_project)
        else:
            existing.description = project.get('description', existing.description)
            existing.demo = project.get('demo', existing.demo)
            existing.order = idx
    
    db.commit()
    print(f"✓ Imported {len(projects)} current projects")


def import_testimonials(db: Session, content: str):
    """Import testimonials"""
    testimonials_match = re.search(r'testimonials:\s*\{[^}]*items:\s*\[(.*?)\]', content, re.DOTALL)
    if not testimonials_match:
        print("⚠ No testimonials found")
        return
    
    testimonials_str = testimonials_match.group(1)
    testimonials = []
    
    # Extract each testimonial
    testimonial_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
    for test_match in re.finditer(testimonial_pattern, testimonials_str):
        test_str = test_match.group(0)
        
        testimonial = {}
        
        # Extract quote, author, role
        quote_match = re.search(r'quote:\s*"([^"]*)"', test_str, re.DOTALL)
        if quote_match:
            testimonial['quote'] = quote_match.group(1).replace('\\n', '\n')
        
        author_match = re.search(r'author:\s*"([^"]*)"', test_str)
        if author_match:
            testimonial['author'] = author_match.group(1)
        
        role_match = re.search(r'role:\s*"([^"]*)"', test_str)
        if role_match:
            testimonial['role'] = role_match.group(1)
        
        if not testimonial.get('quote'):
            continue
        
        testimonials.append(testimonial)
    
    for idx, testimonial in enumerate(testimonials):
        # Try to find existing by quote start
        quote_start = testimonial['quote'][:50] if testimonial['quote'] else ''
        existing = db.query(Testimonial).filter(
            Testimonial.quote.like(f'{quote_start}%')
        ).first() if quote_start else None
        
        if not existing:
            db_testimonial = Testimonial(
                author=testimonial.get('author', ''),
                role=testimonial.get('role', ''),
                quote=testimonial.get('quote', ''),
                visible=True,
                order=idx
            )
            db.add(db_testimonial)
        else:
            existing.author = testimonial.get('author', existing.author)
            existing.role = testimonial.get('role', existing.role)
            existing.quote = testimonial.get('quote', existing.quote)
            existing.order = idx
    
    db.commit()
    print(f"✓ Imported {len(testimonials)} testimonials")


def main():
    """Main import function"""
    # Get the content.ts file path
    backend_dir = Path(__file__).parent.parent
    project_root = backend_dir.parent
    content_file = project_root / "src" / "content.ts"
    
    if not content_file.exists():
        print(f"Error: Content file not found at {content_file}")
        sys.exit(1)
    
    print(f"Reading content from: {content_file}")
    
    # Read the content file
    with open(content_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Content file read successfully!")
    print("\nImporting content into database...\n")
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Import all content types
        import_site_info(db, content)
        import_navigation_links(db, content)
        import_social_links(db, content)
        import_work_projects(db, content)
        import_articles(db, content)
        import_stories(db, content)
        import_career_positions(db, content)
        import_current_projects(db, content)
        import_testimonials(db, content)
        
        print("\n✅ Content import completed!")
        print("\nNote: Articles and Stories require more complex parsing due to HTML content.")
        print("You can add them manually through the admin panel or enhance this script.")
        
    except Exception as e:
        print(f"\n❌ Error during import: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
