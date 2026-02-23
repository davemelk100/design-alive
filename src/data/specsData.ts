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
          link: "/portfolio/design-system",
          code: "useState, useEffect, useCallback hooks for interactive controls",
        },
      },
      {
        name: "TypeScript 5",
        description: "Type-safe JavaScript development with strict mode",
        example: {
          title: "Type Safety",
          description: "Strongly typed components and interfaces",
          link: "/specs",
          code: "interface TechCategory { title: string; icon: string; }",
        },
      },
      {
        name: "Vite 5",
        description: "Fast build tool with HMR and Terser minification",
        example: {
          title: "Optimized Builds",
          description: "Tree shaking, code splitting, and manual chunks",
          link: "/specs",
          code: "manualChunks + Terser minification in Vite config",
        },
      },
      {
        name: "React Router DOM v7",
        description: "Client-side routing with lazy loading",
        example: {
          title: "SPA Navigation",
          description: "Smooth page transitions without reloads",
          link: "/portfolio",
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
        name: "Tailwind CSS 3",
        description: "Utility-first CSS with custom theme and design tokens",
        example: {
          title: "Responsive Design",
          description: "Mobile-first responsive layouts throughout",
          link: "/portfolio",
          code: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        },
      },
      {
        name: "Framer Motion",
        description: "Animation library for React",
        example: {
          title: "Smooth Animations",
          description: "Page transitions and micro-interactions",
          link: "/portfolio/design-system",
          code: "motion.div with stagger animations",
        },
      },
      {
        name: "shadcn/ui + Radix UI",
        description: "Accessible component library built on Radix primitives",
        example: {
          title: "Accessible Components",
          description: "Dialog, Toast, Accordion, Tabs, and more",
          link: "/portfolio/design-system",
          code: "class-variance-authority + Radix primitives",
        },
      },
      {
        name: "Lucide React",
        description: "Consistent icon library with lazy loading",
        example: {
          title: "Scalable Icons",
          description: "Tree-shakeable vector icons throughout the site",
          link: "/portfolio",
          code: "React.lazy(() => import('lucide-react'))",
        },
      },
      {
        name: "CSS Custom Properties",
        description: "Dynamic theming with HSL-based CSS variables",
        example: {
          title: "Live Theme Editor",
          description: "Real-time color editing with site-wide preview",
          link: "/portfolio/design-system",
          code: "--brand, --primary, --secondary CSS variables with localStorage persistence",
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
          link: "/specs",
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
          link: "/specs",
          code: "@neondatabase/serverless for edge-compatible connections",
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
          description: "Stripe checkout sessions via serverless functions",
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
          description: "Git-based continuous deployment with branch deploys for staging",
          link: "/specs",
          code: "netlify.toml for build config, SPA redirects, and branch deploy context",
        },
      },
      {
        name: "CDN",
        description: "Global content delivery via Netlify Edge",
        example: {
          title: "Fast Global Delivery",
          description: "Edge-cached static assets worldwide",
          link: "/specs",
          code: "Automatic CDN distribution for all static files",
        },
      },
      {
        name: "Service Worker",
        description: "Offline functionality and asset caching",
        example: {
          title: "Offline Support",
          description: "Cached resources for offline browsing",
          link: "/specs",
          code: "sw.js with cache-first strategy",
        },
      },
      {
        name: "SSL/TLS",
        description: "Automatic HTTPS with Let's Encrypt",
        example: {
          title: "Secure Connections",
          description: "Automatic SSL certificate provisioning",
          link: "/specs",
          code: "Managed SSL via Netlify",
        },
      },
    ],
  },
  {
    title: "Design System & Theming",
    icon: "Palette",
    items: [
      {
        name: "Live Color Editor",
        description: "Interactive color picker for brand and secondary palette colors",
        example: {
          title: "Theme Customization",
          description: "Click a swatch to change the site palette in real time",
          link: "/portfolio/design-system",
          code: "Color picker with HSL conversion and localStorage persistence",
        },
      },
      {
        name: "WCAG AA Auto-Contrast",
        description: "Automatic palette adjustment to maintain 4.5:1 contrast ratio",
        example: {
          title: "Accessibility Compliance",
          description: "Foreground colors auto-adjust when background changes",
          link: "/portfolio/design-system",
          code: "contrastRatio() + iterative lightness adjustment across CONTRAST_PAIRS",
        },
      },
      {
        name: "Brand-Dynamic Utilities",
        description: "Custom CSS utility classes that reference CSS variables for brand color",
        example: {
          title: "Dynamic Brand Color",
          description: "Icons, titles, and links update when brand color changes",
          link: "/portfolio",
          code: "text-brand-dynamic, bg-brand-dynamic via @layer utilities in globals.css",
        },
      },
      {
        name: "Theme Preview Bar",
        description: "Persistent toast bar for previewing, saving, and discarding color changes",
        example: {
          title: "Change Management",
          description: "Navigate affected pages, undo, discard, or save changes",
          link: "/portfolio/design-system",
          code: "ThemePreviewBar component with localStorage history stack",
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
          link: "/portfolio",
          code: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        },
      },
      {
        name: "Touch Interactions",
        description: "Mobile-optimized touch targets and gestures",
        example: {
          title: "Touch-Friendly UI",
          description: "44px minimum touch targets",
          link: "/portfolio",
          code: "min-h-[44px] min-w-[44px] for buttons",
        },
      },
      {
        name: "Progressive Web App",
        description: "Installable app with offline support",
        example: {
          title: "PWA Features",
          description: "Standalone display with app manifest",
          link: "/specs",
          code: "manifest.json + service worker registration",
        },
      },
      {
        name: "Dark Mode",
        description: "System-aware dark/light theme toggle",
        example: {
          title: "Theme Switching",
          description: "Class-based dark mode with localStorage persistence",
          link: "/portfolio",
          code: "darkMode: ['class'] in Tailwind config + localStorage",
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
          link: "/specs",
          code: "React.lazy(() => import('./pages/...')) with Suspense fallback",
        },
      },
      {
        name: "Image Optimization",
        description: "Responsive images with srcset, lazy loading, and SVG graphics",
        example: {
          title: "Optimized Assets",
          description: "getCardImageProps and getThumbnailImageProps utilities",
          link: "/portfolio/design",
          code: "imageOptimizer.ts with responsive srcset generation",
        },
      },
      {
        name: "Bundle Optimization",
        description: "Tree shaking, Terser minification, and manual chunks",
        example: {
          title: "Optimized Bundles",
          description: "Separate vendor and utility chunks",
          link: "/specs",
          code: "manualChunks + Terser minification in Vite config",
        },
      },
      {
        name: "Font Loading Strategy",
        description: "Deferred font loading with system font fallbacks",
        example: {
          title: "Non-Blocking Fonts",
          description: "requestIdleCallback for font loading after initial paint",
          link: "/specs",
          code: "Deferred Google Fonts with wf-active/wf-loading classes",
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
          code: "tsc && vite build ensures type safety before deploy",
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
      {
        name: "Netlify CLI",
        description: "Local development and manual deploys",
        example: {
          title: "Local Dev & Staging",
          description: "Build and deploy to staging aliases from CLI",
          link: "/specs",
          code: "netlify deploy --build --alias staging",
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
          description: "Articles rendered with react-markdown",
          link: "/archive",
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
        name: "Case Studies",
        description: "Tabbed case study pages with structured content sections",
        example: {
          title: "Portfolio Case Studies",
          description: "5 detailed case studies with before/after impact sections",
          link: "/case-studies",
          code: "Tab-based navigation with conditional rendering",
        },
      },
    ],
  },
];

export const methodologies: Methodology[] = [
  {
    title: "Design System",
    description:
      "Live editable design system with CSS custom properties, WCAG AA auto-contrast, and brand color propagation",
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
    description: "Optimized for fast loading times with code splitting, lazy loading, and deferred font loading",
  },
];

export const keyFeatures: string[] = [
  "Dark/Light Mode Toggle",
  "Responsive Design (Mobile-First)",
  "Smooth Animations & Transitions",
  "Code Splitting & Lazy Loading",
  "E-Commerce Store with Stripe Payments",
  "Music Player with Playlist",
  "Audio Transcript Viewer",
  "Live Theme Editor with WCAG AA Auto-Contrast",
  "Brand Color Propagation Across Portfolio",
  "JWT Authentication & Protected Routes",
  "Contact Forms with EmailJS",
  "Markdown Article Rendering",
  "Tabbed Case Studies",
  "Service Worker (Offline Support)",
  "Accessibility Compliant (WCAG 2.1 AA)",
  "Performance Optimized",
  "Staging Environment via Netlify Branch Deploys",
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
