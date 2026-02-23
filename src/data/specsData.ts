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
          code: "useState, useEffect, useCallback hooks for interactive controls",
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
        name: "React Router DOM v7",
        description: "Client-side routing with lazy loading",
        example: {
          title: "SPA Navigation",
          description: "Smooth page transitions without reloads",
          link: "/archive",
          code: "Link, useNavigate, useLocation for seamless routing",
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
        description: "Utility-first CSS framework with custom theme",
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
        name: "shadcn/ui + Radix UI",
        description: "Accessible component library built on Radix primitives",
        example: {
          title: "Accessible Components",
          description: "Dialog, Toast, Accordion, Tabs, and more",
          link: "/",
          code: "class-variance-authority + Radix primitives",
        },
      },
      {
        name: "Lucide React",
        description: "Consistent icon library",
        example: {
          title: "Scalable Icons",
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
        name: "Netlify Functions",
        description: "Serverless API endpoints for auth, checkout, and config",
        example: {
          title: "Serverless API",
          description: "Auth, Stripe checkout, and site config endpoints",
          link: "/",
          code: "netlify/functions/ with TypeScript handlers",
        },
      },
      {
        name: "Drizzle ORM + Drizzle Kit",
        description: "TypeScript ORM with schema migrations",
        example: {
          title: "Type-Safe Database",
          description: "Database schema with TypeScript types and migration tooling",
          link: "/specs",
          code: "drizzle-kit generate, migrate, push for schema management",
        },
      },
      {
        name: "PostgreSQL / Neon",
        description: "Serverless PostgreSQL via Neon cloud",
        example: {
          title: "Cloud Database",
          description: "Serverless PostgreSQL with connection pooling",
          link: "/",
          code: "@neondatabase/serverless for edge-compatible connections",
        },
      },
      {
        name: "FastAPI (Python)",
        description: "Backend API with SQLAlchemy ORM and Alembic migrations",
        example: {
          title: "RESTful API",
          description: "Content management and admin API with JWT auth",
          link: "/specs",
          code: "FastAPI + SQLAlchemy + python-jose for backend operations",
        },
      },
      {
        name: "JWT Authentication",
        description: "Token-based auth with bcrypt password hashing",
        example: {
          title: "Secure Authentication",
          description: "JWT tokens for store and admin access",
          link: "/specs",
          code: "jsonwebtoken + bcryptjs for auth flow",
        },
      },
    ],
  },
  {
    title: "Payments & Services",
    icon: "Zap",
    items: [
      {
        name: "Stripe",
        description: "Payment processing for the store",
        example: {
          title: "Checkout Integration",
          description: "Stripe Buy Button and serverless checkout sessions",
          link: "/store",
          code: "@stripe/stripe-js + Netlify function for session creation",
        },
      },
      {
        name: "EmailJS",
        description: "Client-side email delivery for contact forms",
        example: {
          title: "Contact Forms",
          description: "Email delivery from Contact and Consulting pages",
          link: "/portfolio/contact",
          code: "@emailjs/browser for form submissions without a mail server",
        },
      },
      {
        name: "Zod",
        description: "Runtime schema validation",
        example: {
          title: "Form Validation",
          description: "Type-safe validation with React Hook Form integration",
          link: "/store",
          code: "@hookform/resolvers + zod for validated forms",
        },
      },
      {
        name: "React Hook Form",
        description: "Performant form state management",
        example: {
          title: "Efficient Forms",
          description: "Minimal re-renders with schema-driven validation",
          link: "/portfolio/contact",
          code: "useForm with zodResolver for type-safe forms",
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
        description: "Static hosting, serverless functions, and CI/CD",
        example: {
          title: "Automated Deployment",
          description: "Git-based continuous deployment with build pipeline",
          link: "/",
          code: "netlify.toml for build config and SPA redirects",
        },
      },
      {
        name: "CDN",
        description: "Global content delivery via Netlify Edge",
        example: {
          title: "Fast Global Delivery",
          description: "Edge-cached static assets worldwide",
          link: "/",
          code: "Automatic CDN distribution for all static files",
        },
      },
      {
        name: "Service Worker",
        description: "Offline functionality and asset caching",
        example: {
          title: "Offline Support",
          description: "Cached resources for offline browsing",
          link: "/",
          code: "sw.js with cache-first strategy",
        },
      },
      {
        name: "SSL/TLS",
        description: "Automatic HTTPS with Let's Encrypt",
        example: {
          title: "Secure Connections",
          description: "Automatic SSL certificate provisioning",
          link: "/",
          code: "Managed SSL via Netlify",
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
        description: "Responsive layouts starting from mobile",
        example: {
          title: "Responsive Grid",
          description: "Adaptive layouts for all screen sizes",
          link: "/",
          code: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        },
      },
      {
        name: "Touch Interactions",
        description: "Mobile-optimized touch targets and gestures",
        example: {
          title: "Touch-Friendly UI",
          description: "44px minimum touch targets",
          link: "/",
          code: "min-h-[44px] min-w-[44px] for buttons",
        },
      },
      {
        name: "Progressive Web App",
        description: "Installable app with offline support",
        example: {
          title: "PWA Features",
          description: "Standalone display with app manifest",
          link: "/",
          code: "manifest.json + service worker registration",
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
    icon: "Settings",
    items: [
      {
        name: "Code Splitting",
        description:
          "Lazy loading with React.lazy and Suspense for all routes",
        example: {
          title: "Route & Component Splitting",
          description:
            "All pages and heavy components loaded on demand",
          link: "/json",
          code: "React.lazy(() => import('./JsonAiPrompts')) with Suspense",
        },
      },
      {
        name: "Image Optimization",
        description: "SVG animations and optimized assets",
        example: {
          title: "Optimized Assets",
          description: "SVG graphics and lazy-loaded images",
          link: "/",
          code: "SVG animations for lightweight graphics",
        },
      },
      {
        name: "Bundle Optimization",
        description: "Tree shaking, minification with Terser, manual chunks",
        example: {
          title: "Optimized Bundles",
          description: "Separate vendor and utility chunks",
          link: "/specs",
          code: "manualChunks + Terser minification in Vite config",
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
    title: "Testing & Dev Tools",
    icon: "Shield",
    items: [
      {
        name: "Vitest",
        description: "Fast unit testing framework with jsdom",
        example: {
          title: "Unit Tests",
          description: "Component and utility testing with Testing Library",
          link: "/specs",
          code: "vitest + @testing-library/react + @testing-library/user-event",
        },
      },
      {
        name: "TypeScript Strict Mode",
        description: "Compile-time type checking and error prevention",
        example: {
          title: "Type Safety",
          description: "Strict tsconfig for maximum type coverage",
          link: "/specs",
          code: "tsconfig.json with strict type checking enabled",
        },
      },
      {
        name: "Vite Dev Server",
        description: "Fast development with instant HMR",
        example: {
          title: "Fast Development",
          description: "Instant hot module replacement",
          link: "/specs",
          code: "Vite HMR for sub-second updates",
        },
      },
      {
        name: "Drizzle Studio",
        description: "Visual database browser for development",
        example: {
          title: "DB Explorer",
          description: "Browse and edit data during development",
          link: "/specs",
          code: "drizzle-kit studio for local database inspection",
        },
      },
    ],
  },
  {
    title: "Content & Media",
    icon: "Layers",
    items: [
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
        name: "Markdown Rendering",
        description: "Rich content rendering from markdown sources",
        example: {
          title: "Article Content",
          description: "Articles rendered from markdown with react-markdown",
          link: "/article/test",
          code: "react-markdown for rich article content",
        },
      },
      {
        name: "Audio Transcript",
        description: "Audio transcription and synchronized playback",
        example: {
          title: "Transcript Viewer",
          description: "Synchronized audio and transcript display",
          link: "/zaven",
          code: "Audio playback with transcript highlighting",
        },
      },
      {
        name: "Design System",
        description: "Live editable theme with CSS custom properties",
        example: {
          title: "Theme Editor",
          description: "Real-time color editing with site-wide preview",
          link: "/portfolio/design-system",
          code: "CSS custom properties with localStorage persistence",
        },
      },
      {
        name: "SVG Animations",
        description: "Lightweight vector animations with Framer Motion",
        example: {
          title: "Smooth Animations",
          description: "Custom SVG animations and transitions",
          link: "/",
          code: "SVG path animations with motion components",
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
  "E-Commerce Store with Stripe Payments",
  "Music Player with Playlist",
  "JSON AI Prompts Builder",
  "Audio Transcript Viewer",
  "Live Theme Editor with Site-Wide Preview",
  "JWT Authentication & Protected Routes",
  "Contact Forms with EmailJS",
  "Interactive SVG Animations",
  "Markdown Article Rendering",
  "Service Worker (Offline Support)",
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
