from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from app.core.config import settings
from app.db.database import engine, Base
from app.api.routes import auth, content, users, products

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Portfolio Admin API",
    description="API for managing portfolio content and store",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(content.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(products.router, prefix="/api", tags=["products"])


@app.get("/")
async def root():
    return {
        "message": "Portfolio Admin API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/admin", response_class=HTMLResponse)
async def admin_panel():
    """Redirect to store admin panel"""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/admin/store")


@app.get("/admin/content", response_class=HTMLResponse)
async def content_admin_panel():
    """Serve the content admin panel page"""
    from pathlib import Path
    admin_file = Path(__file__).parent.parent / "admin_panel.html"
    if admin_file.exists():
        with open(admin_file, 'r', encoding='utf-8') as f:
            return f.read()
    return "<h1>Content admin panel not found</h1>"


@app.get("/admin/store", response_class=HTMLResponse)
async def store_admin_panel():
    """Serve the store admin panel page"""
    from pathlib import Path
    admin_file = Path(__file__).parent.parent / "store_admin.html"
    if admin_file.exists():
        with open(admin_file, 'r', encoding='utf-8') as f:
            return f.read()
    return "<h1>Store admin panel not found</h1>"


@app.get("/login", response_class=HTMLResponse)
async def login_page():
    """Serve the admin login page"""
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Portfolio Admin</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            width: 100%;
            max-width: 400px;
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
            font-size: 14px;
        }
        
        input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .error {
            background: #fee;
            color: #c33;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        
        .error.show {
            display: block;
        }
        
        .success {
            background: #efe;
            color: #3c3;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        
        .success.show {
            display: block;
        }
        
        .token-display {
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
            font-size: 12px;
            word-break: break-all;
            display: none;
        }
        
        .token-display.show {
            display: block;
        }
        
        .api-link {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
        }
        
        .api-link a {
            color: #667eea;
            text-decoration: none;
        }
        
        .api-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>Admin Login</h1>
        <p class="subtitle">Portfolio Content Management</p>
        
        <div class="error" id="error"></div>
        <div class="success" id="success"></div>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    required 
                    autocomplete="username"
                    value="admin"
                >
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    autocomplete="current-password"
                >
            </div>
            
            <button type="submit" id="submitBtn">Login</button>
        </form>
        
        <div class="token-display" id="tokenDisplay">
            <strong>Access Token:</strong><br>
            <span id="tokenValue"></span>
            <br><br>
            <small>Copy this token to use in API requests. Include it in the Authorization header as: <code>Bearer &lt;token&gt;</code></small>
        </div>
        
        <div class="api-link">
            <a href="/docs" target="_blank">View API Documentation</a>
        </div>
    </div>
    
    <script>
        const API_BASE_URL = window.location.origin;
        
        const form = document.getElementById('loginForm');
        const errorDiv = document.getElementById('error');
        const successDiv = document.getElementById('success');
        const tokenDisplay = document.getElementById('tokenDisplay');
        const tokenValue = document.getElementById('tokenValue');
        const submitBtn = document.getElementById('submitBtn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Reset UI
            errorDiv.classList.remove('show');
            successDiv.classList.remove('show');
            tokenDisplay.classList.remove('show');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login/json`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.detail || 'Login failed');
                }
                
                // Success
                successDiv.textContent = 'Login successful! Redirecting...';
                successDiv.classList.add('show');
                
                // Store token
                localStorage.setItem('admin_token', data.access_token);
                localStorage.setItem('token_type', data.token_type);
                
                // Redirect to admin panel
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 1000);
                
            } catch (error) {
                errorDiv.textContent = error.message || 'An error occurred during login';
                errorDiv.classList.add('show');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        });
        
        // Check if already logged in
        const existingToken = localStorage.getItem('admin_token');
        if (existingToken) {
            tokenValue.textContent = existingToken;
            tokenDisplay.classList.add('show');
            successDiv.textContent = 'You are already logged in. Token loaded from storage.';
            successDiv.classList.add('show');
        }
    </script>
</body>
</html>
    """

