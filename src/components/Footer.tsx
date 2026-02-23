import { lazy, Suspense } from "react";
import { LinkedInLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { content } from "../content";

// Lazy load icon to avoid blocking critical path
const LazyDribbble = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Dribbble }))
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          {/* Left side - Email and Copyright */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a
              href="mailto:davemelk@gmail.com"
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              davemelk@gmail.com
            </a>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Dave Melkonian. All rights reserved.
            </p>
          </div>

          {/* Right side - Social Links + Dark Mode */}
          <div className="flex items-center gap-4">
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
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              <svg
                className="w-5 h-5 text-brand-dynamic dark:text-gray-300 dark:hidden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <svg
                className="w-5 h-5 text-brand-dynamic dark:text-gray-300 hidden dark:block"
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
            <a
              href={content.navigation.social.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <LinkedInLogoIcon className="h-5 w-5 text-brand-dynamic dark:text-gray-300" />
            </a>
            <a
              href="https://github.com/davemelk100"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="GitHub"
            >
              <GitHubLogoIcon className="h-5 w-5 text-brand-dynamic dark:text-gray-300" />
            </a>
            <a
              href={content.navigation.social.dribbble.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="Dribbble"
            >
              <Suspense fallback={<span className="h-5 w-5">D</span>}>
                <LazyDribbble className="h-5 w-5 text-brand-dynamic dark:text-gray-300" />
              </Suspense>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
