import { motion } from "framer-motion";
import {
  CircleDot,
  Dribbble,
  BookOpen,
  FlaskConical,
  Palette,
  Briefcase,
  Quote,
  ArrowUp,
  Keyboard,
} from "lucide-react";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { content } from "./content";

import { BrowserRouter as Router } from "react-router-dom";
import ImageModal from "../components/ImageModal";
import ArticleModal from "./components/ArticleModal";
import designTokens from "./designTokens.json";
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
import { slugify } from "./utils/slugify";
import { getVisibleArticles } from "./utils/articleVisibility";
import { getVisibleDesignWork } from "./utils/designWorkVisibility";
import { getVisibleTestimonials } from "./utils/testimonialVisibility";
import { getVisibleLabProjects } from "./utils/labProjectVisibility";
import { isSectionVisible } from "./utils/contentVisibility";
import { checkAdminAuth } from "./utils/adminAuth";

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
        <h2
          className="text-[clamp(1.25rem,3vw,2.5rem)] font-bold title-font leading-tight"
          style={{ letterSpacing: "-1.5px" }}
        >
          {title}
        </h2>
        {showArchiveLink && (
          <Link
            to="/archive"
            className="text-nav text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            View Archive
          </Link>
        )}
      </div>
      {subtitle && (
        <p className="text-base text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<{
    title: string;
    content: string;
    image?: string;
    date?: string;
  } | null>(null);
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [navMousePosition, setNavMousePosition] = useState({ x: 0, y: 0 });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check admin authentication status
  useEffect(() => {
    setIsAdminLoggedIn(checkAdminAuth());
  }, [location.pathname]);

  const handleNavMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setNavMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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

  const handleAdminAction = () => {
    if (isAdminLoggedIn) {
      navigate("/admin");
    } else {
      navigate("/admin-login");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
      {/* Header Navigation */}
      <div className="relative z-20">
        <div className="bg-gradient-to-r from-gray-500 to-black px-6 py-2 flex items-center justify-between">
          {/* Logo/Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
              >
                <CircleDot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </motion.div>
              <span className="text-base font-medium text-white">
                {content.siteInfo.title}
              </span>
            </motion.button>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden sm:block relative"
            onMouseEnter={() => setIsHoveringNav(true)}
            onMouseLeave={() => setIsHoveringNav(false)}
            onMouseMove={handleNavMouseMove}
          >
            {/* Sliding background that follows cursor */}
            {isHoveringNav && (
              <motion.div
                className="absolute w-16 h-8 bg-white/20 backdrop-blur-sm rounded-lg pointer-events-none"
                style={{
                  left: navMousePosition.x - 32,
                  top: navMousePosition.y - 16,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              />
            )}
            <ul className="flex items-center gap-4 sm:gap-6 md:gap-8 relative z-10">
              {content.navigation.links.map((item) => (
                <motion.li
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="text-xs sm:text-sm text-white px-3 py-2 rounded-lg transition-all duration-200 relative z-10"
                  >
                    {item.text}
                  </button>
                </motion.li>
              ))}
              <li
                className="h-4 w-px bg-gray-600 mx-1 sm:mx-2"
                aria-hidden="true"
              />
              <motion.li whileHover={{ scale: 1.05 }}>
                <a
                  href={content.navigation.social.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 text-white relative z-10"
                  aria-label="LinkedIn"
                >
                  <LinkedInLogoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <a
                  href={content.navigation.social.dribbble.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 text-white relative z-10"
                  aria-label="Dribbble"
                >
                  <Dribbble className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <button
                  onClick={handleAdminAction}
                  className="p-2 rounded-lg transition-all duration-200 text-white relative z-10 hover:bg-white/10"
                  aria-label={isAdminLoggedIn ? "Admin Panel" : "Admin Login"}
                >
                  <Keyboard className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </motion.li>
              <li
                className="h-4 w-px bg-gray-600 mx-1 sm:mx-2"
                aria-hidden="true"
              />
              <motion.li whileHover={{ scale: 1.05 }}>
                <ThemeToggle />
              </motion.li>
            </ul>
          </motion.nav>

          {/* Mobile Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="sm:hidden"
          >
            <ul className="flex items-center gap-6">
              <motion.li whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => handleNavClick("articles")}
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Articles"
                >
                  <BookOpen className="h-5 w-5" />
                </button>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => handleNavClick("current-projects")}
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Lab"
                >
                  <FlaskConical className="h-5 w-5" />
                </button>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => handleNavClick("work")}
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Design"
                >
                  <Palette className="h-5 w-5" />
                </button>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => handleNavClick("testimonials")}
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Testimonials"
                >
                  <Quote className="h-5 w-5" />
                </button>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => handleNavClick("career")}
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Career"
                >
                  <Briefcase className="h-5 w-5" />
                </button>
              </motion.li>

              <motion.li whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => handleNavClick("figma-hotkeys")}
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label="Figma Hotkeys"
                >
                  <Keyboard className="h-5 w-5" />
                </button>
              </motion.li>

              <motion.li whileHover={{ scale: 1.05 }}>
                <button
                  onClick={handleAdminAction}
                  className="text-white hover:opacity-70 transition-opacity"
                  aria-label={isAdminLoggedIn ? "Admin Panel" : "Admin Login"}
                >
                  <Keyboard className="h-5 w-5" />
                </button>
              </motion.li>
            </ul>
          </motion.nav>
        </div>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Hero Section */}
              <section className="relative h-[60vh] flex items-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-background/5"
                />

                <div className="container mx-auto px-4 sm:px-8">
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
                      className="text-[clamp(2rem,6vw,4rem)] font-bold mb-1 title-font leading-none"
                      style={{ letterSpacing: "-4.5px" }}
                    >
                      {content.siteInfo.subtitle}
                    </motion.h1>
                  </motion.div>

                  {/* Color Palette */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="mt-6 flex flex-wrap gap-3"
                  >
                    {designTokens.colors.map((color) => {
                      // Function to determine if text should be light or dark based on background color
                      const getTextColor = (hexColor: string) => {
                        const r = parseInt(hexColor.slice(1, 3), 16);
                        const g = parseInt(hexColor.slice(3, 5), 16);
                        const b = parseInt(hexColor.slice(5, 7), 16);
                        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                        return brightness > 128 ? "text-black" : "text-white";
                      };

                      return (
                        <div
                          key={color.name}
                          className="flex flex-col items-center gap-2"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative w-12 h-12 rounded-full"
                            style={{
                              backgroundColor: color.value,
                              boxShadow:
                                "2px 2px 4px rgba(0,0,0,0.2), -2px -2px 4px rgba(255,255,255,0.3)",
                              background: `radial-gradient(circle at 70% 70%, ${color.value} 0%, ${color.value} 60%, ${color.value}dd 100%)`,
                            }}
                          />
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              </section>

              {/* Current Projects Section */}
              {isSectionVisible("lab") && (
                <section id="current-projects" className="py-16 sm:py-24">
                  <div className="container mx-auto px-4 sm:px-8">
                    <SectionHeader
                      title={content.currentProjects.title}
                      subtitle={content.currentProjects.subtitle}
                      className="mb-12"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getVisibleLabProjects(
                        content.currentProjects.projects
                      ).map((project, index) => (
                        <a
                          key={index}
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative overflow-hidden rounded-lg bg-gray-100/80 flex flex-col"
                        >
                          <div className="absolute top-3 right-3 text-gray-400 group-hover:text-gray-600 transition-colors">
                            <ArrowUp className="h-4 w-4 rotate-45" />
                          </div>
                          <div className="p-3 flex flex-col gap-2 flex-1">
                            <div>
                              <h3
                                className="text-[20px] font-semibold mb-1 dark:text-black title-font"
                                style={{ letterSpacing: "-0.75px" }}
                              >
                                {project.title}
                              </h3>
                            </div>
                            <div className="flex-1 flex flex-col">
                              <p className="text-black mb-2 dark:text-black text-card-body flex-1">
                                {project.description}
                              </p>
                            </div>
                          </div>
                          <div className="aspect-[3/2] overflow-hidden -mx-3">
                            <img
                              src={
                                project.title === "Chatbots"
                                  ? `/img/color-theory-animation.svg?v=${Date.now()}`
                                  : project.title === "Design Panes"
                                  ? `/img/ambiguous-scale-animation.svg?v=${Date.now()}`
                                  : project.title === "AI NUI"
                                  ? `/img/interwoven-space-animation.svg?v=${Date.now()}`
                                  : `/img/lab.svg?v=${Date.now()}`
                              }
                              alt={
                                project.title === "Chatbots"
                                  ? "Robot Chatbot"
                                  : project.title === "Design Panes"
                                  ? "Design Panes"
                                  : project.title === "AI NUI"
                                  ? "Interwoven Space"
                                  : "Lab"
                              }
                              className="h-full w-full object-contain"
                            />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Articles Section */}
              {isSectionVisible("articles") && (
                <section id="articles" className="py-16 sm:py-24">
                  <div className="container mx-auto px-4 sm:px-8">
                    <SectionHeader
                      title="Articles"
                      subtitle={content.articles.subtitle}
                      className="mb-12"
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
                          <Link
                            key={index}
                            to={`/article/${slugify(article.title)}`}
                            className="group relative overflow-hidden rounded-lg bg-gray-100/80 flex flex-col"
                          >
                            <div className="absolute top-3 right-3 text-gray-400 group-hover:text-gray-600 transition-colors">
                              <ArrowUp className="h-4 w-4 rotate-45" />
                            </div>
                            <div className="p-3 flex flex-col gap-2 flex-1">
                              <div>
                                <h3
                                  className="text-[20px] font-semibold mb-1 dark:text-black title-font"
                                  style={{ letterSpacing: "-0.75px" }}
                                >
                                  {article.title}
                                </h3>
                              </div>
                              <div className="flex-1 flex flex-col">
                                <p className="text-gray-600 dark:text-gray-400 mb-2 text-card-body flex-1">
                                  {article.description}
                                </p>
                              </div>
                            </div>
                            <div className="aspect-[3/2] overflow-hidden -mx-3">
                              <img
                                src={`${
                                  (article as any).cardImage || article.image
                                }?v=${Date.now()}`}
                                alt={article.title}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </Link>
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
                <section id="work" className="py-16 sm:py-24">
                  <div className="container mx-auto px-4 sm:px-8">
                    <SectionHeader
                      title="Design"
                      subtitle={content.work.subtitle}
                      className="mb-12"
                      showArchiveLink={false}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getVisibleDesignWork(content.work.projects)
                        .filter(
                          (project: any) =>
                            project.title !== "3D Conversion UX Plan"
                        )
                        .map((project: any, index) => {
                          const ProjectCard = (
                            <div className="flex flex-col gap-2 flex-1">
                              <div>
                                <h3
                                  className="text-[20px] font-semibold mb-1 dark:text-black title-font"
                                  style={{ letterSpacing: "-0.75px" }}
                                >
                                  {project.title}
                                </h3>
                                {project.description && (
                                  <p className="text-black mb-2 dark:text-black text-card-body">
                                    {project.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );

                          const ProjectImage = (
                            <div className="aspect-[3/2] overflow-hidden -mx-3 -mb-6">
                              <img
                                src={`${project.image}?v=${Date.now()}`}
                                alt={project.alt || project.title}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          );

                          return project.url ? (
                            <a
                              key={index}
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative overflow-hidden rounded-lg bg-gray-100/80 flex flex-col"
                            >
                              <div className="p-3 flex flex-col gap-2 flex-1">
                                {ProjectCard}
                              </div>
                              {ProjectImage}
                            </a>
                          ) : (
                            <div
                              key={index}
                              className="group relative overflow-hidden rounded-lg bg-gray-100/80 flex flex-col"
                            >
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

              {/* Testimonials Section */}
              {isSectionVisible("testimonials") && (
                <section id="testimonials" className="py-16 sm:py-24">
                  <div className="container mx-auto px-4 sm:px-8">
                    <SectionHeader
                      title={content.testimonials.title}
                      subtitle={content.testimonials.subtitle}
                      className="mb-8 sm:mb-16"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {getVisibleTestimonials(content.testimonials.items).map(
                        (testimonial, index) => (
                          <motion.div
                            key={testimonial.author}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-gray-100/80 p-6 sm:p-8 rounded-lg shadow-lg relative"
                          >
                            <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20 dark:text-white/20 absolute -top-3 -left-3 sm:-top-4 sm:-left-4" />
                            <p className="text-base mb-6 dark:text-black">
                              {testimonial.quote}
                            </p>
                            <div>
                              <p className="font-semibold text-nav dark:text-black">
                                {testimonial.author}
                              </p>
                              <p className="text-caption text-muted-foreground dark:text-black">
                                {testimonial.role}
                              </p>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Career Timeline Section */}
              <section id="career" className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-8">
                  <SectionHeader
                    title={content.career.title}
                    subtitle={content.career.subtitle}
                    className="mb-8 sm:mb-16"
                  />
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-0 md:left-1/2 h-full w-px bg-gray-200" />

                    {/* Timeline Items */}
                    <div className="space-y-12 sm:space-y-16">
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
                          className="relative grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-16"
                        >
                          <div
                            className={`md:text-right md:pr-16 ${
                              index % 2 !== 0 ? "md:order-1" : ""
                            }`}
                          >
                            {index % 2 === 0 ? (
                              <>
                                <div className="absolute right-[-9px] md:right-auto md:left-[calc(50%-9px)] top-0">
                                  <div className="w-[18px] h-[18px] rounded-full bg-primary" />
                                </div>
                                <h3 className="text-[20px] font-semibold mb-2">
                                  {position.title}
                                </h3>
                                <p className="text-nav text-muted-foreground mb-1">
                                  {position.company}
                                </p>
                                <p className="text-caption text-muted-foreground">
                                  {position.period}
                                </p>
                              </>
                            ) : (
                              <p className="text-muted-foreground">
                                {position.description}
                              </p>
                            )}
                          </div>
                          <div
                            className={`md:pl-16 ${
                              index % 2 !== 0 ? "md:order-0" : ""
                            }`}
                          >
                            {index % 2 !== 0 ? (
                              <>
                                <div className="absolute right-[-9px] md:right-auto md:left-[calc(50%-9px)] top-0">
                                  <div className="w-[18px] h-[18px] rounded-full bg-primary" />
                                </div>
                                <h3 className="text-[20px] font-semibold mb-2">
                                  {position.title}
                                </h3>
                                <p className="text-nav text-muted-foreground mb-1">
                                  {position.company}
                                </p>
                                <p className="text-caption text-muted-foreground">
                                  {position.period}
                                </p>
                              </>
                            ) : (
                              <p className="text-muted-foreground">
                                {position.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Figma Hotkeys Section */}
              <section id="figma-hotkeys" className="py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-8">
                  <SectionHeader
                    title={content.figmaHotkeys.title}
                    className="mb-4"
                  />
                  <p className="text-base text-muted-foreground mb-12 dark:text-white">
                    I selfishly made this for myself when I forget 'em.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.figmaHotkeys.shortcuts.map((category, index) => (
                      <motion.div
                        key={category.category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-gray-100/80 p-6 rounded-lg"
                      >
                        <h3 className="text-[20px] font-semibold mb-4 dark:text-black">
                          {category.category}
                        </h3>
                        <div className="space-y-3">
                          {category.shortcuts.map((shortcut, shortcutIndex) => (
                            <div
                              key={shortcutIndex}
                              className="flex justify-between items-center"
                            >
                              <span className="text-nav dark:text-black">
                                {shortcut.description}
                              </span>
                              <kbd className="px-2 py-1 text-caption font-semibold text-gray-800 bg-white border border-gray-300 rounded dark:text-black">
                                {shortcut.key}
                              </kbd>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
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
      </Routes>

      {selectedArticle && (
        <ArticleModal
          title={selectedArticle.title}
          content={selectedArticle.content}
          image={selectedArticle.image}
          date={selectedArticle.date}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{
          opacity: isScrolled ? 1 : 0,
          y: isScrolled ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-24 right-4 z-50 bg-black text-white p-3 rounded-full shadow-lg hover:opacity-80 transition-opacity"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6" />
      </motion.button>
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
