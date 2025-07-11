import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ArticleModalProps {
  title: string;
  content: string;
  image?: string;
  date?: string;
  onClose: () => void;
}

export default function ArticleModal({
  title,
  content,
  image,
  date = "March 19, 2024",
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
              <h2 className="text-4xl sm:text-5xl font-bold dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6 text-nav text-gray-600 dark:text-gray-400">
              <span>Dave Melkonian</span>
              <span>•</span>
              <span>{date}</span>
            </div>
            {image && (
              <div className="float-right ml-8 mb-4 w-1/2 aspect-video overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
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
