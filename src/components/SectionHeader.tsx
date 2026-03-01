import React from "react";
import { Link } from "react-router-dom";
import { LazyIcon } from "../utils/lazyIcons";

const SectionHeader = ({
  title,
  subtitle,
  className = "",
  showArchiveLink = false,
  showUpArrow = false,
  icon,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  showArchiveLink?: boolean;
  showUpArrow?: boolean;
  icon?: React.ReactNode;
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="font-bold title-font leading-tight text-brand-dynamic">
            {title}
          </h2>
          {icon && <div className="flex items-center gap-2">{icon}</div>}
          {showUpArrow && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-brand-dynamic text-white p-2 rounded-full shadow-lg hover:opacity-80 transition-opacity"
              aria-label="Scroll to top"
            >
              <LazyIcon name="ArrowUp" className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {showArchiveLink && (
            <Link
              to="/archive"
              className="text-nav text-brand-dynamic hover:text-brand-dynamic/80 underline sm:text-base"
            >
              View Archive
            </Link>
          )}
        </div>
      </div>
      {subtitle && (
        <p className="sm:text-base text-foreground/80 mb-6 sm:mb-8 lg:mb-10">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
