import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { content } from "../content";
import { LazyIcon } from "../utils/lazyIcons";
import { idToRoute } from "../config/navigation";

const MobileTrayMenu: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getNavIcon = (id: string) => {
    const iconClass = "w-6 h-6";
    const iconMap: Record<string, string> = {
      "current-projects": "Home",
      articles: "FileText",
      work: "Palette",
      stories: "BookOpen",
      career: "Briefcase",
      contact: "Mail",
    };
    const iconName = iconMap[id] || "Home";
    return <LazyIcon name={iconName} className={iconClass} fallback="·" />;
  };

  const isActiveRoute = (id: string) => {
    const route = idToRoute[id];
    if (!route) return false;
    return location.pathname === route;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t" style={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
        <div className="flex items-center justify-evenly w-full px-2 py-2">
          {[
            { id: "home", label: "Home", route: "/portfolio" },
            { id: "writing", label: "Studies & Articles", route: "/case-studies" },
            { id: "design-dev", label: "Design & Dev", route: "/portfolio/lab" },
          ].map((item) => {
            const isActive = item.id === "home"
              ? location.pathname === "/portfolio"
              : item.id === "writing"
              ? location.pathname === "/case-studies" || location.pathname === "/portfolio/articles"
              : item.id === "design-dev"
              ? location.pathname === "/portfolio/lab" || location.pathname === "/portfolio/graphics"
              : isActiveRoute(item.id);
            return (
              <Link
                key={item.id}
                to={item.route}
                className={`flex flex-col items-center gap-1 px-2 py-2 transition-colors rounded-lg ${
                  isActive
                    ? "border-2 border-brand-dynamic text-brand-dynamic"
                    : "border-2 border-transparent"
                }`}
                style={!isActive ? { color: "hsl(var(--foreground))" } : undefined}
                aria-label={`Navigate to ${item.label}`}
              >
                {(() => {
                  const iconClass = isActive ? "w-6 h-6 text-brand-dynamic" : "w-6 h-6";
                  if (item.id === "writing") return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" />
                    </svg>
                  );
                  if (item.id === "design-dev") return (
                    <LazyIcon name="Palette" className={iconClass} fallback="·" />
                  );
                  if (item.id === "home") return (
                    <LazyIcon name="Home" className={iconClass} fallback="·" />
                  );
                  return getNavIcon(item.id);
                })()}
                <span className="text-xs font-medium text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[10000] md:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Menu
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close mobile navigation menu"
              >
                <LazyIcon name="X" className="h-5 w-5 text-brand-dynamic dark:text-gray-400" fallback="×" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/portfolio/lab"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-foreground/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Design & Dev
                </Link>
                <Link
                  to="/case-studies"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-foreground/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Case Studies & Articles
                </Link>
                {/* <Link
                  to="/portfolio/stories"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-foreground/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Storytelling
                </Link> */}
              </div>

              {/* Page-specific links */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-foreground/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Home
                </Link>
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <a
                  href={content.navigation.social.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-foreground/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  LinkedIn
                </a>
                <a
                  href={content.navigation.social.dribbble.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-foreground/80 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
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
