# Backend Setup Guide

## Quick Start

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env and update SECRET_KEY and ADMIN_PASSWORD
   ```

3. **Initialize database:**
   ```bash
   python -m app.scripts.init_db
   ```

4. **Start the server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access API documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Default Credentials

After running `init_db.py`:
- Username: `admin`
- Password: `admin123` (change this in `.env`)

## API Usage Examples

### 1. Login

```bash
curl -X POST "http://localhost:8000/api/auth/login/json" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. Get Content (Public)

```bash
curl http://localhost:8000/api/content/articles?visible_only=true
```

### 3. Update Content (Admin)

```bash
# First, get your token from login
TOKEN="your-access-token-here"

curl -X PUT "http://localhost:8000/api/content/site-info" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dave Melkonian",
    "subtitle": "Dave Melkonian",
    "description": "Digital Experience Designer",
    "scroll_text": "Scroll to explore"
  }'
```

## Content Types

The API supports managing:

1. **Site Info** - Title, subtitle, description
2. **Navigation Links** - Menu items
3. **Social Links** - LinkedIn, Dribbble, etc.
4. **Work Projects** - Design portfolio items
5. **Articles** - Blog posts and articles
6. **Stories** - Storytelling content
7. **Career Positions** - Job history
8. **Current Projects** - Lab projects
9. **Testimonials** - Testimonial quotes

## Next Steps

1. Create an admin panel frontend that uses this API
2. Connect the frontend to fetch content from the API instead of `content.ts`
3. Add image upload functionality
4. Add content versioning

