export interface TechCategory {
  title: string;
  icon: string;
  items: {
    name: string;
    description: string;
    example?: {
      title: string;
      description: string;
      link: string;
      code?: string;
    };
  }[];
}

export interface Methodology {
  title: string;
  description: string;
}

export interface PerformanceMetric {
  metric: string;
  value: string;
  description: string;
}

export const techCategories: TechCategory[] = [
  {
    title: "Frontend Framework",
    icon: "Code",
    items: [
      {
        name: "React 18",
        description: "Modern React with concurrent features",
        example: {
          title: "Interactive Components",
          description: "Component state management and hooks",
          link: "/",
          code: "useState, useEffect, useRef hooks for interactive controls",
        },
      },
      {
        name: "TypeScript",
        description: "Type-safe JavaScript development",
        example: {
          title: "Type Safety",
          description: "Strongly typed components and interfaces",
          link: "/specs",
          code: "interface TechCategory { title: string; icon: string; }",
        },
      },
      {
        name: "Vite",
        description: "Fast build tool and development server",
        example: {
          title: "Hot Module Replacement",
          description: "Instant updates during development",
          link: "/json",
          code: "Fast refresh with TypeScript support",
        },
      },
      {
        name: "React Router DOM",
        description: "Client-side routing",
        example: {
          title: "SPA Navigation",
          description: "Smooth page transitions without reloads",
          link: "/archive",
          code: "Link, useNavigate for seamless routing",
        },
      },
    ],
  },
  {
    title: "Styling & UI",
    icon: "Palette",
    items: [
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework",
        example: {
          title: "Responsive Design",
          description: "Mobile-first responsive layouts throughout",
          link: "/",
          code: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        },
      },
      {
        name: "Framer Motion",
        description: "Animation library for React",
        example: {
          title: "Smooth Animations",
          description: "Page transitions and micro-interactions",
          link: "/",
          code: "motion.div with stagger animations",
        },
      },
      {
        name: "Radix UI",
        description: "Headless UI components",
        example: {
          title: "Accessible Components",
          description: "Custom components built on Radix primitives",
          link: "/news",
          code: "Dialog, DropdownMenu, Tooltip components",
        },
      },
      {
        name: "Lucide React",
        description: "Beautiful icon library",
        example: {
          title: "Consistent Icons",
          description: "Scalable vector icons throughout the site",
          link: "/",
          code: "ArrowLeft, Copy, Check, Music icons",
        },
      },
    ],
  },
  {
    title: "Database & Backend",
    icon: "Database",
    items: [
      {
        name: "FastAPI",
        description: "Modern Python web framework for backend API",
        example: {
          title: "RESTful API",
          description: "Content management API with CRUD operations",
          link: "/specs",
          code: "FastAPI with SQLAlchemy ORM for database operations",
        },
      },
      {
        name: "SQLAlchemy",
        description: "Python ORM for database operations",
        example: {
          title: "Database Models",
          description: "Type-safe database models and relationships",
          link: "/specs",
          code: "SQLAlchemy models for content management",
        },
      },
      {
        name: "Drizzle ORM",
        description: "TypeScript ORM for frontend database operations",
        example: {
          title: "Type-Safe Database",
          description: "Database schema with TypeScript types",
          link: "/specs",
          code: "schema.ts with Drizzle table definitions",
        },
      },
      {
        name: "PostgreSQL / Neon",
        description: "Primary database via Neon cloud",
        example: {
          title: "Cloud Database",
          description: "Serverless PostgreSQL for data persistence",
          link: "/news",
          code: "Neon connection with connection pooling",
        },
      },
      {
        name: "JWT Authentication",
        description: "Token-based authentication system",
        example: {
          title: "Secure Authentication",
          description: "JWT tokens for admin panel access",
          link: "/specs",
          code: "python-jose for JWT token generation and validation",
        },
      },
      {
        name: "Netlify Functions",
        description: "Serverless functions for RSS and API",
        example: {
          title: "Serverless API",
          description: "RSS proxy and site configuration functions",
          link: "/news",
          code: "netlify/functions/ for API endpoints",
        },
      },
    ],
  },
  {
    title: "Deployment & Hosting",
    icon: "Globe",
    items: [
      {
        name: "Netlify",
        description: "Static site hosting and deployment",
        example: {
          title: "Automated Deployment",
          description: "Git-based continuous deployment",
          link: "/",
          code: "netlify.toml for build configuration",
        },
      },
      {
        name: "Backend Hosting",
        description: "FastAPI backend on Railway/Render/Fly.io",
        example: {
          title: "Cloud Backend",
          description: "Deployed Python backend with PostgreSQL",
          link: "/specs",
          code: "Railway, Render, or Fly.io for backend hosting",
        },
      },
      {
        name: "Service Worker",
        description: "Offline functionality and caching",
        example: {
          title: "Offline Support",
          description: "Cached resources for offline browsing",
          link: "/",
          code: "sw.js for service worker implementation",
        },
      },
      {
        name: "CDN",
        description: "Global content delivery",
        example: {
          title: "Fast Global Delivery",
          description: "Edge-cached static assets",
          link: "/",
          code: "Netlify CDN for optimal performance",
        },
      },
      {
        name: "SSL/TLS",
        description: "Secure HTTPS connections",
        example: {
          title: "Secure Connections",
          description: "Automatic HTTPS with Let's Encrypt",
          link: "/",
          code: "Automatic SSL certificate management",
        },
      },
    ],
  },
  {
    title: "Mobile & Responsive",
    icon: "Smartphone",
    items: [
      {
        name: "Mobile-First Design",
        description: "Responsive design approach",
        example: {
          title: "Responsive Grid",
          description: "Adaptive layouts for all screen sizes",
          link: "/",
          code: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        },
      },
      {
        name: "Touch Interactions",
        description: "Mobile-optimized interactions",
        example: {
          title: "Touch-Friendly UI",
          description: "44px minimum touch targets",
          link: "/",
          code: "min-h-[44px] min-w-[44px] for buttons",
        },
      },
      {
        name: "Progressive Web App",
        description: "App-like experience",
        example: {
          title: "PWA Features",
          description: "Installable app with offline support",
          link: "/",
          code: "manifest.json and service worker",
        },
      },
      {
        name: "Viewport Optimization",
        description: "Adaptive layouts for all devices",
        example: {
          title: "Flexible Typography",
          description: "Scalable text with clamp() functions",
          link: "/",
          code: "font-size: clamp(1rem, 4vw, 2rem)",
        },
      },
    ],
  },
  {
    title: "Performance & Optimization",
    icon: "Zap",
    items: [
      {
        name: "Code Splitting",
        description:
          "Comprehensive lazy loading strategy with React.lazy and Suspense",
        example: {
          title: "Route & Component Splitting",
          description:
            "All pages, components, and icons loaded on demand for optimal performance",
          link: "/json",
          code: "React.lazy(() => import('./JsonAiPrompts')) with Suspense boundaries",
        },
      },
      {
        name: "Image Optimization",
        description: "WebP format with fallbacks",
        example: {
          title: "Optimized Assets",
          description: "SVG animations and optimized images",
          link: "/",
          code: "SVG animations for lightweight graphics",
        },
      },
      {
        name: "Bundle Optimization",
        description: "Tree shaking and minification",
        example: {
          title: "Optimized Bundles",
          description: "Separate vendor and utility chunks",
          link: "/specs",
          code: "manualChunks configuration in Vite",
        },
      },
      {
        name: "Caching Strategy",
        description: "Service worker and browser caching",
        example: {
          title: "Smart Caching",
          description: "Long-term caching for static assets",
          link: "/",
          code: "Cache-first strategy for images and fonts",
        },
      },
    ],
  },
  {
    title: "Development Tools",
    icon: "Settings",
    items: [
      {
        name: "ESLint",
        description: "Code linting and quality",
        example: {
          title: "Code Quality",
          description: "Consistent code style and error prevention",
          link: "/specs",
          code: ".eslintrc configuration for React/TypeScript",
        },
      },
      {
        name: "Prettier",
        description: "Code formatting",
        example: {
          title: "Auto-Formatting",
          description: "Consistent code formatting across the project",
          link: "/specs",
          code: ".prettierrc for consistent styling",
        },
      },
      {
        name: "TypeScript",
        description: "Static type checking",
        example: {
          title: "Type Safety",
          description: "Compile-time error detection",
          link: "/specs",
          code: "tsconfig.json for strict type checking",
        },
      },
      {
        name: "Vite Dev Server",
        description: "Fast development with HMR",
        example: {
          title: "Fast Development",
          description: "Instant hot module replacement",
          link: "/specs",
          code: "Vite HMR for instant updates",
        },
      },
    ],
  },
  {
    title: "Security & Accessibility",
    icon: "Shield",
    items: [
      {
        name: "WCAG 2.1 AA",
        description: "Accessibility compliance",
        example: {
          title: "Accessible Design",
          description: "High contrast ratios and readable fonts",
          link: "/",
          code: "color: rgb(17 24 39 / var(--tw-text-opacity))",
        },
      },
      {
        name: "ARIA Labels",
        description: "Screen reader support",
        example: {
          title: "Screen Reader Support",
          description: "Descriptive labels for all interactive elements",
          link: "/",
          code: "aria-label and role attributes",
        },
      },
      {
        name: "Keyboard Navigation",
        description: "Full keyboard accessibility",
        example: {
          title: "Keyboard Accessible",
          description: "Tab navigation and keyboard shortcuts",
          link: "/news",
          code: "onKeyDown handlers for keyboard events",
        },
      },
      {
        name: "Security Headers",
        description: "Content Security Policy",
        example: {
          title: "Secure Headers",
          description: "CSP and security headers for protection",
          link: "/",
          code: "_headers file with security policies",
        },
      },
    ],
  },
  {
    title: "Content & Media",
    icon: "Layers",
    items: [
      {
        name: "RSS Feeds",
        description: "News aggregation system",
        example: {
          title: "Live News Feeds",
          description: "Real-time RSS feed aggregation and parsing",
          link: "/news",
          code: "RSS proxy functions for CORS handling",
        },
      },
      {
        name: "Music Player",
        description: "Audio playback with playlist management",
        example: {
          title: "Interactive Audio",
          description: "Custom music player with play/pause controls",
          link: "/music",
          code: "HTML5 audio API with React state management",
        },
      },
      {
        name: "JSON AI Prompts",
        description: "Structured prompt builder for AI interactions",
        example: {
          title: "AI Prompt Tool",
          description: "JSON-based prompt structure for better AI results",
          link: "/json",
          code: "Structured JSON format for AI prompt engineering",
        },
      },
      {
        name: "Audio Transcript",
        description: "Audio transcription and playback interface",
        example: {
          title: "Transcript Viewer",
          description: "Synchronized audio and transcript display",
          link: "/zaven",
          code: "Audio playback with transcript highlighting",
        },
      },
      {
        name: "Video Content",
        description: "Optimized video delivery",
        example: {
          title: "Lazy Video Loading",
          description: "Optimized video components with lazy loading",
          link: "/",
          code: "LazyVideo component with intersection observer",
        },
      },
      {
        name: "SVG Animations",
        description: "Lightweight vector animations",
        example: {
          title: "Smooth Animations",
          description: "Custom SVG animations with Framer Motion",
          link: "/",
          code: "SVG path animations and transitions",
        },
      },
    ],
  },
];

export const methodologies: Methodology[] = [
  {
    title: "Design System",
    description:
      "Component-based design system with consistent typography, colors, and spacing",
  },
  {
    title: "Mobile-First Development",
    description:
      "Responsive design starting from mobile devices and scaling up",
  },
  {
    title: "Progressive Enhancement",
    description:
      "Core functionality works everywhere, enhanced features for modern browsers",
  },
  {
    title: "Performance Budget",
    description: "Optimized for fast loading times and smooth user experience",
  },
];

export const keyFeatures: string[] = [
  "Dark/Light Mode Toggle",
  "Responsive Design (Mobile-First)",
  "Smooth Animations & Transitions",
  "Code Splitting & Lazy Loading",
  "News Aggregator with RSS Feeds",
  "Music Player with Playlist",
  "JSON AI Prompts Builder",
  "Audio Transcript Viewer",
  "FastAPI Backend with Admin Panel",
  "JWT Authentication",
  "Interactive SVG Animations",
  "Article Modal System",
  "Grid/List View Toggle",
  "Service Worker (Offline Support)",
  "SEO Optimized",
  "Accessibility Compliant",
  "Performance Optimized",
];

export const performanceMetrics: PerformanceMetric[] = [
  {
    metric: "Initial Bundle",
    value: "< 200KB",
    description: "Code-split chunks load on demand",
  },
  {
    metric: "First Contentful Paint",
    value: "< 1.5s",
    description: "Fast initial render",
  },
  {
    metric: "Largest Contentful Paint",
    value: "< 2.5s",
    description: "Optimized LCP",
  },
  {
    metric: "Lighthouse Score",
    value: "95+",
    description: "Performance rating",
  },
  {
    metric: "Accessibility",
    value: "100%",
    description: "WCAG 2.1 AA compliant",
  },
];

export const pageContent = {
  title: "Application Specs",
  subtitle:
    "A comprehensive overview of the technologies, frameworks, and methodologies powering this modern portfolio website.",
  footerText:
    "Built with modern web technologies and best practices for optimal performance and user experience.",
};
