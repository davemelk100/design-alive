# Backend API Overview

## Architecture

The backend is built with **FastAPI** and uses **SQLAlchemy** for database operations. It provides a RESTful API for managing all text-based content on the portfolio site.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── content.py       # Content CRUD endpoints
│   │   │   └── users.py         # User management
│   │   └── dependencies.py      # Auth dependencies
│   ├── core/
│   │   ├── config.py            # Configuration settings
│   │   └── security.py          # Password hashing, JWT tokens
│   ├── db/
│   │   └── database.py          # Database connection
│   ├── models/
│   │   ├── content.py           # Content database models
│   │   └── user.py              # User model
│   ├── schemas/
│   │   ├── auth.py              # Auth request/response schemas
│   │   └── content.py           # Content request/response schemas
│   └── main.py                  # FastAPI application
├── scripts/
│   ├── init_db.py               # Initialize database
│   └── import_content.py        # Import existing content
├── requirements.txt             # Python dependencies
├── README.md                    # Full documentation
└── SETUP.md                     # Quick setup guide
```

## Database Models

### Content Models
- **SiteInfo** - Site metadata (title, subtitle, description)
- **NavigationLink** - Navigation menu items
- **SocialLink** - Social media links
- **WorkProject** - Design portfolio projects
- **Article** - Blog articles
- **Story** - Storytelling content
- **CareerPosition** - Career history
- **CurrentProject** - Lab projects
- **Testimonial** - Testimonial quotes

### User Model
- **User** - Admin users with authentication

## API Endpoints

### Public Endpoints (No Auth Required)
- `GET /api/content/*` - Read all content types

### Protected Endpoints (Admin Auth Required)
- `POST /api/content/*` - Create content
- `PUT /api/content/*/{id}` - Update content
- `DELETE /api/content/*/{id}` - Delete content

## Authentication Flow

1. Admin logs in via `/api/auth/login/json`
2. Receives JWT access token
3. Includes token in `Authorization: Bearer <token>` header
4. Token expires after 30 minutes (configurable)

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- CORS configuration
- Admin-only endpoints protection
- SQL injection protection (SQLAlchemy ORM)

## Content Management Features

- **Visibility Control**: Toggle content visibility
- **Ordering**: Control display order
- **Rich Content**: Support for HTML content in articles/stories
- **Metadata**: Dates, tags, categories
- **Relationships**: Structured data with JSON fields

## Integration with Frontend

The frontend can:
1. Fetch all content from `/api/content/*` endpoints
2. Display content based on `visible` flag
3. Admin panel can use authenticated endpoints to manage content
4. Replace static `content.ts` with API calls

## Future Enhancements

- Image upload endpoints
- Content versioning/history
- Bulk import/export
- Content validation rules
- Search functionality
- Content drafts/publishing workflow

