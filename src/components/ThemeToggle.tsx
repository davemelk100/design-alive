import React from "react";
import { useTheme } from "../context/ThemeContext";
import { LazyIcon } from "../utils/lazyIcons";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "text-foreground",
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`hover:opacity-70 transition-opacity relative z-10 ${className}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <LazyIcon name="Sun" className="h-4 w-4 sm:h-5 sm:w-5" fallback="☀" />
      ) : (
        <LazyIcon name="Moon" className="h-4 w-4 sm:h-5 sm:w-5" fallback="☽" />
      )}
    </button>
  );
};

export default ThemeToggle;
