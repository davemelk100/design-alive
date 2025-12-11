import { NewsItem, RSSFeed } from "../types/news";

/**
 * Generate default image URLs for known sources
 */
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

/**
 * Extract image URL from RSS item using multiple strategies
 */
const extractImageFromItem = (
  item: Element,
  sourceName: string,
  description: string
): string => {
  // Try enclosure tags first
  const enclosure = item.querySelector("enclosure[type*='image']");
  if (enclosure) {
    const url = enclosure.getAttribute("url");
    if (url) return url;
  }

  // Try media:content tags
  const mediaContent = item.querySelector(
    "media\\:content[type*='image'], content[type*='image']"
  );
  if (mediaContent) {
    const url = mediaContent.getAttribute("url");
    if (url) return url;
  }

  // Try media:thumbnail
  const mediaThumb = item.querySelector("media\\:thumbnail, thumbnail");
  if (mediaThumb) {
    const url = mediaThumb.getAttribute("url");
    if (url) return url;
  }

  // Try to extract from description if it contains HTML with images
  if (description.includes("<img")) {
    const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) return imgMatch[1];
  }

  // Try to extract from content field
  const content = item.querySelector("content")?.textContent || "";
  if (content.includes("<img")) {
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) return imgMatch[1];
  }

  // Try to find any image-like URL in the item
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
      return url;
    }
  }

  // Try to find any image URL in the item's text content
  const allText = item.textContent || "";
  const imageUrlMatch = allText.match(
    /(https?:\/\/[^"\s]+\.(?:jpg|jpeg|png|gif|webp))/i
  );
  if (imageUrlMatch) return imageUrlMatch[1];

  // Fallback to default image or placeholder
  const defaultImageUrl = generateDefaultImageUrl(sourceName);
  return defaultImageUrl || `placeholder:${sourceName}`;
};

/**
 * Parse RSS XML into NewsItem array
 */
export const parseRSS = (
  xmlText: string,
  sourceName: string,
  category: string
): NewsItem[] => {
  try {
    // Check if the response is HTML instead of XML
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
    if (items.length === 0) {
      items = xmlDoc.querySelectorAll("entry"); // Atom feeds
    }
    if (items.length === 0) {
      items = xmlDoc.querySelectorAll("article, story, news, post");
    }

    if (items.length === 0) {
      return [];
    }

    const parsedItems: NewsItem[] = [];

    items.forEach((item, index) => {
      try {
        // Extract title
        const title =
          item.querySelector("title")?.textContent?.trim() ||
          item.querySelector("name")?.textContent?.trim() ||
          item.querySelector("headline")?.textContent?.trim() ||
          "";

        // Extract link
        let link =
          item.querySelector("link")?.textContent?.trim() ||
          item.querySelector("url")?.textContent?.trim() ||
          item.querySelector("href")?.textContent?.trim() ||
          "";

        // For podcast feeds, use enclosure URL as fallback
        if (!link) {
          const enclosure = item.querySelector("enclosure");
          if (enclosure) {
            link = enclosure.getAttribute("url") || "";
          }
        }

        // Extract description
        const description =
          item.querySelector("description")?.textContent?.trim() ||
          item.querySelector("summary")?.textContent?.trim() ||
          item.querySelector("content")?.textContent?.trim() ||
          item.querySelector("excerpt")?.textContent?.trim() ||
          "";

        // Extract date
        const pubDate =
          item.querySelector("pubDate")?.textContent?.trim() ||
          item.querySelector("published")?.textContent?.trim() ||
          item.querySelector("date")?.textContent?.trim() ||
          item.querySelector("updated")?.textContent?.trim() ||
          new Date().toISOString();

        // Extract author
        const author =
          item.querySelector("author")?.textContent?.trim() ||
          item.querySelector("dc\\:creator")?.textContent?.trim() ||
          item.querySelector("creator")?.textContent?.trim() ||
          item.querySelector("writer")?.textContent?.trim() ||
          "";

        // Skip items without essential data
        if (!title || !link) {
          return;
        }

        // Special handling for Lambgoat to filter out forum posts
        if (sourceName === "Lambgoat" && title.includes("Forum:")) {
          return;
        }

        // Special handling for Lambgoat to filter out "Hardcore News & Metal News" entry
        if (
          sourceName === "Lambgoat" &&
          title === "Hardcore News & Metal News"
        ) {
          return;
        }

        // Special handling for Fox News to filter out "Latest Breaking News Videos" entry
        if (
          sourceName === "Fox News" &&
          title === "Latest Breaking News Videos"
        ) {
          return;
        }

        // Clean up description
        const cleanDescription = description
          ? description.replace(/<[^>]*>/g, "").substring(0, 200) + "..."
          : "No description available";

        // Extract image
        const image = extractImageFromItem(item, sourceName, description);

        // Extract video content
        let videoUrl = "";
        const videoMediaContent = item.querySelector(
          "media\\:content[medium='video'], media\\:content[type*='video']"
        );
        if (videoMediaContent) {
          videoUrl = videoMediaContent.getAttribute("url") || "";
        }

        const videoEnclosure = item.querySelector("enclosure[type*='video']");
        if (videoEnclosure && !videoUrl) {
          videoUrl = videoEnclosure.getAttribute("url") || "";
        }

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
          videoUrl: videoUrl || undefined,
        });
      } catch (itemError) {
        console.warn(
          `Error parsing item ${index} from ${sourceName}:`,
          itemError
        );
      }
    });

    // Limit to 10 items for carousel
    return parsedItems.slice(0, 10);
  } catch (parseError) {
    console.error(`Error parsing RSS XML for ${sourceName}:`, parseError);
    return [];
  }
};

/**
 * Fetch RSS feed using CORS proxies
 */
export const fetchRSSFeed = async (feed: RSSFeed): Promise<NewsItem[]> => {
  try {
    const proxyServices = [
      `https://corsproxy.io/?${encodeURIComponent(feed.url)}`,
      `https://thingproxy.freeboard.io/fetch/${feed.url}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(feed.url)}`,
    ];

    for (const proxyUrl of proxyServices) {
      try {
        const response = await fetch(proxyUrl, {
          method: "GET",
          headers: {
            Accept: "application/rss+xml, application/xml, text/xml, */*",
          },
        });

        if (!response.ok) {
          continue; // Try next proxy
        }

        const xmlText = await response.text();
        return parseRSS(xmlText, feed.name, feed.category);
      } catch (error) {
        console.warn(`Proxy ${proxyUrl} failed, trying next...`, error);
        continue; // Try next proxy
      }
    }

    throw new Error("All CORS proxies failed");
  } catch (error) {
    console.error(`Error fetching RSS feed ${feed.name}:`, error);
    return [];
  }
};
