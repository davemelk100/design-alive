import { Suspense, useState, useEffect } from "react";

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
    id: "windows11",
    name: "#Windows11",
    url: "https://rss.app/feeds/tMbiKRyJYYawUbRX.xml",
    category: "technology",
    enabled: true,
  },
  {
    id: "vice-tech",
    name: "Vice - Tech",
    url: "https://rss.app/feeds/LNJYM5UVm77UUI0l.xml",
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
    id: "espn",
    name: "ESPN",
    url: "https://www.espn.com/espn/rss/news",
    category: "sports",
    enabled: true,
  },
  {
    id: "the-onion",
    name: "The Onion",
    url: "https://rss.app/feeds/5J4NfaeokQ4r4GGP.xml",
    category: "entertainment",
    enabled: true,
  },
  {
    id: "the-hard-times",
    name: "The Hard Times",
    url: "https://rss.app/feeds/wWxWK2sGD1AJ8NXu.xml",
    category: "entertainment",
    enabled: true,
  },

  {
    id: "lambgoat",
    name: "Lambgoat",
    url: "https://rss.app/feeds/rbqQqO2y53KWY7C2.xml",
    category: "entertainment",
    enabled: true,
  },
  {
    id: "no-echo",
    name: "No Echo",
    url: "https://rss.app/feeds/6VPbwVscIplNrYkC.xml",
    category: "entertainment",
    enabled: true,
  },
  {
    id: "soft-white-underbelly",
    name: "Soft White Underbelly",
    url: "https://rss.app/feeds/fqdEpS42RgOKsQ8W.xml",
    category: "entertainment",
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
    id: "new-york-post",
    name: "New York Post",
    url: "https://nypost.com/feed/",
    category: "entertainment",
    enabled: true,
  },
  {
    id: "fox-news",
    name: "Fox News",
    url: "https://rss.app/feeds/jmwv7HSN9sLVzyMP.xml",
    category: "business",
    enabled: true,
  },
  {
    id: "breitbart",
    name: "Breitbart",
    url: "https://rss.app/feeds/Ez9O0bz1UTzcmRJu.xml",
    category: "business",
    enabled: true,
  },

  {
    id: "cnn",
    name: "CNN News",
    url: "https://rss.app/feeds/OJWoTBSij0sRCOiv.xml",
    category: "business",
    enabled: true,
  },

  {
    id: "cnn-sports",
    name: "CNN - SPORTS",
    url: "https://rss.app/feeds/692Tsxos17wzrYX6.xml",
    category: "sports",
    enabled: true,
  },
  {
    id: "cbs-sports",
    name: "CBS SPORTS",
    url: "https://rss.app/feeds/3woxRS3rir9rtQFO.xml",
    category: "sports",
    enabled: true,
  },
];

const NewsAggregator = () => {
  // Centralized color system for consistent theming
  const categoryColors = {
    all: {
      bg: "bg-blue-50 dark:bg-blue-900/30",
      text: "text-blue-900 dark:text-blue-100",
      border: "border-blue-300",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-700",
      chip: {
        bg: "bg-blue-100 dark:bg-blue-800/50",
        text: "text-blue-800 dark:text-blue-200",
        border: "border-blue-300 dark:border-blue-600",
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
  const [foxSportsIndex, setFoxSportsIndex] = useState(0);
  const [espnIndex, setEspnIndex] = useState(0);
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
  const [breitbartIndex, setBreitbartIndex] = useState(0);
  const [cnnIndex, setCnnIndex] = useState(0);

  const [techcrunchIndex, setTechcrunchIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "small">("grid");
  const [feedStatus, setFeedStatus] = useState<{
    [key: string]: { working: boolean; error?: string };
  }>({});

  // Settings sync hook
  const { syncViewMode, syncActiveCategory, getCurrentSettings } =
    useSettingsSync();

  // Load user settings on mount
  useEffect(() => {
    const savedSettings = getCurrentSettings();
    if (savedSettings) {
      if (savedSettings.viewMode) setViewMode(savedSettings.viewMode);
      if (savedSettings.activeCategory)
        setActiveCategory(savedSettings.activeCategory);
    }
  }, [getCurrentSettings]);

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

      case "Fox Sports":
        return foxSportsIndex;
      case "ESPN":
        return espnIndex;
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
      case "Breitbart":
        return breitbartIndex;

      case "CNN News":
        return cnnIndex;

      case "TechCrunch":
        return techcrunchIndex;
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

      case "Fox Sports":
        goToPreviousFoxSports();
        break;
      case "ESPN":
        goToPreviousEspn();
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
      case "Breitbart":
        goToPreviousBreitbart();
        break;

      case "CNN News":
        goToPreviousCnn();
        break;

      case "TechCrunch":
        goToPreviousTechcrunch();
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

      case "Fox Sports":
        goToNextFoxSports();
        break;
      case "ESPN":
        goToNextEspn();
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
      case "Breitbart":
        goToNextBreitbart();
        break;

      case "CNN News":
        goToNextCnn();
        break;

      case "TechCrunch":
        goToNextTechcrunch();
        break;
    }
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
          const link =
            item.querySelector("link")?.textContent?.trim() ||
            item.querySelector("url")?.textContent?.trim() ||
            item.querySelector("href")?.textContent?.trim() ||
            "";

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
            // Use a special placeholder value that we'll handle in the UI
            image = `placeholder:${sourceName}`;
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

          // Log image extraction result

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

      return parsedItems.slice(0, 10); // Limit to 10 items for carousel
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
      const feedResults = await Promise.allSettled(
        rssFeeds.map(async (feed) => {
          try {
            const items = await fetchRSSFeed(feed);
            return { feed, items, success: true };
          } catch (feedError) {
            console.warn(`Feed ${feed.name} failed:`, feedError);
            return { feed, items: [], success: false, error: feedError };
          }
        })
      );

      // Process successful feeds
      const newFeedStatus: {
        [key: string]: { working: boolean; error?: string };
      } = {};

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

      setFeedStatus(newFeedStatus);

      // Count successful vs failed feeds
      const successfulFeeds = feedResults.filter(
        (result) => result.status === "fulfilled" && result.value.success
      ).length;
      const totalFeeds = rssFeeds.length;

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

  return (
    <div
      className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white"
      style={{ fontFamily: "Helvetica, Roboto, sans-serif !important" }}
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
          {/* Mobile Navigation Toggle */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Mobile Navigation Backdrop */}
          {isMobileNavOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsMobileNavOpen(false)}
            />
          )}

          {/* Left Navigation Sidebar */}
          <nav
            className={`${
              isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4 transition-transform duration-300 ease-in-out lg:transition-none lg:block flex flex-col`}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  davemelk news
                </h2>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    className="w-5 h-5"
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
            </div>

            {/* Category Tabs */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveCategory("all");
                  syncActiveCategory("all");
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors border-l-4 ${
                  activeCategory === "all"
                    ? `${categoryColors.all.bg} ${categoryColors.all.text} ${categoryColors.all.border}`
                    : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${categoryColors.all.border}`
                }`}
              >
                <span className="font-medium">All News</span>
              </button>

              <button
                onClick={() => {
                  setActiveCategory("technology");
                  syncActiveCategory("technology");
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors border-l-4 ${
                  activeCategory === "technology"
                    ? `${categoryColors.technology.bg} ${categoryColors.technology.text} ${categoryColors.technology.border}`
                    : `text-gray-700 dark:text-gray-300 ${categoryColors.technology.hover} ${categoryColors.technology.border}`
                }`}
              >
                <span className="font-medium">Technology</span>
              </button>

              <button
                onClick={() => {
                  setActiveCategory("sports");
                  syncActiveCategory("sports");
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors border-l-4 ${
                  activeCategory === "sports"
                    ? `${categoryColors.sports.bg} ${categoryColors.sports.text} ${categoryColors.sports.border}`
                    : `text-gray-700 dark:text-gray-300 ${categoryColors.sports.hover} ${categoryColors.sports.border}`
                }`}
              >
                <span className="font-medium">Sports</span>
              </button>

              <button
                onClick={() => {
                  setActiveCategory("business");
                  syncActiveCategory("business");
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors border-l-4 ${
                  activeCategory === "business"
                    ? `${categoryColors.business.bg} ${categoryColors.business.text} ${categoryColors.business.border}`
                    : `text-gray-700 dark:text-gray-300 ${categoryColors.business.hover} ${categoryColors.business.border}`
                }`}
              >
                <span className="font-medium">Business</span>
              </button>

              <button
                onClick={() => {
                  setActiveCategory("entertainment");
                  syncActiveCategory("entertainment");
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors border-l-4 ${
                  activeCategory === "entertainment"
                    ? `${categoryColors.entertainment.bg} ${categoryColors.entertainment.text} ${categoryColors.entertainment.border}`
                    : `text-gray-700 dark:text-gray-300 ${categoryColors.entertainment.hover} ${categoryColors.entertainment.border}`
                }`}
              >
                <span className="font-medium">Entertainment</span>
              </button>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 lg:ml-0">
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

            {/* News Grid Section */}
            <section className="py-4 sm:py-6 lg:py-8">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
                {/* Dynamic Category Title and View Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div className="w-full">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {activeCategory === "all"
                        ? "All News"
                        : activeCategory === "technology"
                        ? "Technology News"
                        : activeCategory === "sports"
                        ? "Sports News"
                        : activeCategory === "business"
                        ? "Business News"
                        : activeCategory === "entertainment"
                        ? "Entertainment News"
                        : activeCategory === "politics"
                        ? "Politics News"
                        : "News"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {activeCategory === "all"
                        ? "Latest articles from all categories"
                        : `Latest ${activeCategory} articles and updates`}
                    </p>
                  </div>

                  {/* View Toggle - Hidden on mobile, visible on tablet and desktop */}
                  <div className="hidden sm:flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Columns
                    </span>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                      <button
                        onClick={() => {
                          setViewMode("list");
                          syncViewMode("list");
                        }}
                        className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
                          viewMode === "list"
                            ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <span className="text-sm font-bold">1</span>
                      </button>
                      <button
                        onClick={() => {
                          setViewMode("grid");
                          syncViewMode("grid");
                        }}
                        className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
                          viewMode === "grid"
                            ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <span className="text-sm font-bold">2</span>
                      </button>
                      <button
                        onClick={() => {
                          setViewMode("small");
                          syncViewMode("small");
                        }}
                        className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
                          viewMode === "small"
                            ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <span className="text-sm font-bold">4</span>
                      </button>
                    </div>
                  </div>
                </div>

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
                  <div
                    className={`${
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                        : viewMode === "small"
                        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
                                ? "h-[500px] sm:h-[600px]"
                                : viewMode === "small"
                                ? "h-[320px]"
                                : "w-full h-auto justify-center min-h-[95px] sm:min-h-[105px] md:min-h-[115px] relative"
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
                                  ? "px-3 py-2 sm:px-4 sm:py-3 pr-28 sm:pr-36 md:pr-44"
                                  : viewMode === "small"
                                  ? "px-4 pt-4"
                                  : "px-6 pt-6"
                              } flex-shrink-0`}
                            >
                              {/* Top Row - Logo, Title, and Carousel Controls */}
                              <div
                                className={`${
                                  viewMode === "list"
                                    ? "flex items-center justify-between"
                                    : viewMode === "small"
                                    ? "flex items-center justify-between"
                                    : "flex items-center justify-between mb-4"
                                }`}
                              >
                                {/* Left side: Logo and Content */}
                                <div
                                  className={`flex-1 min-w-0 ${
                                    viewMode === "list"
                                      ? "flex items-center space-x-4"
                                      : viewMode === "small"
                                      ? "flex items-center space-x-3"
                                      : "flex flex-col"
                                  }`}
                                >
                                  {/* WIRED Logo and Title - Stacked and aligned */}
                                  {feed.name === "WIRED" ? (
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="https://www.wired.com/verso/static/wired-us/assets/logo.svg"
                                        alt="wired"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "Ars Technica" ? (
                                    /* Ars Technica Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/ars-technica-logo.svg"
                                        alt="ars technica"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "TechRadar" ? (
                                    /* TechRadar Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/techradar-logo.svg"
                                        alt="techradar"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "Vice - Tech" ? (
                                    /* VICE Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/vice-logo.png"
                                        alt="vice"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "The Onion" ? (
                                    /* The Onion Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/the-onion.png"
                                        alt="the onion"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "The Hard Times" ? (
                                    /* The Hard Times Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/hard-times.png"
                                        alt="the hard times"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "#Windows11" ? (
                                    /* Windows 11 Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/windows-11.svg"
                                        alt="windows 11"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "Fox Sports" ? (
                                    /* Fox Sports Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/fox-sports.png"
                                        alt="fox sports"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "ESPN" ? (
                                    /* ESPN Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/2/2f/ESPN_wordmark.svg"
                                        alt="espn"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "Lambgoat" ? (
                                    /* Lambgoat Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/lambgoat.png"
                                        alt="lambgoat"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "No Echo" ? (
                                    /* No Echo Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/no-echo.png"
                                        alt="no echo"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "Soft White Underbelly" ? (
                                    /* Soft White Underbelly Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/swu.jpg"
                                        alt="soft white underbelly"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "Breitbart" ? (
                                    /* Breitbart Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/breitbart.png"
                                        alt="breitbart"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "CNN News" ? (
                                    /* CNN News Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/cnn.svg"
                                        alt="cnn news"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "Newsweek" ? (
                                    /* Newsweek Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/newsweek.svg"
                                        alt="newsweek"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "New York Post" ? (
                                    /* NY Post Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/nypost.png"
                                        alt="ny post"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "CBS SPORTS" ? (
                                    /* CBS Sports Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/cbs-sports.svg"
                                        alt="cbs sports"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "CNN - SPORTS" ? (
                                    /* CNN Sports Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/cnnsi.png"
                                        alt="cnn sports"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : feed.name === "Fox News" ? (
                                    /* Fox News Logo and Title - Stacked and aligned */
                                    <div
                                      className={
                                        viewMode === "small" ? "" : "mb-3"
                                      }
                                    >
                                      <img
                                        src="/img/fox-news.png"
                                        alt="fox news"
                                        className={`w-full h-auto opacity-80 ${
                                          viewMode === "small"
                                            ? "max-w-[80px]"
                                            : "max-w-[120px]"
                                        }`}
                                        onError={(e) => {
                                          // Hide broken logo
                                          const target = e.currentTarget;
                                          target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    /* Source Title for other feeds */
                                    <h4
                                      className={`font-normal text-gray-700 dark:text-gray-300 uppercase tracking-wide flex-shrink-0 ${
                                        viewMode === "list"
                                          ? "text-xs sm:text-sm"
                                          : "text-base"
                                      }`}
                                    >
                                      {feed.name}
                                    </h4>
                                  )}
                                </div>

                                {/* Right side: Carousel Controls - Show in grid and small views */}
                                {(viewMode === "grid" ||
                                  viewMode === "small") &&
                                  feedItems.length > 1 && (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => goToPrevious(feed.name)}
                                        disabled={feedItems.length <= 1}
                                        className={`carousel-button text-sm text-gray-700 dark:text-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors ${
                                          viewMode === "small"
                                            ? "w-8 h-6 text-xs"
                                            : "w-12 h-8"
                                        }`}
                                      >
                                        ←
                                      </button>
                                      <span
                                        className={`text-gray-500 dark:text-gray-400 flex items-center justify-center mx-1 ${
                                          viewMode === "small"
                                            ? "text-xs w-6 h-6"
                                            : "text-base w-8 h-8"
                                        }`}
                                      >
                                        {currentIndex + 1}/{feedItems.length}
                                      </span>
                                      <button
                                        onClick={() => goToNext(feed.name)}
                                        disabled={feedItems.length <= 1}
                                        className={`carousel-button text-sm text-gray-700 dark:text-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors ${
                                          viewMode === "small"
                                            ? "w-8 h-6 text-xs"
                                            : "w-12 h-8"
                                        }`}
                                      >
                                        →
                                      </button>
                                    </div>
                                  )}
                              </div>

                              {/* Article Title Row - Show in all view modes */}
                              {feedItems.length > 0 && (
                                <div className="mt-3">
                                  <h3
                                    className={`font-semibold text-gray-900 dark:text-white leading-tight ${
                                      viewMode === "small"
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
                                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer break-words block"
                                    >
                                      {feedItems[currentIndex]?.title || ""}
                                    </a>
                                  </h3>

                                  {/* Subheading/Excerpt - Show in list view */}
                                  {viewMode === "list" &&
                                    feedItems[currentIndex]?.excerpt &&
                                    feed.name !== "The Hard Times" && (
                                      <div className="mt-2">
                                        <p
                                          className="text-sm text-gray-600 dark:text-gray-400"
                                          style={{ lineHeight: "1.5" }}
                                        >
                                          {truncateText(
                                            feedItems[currentIndex]?.excerpt ||
                                              "",
                                            200
                                          )}
                                        </p>
                                      </div>
                                    )}
                                </div>
                              )}

                              {/* Thumbnail Image - Only show in list view */}
                              {viewMode === "list" &&
                                feedItems.length > 0 &&
                                feedItems[currentIndex]?.image && (
                                  <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 h-full">
                                    <img
                                      src={feedItems[currentIndex]?.image}
                                      alt={feedItems[currentIndex]?.title}
                                      className="w-full h-full object-cover rounded-r-lg"
                                      onError={(e) => {
                                        // Hide broken images
                                        const target = e.currentTarget;
                                        target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}

                              {/* Third Row - Carousel Controls and Category Chip (list view only) */}
                              {viewMode === "list" && feedItems.length > 1 && (
                                <div className="px-0 pb-3 pr-32 sm:pr-40 md:pr-48 mt-4">
                                  {/* Carousel Controls and Category Chip */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => goToPrevious(feed.name)}
                                      disabled={feedItems.length <= 1}
                                      className="carousel-button w-12 h-8 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center"
                                    >
                                      ←
                                    </button>
                                    <span className="text-base text-gray-500 dark:text-gray-400 w-8 h-8 flex items-center justify-center mx-1">
                                      {currentIndex + 1}/{feedItems.length}
                                    </span>
                                    <button
                                      onClick={() => goToNext(feed.name)}
                                      disabled={feedItems.length <= 1}
                                      className="carousel-button w-12 h-8 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center"
                                    >
                                      →
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Article Excerpts - Show in grid and small views */}
                              {feedItems.length > 0 ? (
                                <>
                                  {/* Subtitle below headline - Show in grid view only */}
                                  {viewMode === "grid" &&
                                    feedItems[currentIndex]?.excerpt &&
                                    feed.name !== "The Hard Times" && (
                                      <div className="mt-2 flex items-center">
                                        <p
                                          className="text-gray-600 dark:text-gray-400 text-base"
                                          style={{ lineHeight: "1.5" }}
                                        >
                                          {truncateText(
                                            feedItems[currentIndex]?.excerpt ||
                                              "",
                                            400
                                          )}
                                        </p>
                                      </div>
                                    )}
                                </>
                              ) : (
                                <div className="text-center py-8">
                                  {currentFeedStatus?.working === false ? (
                                    <div className="text-red-500 dark:text-red-400">
                                      <div className="text-2xl mb-2">⚠️</div>
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
                                viewMode === "small" ? "pb-2" : "pb-6"
                              } flex-1 flex flex-col ${
                                viewMode === "list" ? "hidden" : ""
                              }`}
                              style={
                                viewMode === "list"
                                  ? {}
                                  : {
                                      height:
                                        viewMode === "small" ? "70px" : "auto",
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
                                    viewMode === "small" ? "mt-2" : "mt-auto"
                                  }`}
                                  style={{
                                    height:
                                      viewMode === "small" ? "140px" : "auto",
                                    marginBottom: "0px",
                                  }}
                                >
                                  <img
                                    src={feedItems[currentIndex]?.image}
                                    alt={feedItems[currentIndex]?.title}
                                    className={`w-full rounded-lg ${
                                      viewMode === "small"
                                        ? "object-cover"
                                        : "object-contain"
                                    }`}
                                    style={{
                                      height:
                                        viewMode === "small" ? "140px" : "auto",
                                      minHeight:
                                        viewMode === "small" ? "140px" : "auto",
                                      maxHeight:
                                        viewMode === "small" ? "140px" : "auto",
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
                                      height:
                                        viewMode === "small"
                                          ? "100px"
                                          : "150px",
                                      minHeight:
                                        viewMode === "small"
                                          ? "100px"
                                          : "150px",
                                      maxHeight:
                                        viewMode === "small"
                                          ? "100px"
                                          : "150px",
                                    }}
                                  >
                                    <div className="text-center text-gray-500 dark:text-gray-400">
                                      <div
                                        className={
                                          viewMode === "small"
                                            ? "text-2xl"
                                            : "text-4xl"
                                        }
                                      >
                                        📰
                                      </div>
                                    </div>
                                  </div>

                                  {/* Video indicator if video content exists */}
                                  {feedItems[currentIndex]?.videoUrl && (
                                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
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
                                    viewMode === "small" ? "mt-2" : "mt-auto"
                                  }`}
                                  style={{
                                    height: "150px",
                                    minHeight: "150px",
                                    maxHeight: "150px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  {feedItems.length > 0 &&
                                  feedItems[currentIndex]?.image &&
                                  feedItems[currentIndex]?.image!.startsWith(
                                    "placeholder:"
                                  ) ? (
                                    // Show styled placeholder for this source
                                    <div className="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                      <div
                                        className={`w-full h-full bg-blue-500 rounded-lg flex items-center justify-center relative`}
                                      >
                                        <span className="text-white font-bold text-2xl">
                                          {
                                            (
                                              feedItems[currentIndex]?.source ||
                                              ""
                                            ).split(" ")[0]
                                          }
                                        </span>

                                        {/* Video indicator if video content exists */}
                                        {feedItems[currentIndex]?.videoUrl && (
                                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
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
                                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center relative">
                                      <div className="text-center text-gray-500 dark:text-gray-400">
                                        <div className="text-4xl">📰</div>
                                      </div>

                                      {/* Video indicator if video content exists */}
                                      {feedItems[currentIndex]?.videoUrl && (
                                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
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
                    {rssFeeds
                      .filter(
                        (feed) =>
                          feed.category === "Custom" &&
                          (activeCategory === "all" ||
                            activeCategory === "Custom")
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
                                : "h-[470px]"
                            }`}
                            style={
                              viewMode === "list"
                                ? { borderLeftColor: "#ef4444" }
                                : { height: "470px" }
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
                              {/* Top Row - Source Title and Category Chip */}
                              <div
                                className={`flex items-center justify-between ${
                                  viewMode === "list" ? "" : "mb-4"
                                }`}
                              >
                                {/* Source Title */}
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  {customFeed.name}
                                </h4>

                                {/* Category Chip - Show in grid and small views */}
                              </div>

                              {/* Second Row - Remove Button (list view only) */}
                              {viewMode === "list" && (
                                <div className="flex items-center justify-end mt-2">
                                  {/* Remove Button - Right side */}
                                  <button
                                    onClick={() => {
                                      const feedIndex = rssFeeds.findIndex(
                                        (f) => f.id === customFeed.id
                                      );
                                      if (feedIndex > -1) {
                                        rssFeeds.splice(feedIndex, 1);
                                        loadRSSFeeds();
                                      }
                                    }}
                                    className="w-5 h-5 text-xs text-red-500 hover:text-red-700 bg-white dark:bg-gray-700 rounded border border-red-200 dark:border-red-600 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="Remove this feed"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}

                              {/* Article Title - Show in grid and small views */}
                              {(viewMode === "grid" ||
                                viewMode === "small") && (
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                                  <a
                                    href={customFeedItems[0]?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                  >
                                    {truncateText(
                                      customFeedItems[0]?.title || "",
                                      90
                                    )}
                                  </a>
                                </h3>
                              )}

                              {/* Subtitle below headline - Show in grid view only */}
                              {viewMode === "grid" &&
                                customFeedItems[0]?.excerpt && (
                                  <div className="mt-3 flex items-center">
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
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
                                viewMode === "small" ? "pb-0" : "pb-6"
                              } flex-1 flex flex-col ${
                                viewMode === "list" ? "hidden" : ""
                              }`}
                              style={
                                viewMode === "list"
                                  ? {}
                                  : {
                                      height:
                                        viewMode === "small" ? "70px" : "180px",
                                    }
                              }
                            >
                              {/* Image - Show in grid and small views */}
                              {(viewMode === "grid" || viewMode === "small") &&
                              customFeedItems[0]?.image &&
                              !customFeedItems[0]?.image!.startsWith(
                                "placeholder:"
                              ) ? (
                                <div
                                  className="relative z-0"
                                  style={{
                                    height: "150px",
                                    marginTop:
                                      viewMode === "small" ? "8px" : "20px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  <img
                                    src={customFeedItems[0]?.image}
                                    alt={customFeedItems[0]?.title}
                                    className="w-full h-48 object-cover rounded-lg"
                                    style={{
                                      height: "192px",
                                      minHeight: "192px",
                                      maxHeight: "192px",
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
                                      height: "150px",
                                      minHeight: "150px",
                                      maxHeight: "150px",
                                    }}
                                  >
                                    <div className="text-center text-gray-500 dark:text-gray-400">
                                      <div className="text-4xl">📰</div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                // No image available or placeholder - show styled placeholder
                                <div
                                  className={`w-full rounded-lg flex items-center justify-center ${
                                    viewMode === "small" ? "mt-2" : "mt-auto"
                                  }`}
                                  style={{
                                    height: "150px",
                                    minHeight: "150px",
                                    maxHeight: "150px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  {customFeedItems[0]?.image &&
                                  customFeedItems[0]?.image!.startsWith(
                                    "placeholder:"
                                  ) ? (
                                    // Show styled placeholder for this source
                                    <div className="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                      {(() => {
                                        const sourceName =
                                          customFeedItems[0]?.source || "";
                                        let bgColor = "bg-purple-500"; // Custom feeds use purple

                                        return (
                                          <div
                                            className={`w-full h-full ${bgColor} rounded-lg flex items-center justify-center`}
                                          >
                                            <span className="text-white font-bold text-2xl">
                                              {sourceName.split(" ")[0]}
                                            </span>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  ) : (
                                    // Show generic placeholder
                                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                      <div className="text-center text-gray-500 dark:text-gray-400">
                                        <div className="text-4xl">📰</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Carousel Controls for Custom Feeds Grid and Small Views */}
                            {(viewMode === "grid" || viewMode === "small") &&
                              customFeedItems.length > 1 && (
                                <div className="px-4 sm:px-6 pb-4 flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => {
                                      // For custom feeds, we'll need to implement index tracking
                                      // For now, this is a placeholder
                                    }}
                                    disabled={customFeedItems.length <= 1}
                                    className="carousel-button w-12 h-8 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors"
                                  >
                                    ←
                                  </button>
                                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8 h-8 flex items-center justify-center">
                                    1/{customFeedItems.length}
                                  </span>
                                  <button
                                    onClick={() => {
                                      // For custom feeds, we'll need to implement index tracking
                                      // For now, this is a placeholder
                                    }}
                                    disabled={customFeedItems.length <= 1}
                                    className="carousel-button w-12 h-8 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors"
                                  >
                                    →
                                  </button>
                                </div>
                              )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default NewsAggregator;
