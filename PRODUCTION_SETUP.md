# Production Setup Guide

This guide explains how to deploy the portfolio site with the admin backend in production.

## Architecture Overview

- **Frontend**: React app deployed on Netlify (static site)
- **Backend**: FastAPI app deployed on a cloud service (Railway, Render, Fly.io, etc.)
- **Database**: SQLite (dev) or PostgreSQL (production recommended)

## Deployment Steps

### 1. Deploy Backend

Choose a hosting service for your FastAPI backend:

#### Option A: Railway (Recommended)

1. Create account at [railway.app](https://railway.app)
2. Create new project
3. Connect your GitHub repo
4. Add new service → Deploy from GitHub repo
5. Select the `backend` directory
6. Set environment variables (see below)
7. Railway will auto-detect Python and install dependencies
8. Add a PostgreSQL database service (optional but recommended)

#### Option B: Render

1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables
6. Add PostgreSQL database (optional)

#### Option C: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. In `backend/` directory: `fly launch`
3. Follow prompts
4. Set environment variables: `fly secrets set KEY=value`

### 2. Backend Environment Variables

Set these in your hosting service's environment variables:

```bash
# Required
SECRET_KEY=<generate-secure-key>  # Use: python -c "import secrets; print(secrets.token_urlsafe(32))"
ADMIN_PASSWORD=<strong-password>
ADMIN_EMAIL=davemelk@gmail.com

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# CORS - Add your production frontend URL
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Initialize Backend Database

After deployment, initialize the database:

```bash
# SSH into your backend or use hosting service's shell
cd backend
python -m app.scripts.init_db
```

Or if using Railway/Render, you can run this via their console/terminal.

### 4. Configure Frontend

#### Option A: Environment Variable (Recommended)

Create a `.env.production` file in the root:

```bash
VITE_API_URL=https://your-backend-url.railway.app
```

Or set it in Netlify:

1. Site settings → Environment variables
2. Add: `VITE_API_URL` = `https://your-backend-url.railway.app`
3. Redeploy

#### Option B: Build-time Configuration

The frontend will automatically detect the backend URL. If your backend is on a subdomain (e.g., `api.yourdomain.com`), it will work automatically.

### 5. Update Frontend References

The frontend code has been updated to use `src/config/api.ts` which:

- Uses `VITE_API_URL` environment variable if set
- Falls back to detecting backend on same domain/subdomain
- Uses `localhost:8000` in development

### 6. CORS Configuration

Make sure your backend's `CORS_ORIGINS` includes:

- Your production frontend URL: `https://yourdomain.com`
- Your www subdomain: `https://www.yourdomain.com`
- Any staging URLs you use

### 7. Admin Panel Access

Once deployed:

- **Login**: `https://your-backend-url.railway.app/login`
- **Admin Panel**: `https://your-backend-url.railway.app/admin`
- **API Docs**: `https://your-backend-url.railway.app/docs`

You can also access from the frontend `/login` route, which will link to the backend.

## Security Checklist

- [ ] Change `SECRET_KEY` to a secure random string
- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Use PostgreSQL in production (not SQLite)
- [ ] Set proper CORS origins (only your domain)
- [ ] Enable HTTPS on both frontend and backend
- [ ] Set `ACCESS_TOKEN_EXPIRE_MINUTES` appropriately
- [ ] Review and restrict API endpoints if needed
- [ ] Set up database backups

## Testing Production Setup

1. **Test Backend Health**:

   ```bash
   curl https://your-backend-url.railway.app/health
   ```

2. **Test API Endpoint**:

   ```bash
   curl https://your-backend-url.railway.app/api/content/articles?visible_only=true
   ```

3. **Test Admin Login**:

   - Visit `https://your-backend-url.railway.app/login`
   - Login with admin credentials
   - Should redirect to admin panel

4. **Test Frontend Integration**:
   - Visit your production site
   - Click `/login` route
   - Should link to backend login page

## Troubleshooting

### CORS Errors

- Check that your frontend URL is in `CORS_ORIGINS`
- Ensure no trailing slashes in URLs
- Check browser console for specific CORS error

### Database Issues

- SQLite files don't persist on some hosting services
- Use PostgreSQL for production
- Run migrations after deployment

### Environment Variables Not Working

- Rebuild/redeploy after setting environment variables
- Check variable names match exactly (case-sensitive)
- Verify variables are set in production environment (not just local)

### Admin Panel Not Loading

- Check backend is running: `curl https://your-backend-url/health`
- Verify `admin_panel.html` exists in backend directory
- Check backend logs for errors

## Recommended Production Setup

1. **Backend**: Railway or Render with PostgreSQL
2. **Frontend**: Netlify (already set up)
3. **Database**: PostgreSQL (via Railway/Render)
4. **Domain**: Point custom domain to both services
5. **SSL**: Both services provide SSL certificates automatically

## Example Production URLs

- Frontend: `https://davemelkonian.com`
- Backend: `https://api.davemelkonian.com` or `https://admin.davemelkonian.com`
- Admin Panel: `https://api.davemelkonian.com/admin`

If using subdomain, update CORS:

```
CORS_ORIGINS=https://davemelkonian.com,https://www.davemelkonian.com
```
