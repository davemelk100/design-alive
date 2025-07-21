import { motion, AnimatePresence } from "framer-motion";
import {
  Dribbble,
  ArrowUp,
  Eye,
  Menu,
  ExternalLink,
  X,
  FlaskConical,
  BookOpen,
  FileText,
  Palette,
  Briefcase,
  Heart,
  Settings,
} from "lucide-react";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";

import { content } from "./content";
import Preloader from "./components/Preloader";

import { BrowserRouter as Router } from "react-router-dom";
import ArticleModal from "./components/ArticleModal";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load components for better performance
const Article = lazy(() => import("./pages/Article"));
const Archive = lazy(() => import("./pages/Archive"));
const DesignArchive = lazy(() => import("./pages/DesignArchive"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminMusic = lazy(() => import("./pages/AdminMusic"));
const MusicPlayer = lazy(() => import("./pages/MusicPlayer"));
const WritingGallery = lazy(() => import("./pages/WritingGallery"));
const DesignSystem = lazy(() => import("./pages/DesignSystem"));
import { slugify } from "./utils/slugify";
import { getVisibleArticles } from "./utils/articleVisibility";
import { getVisibleDesignWork } from "./utils/designWorkVisibility";
import LazyVideo from "./components/LazyVideo";

import { getVisibleLabProjects } from "./utils/labProjectVisibility";
import { isSectionVisible } from "./utils/contentVisibility";
import "./utils/storageMigration"; // Import to trigger migration if needed

// Add SectionHeader component
const SectionHeader = ({
  title,
  subtitle,
  className = "",
  showArchiveLink = false,
  showUpArrow = true,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  showArchiveLink?: boolean;
  showUpArrow?: boolean;
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h2
            className="text-[clamp(1.25rem,3vw,2.5rem)] font-bold title-font leading-tight"
            style={{
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {showArchiveLink && (
            <Link
              to="/archive"
              className="text-nav text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              View Archive
            </Link>
          )}
          {showUpArrow && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-black text-white dark:bg-white/10 dark:text-white p-2 rounded-full shadow-lg hover:opacity-80 transition-opacity"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4 text-white dark:text-white" />
            </button>
          )}
        </div>
      </div>
      {subtitle && (
        <p className="text-base text-muted-foreground mb-8 sm:mb-10">
          {subtitle}
        </p>
      )}
    </div>
  );
};

function App() {
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
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (id: string) => {
    if (location.pathname !== "/") {
      // If we're not on the main page, navigate to main page first
      navigate("/");
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerHeight = 64; // Approximate header height
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      // If we're already on the main page, just scroll
      const element = document.getElementById(id);
      if (element) {
        const headerHeight = 64; // Approximate header height
        const elementPosition = element.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }
  };

  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
      {/* Remove Header Navigation from here */}

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
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Hero Section */}
                <section className="relative flex flex-col justify-center min-h-[120px] sm:min-h-[160px]">
                  <div className="container mx-auto px-4 sm:px-8 pt-8 sm:pt-4 flex flex-col gap-y-2 sm:gap-y-4">
                    {/* Title Row */}
                    <div className="flex flex-row items-center gap-4 relative z-10 mt-5">
                      {/* Mobile: Title left-aligned */}
                      <div
                        className={`flex xl:hidden items-center justify-start w-full transition-opacity duration-300 ${
                          isMobileMenuOpen ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <h1
                          className="text-[clamp(1.75rem,5vw,3.5rem)] font-bold mb-1 title-font leading-none relative z-10"
                          style={{ letterSpacing: "-0.06em" }}
                        >
                          {content.siteInfo.subtitle}
                        </h1>
                        <div className="flex items-center gap-2 ml-4">
                          <a
                            href={content.navigation.social.linkedin.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                            aria-label="LinkedIn"
                          >
                            <LinkedInLogoIcon className="h-5 w-5 text-black" />
                          </a>
                          <a
                            href={content.navigation.social.dribbble.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                            aria-label="Dribbble"
                          >
                            <Dribbble className="h-5 w-5 text-black" />
                          </a>
                          <div className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center">
                            <ThemeToggle />
                          </div>
                        </div>
                      </div>
                      {/* Desktop: Title on left */}
                      <div className="hidden xl:flex items-center">
                        <h1
                          className="text-[clamp(1.75rem,5vw,3.5rem)] font-bold mb-1 title-font leading-none relative z-10"
                          style={{ letterSpacing: "-0.06em" }}
                        >
                          {content.siteInfo.subtitle}
                        </h1>
                        <div className="flex items-center gap-2 ml-4">
                          <a
                            href={content.navigation.social.linkedin.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                            aria-label="LinkedIn"
                          >
                            <LinkedInLogoIcon className="h-5 w-5 text-black" />
                          </a>
                          <a
                            href={content.navigation.social.dribbble.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                            aria-label="Dribbble"
                          >
                            <Dribbble className="h-5 w-5 text-black" />
                          </a>
                          <div className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center">
                            <ThemeToggle />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Nav Links and Icons Row */}
                    <div className="hidden md:flex md:flex-col lg:flex-row md:items-stretch lg:items-center gap-4 w-full">
                      {/* Desktop Navigation Links */}
                      <div className="hidden md:flex w-full justify-start lg:justify-start rounded-lg pl-0 pr-3 sm:pr-4 py-2 items-center gap-4 sm:gap-6">
                        <button
                          onClick={() => handleNavClick("current-projects")}
                          className="text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-200 transition-colors text-sm font-bold uppercase"
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                          }}
                        >
                          Lab
                        </button>
                        <button
                          onClick={() => handleNavClick("stories")}
                          className="text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-200 transition-colors text-sm font-bold uppercase"
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                          }}
                        >
                          Stories
                        </button>
                        <button
                          onClick={() => handleNavClick("articles")}
                          className="text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-200 transition-colors text-sm font-bold uppercase"
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                          }}
                        >
                          Articles
                        </button>
                        <button
                          onClick={() => handleNavClick("work")}
                          className="text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-200 transition-colors text-sm font-bold uppercase"
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                          }}
                        >
                          Designs
                        </button>
                        <button
                          onClick={() => handleNavClick("career")}
                          className="text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-200 transition-colors text-sm font-bold uppercase"
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                          }}
                        >
                          Career
                        </button>
                        <button
                          onClick={() => handleNavClick("personal")}
                          className="text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-200 transition-colors text-sm font-bold uppercase"
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                          }}
                        >
                          Personal
                        </button>
                        <Link
                          to="/design-system"
                          className="text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-200 transition-colors text-sm font-bold uppercase whitespace-nowrap"
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                          }}
                        >
                          Design System
                        </Link>
                      </div>
                    </div>
                    {/* Summary Row (unchanged) */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.8, delay: 0.4 }}
                      className="max-w-4xl flex flex-col items-start"
                    >
                      <p className="text-base text-muted-foreground leading-relaxed text-left">
                        Senior Product Designer with 15+ years of experience
                        creating accessible, intuitive digital experiences
                        across diverse industries. I lead projects end-to-end -
                        from research to polished interfaces - modernizing
                        dashboards, onboarding, and e-commerce while improving
                        clarity and accessibility. Skilled in cross-functional
                        collaboration, user-centered strategy, and applying
                        advanced methods like AI to solve complex challenges and
                        drive inclusive innovation.
                      </p>
                    </motion.div>
                  </div>
                </section>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[9999] xl:hidden"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 300,
                        }}
                        className="absolute bottom-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 rounded-t-3xl max-h-[70vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-lg font-semibold">Navigation</h2>
                          <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                            aria-label="Close menu"
                          >
                            <X className="h-5 w-5 text-gray-600" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => {
                              handleNavClick("current-projects");
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                              <FlaskConical className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold">Lab</span>
                          </button>
                          <button
                            onClick={() => {
                              handleNavClick("stories");
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold">
                              Stories
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              handleNavClick("articles");
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold">
                              Articles
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              handleNavClick("work");
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <Palette className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold">
                              Designs
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              handleNavClick("career");
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <Briefcase className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold">
                              Career
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              handleNavClick("personal");
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                              <Heart className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold">
                              Personal
                            </span>
                          </button>
                          <Link
                            to="/design-system"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                              <Settings className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold whitespace-nowrap">
                              Design System
                            </span>
                          </Link>
                          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                              <ThemeToggle />
                            </div>
                            <span className="text-sm font-semibold">Theme</span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Current Projects Section */}
                {isSectionVisible("lab") && (
                  <section
                    id="current-projects"
                    className="py-12 sm:py-16 lg:py-20"
                  >
                    <div className="container mx-auto px-4 sm:px-8">
                      <SectionHeader
                        title={content.currentProjects.title}
                        subtitle={content.currentProjects.subtitle}
                        className="mb-8"
                        showUpArrow={false}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getVisibleLabProjects(
                          content.currentProjects.projects
                        ).map((project, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.8, delay: index * 0.2 }}
                            className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[1/1]"
                          >
                            <div className="absolute top-3 right-3 z-20">
                              <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center relative z-20"
                              >
                                <ExternalLink className="h-5 w-5 text-gray-600" />
                              </a>
                            </div>
                            <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                              <div className="pr-12 flex items-center gap-2">
                                <h3
                                  className="text-[20px] font-semibold mb-1 dark:text-black title-font"
                                  style={{
                                    letterSpacing: "-0.01em",
                                  }}
                                >
                                  {project.title}
                                </h3>
                                {/* Colored balls for each Lab card */}
                                <div className="flex items-center gap-1 ml-2">
                                  {project.title === "Chatbots" &&
                                    [
                                      "#ff8c42", // Orange from Chatbots animation
                                      "#17a2b8", // Blue from Chatbots animation
                                      "#6c757d", // Gray from Chatbots animation
                                      "#e67e22", // Darker Orange from Chatbots animation
                                      "#138496", // Darker Blue from Chatbots animation
                                      "#58", // Darker Gray from Chatbots animation
                                    ].map((color, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          display: "inline-block",
                                          width: 14,
                                          height: 14,
                                          borderRadius: "50%",
                                          background: `radial-gradient(circle at 70% 70%, ${color} 0%, ${color} 60%, ${color}dd 100%)`,
                                          boxShadow:
                                            "0 1px 2px rgba(0,0,0,0.08)",
                                        }}
                                      />
                                    ))}
                                  {project.title === "Design Panes" &&
                                    [
                                      "#ffd700", // Gold from Design Panes animation
                                      "#355c7d", // Deep Blue from Design Panes animation
                                      "#88d498", // Soft Green from Design Panes animation
                                      "#e6b800", // Darker Gold from Design Panes animation
                                      "#26425a", // Darker Blue from Design Panes animation
                                      "#5", // Darker Green from Design Panes animation
                                    ].map((color, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          display: "inline-block",
                                          width: 14,
                                          height: 14,
                                          borderRadius: "50%",
                                          background: `radial-gradient(circle at 70% 70%, ${color} 0%, ${color} 60%, ${color}dd 100%)`,
                                          boxShadow:
                                            "0 1px 2px rgba(0,0,0,0.08)",
                                        }}
                                      />
                                    ))}
                                  {project.title === "AI NUI" &&
                                    [
                                      "#ff6b35", // Orange from AI NUI animation
                                      "#4ecdc4", // Teal from AI NUI animation
                                      "#6c757d", // Gray from AI NUI animation
                                      "#e55a2b", // Darker Orange from AI NUI animation
                                      "#457a", // Darker Teal from AI NUI animation
                                      "#58", // Darker Gray from AI NUI animation
                                    ].map((color, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          display: "inline-block",
                                          width: 14,
                                          height: 14,
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
                                <p className="text-sm text-gray-600 dark:text-gray-600 mb-2 flex-1">
                                  {project.description}
                                </p>
                              </div>
                            </div>
                            <div className="absolute inset-0 overflow-hidden z-0">
                              <img
                                src={
                                  project.title === "Chatbots"
                                    ? `/img/chatbot-animation.svg?v=${Date.now()}`
                                    : project.title === "Design Panes"
                                    ? `/img/design-panes-alt2.svg?v=${Date.now()}`
                                    : project.title === "AI NUI"
                                    ? `/img/ai-nui-alt2.svg?v=${Date.now()}`
                                    : `/img/lab.svg?v=${Date.now()}`
                                }
                                alt={
                                  project.title === "Chatbots"
                                    ? "Design Panes Animation"
                                    : project.title === "Design Panes"
                                    ? "Design Panes"
                                    : project.title === "AI NUI"
                                    ? "Design Panes Animation"
                                    : "Lab"
                                }
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Stories Section */}
                <section id="stories" className="py-12 sm:py-16 lg:py-20">
                  <div className="container mx-auto px-4 sm:px-8">
                    <SectionHeader
                      title={content.stories.title}
                      subtitle={content.stories.subtitle}
                      className="mb-8"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {content.stories.items.map((story) => (
                        <motion.div
                          key={story.title}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 2.4, delay: 0.2 }}
                          className="group relative overflow-hidden rounded-lg bg-gray-100/80 flex flex-col shadow-md"
                        >
                          <div className="absolute top-3 right-3">
                            {story.hasModal ? (
                              <button
                                onClick={() =>
                                  setSelectedStory({
                                    title: story.title,
                                    content: story.content,
                                    subtitle: story.subtitle,
                                  })
                                }
                                className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                              >
                                <Eye className="h-5 w-5 text-gray-600" />
                              </button>
                            ) : (
                              <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md w-10 h-10 flex items-center justify-center">
                                <Eye className="h-5 w-5 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="p-3 flex flex-col gap-2 flex-1">
                            <div className="pr-12">
                              <h3
                                className="text-[20px] font-semibold mb-1 dark:text-black title-font"
                                style={{
                                  letterSpacing: "-0.01em",
                                }}
                              >
                                {story.title}
                              </h3>
                              {story.subtitle && (
                                <p className="text-sm text-gray-600 dark:text-gray-600 mb-2">
                                  {story.subtitle}
                                </p>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col">
                              {story.description && (
                                <p className="text-black mb-2 dark:text-black text-card-body flex-1">
                                  {story.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="relative aspect-[3/2] overflow-visible -mx-3 -mb-3">
                            {story.image ? (
                              <img
                                src={`${story.image}?v=${Date.now()}`}
                                alt={story.title}
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 h-full w-full bg-gray-200/50 flex items-center justify-center">
                                <div className="text-gray-400 text-sm">
                                  No image
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Articles Section */}
                {isSectionVisible("articles") && (
                  <section id="articles" className="py-12 sm:py-16 lg:py-20">
                    <div className="container mx-auto px-4 sm:px-8">
                      <SectionHeader
                        title="Articles"
                        subtitle={content.articles.subtitle}
                        className="mb-8"
                        showArchiveLink={false}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getVisibleArticles(content.articles.items)
                          .filter(
                            (article) =>
                              article.title !==
                                "API Tokens: The Digital Arcade" &&
                              article.title !== "Commit Message Fatigue" &&
                              article.title !== "The 5 Design Anti-Patterns" &&
                              article.title !==
                                "Vibe Coding vs Vibe Engineering" &&
                              article.title !==
                                "Information Architecture Is Not Sacred" &&
                              article.title !==
                                "AI is hydrated with user research data"
                          )
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          )
                          .map((article, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.8, delay: index * 0.2 }}
                              className="group relative overflow-hidden rounded-lg bg-gray-100/80 flex flex-col shadow-md"
                            >
                              <div className="absolute top-3 right-3">
                                <Link
                                  to={`/article/${slugify(article.title)}`}
                                  className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                                >
                                  <Eye className="h-5 w-5 text-gray-600" />
                                </Link>
                              </div>
                              <div className="p-3 flex flex-col gap-2 flex-1">
                                <div className="pr-12">
                                  <h3
                                    className="text-[20px] font-semibold mb-1 dark:text-black title-font"
                                    style={{
                                      letterSpacing: "-0.01em",
                                    }}
                                  >
                                    {article.title}
                                  </h3>
                                </div>
                                <div className="flex-1 flex flex-col">
                                  {article.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-600 mb-2 flex-1">
                                      {article.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="relative aspect-[3/2] overflow-visible -mx-3 -mb-3">
                                <img
                                  src={`${
                                    (article as any).cardImage || article.image
                                  }?v=${Date.now()}`}
                                  alt={article.title}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              </div>
                            </motion.div>
                          ))}
                      </div>
                      <div className="mt-8">
                        <Link
                          to="/archive"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                        >
                          View Archive
                        </Link>
                      </div>
                    </div>
                  </section>
                )}

                {/* Work Section */}
                {isSectionVisible("designWork") && (
                  <section id="work" className="py-12 sm:py-16 lg:py-20">
                    <div className="container mx-auto px-4 sm:px-8">
                      <SectionHeader
                        title="Design"
                        subtitle={content.work.subtitle}
                        className="mb-8"
                        showArchiveLink={false}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getVisibleDesignWork(content.work.projects)
                          .filter(
                            (project: any) =>
                              project.title !== "3D Conversion UX Plan"
                          )
                          .map((project: any, index) => {
                            const ProjectCard = (
                              <div className="flex flex-col gap-2 flex-1">
                                <div className="pr-12">
                                  <h3
                                    className="text-[20px] font-semibold mb-1 dark:text-black title-font"
                                    style={{
                                      letterSpacing: "-0.01em",
                                    }}
                                  >
                                    {project.title}
                                  </h3>
                                  {project.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-600 mb-2">
                                      {project.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );

                            const ProjectImage = (
                              <div
                                className={`relative ${
                                  project.title === "Vintage Form Design"
                                    ? "aspect-[4/3]"
                                    : "aspect-[5/3]"
                                } overflow-visible -mx-3 -mb-3`}
                              >
                                <img
                                  src={`${project.image}?v=${Date.now()}`}
                                  alt={project.alt || project.title}
                                  className={`absolute inset-0 h-full w-full ${
                                    project.title === "Hex Code Pop Art"
                                      ? "object-cover scale-102"
                                      : project.title === "Vintage Form Design"
                                      ? "object-contain scale-90"
                                      : "object-contain"
                                  }`}
                                  loading="lazy"
                                />
                              </div>
                            );

                            return project.url ? (
                              <div
                                key={index}
                                className="group relative overflow-hidden rounded-lg bg-gray-100/80 flex flex-col shadow-md"
                              >
                                <div className="absolute top-3 right-3">
                                  <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                                  >
                                    <Eye className="h-5 w-5 text-gray-600" />
                                  </a>
                                </div>
                                <div className="p-3 flex flex-col gap-2 flex-1">
                                  {ProjectCard}
                                </div>
                                {ProjectImage}
                              </div>
                            ) : (
                              <div
                                key={index}
                                className="group relative overflow-hidden rounded-lg bg-gray-100/80 flex flex-col shadow-md"
                              >
                                <div className="absolute top-3 right-3">
                                  <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md w-10 h-10 flex items-center justify-center">
                                    <Eye className="h-5 w-5 text-gray-600" />
                                  </div>
                                </div>
                                <div className="p-3 flex flex-col gap-2 flex-1">
                                  {ProjectCard}
                                </div>
                                {ProjectImage}
                              </div>
                            );
                          })}
                      </div>
                      <div className="mt-8">
                        <Link
                          to="/design-archive"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                        >
                          View Design Archive
                        </Link>
                      </div>
                    </div>
                  </section>
                )}

                {/* Career Timeline Section */}
                <section id="career" className="py-12 sm:py-16 lg:py-20">
                  <div className="container mx-auto px-4 sm:px-8">
                    <SectionHeader
                      title={content.career.title}
                      subtitle={content.career.subtitle}
                      className="mb-8 sm:mb-16"
                    />
                    <div className="space-y-8">
                      {content.career.positions.map((position) => (
                        <div
                          key={position.title + position.period}
                          className=""
                        >
                          <h3
                            className="text-lg font-semibold mb-1 dark:text-black title-font"
                            style={{ letterSpacing: "-0.01em" }}
                          >
                            {position.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-600 mb-1 font-medium">
                            {position.company}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                            {position.period}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-700 leading-relaxed">
                            {position.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Personal Section */}
                <section id="personal" className="py-12 sm:py-16 lg:py-20">
                  <div className="container mx-auto px-4 sm:px-8">
                    <SectionHeader
                      title="Personal"
                      subtitle="Personal projects and interests"
                      className="mb-8"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.8, delay: 0.2 }}
                        className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[3/4]"
                      >
                        <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                          <div className="pr-12 flex items-center gap-2">
                            <h3
                              className="text-[20px] font-semibold mb-0 dark:text-black title-font"
                              style={{ letterSpacing: "-0.01em" }}
                            >
                              Violet
                            </h3>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <p className="text-base text-gray-600 dark:text-gray-600 mb-1 flex-1">
                              My amazing daughter with another line drive for a
                              base hit
                            </p>
                          </div>
                        </div>
                        <div className="absolute inset-0 overflow-hidden z-0">
                          <LazyVideo src="/video/violet.mp4" />
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.8, delay: 0.4 }}
                        className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[3/4]"
                      >
                        <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                          <div className="pr-12 flex items-center gap-2">
                            <h3
                              className="text-[20px] font-semibold mb-0 dark:text-black title-font"
                              style={{ letterSpacing: "-0.01em" }}
                            >
                              Sam
                            </h3>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <p className="text-base text-gray-600 dark:text-gray-600 mb-1 flex-1">
                              My son doing what he does better than most
                            </p>
                          </div>
                        </div>
                        <div className="absolute inset-0 overflow-hidden z-0">
                          <LazyVideo src="/video/sam.mp4" />
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.8, delay: 0.6 }}
                        className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[3/4]"
                      >
                        <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                          <div className="pr-12 flex items-center gap-2">
                            <h3
                              className="text-[20px] font-semibold mb-0 dark:text-black title-font"
                              style={{ letterSpacing: "-0.01em" }}
                            >
                              Golf
                            </h3>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <p className="text-base text-gray-600 dark:text-gray-600 mb-1 flex-1">
                              The game I love to hate
                            </p>
                          </div>
                        </div>
                        <div className="absolute inset-0 overflow-hidden z-0">
                          <LazyVideo src="/video/golfnew.mp4" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </section>
              </>
            }
          />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/design-archive" element={<DesignArchive />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-music" element={<AdminMusic />} />
          <Route path="/music-player" element={<MusicPlayer />} />
          <Route path="/writing-gallery" element={<WritingGallery />} />
          <Route path="/design-system" element={<DesignSystem />} />
        </Routes>
      </Suspense>

      {/* Mobile Bottom Icons Tray */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-[9999] md:hidden">
        <div className="flex items-center justify-center px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center ${
              isMobileMenuOpen
                ? "bg-orange-500 text-white"
                : "bg-white/80 hover:bg-white text-black"
            }`}
            aria-label="Mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {selectedArticle && (
        <ArticleModal
          title={selectedArticle.title}
          content={selectedArticle.content}
          image={selectedArticle.image}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {selectedStory && (
        <ArticleModal
          title={selectedStory.title}
          content={selectedStory.content}
          onClose={() => setSelectedStory(null)}
        />
      )}

      {/* Hidden Admin Access Button */}
      <Link
        to="/admin"
        className="fixed top-0 left-0 w-8 h-8 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300 z-[9999] cursor-pointer"
        style={{
          boxShadow: "none",
          border: "none",
          outline: "none",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
        title="Admin Access"
      />
    </div>
  );
}

// Wrap the App with Router at the root level
export default function AppWithRouter() {
  return (
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  );
}
