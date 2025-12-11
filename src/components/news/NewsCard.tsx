import { ExternalLink } from "lucide-react";
import { NewsItem, RSSFeed, ViewMode } from "../../types/news";
import {
  getCategoryIcon,
  getFeedCategory,
  truncateText,
} from "../../utils/newsUtils";
import { getOptimizedImage } from "../../utils/imageOptimizer";

interface NewsCardProps {
  feed: RSSFeed;
  feedItems: NewsItem[];
  currentIndex: number;
  viewMode: ViewMode;
  onNext: () => void;
  onPrevious: () => void;
}

export const NewsCard = ({
  feed,
  feedItems,
  currentIndex,
  viewMode,
  onNext,
  onPrevious,
}: NewsCardProps) => {
  const currentItem = feedItems[currentIndex];
  if (!currentItem) return null;

  const category = getFeedCategory(feed.name);
  const icon = getCategoryIcon(category);

  const borderColor =
    category === "technology"
      ? "#f79d84"
      : category === "sports"
      ? "#59cd90"
      : category === "business"
      ? "#3fa7d6"
      : category === "entertainment"
      ? "#a855f7"
      : category === "food"
      ? "#ef4444"
      : category === "politics"
      ? "#f79d84"
      : "#6b7280";

  return (
    <div
      className={`bg-white/10 backdrop-blur-2xl border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] rounded-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_40px_0_rgba(255,255,255,0.15)] transition-all duration-300 flex flex-col border-l-4 ${
        viewMode === "grid"
          ? "min-h-[650px] h-auto"
          : "w-full h-auto justify-center relative"
      }`}
      style={{
        borderLeftColor: borderColor,
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
        {/* Top Row - Title and Carousel Controls */}
        <div
          className={`${
            viewMode === "list"
              ? "flex items-center justify-between"
              : viewMode === "grid"
              ? "flex items-center justify-between pt-2 pb-4"
              : "flex items-center justify-between mb-4 pt-3 pb-6"
          }`}
        >
          <h4
            className={`font-normal text-gray-700 dark:text-white uppercase tracking-wide flex-shrink-0 ${
              viewMode === "list" ? "text-xs sm:text-sm" : "text-base"
            }`}
          >
            {feed.name}
          </h4>

          {/* Carousel Controls - Show in list view only */}
          {viewMode === "list" && feedItems.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={onPrevious}
                disabled={feedItems.length <= 1}
                className="carousel-button w-10 h-7 text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors leading-none"
              >
                <span className="flex items-center justify-center h-full translate-y-[2px]">
                  ←
                </span>
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 w-6 h-6 flex items-center justify-center">
                {currentIndex + 1}/{feedItems.length}
              </span>
              <button
                onClick={onNext}
                disabled={feedItems.length <= 1}
                className="carousel-button w-10 h-7 text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed bg-gray-200 dark:bg-gray-500 rounded border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-400 transition-colors leading-none"
              >
                <span className="flex items-center justify-center h-full translate-y-[2px]">
                  →
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Article Title - Show in grid view only */}
        {viewMode === "grid" && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight mb-2">
            <a
              href={currentItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              {truncateText(currentItem.title, 90)}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </h3>
        )}

        {/* Subtitle below headline - Show in grid view only */}
        {viewMode === "grid" && currentItem.excerpt && (
          <div className="mt-3 flex items-center">
            <p className="text-xs text-gray-600 dark:text-white news-card-excerpt">
              {truncateText(currentItem.excerpt, 400)}
            </p>
          </div>
        )}
      </div>

      {/* Image/Content Area */}
      <div
        className={`flex-1 relative ${
          viewMode === "list"
            ? "h-24 sm:h-32"
            : viewMode === "grid"
            ? "h-96"
            : "h-96"
        }`}
      >
        {currentItem.image && !currentItem.image.startsWith("placeholder:") ? (
          <img
            src={getOptimizedImage(currentItem.image, 512)}
            alt={currentItem.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const placeholder =
                target.parentElement?.querySelector(".image-placeholder");
              if (placeholder) {
                (placeholder as HTMLElement).style.display = "flex";
              }
            }}
          />
        ) : (
          <div className="image-placeholder w-full h-full rounded-lg flex items-center justify-center bg-transparent">
            <span className="text-gray-600 dark:text-gray-300 font-bold text-4xl">
              {icon}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
