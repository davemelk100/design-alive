import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { Link, useNavigate } from "react-router-dom";
import { content } from "../content";
import MobileTrayMenu from "../components/MobileTrayMenu";
import { useState } from "react";
import { ADMIN_PANEL_URL } from "../config/api";

// Lazy load icons to avoid blocking critical path
const LazyArrowLeft = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ArrowLeft }))
);
const LazyCopy = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Copy }))
);
const LazyCheck = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Check }))
);

const JsonAiPrompts = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    // Wait for navigation to complete before scrolling
    setTimeout(() => {
      const articlesSection = document.getElementById("articles");
      if (articlesSection) {
        articlesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleCopyJson = async () => {
    const jsonText = JSON.stringify(
      {
        application: {
          name: "Dave Melkonian Portfolio",
          type: "Personal Portfolio Website",
          description:
            "A modern, responsive portfolio website for Dave Melkonian, a Senior UX and Product Designer with 15+ years of experience. Features design work showcase, articles, music player, interactive animations, and multiple specialized pages.",
          version: "0.1.0",
          framework: "React + TypeScript + Vite",
          styling: "Tailwind CSS + Framer Motion",
          deployment: "Netlify (frontend) + Python FastAPI (backend)",
        },
        architecture: {
          frontend: {
            framework: "React 18",
            language: "TypeScript",
            buildTool: "Vite",
            routing: "React Router DOM v7",
            stateManagement: "React Hooks (useState, useEffect, useContext)",
            animations: "Framer Motion",
            styling: "Tailwind CSS",
            uiComponents: "Radix UI + Custom Components",
            forms: "React Hook Form + Zod validation",
            icons: "Lucide React + Radix UI Icons",
          },
          backend: {
            platform: "Python FastAPI",
            database: "SQLite with SQLAlchemy ORM",
            authentication: "JWT tokens",
            storage: "SQLite database + LocalStorage for frontend preferences",
            apis: "RSS proxy, content management, admin panel",
          },
          deployment: {
            platform: "Netlify (frontend), Local/Cloud (backend)",
            staticSite: true,
            serviceWorker: true,
            adminPanel: "FastAPI backend with HTML admin interface",
          },
        },
        siteStructure: {
          mainPage: {
            path: "/",
            sections: content.navigation.links
              .filter((link) => link.id !== "design-system")
              .map((link) => ({
                id: link.id,
                text: link.text,
              })),
          },
          specializedPages: {
            "/json": {
              title: "JSON AI Prompts",
              description: "Structured AI prompt engineering examples",
              features: ["Current site specification", "Application examples"],
            },
            "/specs": {
              title: "Technical Specifications",
              description:
                "Complete technical stack and methodology documentation",
              sections: [
                "Technology Stack",
                "Development Methodologies",
                "Key Features",
                "Performance Metrics",
              ],
            },
            "/music": {
              title: "Music Player",
              description:
                "Full-featured audio player with instrumental tracks",
              features: [
                "18 tracks",
                "8 instrumental versions",
                "Playlist management",
              ],
            },
            "/news": {
              title: "News Aggregator",
              description: "RSS feed aggregator with category filtering",
              sources: [
                "Ars Technica",
                "Reuters",
                "Breitbart",
                "Lambgoat",
                "No Echo",
              ],
            },
            "/archive": {
              title: "Articles Archive",
              description: "Complete archive of all articles with search",
            },
            "/login": {
              title: "Admin Login",
              description: "Backend admin panel login page",
            },
          },
        },
        contentManagement: {
          structure: {
            contentFile: "src/content.ts",
            types: [
              "Articles",
              "Work Projects",
              "Current Projects",
              "Testimonials",
              "Stories",
              "Career Positions",
              "Social Links",
              "Navigation Links",
            ],
            visibilityControls: "Granular show/hide for all content types",
          },
          adminPanel: {
            status: "Active - Python FastAPI backend",
            url: "http://localhost:8000/admin",
            features: [
              "Real-time content management via web UI",
              "CRUD operations for all content types",
              "JWT authentication",
              "Database persistence with SQLite",
              "Import from content.ts file",
            ],
          },
          storageSystem: {
            type: "SQLite database (backend) + LocalStorage (frontend)",
            features: [
              "Persistent settings",
              "Content preferences",
              "Migration system",
              "Import/export functionality",
            ],
          },
        },
        contentCounts: {
          currentProjects: content.currentProjects.projects.length,
          workProjects: content.work.projects.length,
          articles: content.articles.items.length,
          stories: content.stories.items.length,
          careerPositions: content.career.positions.length,
          testimonials: content.testimonials.items.length,
          navigationLinks: content.navigation.links.filter(
            (link) => link.id !== "design-system"
          ).length,
          socialLinks: Object.keys(content.navigation.social).length,
        },
        keyFeatures: {
          navigation: {
            type: "Single Page Application with smooth scrolling",
            mobileMenu: "Responsive mobile tray menu",
            themeToggle: "Dark/Light mode switching",
            backNavigation: "Consistent back navigation on all pages",
            hiddenSections: [
              "Design System section and navigation link are hidden",
            ],
          },
          animations: {
            type: "SVG-based animations with Framer Motion",
            carousel: {
              description: "Video card carousel with animated transitions",
              slides: [
                "Axonometric Projection (rotating 3D cube)",
                "Observed Rhythm (flowing waves and pulsing dots)",
              ],
              navigation: "Previous/Next buttons",
              autoPlay: false,
            },
            pageTransitions: "Smooth page transitions with motion",
            scrollAnimations: "Scroll-triggered animations throughout",
          },
          musicPlayer: {
            description: "Full-featured audio player with instrumental tracks",
            features: [
              "Play/pause controls",
              "Volume control",
              "Progress bar",
              "Track switching",
              "Instrumental version toggle",
              "Playlist management",
            ],
            audioFormats: "MP3",
            trackCount: 18,
            instrumentalTracks: 8,
          },
          rssAggregator: {
            description: "News feed aggregator with multiple sources",
            features: [
              "Category filtering",
              "Search functionality",
              "Responsive design",
            ],
            sources: 5,
            categories: [
              "Technology",
              "Sports",
              "Business",
              "Entertainment",
              "Food",
              "Politics",
            ],
          },
        },
        designSystem: {
          typography: {
            primaryFont: "DM Sans",
            fontWeights: ["300", "400", "500", "600", "700"],
            fontSizes: {
              xs: "0.75rem",
              sm: "0.875rem",
              base: "1rem",
              lg: "1.125rem",
              xl: "1.25rem",
              "2xl": "1.5rem",
              "3xl": "1.875rem",
              "4xl": "2.25rem",
              "5xl": "3rem",
              hero: "clamp(6rem, 15vw, 16rem)",
              display: "clamp(8rem, 20vw, 24rem)",
            },
          },
          colors: {
            light: {
              background: "white",
              text: "gray-900",
              muted: "gray-600",
            },
            dark: {
              background: "gray-900",
              text: "white",
              muted: "gray-300",
            },
            accent: {
              primary: "#ff6b6b",
              secondary: "#4ecdc4",
              tertiary: "#45b7d1",
            },
          },
          components: {
            uiLibrary: "Radix UI primitives",
            customComponents: "Built on top of Radix UI",
            formComponents: "React Hook Form integration",
            iconSystem: "Lucide React + Radix UI Icons",
          },
        },
        performance: {
          optimizations: {
            lazyLoading: "React.lazy for route-based code splitting",
            imageOptimization: "SVG animations for lightweight graphics",
            audioOptimization: "MP3 format for web compatibility",
            bundleSplitting: "Separate chunks for different page types",
          },
          caching: {
            serviceWorker: "Offline functionality",
            staticAssets: "Long-term caching for images and audio",
            localStorage: "Persistent user preferences and settings",
          },
          accessibility: {
            ariaLabels: "Comprehensive ARIA labeling",
            keyboardNavigation: "Full keyboard support",
            screenReader: "Screen reader compatibility",
            colorContrast: "WCAG compliant color contrast",
          },
        },
        developmentWorkflow: {
          buildTools: {
            bundler: "Vite",
            typeChecking: "TypeScript",
            linting: "ESLint",
            formatting: "Prettier",
          },
          database: {
            backend: "SQLite with SQLAlchemy ORM",
            migrations: "SQLAlchemy Alembic (if needed)",
            adminInterface: "FastAPI admin panel with HTML UI",
          },
          deployment: {
            platform: "Netlify (frontend)",
            backend: "Python FastAPI (local or cloud deployment)",
            environment: "Environment-specific configuration",
          },
        },
      },
      null,
      2
    );

    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="py-4 sm:py-4xl:py-4 relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {/* Hero Content */}
            <div className="pt-4 rounded-lg">
              {/* Back Navigation */}
              <Link
                to="/"
                onClick={handleBackClick}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8 relative z-50"
              >
                <Suspense fallback={<span className="h-4 w-4 mr-2">←</span>}>
                  <LazyArrowLeft className="h-4 w-4 mr-2" />
                </Suspense>
                Back to Portfolio
              </Link>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: 0.2 }}
                className="mb-6 sm:mb-8"
              >
                <h1 className="text-5xl font-bold mb-1 title-font leading-none relative z-10 text-left">
                  {content.siteInfo.subtitle}
                </h1>
              </motion.div>

              {/* Navigation Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: 0.4 }}
                className="hidden lg:flex flex-wrap justify-start gap-2 sm:gap-3 mb-2 sm:mb-4"
              >
                {content.navigation.links
                  .filter((link) => link.id !== "design-system")
                  .map((link) => (
                    <button
                      key={link.id}
                      onClick={() => {
                        navigate("/");
                        // Wait for navigation to complete before scrolling
                        setTimeout(() => {
                          const element = document.getElementById(link.id);
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                            });
                          }
                        }, 100);
                      }}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {link.text}
                    </button>
                  ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON AI Prompts Content */}
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            <Suspense
              fallback={
                <div className="min-h-screen bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                  </div>
                </div>
              }
            >
              {/* Project Hero Section */}
              <section className="relative flex flex-col justify-center min-h-[120px] sm:min-h-[160px] pt-4 sm:pt-6 lg:pt-8">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
                  {/* Two-column layout: Left content + Right animation card */}
                  <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                    {/* Left Column: Title, Summary */}
                    <div className="flex flex-col items-start flex-1">
                      {/* Project Title */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.8, delay: 0.2 }}
                        className="mb-6 sm:mb-8"
                      >
                        <h2
                          className="text-[clamp(1.5rem,4vw,3rem)] font-bold mb-1 title-font leading-none relative z-10 text-left"
                          style={{ letterSpacing: "-0.06em" }}
                        >
                          JSON AI Prompts
                        </h2>
                      </motion.div>

                      {/* Summary Text */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.8, delay: 0.6 }}
                        className="mt-4 sm:mt-6"
                      >
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-left font-['DM_Sans']">
                          A comprehensive system for creating structured AI
                          prompts using JSON format. This project explores the
                          intersection of data structure design and artificial
                          intelligence, providing a framework for consistent,
                          scalable prompt engineering. Features include template
                          management, variable substitution, and validation
                          systems for reliable AI interactions.
                        </p>
                      </motion.div>
                    </div>

                    {/* Animation Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.8, delay: 0.8 }}
                      className="hidden md:block w-[352px]"
                    >
                      <div className="relative overflow-hidden h-[350px] group rounded-lg shadow-lg">
                        {/* Animation Background */}
                        <div className="absolute inset-0 z-0 p-2">
                          <img
                            src={`/img/json-ai-prompts-animation.svg?v=${Date.now()}`}
                            alt="JSON AI Prompts Animation"
                            className="absolute inset-0 h-full w-full object-contain object-bottom"
                          />
                        </div>

                        {/* Card Content */}
                        <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                          <div className="rounded-lg p-2 bg-white/40 dark:bg-transparent backdrop-blur-sm pr-12">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                  <h3
                                    className="text-[18px] font-semibold mb-1 title-font text-black dark:text-white whitespace-nowrap"
                                    style={{
                                      letterSpacing: "-0.01em",
                                    }}
                                  >
                                    JSON AI Prompts
                                  </h3>
                                </div>
                              </div>

                              {/* Colored balls for the card */}
                              <div
                                className="flex items-center gap-1 mt-1 mb-[10px]"
                                role="presentation"
                              >
                                {[
                                  "#6366f1", // Indigo - primary
                                  "#a5b4fc", // Indigo Light - subtle
                                  "#4f46e5", // Indigo Dark - depth
                                  "#c7d2fe", // Indigo Lighter - soft
                                  "#3730a3", // Indigo Darker - sophisticated
                                  "#06b6d4", // Cyan - third color
                                ].map((color, i) => (
                                  <span
                                    key={i}
                                    role="presentation"
                                    aria-hidden="true"
                                    style={{
                                      display: "inline-block",
                                      width: 12,
                                      height: 12,
                                      borderRadius: "50%",
                                      background: `radial-gradient(circle at 70% 70%, ${color} 0%, ${color} 60%, ${color}dd 100%)`,
                                      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Current Site Specification */}
              <section className="py-12 sm:py-16 lg:py-20">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 1.0 }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 title-font">
                      Current Site Specification
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                      This JSON structure represents the current state of the
                      Dave Melkonian portfolio site:
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 1.2 }}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 overflow-x-auto relative"
                  >
                    {/* Copy Button */}
                    <button
                      onClick={handleCopyJson}
                      className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                      title={copied ? "Copied!" : "Copy JSON"}
                    >
                      {copied ? (
                        <Suspense fallback={<span className="h-4 w-4 text-green-600 dark:text-green-400">✓</span>}>
                          <LazyCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </Suspense>
                      ) : (
                        <Suspense fallback={<span className="h-4 w-4 text-gray-600 dark:text-gray-400">📋</span>}>
                          <LazyCopy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </Suspense>
                      )}
                    </button>
                    <pre className="text-xs sm:text-sm font-mono text-gray-800 dark:text-gray-200 leading-relaxed pt-8">
                      {JSON.stringify(
                        {
                          application: {
                            name: "Dave Melkonian Portfolio",
                            type: "Personal Portfolio Website",
                            description:
                              "A modern, responsive portfolio website for Dave Melkonian, a Senior UX and Product Designer with 15+ years of experience. Features design work showcase, articles, music player, interactive animations, and multiple specialized pages.",
                            version: "0.1.0",
                            framework: "React + TypeScript + Vite",
                            styling: "Tailwind CSS + Framer Motion",
                            deployment:
                              "Netlify (frontend) + Python FastAPI (backend)",
                          },
                          architecture: {
                            frontend: {
                              framework: "React 18",
                              language: "TypeScript",
                              buildTool: "Vite",
                              routing: "React Router DOM v7",
                              stateManagement:
                                "React Hooks (useState, useEffect, useContext)",
                              animations: "Framer Motion",
                              styling: "Tailwind CSS",
                              uiComponents: "Radix UI + Custom Components",
                              forms: "React Hook Form + Zod validation",
                              icons: "Lucide React + Radix UI Icons",
                            },
                            backend: {
                              platform: "Python FastAPI",
                              database: "SQLite with SQLAlchemy ORM",
                              authentication: "JWT tokens",
                              storage:
                                "SQLite database + LocalStorage for frontend preferences",
                              apis: "RSS proxy, content management, admin panel",
                            },
                            deployment: {
                              platform:
                                "Netlify (frontend), Local/Cloud (backend)",
                              staticSite: true,
                              serviceWorker: true,
                              adminPanel:
                                "FastAPI backend with HTML admin interface",
                            },
                          },
                          siteStructure: {
                            mainPage: {
                              path: "/",
                              sections: content.navigation.links
                                .filter((link) => link.id !== "design-system")
                                .map((link) => ({
                                  id: link.id,
                                  text: link.text,
                                })),
                            },
                            specializedPages: {
                              "/json": {
                                title: "JSON AI Prompts",
                                description:
                                  "Structured AI prompt engineering examples",
                                features: [
                                  "Current site specification",
                                  "Application examples",
                                ],
                              },
                              "/specs": {
                                title: "Technical Specifications",
                                description:
                                  "Complete technical stack and methodology documentation",
                                sections: [
                                  "Technology Stack",
                                  "Development Methodologies",
                                  "Key Features",
                                  "Performance Metrics",
                                ],
                              },
                              "/news": {
                                title: "News Aggregator",
                                description:
                                  "RSS feed aggregator with category filtering",
                                sources: [
                                  "Ars Technica",
                                  "Reuters",
                                  "Breitbart",
                                  "Lambgoat",
                                  "No Echo",
                                ],
                              },
                              "/archive": {
                                title: "Articles Archive",
                                description:
                                  "Complete archive of all articles with search",
                              },
                              "/login": {
                                title: "Admin Login",
                                description: "Backend admin panel login page",
                              },
                            },
                          },
                          contentManagement: {
                            structure: {
                              contentFile: "src/content.ts",
                              types: [
                                "Articles",
                                "Work Projects",
                                "Current Projects",
                                "Testimonials",
                                "Stories",
                                "Career Positions",
                                "Social Links",
                                "Navigation Links",
                              ],
                              visibilityControls:
                                "Granular show/hide for all content types",
                            },
                            adminPanel: {
                              status: "Active - Python FastAPI backend",
                              url: ADMIN_PANEL_URL,
                              features: [
                                "Real-time content management via web UI",
                                "CRUD operations for all content types",
                                "JWT authentication",
                                "Database persistence with SQLite",
                                "Import from content.ts file",
                              ],
                            },
                            storageSystem: {
                              type: "SQLite database (backend) + LocalStorage (frontend)",
                              features: [
                                "Persistent settings",
                                "Content preferences",
                                "Migration system",
                                "Import/export functionality",
                              ],
                            },
                          },
                          contentCounts: {
                            currentProjects:
                              content.currentProjects.projects.length,
                            workProjects: content.work.projects.length,
                            articles: content.articles.items.length,
                            stories: content.stories.items.length,
                            careerPositions: content.career.positions.length,
                            testimonials: content.testimonials.items.length,
                            navigationLinks: content.navigation.links.filter(
                              (link) => link.id !== "design-system"
                            ).length,
                            socialLinks: Object.keys(content.navigation.social)
                              .length,
                          },
                          keyFeatures: {
                            navigation: {
                              type: "Single Page Application with smooth scrolling",
                              mobileMenu: "Responsive mobile tray menu",
                              themeToggle: "Dark/Light mode switching",
                              backNavigation:
                                "Consistent back navigation on all pages",
                              hiddenSections: [
                                "Design System section and navigation link are hidden",
                              ],
                            },
                            animations: {
                              type: "SVG-based animations with Framer Motion",
                              carousel: {
                                description:
                                  "Video card carousel with animated transitions",
                                slides: [
                                  "Axonometric Projection (rotating 3D cube)",
                                  "Observed Rhythm (flowing waves and pulsing dots)",
                                ],
                                navigation: "Previous/Next buttons",
                                autoPlay: false,
                              },
                              pageTransitions:
                                "Smooth page transitions with motion",
                              scrollAnimations:
                                "Scroll-triggered animations throughout",
                            },
                            rssAggregator: {
                              description:
                                "News feed aggregator with multiple sources",
                              features: [
                                "Category filtering",
                                "Search functionality",
                                "Responsive design",
                              ],
                              sources: 5,
                              categories: [
                                "Technology",
                                "Sports",
                                "Business",
                                "Entertainment",
                                "Food",
                                "Politics",
                              ],
                            },
                          },
                          designSystem: {
                            typography: {
                              primaryFont: "DM Sans",
                              fontWeights: ["300", "400", "500", "600", "700"],
                              fontSizes: {
                                xs: "0.75rem",
                                sm: "0.875rem",
                                base: "1rem",
                                lg: "1.125rem",
                                xl: "1.25rem",
                                "2xl": "1.5rem",
                                "3xl": "1.875rem",
                                "4xl": "2.25rem",
                                "5xl": "3rem",
                                hero: "clamp(6rem, 15vw, 16rem)",
                                display: "clamp(8rem, 20vw, 24rem)",
                              },
                            },
                            colors: {
                              light: {
                                background: "white",
                                text: "gray-900",
                                muted: "gray-600",
                              },
                              dark: {
                                background: "gray-900",
                                text: "white",
                                muted: "gray-300",
                              },
                              accent: {
                                primary: "#ff6b6b",
                                secondary: "#4ecdc4",
                                tertiary: "#45b7d1",
                              },
                            },
                            components: {
                              uiLibrary: "Radix UI primitives",
                              customComponents: "Built on top of Radix UI",
                              formComponents: "React Hook Form integration",
                              iconSystem: "Lucide React + Radix UI Icons",
                            },
                          },
                          performance: {
                            optimizations: {
                              lazyLoading:
                                "React.lazy for route-based code splitting",
                              imageOptimization:
                                "SVG animations for lightweight graphics",
                              audioOptimization:
                                "MP3 format for web compatibility",
                              bundleSplitting:
                                "Separate chunks for different page types",
                            },
                            caching: {
                              serviceWorker: "Offline functionality",
                              staticAssets:
                                "Long-term caching for images and audio",
                              localStorage:
                                "Persistent user preferences and settings",
                            },
                            accessibility: {
                              ariaLabels: "Comprehensive ARIA labeling",
                              keyboardNavigation: "Full keyboard support",
                              screenReader: "Screen reader compatibility",
                              colorContrast: "WCAG compliant color contrast",
                            },
                          },
                          developmentWorkflow: {
                            buildTools: {
                              bundler: "Vite",
                              typeChecking: "TypeScript",
                              linting: "ESLint",
                              formatting: "Prettier",
                            },
                            database: {
                              backend: "SQLite with SQLAlchemy ORM",
                              migrations: "SQLAlchemy Alembic (if needed)",
                              adminInterface:
                                "FastAPI admin panel with HTML UI",
                            },
                            deployment: {
                              platform: "Netlify (frontend)",
                              backend:
                                "Python FastAPI (local or cloud deployment)",
                              environment: "Environment-specific configuration",
                            },
                          },
                        },
                        null,
                        2
                      )}
                    </pre>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 1.4 }}
                    className="mt-8 text-center"
                  >
                    <p className="text-sm text-muted-foreground">
                      This comprehensive JSON specification captures the current
                      state of the Dave Melkonian portfolio site, including all
                      features, architecture, content structure, and technical
                      implementation details. It serves as a complete reference
                      for understanding, maintaining, and extending the
                      application.
                    </p>
                  </motion.div>
                </div>
              </section>
            </Suspense>
          </div>
        </div>
      </section>
      <MobileTrayMenu />
    </div>
  );
};

export default JsonAiPrompts;
