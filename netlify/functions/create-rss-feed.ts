import type { Handler } from "@netlify/functions";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  category?: string;
}

interface CreateRSSRequest {
  url: string;
}

interface CreateRSSResponse {
  success: boolean;
  rssXml?: string;
  error?: string;
}

export const createRSSFeed: Handler = async (event) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod === "GET") {
    // Simple test endpoint
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "RSS Feed Creator is working!",
        timestamp: new Date().toISOString(),
      }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    const { url }: CreateRSSRequest = JSON.parse(event.body || "{}");

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "URL is required" }),
      };
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Invalid URL format" }),
      };
    }

    // Fetch the HTML content
    let response;
    let html;

    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; RSSFeedCreator/1.0)",
        },
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!response.ok) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
          }),
        };
      }

      html = await response.text();
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      const errorMessage =
        fetchError instanceof Error
          ? fetchError.message
          : "Unknown fetch error";
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Failed to fetch URL: ${errorMessage}`,
        }),
      };
    }

    // Add some debugging for development
    console.log(`Fetched HTML from ${url}, length: ${html.length} characters`);

    // Log a sample of the HTML to help debug parsing issues
    const htmlSample = html.substring(0, 2000);
    console.log(`HTML Sample from ${url}:`);
    console.log(htmlSample);

    // Parse HTML and extract content
    const items = await parseHTMLToRSSItems(html, url);

    console.log(`Parsed ${items.length} items from ${url}`);

    if (items.length === 0) {
      // Add more detailed error information
      console.log(`No items found. HTML preview: ${html.substring(0, 500)}...`);

      // Try to create a minimal RSS feed from the page title
      try {
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const pageTitle = titleMatch ? titleMatch[1].trim() : "Custom RSS Feed";

        if (pageTitle && pageTitle.length > 5) {
          const minimalItems = [
            {
              title: pageTitle,
              link: url,
              description: `Content from ${pageTitle}`,
              pubDate: new Date().toUTCString(),
              author: "Unknown",
              category: "Custom",
            },
          ];

          const rssXml = generateRSSXML(url, minimalItems);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              rssXml,
              itemCount: 1,
              note: "Created minimal RSS feed from page title only",
            }),
          };
        }
      } catch (fallbackError) {
        console.error("Fallback RSS creation failed:", fallbackError);
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error:
            "No parseable content found on this page. The site may use JavaScript to load content or have a different structure than expected.",
        }),
      };
    }

    // Generate RSS XML
    const rssXml = generateRSSXML(url, items);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        rssXml,
        itemCount: items.length,
      }),
    };
  } catch (error) {
    console.error("Error creating RSS feed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Internal server error: ${errorMessage}`,
      }),
    };
  }
};

async function parseHTMLToRSSItems(
  html: string,
  baseUrl: string
): Promise<RSSItem[]> {
  const items: RSSItem[] = [];

  try {
    // Enhanced parsing for news websites and various content structures
    // Look for common article patterns with more flexibility
    const articlePatterns = [
      // Standard article tags
      /<article[^>]*>.*?<h[1-6][^>]*>(.*?)<\/h[1-6]>.*?<\/article>/gs,
      // Common blog/wordpress patterns
      /<div[^>]*class="[^"]*post[^"]*"[^>]*>.*?<h[1-6][^>]*>(.*?)<\/h[1-6]>.*?<\/div>/gs,
      /<div[^>]*class="[^"]*entry[^"]*"[^>]*>.*?<h[1-6][^>]*>(.*?)<\/h[1-6]>.*?<\/div>/gs,
      // News website patterns
      /<div[^>]*class="[^"]*news-item[^"]*"[^>]*>.*?<h[1-6][^>]*>(.*?)<\/h[1-6]>.*?<\/div>/gs,
      /<div[^>]*class="[^"]*story[^"]*"[^>]*>.*?<h[1-6][^>]*>(.*?)<\/h[1-6]>.*?<\/div>/gs,
      /<div[^>]*class="[^"]*article[^"]*"[^>]*>.*?<h[1-6][^>]*>(.*?)<\/h[1-6]>.*?<\/div>/gs,
      // Generic content containers
      /<div[^>]*class="[^"]*content[^"]*"[^>]*>.*?<h[1-6][^>]*>(.*?)<\/h[1-6]>.*?<\/div>/gs,
      /<div[^>]*class="[^"]*main[^"]*"[^>]*>.*?<h[1-6][^>]*>(.*?)<\/h[1-6]>.*?<\/div>/gs,
    ];

    for (const pattern of articlePatterns) {
      const matches = html.match(pattern);
      if (matches) {
        console.log(`Pattern matched ${matches.length} items`);
        for (const match of matches) {
          // Extract title
          const titleMatch = match.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/);
          if (titleMatch) {
            const title = titleMatch[1].replace(/<[^>]*>/g, "").trim();

            // Extract link (look for anchor tags)
            const linkMatch = match.match(/<a[^>]*href="([^"]*)"[^>]*>/);
            const link = linkMatch
              ? new URL(linkMatch[1], baseUrl).href
              : baseUrl;

            // Extract description (look for paragraph content)
            const descMatch = match.match(/<p[^>]*>(.*?)<\/p>/);
            const description = descMatch
              ? descMatch[1].replace(/<[^>]*>/g, "").trim()
              : "";

            // Extract date (look for time tags or date patterns)
            const dateMatch = match.match(/<time[^>]*datetime="([^"]*)"[^>]*>/);
            const pubDate = dateMatch
              ? new Date(dateMatch[1]).toUTCString()
              : new Date().toUTCString();

            items.push({
              title,
              link,
              description,
              pubDate,
              author: "Unknown",
              category: "Custom",
            });

            // Limit to 20 items
            if (items.length >= 20) break;
          }
        }
        if (items.length > 0) break;
      }
    }

    // If no articles found, try to extract from the main content
    if (items.length === 0) {
      const mainContent =
        html.match(/<main[^>]*>(.*?)<\/main>/s) ||
        html.match(/<div[^>]*id="content"[^>]*>(.*?)<\/div>/s) ||
        html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>(.*?)<\/div>/s);

      if (mainContent) {
        const headings = mainContent[1].match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g);
        if (headings) {
          for (const heading of headings.slice(0, 10)) {
            const title = heading.replace(/<[^>]*>/g, "").trim();
            if (title.length > 10) {
              // Only add meaningful titles
              items.push({
                title,
                link: baseUrl,
                description: `Content from ${title}`,
                pubDate: new Date().toUTCString(),
                author: "Unknown",
                category: "Custom",
              });
            }
          }
        }
      }
    }

    // Additional parsing for news websites - look for headline patterns
    if (items.length === 0) {
      // Look for news headlines in various formats
      const headlinePatterns = [
        // Look for links that contain headlines
        /<a[^>]*href="([^"]*)"[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/a>/g,
        // Look for divs with news-like content
        /<div[^>]*class="[^"]*(?:headline|title|news)[^"]*"[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/div>/g,
        // Look for spans with news content
        /<span[^>]*class="[^"]*(?:headline|title|news)[^"]*"[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/span>/g,
        // Look for h2, h3, h4 tags that might contain news headlines
        /<h[2-4][^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/h[2-4]>/g,
        // Look for list items that might contain news
        /<li[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/li>/g,
        // Look for news headlines in various div structures
        /<div[^>]*class="[^"]*(?:headline|title|news|story)[^"]*"[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/div>/g,
        // Look for time-based news items (common in news sites)
        /<time[^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/time>/g,
        // More aggressive patterns for news websites
        /<div[^>]*class="[^"]*(?:article|post|content|main)[^"]*"[^>]*>.*?<h[1-6][^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/h[1-6]>.*?<\/div>/gs,
        /<section[^>]*>.*?<h[1-6][^>]*>([^<]*(?:<[^>]*>[^<]*)*)<\/h[1-6]>.*?<\/section>/gs,
        // Look for any text that looks like a news headline (capitalized words, reasonable length)
        /<[^>]*>([A-Z][^<]{10,80})<\/[^>]*>/g,
      ];

      for (const pattern of headlinePatterns) {
        const matches = html.match(pattern);
        if (matches) {
          for (const match of matches) {
            // Extract title and link
            let title = "";
            let link = baseUrl;

            if (pattern.source.includes("href=")) {
              // This is a link pattern
              const linkMatch = match.match(/href="([^"]*)"/);
              const titleMatch = match.match(/>([^<]*(?:<[^>]*>[^<]*)*)</);

              if (linkMatch && titleMatch) {
                link = new URL(linkMatch[1], baseUrl).href;
                title = titleMatch[1].replace(/<[^>]*>/g, "").trim();
              }
            } else if (pattern.source.includes("h[2-4]")) {
              // This is a heading pattern - look for nearby links
              title = match.replace(/<[^>]*>/g, "").trim();
              // Try to find a link near this heading
              const nearbyLink = findNearbyLink(html, match, baseUrl);
              if (nearbyLink) {
                link = nearbyLink;
              }
            } else if (pattern.source.includes("li")) {
              // This is a list item pattern - look for links within it
              title = match.replace(/<[^>]*>/g, "").trim();
              const linkMatch = match.match(/href="([^"]*)"/);
              if (linkMatch) {
                link = new URL(linkMatch[1], baseUrl).href;
              }
            } else {
              // This is a content pattern
              title = match.replace(/<[^>]*>/g, "").trim();
            }

            if (
              title.length > 10 &&
              !items.some((item) => item.title === title)
            ) {
              items.push({
                title,
                link,
                description: `News: ${title}`,
                pubDate: new Date().toUTCString(),
                author: "Unknown",
                category: "News",
              });
            }

            // Limit to 20 items
            if (items.length >= 20) break;
          }
          if (items.length > 0) break;
        }
      }
    }

    // Last resort: look for any text that might be a headline
    if (items.length === 0) {
      console.log(
        "Trying last resort parsing - looking for any headline-like text"
      );

      // Look for any text that starts with a capital letter and is reasonable length
      const potentialHeadlines = html.match(
        /<[^>]*>([A-Z][^<]{15,100})<\/[^>]*>/g
      );
      if (potentialHeadlines) {
        for (const potential of potentialHeadlines.slice(0, 15)) {
          const title = potential.replace(/<[^>]*>/g, "").trim();

          // Filter out common non-headline text
          if (
            title &&
            title.length > 15 &&
            title.length < 200 &&
            !title.includes("Skip to") &&
            !title.includes("Open") &&
            !title.includes("Close") &&
            !title.includes("Follow") &&
            !title.includes("Copyright") &&
            !title.includes("Privacy") &&
            !title.includes("Terms") &&
            !title.includes("Cookie") &&
            !title.includes("Sign In") &&
            !title.includes("Join") &&
            !title.includes("Subscribe") &&
            !title.includes("Newsletter") &&
            !items.some((item) => item.title === title)
          ) {
            items.push({
              title,
              link: baseUrl,
              description: `Content: ${title}`,
              pubDate: new Date().toUTCString(),
              author: "Unknown",
              category: "News",
            });
          }

          if (items.length >= 10) break;
        }
      }

      // If still no items, try to find any meaningful text content
      if (items.length === 0) {
        console.log("Trying to extract any meaningful text content");

        // Look for any text that might be content
        const textContent = html.match(/<[^>]*>([^<]{20,150})<\/[^>]*>/g);
        if (textContent) {
          for (const text of textContent.slice(0, 20)) {
            const content = text.replace(/<[^>]*>/g, "").trim();

            // Only add if it looks like meaningful content
            if (
              content &&
              content.length > 20 &&
              content.length < 200 &&
              !content.includes("Skip to") &&
              !content.includes("Open") &&
              !content.includes("Close") &&
              !content.includes("Follow") &&
              !content.includes("Copyright") &&
              !content.includes("Privacy") &&
              !content.includes("Terms") &&
              !content.includes("Cookie") &&
              !content.includes("Sign In") &&
              !content.includes("Join") &&
              !content.includes("Subscribe") &&
              !content.includes("Newsletter") &&
              !content.includes("Loading") &&
              !content.includes("Please wait") &&
              !items.some((item) => item.title === content)
            ) {
              items.push({
                title:
                  content.substring(0, 100) +
                  (content.length > 100 ? "..." : ""),
                link: baseUrl,
                description: `Content: ${content}`,
                pubDate: new Date().toUTCString(),
                author: "Unknown",
                category: "Content",
              });
            }

            if (items.length >= 15) break;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error parsing HTML:", error);
    // Re-throw the error to be caught by the main handler
    throw new Error(
      `HTML parsing failed: ${
        error instanceof Error ? error.message : "Unknown parsing error"
      }`
    );
  }

  return items;
}

// Helper function to find links near headings
function findNearbyLink(
  html: string,
  headingMatch: string,
  baseUrl: string
): string | null {
  try {
    // Look for links within a reasonable distance of the heading
    const headingIndex = html.indexOf(headingMatch);
    if (headingIndex === -1) return null;

    // Look for links in the next 500 characters after the heading
    const searchArea = html.substring(headingIndex, headingIndex + 500);
    const linkMatch = searchArea.match(/<a[^>]*href="([^"]*)"[^>]*>/);

    if (linkMatch) {
      return new URL(linkMatch[1], baseUrl).href;
    }
  } catch (error) {
    console.error("Error finding nearby link:", error);
  }

  return null;
}

function generateRSSXML(baseUrl: string, items: RSSItem[]): string {
  const siteUrl = new URL(baseUrl);
  const siteName = siteUrl.hostname.replace("www.", "");

  const rssItems = items
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      <author>${item.author}</author>
      <category>${item.category}</category>
      <guid isPermaLink="false">${item.link}</guid>
    </item>
  `
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName} - Custom RSS Feed</title>
    <link>${baseUrl}</link>
    <description>Custom RSS feed generated for ${siteName}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;
}

export { createRSSFeed as handler };
