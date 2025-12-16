import { lazy, Suspense } from "react";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
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

          {/* Right side - Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={content.navigation.social.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <LinkedInLogoIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </a>
            <a
              href={content.navigation.social.dribbble.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="Dribbble"
            >
              <Suspense fallback={<span className="h-5 w-5">D</span>}>
                <LazyDribbble className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Suspense>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
