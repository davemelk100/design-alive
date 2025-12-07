# Portfolio Admin Backend API

FastAPI backend for managing portfolio content through an admin panel.

## Features

- **Content Management**: CRUD operations for all text-based content
  - Site Information
  - Navigation Links
  - Social Links
  - Work Projects
  - Articles
  - Stories
  - Career Positions
  - Current Projects
  - Testimonials

- **Authentication**: JWT-based authentication for admin access
- **Database**: SQLite (default) or PostgreSQL
- **API Documentation**: Auto-generated Swagger/OpenAPI docs at `/docs`

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the example environment file and update it:

```bash
cp .env.example .env
```

Edit `.env` and update:
- `SECRET_KEY`: Generate a secure random string
- `ADMIN_PASSWORD`: Set a strong password
- `DATABASE_URL`: Use PostgreSQL in production (e.g., `postgresql://user:pass@localhost/dbname`)

### 3. Initialize Database

```bash
python -m app.scripts.init_db
```

This will:
- Create all database tables
- Create the default admin user
- Create default site info

### 4. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/login/json` - Login with JSON body

### Content Endpoints

All content endpoints support:
- `GET /api/content/{resource}` - Get all items (public)
- `GET /api/content/{resource}?visible_only=true` - Get only visible items
- `POST /api/content/{resource}` - Create (admin only)
- `PUT /api/content/{resource}/{id}` - Update (admin only)
- `DELETE /api/content/{resource}/{id}` - Delete (admin only)

Resources:
- `/api/content/site-info`
- `/api/content/navigation-links`
- `/api/content/social-links`
- `/api/content/work-projects`
- `/api/content/articles`
- `/api/content/stories`
- `/api/content/career-positions`
- `/api/content/current-projects`
- `/api/content/testimonials`

### User Management

- `GET /api/users/me` - Get current user info
- `GET /api/users/` - Get all users (admin only)
- `POST /api/users/` - Create user (admin only)

## Authentication

To access admin endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

### Example Login

```bash
curl -X POST "http://localhost:8000/api/auth/login/json" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Response:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### Example Authenticated Request

```bash
curl -X GET "http://localhost:8000/api/content/articles" \
  -H "Authorization: Bearer <your-token>"
```

## Database Schema

The database includes tables for:
- `users` - Admin users
- `site_info` - Site metadata
- `navigation_links` - Navigation menu items
- `social_links` - Social media links
- `work_projects` - Design work projects
- `articles` - Blog articles
- `stories` - Storytelling content
- `career_positions` - Career history
- `current_projects` - Lab projects
- `testimonials` - Testimonial quotes

## Production Deployment

1. **Use PostgreSQL**: Update `DATABASE_URL` in `.env`
2. **Change Secret Key**: Generate a secure random string
3. **Change Admin Password**: Use a strong password
4. **Set CORS Origins**: Update `CORS_ORIGINS` with your frontend URL
5. **Use Environment Variables**: Never commit `.env` file
6. **Enable HTTPS**: Use reverse proxy (nginx) with SSL
7. **Database Migrations**: Use Alembic for production migrations

## Next Steps

1. Create admin panel frontend that consumes this API
2. Add image upload functionality
3. Add content versioning/history
4. Add bulk import/export functionality
5. Add content validation rules

