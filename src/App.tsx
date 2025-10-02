import { motion } from "framer-motion";
import {
  Dribbble,
  ArrowUp,
  Eye,
  ExternalLink,
  LayoutGrid,
  List,
} from "lucide-react";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";

import { content } from "./content";
import Preloader from "./components/Preloader";

import { BrowserRouter as Router } from "react-router-dom";
import ArticleModal from "./components/ArticleModal";
import { ThemeProvider } from "./context/ThemeContext";

import MobileTrayMenu from "./components/MobileTrayMenu";

import { Routes, Route, Link, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load components for better performance
const Article = lazy(() => import("./pages/Article"));
const Archive = lazy(() => import("./pages/Archive"));

const MusicPlayer = lazy(() => import("./pages/MusicPlayer"));

const JsonAiPrompts = lazy(() => import("./pages/JsonAiPrompts"));
const AudioTranscript = lazy(() => import("./pages/AudioTranscript"));
const NewsAggregator = lazy(() => import("./pages/NewsAggregator"));

import { slugify } from "./utils/slugify";
import LazyVideo from "./components/LazyVideo";

import "./utils/storageMigration"; // Import to trigger migration if needed

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
          <h2 className="text-4xl font-bold title-font leading-tight">
            {title}
          </h2>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-black text-white dark:bg-white/10 dark:text-white rounded-full shadow-lg hover:opacity-80 transition-opacity flex-shrink-0 flex items-center justify-center w-8 h-8 p-0 min-w-8 min-h-8"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4 m-0 flex-shrink-0" />
          </button>
          {icon && <div className="flex items-center gap-2">{icon}</div>}
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
                <LayoutGrid className="h-4 w-4" />
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
                <List className="h-4 w-4" />
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

  const [currentViewMode, setCurrentViewMode] = useState<"list" | "grid">(
    "grid"
  );

  const location = useLocation();

  // Scroll to top on route change (but not for internal navigation)
  useEffect(() => {
    // Only scroll to top if we're not navigating to a specific section
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {}, [location.pathname]);

  // Listen for view mode changes from NewsAggregator
  useEffect(() => {
    const handleViewModeChange = (event: CustomEvent) => {
      setCurrentViewMode(event.detail);
    };

    // Initialize view mode from localStorage
    const savedViewMode = localStorage.getItem("viewMode") as "list" | "grid";
    if (savedViewMode) {
      setCurrentViewMode(savedViewMode);
    }

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

  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white pb-20 sm:pb-0">
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
                <section className="py-4 sm:py-4xl:py-4 relative">
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:gap-8">
                      {/* Hero Content */}
                      <div className="pt-4 rounded-lg">
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
                          {content.navigation.links.map((link) => (
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
                        </motion.div>

                        {/* Summary Text */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1.8, delay: 0.6 }}
                          className="mt-4 sm:mt-6"
                        >
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-left">
                            I'm David Melkonian, a UX and front-end leader with
                            15+ years of experience. I specialize in design
                            systems, accessibility, and bridging design with
                            development using React, Figma and more. I've led teams of 30+, built UX
                            practices from scratch, and achieved near-100%
                            accessibility compliance.
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Lab Section */}
                <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative">
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:gap-8">
                      {/* Lab Section */}
                      <div
                        id="current-projects"
                        className="border border-gray-300 dark:border-gray-600 p-4 sm:p-6 rounded-lg"
                      >
                        <SectionHeader
                          title={content.currentProjects.title}
                          subtitle={content.currentProjects.subtitle}
                          className="mb-6"
                          showUpArrow={false}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                          {content.currentProjects.projects
                            .filter((project) => project.title !== "Chatbots")
                            .map((project, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 1.8,
                                  delay: index * 0.2,
                                }}
                                className="group relative overflow-visible sm:overflow-hidden rounded-lg bg-transparent border border-gray-200 flex flex-col shadow-md h-[180px] sm:h-[320px] md:h-[336px] lg:h-[352px]"
                              >
                                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 hidden sm:block">
                                  <a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full p-1.5 hover:scale-110 transition-all duration-200 w-8 h-8 flex items-center justify-center relative z-20"
                                    aria-label={`View demo: ${project.title}`}
                                  >
                                    <ExternalLink className="h-4 w-4 text-gray-600 dark:text-white" />
                                  </a>
                                </div>
                                {/* Mobile background - white */}
                                <div className="absolute inset-0 bg-white dark:bg-gray-900 sm:hidden"></div>

                                {/* Desktop background - animations */}
                                <div className="absolute inset-0 overflow-hidden z-0 p-2 hidden sm:block">
                                  <img
                                    src={
                                      project.title === "Design Panes"
                                        ? `/img/design-panes-alt2.svg?v=${Date.now()}`
                                        : project.title === "AI NUI"
                                        ? `/img/ai-nui-alt2.svg?v=${Date.now()}`
                                        : project.title === "HealthAware"
                                        ? `/img/health-aware-animation.svg?v=${Date.now()}`
                                        : project.title === "JSON AI Prompts"
                                        ? `/img/json-ai-prompts-animation.svg?v=${Date.now()}`
                                        : project.title ===
                                          "User Testing Config"
                                        ? `/img/user-testing-config-animation.svg?v=${Date.now()}`
                                        : `/img/lab.svg?v=${Date.now()}`
                                    }
                                    alt={
                                      project.title === "Design Panes"
                                        ? "Design Panes"
                                        : project.title === "AI NUI"
                                        ? "Design Panes Animation"
                                        : project.title === "HealthAware"
                                        ? "HealthAware Animation"
                                        : project.title === "JSON AI Prompts"
                                        ? "JSON AI Prompts Animation"
                                        : project.title ===
                                          "User Testing Config"
                                        ? "User Testing Config Animation"
                                        : "Lab"
                                    }
                                    className="absolute inset-0 h-full w-full object-contain object-bottom"
                                  />
                                </div>
                                <div className="absolute inset-0 p-2 sm:p-3 flex flex-col gap-1 sm:gap-2 z-10">
                                  <div className="rounded-lg p-1 sm:p-2 pr-10 sm:pr-12">
                                    <div className="flex flex-col gap-0.5 sm:gap-1">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                          <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold mb-0 title-font text-black dark:text-white hover:text-primary transition-colors cursor-pointer text-[18px] whitespace-nowrap truncate lab-card-title"
                                          >
                                            {project.title}
                                          </a>
                                        </div>
                                      </div>
                                      {/* Colored balls for each Lab card, now on a new row */}
                                      <div
                                        className="flex items-center gap-1 mt-0 sm:mt-1 mb-1 sm:mb-[10px]"
                                        role="presentation"
                                      >
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
                                              role="presentation"
                                              aria-hidden="true"
                                              className="w-3 h-3"
                                              style={{
                                                display: "inline-block",
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
                                              role="presentation"
                                              aria-hidden="true"
                                              className="w-3 h-3"
                                              style={{
                                                display: "inline-block",
                                                borderRadius: "50%",
                                                background: `radial-gradient(circle at 70% 70%, ${color} 0%, ${color} 60%, ${color}dd 100%)`,
                                                boxShadow:
                                                  "0 1px 2px rgba(0,0,0,0.08)",
                                              }}
                                            />
                                          ))}
                                        {project.title === "HealthAware" &&
                                          [
                                            "#64748b", // Slate - neutral/monitoring
                                            "#94a3b8", // Slate Light - subtle/calm
                                            "#475569", // Slate Dark - depth/contrast
                                            "#cbd5e1", // Slate Lighter - soft/gentle
                                            "#334155", // Slate Darker - sophisticated
                                          ].map((color, i) => (
                                            <span
                                              key={i}
                                              role="presentation"
                                              aria-hidden="true"
                                              className="w-3 h-3"
                                              style={{
                                                display: "inline-block",
                                                borderRadius: "50%",
                                                background: `radial-gradient(circle at 70% 70%, ${color} 0%, ${color} 60%, ${color}dd 100%)`,
                                                boxShadow:
                                                  "0 1px 2px rgba(0,0,0,0.08)",
                                              }}
                                            />
                                          ))}
                                        {project.title === "JSON AI Prompts" &&
                                          [
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
                                              className="w-3 h-3"
                                              style={{
                                                display: "inline-block",
                                                borderRadius: "50%",
                                                background: `radial-gradient(circle at 70% 70%, ${color} 0%, ${color} 60%, ${color}dd 100%)`,
                                                boxShadow:
                                                  "0 1px 2px rgba(0,0,0,0.08)",
                                              }}
                                            />
                                          ))}
                                        {project.title ===
                                          "User Testing Config" &&
                                          [
                                            "#a67c52", // Brighter Warm Brown - neutral/testing
                                            "#b8a095", // Brighter Brown Gray - subtle/calm
                                            "#8b6b4f", // Brighter Brown Dark - depth/contrast
                                            "#e8d5d0", // Brighter Light Beige - soft/gentle
                                            "#d4a574", // Golden Brown - warm/accent
                                          ].map((color, i) => (
                                            <span
                                              key={i}
                                              role="presentation"
                                              aria-hidden="true"
                                              className="w-3 h-3"
                                              style={{
                                                display: "inline-block",
                                                borderRadius: "50%",
                                                background: `radial-gradient(circle at 70% 70%, ${color} 0%, ${color} 60%, ${color}dd 100%)`,
                                                boxShadow:
                                                  "0 1px 2px rgba(0,0,0,0.08)",
                                              }}
                                            />
                                          ))}
                                      </div>
                                    </div>
                                    <p
                                      className="text-sm text-gray-600 dark:text-white mb-1 sm:mb-2 flex-1"
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        lineHeight: "1.2",
                                        maxHeight: "2.4em",
                                      }}
                                    >
                                      {project.description}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Articles Section */}
                <section
                  id="articles"
                  className="py-4 sm:py-6 lg:py-8 xl:py-12 relative"
                >
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="border border-gray-300 dark:border-gray-600 p-4 sm:p-6 rounded-lg">
                      <SectionHeader
                        title="Articles"
                        subtitle={content.articles.subtitle}
                        className="mb-6"
                        showArchiveLink={false}
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
                      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
                              article.title !== "Vibe Coding v Vibe Engineering"
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
                              transition={{
                                duration: 1.8,
                                delay: index * 0.2,
                              }}
                              className="group relative overflow-visible sm:overflow-hidden rounded-lg bg-transparent border border-gray-200 flex flex-col shadow-md h-[180px] sm:h-[320px] md:h-[336px] lg:h-[352px]"
                            >
                              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 hidden sm:block">
                                {article.url.startsWith("http") ? (
                                  <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full p-1.5 hover:scale-110 transition-all duration-200 w-8 h-8 flex items-center justify-center"
                                    aria-label={`View article: ${article.title}`}
                                  >
                                    <ExternalLink className="h-4 w-4 text-gray-600 dark:text-white" />
                                  </a>
                                ) : (
                                  <Link
                                    to={`/article/${slugify(article.title)}`}
                                    className="rounded-full p-1.5 hover:scale-110 transition-all duration-200 w-8 h-8 flex items-center justify-center"
                                    aria-label={`View article: ${article.title}`}
                                  >
                                    <ExternalLink className="h-4 w-4 text-gray-600 dark:text-white" />
                                  </Link>
                                )}
                              </div>
                              {/* Mobile background - semi-transparent partial image */}
                              <div className="absolute inset-0 z-0 sm:hidden">
                                <img
                                  src={`${
                                    (article as any).cardImage || article.image
                                  }?v=${Date.now()}`}
                                  alt={article.title}
                                  className="absolute inset-0 w-full h-full object-cover object-center opacity-10"
                                  loading="lazy"
                                />
                              </div>

                              {/* Desktop background - images */}
                              <div className="absolute inset-0 z-0 hidden sm:block">
                                <img
                                  src={`${
                                    (article as any).cardImage || article.image
                                  }?v=${Date.now()}`}
                                  alt={article.title}
                                  className="absolute bottom-0 left-0 right-0 h-1/2 w-full object-cover object-center"
                                  loading="lazy"
                                />
                              </div>
                              <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                                <div className="rounded-lg p-1 sm:p-2 pr-8 sm:pr-12">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        {article.url.startsWith("http") ? (
                                          <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[18px] font-semibold mb-0 title-font text-black dark:text-white hover:text-primary transition-colors cursor-pointer lab-card-title"
                                            style={{
                                              lineHeight: "1.25",
                                            }}
                                          >
                                            {article.title.length > 40
                                              ? `${article.title.substring(
                                                  0,
                                                  40
                                                )}...`
                                              : article.title}
                                          </a>
                                        ) : (
                                          <Link
                                            to={`/article/${slugify(
                                              article.title
                                            )}`}
                                            className="text-[18px] font-semibold mb-0 title-font text-black dark:text-white hover:text-primary transition-colors cursor-pointer lab-card-title"
                                            style={{
                                              lineHeight: "1.25",
                                            }}
                                          >
                                            {article.title.length > 40
                                              ? `${article.title.substring(
                                                  0,
                                                  40
                                                )}...`
                                              : article.title}
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                    {article.description && (
                                      <p
                                        className="text-sm text-gray-600 dark:text-gray-300 opacity-80 hidden sm:block"
                                        style={{
                                          lineHeight: "1.2",
                                        }}
                                      >
                                        {article.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Design Section */}
                <section
                  id="work"
                  className="py-4 sm:py-6 lg:py-8 xl:py-12 relative"
                >
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="border border-gray-300 dark:border-gray-600 p-4 sm:p-6 rounded-lg">
                      <SectionHeader
                        title="Design"
                        subtitle={content.work.subtitle}
                        className="mb-6"
                        showArchiveLink={false}
                        icon={
                          <a
                            href={content.navigation.social.dribbble.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                            aria-label="Dribbble"
                          >
                            <Dribbble className="h-5 w-5 text-black" />
                          </a>
                        }
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                        {content.work.projects
                          .filter(
                            (project: any) =>
                              project.title !== "3D Conversion UX Plan"
                          )
                          .map((project: any, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 1.8,
                                delay: index * 0.2,
                              }}
                              className="group relative overflow-visible sm:overflow-hidden rounded-lg bg-transparent border border-gray-200 flex flex-col shadow-md h-[180px] sm:h-[320px] md:h-[336px] lg:h-[352px]"
                            >
                              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 hidden sm:block">
                                {project.url ? (
                                  <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full p-1.5 hover:scale-110 transition-all duration-200 w-8 h-8 flex items-center justify-center"
                                    aria-label={`View project: ${project.title}`}
                                  >
                                    <ExternalLink className="h-4 w-4 text-gray-600 dark:text-white" />
                                  </a>
                                ) : (
                                  <div className="rounded-full p-1.5 w-8 h-8 flex items-center justify-center">
                                    <Eye className="h-4 w-4 text-gray-600 dark:text-white" />
                                  </div>
                                )}
                              </div>
                              {/* Mobile background - semi-transparent partial image */}
                              <div className="absolute inset-0 z-0 sm:hidden">
                                <img
                                  src={project.image}
                                  alt={project.alt || project.title}
                                  className="absolute inset-0 w-full h-full object-cover object-center opacity-10"
                                  loading="lazy"
                                />
                              </div>

                              {/* Desktop background - images */}
                              <div className="absolute inset-0 z-0 hidden sm:block">
                                <img
                                  src={project.image}
                                  alt={project.alt || project.title}
                                  className={`absolute bottom-0 left-0 right-0 object-contain object-bottom ${
                                    project.title === "Band Shirt Design"
                                      ? "h-2/3 w-2/3 mx-auto"
                                      : project.title ===
                                        "Figma Mobile Prototype"
                                      ? "h-3/4 w-3/4 mx-auto"
                                      : "h-full w-full"
                                  }`}
                                  loading="lazy"
                                />
                              </div>
                              <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                                <div className="rounded-lg p-1 sm:p-2 pr-8 sm:pr-12">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        {project.url ? (
                                          <a
                                            href={project.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[18px] font-semibold mb-0 title-font text-black dark:text-white hover:text-primary transition-colors cursor-pointer lab-card-title"
                                            style={{
                                              lineHeight: "1.25",
                                            }}
                                          >
                                            {project.title.length > 40
                                              ? `${project.title.substring(
                                                  0,
                                                  40
                                                )}...`
                                              : project.title}
                                          </a>
                                        ) : (
                                          <h3
                                            className="text-[18px] font-semibold mb-0 title-font text-black dark:text-white lab-card-title"
                                            style={{
                                              lineHeight: "1.25",
                                            }}
                                          >
                                            {project.title.length > 40
                                              ? `${project.title.substring(
                                                  0,
                                                  40
                                                )}...`
                                              : project.title}
                                          </h3>
                                        )}
                                      </div>
                                    </div>
                                    {project.description && (
                                      <p className="text-sm text-gray-600 dark:text-gray-300 opacity-80 hidden sm:block">
                                        {project.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Testimonials Section */}
                {/**
                <section id="testimonials" className="py-12 sm:py-16 lg:py-20">
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
                    <SectionHeader
                      title={content.testimonials.title}
                      subtitle={content.testimonials.subtitle}
                      className="mb-8 sm:mb-16"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {content.testimonials.items.map((testimonial, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.8, delay: index * 0.2 }}
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
                        </motion.div>
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
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="border border-gray-300 dark:border-gray-600 p-4 sm:p-6 rounded-lg">
                      <SectionHeader
                        title={content.stories.title}
                        subtitle={content.stories.subtitle}
                        className="mb-8"
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                        {content.stories.items
                          .filter(
                            (story) => story.title !== "Design Management"
                          )
                          .map((story, index) => (
                            <motion.div
                              key={story.title}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 2.4, delay: index * 0.2 }}
                              className="group relative overflow-visible sm:overflow-hidden rounded-lg bg-transparent border border-gray-200 flex flex-col shadow-md h-[180px] sm:h-[320px] md:h-[336px] lg:h-[352px]"
                            >
                              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 hidden sm:block">
                                {story.hasModal ? (
                                  <button
                                    onClick={() =>
                                      setSelectedStory({
                                        title: story.title,
                                        content: story.content,
                                        subtitle: story.subtitle,
                                      })
                                    }
                                    className="rounded-full p-1.5 hover:scale-110 transition-all duration-200 w-8 h-8 flex items-center justify-center"
                                    aria-label={`View ${story.title} story`}
                                  >
                                    <Eye className="h-4 w-4 text-gray-600 dark:text-white" />
                                  </button>
                                ) : (
                                  <div className="rounded-full p-1.5 w-8 h-8 flex items-center justify-center">
                                    <Eye className="h-4 w-4 text-gray-600 dark:text-white" />
                                  </div>
                                )}
                              </div>
                              {/* Mobile background - semi-transparent partial image */}
                              <div className="absolute inset-0 z-0 sm:hidden">
                                {story.image ? (
                                  <img
                                    src={story.image}
                                    alt={story.title}
                                    className="absolute inset-0 w-full h-full object-cover object-center opacity-10"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="absolute inset-0 w-full h-full bg-gray-200/50 flex items-center justify-center opacity-10">
                                    <div className="text-gray-400 text-sm">
                                      No image
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Desktop background - images */}
                              <div className="absolute inset-0 z-0 hidden sm:block">
                                {story.image ? (
                                  <img
                                    src={story.image}
                                    alt={story.title}
                                    className="absolute bottom-0 left-0 right-0 h-1/2 w-full object-cover object-center"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="absolute bottom-0 left-0 right-0 h-1/2 w-full bg-gray-200/50 flex items-center justify-center">
                                    <div className="text-gray-400 text-sm">
                                      No image
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                                <div className="rounded-lg p-1 sm:p-2 pr-8 sm:pr-12">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-start justify-between w-full">
                                      <div className="flex items-start gap-2 min-w-0 flex-1">
                                        {story.hasModal ? (
                                          <button
                                            onClick={() =>
                                              setSelectedStory({
                                                title: story.title,
                                                content: story.content,
                                                subtitle: story.subtitle,
                                              })
                                            }
                                            className="text-[18px] font-semibold mb-0 title-font text-black dark:text-white hover:text-primary transition-colors cursor-pointer lab-card-title text-left"
                                            style={{
                                              lineHeight: "1.25",
                                            }}
                                          >
                                            {story.title.length > 40
                                              ? `${story.title.substring(
                                                  0,
                                                  40
                                                )}...`
                                              : story.title}
                                          </button>
                                        ) : (
                                          <h3
                                            className="text-[18px] font-semibold mb-0 title-font text-black dark:text-white lab-card-title text-left"
                                            style={{
                                              lineHeight: "1.25",
                                            }}
                                          >
                                            {story.title.length > 40
                                              ? `${story.title.substring(
                                                  0,
                                                  40
                                                )}...`
                                              : story.title}
                                          </h3>
                                        )}
                                      </div>
                                    </div>
                                    {story.subtitle && (
                                      <p className="text-sm text-gray-600 dark:text-gray-300 opacity-80 hidden sm:block">
                                        {story.subtitle}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Career Timeline Section */}
                <section id="career" className="py-4 sm:py-6 lg:py-8 xl:py-12">
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
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
                          <LinkedInLogoIcon className="h-5 w-5 text-black" />
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
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {position.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Certifications & Education */}
                    <div className="mt-4 pt-2 max-w-3xl">
                      <div className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                        Certifications
                      </div>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                        <li>Certified ScrumMaster (Scrum Alliance)</li>
                        <li>
                          Certified Usability Analyst (Human Factors
                          International)
                        </li>
                        <li>ITIL Foundation Certificate (Axelos)</li>
                      </ul>
                      <div className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                        Education
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        Oakland University | Rochester MI
                        <br />
                        Bachelor of Arts in English
                        <br />
                        Minor in Public Relations
                      </div>
                    </div>
                  </div>
                </section>

                {/* Skills and Software Section */}
                <section
                  id="skills-and-software"
                  className="py-4 sm:py-6 lg:py-8 xl:py-12"
                >
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                      title={content.skillsAndSoftware.title}
                      subtitle={content.skillsAndSoftware.subtitle}
                      className="mb-8 sm:mb-6"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {content.skillsAndSoftware.categories.map(
                        (category, categoryIndex) => (
                          <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: categoryIndex * 0.1,
                            }}
                            className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6"
                          >
                            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                              {category.name}
                            </h3>
                            <div className="space-y-4">
                              {category.skills.map((skill, skillIndex) => (
                                <div
                                  key={skillIndex}
                                  className="border-l-4 border-[#D2691E] pl-3 sm:pl-4"
                                >
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                                    {skill.skill}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {skill.software.map((tool, toolIndex) => (
                                      <span
                                        key={toolIndex}
                                        className="inline-block px-2 sm:px-3 py-1 text-xs bg-[#D2691E]/10 dark:bg-[#D2691E]/20 text-[rgb(133,58,4)] dark:text-[#E8A87C] rounded-full border border-[#D2691E]/30 dark:border-[#D2691E]/40"
                                      >
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                </section>

                {/* Personal Section */}
                {/* <section id="personal" className="py-12 sm:py-16 lg:py-20">
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
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
                </section> */}

                {/* Design System Section */}
                <section
                  id="design-system"
                  className="py-4 sm:py-6 lg:py-8 xl:py-12"
                >
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
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
                            <p className="font-medium text-gray-900">
                              Muted Orange
                            </p>
                            <p className="text-gray-800">#D2691E</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full h-16 sm:h-20 bg-[#20B2AA] rounded-lg"></div>
                          <div className="text-xs sm:text-sm">
                            <p className="font-medium text-gray-900">Teal</p>
                            <p className="text-gray-800">#20B2AA</p>
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
                            <p className="font-medium text-white">Gray 600</p>
                            <p className="text-gray-800">Gray 600</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full h-16 sm:h-20 bg-gray-900 rounded-lg"></div>
                          <div className="text-xs sm:text-sm">
                            <p className="font-medium text-white">Gray 900</p>
                            <p className="text-gray-800">Gray 900</p>
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
                            Whereas disregard and contempt for human rights have
                          </h1>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            Component library and design tokens
                          </p>
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                            Whereas disregard and contempt for human rights have
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            Component library and design tokens
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Whereas disregard and contempt for human rights have
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            Component library and design tokens
                          </p>
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Whereas disregard and contempt for human rights have
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Component library and design tokens
                          </p>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base text-gray-700 mb-2">
                            Whereas disregard and contempt for human rights have
                            resulted in barbarous acts which have outraged the
                            conscience of mankind.
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Body text - This is a paragraph with regular body
                            text styling.
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">
                            Whereas disregard and contempt for human rights have
                            resulted in barbarous acts which have outraged the
                            conscience of mankind.
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Small text - This is smaller text for captions and
                            secondary information.
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
                        <button className="px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base">
                          Primary Button
                        </button>
                        <button className="px-3 sm:px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors text-sm sm:text-base">
                          Secondary Button
                        </button>
                        <button className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">
                          Tertiary Button
                        </button>
                        <button className="px-3 sm:px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm sm:text-base">
                          Outline Primary
                        </button>
                        <button className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
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
                        <div className="group relative overflow-hidden rounded-lg bg-gray-100/80">
                          <div className="absolute top-3 right-3 z-20">
                            <button
                              className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                              aria-label="View Background Card"
                            >
                              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                            </button>
                          </div>
                          <div className="p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Background Card
                            </h3>
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                              Background Card
                            </p>
                          </div>
                        </div>

                        <div className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[1/1]">
                          <div className="absolute top-3 right-3 z-20">
                            <button
                              className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                              aria-label="View Video Card"
                            >
                              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                            </button>
                          </div>
                          <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                            <div className="pr-12 flex items-center gap-2">
                              <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 dark:text-white title-font">
                                Video Card
                              </h3>
                            </div>
                            <div className="flex-1 flex flex-col">
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex-1"></p>
                            </div>
                          </div>
                          <div className="absolute inset-0 overflow-hidden z-0">
                            <LazyVideo
                              src="/video/jersey.mp4"
                              className="w-full h-full object-cover opacity-70"
                              autoPlay={true}
                              muted={true}
                              loop={true}
                              playsInline={true}
                            />
                          </div>
                        </div>
                        <div className="group relative overflow-visible rounded-lg bg-gray-100/80 shadow-md aspect-[1/1]">
                          <div className="absolute top-3 right-3 z-20">
                            <button
                              className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
                              aria-label="View Lab Card"
                            >
                              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                            </button>
                          </div>
                          <div className="absolute inset-0 p-3 flex flex-col gap-2 z-10">
                            <div className="pr-12 flex items-center gap-2">
                              <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 dark:text-white title-font">
                                Lab Card
                              </h3>
                              {/* Greyscale colored balls */}
                              <div
                                className="flex items-center gap-1 ml-2"
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
                                      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
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
                            <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                              Primary
                            </span>
                            <span className="px-3 py-1 bg-secondary text-white rounded-full text-sm font-medium">
                              Secondary
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              Neutral
                            </span>
                            <span className="px-3 py-1 bg-[#D2691E] text-white rounded-full text-sm font-medium">
                              Orange
                            </span>
                            <span className="px-3 py-1 bg-[#20B2AA] text-white rounded-full text-sm font-medium">
                              Teal
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                            Outline Chips
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 border border-primary text-primary rounded-full text-sm font-medium">
                              Primary
                            </span>
                            <span className="px-3 py-1 border border-secondary text-secondary rounded-full text-sm font-medium">
                              Secondary
                            </span>
                            <span className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-sm font-medium">
                              Neutral
                            </span>
                            <span className="px-3 py-1 border border-[#D2691E] text-[#D2691E] rounded-full text-sm font-medium">
                              Orange
                            </span>
                            <span className="px-3 py-1 border border-[#20B2AA] text-[#20B2AA] rounded-full text-sm font-medium">
                              Teal
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                            Small Chips
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 bg-primary text-white rounded-full text-xs font-medium">
                              Small
                            </span>
                            <span className="px-2 py-0.5 bg-secondary text-white rounded-full text-xs font-medium">
                              Chip
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              Tags
                            </span>
                            <span className="px-2 py-0.5 bg-[#D2691E] text-white rounded-full text-xs font-medium">
                              Orange
                            </span>
                            <span className="px-2 py-0.5 bg-[#20B2AA] text-white rounded-full text-xs font-medium">
                              Teal
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                            Interactive Chips
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <button className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                              Clickable
                            </button>
                            <button className="px-3 py-1 bg-secondary text-white rounded-full text-sm font-medium hover:bg-secondary/90 transition-colors">
                              Interactive
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                              Button
                            </button>
                            <button className="px-3 py-1 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors">
                              Outline
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </section>
              </>
            }
          />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/archive" element={<Archive />} />

          <Route path="/music" element={<MusicPlayer />} />

          <Route path="/json-ai-prompts" element={<JsonAiPrompts />} />
          <Route path="/audio-transcript" element={<AudioTranscript />} />
          <Route path="/news" element={<NewsAggregator />} />
        </Routes>
      </Suspense>

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
      {/* Hide MobileTrayMenu on news and music pages */}
      {location.pathname !== "/news" && location.pathname !== "/music" && (
        <MobileTrayMenu />
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
              <List className="w-4 h-4" />
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
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dark Mode Toggle - Hide on news page */}
        {location.pathname !== "/news" && (
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
      </div>
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
