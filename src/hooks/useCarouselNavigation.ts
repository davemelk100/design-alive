import { useState, useCallback } from "react";
import { NewsItem } from "../types/news";

/**
 * Custom hook for managing carousel navigation for a specific source
 */
export const useCarouselNavigation = (
  sourceName: string,
  newsItems: NewsItem[]
) => {
  const [index, setIndex] = useState(0);

  const sourceItems = newsItems.filter((item) => item.source === sourceName);

  const goToNext = useCallback(() => {
    if (sourceItems.length > 0) {
      setIndex((prev) => (prev + 1) % sourceItems.length);
    }
  }, [sourceItems.length]);

  const goToPrevious = useCallback(() => {
    if (sourceItems.length > 0) {
      setIndex((prev) => (prev - 1 + sourceItems.length) % sourceItems.length);
    }
  }, [sourceItems.length]);

  const reset = useCallback(() => {
    setIndex(0);
  }, []);

  const currentItem = sourceItems[index] || null;

  return {
    index,
    currentItem,
    goToNext,
    goToPrevious,
    reset,
    totalItems: sourceItems.length,
  };
};

/**
 * Hook to manage multiple carousel navigations
 */
export const useMultipleCarousels = (newsItems: NewsItem[]) => {
  const [carouselIndices, setCarouselIndices] = useState<
    Record<string, number>
  >({});

  const getCurrentIndex = useCallback(
    (sourceName: string): number => {
      return carouselIndices[sourceName] || 0;
    },
    [carouselIndices]
  );

  const goToNext = useCallback(
    (sourceName: string) => {
      const sourceItems = newsItems.filter(
        (item) => item.source === sourceName
      );
      if (sourceItems.length > 0) {
        setCarouselIndices((prev) => ({
          ...prev,
          [sourceName]:
            ((prev[sourceName] || 0) + 1) % sourceItems.length,
        }));
      }
    },
    [newsItems]
  );

  const goToPrevious = useCallback(
    (sourceName: string) => {
      const sourceItems = newsItems.filter(
        (item) => item.source === sourceName
      );
      if (sourceItems.length > 0) {
        setCarouselIndices((prev) => ({
          ...prev,
          [sourceName]:
            ((prev[sourceName] || 0) - 1 + sourceItems.length) %
            sourceItems.length,
        }));
      }
    },
    [newsItems]
  );

  const resetAll = useCallback(() => {
    setCarouselIndices({});
  }, []);

  const reset = useCallback((sourceName: string) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [sourceName]: 0,
    }));
  }, []);

  return {
    getCurrentIndex,
    goToNext,
    goToPrevious,
    resetAll,
    reset,
  };
};

