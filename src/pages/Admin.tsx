import { useState, useEffect } from "react";
import { content } from "../content";
import {
  ArrowLeft,
  LogOut,
  Clock,
  BookOpen,
  Beaker,
  Palette,
  Quote,
  Music,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  checkAdminAuth,
  logoutAdmin,
  getSessionInfo,
} from "../utils/adminAuth";

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

  useEffect(() => {
    // Check authentication first
    if (!checkAdminAuth()) {
      navigate("/admin-login");
      return;
    }

    // Load saved visibility settings from localStorage
    const savedVisibility = localStorage.getItem("contentVisibility");
    if (savedVisibility) {
      setContentVisibility(JSON.parse(savedVisibility));
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
    localStorage.setItem("contentVisibility", JSON.stringify(newVisibility));
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
    localStorage.setItem("contentVisibility", JSON.stringify(newVisibility));
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
    localStorage.setItem("contentVisibility", JSON.stringify(newVisibility));
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
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Admin Dashboard
            </h1>

            {/* Session Status */}
            <div className="flex items-center gap-2 text-nav">
              <Clock className="h-4 w-4 text-white" />
              <span className="text-white">{sessionInfo.timeRemaining}</span>
            </div>
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

        {/* Music Management Section */}
        <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-pink-900 dark:text-pink-100">
                Music Player Management
              </h2>
              <p className="text-pink-700 dark:text-pink-300">
                Access the admin-only music player and management tools.
              </p>
            </div>
            <Music className="h-8 w-8 text-pink-600 dark:text-pink-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-pink-900 dark:text-pink-100 mb-2">
                Music Player
              </h3>
              <p className="text-sm text-pink-700 dark:text-pink-300 mb-4">
                Full-featured MP3 player with playlist management and controls.
              </p>
              <button
                onClick={() => navigate("/music-player")}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors text-sm"
              >
                Launch Player
              </button>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-pink-900 dark:text-pink-100 mb-2">
                Management Panel
              </h3>
              <p className="text-sm text-pink-700 dark:text-pink-300 mb-4">
                Advanced music management tools and settings.
              </p>
              <button
                onClick={() => navigate("/admin-music")}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors text-sm"
              >
                Open Management
              </button>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-8">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            How it works
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              • Changes are saved automatically to your browser's localStorage
            </li>
            <li>• Main Page: Controls visibility on the homepage</li>
            <li>• Archive: Controls visibility in the articles archive</li>
            <li>• You can still access hidden articles directly via URL</li>
            <li>• Settings persist across browser sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
