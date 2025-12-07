import { useState, useEffect, useCallback } from "react";
import { NewsItem, RSSFeed } from "../types/news";
import { fetchRSSFeed } from "../services/rssService";

/**
 * Custom hook for managing RSS feeds and news items
 */
export const useRSSFeeds = (feeds: RSSFeed[]) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRSSFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const enabledFeeds = feeds.filter((feed) => feed.enabled);
      const feedPromises = enabledFeeds.map((feed) => fetchRSSFeed(feed));

      const results = await Promise.allSettled(feedPromises);
      const allItems: NewsItem[] = [];

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          allItems.push(...result.value);
        } else {
          console.error(
            `Failed to load feed ${enabledFeeds[index].name}:`,
            result.reason
          );
        }
      });

      setNewsItems(allItems);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load RSS feeds"
      );
    } finally {
      setLoading(false);
    }
  }, [feeds]);

  useEffect(() => {
    loadRSSFeeds();
  }, [loadRSSFeeds]);

  return {
    newsItems,
    loading,
    error,
    reload: loadRSSFeeds,
  };
};

