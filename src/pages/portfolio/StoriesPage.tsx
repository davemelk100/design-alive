import { useState, lazy, Suspense } from "react";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import { content } from "../../content";
import {
  getCardImageProps,
} from "../../utils/imageOptimizer";
const ArticleModal = lazy(() => import("../../components/ArticleModal"));

export default function StoriesPage() {
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
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
            <SectionHeader
              title={content.stories.title}
              subtitle={content.stories.subtitle}
              className="mb-8"
            />
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
                    <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1 card-hover-secondary">
                      <h3 className="font-semibold text-brand-dynamic dark:text-white group-hover:font-bold transition-all">
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
