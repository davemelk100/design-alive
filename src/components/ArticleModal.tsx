import { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { getResponsiveImage } from "../utils/imageOptimizer";

// Lazy load icon to avoid blocking critical path
const LazyX = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.X }))
);

interface ArticleModalProps {
  title: string;
  content: string;
  image?: string;
  onClose: () => void;
}

export default function ArticleModal({
  title,
  content,
  image,
  onClose,
}: ArticleModalProps) {
  // Add escape key functionality
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const renderContent = (text: string) => {
    return text.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-2xl font-bold mb-4 mt-6 dark:text-white"
          >
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
      if (paragraph.includes("I mean, make sure my tombstone uses Helvetica")) {
        return (
          <>
            <div
              key={`quote-${index}`}
              className="float-right w-1/2 ml-8 my-4 p-8 border-l-4 border-primary bg-gray-50 dark:bg-gray-800 text-2xl relative font-serif"
            >
              <span className="absolute -top-4 -left-4 text-6xl text-primary/20">
                "
              </span>
              {paragraph}
              <span className="absolute -bottom-8 -right-4 text-6xl text-primary/20">
                "
              </span>
            </div>
            <p key={index} className="mb-4 dark:text-gray-200">
              {paragraph}
            </p>
          </>
        );
      }
      if (paragraph.includes("if your product has 10,000 users")) {
        return (
          <>
            <p key={index} className="mb-4 dark:text-gray-200">
              {paragraph}
            </p>
            <div
              key={`quote-${index}`}
              className="float-right w-1/2 ml-8 my-4 p-8 border-l-4 border-primary bg-gray-50 dark:bg-gray-800 text-2xl relative font-serif"
            >
              <span className="absolute -top-4 -left-4 text-6xl text-primary/20">
                "
              </span>
              Think about it: if your product has 10,000 users and each one
              takes just 10 seconds to decide your experience isn't worth their
              time, that's 10,000 potential customers walking away. What's that
              worth to you?
              <span className="absolute -bottom-8 -right-4 text-6xl text-primary/20">
                "
              </span>
            </div>
          </>
        );
      }
      return (
        <p key={index} className="mb-4 dark:text-gray-200">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Close modal"
              >
                <Suspense
                  fallback={<span className="h-4 w-4 sm:h-5 sm:w-5">×</span>}
                >
                  <LazyX className="h-4 w-4 sm:h-5 sm:w-5" />
                </Suspense>
              </button>
            </div>
            {image && (
              <div className="float-right ml-8 mb-4 w-1/2 aspect-video overflow-hidden rounded-lg">
                {(() => {
                  const responsive = getResponsiveImage(
                    image,
                    [400, 600, 800],
                    70
                  );
                  return (
                    <img
                      src={responsive.src}
                      srcSet={responsive.srcSet}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={450}
                    />
                  );
                })()}
              </div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {renderContent(content)}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
