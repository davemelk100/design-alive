import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  FileText,
  Palette,
  BookOpen,
  Briefcase,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { content } from "../content";

const MobileTrayMenu: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const location = useLocation();

  const handleNavClick = (id: string) => {
    if (location.pathname === "/") {
      // If we're on the main page, scroll to the section
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're on another page, navigate to the main page and scroll
      window.location.href = `/#${id}`;
    }
    setIsMobileMenuOpen(false);
  };

  const getNavIcon = (id: string) => {
    switch (id) {
      case "current-projects":
        return <Home className="w-6 h-6" />;
      case "articles":
        return <FileText className="w-6 h-6" />;
      case "work":
        return <Palette className="w-6 h-6" />;
      case "stories":
        return <BookOpen className="w-6 h-6" />;
      case "career":
        return <Briefcase className="w-6 h-6" />;
      case "design-system":
        return <Settings className="w-6 h-6" />;
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  const isActiveSection = (id: string) => {
    return activeSection === id;
  };

  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const sections = content.navigation.links.map((link) => link.id);
      let currentSection = "";

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const isInView =
            rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
          if (isInView) {
            currentSection = sectionId;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto px-2 py-2">
          {content.navigation.links.map((link) => {
            const isActive = isActiveSection(link.id);
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex flex-col items-center gap-1 px-2 py-2 transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                }`}
                aria-label={`Navigate to ${link.text}`}
              >
                {getNavIcon(link.id)}
                <span className="text-xs font-medium">{link.text}</span>
              </button>
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
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick("current-projects")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Lab section"
                >
                  Lab
                </button>
                <button
                  onClick={() => handleNavClick("articles")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Articles section"
                >
                  Articles
                </button>
                <button
                  onClick={() => handleNavClick("work")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Designs section"
                >
                  Designs
                </button>
                <button
                  onClick={() => handleNavClick("stories")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Storytelling section"
                >
                  Storytelling
                </button>
                <button
                  onClick={() => handleNavClick("career")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Career section"
                >
                  Career
                </button>
                <button
                  onClick={() => handleNavClick("skills-and-software")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Skills and Software section"
                >
                  Skills & Software
                </button>
                <button
                  onClick={() => handleNavClick("design-system")}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  aria-label="Navigate to Design System section"
                >
                  Design System
                </button>
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
