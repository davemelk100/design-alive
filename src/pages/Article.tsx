import { useParams, Link, useNavigate } from "react-router-dom";
import { content } from "../content";
import { slugify } from "../utils/slugify";
import ShareWidget from "../components/ShareWidget";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import MobileTrayMenu from "../components/MobileTrayMenu";
import { getOptimizedImage } from "../utils/imageOptimizer";

export default function Article() {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    // Wait for navigation to complete before scrolling
    setTimeout(() => {
      const articlesSection = document.getElementById("articles");
      if (articlesSection) {
        articlesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Find the article that matches the slug
  const article = content.articles.items.find(
    (article) => slugify(article.title) === slug
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8 relative z-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Link>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-card">
            Article Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The article you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const renderContent = (text: string) => {
    // Remove h1 tags from content since title is already displayed
    const contentWithoutH1 = text.replace(/<h1[^>]*>.*?<\/h1>/gs, "");

    // Check if content contains HTML
    if (
      contentWithoutH1.includes("<div") ||
      contentWithoutH1.includes("<p") ||
      contentWithoutH1.includes("<span")
    ) {
      return (
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: contentWithoutH1 }}
        />
      );
    }

    // Fallback to original text parsing
    return text.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("##")) {
        return (
          <h2
            key={`heading-${index}`}
            className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white"
          >
            {paragraph.replace("##", "").trim()}
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
            <p
              key={`paragraph-${index}`}
              className="mb-4 text-gray-700 dark:text-gray-300"
            >
              {paragraph}
            </p>
          </>
        );
      }
      if (paragraph.includes("if your product has 10,000 users")) {
        return (
          <>
            <p
              key={`paragraph-${index}`}
              className="mb-4 text-gray-700 dark:text-gray-300"
            >
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
        <p key={`paragraph-${index}`} className="mb-4 dark:text-gray-300">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <a
          href="#screen-1"
          onClick={handleBackClick}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8 relative z-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </a>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-card">
          {article.title}
        </h1>
        <div className="mb-6">
          <div className="flex items-center gap-4 text-nav text-gray-600 dark:text-gray-400 mb-3">
            <span>Dave Melkonian</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
          <ShareWidget url={window.location.href} />
        </div>
        {article.image && (
          <div className="flex justify-center mb-8">
            <div className="w-2/3 rounded-lg">
              <img
                src={getOptimizedImage(article.image, 1200)}
                alt={article.title}
                className="w-full rounded-lg h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        )}
        <div>{renderContent(article.content)}</div>

        {/* Back to Site Link */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Site
          </Link>
        </div>
      </div>
      <MobileTrayMenu />
    </div>
  );
}
