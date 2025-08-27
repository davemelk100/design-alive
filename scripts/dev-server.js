import express from "express";
import cors from "cors";

const app = express();
const PORT = 8888;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Development server running",
    timestamp: new Date().toISOString(),
  });
});

// RSS feed creation endpoint
app.post("/create-rss-feed", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Invalid URL format",
      });
    }

    // Fetch the HTML content
    let response;
    let html;

    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; RSSFeedCreator/1.0)",
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!response.ok) {
        return res.status(400).json({
          success: false,
          error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
        });
      }

      html = await response.text();
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      const errorMessage =
        fetchError instanceof Error
          ? fetchError.message
          : "Unknown fetch error";
      return res.status(400).json({
        success: false,
        error: `Failed to fetch URL: ${errorMessage}`,
      });
    }

    // Simple HTML parsing for development
    const items = [];
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : "Custom RSS Feed";

    if (pageTitle && pageTitle.length > 5) {
      items.push({
        title: pageTitle,
        link: url,
        description: `Content from ${pageTitle}`,
        pubDate: new Date().toUTCString(),
        author: "Unknown",
        category: "Custom",
      });
    }

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        error:
          "No parseable content found on this page. The site may use JavaScript to load content or have a different structure than expected.",
      });
    }

    // Generate simple RSS XML
    const siteUrl = new URL(url);
    const siteName = siteUrl.hostname.replace("www.", "");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName} - Custom RSS Feed</title>
    <link>${url}</link>
    <description>Custom RSS feed generated for ${siteName}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${url}" rel="self" type="application/rss+xml" />
    <item>
      <title><![CDATA[${items[0].title}]]></title>
      <link>${items[0].link}</link>
      <description><![CDATA[${items[0].description}]]></description>
      <pubDate>${items[0].pubDate}</pubDate>
      <author>${items[0].author}</author>
      <category>${items[0].category}</category>
      <guid isPermaLink="false">${items[0].link}</guid>
    </item>
  </channel>
</rss>`;

    res.json({
      success: true,
      rssXml,
      itemCount: items.length,
      note: "Created minimal RSS feed from page title only (development mode)",
    });
  } catch (error) {
    console.error("Error in RSS feed creation:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error: " + error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running on http://localhost:${PORT}`);
  console.log(`📡 RSS feed endpoint: http://localhost:${PORT}/create-rss-feed`);
});
