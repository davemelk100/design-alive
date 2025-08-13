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
];

const NewsAggregator = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [arsTechnicaIndex, setArsTechnicaIndex] = useState(0);
  const [wiredIndex, setWiredIndex] = useState(0);
  const [usaTodayIndex, setUsaTodayIndex] = useState(0);
  const [yahooSportsIndex, setYahooSportsIndex] = useState(0);

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
        {/* Hero Section */}
        <section className="relative flex flex-col justify-center min-h-[80px] sm:min-h-[100px] pt-2 sm:pt-3 lg:pt-4">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
            {/* Header with three-column layout - third column takes full remaining width */}
            <div className="flex items-start w-full">
              {/* First column - empty but takes up space */}
              <div className="w-1/3"></div>

              {/* Second column - centered title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: 0.2 }}
                className="w-1/3 flex justify-center"
              >
                <h1
                  className="text-[clamp(1.5rem,4vw,3rem)] font-bold mb-1 title-font leading-none relative z-10 text-center"
                  style={{ letterSpacing: "-0.06em" }}
                >
                  News
                </h1>
              </motion.div>
            </div>
          </div>
        </section>

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
                {/* Ars Technica Card with Carousel */}
                {newsItems.filter((item) => item.source === "Ars Technica")
                  .length > 0 && (
                  <motion.div
                    key={`ars-technica-${arsTechnicaIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-[450px] flex flex-col"
                  >
                    {/* Ars Technica Header */}
                    <div
                      className="p-6 flex-shrink-0"
                      style={{ height: "320px" }}
                    >
                      {/* Top Row - Logo, Title, and Carousel Controls */}
                      <div className="flex items-center justify-between mb-4">
                        {/* Logo and Source Title */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              AT
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Ars Technica
                          </h4>
                        </div>

                        {/* Carousel Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={goToPreviousArsTechnica}
                            disabled={
                              newsItems.filter(
                                (item) => item.source === "Ars Technica"
                              ).length <= 1
                            }
                            className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                          >
                            ←
                          </button>
                          <span className="text-xs text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                            {arsTechnicaIndex + 1}/
                            {
                              newsItems.filter(
                                (item) => item.source === "Ars Technica"
                              ).length
                            }
                          </span>
                          <button
                            onClick={goToNextArsTechnica}
                            disabled={
                              newsItems.filter(
                                (item) => item.source === "Ars Technica"
                              ).length <= 1
                            }
                            className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                          >
                            →
                          </button>
                        </div>
                      </div>

                      {/* Article Title */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
                        <a
                          href={
                            newsItems.filter(
                              (item) => item.source === "Ars Technica"
                            )[arsTechnicaIndex]?.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {truncateText(
                            newsItems.filter(
                              (item) => item.source === "Ars Technica"
                            )[arsTechnicaIndex]?.title || "",
                            80
                          )}
                        </a>
                      </h3>

                      {/* Image */}
                      {newsItems.filter(
                        (item) => item.source === "Ars Technica"
                      )[arsTechnicaIndex]?.image && (
                        <div className="mb-4" style={{ height: "150px" }}>
                          <img
                            src={
                              newsItems.filter(
                                (item) => item.source === "Ars Technica"
                              )[arsTechnicaIndex]?.image
                            }
                            alt={
                              newsItems.filter(
                                (item) => item.source === "Ars Technica"
                              )[arsTechnicaIndex]?.title
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

                    {/* Ars Technica Content */}
                    <div
                      className="px-6 pb-6 flex-1 flex flex-col"
                      style={{ height: "180px" }}
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 overflow-hidden">
                        {truncateText(
                          newsItems.filter(
                            (item) => item.source === "Ars Technica"
                          )[arsTechnicaIndex]?.excerpt || ""
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* WIRED Card with Carousel */}
                {newsItems.filter((item) => item.source === "WIRED").length >
                  0 && (
                  <motion.div
                    key={`wired-${wiredIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-[450px] flex flex-col"
                  >
                    {/* WIRED Header */}
                    <div
                      className="p-6 flex-shrink-0"
                      style={{ height: "320px" }}
                    >
                      {/* Top Row - Logo, Title, and Carousel Controls */}
                      <div className="flex items-center justify-between mb-4">
                        {/* Logo and Source Title */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                            <span className="text-white dark:text-black font-bold text-sm">
                              W
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            WIRED
                          </h4>
                        </div>

                        {/* Carousel Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={goToPreviousWired}
                            disabled={
                              newsItems.filter(
                                (item) => item.source === "WIRED"
                              ).length <= 1
                            }
                            className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                          >
                            ←
                          </button>
                          <span className="text-xs text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                            {wiredIndex + 1}/
                            {
                              newsItems.filter(
                                (item) => item.source === "WIRED"
                              ).length
                            }
                          </span>
                          <button
                            onClick={goToNextWired}
                            disabled={
                              newsItems.filter(
                                (item) => item.source === "WIRED"
                              ).length <= 1
                            }
                            className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                          >
                            →
                          </button>
                        </div>
                      </div>

                      {/* Article Title */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
                        <a
                          href={
                            newsItems.filter((item) => item.source === "WIRED")[
                              wiredIndex
                            ]?.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {truncateText(
                            newsItems.filter((item) => item.source === "WIRED")[
                              wiredIndex
                            ]?.title || "",
                            80
                          )}
                        </a>
                      </h3>

                      {/* Image */}
                      {newsItems.filter((item) => item.source === "WIRED")[
                        wiredIndex
                      ]?.image && (
                        <div className="mb-4" style={{ height: "150px" }}>
                          <img
                            src={
                              newsItems.filter(
                                (item) => item.source === "WIRED"
                              )[wiredIndex]?.image
                            }
                            alt={
                              newsItems.filter(
                                (item) => item.source === "WIRED"
                              )[wiredIndex]?.title
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

                    {/* WIRED Content */}
                    <div
                      className="px-6 pb-6 flex-1 flex flex-col"
                      style={{ height: "180px" }}
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 overflow-hidden">
                        {truncateText(
                          newsItems.filter((item) => item.source === "WIRED")[
                            wiredIndex
                          ]?.excerpt || ""
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* USA Today Card with Carousel */}
                {newsItems.filter((item) => item.source === "USA Today")
                  .length > 0 && (
                  <motion.div
                    key={`usa-today-${usaTodayIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-[450px] flex flex-col"
                  >
                    {/* USA Today Header */}
                    <div
                      className="p-6 flex-shrink-0"
                      style={{ height: "320px" }}
                    >
                      {/* Top Row - Logo, Title, and Carousel Controls */}
                      <div className="flex items-center justify-between mb-4">
                        {/* Logo and Source Title */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              US
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-400 dark:text-gray-400 uppercase tracking-wide">
                            USA Today
                          </h4>
                        </div>

                        {/* Carousel Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={goToPreviousUsaToday}
                            disabled={
                              newsItems.filter(
                                (item) => item.source === "USA Today"
                              ).length <= 1
                            }
                            className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                          >
                            ←
                          </button>
                          <span className="text-xs text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                            {usaTodayIndex + 1}/
                            {
                              newsItems.filter(
                                (item) => item.source === "USA Today"
                              ).length
                            }
                          </span>
                          <button
                            onClick={goToNextUsaToday}
                            disabled={
                              newsItems.filter(
                                (item) => item.source === "USA Today"
                              ).length <= 1
                            }
                            className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                          >
                            →
                          </button>
                        </div>
                      </div>

                      {/* Article Title */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
                        <a
                          href={
                            newsItems.filter(
                              (item) => item.source === "USA Today"
                            )[usaTodayIndex]?.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {truncateText(
                            newsItems.filter(
                              (item) => item.source === "USA Today"
                            )[usaTodayIndex]?.title || "",
                            80
                          )}
                        </a>
                      </h3>

                      {/* Image */}
                      {newsItems.filter((item) => item.source === "USA Today")[
                        usaTodayIndex
                      ]?.image && (
                        <div className="mb-4" style={{ height: "150px" }}>
                          <img
                            src={
                              newsItems.filter(
                                (item) => item.source === "USA Today"
                              )[usaTodayIndex]?.image
                            }
                            alt={
                              newsItems.filter(
                                (item) => item.source === "USA Today"
                              )[usaTodayIndex]?.title
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

                    {/* USA Today Content */}
                    <div
                      className="px-6 pb-6 flex-1 flex flex-col"
                      style={{ height: "180px" }}
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 overflow-hidden">
                        {truncateText(
                          newsItems.filter(
                            (item) => item.source === "USA Today"
                          )[usaTodayIndex]?.excerpt || ""
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Yahoo Sports Card with Carousel */}
                {newsItems.filter((item) => item.source === "Yahoo Sports")
                  .length > 0 && (
                  <motion.div
                    key={`yahoo-sports-${yahooSportsIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-[450px] flex flex-col"
                  >
                    {/* Yahoo Sports Header */}
                    <div
                      className="p-6 flex-shrink-0"
                      style={{ height: "320px" }}
                    >
                      {/* Top Row - Logo, Title, and Carousel Controls */}
                      <div className="flex items-center justify-between mb-4">
                        {/* Logo and Source Title */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              YS
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Yahoo Sports
                          </h4>
                        </div>

                        {/* Carousel Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={goToPreviousYahooSports}
                            disabled={
                              newsItems.filter(
                                (item) => item.source === "Yahoo Sports"
                              ).length <= 1
                            }
                            className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                          >
                            ←
                          </button>
                          <span className="text-xs text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                            {yahooSportsIndex + 1}/
                            {
                              newsItems.filter(
                                (item) => item.source === "Yahoo Sports"
                              ).length
                            }
                          </span>
                          <button
                            onClick={goToNextYahooSports}
                            disabled={
                              newsItems.filter(
                                (item) => item.source === "Yahoo Sports"
                              ).length <= 1
                            }
                            className="w-6 h-6 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                          >
                            →
                          </button>
                        </div>
                      </div>

                      {/* Article Title */}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
                        <a
                          href={
                            newsItems.filter(
                              (item) => item.source === "Yahoo Sports"
                            )[yahooSportsIndex]?.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {truncateText(
                            newsItems.filter(
                              (item) => item.source === "Yahoo Sports"
                            )[yahooSportsIndex]?.title || "",
                            80
                          )}
                        </a>
                      </h3>

                      {/* Image */}
                      {newsItems.filter(
                        (item) => item.source === "Yahoo Sports"
                      )[yahooSportsIndex]?.image && (
                        <div className="mb-6" style={{ height: "150px" }}>
                          <img
                            src={
                              newsItems.filter(
                                (item) => item.source === "Yahoo Sports"
                              )[yahooSportsIndex]?.image
                            }
                            alt={
                              newsItems.filter(
                                (item) => item.source === "Yahoo Sports"
                              )[yahooSportsIndex]?.title
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

                    {/* Yahoo Sports Content */}
                    <div
                      className="px-6 pb-6 flex-1 flex flex-col"
                      style={{ height: "180px" }}
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 overflow-hidden">
                        {truncateText(
                          newsItems.filter(
                            (item) => item.source === "Yahoo Sports"
                          )[yahooSportsIndex]?.excerpt || ""
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </section>
      </Suspense>
    </div>
  );
};

export default NewsAggregator;
