import React, { useState, Suspense, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import { content } from "../content";

// Lazy load all icons to avoid blocking critical path
const LazyX = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.X }))
);
const LazyHome = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Home }))
);
const LazyFileText = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.FileText }))
);
const LazyPalette = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Palette }))
);
const LazyBookOpen = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.BookOpen }))
);
const LazyBriefcase = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Briefcase }))
);
const LazyMail = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Mail }))
);

const idToRoute: Record<string, string> = {
  "current-projects": "/portfolio/lab",
  stories: "/portfolio/stories",
  work: "/portfolio/design-system",
  articles: "/portfolio/articles",
  // career: "/portfolio/career",
  contact: "/portfolio/contact",
};

const MobileTrayMenu: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getNavIcon = (id: string) => {
    const iconProps = { className: "w-6 h-6 text-brand-dynamic dark:text-gray-300" };
    const fallback = <span className="w-6 h-6">·</span>;

    switch (id) {
      case "current-projects":
        return (
          <Suspense fallback={fallback}>
            <LazyHome {...iconProps} />
          </Suspense>
        );
      case "articles":
        return (
          <Suspense fallback={fallback}>
            <LazyFileText {...iconProps} />
          </Suspense>
        );
      case "work":
        return (
          <Suspense fallback={fallback}>
            <LazyPalette {...iconProps} />
          </Suspense>
        );
      case "stories":
        return (
          <Suspense fallback={fallback}>
            <LazyBookOpen {...iconProps} />
          </Suspense>
        );
      case "career":
        return (
          <Suspense fallback={fallback}>
            <LazyBriefcase {...iconProps} />
          </Suspense>
        );
      case "contact":
        return (
          <Suspense fallback={fallback}>
            <LazyMail {...iconProps} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={fallback}>
            <LazyHome {...iconProps} />
          </Suspense>
        );
    }
  };

  const isActiveRoute = (id: string) => {
    const route = idToRoute[id];
    if (!route) return false;
    return location.pathname === route;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between w-full px-2 py-2">
          {[
            { id: "home", label: "Home", route: "/portfolio" },
            { id: "work", label: "Design", route: "/portfolio/design-system" },
            { id: "case-studies", label: "Studies", route: "/case-studies" },
            { id: "articles", label: "Articles", route: "/portfolio/articles" },
            { id: "graphics", label: "UX/UI", route: "/portfolio/graphics" },
            { id: "current-projects", label: "Lab", route: "/portfolio/lab" },
          ].map((item) => {
            const isActive = item.id === "home"
              ? location.pathname === "/portfolio"
              : item.route === "/case-studies" || item.route === "/portfolio/graphics"
              ? location.pathname === item.route
              : isActiveRoute(item.id);
            return (
              <Link
                key={item.id}
                to={item.route}
                className={`flex flex-col items-center gap-1 px-2 py-2 transition-colors rounded-lg ${
                  isActive
                    ? "border-2 border-accent-dynamic text-brand-dynamic bg-accent-dynamic/10"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent"
                }`}
                aria-label={`Navigate to ${item.label}`}
              >
                {(() => {
                  const iconClass = "w-6 h-6 text-brand-dynamic dark:text-gray-300";
                  if (item.id === "case-studies") return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" />
                    </svg>
                  );
                  if (item.id === "graphics") return (
                    <Suspense fallback={<span className="w-6 h-6">·</span>}>
                      <LazyPalette className={iconClass} />
                    </Suspense>
                  );
                  if (item.id === "home") return (
                    <Suspense fallback={<span className="w-6 h-6">·</span>}>
                      <LazyHome className={iconClass} />
                    </Suspense>
                  );
                  return getNavIcon(item.id);
                })()}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[10000] lg:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Menu
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close mobile navigation menu"
              >
                <Suspense fallback={<span className="h-5 w-5">×</span>}>
                  <LazyX className="h-5 w-5 text-brand-dynamic dark:text-gray-400" />
                </Suspense>
              </button>
            </div>

            <div className="space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/portfolio/lab"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Lab
                </Link>
                <Link
                  to="/portfolio/articles"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Articles
                </Link>
                <Link
                  to="/portfolio/graphics"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  UX/UI
                </Link>
                {/* <Link
                  to="/portfolio/stories"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Storytelling
                </Link> */}
              </div>

              {/* Page-specific links */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/case-studies"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Case Studies
                </Link>
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <a
                  href={content.navigation.social.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  LinkedIn
                </a>
                <a
                  href={content.navigation.social.dribbble.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Dribbble
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileTrayMenu;
