import React, { useState, useEffect } from "react";

import { content } from "./content";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { StoreProvider } from "./context/StoreContext";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load components
const Article = lazy(() => import("./pages/Article"));
const Archive = lazy(() => import("./pages/Archive"));

const JsonAiPrompts = lazy(() => import("./pages/JsonAiPrompts"));
const AudioTranscript = lazy(() => import("./pages/AudioTranscript"));
const NewsAggregator = lazy(() => import("./pages/NewsAggregator"));
const Specs = lazy(() => import("./pages/Specs"));
const Story = lazy(() => import("./pages/Story"));
const MusicPlayer = lazy(() => import("./pages/MusicPlayer"));
const Store = lazy(() => import("./pages/Store"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));

// Lazy load non-critical UI components to reduce critical path
const MobileTrayMenu = lazy(() => import("./components/MobileTrayMenu"));
const Footer = lazy(() =>
  import("./components/Footer").then((module) => ({ default: module.Footer }))
);

import { slugify } from "./utils/slugify";
import { getOptimizedImage } from "./utils/imageOptimizer";
import {
  getCardImageProps,
  getThumbnailImageProps,
} from "./utils/imageOptimizer";

// Lazy load icons to reduce initial bundle size
const LazyArrowUp = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ArrowUp }))
);
const LazyLayoutGrid = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.LayoutGrid }))
);
const LazyList = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.List }))
);
const LazyExternalLink = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ExternalLink }))
);
const LazyDribbble = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Dribbble }))
);
const LazyLinkedInLogoIcon = React.lazy(() =>
  import("@radix-ui/react-icons").then((mod) => ({
    default: mod.LinkedInLogoIcon,
  }))
);

// Lazy load ArticleModal
const ArticleModal = lazy(() => import("./components/ArticleModal"));

// Icon wrapper with Suspense
const IconWrapper = ({
  Icon,
  className,
  fallback = "↗",
}: {
  Icon: React.LazyExoticComponent<React.ComponentType<any>>;
  className?: string;
  fallback?: string;
}) => (
  <React.Suspense fallback={<span className={className}>{fallback}</span>}>
    <Icon className={className} />
  </React.Suspense>
);

// Add SectionHeader component
const SectionHeader = ({
  title,
  subtitle,
  className = "",
  showArchiveLink = false,
  showUpArrow = false,
  toggleView,
  viewMode,
  icon,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  showArchiveLink?: boolean;
  showUpArrow?: boolean;
  toggleView?: (mode: "grid" | "list") => void;
  viewMode?: "grid" | "list";
  icon?: React.ReactNode;
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-4xl font-bold title-font leading-tight text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-black text-white dark:bg-white/10 dark:text-white rounded-full shadow-lg hover:opacity-80 transition-opacity flex-shrink-0 flex items-center justify-center w-8 h-8 p-0 min-w-8 min-h-8"
            aria-label="Scroll to top"
          >
            <IconWrapper
              Icon={LazyArrowUp}
              className="h-4 w-4 m-0 flex-shrink-0"
            />
          </button>
          {icon && <div className="flex items-center gap-2">{icon}</div>}
          {showUpArrow && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-black text-white dark:bg-white/10 dark:text-white p-2 rounded-full shadow-lg hover:opacity-80 transition-opacity"
              aria-label="Scroll to top"
            >
              <IconWrapper
                Icon={LazyArrowUp}
                className="h-4 w-4 text-white dark:text-white"
              />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {toggleView && (
            <div className="flex items-center gap-1 ml-0 sm:ml-2">
              <button
                aria-label="Grid view"
                className={`p-2 rounded-md border transition-colors flex items-center justify-center ${
                  viewMode === "grid"
                    ? "bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500"
                    : "bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => toggleView("grid")}
              >
                <IconWrapper Icon={LazyLayoutGrid} className="h-4 w-4" />
              </button>
              <button
                aria-label="List view"
                className={`p-2 rounded-md border transition-colors flex items-center justify-center ${
                  viewMode === "list"
                    ? "bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500"
                    : "bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => toggleView("list")}
              >
                <IconWrapper Icon={LazyList} className="h-4 w-4" />
              </button>
            </div>
          )}
          {showArchiveLink && (
            <Link
              to="/archive"
              className="text-nav text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm sm:text-base"
            >
              View Archive
            </Link>
          )}
        </div>
      </div>
      {subtitle && (
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 lg:mb-10">
          {subtitle}
        </p>
      )}
    </div>
  );
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedArticle, setSelectedArticle] = useState<{
    title: string;
    content: string;
    image?: string;
    date?: string;
  } | null>(null);
  const [selectedStory, setSelectedStory] = useState<{
    title: string;
    content: string;
    subtitle?: string;
  } | null>(null);

  const [currentViewMode, setCurrentViewMode] = useState<"list" | "grid">(
    "grid"
  );
  const [designViewMode, setDesignViewMode] = useState<"list" | "grid">("grid");
  const [labViewMode, setLabViewMode] = useState<"list" | "grid">("grid");
  const [storiesViewMode, setStoriesViewMode] = useState<"list" | "grid">(
    "grid"
  );
  const [articlesViewMode, setArticlesViewMode] = useState<"list" | "grid">(
    "grid"
  );

  // Scroll to top on route change (but not for internal navigation)
  useEffect(() => {
    // Only scroll to top if we're not navigating to a specific section
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Listen for view mode changes from NewsAggregator
  useEffect(() => {
    const handleViewModeChange = (event: CustomEvent) => {
      setCurrentViewMode(event.detail);
    };

    // Defer localStorage read to avoid blocking initial render
    requestIdleCallback(
      () => {
        const savedViewMode = localStorage.getItem("viewMode") as
          | "list"
          | "grid";
        if (savedViewMode) {
          setCurrentViewMode(savedViewMode);
        }
      },
      { timeout: 100 }
    );

    window.addEventListener(
      "viewModeChanged",
      handleViewModeChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "viewModeChanged",
        handleViewModeChange as EventListener
      );
    };
  }, []);

  return (
    <div className="min-h-screen text-gray-900 transition-colors duration-300 dark:text-white pb-20 sm:pb-0 flex flex-col relative">
      {/* Remove Header Navigation from here */}

      <main className="flex-1 relative z-10">
        <Suspense fallback={null}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {/* Hero Section */}
                  <section className="py-4 sm:py-4xl:py-4 relative">
                    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <div className="grid grid-cols-1 gap-6 sm:gap-8">
                        {/* Hero Content */}
                        <div className="pt-4 rounded-lg">
                          {/* Title and Navigation Row */}
                          <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                            <div className="flex-1">
                              <h1 className="tracking-tighter text-5xl font-bold mb-1 title-font leading-none relative z-10 text-left">
                                {content.siteInfo.subtitle}
                              </h1>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden lg:flex flex-wrap justify-end gap-2 sm:gap-3 mt-2 lg:mt-0">
                              {content.navigation.links
                                .filter((link) => link.id !== "design-system")
                                .sort((a, b) => {
                                  // Define the desired order: Lab, Storytelling, Design, Articles, Career
                                  const order = [
                                    "current-projects",
                                    "stories",
                                    "work",
                                    "articles",
                                    "career",
                                  ];
                                  const indexA = order.indexOf(a.id);
                                  const indexB = order.indexOf(b.id);
                                  return (
                                    (indexA === -1 ? 999 : indexA) -
                                    (indexB === -1 ? 999 : indexB)
                                  );
                                })
                                .map((link) => (
                                  <button
                                    key={link.id}
                                    onClick={() => {
                                      const element = document.getElementById(
                                        link.id
                                      );
                                      if (element) {
                                        element.scrollIntoView({
                                          behavior: "smooth",
                                        });
                                      }
                                    }}
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    {link.text}
                                  </button>
                                ))}
                            </div>
                          </div>

                          {/* Summary Text */}
                          <div className="mt-4 sm:mt-6">
                            <p className="hero-intro text-muted-foreground text-left">
                              I'm David Melkonian, a technical product and
                              experience leader with over a decade of work at
                              the intersection of UX, front-end engineering, and
                              digital accessibility. I specialize in designing
                              and shipping full-stack web and mobile products
                              using modern stacks like React, TypeScript,
                              Next.js, Python, and FastAPI, with a strong focus
                              on scalable design systems, AI-assisted workflows,
                              vector search, and measurable impact on
                              performance and usability. I've led teams of 30+,
                              built full-stack applications with AI integration,
                              and established enterprise-wide standards for
                              processes and digital experience delivery.
                            </p>
                          </div>
                          <p className="my-4">
                            <a
                              href="https://rococo-paprenjak-da1be1.netlify.app/samples"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-900 dark:text-white hover:text-primary transition-colors inline-flex items-center gap-2 underline decoration-1 underline-offset-2 hover:decoration-2"
                            >
                              Previous Portfolio with OpenAI integration
                              <IconWrapper
                                Icon={LazyExternalLink}
                                className="w-4 h-4"
                              />
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Lab Section */}
                  <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative lab-section-narrow">
                    <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 gap-6 sm:gap-8">
                        {/* Lab Section */}
                        <div
                          id="current-projects"
                          className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent"
                        >
                          <SectionHeader
                            title={content.currentProjects.title}
                            subtitle={content.currentProjects.subtitle}
                            className="mb-6"
                            showUpArrow={false}
                            toggleView={(mode) => setLabViewMode(mode)}
                            viewMode={labViewMode}
                          />
                          {labViewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                              {content.currentProjects.projects
                                .filter(
                                  (project) =>
                                    project.title !== "Chatbots" &&
                                    project.title !== "Design Panes" &&
                                    project.title !== "HealthAware" &&
                                    project.title !== "AI NUI" &&
                                    project.title !==
                                      "Configurable Multivariate Testing"
                                )
                                .map((project, index) => (
                                  <a
                                    key={index}
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col cursor-pointer shadow-xl"
                                  >
                                    {/* Card Image */}
                                    <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-transparent">
                                      {project.title === "JSON AI Prompts" ||
                                      project.title === "User Testing Config" ||
                                      project.title === "RAG App" ? (
                                        <img
                                          src={
                                            project.title === "JSON AI Prompts"
                                              ? `/img/json-ai-prompts-animation.svg?v=${Date.now()}`
                                              : project.title ===
                                                "User Testing Config"
                                              ? `/img/user-testing-config-animation.svg?v=${Date.now()}`
                                              : project.title === "RAG App"
                                              ? `/img/rag-app-animation.svg?v=${Date.now()}`
                                              : ""
                                          }
                                          alt={project.title}
                                          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                                          loading={
                                            index === 0 ? "eager" : "lazy"
                                          }
                                          {...(index === 0
                                            ? { fetchPriority: "high" as const }
                                            : {})}
                                          decoding="async"
                                          width="512"
                                          height="512"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                          <span className="text-gray-400 dark:text-gray-500 text-sm">
                                            {(project as any).title ||
                                              "Project"}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1">
                                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                        {project.title}
                                      </h3>
                                      <p className="text-sm text-gray-600 dark:text-white line-clamp-2">
                                        {project.description}
                                      </p>
                                    </div>
                                  </a>
                                ))}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {content.currentProjects.projects
                                .filter(
                                  (project) =>
                                    project.title !== "Chatbots" &&
                                    project.title !== "Design Panes" &&
                                    project.title !== "HealthAware" &&
                                    project.title !== "AI NUI" &&
                                    project.title !==
                                      "Configurable Multivariate Testing"
                                )
                                .map((project, index) => (
                                  <a
                                    key={index}
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 p-3 rounded-lg bg-white/20 backdrop-blur-lg transition-all cursor-pointer shadow-xl"
                                  >
                                    {/* Compact Image */}
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded bg-transparent">
                                      {project.title === "JSON AI Prompts" ||
                                      project.title === "User Testing Config" ||
                                      project.title === "RAG App" ? (
                                        <img
                                          src={
                                            project.title === "JSON AI Prompts"
                                              ? `/img/json-ai-prompts-animation.svg?v=${Date.now()}`
                                              : project.title ===
                                                "User Testing Config"
                                              ? `/img/user-testing-config-animation.svg?v=${Date.now()}`
                                              : project.title === "RAG App"
                                              ? `/img/rag-app-animation.svg?v=${Date.now()}`
                                              : ""
                                          }
                                          alt={project.title}
                                          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                                          loading="lazy"
                                          decoding="async"
                                          width="512"
                                          height="512"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                          <span className="text-gray-400 dark:text-gray-500 text-xs">
                                            {(project as any).title ||
                                              "Project"}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Compact Content */}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                        {project.title}
                                      </h3>
                                      <p className="text-sm text-gray-600 dark:text-white line-clamp-1 mt-1">
                                        {project.description}
                                      </p>
                                    </div>

                                    {/* External Link Icon */}
                                    <IconWrapper
                                      Icon={LazyExternalLink}
                                      className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0"
                                    />
                                  </a>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Testimonials Section */}
                  {/**
                <section id="testimonials" className="py-12 sm:py-16 lg:py-20">
                  <div className="max-w-[1000px] mx-auto px-4 sm:px-8">
                    <SectionHeader
                      title={content.testimonials.title}
                      subtitle={content.testimonials.subtitle}
                      className="mb-8 sm:mb-16"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {content.testimonials.items.map((testimonial, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-lg bg-gray-100/80 shadow-md p-6"
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 dark:text-gray-700 leading-relaxed mb-4 italic">
                                "{testimonial.quote}"
                              </p>
                            </div>
                            <div className="mt-auto">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {testimonial.author}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                */}

                  {/* Storytelling Section */}
                  <section
                    id="stories"
                    className="py-4 sm:py-6 lg:py-8 xl:py-12 relative"
                  >
                    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
                        <SectionHeader
                          title={content.stories.title}
                          subtitle={content.stories.subtitle}
                          className="mb-8"
                          toggleView={(mode) => setStoriesViewMode(mode)}
                          viewMode={storiesViewMode}
                        />
                        {storiesViewMode === "grid" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {content.stories.items
                              .filter(
                                (story) => story.title !== "Design Management"
                              )
                              .map((story) => (
                                <div
                                  key={story.title}
                                  onClick={() => {
                                    if (story.hasModal) {
                                      setSelectedStory({
                                        title: story.title,
                                        content: story.content,
                                        subtitle: story.subtitle,
                                      });
                                    }
                                  }}
                                  className={`group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col shadow-xl hover:shadow-2xl transition-shadow ${
                                    story.hasModal ? "cursor-pointer" : ""
                                  }`}
                                >
                                  {/* Card Image */}
                                  <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-transparent">
                                    {story.image ? (
                                      <img
                                        {...getCardImageProps(story.image)}
                                        alt={story.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                                          No image
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Card Content */}
                                  <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                      {story.title}
                                    </h3>
                                    {story.subtitle && (
                                      <p className="text-sm text-gray-600 dark:text-white line-clamp-2">
                                        {story.subtitle}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {content.stories.items
                              .filter(
                                (story) => story.title !== "Design Management"
                              )
                              .map((story) => (
                                <div
                                  key={story.title}
                                  onClick={() => {
                                    if (story.hasModal) {
                                      setSelectedStory({
                                        title: story.title,
                                        content: story.content,
                                        subtitle: story.subtitle,
                                      });
                                    }
                                  }}
                                  className={`group flex items-center gap-4 p-3 rounded-lg bg-white/20 backdrop-blur-lg transition-all shadow-xl hover:shadow-2xl ${
                                    story.hasModal ? "cursor-pointer" : ""
                                  }`}
                                >
                                  {/* Compact Image */}
                                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded bg-transparent">
                                    {story.image ? (
                                      <img
                                        {...getThumbnailImageProps(story.image)}
                                        alt={story.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                                          No image
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Compact Content */}
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                      {story.title}
                                    </h3>
                                    {story.subtitle && (
                                      <p className="text-sm text-gray-600 dark:text-white line-clamp-1 mt-1">
                                        {story.subtitle}
                                      </p>
                                    )}
                                  </div>

                                  {/* External Link Icon (only show if clickable) */}
                                  {story.hasModal && (
                                    <IconWrapper
                                      Icon={LazyExternalLink}
                                      className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0"
                                    />
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Design Section */}
                  <section
                    id="work"
                    className="py-4 sm:py-6 lg:py-8 xl:py-12 relative"
                  >
                    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
                        <SectionHeader
                          title="Design"
                          subtitle={content.work.subtitle}
                          className="mb-6"
                          showArchiveLink={false}
                          toggleView={(mode) => setDesignViewMode(mode)}
                          viewMode={designViewMode}
                          icon={
                            <a
                              href={content.navigation.social.dribbble.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                              aria-label="Dribbble"
                            >
                              <IconWrapper
                                Icon={LazyDribbble}
                                className="h-5 w-5 text-black dark:text-white"
                              />
                            </a>
                          }
                        />
                        {designViewMode === "grid" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {content.work.projects
                              .filter(
                                (project: any) =>
                                  project.title !== "3D Conversion UX Plan"
                              )
                              .map((project: any, index) => (
                                <a
                                  key={index}
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                                >
                                  {/* Card Image */}
                                  <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-transparent">
                                    <img
                                      {...getCardImageProps(project.image)}
                                      alt={project.alt || project.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </div>

                                  {/* Card Content */}
                                  <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                      {project.title}
                                    </h3>
                                    {project.description && (
                                      <p className="text-sm text-gray-600 dark:text-white line-clamp-2">
                                        {project.description}
                                      </p>
                                    )}
                                  </div>
                                </a>
                              ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {content.work.projects
                              .filter(
                                (project: any) =>
                                  project.title !== "3D Conversion UX Plan"
                              )
                              .map((project: any, index) => (
                                <a
                                  key={index}
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center gap-4 p-3 rounded-lg bg-white/20 backdrop-blur-lg hover:shadow-xl transition-all cursor-pointer shadow-xl"
                                >
                                  {/* Compact Image */}
                                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded bg-transparent">
                                    <img
                                      {...getThumbnailImageProps(project.image)}
                                      alt={project.alt || project.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </div>

                                  {/* Compact Content */}
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                      {project.title}
                                    </h3>
                                    {project.description && (
                                      <p className="text-sm text-gray-600 dark:text-white line-clamp-1 mt-1">
                                        {project.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* External Link Icon */}
                                  <IconWrapper
                                    Icon={LazyExternalLink}
                                    className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0"
                                  />
                                </a>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Articles Section */}
                  <section
                    id="articles"
                    className="py-4 sm:py-6 lg:py-8 xl:py-12 relative"
                  >
                    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
                        <SectionHeader
                          title="Articles"
                          subtitle={content.articles.subtitle}
                          className="mb-6"
                          showArchiveLink={false}
                          toggleView={(mode) => setArticlesViewMode(mode)}
                          viewMode={articlesViewMode}
                          icon={
                            <a
                              href="https://davemelk.substack.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                              aria-label="Substack"
                            >
                              <svg
                                className="h-5 w-5 text-black"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                              </svg>
                            </a>
                          }
                        />
                        {articlesViewMode === "grid" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {content.articles.items
                              .filter(
                                (article) =>
                                  article.title !== "Commit Message Fatigue" &&
                                  article.title !==
                                    "Information Architecture Is Not Sacred" &&
                                  article.title !==
                                    "AI is hydrated with user research data" &&
                                  article.title !==
                                    "Prompting for Heuristic Evaluations" &&
                                  article.title !==
                                    "Vibe Coding v Vibe Engineering"
                              )
                              .sort(
                                (a, b) =>
                                  new Date(b.date).getTime() -
                                  new Date(a.date).getTime()
                              )
                              .map((article, index) => {
                                const handleClick = () => {
                                  if (article.url.startsWith("http")) {
                                    window.open(
                                      article.url,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  } else {
                                    navigate(
                                      `/article/${slugify(article.title)}`
                                    );
                                  }
                                };

                                return (
                                  <div
                                    key={index}
                                    onClick={handleClick}
                                    className="group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                                  >
                                    {/* Card Image */}
                                    <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-transparent">
                                      <img
                                        {...getCardImageProps(
                                          (article as any).cardImage ||
                                            article.image
                                        )}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1">
                                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                        {article.title}
                                      </h3>
                                      {article.description && (
                                        <p className="text-sm text-gray-600 dark:text-white line-clamp-2">
                                          {article.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {content.articles.items
                              .filter(
                                (article) =>
                                  article.title !== "Commit Message Fatigue" &&
                                  article.title !==
                                    "Information Architecture Is Not Sacred" &&
                                  article.title !==
                                    "AI is hydrated with user research data" &&
                                  article.title !==
                                    "Prompting for Heuristic Evaluations" &&
                                  article.title !==
                                    "Vibe Coding v Vibe Engineering"
                              )
                              .sort(
                                (a, b) =>
                                  new Date(b.date).getTime() -
                                  new Date(a.date).getTime()
                              )
                              .map((article, index) => {
                                const handleClick = () => {
                                  if (article.url.startsWith("http")) {
                                    window.open(
                                      article.url,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  } else {
                                    navigate(
                                      `/article/${slugify(article.title)}`
                                    );
                                  }
                                };

                                return (
                                  <div
                                    key={index}
                                    onClick={handleClick}
                                    className="group flex items-center gap-4 p-3 rounded-lg bg-white/20 backdrop-blur-lg transition-all cursor-pointer shadow-xl hover:shadow-2xl"
                                  >
                                    {/* Compact Image */}
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded bg-transparent">
                                      <img
                                        {...getThumbnailImageProps(
                                          (article as any).cardImage ||
                                            article.image
                                        )}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    </div>

                                    {/* Compact Content */}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                        {article.title}
                                      </h3>
                                      {article.description && (
                                        <p className="text-sm text-gray-600 dark:text-white line-clamp-1 mt-1">
                                          {article.description}
                                        </p>
                                      )}
                                    </div>

                                    {/* External Link Icon */}
                                    <IconWrapper
                                      Icon={LazyExternalLink}
                                      className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0"
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Career Timeline Section */}
                  <section
                    id="career"
                    className="py-4 sm:py-6 lg:py-8 xl:py-12 relative"
                  >
                    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                      <SectionHeader
                        title={content.career.title}
                        subtitle={content.career.subtitle}
                        className="mb-8 sm:mb-6"
                        icon={
                          <a
                            href={content.navigation.social.linkedin.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                            aria-label="LinkedIn"
                          >
                            <IconWrapper
                              Icon={LazyLinkedInLogoIcon}
                              className="h-5 w-5 text-black"
                            />
                          </a>
                        }
                      />
                      <div className="space-y-8">
                        {content.career.positions.map((position) => (
                          <div
                            key={position.title + position.period}
                            className=""
                          >
                            <h3 className="text-lg font-semibold mb-1 dark:text-white title-font">
                              {position.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 font-medium">
                              {position.company}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              {position.period}
                            </p>
                            {Array.isArray(position.description) ? (
                              <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                                {position.description.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {position.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      {/* Certifications & Education */}
                      <div className="mt-4 pt-2 max-w-3xl">
                        <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                          Certifications
                        </h3>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                          <li>Certified ScrumMaster (Scrum Alliance)</li>
                          <li>
                            Certified Usability Analyst (Human Factors
                            International)
                          </li>
                          <li>ITIL Foundation Certificate (Axelos)</li>
                        </ul>
                        <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                          Education
                        </h3>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                          <li>Oakland University | Rochester MI</li>
                          <li>Bachelor of Arts in English</li>
                          <li>Minor in Public Relations</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Personal Section */}
                  {/* <section id="personal" className="py-12 sm:py-16 lg:py-20">
                  <div className="max-w-[1000px] mx-auto px-4 sm:px-8">
                    <SectionHeader
                      title="Personal"
                      subtitle="Personal projects and interests"
                      className="mb-8"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div
                        className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[3/4]"
                      >
                        <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                          <div className="pr-12 flex items-center gap-2">
                            <h3
                              className="text-[20px] font-semibold mb-0 text-black dark:text-white title-font"
                            >
                              Violet
                            </h3>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <p className="text-base text-gray-600 dark:text-gray-300 mb-1 flex-1">
                              My amazing daughter with another line drive for a
                              base hit
                            </p>
                          </div>
                        </div>
                        <div className="absolute inset-0 overflow-hidden z-0">
                          <LazyVideo src="/video/violet.mp4" />
                        </div>
                      </div>
                      <div
                        className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[3/4]"
                      >
                        <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                          <div className="pr-12 flex items-center gap-2">
                            <h3
                              className="text-[20px] font-semibold mb-0 text-black dark:text-white title-font"
                            >
                              Sam
                            </h3>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <p className="text-base text-gray-600 dark:text-gray-300 mb-1 flex-1">
                              My son doing what he does better than most
                            </p>
                          </div>
                        </div>
                        <div className="absolute inset-0 overflow-hidden z-0">
                          <LazyVideo src="/video/sam.mp4" />
                        </div>
                      </div>
                      <div
                        className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[3/4]"
                      >
                        <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                          <div className="pr-12 flex items-center gap-2">
                            <h3
                              className="text-[20px] font-semibold mb-0 text-black dark:text-white title-font"
                            >
                              Golf
                            </h3>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <p className="text-base text-gray-600 dark:text-gray-300 mb-1 flex-1">
                              The game I love to hate
                            </p>
                          </div>
                        </div>
                        <div className="absolute inset-0 overflow-hidden z-0">
                          <LazyVideo src="/video/golfnew.mp4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section> */}

                  {/* Design System Section - Hidden */}
                  {false && (
                    <section
                      id="design-system"
                      className="py-4 sm:py-6 lg:py-8 xl:py-12"
                    >
                      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionHeader
                          title="Design System"
                          subtitle="Component library and design tokens"
                          className="mb-8"
                          showUpArrow={false}
                        />

                        {/* Colors */}
                        <section className="mb-12 sm:mb-16">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                            Colors
                          </h2>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                            <div className="space-y-2">
                              <div className="w-full h-16 sm:h-20 bg-primary rounded-lg"></div>
                              <div className="text-xs sm:text-sm">
                                <p className="font-medium">Primary</p>
                                <p className="text-gray-600">Primary</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="w-full h-16 sm:h-20 bg-secondary rounded-lg"></div>
                              <div className="text-xs sm:text-sm">
                                <p className="font-medium">Secondary</p>
                                <p className="text-gray-600">Secondary</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="w-full h-16 sm:h-20 bg-[#D2691E] rounded-lg"></div>
                              <div className="text-xs sm:text-sm">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Muted Orange
                                </p>
                                <p className="text-gray-800 dark:text-gray-300">
                                  #D2691E
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="w-full h-16 sm:h-20 bg-[#20B2AA] rounded-lg"></div>
                              <div className="text-xs sm:text-sm">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Teal
                                </p>
                                <p className="text-gray-800 dark:text-gray-300">
                                  #20B2AA
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="w-full h-16 sm:h-20 bg-gray-100 rounded-lg"></div>
                              <div className="text-xs sm:text-sm">
                                <p className="font-medium">Gray 100</p>
                                <p className="text-gray-600">Gray 100</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="w-full h-16 sm:h-20 bg-gray-200 rounded-lg"></div>
                              <div className="text-xs sm:text-sm">
                                <p className="font-medium">Gray 200</p>
                                <p className="text-gray-600">Gray 200</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="w-full h-16 sm:h-20 bg-gray-600 rounded-lg"></div>
                              <div className="text-xs sm:text-sm">
                                <p className="font-medium text-white">
                                  Gray 600
                                </p>
                                <p className="text-gray-800 dark:text-gray-300">
                                  Gray 600
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="w-full h-16 sm:h-20 bg-gray-900 rounded-lg"></div>
                              <div className="text-xs sm:text-sm">
                                <p className="font-medium text-white">
                                  Gray 900
                                </p>
                                <p className="text-gray-800 dark:text-gray-300">
                                  Gray 900
                                </p>
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* Typography */}
                        <section className="mb-12 sm:mb-16">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                            Typography
                          </h2>
                          <div className="space-y-4">
                            <div>
                              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                Whereas disregard and contempt for human rights
                                have
                              </h1>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                Component library and design tokens
                              </p>
                            </div>
                            <div>
                              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                                Whereas disregard and contempt for human rights
                                have
                              </h2>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                Component library and design tokens
                              </p>
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                Whereas disregard and contempt for human rights
                                have
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                Component library and design tokens
                              </p>
                            </div>
                            <div>
                              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Whereas disregard and contempt for human rights
                                have
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                Component library and design tokens
                              </p>
                            </div>
                            <div>
                              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2">
                                Whereas disregard and contempt for human rights
                                have resulted in barbarous acts which have
                                outraged the conscience of mankind.
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                Body text - This is a paragraph with regular
                                body text styling.
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Whereas disregard and contempt for human rights
                                have resulted in barbarous acts which have
                                outraged the conscience of mankind.
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                Small text - This is smaller text for captions
                                and secondary information.
                              </p>
                            </div>
                          </div>
                        </section>

                        {/* Buttons */}
                        <section className="mb-12 sm:mb-16">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                            Buttons
                          </h2>
                          <div className="flex flex-wrap gap-2 sm:gap-4">
                            <button className="px-3 sm:px-4 py-2 bg-primary text-black dark:text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base">
                              Primary Button
                            </button>
                            <button className="px-3 sm:px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors text-sm sm:text-base">
                              Secondary Button
                            </button>
                            <button className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base">
                              Tertiary Button
                            </button>
                            <button className="px-3 sm:px-4 py-2 border border-primary text-black dark:text-white rounded-lg hover:bg-primary hover:text-white dark:hover:text-black transition-colors text-sm sm:text-base">
                              Outline Primary
                            </button>
                            <button className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm sm:text-base">
                              Outline Secondary
                            </button>
                          </div>
                        </section>

                        {/* Cards */}
                        <section className="mb-12 sm:mb-16">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                            Cards
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                            <div className="group relative overflow-hidden rounded-lg bg-gray-100/80 dark:bg-gray-800/80">
                              <div className="p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-2">
                                  Background Card
                                </h3>
                                <p className="text-sm sm:text-base text-black dark:text-gray-300">
                                  Background Card
                                </p>
                              </div>
                            </div>

                            {/* Glassmorphic Card with Gradient Background */}
                            <div className="group relative overflow-hidden rounded-2xl aspect-[1/1] bg-black">
                              {/* Gradient Background Blobs */}
                              <div className="absolute inset-0">
                                {/* Light gray blob - top left */}
                                <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-gray-300 via-gray-400 to-transparent rounded-full blur-3xl opacity-60"></div>
                                {/* Medium gray blob - bottom left */}
                                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-gray-400 via-gray-500 to-transparent rounded-full blur-3xl opacity-70"></div>
                                {/* Dark gray blob - top right */}
                                <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-bl from-gray-500 via-gray-600 to-transparent rounded-full blur-3xl opacity-65"></div>
                              </div>

                              {/* Glassmorphic Card */}
                              <div className="absolute inset-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-400/20 via-transparent to-gray-600/20"></div>
                                {/* Static/Noise Effect */}
                                <div
                                  className="absolute inset-0 rounded-2xl opacity-30 mix-blend-overlay pointer-events-none"
                                  style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                    backgroundSize: "200%",
                                    backgroundRepeat: "repeat",
                                  }}
                                ></div>
                                <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                                  <div className="pr-12 flex flex-col gap-1">
                                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-0 text-black dark:text-white title-font">
                                      Glassmorphic Card
                                    </h3>
                                    <p className="text-xs text-black dark:text-gray-300 font-medium">
                                      It's all the rage
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="group relative overflow-visible rounded-lg bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl aspect-[1/1]">
                              <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                                <div className="pr-12 flex flex-col gap-2">
                                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-0 dark:text-white title-font">
                                    Lab Card
                                  </h3>
                                  {/* Greyscale colored balls */}
                                  <div
                                    className="flex items-center gap-1"
                                    role="presentation"
                                  >
                                    {[
                                      "#6b7280", // Gray 500
                                      "#9ca3af", // Gray 400
                                      "#d1d5db", // Gray 300
                                      "#4b5563", // Gray 600
                                      "#374151", // Gray 700
                                      "#1f2937", // Gray 800
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
                                          boxShadow:
                                            "0 1px 2px rgba(0,0,0,0.08)",
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex-1 flex flex-col">
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex-1"></p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* Chips/Tags */}
                        <section className="mb-12 sm:mb-16">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
                            Chips & Tags
                          </h2>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                Default Chips
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium dark:bg-blue-500">
                                  Primary
                                </span>
                                <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm font-medium dark:bg-gray-600">
                                  Secondary
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm font-medium dark:bg-gray-800 dark:text-gray-100">
                                  Neutral
                                </span>
                                <span className="px-3 py-1 bg-orange-700 text-white rounded-full text-sm font-medium dark:bg-orange-600">
                                  Orange
                                </span>
                                <span className="px-3 py-1 bg-teal-700 text-white rounded-full text-sm font-medium dark:bg-teal-600">
                                  Teal
                                </span>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                Outline Chips
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 border border-blue-600 text-blue-600 rounded-full text-sm font-medium dark:border-blue-400 dark:text-blue-400">
                                  Primary
                                </span>
                                <span className="px-3 py-1 border border-gray-700 text-gray-700 rounded-full text-sm font-medium dark:border-gray-400 dark:text-gray-300">
                                  Secondary
                                </span>
                                <span className="px-3 py-1 border border-gray-400 text-gray-700 rounded-full text-sm font-medium dark:border-gray-500 dark:text-gray-300">
                                  Neutral
                                </span>
                                <span className="px-3 py-1 border border-orange-700 text-orange-700 rounded-full text-sm font-medium dark:border-orange-500 dark:text-orange-500">
                                  Orange
                                </span>
                                <span className="px-3 py-1 border border-teal-700 text-teal-700 rounded-full text-sm font-medium dark:border-teal-500 dark:text-teal-500">
                                  Teal
                                </span>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                Small Chips
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-medium dark:bg-blue-500">
                                  Small
                                </span>
                                <span className="px-2 py-0.5 bg-gray-700 text-white rounded-full text-xs font-medium dark:bg-gray-600">
                                  Chip
                                </span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-900 rounded-full text-xs font-medium dark:bg-gray-800 dark:text-gray-100">
                                  Tags
                                </span>
                                <span className="px-2 py-0.5 bg-orange-700 text-white rounded-full text-xs font-medium dark:bg-orange-600">
                                  Orange
                                </span>
                                <span className="px-2 py-0.5 bg-teal-700 text-white rounded-full text-xs font-medium dark:bg-teal-600">
                                  Teal
                                </span>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                Interactive Chips
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <button className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">
                                  Clickable
                                </button>
                                <button className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors dark:bg-gray-600 dark:hover:bg-gray-700">
                                  Interactive
                                </button>
                                <button className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
                                  Button
                                </button>
                                <button className="px-3 py-1 border border-blue-600 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500">
                                  Outline
                                </button>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </section>
                  )}
                </>
              }
            />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/json" element={<JsonAiPrompts />} />
            <Route path="/zaven" element={<AudioTranscript />} />
            <Route path="/news" element={<NewsAggregator />} />
            <Route path="/specs" element={<Specs />} />
            <Route path="/story" element={<Story />} />
            <Route path="/music" element={<MusicPlayer />} />
            <Route path="/store" element={<Store />} />
            <Route path="/store/product/:id" element={<ProductDetail />} />
            <Route path="/store/checkout" element={<Checkout />} />
            <Route
              path="/store/checkout/success"
              element={<CheckoutSuccess />}
            />
          </Routes>
        </Suspense>
      </main>

      {selectedArticle && (
        <Suspense fallback={null}>
          <ArticleModal
            title={selectedArticle.title}
            content={selectedArticle.content}
            image={selectedArticle.image}
            onClose={() => setSelectedArticle(null)}
          />
        </Suspense>
      )}

      {selectedStory && (
        <Suspense fallback={null}>
          <ArticleModal
            title={selectedStory.title}
            content={selectedStory.content}
            onClose={() => setSelectedStory(null)}
          />
        </Suspense>
      )}
      {/* Hide MobileTrayMenu on news and store pages */}
      {location.pathname !== "/news" && location.pathname !== "/store" && (
        <Suspense fallback={null}>
          <MobileTrayMenu />
        </Suspense>
      )}

      {/* Footer - Hide on store pages */}
      {!location.pathname.startsWith("/store") && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}

      {/* Global Dark Mode Toggle and View Toggle - Visible on all pages */}
      <div className="fixed top-2 right-0 z-50 flex items-center gap-2">
        {/* View Toggle - Only show on news page and hide on mobile */}
        {location.pathname === "/news" && (
          <div className="hidden md:flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1 shadow-lg">
            <button
              onClick={() => {
                // This will be handled by the NewsAggregator component
                // We'll use a custom event to communicate
                window.dispatchEvent(
                  new CustomEvent("toggleViewMode", { detail: "list" })
                );
              }}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentViewMode === "list"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
              aria-label="List view"
            >
              <IconWrapper Icon={LazyList} className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                // This will be handled by the NewsAggregator component
                // We'll use a custom event to communicate
                window.dispatchEvent(
                  new CustomEvent("toggleViewMode", { detail: "grid" })
                );
              }}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentViewMode === "grid"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-300"
              }`}
              aria-label="Grid view"
            >
              <IconWrapper Icon={LazyLayoutGrid} className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dark Mode Toggle - Hide on news and store pages */}
        {location.pathname !== "/news" &&
          !location.pathname.startsWith("/store") && (
            <button
              onClick={() => {
                const html = document.documentElement;
                if (html.classList.contains("dark")) {
                  html.classList.remove("dark");
                  localStorage.setItem("theme", "light");
                } else {
                  html.classList.add("dark");
                  localStorage.setItem("theme", "dark");
                }
              }}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
              aria-label="Toggle dark mode"
            >
              <svg
                className="w-4 h-4 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <svg
                className="w-4 h-4 text-gray-700 dark:text-gray-300 absolute opacity-0 dark:opacity-100 transition-opacity duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
          )}

        {/* Fixed background image in bottom left */}
        {location.pathname !== "/specs" && location.pathname !== "/store" && (
          <div className="fixed bottom-0 left-0 z-[5] pointer-events-none">
            <img
              src={getOptimizedImage("/img/section-edge.png", 640, 65)}
              alt=""
              className="w-auto h-[640px] opacity-75 dark:opacity-75"
              {...({
                fetchPriority: "high",
              } as React.ImgHTMLAttributes<HTMLImageElement>)}
              width={640}
              height={640}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap the App with Router at the root level
export default function AppWithRouter() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <StoreProvider>
            <App />
          </StoreProvider>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}
