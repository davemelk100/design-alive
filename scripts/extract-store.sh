#!/bin/bash

# BALM Store Extraction Script
# This script helps extract the store code into a separate repository

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}BALM Store Extraction Script${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if target directory is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Target directory not provided${NC}"
    echo "Usage: ./scripts/extract-store.sh <target-directory>"
    echo "Example: ./scripts/extract-store.sh ../balm-store"
    exit 1
fi

TARGET_DIR="$1"
SOURCE_DIR="$(pwd)"

# Check if target directory already exists
if [ -d "$TARGET_DIR" ]; then
    echo -e "${YELLOW}Warning: Target directory '$TARGET_DIR' already exists${NC}"
    read -p "Continue and overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}Creating directory structure...${NC}"

# Create directory structure
mkdir -p "$TARGET_DIR"
mkdir -p "$TARGET_DIR/frontend/src"
mkdir -p "$TARGET_DIR/frontend/public/img"
mkdir -p "$TARGET_DIR/backend"

echo -e "${GREEN}Copying frontend store code...${NC}"

# Copy store directory
cp -r "$SOURCE_DIR/src/store" "$TARGET_DIR/frontend/src/"

# Copy shared UI components
mkdir -p "$TARGET_DIR/frontend/src/components/ui"
echo "Copying required UI components..."
for component in button card input label dropdown-menu avatar separator alert; do
    if [ -f "$SOURCE_DIR/components/ui/${component}.tsx" ]; then
        cp "$SOURCE_DIR/components/ui/${component}.tsx" "$TARGET_DIR/frontend/src/components/ui/"
        echo "  ✓ ${component}.tsx"
    fi
done

# Copy lib utilities
mkdir -p "$TARGET_DIR/frontend/src/lib"
if [ -f "$SOURCE_DIR/lib/utils.ts" ]; then
    cp "$SOURCE_DIR/lib/utils.ts" "$TARGET_DIR/frontend/src/lib/"
    echo "  ✓ utils.ts"
fi

# Copy hooks
mkdir -p "$TARGET_DIR/frontend/src/hooks"
if [ -f "$SOURCE_DIR/hooks/use-toast.ts" ]; then
    cp "$SOURCE_DIR/hooks/use-toast.ts" "$TARGET_DIR/frontend/src/hooks/"
    echo "  ✓ use-toast.ts"
fi

# Copy store-specific images
echo -e "${GREEN}Copying store assets...${NC}"
if [ -f "$SOURCE_DIR/public/img/balm-varsity.svg" ]; then
    cp "$SOURCE_DIR/public/img/balm-varsity.svg" "$TARGET_DIR/frontend/public/img/"
    echo "  ✓ balm-varsity.svg"
fi

# Copy product images (balm-shirt-*)
find "$SOURCE_DIR/public/img" -name "balm-shirt-*" -exec cp {} "$TARGET_DIR/frontend/public/img/" \; 2>/dev/null || true

echo -e "${GREEN}Copying backend store code...${NC}"

# Copy backend structure
mkdir -p "$TARGET_DIR/backend/app/api/routes"
mkdir -p "$TARGET_DIR/backend/app/models"
mkdir -p "$TARGET_DIR/backend/app/schemas"
mkdir -p "$TARGET_DIR/backend/app/core"
mkdir -p "$TARGET_DIR/backend/app/db"
mkdir -p "$TARGET_DIR/backend/scripts"

# Copy store-specific backend files
if [ -f "$SOURCE_DIR/backend/app/api/routes/products.py" ]; then
    cp "$SOURCE_DIR/backend/app/api/routes/products.py" "$TARGET_DIR/backend/app/api/routes/"
    echo "  ✓ products.py (routes)"
fi

if [ -f "$SOURCE_DIR/backend/app/models/product.py" ]; then
    cp "$SOURCE_DIR/backend/app/models/product.py" "$TARGET_DIR/backend/app/models/"
    echo "  ✓ product.py (models)"
fi

if [ -f "$SOURCE_DIR/backend/app/schemas/product.py" ]; then
    cp "$SOURCE_DIR/backend/app/schemas/product.py" "$TARGET_DIR/backend/app/schemas/"
    echo "  ✓ product.py (schemas)"
fi

# Copy core files (config, auth, dependencies)
cp -r "$SOURCE_DIR/backend/app/core/"* "$TARGET_DIR/backend/app/core/" 2>/dev/null || true
cp -r "$SOURCE_DIR/backend/app/db/"* "$TARGET_DIR/backend/app/db/" 2>/dev/null || true

# Copy __init__.py files
find "$SOURCE_DIR/backend/app" -name "__init__.py" -exec bash -c 'cp "$1" "$2/backend/app/$(realpath --relative-to="$3/backend/app" "$1")"' _ {} "$TARGET_DIR" "$SOURCE_DIR" \; 2>/dev/null || true

# Copy admin panel
if [ -f "$SOURCE_DIR/backend/store_admin.html" ]; then
    cp "$SOURCE_DIR/backend/store_admin.html" "$TARGET_DIR/backend/"
    echo "  ✓ store_admin.html"
fi

# Copy scripts
if [ -f "$SOURCE_DIR/backend/scripts/init_db.py" ]; then
    cp "$SOURCE_DIR/backend/scripts/init_db.py" "$TARGET_DIR/backend/scripts/"
    echo "  ✓ init_db.py"
fi

# Copy requirements
if [ -f "$SOURCE_DIR/backend/requirements.txt" ]; then
    cp "$SOURCE_DIR/backend/requirements.txt" "$TARGET_DIR/backend/"
    echo "  ✓ requirements.txt"
fi

echo -e "${GREEN}Copying documentation...${NC}"

# Copy store documentation
if [ -f "$SOURCE_DIR/backend/INVENTORY_SYSTEM.md" ]; then
    cp "$SOURCE_DIR/backend/INVENTORY_SYSTEM.md" "$TARGET_DIR/backend/"
fi

if [ -f "$SOURCE_DIR/backend/INVENTORY_QUICKSTART.md" ]; then
    cp "$SOURCE_DIR/backend/INVENTORY_QUICKSTART.md" "$TARGET_DIR/backend/"
fi

if [ -f "$SOURCE_DIR/STORE_SEPARATION_GUIDE.md" ]; then
    cp "$SOURCE_DIR/STORE_SEPARATION_GUIDE.md" "$TARGET_DIR/"
fi

echo -e "${GREEN}Creating configuration files...${NC}"

# Create frontend package.json
cat > "$TARGET_DIR/frontend/package.json" << 'EOF'
{
  "name": "balm-store-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.6.3",
    "vite": "^5.4.21"
  }
}
EOF
echo "  ✓ package.json"

# Create vite.config.ts
cat > "$TARGET_DIR/frontend/vite.config.ts" << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
EOF
echo "  ✓ vite.config.ts"

# Create tailwind.config.ts
cat > "$TARGET_DIR/frontend/tailwind.config.ts" << 'EOF'
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} satisfies Config
EOF
echo "  ✓ tailwind.config.ts"

# Create tsconfig.json
cat > "$TARGET_DIR/frontend/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF
echo "  ✓ tsconfig.json"

# Create .env.example
cat > "$TARGET_DIR/.env.example" << 'EOF'
# Backend API URL
VITE_API_URL=http://localhost:8000

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_in_production

# Database
DATABASE_URL=sqlite:///./store.db

# JWT Secret
SECRET_KEY=your_secret_key_here_change_in_production
EOF
echo "  ✓ .env.example"

# Create README
cat > "$TARGET_DIR/README.md" << 'EOF'
# BALM Store

A standalone e-commerce store application extracted from the dm-2025 project.

## Features

- Product catalog with categories (Button-Up, Music, Sports)
- Shopping cart functionality
- User authentication and protected routes
- Checkout process
- Admin panel for inventory management
- Order tracking
- Responsive design

## Project Structure

```
balm-store/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── store/    # Store-specific code
│   │   ├── components/ # Shared UI components
│   │   └── lib/      # Utilities
│   └── public/       # Static assets
└── backend/          # FastAPI backend
    ├── app/
    │   ├── api/      # API routes
    │   ├── models/   # Database models
    │   └── schemas/  # Pydantic schemas
    └── scripts/      # Database initialization
```

## Setup

### Frontend

```bash
cd frontend
npm install
cp ../.env.example .env
# Edit .env with your configuration
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env with your configuration
python scripts/init_db.py
python -m uvicorn app.main:app --reload
```

## Admin Panel

Access the admin panel at: http://localhost:8000/admin/store

Default credentials (change in production):
- Username: admin
- Password: admin123

## Documentation

- See `STORE_SEPARATION_GUIDE.md` for architecture details
- See `backend/INVENTORY_SYSTEM.md` for backend API documentation
- See `backend/INVENTORY_QUICKSTART.md` for quick start guide

## Technologies

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Radix UI
- React Router

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite (can be changed to PostgreSQL)

## License

[Your License Here]
EOF
echo "  ✓ README.md"

# Create simplified backend main.py
cat > "$TARGET_DIR/backend/app/main.py" << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pathlib import Path

from app.api.routes.products import router as products_router
from app.db.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BALM Store API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products_router)

@app.get("/")
def root():
    return {"message": "BALM Store API", "version": "1.0.0"}

@app.get("/admin/store", response_class=HTMLResponse)
async def serve_store_admin():
    """Serve the store admin panel"""
    admin_file = Path(__file__).parent.parent / "store_admin.html"
    if admin_file.exists():
        return HTMLResponse(content=admin_file.read_text())
    return HTMLResponse(content="<h1>Admin panel not found</h1>", status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF
echo "  ✓ main.py"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Extraction Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Store code has been extracted to: $TARGET_DIR"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. cd $TARGET_DIR/frontend && npm install"
echo "2. cd $TARGET_DIR/backend && pip install -r requirements.txt"
echo "3. Copy and configure .env file"
echo "4. Initialize database: python backend/scripts/init_db.py"
echo "5. Start backend: cd backend && python -m uvicorn app.main:app --reload"
echo "6. Start frontend: cd frontend && npm run dev"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "- Review and update import paths in extracted files"
echo "- Update API URLs in frontend configuration"
echo "- Configure environment variables"
echo "- Test all functionality after extraction"
echo ""
echo "See STORE_SEPARATION_GUIDE.md for detailed documentation"

