import React, { useState, lazy, Suspense } from "react";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import IconWrapper from "../../components/IconWrapper";
import { content } from "../../content";
import {
  getCardImageProps,
  getThumbnailImageProps,
} from "../../utils/imageOptimizer";

const LazyExternalLink = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ExternalLink })),
);
const ArticleModal = lazy(() => import("../../components/ArticleModal"));

export default function StoriesPage() {
  const [storiesViewMode, setStoriesViewMode] = useState<"list" | "grid">("list");
  const [selectedStory, setSelectedStory] = useState<{
    title: string;
    content: string;
    subtitle?: string;
  } | null>(null);

  const stories = content.stories.items.filter(
    (story) => story.title !== "Design Management",
  );

  return (
    <PortfolioLayout currentPage="stories">
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
            <SectionHeader
              title={content.stories.title}
              subtitle={content.stories.subtitle}
              className="mb-8"
              toggleView={(mode) => setStoriesViewMode(mode)}
              viewMode={storiesViewMode}
            />
            {storiesViewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {stories.map((story) => (
                  <div
                    key={story.title}
                    onClick={() => {
                      if (story.hasModal) {
                        setSelectedStory({
                          title: story.title,
                          content: story.content,
                          subtitle: story.subtitle,
                        });
                      }
                    }}
                    className={`group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col shadow-xl hover:shadow-2xl transition-shadow ${
                      story.hasModal ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-transparent">
                      {story.image ? (
                        <img
                          {...getCardImageProps(story.image)}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                          <span className="text-gray-400 dark:text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:font-bold transition-all">
                        {story.title}
                      </h3>
                      {story.subtitle && (
                        <p className="text-gray-600 dark:text-white line-clamp-2">
                          {story.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {stories.map((story) => (
                  <div
                    key={story.title}
                    onClick={() => {
                      if (story.hasModal) {
                        setSelectedStory({
                          title: story.title,
                          content: story.content,
                          subtitle: story.subtitle,
                        });
                      }
                    }}
                    className={`group flex items-center gap-4 p-3 rounded-lg bg-white/20 backdrop-blur-lg transition-all shadow-xl hover:shadow-2xl ${
                      story.hasModal ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded bg-transparent">
                      {story.image ? (
                        <img
                          {...getThumbnailImageProps(story.image)}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                          <span className="text-gray-400 dark:text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:font-bold transition-all truncate">
                        {story.title}
                      </h3>
                      {story.subtitle && (
                        <p className="text-gray-600 dark:text-white line-clamp-1 mt-1">
                          {story.subtitle}
                        </p>
                      )}
                    </div>
                    {story.hasModal && (
                      <IconWrapper
                        Icon={LazyExternalLink}
                        className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedStory && (
        <Suspense fallback={null}>
          <ArticleModal
            title={selectedStory.title}
            content={selectedStory.content}
            onClose={() => setSelectedStory(null)}
          />
        </Suspense>
      )}
    </PortfolioLayout>
  );
}
