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
    id: "fox-sports",
    name: "Fox Sports",
    url: "https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30",
    category: "sports",
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
    category: "politics",
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
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [arsTechnicaIndex, setArsTechnicaIndex] = useState(0);
  const [wiredIndex, setWiredIndex] = useState(0);
  const [techradarIndex, setTechradarIndex] = useState(0);
  const [foxSportsIndex, setFoxSportsIndex] = useState(0);
  const [cnnSportsIndex, setCnnSportsIndex] = useState(0);

  const [lambgoatIndex, setLambgoatIndex] = useState(0);
  const [noEchoIndex, setNoEchoIndex] = useState(0);
  const [newsweekIndex, setNewsweekIndex] = useState(0);
  const [newYorkPostIndex, setNewYorkPostIndex] = useState(0);
  const [foxNewsIndex, setFoxNewsIndex] = useState(0);
  const [cbsSportsIndex, setCbsSportsIndex] = useState(0);
  const [breitbartIndex, setBreitbartIndex] = useState(0);

  const [techcrunchIndex, setTechcrunchIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [feedStatus, setFeedStatus] = useState<{
    [key: string]: { working: boolean; error?: string };
  }>({});

  // Helper functions for dynamic cards
  const getCurrentIndex = (sourceName: string) => {
    switch (sourceName) {
      case "Ars Technica":
        return arsTechnicaIndex;
      case "WIRED":
        return wiredIndex;
      case "TechRadar":
        return techradarIndex;
      case "Fox Sports":
        return foxSportsIndex;
      case "CNN - SPORTS":
        return cnnSportsIndex;

      case "Lambgoat":
        return lambgoatIndex;
      case "No Echo":
        return noEchoIndex;
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

      case "TechCrunch":
        return techcrunchIndex;
      default:
        return 0;
    }
  };

  const getLogoColor = (sourceName: string) => {
    switch (sourceName) {
      case "Ars Technica":
        return "bg-orange-300";
      case "WIRED":
        return "bg-orange-300";

      case "Fox Sports":
        return "bg-emerald-300";
      case "CNN - SPORTS":
        return "bg-emerald-300";

      case "TechRadar":
        return "bg-orange-300";
      case "Lambgoat":
        return "bg-rose-300";
      case "No Echo":
        return "bg-rose-300";
      case "Newsweek":
        return "bg-violet-300";
      case "New York Post":
        return "bg-rose-300";
      case "Fox News":
        return "bg-violet-300";
      case "CBS SPORTS":
        return "bg-emerald-300";
      case "Breitbart":
        return "bg-violet-300";

      case "TechCrunch":
        return "bg-orange-300";
      default:
        return "bg-blue-300";
    }
  };

  const getLogoTextColor = (sourceName: string) => {
    switch (sourceName) {
      case "Ars Technica":
        return "text-orange-900";
      case "WIRED":
        return "text-orange-900";

      case "Fox Sports":
        return "text-emerald-900";
      case "CNN - SPORTS":
        return "text-emerald-900";

      case "TechRadar":
        return "text-orange-900";
      case "Lambgoat":
        return "text-rose-900";
      case "No Echo":
        return "text-rose-900";
      case "Newsweek":
        return "text-violet-900";
      case "New York Post":
        return "text-rose-900";
      case "Fox News":
        return "text-violet-900";
      case "CBS SPORTS":
        return "text-emerald-900";
      case "Breitbart":
        return "text-violet-900";

      case "TechCrunch":
        return "text-orange-900";
      default:
        return "text-blue-900";
    }
  };

  const getLogoText = (sourceName: string) => {
    switch (sourceName) {
      case "Ars Technica":
        return "T";
      case "WIRED":
        return "T";

      case "Fox Sports":
        return "S";
      case "CNN - SPORTS":
        return "S";

      case "TechRadar":
        return "T";
      case "Lambgoat":
        return "E";
      case "No Echo":
        return "E";
      case "Newsweek":
        return "B";
      case "New York Post":
        return "E";
      case "Fox News":
        return "B";
      case "CBS SPORTS":
        return "S";
      case "Breitbart":
        return "B";

      case "TechCrunch":
        return "T";
      default:
        return "";
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
      case "Fox Sports":
        goToPreviousFoxSports();
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
      case "Fox Sports":
        goToNextFoxSports();
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
    console.log(`Parsing RSS XML for ${sourceName}, length: ${xmlText.length}`);

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

      console.log(`XML document created, parsing items...`);

      // Try multiple selectors for RSS items
      let items = xmlDoc.querySelectorAll("item");
      console.log(`Found ${items.length} items with 'item' selector`);

      // If no items found, try alternative selectors
      if (items.length === 0) {
        items = xmlDoc.querySelectorAll("entry"); // Atom feeds use 'entry'
        console.log(`Found ${items.length} items with 'entry' selector`);
      }

      // Try other common selectors
      if (items.length === 0) {
        items = xmlDoc.querySelectorAll("article, story, news, post");
        console.log(`Found ${items.length} items with alternative selectors`);
      }

      if (items.length === 0) {
        console.warn(`No items found for ${sourceName}, returning empty array`);
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
              console.log(
                `Image extracted from description for ${sourceName}: ${image}`
              );
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
              console.log(
                `Image URL found in text content for ${sourceName}: ${image}`
              );
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
          if (image) {
            console.log(
              `Image found for ${sourceName}: ${image.substring(0, 100)}...`
            );
          } else {
            console.log(`No image found for ${sourceName}, using placeholder`);
          }

          // Skip items without essential data
          if (!title || !link) {
            console.log(
              `Skipping item ${index} from ${sourceName} - missing title or link`
            );
            return;
          }

          // Special handling for Lambgoat to filter out forum posts
          if (sourceName === "Lambgoat" && title.includes("Forum:")) {
            console.log(
              `Filtering out Forum item from Lambgoat: ${title.substring(
                0,
                50
              )}`
            );
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

          console.log(
            `Successfully parsed item ${index + 1} from ${sourceName}:`,
            {
              title: title.substring(0, 50),
              image: image
                ? `Found: ${image.substring(0, 50)}...`
                : "Not found",
              description: cleanDescription.substring(0, 50),
              category: category,
            }
          );
        } catch (itemError) {
          console.warn(
            `Error parsing item ${index} from ${sourceName}:`,
            itemError
          );
          // Continue parsing other items
        }
      });

      console.log(
        `Successfully parsed ${parsedItems.length} items from ${sourceName}`
      );

      return parsedItems.slice(0, 10); // Limit to 10 items for carousel
    } catch (parseError) {
      console.error(`Error parsing RSS XML for ${sourceName}:`, parseError);
      console.error(`XML content:`, xmlText.substring(0, 1000));
      return []; // Return empty array instead of throwing error
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
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
          feed.url
        )}`,
        `https://cors-anywhere.herokuapp.com/${feed.url}`,
        `https://cors.bridged.cc/${feed.url}`,
        `https://cors.eu.org/${feed.url}`,
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
            // Add timeout
            signal: AbortSignal.timeout(10000), // 10 second timeout
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
    console.log("Starting to load RSS feeds...");
    setLoading(true);
    setError(null);

    try {
      const allNewsItems: NewsItem[] = [];
      const feedResults = await Promise.allSettled(
        rssFeeds.map(async (feed) => {
          try {
            const items = await fetchRSSFeed(feed);
            console.log(`Feed ${feed.name}: ${items.length} items loaded`);
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

      console.log("Processing feed results:", feedResults);

      feedResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value.success) {
          allNewsItems.push(...result.value.items);
          newFeedStatus[result.value.feed.name] = { working: true };
          console.log(`Feed ${result.value.feed.name} marked as working`);
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
          console.log(`Feed ${result.value.feed.name} marked as failed`);
        } else if (result.status === "rejected") {
          console.warn(`Feed failed with rejected promise:`, result.reason);
          // For rejected promises, we don't have the feed name, so we can't set specific status
          // This is a fallback case
        }
      });

      console.log("Final feed status:", newFeedStatus);
      setFeedStatus(newFeedStatus);

      // Count successful vs failed feeds
      const successfulFeeds = feedResults.filter(
        (result) => result.status === "fulfilled" && result.value.success
      ).length;
      const totalFeeds = rssFeeds.length;

      console.log(`Successfully loaded ${successfulFeeds}/${totalFeeds} feeds`);

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
      setFoxSportsIndex(0);
      setCnnSportsIndex(0);

      setLambgoatIndex(0);
      setNoEchoIndex(0);
      setNewsweekIndex(0); // Reset Newsweek carousel
      setNewYorkPostIndex(0); // Reset New York Post carousel
      setFoxNewsIndex(0); // Reset Fox News carousel
      setCbsSportsIndex(0); // Reset CBS Sports carousel
      setBreitbartIndex(0); // Reset Breitbart carousel

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

          {/* Left Navigation Sidebar */}
          <nav
            className={`${
              isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4 transition-transform duration-300 ease-in-out lg:transition-none`}
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
                onClick={() => setActiveCategory("all")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === "all"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-l-4 border-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-300 rounded flex items-center justify-center">
                    <span className="text-blue-900 text-xs font-bold">A</span>
                  </div>
                  <span className="font-medium">All News</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("technology")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === "technology"
                    ? "bg-orange-50 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-l-4 border-orange-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-300 rounded flex items-center justify-center">
                    <span className="text-orange-900 text-xs font-bold">T</span>
                  </div>
                  <span className="font-medium">Technology</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("sports")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === "sports"
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 border-l-4 border-emerald-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-300 rounded flex items-center justify-center">
                    <span className="text-emerald-900 text-xs font-bold">
                      S
                    </span>
                  </div>
                  <span className="font-medium">Sports</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("business")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === "business"
                    ? "bg-violet-50 dark:bg-violet-900/30 text-violet-900 dark:text-violet-100 border-l-4 border-violet-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-violet-300 rounded flex items-center justify-center">
                    <span className="text-violet-900 text-xs font-bold">B</span>
                  </div>
                  <span className="font-medium">Business</span>
                </div>
              </button>

              <button
                onClick={() => setActiveCategory("entertainment")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeCategory === "entertainment"
                    ? "bg-rose-50 dark:bg-rose-900/30 text-rose-900 dark:text-rose-100 border-l-4 border-rose-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-rose-300 rounded flex items-center justify-center">
                    <span className="text-rose-900 text-xs font-bold">M</span>
                  </div>
                  <span className="font-medium">Music</span>
                </div>
              </button>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 lg:ml-0">
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.8, delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {/* Dynamic News Cards */}
                    {(() => {
                      const filteredFeeds = rssFeeds.filter(
                        (feed) =>
                          activeCategory === "all" ||
                          feed.category === activeCategory
                      );

                      console.log(
                        `Rendering ${filteredFeeds.length} feeds for category: ${activeCategory}`
                      );
                      console.log(
                        "Filtered feeds:",
                        filteredFeeds.map((f) => ({
                          name: f.name,
                          category: f.category,
                        }))
                      );
                      console.log(
                        "Available news items:",
                        newsItems.map((item) => ({
                          source: item.source,
                          title: item.title.substring(0, 30),
                        }))
                      );
                      console.log("Feed status:", feedStatus);

                      return filteredFeeds.map((feed) => {
                        const feedItems = newsItems.filter(
                          (item) => item.source === feed.name
                        );
                        const currentIndex = getCurrentIndex(feed.name);
                        const currentFeedStatus = feedStatus[feed.name];

                        console.log(`Processing feed: ${feed.name}`, {
                          hasItems: feedItems.length > 0,
                          itemCount: feedItems.length,
                          status: currentFeedStatus,
                          category: feed.category,
                          feedId: feed.id,
                          feedUrl: feed.url,
                        });

                        // Always show the card, even if no items
                        return (
                          <motion.div
                            key={`${feed.id}-${currentIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-[350px] flex flex-col"
                          >
                            {/* Card Header */}
                            <div className="p-6 flex-shrink-0">
                              {/* Top Row - Logo, Title, and Carousel Controls */}
                              <div className="flex items-center justify-between mb-4">
                                {/* Logo and Source Title */}
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-6 h-6 ${getLogoColor(
                                      feed.name
                                    )} rounded flex items-center justify-center`}
                                  >
                                    <span
                                      className={`${getLogoTextColor(
                                        feed.name
                                      )} font-bold text-xs`}
                                    >
                                      {getLogoText(feed.name)}
                                    </span>
                                  </div>
                                  <h4 className="text-base font-normal text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                    {feed.name}
                                  </h4>
                                </div>

                                {/* Carousel Controls - Only show if there are items */}
                                {feedItems.length > 1 && (
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
                                )}
                              </div>

                              {/* Article Title or Status Message */}
                              {feedItems.length > 0 ? (
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                                  <a
                                    href={feedItems[currentIndex]?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                  >
                                    {truncateText(
                                      feedItems[currentIndex]?.title || "",
                                      90
                                    )}
                                  </a>
                                </h3>
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
                              className="px-6 pb-6 flex-1 flex flex-col"
                              style={{ height: "180px" }}
                            >
                              {/* Image or Placeholder */}
                              {feedItems.length > 0 &&
                              feedItems[currentIndex]?.image &&
                              !feedItems[currentIndex]?.image.startsWith(
                                "placeholder:"
                              ) ? (
                                <div
                                  className="mt-auto relative"
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
                                    className="image-placeholder hidden w-full h-36 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
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

                                  {/* Subtitle overlay on hover */}
                                  <div className="absolute inset-0 bg-black bg-opacity-75 text-white p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                    <p className="text-sm leading-relaxed text-center">
                                      {truncateText(
                                        feedItems[currentIndex]?.excerpt || "",
                                        150
                                      )}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                // No image available or placeholder - show styled placeholder
                                <div
                                  className="mt-auto w-full h-36 rounded-lg flex items-center justify-center"
                                  style={{
                                    height: "150px",
                                    minHeight: "150px",
                                    maxHeight: "150px",
                                  }}
                                >
                                  {feedItems.length > 0 &&
                                  feedItems[currentIndex]?.image &&
                                  feedItems[currentIndex]?.image.startsWith(
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
                                    <div className="w-full h-36 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center relative">
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
                          </motion.div>
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
                          <motion.div
                            key={`custom-${customFeed.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 h-[350px] flex flex-col"
                            style={{ height: "320px" }}
                          >
                            {/* Custom Feed Header */}
                            <div className="p-6 flex-shrink-0">
                              {/* Top Row - Logo, Title, and Remove Button */}
                              <div className="flex items-center justify-between mb-4">
                                {/* Logo and Source Title */}
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 bg-purple-300 rounded flex items-center justify-center">
                                    <span className="text-purple-900 font-bold text-xs">
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
                                    90
                                  )}
                                </a>
                              </h3>
                            </div>

                            {/* Custom Feed Content */}
                            <div
                              className="px-6 pb-6 flex-1 flex flex-col"
                              style={{ height: "180px" }}
                            >
                              {/* Image */}
                              {customFeedItems[0]?.image &&
                              !customFeedItems[0]?.image.startsWith(
                                "placeholder:"
                              ) ? (
                                <div
                                  className="mt-auto relative"
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
                                    className="image-placeholder hidden w-full h-36 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
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

                                  {/* Subtitle overlay on hover */}
                                  <div className="absolute inset-0 bg-black bg-opacity-75 text-white p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                    <p className="text-sm leading-relaxed text-center">
                                      {truncateText(
                                        customFeedItems[0]?.excerpt || "",
                                        150
                                      )}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                // No image available or placeholder - show styled placeholder
                                <div
                                  className="mt-auto w-full h-36 rounded-lg flex items-center justify-center"
                                  style={{
                                    height: "150px",
                                    minHeight: "150px",
                                    maxHeight: "150px",
                                  }}
                                >
                                  {customFeedItems[0]?.image?.startsWith(
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
                                    <div className="w-full h-36 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                      <div className="text-center text-gray-500 dark:text-gray-400">
                                        <div className="text-4xl">📰</div>
                                      </div>
                                    </div>
                                  )}
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
