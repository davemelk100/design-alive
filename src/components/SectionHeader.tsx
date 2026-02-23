import React from "react";
import { Link } from "react-router-dom";
import IconWrapper from "./IconWrapper";

const LazyArrowUp = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ArrowUp })),
);
const LazyLayoutGrid = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.LayoutGrid })),
);
const LazyList = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.List })),
);

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
          <h2 className="font-bold title-font leading-tight text-brand-dynamic dark:text-white">
            {title}
          </h2>
          {icon && <div className="flex items-center gap-2">{icon}</div>}
          {showUpArrow && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-brand-dynamic text-white p-2 rounded-full shadow-lg hover:opacity-80 transition-opacity"
              aria-label="Scroll to top"
            >
              <IconWrapper
                Icon={LazyArrowUp}
                className="h-4 w-4 text-white dark:text-white"
              />
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
                <IconWrapper Icon={LazyLayoutGrid} className="h-4 w-4 text-brand-dynamic dark:text-gray-300" />
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
                <IconWrapper Icon={LazyList} className="h-4 w-4 text-brand-dynamic dark:text-gray-300" />
              </button>
            </div>
          )}
          {showArchiveLink && (
            <Link
              to="/archive"
              className="text-nav text-brand-dynamic hover:text-brand-dynamic/80 dark:text-white dark:hover:text-gray-300 underline sm:text-base"
            >
              View Archive
            </Link>
          )}
        </div>
      </div>
      {subtitle && (
        <p className="sm:text-base text-muted-foreground mb-6 sm:mb-8 lg:mb-10">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
