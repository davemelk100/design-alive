import { useState, useEffect } from "react";
import { content } from "../content";
import {
  ArrowLeft,
  LogOut,
  Clock,
  Play,
  Download,
  Upload,
  AlertCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
  checkAdminAuth,
  logoutAdmin,
  getSessionInfo,
} from "../utils/adminAuth";
import { contentVisibilityStorage, storage } from "../utils/storage";
import { forceMigration } from "../utils/storageMigration";

interface ArticleVisibility {
  [key: string]: {
    mainPage: boolean;
    archive: boolean;
  };
}

interface ContentVisibility {
  articles: ArticleVisibility;
  labProjects: { [key: string]: boolean };
  designWork: { [key: string]: boolean };
  testimonials: { [key: string]: boolean };
  sections: {
    articles: boolean;
    lab: boolean;
    designWork: boolean;
    testimonials: boolean;
    career: boolean;
    designSystem: boolean;
  };
}

export default function Admin() {
  const navigate = useNavigate();
  const [contentVisibility, setContentVisibility] = useState<ContentVisibility>(
    {
      articles: {},
      labProjects: {},
      designWork: {},
      testimonials: {},
      sections: {
        articles: true,
        lab: true,
        designWork: true,
        testimonials: true,
        career: true,
        designSystem: true,
      },
    }
  );
  const [isLoading, setIsLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(getSessionInfo());
  const [storageStatus, setStorageStatus] = useState<{
    available: boolean;
    message?: string;
  }>({ available: storage.isAvailable() });

  useEffect(() => {
    // Check authentication first
    if (!checkAdminAuth()) {
      navigate("/admin-login");
      return;
    }

    // Load saved visibility settings from storage
    const savedVisibility = contentVisibilityStorage.getSettings();
    if (savedVisibility && Object.keys(savedVisibility).length > 0) {
      setContentVisibility(savedVisibility as ContentVisibility);
    } else {
      // Initialize all content as visible
      const initialVisibility: ContentVisibility = {
        articles: {},
        labProjects: {},
        designWork: {},
        testimonials: {},
        sections: {
          articles: true,
          lab: true,
          designWork: true,
          testimonials: true,
          career: true,
          designSystem: true,
        },
      };

      // Initialize articles
      content.articles.items.forEach((article) => {
        initialVisibility.articles[article.title] = {
          mainPage: true,
          archive: true,
        };
      });

      // Initialize lab projects
      content.currentProjects.projects.forEach((project) => {
        initialVisibility.labProjects[project.title] = true;
      });

      // Initialize design work
      content.work.projects.forEach((project) => {
        initialVisibility.designWork[project.title] = true;
      });

      // Initialize testimonials
      content.testimonials.items.forEach((testimonial) => {
        initialVisibility.testimonials[testimonial.author] = true;
      });

      setContentVisibility(initialVisibility);
    }
    setIsLoading(false);

    // Set up periodic session check (every 5 minutes)
    const sessionCheckInterval = setInterval(() => {
      const currentSessionInfo = getSessionInfo();
      setSessionInfo(currentSessionInfo);

      if (!currentSessionInfo.isActive) {
        logoutAdmin();
        navigate("/admin-login");
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(sessionCheckInterval);
  }, [navigate]);

  const handleArticleVisibilityToggle = (
    articleTitle: string,
    type: "mainPage" | "archive"
  ) => {
    const currentSettings = contentVisibility.articles[articleTitle] || {
      mainPage: true,
      archive: true,
    };
    const newVisibility = {
      ...contentVisibility,
      articles: {
        ...contentVisibility.articles,
        [articleTitle]: {
          ...currentSettings,
          [type]: !currentSettings[type],
        },
      },
    };
    setContentVisibility(newVisibility);
    try {
      contentVisibilityStorage.setSettings(newVisibility);
      setStorageStatus({ available: true });
    } catch (error) {
      setStorageStatus({
        available: false,
        message: "Failed to save changes. Please try again.",
      });
    }
  };

  const handleContentVisibilityToggle = (
    contentType: "labProjects" | "designWork" | "testimonials",
    itemTitle: string
  ) => {
    const newVisibility = {
      ...contentVisibility,
      [contentType]: {
        ...contentVisibility[contentType],
        [itemTitle]: !contentVisibility[contentType][itemTitle],
      },
    };
    setContentVisibility(newVisibility);
    try {
      contentVisibilityStorage.setSettings(newVisibility);
      setStorageStatus({ available: true });
    } catch (error) {
      setStorageStatus({
        available: false,
        message: "Failed to save changes. Please try again.",
      });
    }
  };

  const handleSectionVisibilityToggle = (
    sectionName: keyof ContentVisibility["sections"]
  ) => {
    const newVisibility = {
      ...contentVisibility,
      sections: {
        ...contentVisibility.sections,
        [sectionName]: !contentVisibility.sections[sectionName],
      },
    };
    setContentVisibility(newVisibility);
    try {
      contentVisibilityStorage.setSettings(newVisibility);
      setStorageStatus({ available: true });
    } catch (error) {
      setStorageStatus({
        available: false,
        message: "Failed to save changes. Please try again.",
      });
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logoutAdmin();
      navigate("/admin-login");
    }
  };

  const handleForceMigration = () => {
    if (
      window.confirm(
        "Force storage migration? This will attempt to migrate any old data."
      )
    ) {
      const result = forceMigration();
      if (result.success) {
        alert(
          `Migration successful! Migrated keys: ${result.migratedKeys.join(
            ", "
          )}`
        );
        window.location.reload();
      } else {
        alert(`Migration failed: ${result.errors.join(", ")}`);
      }
    }
  };

  // Export data functionality
  const exportData = () => {
    try {
      const data = {
        contentVisibility,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `admin-settings-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to export data. Please try again.");
    }
  };

  // Import data functionality
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.contentVisibility) {
          setContentVisibility(data.contentVisibility);
          try {
            contentVisibilityStorage.setSettings(data.contentVisibility);
            setStorageStatus({ available: true });
            alert("Settings imported successfully!");
          } catch (error) {
            setStorageStatus({
              available: false,
              message: "Failed to save imported settings.",
            });
          }
        } else {
          alert("Invalid file format. Please select a valid backup file.");
        }
      } catch (error) {
        alert("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
        <div className="w-full max-w-none">
          <div className="text-center">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 pt-16">
      <div className="w-full max-w-none">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Site
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>

        <div className="bg-gradient-to-r from-black via-gray-600 via-gray-400 via-white via-gray-100 via-gray-500 via-blue-500 via-emerald-500 via-amber-500 to-red-500 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Admin Dashboard
              </h1>
              {!storageStatus.available && (
                <div className="flex items-center gap-2 mt-2 text-amber-300">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {storageStatus.message || "Storage not available"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Export/Import buttons */}
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                title="Export settings backup"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <label className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm cursor-pointer">
                <Upload className="h-4 w-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleForceMigration}
                className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm"
                title="Force storage migration"
              >
                <Upload className="h-4 w-4" />
                Migrate
              </button>

              {/* Session Status */}
              <div className="flex items-center gap-2 text-nav">
                <Clock className="h-4 w-4 text-white" />
                <span className="text-white">{sessionInfo.timeRemaining}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Site Summary */}
        <div className="bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900/20 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Site Overview & Journey
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Purpose & Content
              </h3>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  <strong>Portfolio Site:</strong> Dave Melkonian's digital
                  experience design portfolio showcasing 15+ years of UX/UI work
                  across healthcare, insurance, and SaaS industries.
                </p>
                <p>
                  <strong>Content Sections:</strong> Articles (12 published, 3
                  hidden), Design Work (9 projects), Lab Projects (3
                  experimental), Career History (6 positions), Testimonials (8
                  kudos), and Stories (3 case studies).
                </p>
                <p>
                  <strong>Technical Stack:</strong> React/TypeScript, Tailwind
                  CSS, Vite, with responsive design and dark mode support.
                </p>
                <p>
                  <strong>Special Features:</strong> Music player with 6 tracks,
                  writing gallery with admin controls, and comprehensive content
                  management system.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Development Journey
              </h3>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  <strong>Initial Build:</strong> Started as a simple portfolio
                  with basic sections and navigation. Evolved into a
                  comprehensive content management system.
                </p>
                <p>
                  <strong>Content Management:</strong> Added admin panel with
                  granular visibility controls for all content types, persistent
                  storage with export/import functionality.
                </p>
                <p>
                  <strong>Enhanced Features:</strong> Integrated music player,
                  writing gallery with card-based layout, and sophisticated
                  storage system with migration capabilities.
                </p>
                <p>
                  <strong>Current State:</strong> Fully functional admin system
                  with session management, content visibility controls, and
                  backup/restore functionality.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Content Statistics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600 dark:text-blue-400">
                  12
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Articles
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600 dark:text-green-400">
                  9
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Design Projects
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600 dark:text-purple-400">
                  8
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Testimonials
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600 dark:text-orange-400">
                  6
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Career Positions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Music Player Link */}
        <div className="bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                Music Player
              </h3>
            </div>
            <Link
              to="/music-player"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Play className="h-4 w-4" />
              Open Music Player
            </Link>
          </div>
        </div>

        {/* Writing Gallery Link */}
        <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Writing Gallery
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Admin-only access to writing portfolio
              </p>
            </div>
            <Link
              to="/writing-gallery"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Play className="h-4 w-4" />
              Open Writing Gallery
            </Link>
          </div>
        </div>

        {/* Design System Link */}
        <div className="bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-emerald-900 dark:text-emerald-100 mb-1">
                Design System
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                View design tokens, components, and system documentation
              </p>
            </div>
            <Link
              to="/design-system"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              <Play className="h-4 w-4" />
              Open Design System
            </Link>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Section Visibility Control */}
            <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-6">
              <h2 className="text-xl font-semibold dark:text-white mb-4">
                Section Visibility
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
                Control which sections are visible on the main page.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {Object.entries(contentVisibility.sections).map(
                  ([section, isVisible]) => (
                    <div
                      key={section}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg"
                    >
                      <span className="font-medium dark:text-white capitalize text-nav">
                        {section.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isVisible}
                          onChange={() =>
                            handleSectionVisibilityToggle(
                              section as keyof ContentVisibility["sections"]
                            )
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Lab Projects Visibility Control */}
            <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-6">
              <h2 className="text-xl font-semibold dark:text-white mb-4">
                Lab Projects
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
                Control which lab projects are visible.
              </p>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {content.currentProjects.projects.map((project) => {
                  const isVisible =
                    contentVisibility.labProjects[project.title] ?? true;
                  return (
                    <div
                      key={project.title}
                      className="p-3 bg-white dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium dark:text-white text-nav">
                            {project.title}
                          </h3>
                          <p className="text-caption text-gray-600 dark:text-gray-400 mt-1">
                            {project.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isVisible}
                            onChange={() =>
                              handleContentVisibilityToggle(
                                "labProjects",
                                project.title
                              )
                            }
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Article Visibility Control */}
            <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-6">
              <h2 className="text-xl font-semibold dark:text-white mb-4">
                Articles
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
                Control article visibility on main page and archive.
              </p>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {content.articles.items.map((article) => {
                  const settings = contentVisibility.articles[
                    article.title
                  ] || {
                    mainPage: true,
                    archive: true,
                  };
                  return (
                    <div
                      key={article.title}
                      className="p-3 bg-white dark:bg-gray-700 rounded-lg"
                    >
                      <div className="mb-3">
                        <h3 className="font-medium dark:text-white text-nav">
                          {article.title}
                        </h3>
                        <p className="text-caption text-gray-600 dark:text-gray-400 mt-1">
                          {article.date}
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={settings.mainPage}
                              onChange={() =>
                                handleArticleVisibilityToggle(
                                  article.title,
                                  "mainPage"
                                )
                              }
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                              Main
                            </span>
                          </label>
                        </div>

                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={settings.archive}
                              onChange={() =>
                                handleArticleVisibilityToggle(
                                  article.title,
                                  "archive"
                                )
                              }
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                              Archive
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Design Work Visibility Control */}
            <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-6">
              <h2 className="text-xl font-semibold dark:text-white mb-4">
                Design Work
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Control which design projects are visible.
              </p>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {content.work.projects.map((project) => {
                  const isVisible =
                    contentVisibility.designWork[project.title] ?? true;
                  return (
                    <div
                      key={project.title}
                      className="p-3 bg-white dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium dark:text-white text-sm">
                            {project.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {project.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isVisible}
                            onChange={() =>
                              handleContentVisibilityToggle(
                                "designWork",
                                project.title
                              )
                            }
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section - Full Width */}
        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold dark:text-white mb-4">
            Testimonials
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Control which testimonials are visible on the main page.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
            {content.testimonials.items.map((testimonial) => {
              const isVisible =
                contentVisibility.testimonials[testimonial.author] ?? true;
              return (
                <div
                  key={testimonial.author}
                  className="p-3 bg-white dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium dark:text-white text-sm">
                        {testimonial.author}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 line-clamp-3">
                        {testimonial.quote}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-3">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isVisible}
                        onChange={() =>
                          handleContentVisibilityToggle(
                            "testimonials",
                            testimonial.author
                          )
                        }
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
