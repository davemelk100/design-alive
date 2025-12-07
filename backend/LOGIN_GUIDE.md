# How to Log In

## Option 1: Login Page (Easiest)

1. **Start the backend server:**
   ```bash
   cd backend
   python run.py
   # or
   uvicorn app.main:app --reload
   ```

2. **Open your browser and go to:**
   ```
   http://localhost:8000/login
   ```

3. **Enter credentials:**
   - Username: `admin`
   - Password: `admin123` (or whatever you set in `.env`)

4. **After login**, you'll receive an access token that you can use for API requests.

## Option 2: Swagger UI (Interactive API Docs)

1. **Start the backend server** (same as above)

2. **Go to:**
   ```
   http://localhost:8000/docs
   ```

3. **Click on `/api/auth/login/json`** endpoint

4. **Click "Try it out"**

5. **Enter credentials:**
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

6. **Click "Execute"** - you'll get an access token in the response

7. **Click the "Authorize" button** at the top and paste your token to test other endpoints

## Option 3: Command Line (curl)

```bash
curl -X POST "http://localhost:8000/api/auth/login/json" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

This will return:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

## Using the Token

Once you have the token, include it in API requests:

```bash
curl -X GET "http://localhost:8000/api/content/articles" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Or in JavaScript:
```javascript
fetch('http://localhost:8000/api/content/articles', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

## Default Credentials

After running `python -m app.scripts.init_db`:
- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Change these in production!** Update `ADMIN_PASSWORD` in `.env` file.

