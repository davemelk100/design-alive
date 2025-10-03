export interface TechCategory {
  title: string;
  icon: string;
  items: {
    name: string;
    description: string;
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
      },
      { name: "TypeScript", description: "Type-safe JavaScript development" },
      { name: "Vite", description: "Fast build tool and development server" },
      { name: "React Router DOM", description: "Client-side routing" },
    ],
  },
  {
    title: "Styling & UI",
    icon: "Palette",
    items: [
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      { name: "Framer Motion", description: "Animation library for React" },
      { name: "Radix UI", description: "Headless UI components" },
      { name: "Lucide React", description: "Beautiful icon library" },
    ],
  },
  {
    title: "Database & Backend",
    icon: "Database",
    items: [
      {
        name: "Drizzle ORM",
        description: "TypeScript ORM for database operations",
      },
      { name: "PostgreSQL", description: "Primary database via Neon" },
      { name: "NextAuth.js", description: "Authentication framework" },
      { name: "Netlify Functions", description: "Serverless functions" },
    ],
  },
  {
    title: "Deployment & Hosting",
    icon: "Globe",
    items: [
      { name: "Netlify", description: "Static site hosting and deployment" },
      {
        name: "Service Worker",
        description: "Offline functionality and caching",
      },
      { name: "CDN", description: "Global content delivery" },
      { name: "SSL/TLS", description: "Secure HTTPS connections" },
    ],
  },
  {
    title: "Mobile & Responsive",
    icon: "Smartphone",
    items: [
      {
        name: "Mobile-First Design",
        description: "Responsive design approach",
      },
      {
        name: "Touch Interactions",
        description: "Mobile-optimized interactions",
      },
      { name: "Progressive Web App", description: "App-like experience" },
      {
        name: "Viewport Optimization",
        description: "Adaptive layouts for all devices",
      },
    ],
  },
  {
    title: "Performance & Optimization",
    icon: "Zap",
    items: [
      { name: "Code Splitting", description: "Lazy loading with React.lazy" },
      { name: "Image Optimization", description: "WebP format with fallbacks" },
      {
        name: "Bundle Optimization",
        description: "Tree shaking and minification",
      },
      {
        name: "Caching Strategy",
        description: "Service worker and browser caching",
      },
    ],
  },
  {
    title: "Development Tools",
    icon: "Settings",
    items: [
      { name: "ESLint", description: "Code linting and quality" },
      { name: "Prettier", description: "Code formatting" },
      { name: "TypeScript", description: "Static type checking" },
      { name: "Vite Dev Server", description: "Fast development with HMR" },
    ],
  },
  {
    title: "Security & Accessibility",
    icon: "Shield",
    items: [
      { name: "WCAG 2.1 AA", description: "Accessibility compliance" },
      { name: "ARIA Labels", description: "Screen reader support" },
      {
        name: "Keyboard Navigation",
        description: "Full keyboard accessibility",
      },
      { name: "Security Headers", description: "Content Security Policy" },
    ],
  },
  {
    title: "Content & Media",
    icon: "Layers",
    items: [
      { name: "RSS Feeds", description: "News aggregation system" },
      {
        name: "Audio Player",
        description: "Custom music player with 18 tracks",
      },
      { name: "Video Content", description: "Optimized video delivery" },
      { name: "SVG Animations", description: "Lightweight vector animations" },
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
  "Music Player with 18 Tracks",
  "News Aggregator with RSS Feeds",
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
    metric: "Bundle Size",
    value: "485KB",
    description: "Total JavaScript bundle",
  },
  {
    metric: "Load Time",
    value: "< 2s",
    description: "Fast initial load",
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
