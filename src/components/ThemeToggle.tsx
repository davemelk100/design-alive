import React, { Suspense, lazy } from "react";
import { useTheme } from "../context/ThemeContext";

// Lazy load icons to avoid blocking critical path
const LazySun = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Sun }))
);
const LazyMoon = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Moon }))
);

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "text-black dark:text-white",
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`hover:opacity-70 transition-opacity relative z-10 ${className}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Suspense fallback={<span className="h-4 w-4 sm:h-5 sm:w-5">☀</span>}>
        {isDarkMode ? (
          <LazySun className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <LazyMoon className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </Suspense>
    </button>
  );
};

export default ThemeToggle;
