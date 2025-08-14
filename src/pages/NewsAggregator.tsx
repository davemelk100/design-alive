import { motion } from "framer-motion";
import { Suspense, useState, useEffect } from "react";

// Import Roboto Serif font
import "@fontsource/roboto-serif/400.css";
import "@fontsource/roboto-serif/700.css";

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
    category: "Technology",
    enabled: true,
  },
  {
    id: "wired",
    name: "WIRED",
    url: "https://rss.app/feeds/8tttlZs7ekrqOLbO.xml",
    category: "Technology",
    enabled: true,
  },
  {
    id: "usa-today",
    name: "USA Today",
    url: "https://rss.app/feeds/8mq9gH2K0yv6qSqq.xml",
    category: "News",
    enabled: true,
  },
  {
    id: "yahoo-sports",
    name: "Yahoo Sports",
    url: "https://rss.app/feeds/tppFEcexLVyIBXBM.xml",
    category: "Sports",
    enabled: true,
  },
  {
    id: "google-technology",
    name: "Google Technology",
    url: "https://rss.app/feeds/8FQMeEmcbPFgAPPo.xml",
    category: "Technology",
    enabled: true,
  },

  {
    id: "lambgoat",
    name: "Lambgoat",
    url: "https://rss.app/feeds/T7FesKRrQP9tDrmC.xml",
    category: "Music",
    enabled: true,
  },
  {
    id: "linkedin-google",
    name: "LinkedIn - Google",
    url: "https://rss.app/feeds/YmKsNfGanenfg9qN.xml",
    category: "Technology",
    enabled: true,
  },
];

const NewsAggregator = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [arsTechnicaIndex, setArsTechnicaIndex] = useState(0);
  const [wiredIndex, setWiredIndex] = useState(0);
  const [usaTodayIndex, setUsaTodayIndex] = useState(0);
  const [yahooSportsIndex, setYahooSportsIndex] = useState(0);
  const [googleTechnologyIndex, setGoogleTechnologyIndex] = useState(0);

  const [lambgoatIndex, setLambgoatIndex] = useState(0);
  const [linkedinGoogleIndex, setLinkedinGoogleIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  // Helper functions for dynamic cards
  const getCurrentIndex = (sourceName: string) => {
    switch (sourceName) {
      case "Ars Technica":
        return arsTechnicaIndex;
      case "WIRED":
        return wiredIndex;
      case "USA Today":
        return usaTodayIndex;
      case "Yahoo Sports":
        return yahooSportsIndex;
      case "Google Technology":
        return googleTechnologyIndex;
      case "Lambgoat":
        return lambgoatIndex;
      case "LinkedIn - Google":
        return linkedinGoogleIndex;
      default:
        return 0;
    }
  };

  const getLogoColor = (sourceName: string) => {
    switch (sourceName) {
      case "Ars Technica":
        return "bg-orange-500";
      case "WIRED":
        return "bg-black dark:bg-white";
      case "USA Today":
        return "bg-blue-600";
      case "Yahoo Sports":
        return "bg-purple-600";
      case "Google Technology":
        return "bg-blue-500";
      case "Lambgoat":
        return "bg-red-600";
      case "LinkedIn - Google":
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  const getLogoText = (sourceName: string) => {
    switch (sourceName) {
      case "Ars Technica":
        return "AT";
      case "WIRED":
        return "W";
      case "USA Today":
        return "US";
      case "Yahoo Sports":
        return "YS";
      case "Google Technology":
        return "GT";
      case "Lambgoat":
        return "LG";
      case "LinkedIn - Google":
        return "LG";
      default:
        return "N";
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
      case "USA Today":
        goToPreviousUsaToday();
        break;
      case "Yahoo Sports":
        goToPreviousYahooSports();
        break;
      case "Google Technology":
        goToPreviousGoogleTechnology();
        break;
      case "Lambgoat":
        goToPreviousLambgoat();
        break;
      case "LinkedIn - Google":
        goToPreviousLinkedinGoogle();
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
      case "USA Today":
        goToNextUsaToday();
        break;
      case "Yahoo Sports":
        goToNextYahooSports();
        break;
      case "Google Technology":
        goToNextGoogleTechnology();
        break;
      case "Lambgoat":
        goToNextLambgoat();
        break;
      case "LinkedIn - Google":
        goToNextLinkedinGoogle();
        break;
    }
  };

  // Function to parse RSS XML
  const parseRSS = (
    xmlText: string,
    sourceName: string,
    category: string
  ): NewsItem[] => {
    console.log(`Parsing RSS XML for ${sourceName}, length: ${xmlText.length}`);

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      console.log(`XML document created, parsing items...`);

      // Try different selectors for RSS items
      let items = xmlDoc.querySelectorAll("item");
      console.log(`Found ${items.length} items with 'item' selector`);

      // If no items found, try alternative selectors
      if (items.length === 0) {
        items = xmlDoc.querySelectorAll("entry"); // Atom feeds use 'entry'
        console.log(`Found ${items.length} items with 'entry' selector`);
      }

      if (items.length === 0) {
        // Try to find any content that might be news items
        const allElements = xmlDoc.querySelectorAll("*");
        console.log(`Total elements in XML: ${allElements.length}`);

        // Log the structure to understand what we're working with
        const channel = xmlDoc.querySelector("channel");
        if (channel) {
          console.log(
            "Channel element found:",
            channel.innerHTML.substring(0, 500)
          );

          // Look for any child elements that might contain news
          const channelChildren = channel.children;
          console.log(
            "Channel children:",
            Array.from(channelChildren).map((child) => ({
              tagName: child.tagName,
              textContent: child.textContent?.substring(0, 100),
            }))
          );
        }

        // Look for any elements that might contain news
        const possibleItems = xmlDoc.querySelectorAll(
          "article, story, news, post"
        );
        console.log(`Possible news elements: ${possibleItems.length}`);

        if (possibleItems.length > 0) {
          items = possibleItems;
        }

        // For NYT specifically, let's check if there are any other elements
        if (sourceName.includes("New York Times")) {
          console.log(
            "NYT feed detected, checking for alternative structure..."
          );

          // Check if there are any elements with content
          const allTextElements = xmlDoc.querySelectorAll(
            "title, description, link"
          );
          console.log(
            "NYT text elements found:",
            Array.from(allTextElements).map((el) => ({
              tagName: el.tagName,
              textContent: el.textContent?.substring(0, 100),
            }))
          );

          // Check if there are any namespaced elements
          const nytElements = xmlDoc.querySelectorAll("[xmlns\\:nyt] *");
          console.log("NYT namespaced elements:", nytElements.length);
        }
      }

      const parsedItems: NewsItem[] = [];

      items.forEach((item, index) => {
        const title =
          item.querySelector("title")?.textContent ||
          item.querySelector("name")?.textContent ||
          item.querySelector("headline")?.textContent ||
          "No Title";

        const link =
          item.querySelector("link")?.textContent ||
          item.querySelector("url")?.textContent ||
          item.querySelector("href")?.textContent ||
          "#";

        const description =
          item.querySelector("description")?.textContent ||
          item.querySelector("summary")?.textContent ||
          item.querySelector("content")?.textContent ||
          item.querySelector("excerpt")?.textContent ||
          "No description available";

        const pubDate =
          item.querySelector("pubDate")?.textContent ||
          item.querySelector("published")?.textContent ||
          item.querySelector("date")?.textContent ||
          new Date().toISOString();

        const author =
          item.querySelector("author")?.textContent ||
          item.querySelector("creator")?.textContent ||
          item.querySelector("writer")?.textContent ||
          "Unknown Author";

        // Extract image from various RSS formats
        let image = "";
        const mediaContent = item.querySelector("media\\:content, content");
        const enclosure = item.querySelector("enclosure");
        const ogImage = item.querySelector("meta[property='og:image']");

        if (mediaContent && mediaContent.getAttribute("url")) {
          image = mediaContent.getAttribute("url") || "";
        } else if (
          enclosure &&
          enclosure.getAttribute("type")?.startsWith("image/")
        ) {
          image = enclosure.getAttribute("url") || "";
        } else if (ogImage && ogImage.getAttribute("content")) {
          image = ogImage.getAttribute("content") || "";
        }

        console.log(`Item ${index + 1}:`, {
          title: title.substring(0, 50),
          link: link.substring(0, 50),
          description: description.substring(0, 100),
          image: image.substring(0, 50),
        });

        // Clean up description (remove HTML tags)
        const cleanDescription =
          description.replace(/<[^>]*>/g, "").substring(0, 200) + "...";

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
      });

      console.log(`Successfully parsed ${parsedItems.length} items`);

      // If still no items, create a fallback item with the feed info
      if (parsedItems.length === 0) {
        const channelTitle =
          xmlDoc.querySelector("channel > title")?.textContent || sourceName;
        const channelLink =
          xmlDoc.querySelector("channel > link")?.textContent || "#";
        const channelDesc =
          xmlDoc.querySelector("channel > description")?.textContent ||
          "No description available";

        console.log("No items found, creating fallback from channel info:", {
          channelTitle,
          channelLink,
          channelDesc,
        });

        // Instead of creating fallback content, throw an error
        throw new Error(
          `RSS feed loaded but no news items found. Feed structure may be different than expected. Channel: ${channelTitle}`
        );
      }

      return parsedItems.slice(0, 10); // Limit to 10 items for carousel
    } catch (parseError) {
      console.error(`Error parsing RSS XML:`, parseError);
      console.error(`XML content:`, xmlText.substring(0, 1000));

      // Throw the error instead of returning fallback content
      throw new Error(
        `Failed to parse RSS XML for ${sourceName}: ${
          parseError instanceof Error
            ? parseError.message
            : "Unknown parsing error"
        }`
      );
    }
  };

  // Function to fetch RSS feed using a CORS proxy
  const fetchRSSFeed = async (feed: RSSFeed): Promise<NewsItem[]> => {
    try {
      console.log(`Fetching RSS feed: ${feed.name} from ${feed.url}`);

      // Try multiple proxy services as fallbacks
      const proxyServices = [
        `https://corsproxy.io/?${encodeURIComponent(feed.url)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`,
        `https://thingproxy.freeboard.io/fetch/${feed.url}`,
        `https://cors-anywhere.herokuapp.com/${feed.url}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
          feed.url
        )}`,
      ];

      let xmlText = "";

      for (const proxyUrl of proxyServices) {
        try {
          console.log(`Trying proxy: ${proxyUrl}`);

          const response = await fetch(proxyUrl, {
            method: "GET",
            headers: {
              Accept: "application/xml, text/xml, */*",
            },
          });

          console.log(`Response status: ${response.status}`);
          console.log(`Response ok: ${response.ok}`);

          if (response.ok) {
            xmlText = await response.text();
            console.log(`Received XML text, length: ${xmlText.length}`);
            console.log(`First 500 characters:`, xmlText.substring(0, 500));

            if (xmlText.length > 100) {
              console.log(`Successfully fetched via proxy: ${proxyUrl}`);
              break;
            }
          }
        } catch (proxyError) {
          console.log(`Proxy failed: ${proxyUrl}`, proxyError);
          continue;
        }
      }

      if (!xmlText || xmlText.length < 100) {
        throw new Error(
          "All proxy services failed or returned invalid content"
        );
      }

      return parseRSS(xmlText, feed.name, feed.category);
    } catch (error) {
      console.error(`Error fetching RSS feed ${feed.name}:`, error);

      // Throw the error instead of returning fallback data
      throw new Error(
        `Failed to fetch RSS feed ${feed.name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Function to load all RSS feeds
  const loadRSSFeeds = async () => {
    console.log("Starting to load RSS feeds...");
    setLoading(true);
    setError(null);

    try {
      const allItems: NewsItem[] = [];

      for (const feed of rssFeeds.filter((f) => f.enabled)) {
        console.log(`Processing feed: ${feed.name}`);
        try {
          const items = await fetchRSSFeed(feed);
          console.log(`Got ${items.length} items from ${feed.name}:`, items);
          allItems.push(...items);
        } catch (feedError) {
          console.error(`Failed to load feed ${feed.name}:`, feedError);
          // Continue with other feeds even if one fails
          // Add a fallback item to show the feed exists but failed
          allItems.push({
            id: Date.now() + Math.random(),
            title: `Error loading ${feed.name}`,
            source: feed.name,
            url: "#",
            publishedDate: new Date().toISOString(),
            author: "System",
            excerpt: `Failed to load content from ${feed.name}. Please try again later.`,
            category: feed.category,
            isRss: true,
            image: "",
          });
        }
      }

      console.log(`Total items collected: ${allItems.length}`, allItems);

      if (allItems.length === 0) {
        console.log("No items collected from any feeds");
        setError(
          "No RSS feeds could be loaded. All configured feeds failed to fetch or parse content. Check the console for detailed error information."
        );

        // Show example content so the component works
        setNewsItems([
          {
            id: 1,
            title: "Loading Ars Technica Feed...",
            source: "Ars Technica",
            url: "https://arstechnica.com",
            publishedDate: new Date().toISOString(),
            author: "Ars Technica",
            excerpt:
              "Attempting to load the latest technology and science news from Ars Technica, including AI stories. If this persists, there may be an issue with the RSS feed or CORS proxy services.",
            category: "Technology",
            isRss: false,
          },
          {
            id: 2,
            title: "Carousel Navigation",
            source: "System",
            url: "#",
            publishedDate: new Date().toISOString(),
            author: "System",
            excerpt:
              "When RSS feeds load successfully, you'll be able to navigate through multiple stories using the arrow buttons and story indicators below.",
            category: "System",
            isRss: false,
          },
          {
            id: 3,
            title: "Story Navigation",
            source: "System",
            url: "#",
            publishedDate: new Date().toISOString(),
            author: "System",
            excerpt:
              "Use the left and right arrows to browse through all available stories from the feed. The dots below show your current position.",
            category: "System",
            isRss: false,
          },
        ]);
      } else {
        // Sort by publication date (newest first)
        allItems.sort(
          (a, b) =>
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime()
        );

        console.log("Setting news items:", allItems);
        setNewsItems(allItems);
        setError(null);
        setArsTechnicaIndex(0); // Reset Ars Technica carousel
        setWiredIndex(0); // Reset WIRED carousel
        setUsaTodayIndex(0); // Reset USA Today carousel
        setYahooSportsIndex(0); // Reset Yahoo Sports carousel
        setGoogleTechnologyIndex(0); // Reset Google Technology carousel

        setLambgoatIndex(0); // Reset Lambgoat carousel
        setLinkedinGoogleIndex(0); // Reset LinkedIn - Google carousel
      }
    } catch (error) {
      console.error("Error loading RSS feeds:", error);
      setError(
        `Failed to load RSS feeds: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Check the browser console for details.`
      );
      setNewsItems([]);
    } finally {
      setLoading(false);
      console.log("Finished loading RSS feeds");
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

  // USA Today carousel navigation
  const goToNextUsaToday = () => {
    const usaTodayItems = newsItems.filter(
      (item) => item.source === "USA Today"
    );
    if (usaTodayItems.length > 0) {
      setUsaTodayIndex((prev) => (prev + 1) % usaTodayItems.length);
    }
  };

  const goToPreviousUsaToday = () => {
    const usaTodayItems = newsItems.filter(
      (item) => item.source === "USA Today"
    );
    if (usaTodayItems.length > 0) {
      setUsaTodayIndex(
        (prev) => (prev - 1 + usaTodayItems.length) % usaTodayItems.length
      );
    }
  };

  // Yahoo Sports carousel navigation
  const goToNextYahooSports = () => {
    const yahooSportsItems = newsItems.filter(
      (item) => item.source === "Yahoo Sports"
    );
    if (yahooSportsItems.length > 0) {
      setYahooSportsIndex((prev) => (prev + 1) % yahooSportsItems.length);
    }
  };

  const goToPreviousYahooSports = () => {
    const yahooSportsItems = newsItems.filter(
      (item) => item.source === "Yahoo Sports"
    );
    if (yahooSportsItems.length > 0) {
      setYahooSportsIndex(
        (prev) => (prev - 1 + yahooSportsItems.length) % yahooSportsItems.length
      );
    }
  };

  // Google Technology carousel navigation
  const goToNextGoogleTechnology = () => {
    const googleTechnologyItems = newsItems.filter(
      (item) => item.source === "Google Technology"
    );
    if (googleTechnologyItems.length > 0) {
      setGoogleTechnologyIndex(
        (prev) => (prev + 1) % googleTechnologyItems.length
      );
    }
  };

  const goToPreviousGoogleTechnology = () => {
    const googleTechnologyItems = newsItems.filter(
      (item) => item.source === "Google Technology"
    );
    if (googleTechnologyItems.length > 0) {
      setGoogleTechnologyIndex(
        (prev) =>
          (prev - 1 + googleTechnologyItems.length) %
          googleTechnologyItems.length
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

  // LinkedIn - Google carousel navigation
  const goToNextLinkedinGoogle = () => {
    const linkedinGoogleItems = newsItems.filter(
      (item) => item.source === "LinkedIn - Google"
    );
    if (linkedinGoogleItems.length > 0) {
      setLinkedinGoogleIndex((prev) => (prev + 1) % linkedinGoogleItems.length);
    }
  };

  const goToPreviousLinkedinGoogle = () => {
    const linkedinGoogleItems = newsItems.filter(
      (item) => item.source === "LinkedIn - Google"
    );
    if (linkedinGoogleItems.length > 0) {
      setLinkedinGoogleIndex(
        (prev) =>
          (prev - 1 + linkedinGoogleItems.length) % linkedinGoogleItems.length
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white font-serif roboto-serif-page"
      style={{ fontFamily: "Roboto Serif, serif !important" }}
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
        <div className="flex">
          {/* Left Navigation Sidebar */}
          <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === "all"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <span className="font-medium">All News</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("technology")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === "technology"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-l-4 border-orange-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <span className="font-medium">Technology</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("sports")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === "sports"
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-l-4 border-green-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="font-medium">Sports</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("business")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === "business"
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-l-4 border-purple-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                  <span className="font-medium">Business</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("entertainment")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === "entertainment"
                    ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-l-4 border-red-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">E</span>
                  </div>
                  <span className="font-medium">Entertainment</span>
                </div>
              </button>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Error Message */}
            {error && (
              <section className="py-4 sm:py-6 lg:py-8">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                  >
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </motion.div>
                </div>
              </section>
            )}

            {/* News Grid Section */}
            <section className="py-4 sm:py-6 lg:py-8">
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
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {/* Dynamic News Cards */}
                    {rssFeeds.map((feed) => {
                      const feedItems = newsItems.filter(
                        (item) => item.source === feed.name
                      );
                      const currentIndex = getCurrentIndex(feed.name);

                      if (feedItems.length === 0) return null;

                      return (
                        <motion.div
                          key={`${feed.id}-${currentIndex}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-[450px] flex flex-col"
                        >
                          {/* Card Header */}
                          <div className="p-6 flex-shrink-0">
                            {/* Top Row - Logo, Title, and Carousel Controls */}
                            <div className="flex items-center justify-between mb-4">
                              {/* Logo and Source Title */}
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 ${getLogoColor(
                                    feed.name
                                  )} rounded-lg flex items-center justify-center`}
                                >
                                  <span className="text-white font-bold text-sm">
                                    {getLogoText(feed.name)}
                                  </span>
                                </div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  {feed.name}
                                </h4>
                              </div>

                              {/* Carousel Controls */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => goToPrevious(feed.name)}
                                  disabled={feedItems.length <= 1}
                                  className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                                >
                                  ←
                                </button>
                                <span className="text-xs text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                                  {currentIndex + 1}/{feedItems.length}
                                </span>
                                <button
                                  onClick={() => goToNext(feed.name)}
                                  disabled={feedItems.length <= 1}
                                  className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                                >
                                  →
                                </button>
                              </div>
                            </div>

                            {/* Article Title */}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                              <a
                                href={feedItems[currentIndex]?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                              >
                                {truncateText(
                                  feedItems[currentIndex]?.title || "",
                                  80
                                )}
                              </a>
                            </h3>
                          </div>

                          {/* Card Content */}
                          <div
                            className="px-6 pb-6 flex-1 flex flex-col"
                            style={{ height: "180px" }}
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {truncateText(
                                feedItems[currentIndex]?.excerpt || ""
                              )}
                            </p>

                            {/* Image */}
                            {feedItems[currentIndex]?.image && (
                              <div
                                className="mt-auto"
                                style={{ height: "150px" }}
                              >
                                <img
                                  src={feedItems[currentIndex]?.image}
                                  alt={feedItems[currentIndex]?.title}
                                  className="w-full h-36 object-cover rounded-lg"
                                  style={{
                                    height: "150px",
                                    minHeight: "150px",
                                    maxHeight: "150px",
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Lambgoat Card with Carousel */}
                    {newsItems.filter((item) => item.source === "Lambgoat")
                      .length > 0 && (
                      <motion.div
                        key={`lambgoat-${lambgoatIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-[450px] flex flex-col"
                      >
                        {/* Lambgoat Header */}
                        <div className="p-4 flex-shrink-0">
                          {/* Top Row - Logo, Title, and Carousel Controls */}
                          <div className="flex items-center justify-between mb-4">
                            {/* Logo and Source Title */}
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  LG
                                </span>
                              </div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Lambgoat
                              </h4>
                            </div>

                            {/* Carousel Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={goToPreviousLambgoat}
                                disabled={
                                  newsItems.filter(
                                    (item) => item.source === "Lambgoat"
                                  ).length <= 1
                                }
                                className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                              >
                                ←
                              </button>
                              <span className="text-xs text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                                {lambgoatIndex + 1}/
                                {
                                  newsItems.filter(
                                    (item) => item.source === "Lambgoat"
                                  ).length
                                }
                              </span>
                              <button
                                onClick={goToNextLambgoat}
                                disabled={
                                  newsItems.filter(
                                    (item) => item.source === "Lambgoat"
                                  ).length <= 1
                                }
                                className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                              >
                                →
                              </button>
                            </div>
                          </div>

                          {/* Article Title */}
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                            <a
                              href={
                                newsItems.filter(
                                  (item) => item.source === "Lambgoat"
                                )[lambgoatIndex]?.url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                            >
                              {truncateText(
                                newsItems.filter(
                                  (item) => item.source === "Lambgoat"
                                )[lambgoatIndex]?.title || "",
                                80
                              )}
                            </a>
                          </h3>
                        </div>

                        {/* Lambgoat Content */}
                        <div
                          className="px-6 pb-6 flex-1 flex flex-col"
                          style={{ height: "180px" }}
                        >
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {truncateText(
                              newsItems.filter(
                                (item) => item.source === "Lambgoat"
                              )[lambgoatIndex]?.excerpt || ""
                            )}
                          </p>

                          {/* Image */}
                          {newsItems.filter(
                            (item) => item.source === "Lambgoat"
                          )[lambgoatIndex]?.image && (
                            <div
                              className="mt-auto"
                              style={{ height: "150px" }}
                            >
                              <img
                                src={
                                  newsItems.filter(
                                    (item) => item.source === "Lambgoat"
                                  )[lambgoatIndex]?.image
                                }
                                alt={
                                  newsItems.filter(
                                    (item) => item.source === "Lambgoat"
                                  )[lambgoatIndex]?.title
                                }
                                className="w-full h-36 object-cover rounded-lg"
                                style={{
                                  height: "150px",
                                  minHeight: "150px",
                                  maxHeight: "150px",
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Custom Feeds Section */}
                    {rssFeeds
                      .filter((feed) => feed.category === "Custom")
                      .map((customFeed, index) => {
                        const customFeedItems = newsItems.filter(
                          (item) => item.source === customFeed.name
                        );
                        if (customFeedItems.length === 0) return null;

                        return (
                          <motion.div
                            key={`custom-${customFeed.id}-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-[450px] flex flex-col"
                          >
                            {/* Custom Feed Header */}
                            <div
                              className="p-6 flex-shrink-0"
                              style={{ height: "320px" }}
                            >
                              {/* Top Row - Logo, Title, and Remove Button */}
                              <div className="flex items-center justify-between mb-4">
                                {/* Logo and Source Title */}
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      CF
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {customFeed.name}
                                  </h4>
                                </div>

                                {/* Remove Button */}
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
                                  className="w-6 h-6 text-xs text-red-500 hover:text-red-700 bg-white dark:bg-gray-700 rounded border border-red-200 dark:border-red-600 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20"
                                  title="Remove this feed"
                                >
                                  ×
                                </button>
                              </div>

                              {/* Article Title */}
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                                <a
                                  href={customFeedItems[0]?.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                >
                                  {truncateText(
                                    customFeedItems[0]?.title || "",
                                    80
                                  )}
                                </a>
                              </h3>
                            </div>

                            {/* Custom Feed Content */}
                            <div
                              className="px-6 pb-6 flex-1 flex flex-col"
                              style={{ height: "180px" }}
                            >
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {truncateText(
                                  customFeedItems[0]?.excerpt || ""
                                )}
                              </p>

                              {/* Image */}
                              {customFeedItems[0]?.image && (
                                <div
                                  className="mt-auto"
                                  style={{ height: "150px" }}
                                >
                                  <img
                                    src={customFeedItems[0]?.image}
                                    alt={customFeedItems[0]?.title}
                                    className="w-full h-36 object-cover rounded-lg"
                                    style={{
                                      height: "150px",
                                      minHeight: "150px",
                                      maxHeight: "150px",
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                  </motion.div>
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
