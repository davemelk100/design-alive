import { Suspense, useState, useEffect, lazy } from "react";

// Lazy load icon to avoid blocking critical path
const LazyExternalLink = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ExternalLink }))
);

import { useSettingsSync } from "../hooks/useSettingsSync";

// Font imports moved to globals.css

interface NewsItem {
  id: number;
  title: string;
  source: string;
  url: string;
  publishedDate: string;
  author: string;
  excerpt: string;
  category: string;
  isRss?: boolean;
  image?: string;
  videoUrl?: string;
  videoDuration?: string;
  videoType?: string;
}

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  enabled: boolean;
}

const rssFeeds: RSSFeed[] = [
  {
    id: "ars-technica",
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "technology",
    enabled: true,
  },
  {
    id: "wired",
    name: "WIRED",
    url: "https://www.wired.com/feed/rss",
    category: "technology",
    enabled: true,
  },
  {
    id: "techradar",
    name: "TechRadar",
    url: "https://www.techradar.com/feeds.xml",
    category: "technology",
    enabled: true,
  },
  {
    id: "bleepingcomputer",
    name: "BleepingComputer",
    url: "https://www.bleepingcomputer.com/feed/",
    category: "technology",
    enabled: true,
  },
  {
    id: "smashing-mag",
    name: "SMASHING MAG",
    url: "https://www.smashingmagazine.com/feed/",
    category: "technology",
    enabled: true,
  },

  {
    id: "fox-sports",
    name: "Fox Sports",
    url: "https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30",
    category: "sports",
    enabled: true,
  },

  {
    id: "newsweek",
    name: "Newsweek",
    url: "https://feeds.newsweek.com/feeds/90oh8.rss",
    category: "business",
    enabled: true,
  },
  {
    id: "bbc",
    name: "BBC",
    url: "https://feeds.bbci.co.uk/news/rss.xml",
    category: "business",
    enabled: true,
  },
  {
    id: "forbes",
    name: "Forbes",
    url: "https://www.forbes.com/business/feed/",
    category: "business",
    enabled: true,
  },
  {
    id: "the-economist",
    name: "THE ECONOMIST",
    url: "https://www.economist.com/latest/rss.xml",
    category: "business",
    enabled: true,
  },
  {
    id: "new-york-times",
    name: "NEW YORK TIMES",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    category: "business",
    enabled: true,
  },
  {
    id: "e-online",
    name: "EONLINE",
    url: "https://eol-feeds.eonline.com/rssfeed/us/top_stories",
    category: "entertainment",
    enabled: true,
  },
  {
    id: "new-york-post",
    name: "New York Post",
    url: "https://nypost.com/feed/",
    category: "entertainment",
    enabled: true,
  },

  {
    id: "espn",
    name: "ESPN",
    url: "https://www.espn.com/espn/rss/news",
    category: "sports",
    enabled: true,
  },
  {
    id: "mets-sny",
    name: "Mets - SNY",
    url: "https://sny.tv/mets-feed",
    category: "sports",
    enabled: true,
  },
];

const NewsAggregator = () => {
  // Function to get category for a feed source
  const getFeedCategory = (sourceName: string): string => {
    if (
      [
        "Ars Technica",
        "WIRED",
        "TechRadar",
        "#Windows11",
        "Vice - Tech",
        "BleepingComputer",
        "SMASHING MAG",
      ].includes(sourceName)
    ) {
      return "technology";
    } else if (
      [
        "Fox Sports",
        "CNN - SPORTS",
        "CBS SPORTS",
        "ESPN",
        "Mets - SNY",
      ].includes(sourceName)
    ) {
      return "sports";
    } else if (
      [
        "Newsweek",
        "Fox News",
        "Breitbart",
        "CNN News",
        "BBC",
        "Forbes",
        "THE ECONOMIST",
        "NEW YORK TIMES",
      ].includes(sourceName)
    ) {
      return "business";
    } else if (
      [
        "The Onion",
        "The Hard Times",
        "Lambgoat",
        "No Echo",
        "Soft White Underbelly",
        "New York Post",
        "EONLINE",
      ].includes(sourceName)
    ) {
      return "entertainment";
    } else if (["McDonald's"].includes(sourceName)) {
      return "all"; // Changed from "food" to "all" since food category is removed
    } else {
      return "all";
    }
  };

  // Function to get category icon
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case "technology":
        return "💻";
      case "sports":
        return "⚾";
      case "business":
        return "💼";
      case "entertainment":
        return "🎭";
      case "politics":
        return "🏛️";
      case "custom":
        return "🔗";
      default:
        return "📰";
    }
  };

  // Centralized color system for consistent theming
  const categoryColors = {
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

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [arsTechnicaIndex, setArsTechnicaIndex] = useState(0);
  const [wiredIndex, setWiredIndex] = useState(0);
  const [techradarIndex, setTechradarIndex] = useState(0);
  const [windows11Index, setWindows11Index] = useState(0);

  const [viceTechIndex, setViceTechIndex] = useState(0);
  const [bleepingComputerIndex, setBleepingComputerIndex] = useState(0);
  const [foxSportsIndex, setFoxSportsIndex] = useState(0);
  const [theOnionIndex, setTheOnionIndex] = useState(0);
  const [theHardTimesIndex, setTheHardTimesIndex] = useState(0);
  const [cnnSportsIndex, setCnnSportsIndex] = useState(0);

  const [lambgoatIndex, setLambgoatIndex] = useState(0);
  const [noEchoIndex, setNoEchoIndex] = useState(0);
  const [softWhiteUnderbellyIndex, setSoftWhiteUnderbellyIndex] = useState(0);
  const [newsweekIndex, setNewsweekIndex] = useState(0);
  const [newYorkPostIndex, setNewYorkPostIndex] = useState(0);
  const [foxNewsIndex, setFoxNewsIndex] = useState(0);
  const [cbsSportsIndex, setCbsSportsIndex] = useState(0);
  const [espnIndex, setEspnIndex] = useState(0);
  const [metsSnyIndex, setMetsSnyIndex] = useState(0);

  const [breitbartIndex, setBreitbartIndex] = useState(0);
  const [bbcIndex, setBbcIndex] = useState(0);
  const [forbesIndex, setForbesIndex] = useState(0);
  const [theEconomistIndex, setTheEconomistIndex] = useState(0);
  const [newYorkTimesIndex, setNewYorkTimesIndex] = useState(0);
  const [eonlineIndex, setEonlineIndex] = useState(0);
  const [smashingMagIndex, setSmashingMagIndex] = useState(0);

  const [cnnIndex, setCnnIndex] = useState(0);

  const [techcrunchIndex, setTechcrunchIndex] = useState(0);
  const [mcdonaldsIndex, setMcdonaldsIndex] = useState(0);

  const [activeCategory, setActiveCategory] = useState("all");

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [customFeedUrl, setCustomFeedUrl] = useState("");
  const [customFeedName, setCustomFeedName] = useState("");
  const [customFeedCategory, setCustomFeedCategory] = useState("technology");
  const [isCreatingFeed, setIsCreatingFeed] = useState(false);
  const [feedCreationStatus, setFeedCreationStatus] = useState<{
    type: "success" | "error";
    message: string;
    rssXml?: string;
    siteName?: string;
  } | null>(null);
  const [isRSSModalOpen, setIsRSSModalOpen] = useState(false);

  const [feedStatus, setFeedStatus] = useState<{
    [key: string]: { working: boolean; error?: string };
  }>({});

  // Settings sync hook
  const {
    syncViewMode,
    syncActiveCategory,
    syncCustomFeeds,
    customFeeds,
    getCurrentSettings,
  } = useSettingsSync();

  // Load user settings on mount
  useEffect(() => {
    const savedSettings = getCurrentSettings();
    if (savedSettings) {
      if (savedSettings.viewMode) {
        // Convert old "small" view mode to "grid"
        const viewMode =
          savedSettings.viewMode === "grid" ? "grid" : savedSettings.viewMode;
        setViewMode(viewMode as "list" | "grid");
      }
      if (savedSettings.activeCategory)
        setActiveCategory(savedSettings.activeCategory);
    }
  }, [getCurrentSettings]);

  // Listen for view mode toggle events from global toggle
  useEffect(() => {
    const handleViewModeToggle = (event: CustomEvent) => {
      const newViewMode = event.detail as "list" | "grid";
      setViewMode(newViewMode);
      syncViewMode(newViewMode);
    };

    window.addEventListener(
      "toggleViewMode",
      handleViewModeToggle as EventListener
    );

    return () => {
      window.removeEventListener(
        "toggleViewMode",
        handleViewModeToggle as EventListener
      );
    };
  }, [syncViewMode]);

  // Dispatch event when view mode changes to update global toggle
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("viewModeChanged", { detail: viewMode })
    );
  }, [viewMode]);

  // Helper functions for dynamic cards
  const getCurrentIndex = (sourceName: string) => {
    switch (sourceName) {
      case "Ars Technica":
        return arsTechnicaIndex;
      case "WIRED":
        return wiredIndex;
      case "TechRadar":
        return techradarIndex;
      case "#Windows11":
        return windows11Index;
      case "Vice - Tech":
        return viceTechIndex;
      case "BleepingComputer":
        return bleepingComputerIndex;

      case "Fox Sports":
        return foxSportsIndex;

      case "The Onion":
        return theOnionIndex;
      case "The Hard Times":
        return theHardTimesIndex;
      case "CNN - SPORTS":
        return cnnSportsIndex;

      case "Lambgoat":
        return lambgoatIndex;
      case "No Echo":
        return noEchoIndex;

      case "Soft White Underbelly":
        return softWhiteUnderbellyIndex;

      case "Newsweek":
        return newsweekIndex;
      case "New York Post":
        return newYorkPostIndex;
      case "Fox News":
        return foxNewsIndex;
      case "CBS SPORTS":
        return cbsSportsIndex;
      case "ESPN":
        return espnIndex;
      case "Mets - SNY":
        return metsSnyIndex;
      case "Breitbart":
        return breitbartIndex;
      case "BBC":
        return bbcIndex;
      case "Forbes":
        return forbesIndex;
      case "THE ECONOMIST":
        return theEconomistIndex;
      case "NEW YORK TIMES":
        return newYorkTimesIndex;
      case "EONLINE":
        return eonlineIndex;
      case "SMASHING MAG":
        return smashingMagIndex;

      case "CNN News":
        return cnnIndex;

      case "TechCrunch":
        return techcrunchIndex;
      case "McDonald's":
        return mcdonaldsIndex;
      default:
        return 0;
    }
  };

  const goToPrevious = (sourceName: string) => {
    switch (sourceName) {
      case "Ars Technica":
        goToPreviousArsTechnica();
        break;
      case "WIRED":
        goToPreviousWired();
        break;
      case "TechRadar":
        goToPreviousTechradar();
        break;
      case "#Windows11":
        goToPreviousWindows11();
        break;
      case "Vice - Tech":
        goToPreviousViceTech();
        break;
      case "BleepingComputer":
        goToPreviousBleepingComputer();
        break;

      case "Fox Sports":
        goToPreviousFoxSports();
        break;

      case "The Onion":
        goToPreviousTheOnion();
        break;
      case "The Hard Times":
        goToPreviousTheHardTimes();
        break;
      case "CNN - SPORTS":
        goToPreviousCnnSports();
        break;

      case "Lambgoat":
        goToPreviousLambgoat();
        break;
      case "No Echo":
        goToPreviousNoEcho();
        break;

      case "Soft White Underbelly":
        goToPreviousSoftWhiteUnderbelly();
        break;

      case "Newsweek":
        goToPreviousNewsweek();
        break;
      case "New York Post":
        goToPreviousNewYorkPost();
        break;
      case "Fox News":
        goToPreviousFoxNews();
        break;
      case "CBS SPORTS":
        goToPreviousCbsSports();
        break;
      case "ESPN":
        goToPreviousEspn();
        break;
      case "Mets - SNY":
        goToPreviousMetsSny();
        break;
      case "Breitbart":
        goToPreviousBreitbart();
        break;
      case "BBC":
        goToPreviousBbc();
        break;
      case "Forbes":
        goToPreviousForbes();
        break;
      case "THE ECONOMIST":
        goToPreviousTheEconomist();
        break;
      case "NEW YORK TIMES":
        goToPreviousNewYorkTimes();
        break;
      case "EONLINE":
        goToPreviousEonline();
        break;
      case "SMASHING MAG":
        goToPreviousSmashingMag();
        break;

      case "CNN News":
        goToPreviousCnn();
        break;

      case "TechCrunch":
        goToPreviousTechcrunch();
        break;
      case "McDonald's":
        goToPreviousMcdonalds();
        break;
    }
  };

  const goToNext = (sourceName: string) => {
    switch (sourceName) {
      case "Ars Technica":
        goToNextArsTechnica();
        break;
      case "WIRED":
        goToNextWired();
        break;
      case "TechRadar":
        goToNextTechradar();
        break;
      case "#Windows11":
        goToNextWindows11();
        break;
      case "Vice - Tech":
        goToNextViceTech();
        break;
      case "BleepingComputer":
        goToNextBleepingComputer();
        break;

      case "Fox Sports":
        goToNextFoxSports();
        break;

      case "The Onion":
        goToNextTheOnion();
        break;
      case "The Hard Times":
        goToNextTheHardTimes();
        break;
      case "CNN - SPORTS":
        goToNextCnnSports();
        break;

      case "Lambgoat":
        goToNextLambgoat();
        break;
      case "No Echo":
        goToNextNoEcho();
        break;

      case "Soft White Underbelly":
        goToNextSoftWhiteUnderbelly();
        break;

      case "Newsweek":
        goToNextNewsweek();
        break;
      case "New York Post":
        goToNextNewYorkPost();
        break;
      case "Fox News":
        goToNextFoxNews();
        break;
      case "CBS SPORTS":
        goToNextCbsSports();
        break;
      case "ESPN":
        goToNextEspn();
        break;
      case "Mets - SNY":
        goToNextMetsSny();
        break;
      case "Breitbart":
        goToNextBreitbart();
        break;
      case "BBC":
        goToNextBbc();
        break;
      case "Forbes":
        goToNextForbes();
        break;
      case "THE ECONOMIST":
        goToNextTheEconomist();
        break;
      case "NEW YORK TIMES":
        goToNextNewYorkTimes();
        break;
      case "EONLINE":
        goToNextEonline();
        break;
      case "SMASHING MAG":
        goToNextSmashingMag();
        break;

      case "CNN News":
        goToNextCnn();
        break;

      case "TechCrunch":
        goToNextTechcrunch();
        break;
      case "McDonald's":
        goToNextMcdonalds();
        break;
    }
  };

  // Add Custom RSS Feed
  const addCustomRSSFeed = async () => {
    if (!customFeedUrl || !customFeedName || !customFeedCategory) return;

    setIsCreatingFeed(true);
    setFeedCreationStatus(null);

    try {
      // Validate URL format
      if (!customFeedUrl.trim()) {
        throw new Error("Please enter a valid RSS feed URL");
      }

      // Add protocol if missing
      let urlToProcess = customFeedUrl.trim();
      if (
        !urlToProcess.startsWith("http://") &&
        !urlToProcess.startsWith("https://")
      ) {
        urlToProcess = "https://" + urlToProcess;
      }

      // Validate URL format
      new URL(urlToProcess);

      // Test the RSS feed to make sure it's valid
      const testResponse = await fetch(urlToProcess);
      if (!testResponse.ok) {
        throw new Error(`Failed to fetch RSS feed: ${testResponse.statusText}`);
      }

      const xmlText = await testResponse.text();

      // Basic validation that it's actually an RSS feed
      if (
        !xmlText.includes("<rss") &&
        !xmlText.includes("<feed") &&
        !xmlText.includes("<rdf")
      ) {
        throw new Error("The URL doesn't appear to be a valid RSS feed");
      }

      // Add the new custom feed to the list
      const newCustomFeed: RSSFeed = {
        id: `custom-${Date.now()}`,
        name: customFeedName.trim(),
        url: urlToProcess,
        category: customFeedCategory,
        enabled: true,
      };

      const updatedCustomFeeds = [...customFeeds, newCustomFeed];
      syncCustomFeeds(updatedCustomFeeds);

      // Clear the form
      setCustomFeedUrl("");
      setCustomFeedName("");
      setCustomFeedCategory("technology");

      setFeedCreationStatus({
        type: "success",
        message: "Custom RSS feed added successfully!",
      });

      // Reload feeds to include the new one
      await loadRSSFeeds();
    } catch (error) {
      console.error("Error adding RSS feed:", error);
      setFeedCreationStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to add RSS feed",
      });
    } finally {
      setIsCreatingFeed(false);
    }
  };

  // Helper function to generate default image URLs for sources
  const generateDefaultImageUrl = (sourceName: string): string | null => {
    const defaultImages: { [key: string]: string } = {
      "Ars Technica": "/img/ars-technica-logo.svg",
      WIRED: "https://www.wired.com/verso/static/wired-us/assets/logo.svg",
      TechRadar: "/img/techradar-logo.png",
      "#Windows11": "/img/windows11-logo.png",
      "Vice - Tech": "/img/vice-logo.png",
      BleepingComputer: "/img/bleepingcomputer-logo.png",
      "Fox Sports": "/img/fox-sports-logo.png",
      "CNN - SPORTS": "/img/cnn-sports-logo.png",
      "CBS SPORTS": "/img/cbs-sports-logo.png",
      ESPN: "/img/espn-logo.png",
      "The Onion": "/img/the-onion-logo.png",
      "The Hard Times": "/img/the-hard-times-logo.png",
      Lambgoat: "/img/lambgoat-logo.png",
      "No Echo": "/img/no-echo-logo.png",
      "Soft White Underbelly": "/img/soft-white-underbelly-logo.png",
      Newsweek: "/img/newsweek-logo.png",
      "New York Post": "/img/new-york-post-logo.png",
      "Fox News": "/img/fox-news-logo.png",
      Breitbart: "/img/breitbart-logo.png",
      "CNN News": "/img/cnn-logo.png",
      TechCrunch: "/img/techcrunch-logo.png",
    };

    return defaultImages[sourceName] || null;
  };

  // Function to parse RSS XML
  const parseRSS = (
    xmlText: string,
    sourceName: string,
    category: string
  ): NewsItem[] => {
    try {
      // Check if the response is HTML instead of XML (common error case)
      if (
        xmlText.trim().startsWith("<!DOCTYPE html") ||
        xmlText.trim().startsWith("<html")
      ) {
        console.warn(
          `${sourceName} returned HTML instead of RSS XML - likely a 404 or error page`
        );
        return [];
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      // Try multiple selectors for RSS items
      let items = xmlDoc.querySelectorAll("item");

      // If no items found, try alternative selectors
      if (items.length === 0) {
        items = xmlDoc.querySelectorAll("entry"); // Atom feeds use 'entry'
      }

      // Try other common selectors
      if (items.length === 0) {
        items = xmlDoc.querySelectorAll("article, story, news, post");
      }

      if (items.length === 0) {
        return [];
      }

      const parsedItems: NewsItem[] = [];

      items.forEach((item, index) => {
        try {
          // More flexible title extraction
          const title =
            item.querySelector("title")?.textContent?.trim() ||
            item.querySelector("name")?.textContent?.trim() ||
            item.querySelector("headline")?.textContent?.trim() ||
            "";

          // More flexible link extraction
          let link =
            item.querySelector("link")?.textContent?.trim() ||
            item.querySelector("url")?.textContent?.trim() ||
            item.querySelector("href")?.textContent?.trim() ||
            "";

          // For podcast feeds, if no unique link, use enclosure URL as fallback
          if (!link || link === "") {
            const enclosure = item.querySelector("enclosure");
            if (enclosure) {
              link = enclosure.getAttribute("url") || "";
            }
          }

          // More flexible description extraction
          const description =
            item.querySelector("description")?.textContent?.trim() ||
            item.querySelector("summary")?.textContent?.trim() ||
            item.querySelector("content")?.textContent?.trim() ||
            item.querySelector("excerpt")?.textContent?.trim() ||
            "";

          // More flexible date extraction
          const pubDate =
            item.querySelector("pubDate")?.textContent?.trim() ||
            item.querySelector("published")?.textContent?.trim() ||
            item.querySelector("date")?.textContent?.trim() ||
            item.querySelector("updated")?.textContent?.trim() ||
            new Date().toISOString();

          // More flexible author extraction
          const author =
            item.querySelector("author")?.textContent?.trim() ||
            item.querySelector("dc\\:creator")?.textContent?.trim() ||
            item.querySelector("creator")?.textContent?.trim() ||
            item.querySelector("writer")?.textContent?.trim() ||
            "";

          // Comprehensive image extraction
          let image = "";

          // Try enclosure tags first
          const enclosure = item.querySelector("enclosure[type*='image']");
          if (enclosure) {
            image = enclosure.getAttribute("url") || "";
          }

          // Try media:content tags
          if (!image) {
            const mediaContent = item.querySelector(
              "media\\:content[type*='image'], content[type*='image']"
            );
            if (mediaContent) {
              image = mediaContent.getAttribute("url") || "";
            }
          }

          // Try media:thumbnail
          if (!image) {
            const mediaThumb = item.querySelector(
              "media\\:thumbnail, thumbnail"
            );
            if (mediaThumb) {
              image = mediaThumb.getAttribute("url") || "";
            }
          }

          // Try og:image meta tags
          if (!image) {
            const ogImage = item.querySelector(
              "meta[property='og:image'], meta[property='og:image:secure_url']"
            );
            if (ogImage) {
              image = ogImage.getAttribute("content") || "";
            }
          }

          // Try to extract from description if it contains HTML with images
          if (!image && description.includes("<img")) {
            const imgMatch = description.match(
              /<img[^>]+src=["']([^"']+)["']/i
            );
            if (imgMatch) {
              image = imgMatch[1];
            }
          }

          // Try to extract from content field if it exists
          if (!image) {
            const content = item.querySelector("content")?.textContent || "";
            if (content.includes("<img")) {
              const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
              if (imgMatch) {
                image = imgMatch[1];
              }
            }
          }

          // Try to extract from summary field if it exists
          if (!image) {
            const summary = item.querySelector("summary")?.textContent || "";
            if (summary.includes("<img")) {
              const imgMatch = summary.match(/<img[^>]+src=["']([^"']+)["']/i);
              if (imgMatch) {
                image = imgMatch[1];
              }
            }
          }

          // Try to find any image-like URL in the item
          if (!image) {
            const allElements = item.querySelectorAll("*");
            for (const element of allElements) {
              const url =
                element.getAttribute("url") ||
                element.getAttribute("src") ||
                element.getAttribute("href");
              if (
                url &&
                (url.includes(".jpg") ||
                  url.includes(".jpeg") ||
                  url.includes(".png") ||
                  url.includes(".gif") ||
                  url.includes(".webp"))
              ) {
                image = url;
                break;
              }
            }
          }

          // Try to extract from description if it contains HTML with images
          if (!image && description.includes("<img")) {
            const imgMatch = description.match(
              /<img[^>]+src=["']([^"']+)["']/i
            );
            if (imgMatch) {
              image = imgMatch[1];
            }
          }

          // Try to find any image URL in the item's text content
          if (!image) {
            const allText = item.textContent || "";
            const imageUrlMatch = allText.match(
              /(https?:\/\/[^"\s]+\.(?:jpg|jpeg|png|gif|webp))/i
            );
            if (imageUrlMatch) {
              image = imageUrlMatch[1];
            }
          }

          // If still no image, try to generate a fallback based on the source
          if (!image) {
            // Try to generate a default image URL based on the source
            const defaultImageUrl = generateDefaultImageUrl(sourceName);
            if (defaultImageUrl) {
              image = defaultImageUrl;
            } else {
              // Use a special placeholder value that we'll handle in the UI
              image = `placeholder:${sourceName}`;
            }
          }

          // Extract video content information
          let videoUrl = "";

          // Try to find video media:content
          const videoMediaContent = item.querySelector(
            "media\\:content[medium='video'], media\\:content[type*='video']"
          );
          if (videoMediaContent) {
            videoUrl = videoMediaContent.getAttribute("url") || "";
          }

          // Also check for video enclosure tags
          const videoEnclosure = item.querySelector("enclosure[type*='video']");
          if (videoEnclosure && !videoUrl) {
            videoUrl = videoEnclosure.getAttribute("url") || "";
          }

          // Skip items without essential data
          if (!title || !link) {
            return;
          }

          // Special handling for Lambgoat to filter out forum posts
          if (sourceName === "Lambgoat" && title.includes("Forum:")) {
            return; // Skip this item
          }

          // Special handling for Lambgoat to filter out "Hardcore News & Metal News" entry
          if (
            sourceName === "Lambgoat" &&
            title === "Hardcore News & Metal News"
          ) {
            return; // Skip this item
          }

          // Special handling for Fox News to filter out "Latest Breaking News Videos" entry
          if (
            sourceName === "Fox News" &&
            title === "Latest Breaking News Videos"
          ) {
            return; // Skip this item
          }

          // Clean up description (remove HTML tags)
          const cleanDescription = description
            ? description.replace(/<[^>]*>/g, "").substring(0, 200) + "..."
            : "No description available";

          parsedItems.push({
            id: index + 1,
            title: title,
            source: sourceName,
            url: link,
            publishedDate: pubDate,
            author: author,
            excerpt: cleanDescription,
            category: category,
            isRss: true,
            image: image,
          });
        } catch (itemError) {
          console.warn(
            `Error parsing item ${index} from ${sourceName}:`,
            itemError
          );
          // Continue parsing other items
        }
      });

      const result = parsedItems.slice(0, 10); // Limit to 10 items for carousel
      return result;
    } catch (parseError) {
      console.error(`Error parsing RSS XML for ${sourceName}:`, parseError);
      console.error(`XML content:`, xmlText.substring(0, 1000));
      return []; // Return empty array instead of throwing error
    }
  };

  // Function to fetch RSS feed using reliable CORS proxies
  const fetchRSSFeed = async (feed: RSSFeed): Promise<NewsItem[]> => {
    try {
      // Use reliable CORS proxy services
      const proxyServices = [
        `https://corsproxy.io/?${encodeURIComponent(feed.url)}`,
        `https://thingproxy.freeboard.io/fetch/${feed.url}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
          feed.url
        )}`,
        // Fallback to our Netlify function if available
        `/api/rss-proxy?url=${encodeURIComponent(feed.url)}`,
      ];

      let xmlText = "";

      for (const proxyUrl of proxyServices) {
        try {
          const response = await fetch(proxyUrl, {
            method: "GET",
            headers: {
              Accept: "application/xml, text/xml, */*",
            },
            signal: AbortSignal.timeout(12000), // 12 second timeout
          });

          if (response.ok) {
            xmlText = await response.text();

            if (
              xmlText.length > 100 &&
              (xmlText.includes("<?xml") ||
                xmlText.includes("<rss") ||
                xmlText.includes("<feed"))
            ) {
              break;
            }
          }
        } catch (proxyError) {
          continue;
        }
      }

      if (!xmlText || xmlText.length < 100) {
        console.warn(`All proxy services failed for ${feed.name}`);
        return []; // Return empty array instead of throwing error
      }

      return parseRSS(xmlText, feed.name, feed.category);
    } catch (error) {
      console.error(`Error fetching RSS feed ${feed.name}:`, error);
      return []; // Return empty array instead of throwing error
    }
  };

  // Function to load all RSS feeds
  const loadRSSFeeds = async () => {
    setLoading(true);
    setError(null);

    try {
      const allNewsItems: NewsItem[] = [];

      // Load predefined RSS feeds
      const feedResults = await Promise.allSettled(
        rssFeeds.map(async (feed) => {
          try {
            let items: NewsItem[] = [];

            // Handle local feeds differently
            if (feed.url.startsWith("/feeds/")) {
              try {
                // For local feeds, try to fetch directly from the public directory
                const response = await fetch(feed.url);
                if (response.ok) {
                  const xmlText = await response.text();
                  items = parseRSS(xmlText, feed.name, feed.category);
                } else {
                  console.warn(
                    `Failed to load local feed ${feed.name}: ${response.status}`
                  );
                }
              } catch (localError) {
                console.warn(
                  `Error loading local feed ${feed.name}:`,
                  localError
                );
              }
            } else {
              // For external feeds, use the existing fetchRSSFeed function
              items = await fetchRSSFeed(feed);
            }

            return { feed, items, success: true };
          } catch (feedError) {
            console.warn(`Feed ${feed.name} failed:`, feedError);
            return { feed, items: [], success: false, error: feedError };
          }
        })
      );

      // Load custom feeds
      const customFeedResults = await Promise.allSettled(
        customFeeds
          .filter((feed) => feed.enabled)
          .map(async (feed) => {
            try {
              // For custom feeds, we already have the RSS XML, so parse it directly
              if (feed.rssXml) {
                const items = parseRSS(feed.rssXml, feed.name, feed.category);
                return { feed, items, success: true };
              } else {
                // Fallback to fetching if no RSS XML stored
                const items = await fetchRSSFeed(feed);
                return { feed, items, success: true };
              }
            } catch (feedError) {
              console.warn(`Custom feed ${feed.name} failed:`, feedError);
              return { feed, items: [], success: false, error: feedError };
            }
          })
      );

      // Process successful feeds
      const newFeedStatus: {
        [key: string]: { working: boolean; error?: string };
      } = {};

      // Process regular feeds
      feedResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value.success) {
          allNewsItems.push(...result.value.items);
          newFeedStatus[result.value.feed.name] = { working: true };
        } else if (result.status === "fulfilled" && !result.value.success) {
          console.warn(
            `Feed ${result.value.feed.name} failed to load:`,
            result.value.error
          );

          newFeedStatus[result.value.feed.name] = {
            working: false,
            error:
              result.value.error instanceof Error
                ? result.value.error.message
                : "Unknown error",
          };
        } else if (result.status === "rejected") {
          console.warn(`Feed failed with rejected promise:`, result.reason);
          // For rejected promises, we don't have the feed name, so we can't set specific status
          // This is a fallback case
        }
      });

      // Process custom feeds
      customFeedResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value.success) {
          allNewsItems.push(...result.value.items);
          newFeedStatus[result.value.feed.name] = { working: true };
        } else if (result.status === "fulfilled" && !result.value.success) {
          console.warn(
            `Custom feed ${result.value.feed.name} failed to load:`,
            result.value.error
          );

          newFeedStatus[result.value.feed.name] = {
            working: false,
            error:
              result.value.error instanceof Error
                ? result.value.error.message
                : "Unknown error",
          };
        } else if (result.status === "rejected") {
          console.warn(
            `Custom feed failed with rejected promise:`,
            result.reason
          );
        }
      });

      setFeedStatus(newFeedStatus);

      // Count successful vs failed feeds
      const successfulFeeds =
        feedResults.filter(
          (result) => result.status === "fulfilled" && result.value.success
        ).length +
        customFeedResults.filter(
          (result) => result.status === "fulfilled" && result.value.success
        ).length;
      const totalFeeds =
        rssFeeds.length + customFeeds.filter((feed) => feed.enabled).length;

      if (successfulFeeds === 0) {
        setError(
          "All RSS feeds failed to load. Please check your internet connection and try again."
        );
      } else if (successfulFeeds < totalFeeds) {
        console.warn(`${totalFeeds - successfulFeeds} feeds failed to load`);
        // Don't set error if some feeds are working
      }

      setNewsItems(allNewsItems);

      // Reset all carousel indices
      setArsTechnicaIndex(0);
      setWiredIndex(0);
      setTechradarIndex(0);
      setWindows11Index(0);
      setViceTechIndex(0);

      setFoxSportsIndex(0);
      setTheOnionIndex(0);
      setTheHardTimesIndex(0);
      setCnnSportsIndex(0);

      setLambgoatIndex(0);
      setNoEchoIndex(0);
      setSoftWhiteUnderbellyIndex(0); // Reset Soft White Underbelly carousel
      setNewsweekIndex(0); // Reset Newsweek carousel
      setNewYorkPostIndex(0); // Reset New York Post carousel
      setFoxNewsIndex(0); // Reset Fox News carousel
      setCbsSportsIndex(0); // Reset CBS Sports carousel
      setBreitbartIndex(0); // Reset Breitbart carousel
      setBbcIndex(0); // Reset BBC carousel
      setForbesIndex(0); // Reset Forbes carousel
      setTheEconomistIndex(0); // Reset THE ECONOMIST carousel
      setNewYorkTimesIndex(0); // Reset NEW YORK TIMES carousel
      setEonlineIndex(0); // Reset EONLINE carousel
      setSmashingMagIndex(0); // Reset SMASHING MAG carousel

      setCnnIndex(0); // Reset CNN carousel

      setTechcrunchIndex(0); // Reset TechCrunch carousel
    } catch (error) {
      console.error("Error loading RSS feeds:", error);
      setError("Failed to load RSS feeds. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load feeds on component mount
  useEffect(() => {
    loadRSSFeeds();
  }, []);

  // Auto-update RSS feeds every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadRSSFeeds();
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  // Function to truncate text to 125 characters with ellipsis
  const truncateText = (text: string, maxLength: number = 125) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  // Ars Technica carousel navigation
  const goToNextArsTechnica = () => {
    const arsItems = newsItems.filter((item) => item.source === "Ars Technica");
    if (arsItems.length > 0) {
      setArsTechnicaIndex((prev) => (prev + 1) % arsItems.length);
    }
  };

  const goToPreviousArsTechnica = () => {
    const arsItems = newsItems.filter((item) => item.source === "Ars Technica");
    if (arsItems.length > 0) {
      setArsTechnicaIndex(
        (prev) => (prev - 1 + arsItems.length) % arsItems.length
      );
    }
  };

  // WIRED carousel navigation
  const goToNextWired = () => {
    const wiredItems = newsItems.filter((item) => item.source === "WIRED");
    if (wiredItems.length > 0) {
      setWiredIndex((prev) => (prev + 1) % wiredItems.length);
    }
  };

  const goToPreviousWired = () => {
    const wiredItems = newsItems.filter((item) => item.source === "WIRED");
    if (wiredItems.length > 0) {
      setWiredIndex(
        (prev) => (prev - 1 + wiredItems.length) % wiredItems.length
      );
    }
  };

  // TechRadar carousel navigation
  const goToNextTechradar = () => {
    const techradarItems = newsItems.filter(
      (item) => item.source === "TechRadar"
    );
    if (techradarItems.length > 0) {
      setTechradarIndex((prev) => (prev + 1) % techradarItems.length);
    }
  };

  const goToPreviousTechradar = () => {
    const techradarItems = newsItems.filter(
      (item) => item.source === "TechRadar"
    );
    if (techradarItems.length > 0) {
      setTechradarIndex(
        (prev) => (prev - 1 + techradarItems.length) % techradarItems.length
      );
    }
  };

  // Windows11 carousel navigation
  const goToNextWindows11 = () => {
    const windows11Items = newsItems.filter(
      (item) => item.source === "#Windows11"
    );
    if (windows11Items.length > 0) {
      setWindows11Index((prev) => (prev + 1) % windows11Items.length);
    }
  };

  const goToPreviousWindows11 = () => {
    const windows11Items = newsItems.filter(
      (item) => item.source === "#Windows11"
    );
    if (windows11Items.length > 0) {
      setWindows11Index(
        (prev) => (prev - 1 + windows11Items.length) % windows11Items.length
      );
    }
  };

  // Vice Tech carousel navigation
  const goToNextViceTech = () => {
    const viceTechItems = newsItems.filter(
      (item) => item.source === "Vice - Tech"
    );
    if (viceTechItems.length > 0) {
      setViceTechIndex((prev) => (prev + 1) % viceTechItems.length);
    }
  };

  const goToPreviousViceTech = () => {
    const viceTechItems = newsItems.filter(
      (item) => item.source === "Vice - Tech"
    );
    if (viceTechItems.length > 0) {
      setViceTechIndex(
        (prev) => (prev - 1 + viceTechItems.length) % viceTechItems.length
      );
    }
  };

  // BleepingComputer carousel navigation
  const goToNextBleepingComputer = () => {
    const bleepingComputerItems = newsItems.filter(
      (item) => item.source === "BleepingComputer"
    );
    if (bleepingComputerItems.length > 0) {
      setBleepingComputerIndex(
        (prev) => (prev + 1) % bleepingComputerItems.length
      );
    }
  };

  const goToPreviousBleepingComputer = () => {
    const bleepingComputerItems = newsItems.filter(
      (item) => item.source === "BleepingComputer"
    );
    if (bleepingComputerItems.length > 0) {
      setBleepingComputerIndex(
        (prev) =>
          (prev - 1 + bleepingComputerItems.length) %
          bleepingComputerItems.length
      );
    }
  };

  // Fox Sports carousel navigation
  const goToNextFoxSports = () => {
    const foxSportsItems = newsItems.filter(
      (item) => item.source === "Fox Sports"
    );
    if (foxSportsItems.length > 0) {
      setFoxSportsIndex((prev) => (prev + 1) % foxSportsItems.length);
    }
  };

  const goToPreviousFoxSports = () => {
    const foxSportsItems = newsItems.filter(
      (item) => item.source === "Fox Sports"
    );
    if (foxSportsItems.length > 0) {
      setFoxSportsIndex(
        (prev) => (prev - 1 + foxSportsItems.length) % foxSportsItems.length
      );
    }
  };

  // The Onion carousel navigation
  const goToNextTheOnion = () => {
    const theOnionItems = newsItems.filter(
      (item) => item.source === "The Onion"
    );
    if (theOnionItems.length > 0) {
      setTheOnionIndex((prev) => (prev + 1) % theOnionItems.length);
    }
  };

  const goToPreviousTheOnion = () => {
    const theOnionItems = newsItems.filter(
      (item) => item.source === "The Onion"
    );
    if (theOnionItems.length > 0) {
      setTheOnionIndex(
        (prev) => (prev - 1 + theOnionItems.length) % theOnionItems.length
      );
    }
  };

  // The Hard Times carousel navigation
  const goToNextTheHardTimes = () => {
    const theHardTimesItems = newsItems.filter(
      (item) => item.source === "The Hard Times"
    );
    if (theHardTimesItems.length > 0) {
      setTheHardTimesIndex((prev) => (prev + 1) % theHardTimesItems.length);
    }
  };

  const goToPreviousTheHardTimes = () => {
    const theHardTimesItems = newsItems.filter(
      (item) => item.source === "The Hard Times"
    );
    if (theHardTimesItems.length > 0) {
      setTheHardTimesIndex(
        (prev) =>
          (prev - 1 + theHardTimesItems.length) % theHardTimesItems.length
      );
    }
  };

  // CNN Sports carousel navigation
  const goToNextCnnSports = () => {
    const cnnSportsItems = newsItems.filter(
      (item) => item.source === "CNN - SPORTS"
    );
    if (cnnSportsItems.length > 0) {
      setCnnSportsIndex((prev) => (prev + 1) % cnnSportsItems.length);
    }
  };

  const goToPreviousCnnSports = () => {
    const cnnSportsItems = newsItems.filter(
      (item) => item.source === "CNN - SPORTS"
    );
    if (cnnSportsItems.length > 0) {
      setCnnSportsIndex(
        (prev) => (prev - 1 + cnnSportsItems.length) % cnnSportsItems.length
      );
    }
  };

  // Reddit HxC carousel navigation

  // Lambgoat carousel navigation
  const goToNextLambgoat = () => {
    const lambgoatItems = newsItems.filter(
      (item) => item.source === "Lambgoat"
    );
    if (lambgoatItems.length > 0) {
      setLambgoatIndex((prev) => (prev + 1) % lambgoatItems.length);
    }
  };

  const goToPreviousLambgoat = () => {
    const lambgoatItems = newsItems.filter(
      (item) => item.source === "Lambgoat"
    );
    if (lambgoatItems.length > 0) {
      setLambgoatIndex(
        (prev) => (prev - 1 + lambgoatItems.length) % lambgoatItems.length
      );
    }
  };

  // No Echo carousel navigation
  const goToNextNoEcho = () => {
    const noEchoItems = newsItems.filter((item) => item.source === "No Echo");
    if (noEchoItems.length > 0) {
      setNoEchoIndex((prev) => (prev + 1) % noEchoItems.length);
    }
  };

  const goToPreviousNoEcho = () => {
    const noEchoItems = newsItems.filter((item) => item.source === "No Echo");
    if (noEchoItems.length > 0) {
      setNoEchoIndex(
        (prev) => (prev - 1 + noEchoItems.length) % noEchoItems.length
      );
    }
  };

  // Soft White Underbelly carousel navigation
  const goToNextSoftWhiteUnderbelly = () => {
    const softWhiteUnderbellyItems = newsItems.filter(
      (item) => item.source === "Soft White Underbelly"
    );
    if (softWhiteUnderbellyItems.length > 0) {
      setSoftWhiteUnderbellyIndex(
        (prev) => (prev + 1) % softWhiteUnderbellyItems.length
      );
    }
  };

  const goToPreviousSoftWhiteUnderbelly = () => {
    const softWhiteUnderbellyItems = newsItems.filter(
      (item) => item.source === "Soft White Underbelly"
    );
    if (softWhiteUnderbellyItems.length > 0) {
      setSoftWhiteUnderbellyIndex(
        (prev) =>
          (prev - 1 + softWhiteUnderbellyItems.length) %
          softWhiteUnderbellyItems.length
      );
    }
  };

  // Newsweek carousel navigation
  const goToNextNewsweek = () => {
    const newsweekItems = newsItems.filter(
      (item) => item.source === "Newsweek"
    );
    if (newsweekItems.length > 0) {
      setNewsweekIndex((prev) => (prev + 1) % newsweekItems.length);
    }
  };

  const goToPreviousNewsweek = () => {
    const newsweekItems = newsItems.filter(
      (item) => item.source === "Newsweek"
    );
    if (newsweekItems.length > 0) {
      setNewsweekIndex(
        (prev) => (prev - 1 + newsweekItems.length) % newsweekItems.length
      );
    }
  };

  // New York Post carousel navigation
  const goToNextNewYorkPost = () => {
    const newYorkPostItems = newsItems.filter(
      (item) => item.source === "New York Post"
    );
    if (newYorkPostItems.length > 0) {
      setNewYorkPostIndex((prev) => (prev + 1) % newYorkPostItems.length);
    }
  };

  const goToPreviousNewYorkPost = () => {
    const newYorkPostItems = newsItems.filter(
      (item) => item.source === "New York Post"
    );
    if (newYorkPostItems.length > 0) {
      setNewYorkPostIndex(
        (prev) => (prev - 1 + newYorkPostItems.length) % newYorkPostItems.length
      );
    }
  };

  // Fox News carousel navigation
  const goToNextFoxNews = () => {
    const foxNewsItems = newsItems.filter((item) => item.source === "Fox News");
    if (foxNewsItems.length > 0) {
      setFoxNewsIndex((prev) => (prev + 1) % foxNewsItems.length);
    }
  };

  const goToPreviousFoxNews = () => {
    const foxNewsItems = newsItems.filter((item) => item.source === "Fox News");
    if (foxNewsItems.length > 0) {
      setFoxNewsIndex(
        (prev) => (prev - 1 + foxNewsItems.length) % foxNewsItems.length
      );
    }
  };

  // Breitbart carousel navigation
  const goToNextBreitbart = () => {
    const breitbartItems = newsItems.filter(
      (item) => item.source === "Breitbart"
    );
    if (breitbartItems.length > 0) {
      setBreitbartIndex((prev) => (prev + 1) % breitbartItems.length);
    }
  };

  const goToPreviousBreitbart = () => {
    const breitbartItems = newsItems.filter(
      (item) => item.source === "Breitbart"
    );
    if (breitbartItems.length > 0) {
      setBreitbartIndex(
        (prev) => (prev - 1 + breitbartItems.length) % breitbartItems.length
      );
    }
  };

  // BBC carousel navigation
  const goToNextBbc = () => {
    const bbcItems = newsItems.filter((item) => item.source === "BBC");
    if (bbcItems.length > 0) {
      setBbcIndex((prev) => (prev + 1) % bbcItems.length);
    }
  };

  const goToPreviousBbc = () => {
    const bbcItems = newsItems.filter((item) => item.source === "BBC");
    if (bbcItems.length > 0) {
      setBbcIndex((prev) => (prev - 1 + bbcItems.length) % bbcItems.length);
    }
  };

  // Forbes carousel navigation
  const goToNextForbes = () => {
    const forbesItems = newsItems.filter((item) => item.source === "Forbes");
    if (forbesItems.length > 0) {
      setForbesIndex((prev) => (prev + 1) % forbesItems.length);
    }
  };

  const goToPreviousForbes = () => {
    const forbesItems = newsItems.filter((item) => item.source === "Forbes");
    if (forbesItems.length > 0) {
      setForbesIndex(
        (prev) => (prev - 1 + forbesItems.length) % forbesItems.length
      );
    }
  };

  // THE ECONOMIST carousel navigation
  const goToNextTheEconomist = () => {
    const theEconomistItems = newsItems.filter(
      (item) => item.source === "THE ECONOMIST"
    );
    if (theEconomistItems.length > 0) {
      setTheEconomistIndex((prev) => (prev + 1) % theEconomistItems.length);
    }
  };

  const goToPreviousTheEconomist = () => {
    const theEconomistItems = newsItems.filter(
      (item) => item.source === "THE ECONOMIST"
    );
    if (theEconomistItems.length > 0) {
      setTheEconomistIndex(
        (prev) =>
          (prev - 1 + theEconomistItems.length) % theEconomistItems.length
      );
    }
  };

  // NEW YORK TIMES carousel navigation
  const goToNextNewYorkTimes = () => {
    const newYorkTimesItems = newsItems.filter(
      (item) => item.source === "NEW YORK TIMES"
    );
    if (newYorkTimesItems.length > 0) {
      setNewYorkTimesIndex((prev) => (prev + 1) % newYorkTimesItems.length);
    }
  };

  const goToPreviousNewYorkTimes = () => {
    const newYorkTimesItems = newsItems.filter(
      (item) => item.source === "NEW YORK TIMES"
    );
    if (newYorkTimesItems.length > 0) {
      setNewYorkTimesIndex(
        (prev) =>
          (prev - 1 + newYorkTimesItems.length) % newYorkTimesItems.length
      );
    }
  };

  // EONLINE carousel navigation
  const goToNextEonline = () => {
    const eonlineItems = newsItems.filter((item) => item.source === "EONLINE");
    if (eonlineItems.length > 0) {
      setEonlineIndex((prev) => (prev + 1) % eonlineItems.length);
    }
  };

  const goToPreviousEonline = () => {
    const eonlineItems = newsItems.filter((item) => item.source === "EONLINE");
    if (eonlineItems.length > 0) {
      setEonlineIndex(
        (prev) => (prev - 1 + eonlineItems.length) % eonlineItems.length
      );
    }
  };

  // SMASHING MAG carousel navigation
  const goToNextSmashingMag = () => {
    const smashingMagItems = newsItems.filter(
      (item) => item.source === "SMASHING MAG"
    );
    if (smashingMagItems.length > 0) {
      setSmashingMagIndex((prev) => (prev + 1) % smashingMagItems.length);
    }
  };

  const goToPreviousSmashingMag = () => {
    const smashingMagItems = newsItems.filter(
      (item) => item.source === "SMASHING MAG"
    );
    if (smashingMagItems.length > 0) {
      setSmashingMagIndex(
        (prev) => (prev - 1 + smashingMagItems.length) % smashingMagItems.length
      );
    }
  };

  // CNN carousel navigation
  const goToNextCnn = () => {
    const cnnItems = newsItems.filter((item) => item.source === "CNN News");
    if (cnnItems.length > 0) {
      setCnnIndex((prev) => (prev + 1) % cnnItems.length);
    }
  };

  const goToPreviousCnn = () => {
    const cnnItems = newsItems.filter((item) => item.source === "CNN News");
    if (cnnItems.length > 0) {
      setCnnIndex((prev) => (prev - 1 + cnnItems.length) % cnnItems.length);
    }
  };

  // CBS Sports carousel navigation
  const goToNextCbsSports = () => {
    const cbsSportsItems = newsItems.filter(
      (item) => item.source === "CBS SPORTS"
    );
    if (cbsSportsItems.length > 0) {
      setCbsSportsIndex((prev) => (prev + 1) % cbsSportsItems.length);
    }
  };

  const goToPreviousCbsSports = () => {
    const cbsSportsItems = newsItems.filter(
      (item) => item.source === "CBS SPORTS"
    );
    if (cbsSportsItems.length > 0) {
      setCbsSportsIndex(
        (prev) => (prev - 1 + cbsSportsItems.length) % cbsSportsItems.length
      );
    }
  };

  // ESPN carousel navigation
  const goToNextEspn = () => {
    const espnItems = newsItems.filter((item) => item.source === "ESPN");
    if (espnItems.length > 0) {
      setEspnIndex((prev) => (prev + 1) % espnItems.length);
    }
  };

  const goToPreviousEspn = () => {
    const espnItems = newsItems.filter((item) => item.source === "ESPN");
    if (espnItems.length > 0) {
      setEspnIndex((prev) => (prev - 1 + espnItems.length) % espnItems.length);
    }
  };

  // Mets - SNY carousel navigation
  const goToNextMetsSny = () => {
    const metsSnyItems = newsItems.filter(
      (item) => item.source === "Mets - SNY"
    );
    if (metsSnyItems.length > 0) {
      setMetsSnyIndex((prev) => (prev + 1) % metsSnyItems.length);
    }
  };

  const goToPreviousMetsSny = () => {
    const metsSnyItems = newsItems.filter(
      (item) => item.source === "Mets - SNY"
    );
    if (metsSnyItems.length > 0) {
      setMetsSnyIndex(
        (prev) => (prev - 1 + metsSnyItems.length) % metsSnyItems.length
      );
    }
  };

  // TechCrunch carousel navigation
  const goToNextTechcrunch = () => {
    const techcrunchItems = newsItems.filter(
      (item) => item.source === "TechCrunch"
    );
    if (techcrunchItems.length > 0) {
      setTechcrunchIndex((prev) => (prev + 1) % techcrunchItems.length);
    }
  };

  const goToPreviousTechcrunch = () => {
    const techcrunchItems = newsItems.filter(
      (item) => item.source === "TechCrunch"
    );
    if (techcrunchItems.length > 0) {
      setTechcrunchIndex(
        (prev) => (prev - 1 + techcrunchItems.length) % techcrunchItems.length
      );
    }
  };

  // McDonald's carousel navigation
  const goToNextMcdonalds = () => {
    const mcdonaldsItems = newsItems.filter(
      (item) => item.source === "McDonald's"
    );
    if (mcdonaldsItems.length > 0) {
      setMcdonaldsIndex((prev) => (prev + 1) % mcdonaldsItems.length);
    }
  };

  const goToPreviousMcdonalds = () => {
    const mcdonaldsItems = newsItems.filter(
      (item) => item.source === "McDonald's"
    );
    if (mcdonaldsItems.length > 0) {
      setMcdonaldsIndex(
        (prev) => (prev - 1 + mcdonaldsItems.length) % mcdonaldsItems.length
      );
    }
  };

  return (
    <div
      className="news-page min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-600 dark:text-gray-300"
      style={{ fontFamily: "Courier New, monospace" }}
    >
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <div className="flex relative">
          {/* Main Content Area */}
          <div
            className={`flex-1 pb-20 md:pb-0 min-h-screen ${
              activeCategory === "all"
                ? "bg-gray-100 dark:bg-gray-700"
                : activeCategory === "technology"
                ? "bg-[#fef2de] dark:bg-[#f79d84]/30"
                : activeCategory === "sports"
                ? "bg-[#def5e9] dark:bg-[#59cd90]/30"
                : activeCategory === "business"
                ? "bg-[#d8edf7] dark:bg-[#3fa7d6]/30"
                : activeCategory === "entertainment"
                ? "bg-[#f3e8ff] dark:bg-[#a855f7]/30"
                : activeCategory === "politics"
                ? "bg-[#fdebe6] dark:bg-[#f79d84]/30"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            {/* Error Message */}
            {error && (
              <section className="py-4 sm:py-6 lg:py-8">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Category Title - Above Navigation */}
            <div className="block bg-white dark:bg-gray-800 py-4">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-600 dark:text-gray-300">
                    {activeCategory === "all"
                      ? "All News"
                      : activeCategory === "technology"
                      ? "Technology"
                      : activeCategory === "sports"
                      ? "Sports"
                      : activeCategory === "business"
                      ? "Business"
                      : activeCategory === "entertainment"
                      ? "Entertainment"
                      : activeCategory === "politics"
                      ? "Politics"
                      : activeCategory === "custom"
                      ? "Custom Feeds"
                      : `${
                          activeCategory.charAt(0).toUpperCase() +
                          activeCategory.slice(1)
                        } News`}
                  </h1>
                </div>
              </div>
            </div>

            {/* Top Navigation - Tablet and Desktop Only */}
            <div className="hidden md:block bg-white dark:bg-gray-800">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-8 relative">
                <nav className="flex items-center justify-between pt-4 pb-0">
                  {/* Category buttons - evenly distributed */}
                  <div className="flex items-center justify-between w-full">
                    {/* All News */}
                    <button
                      onClick={() => {
                        setActiveCategory("all");
                        syncActiveCategory("all");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                        activeCategory === "all"
                          ? `${categoryColors.all.bg} ${categoryColors.all.text} rounded-t-lg rounded-b-none`
                          : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg rounded-b-none`
                      }`}
                    >
                      <span className="font-medium uppercase">All News</span>
                    </button>

                    {/* Technology */}
                    <button
                      onClick={() => {
                        setActiveCategory("technology");
                        syncActiveCategory("technology");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                        activeCategory === "technology"
                          ? `${categoryColors.technology.bg} ${categoryColors.technology.text} rounded-t-lg rounded-b-none`
                          : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg rounded-b-none`
                      }`}
                    >
                      <span className="font-medium uppercase">Technology</span>
                    </button>

                    {/* Sports */}
                    <button
                      onClick={() => {
                        setActiveCategory("sports");
                        syncActiveCategory("sports");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                        activeCategory === "sports"
                          ? `${categoryColors.sports.bg} ${categoryColors.sports.text} rounded-t-lg rounded-b-none`
                          : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg rounded-b-none`
                      }`}
                    >
                      <span className="font-medium uppercase">Sports</span>
                    </button>

                    {/* Business */}
                    <button
                      onClick={() => {
                        setActiveCategory("business");
                        syncActiveCategory("business");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                        activeCategory === "business"
                          ? `${categoryColors.business.bg} ${categoryColors.business.text} rounded-t-lg rounded-b-none`
                          : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg rounded-b-none`
                      }`}
                    >
                      <span className="font-medium uppercase">Business</span>
                    </button>

                    {/* Entertainment */}
                    <button
                      onClick={() => {
                        setActiveCategory("entertainment");
                        syncActiveCategory("entertainment");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                        activeCategory === "entertainment"
                          ? `${categoryColors.entertainment.bg} ${categoryColors.entertainment.text} rounded-t-lg rounded-b-none`
                          : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg rounded-b-none`
                      }`}
                    >
                      <span className="font-medium uppercase">
                        Entertainment
                      </span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* RSS Feed Creator Modal */}
            {isRSSModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-600 dark:text-gray-300">
                        Create Custom RSS Feed
                      </h3>
                      <button
                        onClick={() => setIsRSSModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Enter a website URL to generate a custom RSS feed. This
                      will parse the site and create an RSS feed for you. Works
                      best with news sites, blogs, and content-heavy websites.
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">
                      💡 Tip: Enter the URL of an existing RSS feed. Common
                      formats include:
                      <br />• https://example.com/feed
                      <br />• https://example.com/rss
                      <br />• https://example.com/atom
                      <br />• https://feeds.example.com/feed.xml
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (
                          customFeedUrl &&
                          customFeedName &&
                          customFeedCategory &&
                          !isCreatingFeed
                        ) {
                          addCustomRSSFeed();
                        }
                      }}
                      className="flex flex-col gap-3 mb-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          placeholder="Feed Name (e.g., My Blog)"
                          value={customFeedName}
                          onChange={(e) => setCustomFeedName(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-600 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          value={customFeedCategory}
                          onChange={(e) =>
                            setCustomFeedCategory(e.target.value)
                          }
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="technology">Technology</option>
                          <option value="sports">Sports</option>
                          <option value="business">Business</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="politics">Politics</option>
                        </select>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="url"
                          placeholder="RSS Feed URL (e.g., https://example.com/feed)"
                          value={customFeedUrl}
                          onChange={(e) => setCustomFeedUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              customFeedUrl &&
                              customFeedName &&
                              customFeedCategory &&
                              !isCreatingFeed
                            ) {
                              e.preventDefault();
                              addCustomRSSFeed();
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-600 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          disabled={
                            !customFeedUrl ||
                            !customFeedName ||
                            !customFeedCategory ||
                            isCreatingFeed
                          }
                          className="px-6 py-2 bg-blue-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          {isCreatingFeed ? "Adding..." : "Add Feed"}
                        </button>
                      </div>
                    </form>

                    {feedCreationStatus && (
                      <div
                        className={`p-4 rounded-lg ${
                          feedCreationStatus.type === "success"
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                            : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            feedCreationStatus.type === "success"
                              ? "text-green-700 dark:text-green-300"
                              : "text-red-700 dark:text-red-300"
                          }`}
                        >
                          {feedCreationStatus.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* News Grid Section */}
            <section className="py-2 sm:py-3 lg:py-0">
              <div className="w-full py-2 sm:py-3 lg:py-4">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 dark:text-red-400 text-lg mb-4">
                        {error}
                      </p>
                      <button
                        onClick={loadRSSFeeds}
                        className="px-6 py-3 bg-blue-600 text-blue-50 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : newsItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        No news available at the moment.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* View Toggle - Above Cards, Right Aligned */}

                      <div
                        className={`${
                          viewMode === "grid"
                            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                            : "space-y-2 sm:space-y-3 md:space-y-4"
                        }`}
                      >
                        {/* Dynamic News Cards */}
                        {(() => {
                          const filteredFeeds = rssFeeds.filter(
                            (feed) =>
                              activeCategory === "all" ||
                              feed.category === activeCategory
                          );

                          return filteredFeeds.map((feed) => {
                            const feedItems = newsItems.filter(
                              (item) => item.source === feed.name
                            );
                            const currentIndex = getCurrentIndex(feed.name);
                            const currentFeedStatus = feedStatus[feed.name];

                            // Always show the card, even if no items
                            return (
                              <div
                                key={`${feed.id}-${currentIndex}`}
                                className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border-l-4 ${
                                  viewMode === "grid"
                                    ? "min-h-[650px] h-auto"
                                    : "w-full h-auto justify-center relative"
                                }`}
                                style={{
                                  borderLeftColor:
                                    feed.category === "technology"
                                      ? "#f79d84"
                                      : feed.category === "sports"
                                      ? "#59cd90"
                                      : feed.category === "business"
                                      ? "#3fa7d6"
                                      : feed.category === "entertainment"
                                      ? "#a855f7"
                                      : feed.category === "politics"
                                      ? "#f79d84"
                                      : "#6b7280",
                                }}
                              >
                                {/* Card Header */}
                                <div
                                  className={`${
                                    viewMode === "list"
                                      ? "px-3 py-2 sm:px-4 pr-28 sm:pr-36 md:pr-44"
                                      : viewMode === "grid"
                                      ? "px-4 pt-4"
                                      : "px-6 pt-6"
                                  } flex-shrink-0`}
                                >
                                  {/* Top Row - Logo, Title, and Carousel Controls */}
                                  <div
                                    className={`${
                                      viewMode === "list"
                                        ? "flex items-center justify-between"
                                        : viewMode === "grid"
                                        ? "flex items-center justify-between pt-2 pb-4"
                                        : "flex items-center justify-between mb-4 pt-3 pb-6"
                                    }`}
                                  >
                                    {/* Left side: Logo */}
                                    <div
                                      className={`${
                                        viewMode === "list"
                                          ? "flex items-center"
                                          : viewMode === "grid"
                                          ? "flex items-center space-x-3"
                                          : "flex flex-col"
                                      }`}
                                    >
                                      {/* Source Title for all feeds */}
                                      <h4
                                        className={`font-normal text-gray-700 dark:text-gray-300 uppercase tracking-wide flex-shrink-0 ${
                                          viewMode === "list"
                                            ? "text-xs sm:text-sm"
                                            : "text-base"
                                        }`}
                                      >
                                        {feed.name}
                                      </h4>
                                    </div>

                                    {/* Carousel Controls - Show in list view only */}
                                    {viewMode === "list" &&
                                      feedItems.length > 1 && (
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() =>
                                              goToPrevious(feed.name)
                                            }
                                            disabled={feedItems.length <= 1}
                                            className="carousel-button w-10 h-7 text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors leading-none"
                                          >
                                            <span className="flex items-center justify-center h-full translate-y-[2px]">
                                              ←
                                            </span>
                                          </button>
                                          <span className="text-xs text-gray-500 dark:text-gray-400 w-6 h-6 flex items-center justify-center">
                                            {currentIndex + 1}/
                                            {feedItems.length}
                                          </span>
                                          <button
                                            onClick={() => goToNext(feed.name)}
                                            disabled={feedItems.length <= 1}
                                            className="carousel-button w-10 h-7 text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors leading-none"
                                          >
                                            <span className="flex items-center justify-center h-full translate-y-[2px]">
                                              →
                                            </span>
                                          </button>
                                        </div>
                                      )}

                                    {/* Right side: Carousel Controls - Show in grid view only */}
                                    {viewMode === "grid" &&
                                      feedItems.length > 1 && (
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() =>
                                              goToPrevious(feed.name)
                                            }
                                            disabled={feedItems.length <= 1}
                                            className={`carousel-button text-sm text-gray-700 dark:text-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors leading-none ${
                                              viewMode === "grid"
                                                ? "w-8 h-6 text-xs"
                                                : "w-12 h-8"
                                            }`}
                                          >
                                            <span className="flex items-center justify-center h-full translate-y-[2px]">
                                              ←
                                            </span>
                                          </button>
                                          <span
                                            className={`text-gray-500 dark:text-gray-400 flex items-center justify-center mx-1 ${
                                              viewMode === "grid"
                                                ? "text-xs w-6 h-6"
                                                : "text-base w-8 h-8"
                                            }`}
                                          >
                                            {currentIndex + 1}/
                                            {feedItems.length}
                                          </span>
                                          <button
                                            onClick={() => goToNext(feed.name)}
                                            disabled={feedItems.length <= 1}
                                            className={`carousel-button text-sm text-gray-700 dark:text-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors leading-none ${
                                              viewMode === "grid"
                                                ? "w-8 h-6 text-xs"
                                                : "w-12 h-8"
                                            }`}
                                          >
                                            <span className="flex items-center justify-center h-full translate-y-[2px]">
                                              →
                                            </span>
                                          </button>
                                        </div>
                                      )}
                                  </div>

                                  {/* Article Title Row - Show in all view modes */}
                                  {feedItems.length > 0 && (
                                    <div className="mt-0">
                                      <h3
                                        className={`font-semibold text-gray-900 dark:text-gray-600 dark:text-gray-300 leading-tight ${
                                          viewMode === "grid"
                                            ? "text-base"
                                            : viewMode === "list"
                                            ? "text-base sm:text-lg"
                                            : "text-lg"
                                        }`}
                                      >
                                        <a
                                          href={feedItems[currentIndex]?.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer break-words block flex items-center gap-1"
                                        >
                                          {feedItems[currentIndex]?.title || ""}
                                          <Suspense
                                            fallback={
                                              <span className="w-3 h-3 flex-shrink-0">
                                                ↗
                                              </span>
                                            }
                                          >
                                            <LazyExternalLink className="w-3 h-3 flex-shrink-0" />
                                          </Suspense>
                                        </a>
                                      </h3>

                                      {/* Subheading/Excerpt - Show in list view */}
                                      {viewMode === "list" &&
                                        feedItems[currentIndex]?.excerpt &&
                                        feed.name !== "The Hard Times" && (
                                          <div className="mt-2">
                                            <p
                                              className="text-sm text-gray-600 dark:text-gray-400 news-card-excerpt"
                                              style={{
                                                lineHeight: "normal !important",
                                              }}
                                            >
                                              {truncateText(
                                                feedItems[currentIndex]
                                                  ?.excerpt || "",
                                                200
                                              )}
                                            </p>
                                          </div>
                                        )}
                                    </div>
                                  )}

                                  {/* Thumbnail Image or Emoji Placeholder - Only show in list view */}
                                  {viewMode === "list" &&
                                    feedItems.length > 0 && (
                                      <>
                                        {/* Show image if available and not a placeholder */}
                                        {feedItems[currentIndex]?.image &&
                                        !feedItems[
                                          currentIndex
                                        ]?.image!.startsWith("placeholder:") &&
                                        feedItems[currentIndex]?.source !==
                                          "BleepingComputer" ? (
                                          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 md:w-40">
                                            <img
                                              src={
                                                feedItems[currentIndex]?.image
                                              }
                                              alt={
                                                feedItems[currentIndex]?.title
                                              }
                                              className="w-full h-full object-cover rounded-r-lg"
                                              width={160}
                                              height={120}
                                              loading="lazy"
                                              decoding="async"
                                              onError={(e) => {
                                                // Hide broken images
                                                const target = e.currentTarget;
                                                target.style.display = "none";
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          /* Show emoji placeholder when no image or placeholder image */
                                          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 flex items-center justify-center">
                                            <div className="w-full h-full rounded-r-lg flex items-center justify-center">
                                              <span className="text-gray-600 dark:text-gray-300 font-bold text-4xl">
                                                {getCategoryIcon(
                                                  getFeedCategory(
                                                    feedItems[currentIndex]
                                                      ?.source || ""
                                                  )
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}

                                  {/* Article Excerpts - Show in grid and small views */}
                                  {feedItems.length > 0 ? (
                                    <>
                                      {/* Subtitle below headline - Show in grid view only */}
                                      {viewMode === "grid" &&
                                        feedItems[currentIndex]?.excerpt &&
                                        feed.name !== "The Hard Times" && (
                                          <div className="mt-2 flex items-center">
                                            <p className="text-gray-600 dark:text-gray-400 text-sm news-card-excerpt">
                                              {truncateText(
                                                feedItems[currentIndex]
                                                  ?.excerpt || "",
                                                viewMode === "grid" ? 250 : 400
                                              )}
                                            </p>
                                          </div>
                                        )}
                                    </>
                                  ) : (
                                    <div className="text-center py-8">
                                      {currentFeedStatus?.working === false ? (
                                        <div className="text-red-500 dark:text-red-400">
                                          <div className="text-2xl mb-2">
                                            ⚠️
                                          </div>
                                          <div className="text-sm font-medium">
                                            Feed Error
                                          </div>
                                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {currentFeedStatus.error ||
                                              "Failed to load"}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-gray-500 dark:text-gray-400">
                                          <div className="text-sm font-medium">
                                            No Articles
                                          </div>
                                          <div className="text-xs mt-1">
                                            Feed is empty or loading
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Card Content */}
                                <div
                                  className={`px-6 ${
                                    viewMode === "grid" ? "pb-4" : "pb-6"
                                  } ${"flex-1"} flex flex-col justify-end ${
                                    viewMode === "list" ? "hidden" : ""
                                  }`}
                                  style={
                                    viewMode === "list"
                                      ? {}
                                      : {
                                          height: "auto",
                                          minHeight:
                                            viewMode === "grid"
                                              ? "180px"
                                              : "auto",
                                        }
                                  }
                                >
                                  {/* Image or Placeholder */}
                                  {feedItems.length > 0 &&
                                  feedItems[currentIndex]?.image &&
                                  !feedItems[currentIndex]?.image!.startsWith(
                                    "placeholder:"
                                  ) ? (
                                    <div
                                      className={`relative z-0 ${
                                        viewMode === "grid" ? "mt-2" : "mt-auto"
                                      }`}
                                      style={{
                                        height:
                                          viewMode === "grid" ? "auto" : "75px",
                                        minHeight:
                                          viewMode === "grid"
                                            ? "350px"
                                            : "75px",
                                        maxHeight:
                                          viewMode === "grid"
                                            ? "350px"
                                            : "75px",
                                        marginBottom: "15px",
                                      }}
                                    >
                                      <img
                                        src={feedItems[currentIndex]?.image}
                                        alt={feedItems[currentIndex]?.title}
                                        className={`w-full rounded-lg ${
                                          viewMode === "grid"
                                            ? "object-cover"
                                            : "object-contain"
                                        }`}
                                        style={{
                                          height:
                                            viewMode === "grid"
                                              ? "auto"
                                              : "75px",
                                          minHeight:
                                            viewMode === "grid"
                                              ? "350px"
                                              : "75px",
                                          maxHeight: "350px",
                                        }}
                                        onError={(e) => {
                                          // Replace broken image with placeholder
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                          const placeholder =
                                            target.parentElement?.querySelector(
                                              ".image-placeholder"
                                            );
                                          if (placeholder) {
                                            (
                                              placeholder as HTMLElement
                                            ).style.display = "flex";
                                          }
                                        }}
                                      />

                                      {/* Placeholder for when image fails to load */}
                                      <div
                                        className="image-placeholder hidden w-full rounded-lg flex items-center justify-center"
                                        style={{
                                          height:
                                            viewMode === "grid"
                                              ? "auto"
                                              : viewMode === "list"
                                              ? "75px"
                                              : "350px",
                                          minHeight: "350px",
                                          maxHeight: "350px",
                                        }}
                                      >
                                        <div className="w-full h-full rounded-lg flex items-center justify-center">
                                          <div className="text-center flex flex-col justify-center h-full">
                                            <div
                                              className={
                                                viewMode === "grid"
                                                  ? "text-8xl mb-2"
                                                  : "text-6xl mb-2"
                                              }
                                            >
                                              {feedItems[currentIndex]
                                                ?.source === "ESPN" ? (
                                                <img
                                                  src="/img/espn.svg"
                                                  alt="ESPN"
                                                  className="mx-auto"
                                                />
                                              ) : (
                                                <span className="text-gray-600 dark:text-gray-300 font-bold">
                                                  {getCategoryIcon(
                                                    getFeedCategory(
                                                      feedItems[currentIndex]
                                                        ?.source || ""
                                                    )
                                                  )}
                                                </span>
                                              )}
                                            </div>
                                            {feedItems[currentIndex]?.source !==
                                              "ESPN" &&
                                            feedItems[currentIndex]?.source !==
                                              "BleepingComputer" ? (
                                              <div className="text-xs mt-1 font-medium text-gray-600 dark:text-gray-300">
                                                {
                                                  feedItems[currentIndex]
                                                    ?.source
                                                }
                                              </div>
                                            ) : (
                                              <div className="text-xs mt-1 font-medium text-gray-600 dark:text-gray-300 opacity-0">
                                                Placeholder
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Video indicator if video content exists */}
                                      {feedItems[currentIndex]?.videoUrl && (
                                        <div className="absolute top-2 right-2 bg-red-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                          <span>▶️</span>
                                          <span>VIDEO</span>
                                          {feedItems[currentIndex]
                                            ?.videoDuration && (
                                            <span className="ml-1">
                                              {Math.floor(
                                                parseInt(
                                                  feedItems[currentIndex]
                                                    ?.videoDuration || "0"
                                                ) / 60
                                              )}
                                              :
                                              {String(
                                                parseInt(
                                                  feedItems[currentIndex]
                                                    ?.videoDuration || "0"
                                                ) % 60
                                              ).padStart(2, "0")}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    // No image available or placeholder - show styled placeholder
                                    <div
                                      className={`w-full rounded-lg flex items-center justify-center ${
                                        viewMode === "grid" ? "mt-2" : "mt-auto"
                                      }`}
                                      style={{
                                        height: "350px",
                                        minHeight: "350px",
                                        maxHeight: "350px",
                                        marginBottom: "15px",
                                      }}
                                    >
                                      {feedItems.length > 0 &&
                                      feedItems[currentIndex]?.image &&
                                      feedItems[
                                        currentIndex
                                      ]?.image!.startsWith("placeholder:") ? (
                                        // Show styled placeholder for this source
                                        <div className="w-full h-full rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg">
                                          <div className="w-full h-full rounded-lg flex items-center justify-center relative">
                                            <div className="text-center flex flex-col justify-center h-full">
                                              <div className="text-8xl mb-2">
                                                {feedItems[currentIndex]
                                                  ?.source === "ESPN" ? (
                                                  <img
                                                    src="/img/espn.svg"
                                                    alt="ESPN"
                                                    className="w-16 h-16 mx-auto"
                                                  />
                                                ) : (
                                                  <span className="text-gray-600 dark:text-gray-300 font-bold">
                                                    {getCategoryIcon(
                                                      getFeedCategory(
                                                        feedItems[currentIndex]
                                                          ?.source || ""
                                                      )
                                                    )}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="text-xs mt-1 font-medium text-gray-600 dark:text-gray-300 opacity-0">
                                                Placeholder
                                              </div>
                                            </div>

                                            {/* Video indicator if video content exists */}
                                            {feedItems[currentIndex]
                                              ?.videoUrl && (
                                              <div className="absolute top-2 right-2 bg-red-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                                <span>▶️</span>
                                                <span>VIDEO</span>
                                                {feedItems[currentIndex]
                                                  ?.videoDuration && (
                                                  <span className="ml-1">
                                                    {Math.floor(
                                                      parseInt(
                                                        feedItems[currentIndex]
                                                          ?.videoDuration || "0"
                                                      ) / 60
                                                    )}
                                                    :
                                                    {String(
                                                      parseInt(
                                                        feedItems[currentIndex]
                                                          ?.videoDuration || "0"
                                                      ) % 60
                                                    ).padStart(2, "0")}
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ) : (
                                        // Show generic placeholder
                                        <div
                                          className={`w-full rounded-lg flex items-center justify-center relative ${
                                            viewMode === "list"
                                              ? "h-24"
                                              : "h-96"
                                          }`}
                                        >
                                          <div className="text-center text-gray-500 dark:text-gray-400">
                                            <div className="text-8xl mb-2">
                                              {feedItems[currentIndex]
                                                ?.source === "ESPN" ? (
                                                <img
                                                  src="/img/espn.svg"
                                                  alt="ESPN"
                                                  className="mx-auto"
                                                />
                                              ) : (
                                                <span className="text-gray-600 dark:text-gray-300 font-bold">
                                                  {getCategoryIcon(
                                                    getFeedCategory(
                                                      feedItems[currentIndex]
                                                        ?.source || ""
                                                    )
                                                  )}
                                                </span>
                                              )}
                                            </div>
                                            {feedItems[currentIndex]?.source !==
                                              "ESPN" &&
                                            feedItems[currentIndex]?.source !==
                                              "BleepingComputer" ? (
                                              <div className="text-xs mt-1 font-medium">
                                                {
                                                  feedItems[currentIndex]
                                                    ?.source
                                                }
                                              </div>
                                            ) : (
                                              <div className="text-xs mt-1 font-medium opacity-0">
                                                Placeholder
                                              </div>
                                            )}
                                          </div>

                                          {/* Video indicator if video content exists */}
                                          {feedItems[currentIndex]
                                            ?.videoUrl && (
                                            <div className="absolute top-2 right-2 bg-red-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                              <span>▶️</span>
                                              <span>VIDEO</span>
                                              {feedItems[currentIndex]
                                                ?.videoDuration && (
                                                <span className="ml-1">
                                                  {Math.floor(
                                                    parseInt(
                                                      feedItems[currentIndex]
                                                        ?.videoDuration || "0"
                                                    ) / 60
                                                  )}
                                                  :
                                                  {String(
                                                    parseInt(
                                                      feedItems[currentIndex]
                                                        ?.videoDuration || "0"
                                                    ) % 60
                                                  ).padStart(2, "0")}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}

                        {/* Custom Feeds Section */}
                        {customFeeds
                          .filter(
                            (feed) =>
                              feed.enabled &&
                              (activeCategory === "all" ||
                                activeCategory === feed.category ||
                                activeCategory === "custom")
                          )
                          .filter(
                            (feed) => !feed.name.toLowerCase().includes("lawn")
                          )
                          .map((customFeed) => {
                            const customFeedItems = newsItems.filter(
                              (item) => item.source === customFeed.name
                            );

                            return (
                              <div
                                key={`custom-${customFeed.id}`}
                                className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${
                                  viewMode === "list"
                                    ? "h-auto justify-center border-l-4"
                                    : "h-[650px]"
                                }`}
                                style={
                                  viewMode === "list"
                                    ? { borderLeftColor: "#ef4444" }
                                    : { height: "650px" }
                                }
                              >
                                {/* Custom Feed Header */}
                                <div
                                  className={`${
                                    viewMode === "list"
                                      ? "px-3 py-2 sm:px-4 sm:py-3"
                                      : "px-6 pt-6"
                                  } flex-shrink-0`}
                                >
                                  {/* Top Row - Source Title and Carousel Controls */}
                                  <div
                                    className={`flex items-center justify-between ${
                                      viewMode === "list" ? "" : "mb-4"
                                    }`}
                                  >
                                    {/* Source Title */}
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                      {customFeed.name}
                                    </h4>

                                    {/* Carousel Controls - Show in grid view only */}
                                    {viewMode === "grid" &&
                                      customFeedItems.length > 1 && (
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => {
                                              // For custom feeds, we'll need to implement index tracking
                                              // For now, this is a placeholder
                                            }}
                                            disabled={
                                              customFeedItems.length <= 1
                                            }
                                            className="carousel-button w-8 h-6 text-xs text-gray-700 dark:text-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors leading-none"
                                          >
                                            ←
                                          </button>
                                          <span className="text-gray-500 dark:text-gray-400 flex items-center justify-center mx-1 text-xs w-6 h-6">
                                            1/{customFeedItems.length}
                                          </span>
                                          <button
                                            onClick={() => {
                                              // For custom feeds, we'll need to implement index tracking
                                              // For now, this is a placeholder
                                            }}
                                            disabled={
                                              customFeedItems.length <= 1
                                            }
                                            className="carousel-button w-8 h-6 text-xs text-gray-700 dark:text-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors leading-none"
                                          >
                                            →
                                          </button>
                                        </div>
                                      )}
                                  </div>

                                  {/* Second Row - Remove Button (list view only) */}
                                  {viewMode === "list" && (
                                    <div className="flex items-center justify-end mt-2">
                                      {/* Remove Button - Right side */}
                                      <button
                                        onClick={() => {
                                          const updatedCustomFeeds =
                                            customFeeds.filter(
                                              (f) => f.id !== customFeed.id
                                            );
                                          syncCustomFeeds(updatedCustomFeeds);
                                          loadRSSFeeds();
                                        }}
                                        className="w-5 h-5 text-xs text-red-500 hover:text-red-700 bg-white dark:bg-gray-700 rounded border border-red-200 dark:border-red-600 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20"
                                        title="Remove this feed"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  )}

                                  {/* Article Title - Show in grid view only */}
                                  {viewMode === "grid" && (
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-600 dark:text-gray-300 leading-tight">
                                      <a
                                        href={customFeedItems[0]?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1"
                                      >
                                        {truncateText(
                                          customFeedItems[0]?.title || "",
                                          90
                                        )}
                                        <Suspense
                                          fallback={
                                            <span className="w-3 h-3 flex-shrink-0">
                                              ↗
                                            </span>
                                          }
                                        >
                                          <LazyExternalLink className="w-3 h-3 flex-shrink-0" />
                                        </Suspense>
                                      </a>
                                    </h3>
                                  )}

                                  {/* Subtitle below headline - Show in grid view only */}
                                  {viewMode === "grid" &&
                                    customFeedItems[0]?.excerpt && (
                                      <div className="mt-3 flex items-center">
                                        <p
                                          className="text-xs text-gray-600 dark:text-gray-400 news-card-excerpt"
                                          style={{
                                            lineHeight: "normal !important",
                                          }}
                                        >
                                          {truncateText(
                                            customFeedItems[0]?.excerpt || "",
                                            400
                                          )}
                                        </p>
                                      </div>
                                    )}
                                </div>

                                {/* Custom Feed Content */}
                                <div
                                  className={`px-6 ${
                                    viewMode === "grid" ? "pb-0" : "pb-6"
                                  } flex-1 flex flex-col ${
                                    viewMode === "list" ? "hidden" : ""
                                  }`}
                                  style={
                                    viewMode === "list"
                                      ? {}
                                      : {
                                          height:
                                            viewMode === "grid"
                                              ? "120px"
                                              : "200px",
                                        }
                                  }
                                >
                                  {/* Image - Show in grid view only */}
                                  {viewMode === "grid" &&
                                  customFeedItems[0]?.image &&
                                  !customFeedItems[0]?.image!.startsWith(
                                    "placeholder:"
                                  ) ? (
                                    <div
                                      className="relative z-0"
                                      style={{
                                        height: "350px",
                                        marginTop:
                                          viewMode === "grid" ? "8px" : "20px",
                                        marginBottom: "0px",
                                      }}
                                    >
                                      <img
                                        src={customFeedItems[0]?.image}
                                        alt={customFeedItems[0]?.title}
                                        className="w-full h-96 object-cover rounded-lg"
                                        style={{
                                          height: "350px",
                                          minHeight: "350px",
                                          maxHeight: "350px",
                                        }}
                                        onError={(e) => {
                                          // Replace broken image with placeholder
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                          const placeholder =
                                            target.parentElement?.querySelector(
                                              ".image-placeholder"
                                            );
                                          if (placeholder) {
                                            (
                                              placeholder as HTMLElement
                                            ).style.display = "flex";
                                          }
                                        }}
                                      />

                                      {/* Placeholder for when image fails to load */}
                                      <div
                                        className="image-placeholder hidden w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                                        style={{
                                          height: "350px",
                                          minHeight: "350px",
                                          maxHeight: "350px",
                                        }}
                                      >
                                        <div className="text-center text-gray-500 dark:text-gray-400">
                                          <div className="text-6xl mb-2">
                                            🔗
                                          </div>
                                          <div className="text-xs mt-1 font-medium">
                                            Custom Feed
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    // No image available or placeholder - show styled placeholder
                                    <div
                                      className={`w-full rounded-lg flex items-center justify-center ${
                                        viewMode === "grid" ? "mt-2" : "mt-auto"
                                      }`}
                                      style={{
                                        height: "350px",
                                        minHeight: "350px",
                                        maxHeight: "350px",
                                        marginBottom: "15px",
                                      }}
                                    >
                                      {customFeedItems[0]?.image &&
                                      customFeedItems[0]?.image!.startsWith(
                                        "placeholder:"
                                      ) ? (
                                        // Show styled placeholder for this source
                                        <div className="w-full h-full rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-lg">
                                          {(() => {
                                            const sourceName =
                                              customFeedItems[0]?.source || "";
                                            let bgColor = "bg-purple-500"; // Custom feeds use purple

                                            return (
                                              <div
                                                className={`w-full h-full ${bgColor} rounded-lg flex items-center justify-center`}
                                              >
                                                <span className="text-gray-600 dark:text-gray-300 font-bold text-4xl">
                                                  {sourceName.split(" ")[0]}
                                                </span>
                                              </div>
                                            );
                                          })()}
                                        </div>
                                      ) : (
                                        // Show generic placeholder
                                        <div
                                          className={`w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center min-h-[250px] ${
                                            viewMode === "list"
                                              ? "h-24"
                                              : "h-96"
                                          }`}
                                        >
                                          <div className="text-center text-gray-500 dark:text-gray-400">
                                            <div className="text-8xl mb-2">
                                              🔗
                                            </div>
                                            <div className="text-xs mt-1 font-medium">
                                              Custom Feed
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Tray Navigation - Mobile Only */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between max-w-[1200px] mx-auto px-4 sm:px-8 py-3">
              {/* All News */}
              <button
                onClick={() => {
                  setActiveCategory("all");
                  syncActiveCategory("all");
                }}
                className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  activeCategory === "all"
                    ? `${categoryColors.all.bg} ${categoryColors.all.text} rounded-t-lg rounded-b-none`
                    : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg rounded-b-none`
                }`}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                <span className="text-xs font-medium uppercase">All News</span>
              </button>

              {/* Technology */}
              <button
                onClick={() => {
                  setActiveCategory("technology");
                  syncActiveCategory("technology");
                }}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                  activeCategory === "technology"
                    ? `${categoryColors.technology.bg} ${categoryColors.technology.text} rounded-t-lg rounded-b-none`
                    : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg rounded-b-none`
                }`}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                <span className="text-xs font-medium uppercase">Tech</span>
              </button>

              {/* Sports */}
              <button
                onClick={() => {
                  setActiveCategory("sports");
                  syncActiveCategory("sports");
                }}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                  activeCategory === "sports"
                    ? `${categoryColors.sports.bg} ${categoryColors.sports.text} rounded-t-lg rounded-b-none`
                    : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg rounded-b-none`
                }`}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-xs font-medium uppercase">Sports</span>
              </button>

              {/* Business */}
              <button
                onClick={() => {
                  setActiveCategory("business");
                  syncActiveCategory("business");
                }}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                  activeCategory === "business"
                    ? `${categoryColors.business.bg} ${categoryColors.business.text} rounded-t-lg rounded-b-none`
                    : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg rounded-b-none`
                }`}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <span className="text-xs font-medium uppercase">Business</span>
              </button>

              {/* Entertainment */}
              <button
                onClick={() => {
                  setActiveCategory("entertainment");
                  syncActiveCategory("entertainment");
                }}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                  activeCategory === "entertainment"
                    ? `${categoryColors.entertainment.bg} ${categoryColors.entertainment.text} rounded-t-lg rounded-b-none`
                    : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg rounded-b-none`
                }`}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs font-medium uppercase">
                  Entertainment
                </span>
              </button>
            </div>
          </nav>
        </div>
      </Suspense>
    </div>
  );
};

export default NewsAggregator;
