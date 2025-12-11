import { NewsCategory } from "../types/news";

/**
 * Get category for a feed source based on its name
 */
export const getFeedCategory = (sourceName: string): NewsCategory => {
  const technologySources = [
    "Ars Technica",
    "WIRED",
    "TechRadar",
    "#Windows11",
    "Vice - Tech",
    "BleepingComputer",
    "SMASHING MAG",
  ];

  const sportsSources = [
    "Fox Sports",
    "CNN - SPORTS",
    "CBS SPORTS",
    "ESPN",
    "Mets - SNY",
  ];

  const businessSources = [
    "Newsweek",
    "Fox News",
    "Breitbart",
    "CNN News",
    "BBC",
    "Forbes",
    "THE ECONOMIST",
    "NEW YORK TIMES",
  ];

  const entertainmentSources = [
    "The Onion",
    "The Hard Times",
    "Lambgoat",
    "No Echo",
    "Soft White Underbelly",
    "New York Post",
    "EONLINE",
  ];

  const foodSources = ["McDonald's"];

  if (technologySources.includes(sourceName)) {
    return "technology";
  } else if (sportsSources.includes(sourceName)) {
    return "sports";
  } else if (businessSources.includes(sourceName)) {
    return "business";
  } else if (entertainmentSources.includes(sourceName)) {
    return "entertainment";
  } else if (foodSources.includes(sourceName)) {
    return "food";
  } else {
    return "all";
  }
};

/**
 * Get emoji icon for a category
 */
export const getCategoryIcon = (category: NewsCategory | string): string => {
  switch (category) {
    case "technology":
      return "💻";
    case "sports":
      return "⚾";
    case "business":
      return "💼";
    case "entertainment":
      return "🎭";
    case "food":
      return "🌶️";
    case "politics":
      return "🏛️";
    case "custom":
      return "🔗";
    default:
      return "📰";
  }
};

/**
 * Category color theme configuration
 */
export const categoryColors = {
  all: {
    bg: "bg-gray-100 dark:bg-gray-700",
    text: "text-gray-800 dark:text-gray-200",
    border: "border-gray-300",
    hover: "hover:bg-gray-200 dark:hover:bg-gray-600",
    chip: {
      bg: "bg-gray-200 dark:bg-gray-600",
      text: "text-gray-800 dark:text-gray-200",
      border: "border-gray-300 dark:border-gray-500",
    },
  },
  technology: {
    bg: "bg-[#fef2de] dark:bg-[#f79d84]/30",
    text: "text-gray-800 dark:text-gray-200",
    border: "border-[#f79d84]",
    hover: "hover:bg-[#fef2de] dark:hover:bg-[#f79d84]/20",
    chip: {
      bg: "bg-[#fef2de] dark:bg-[#f79d84]/30",
      text: "text-gray-800 dark:text-gray-200",
      border: "border-[#f79d84] dark:border-[#f79d84]",
    },
  },
  sports: {
    bg: "bg-[#def5e9] dark:bg-[#59cd90]/30",
    text: "text-gray-800 dark:text-gray-200",
    border: "border-[#59cd90]",
    hover: "hover:bg-[#def5e9] dark:hover:bg-[#59cd90]/20",
    chip: {
      bg: "bg-[#def5e9] dark:bg-[#59cd90]/30",
      text: "text-gray-800 dark:text-gray-200",
      border: "border-[#59cd90] dark:border-[#59cd90]",
    },
  },
  business: {
    bg: "bg-[#d8edf7] dark:bg-[#3fa7d6]/30",
    text: "text-gray-800 dark:text-gray-200",
    border: "border-[#3fa7d6]",
    hover: "hover:bg-[#d8edf7] dark:hover:bg-[#3fa7d6]/20",
    chip: {
      bg: "bg-[#d8edf7] dark:bg-[#3fa7d6]/30",
      text: "text-gray-800 dark:text-gray-200",
      border: "border-[#3fa7d6] dark:border-[#3fa7d6]",
    },
  },
  entertainment: {
    bg: "bg-[#f3e8ff] dark:bg-[#a855f7]/30",
    text: "text-gray-800 dark:text-gray-200",
    border: "border-[#a855f7]",
    hover: "hover:bg-[#f3e8ff] dark:hover:bg-[#a855f7]/20",
    chip: {
      bg: "bg-[#f3e8ff] dark:bg-[#a855f7]/30",
      text: "text-gray-800 dark:text-gray-200",
      border: "border-[#a855f7] dark:border-[#a855f7]",
    },
  },
  food: {
    bg: "bg-[#fef2f2] dark:bg-[#ef4444]/30",
    text: "text-gray-800 dark:text-gray-200",
    border: "border-[#ef4444]",
    hover: "hover:bg-[#fef2f2] dark:hover:bg-[#ef4444]/20",
    chip: {
      bg: "bg-[#fef2f2] dark:bg-[#ef4444]/30",
      text: "text-gray-800 dark:text-gray-200",
      border: "border-[#ef4444] dark:border-[#ef4444]",
    },
  },
  politics: {
    bg: "bg-[#fdebe6] dark:bg-[#f97316]/30",
    text: "text-gray-800 dark:text-gray-200",
    border: "border-[#f97316]",
    hover: "hover:bg-[#fdebe6] dark:hover:bg-[#f97316]/20",
    chip: {
      bg: "bg-[#fdebe6] dark:bg-[#f97316]/30",
      text: "text-gray-800 dark:text-gray-200",
      border: "border-[#f97316] dark:border-[#f97316]",
    },
  },
  custom: {
    bg: "bg-[#fdebe6] dark:bg-[#ef4444]/30",
    text: "text-gray-800 dark:text-gray-200",
    border: "border-[#ef4444]",
    hover: "hover:bg-[#fdebe6] dark:hover:bg-[#ef4444]/20",
    chip: {
      bg: "bg-[#fdebe6] dark:bg-[#ef4444]/30",
      text: "text-gray-800 dark:text-gray-200",
      border: "border-[#ef4444] dark:border-[#ef4444]",
    },
  },
};

/**
 * Truncate text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};
