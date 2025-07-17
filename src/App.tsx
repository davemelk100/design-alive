import { motion } from "framer-motion";
import { Dribbble, ArrowUp, Eye } from "lucide-react";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { content } from "./content";
import Preloader from "./components/Preloader";

import { BrowserRouter as Router } from "react-router-dom";
import ImageModal from "../components/ImageModal";
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
import Article from "./pages/Article";
import Archive from "./pages/Archive";
import DesignArchive from "./pages/DesignArchive";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminMusic from "./pages/AdminMusic";
import MusicPlayer from "./pages/MusicPlayer";
import WritingGallery from "./pages/WritingGallery";
import DesignSystem from "./pages/DesignSystem";
import { slugify } from "./utils/slugify";
import { getVisibleArticles } from "./utils/articleVisibility";
import { getVisibleDesignWork } from "./utils/designWorkVisibility";

import { getVisibleLabProjects } from "./utils/labProjectVisibility";
import { isSectionVisible } from "./utils/contentVisibility";
import "./utils/storageMigration"; // Import to trigger migration if needed

// Add SectionHeader component
const SectionHeader = ({
  title,
  subtitle,
  className = "",
  showArchiveLink = false,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  showArchiveLink?: boolean;
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
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-black text-white p-2 rounded-full shadow-lg hover:opacity-80 transition-opacity"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
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

      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Hero Section */}
              <section className="relative h-[20vh] flex items-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-background/5"
                />

                <div className="container mx-auto px-4 sm:px-8 pt-32 sm:pt-20">
                  {/* Title, Icons, and Navigation Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.2,
                          },
                        },
                      }}
                    >
                      <motion.h1
                        variants={{
                          hidden: { opacity: 0, y: 50 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.8,
                              ease: "easeOut",
                            },
                          },
                        }}
                        className="text-[clamp(1.75rem,5vw,3.5rem)] font-bold mb-1 title-font leading-none"
                        style={{
                          letterSpacing: "-0.06em",
                        }}
                      >
                        {content.siteInfo.subtitle}
                      </motion.h1>
                    </motion.div>

                    {/* Icons and Navigation */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="flex flex-row items-center gap-4"
                    >
                      {/* Navigation Links */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 flex items-center justify-start gap-4 sm:gap-8">
                        <button
                          onClick={() => handleNavClick("current-projects")}
                          className="text-black hover:text-gray-600 transition-colors text-xs sm:text-sm font-medium uppercase"
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          Lab
                        </button>
                        <button
                          onClick={() => handleNavClick("stories")}
                          className="text-black hover:text-gray-600 transition-colors text-xs sm:text-sm font-medium uppercase"
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          Stories
                        </button>
                        <button
                          onClick={() => handleNavClick("articles")}
                          className="text-black hover:text-gray-600 transition-colors text-xs sm:text-sm font-medium uppercase"
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          Articles
                        </button>
                        <button
                          onClick={() => handleNavClick("work")}
                          className="text-black hover:text-gray-600 transition-colors text-xs sm:text-sm font-medium uppercase"
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          Design
                        </button>
                        <button
                          onClick={() => handleNavClick("career")}
                          className="text-black hover:text-gray-600 transition-colors text-xs sm:text-sm font-medium uppercase"
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          Career
                        </button>
                        <Link
                          to="/design-system"
                          className="text-black hover:text-gray-600 transition-colors text-xs sm:text-sm font-medium uppercase"
                          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                        >
                          Design System
                        </Link>
                      </div>

                      {/* Icons */}
                      <div className="hidden sm:flex items-center gap-2 sm:gap-4">
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
                    </motion.div>
                  </div>
                </div>
              </section>

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
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[1/1]"
                        >
                          <div className="absolute top-3 right-3 z-20">
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center relative z-20"
                            >
                              <Eye className="h-5 w-5 text-gray-600" />
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
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
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
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
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
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
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
                    {content.stories.items.map((story, index) => (
                      <motion.div
                        key={story.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
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
                            transition={{ duration: 0.6, delay: index * 0.1 }}
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
                              className={`relative aspect-[5/3] overflow-visible -mx-3 -mb-3`}
                            >
                              <img
                                src={`${project.image}?v=${Date.now()}`}
                                alt={project.alt || project.title}
                                className={`absolute inset-0 h-full w-full ${
                                  project.title === "Hex Code Pop Art"
                                    ? "object-cover scale-102"
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
                  {/* Career Cards */}
                  <div>
                    <SectionHeader
                      title={content.career.title}
                      subtitle={content.career.subtitle}
                      className="mb-8 sm:mb-16"
                    />
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-0 md:left-1-full w-px bg-gray-200" />

                      {/* Timeline Items */}
                      <div className="space-y-12">
                        {content.career.positions.map((position, index) => (
                          <motion.div
                            key={position.title + position.period}
                            initial={{
                              opacity: 0,
                              x: index % 2 === 0 ? -50 : 50,
                            }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                          >
                            {/* Timeline Dot */}
                            <div className="absolute right-[-9] md:right-auto md:left-[calc(50%-9px)] w-[18px] h-[18px] rounded-full bg-primary" />

                            {/* Card */}
                            <div
                              className={`md:w-[calc(50%-2rem)] ${
                                index % 2 === 0
                                  ? "md:mr-auto md:pr-16"
                                  : "md:ml-auto md:pl-16"
                              }`}
                            >
                              <div className="group relative overflow-hidden rounded-lg bg-gray-100/80 flex-col shadow-md">
                                <div className="p-6 flex flex-col gap-3">
                                  <div>
                                    <h3
                                      className="text-[20px] font-semibold mb-2 dark:text-black title-font"
                                      style={{
                                        letterSpacing: "-0.01em",
                                      }}
                                    >
                                      {position.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-600 mb-1 font-medium">
                                      {position.company}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                                      {position.period}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-700 leading-relaxed">
                                    {position.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
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

      {selectedArticle && (
        <ArticleModal
          title={selectedArticle.title}
          content={selectedArticle.content}
          image={selectedArticle.image}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
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
        to="/admin-login"
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
