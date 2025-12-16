import { useState, useMemo, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { content } from "../content";
import { slugify } from "../utils/slugify";
import MobileTrayMenu from "../components/MobileTrayMenu";

// Lazy load icons to avoid blocking critical path
const LazyArrowLeft = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ArrowLeft }))
);
const LazySearch = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Search }))
);
const LazyCalendar = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Calendar }))
);

export default function Archive() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const articlesSection = document.getElementById("articles");
      if (articlesSection) {
        articlesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Filter articles based on search term and visibility
  const filteredArticles = useMemo(() => {
    return content.articles.items
      .filter((article) => {
        const matchesSearch =
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8 relative z-50"
          >
            <Suspense fallback={<span className="h-4 w-4 mr-2">←</span>}>
              <LazyArrowLeft className="h-4 w-4 mr-2" />
            </Suspense>
            Back to Articles
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 title-font">
            Articles Archive
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
            Browse all {content.articles.items.length} articles by date or
            search for specific content.
          </p>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Suspense
                fallback={
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400">
                    🔍
                  </span>
                }
              >
                <LazySearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </Suspense>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Showing {filteredArticles.length} of {content.articles.items.length}{" "}
            articles
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8">
          {filteredArticles.map((article, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-2xl border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] p-6 transition-all duration-300 hover:bg-white/15 dark:hover:bg-white/15 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_40px_0_rgba(255,255,255,0.15)] border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Image */}
                <div className="mb-4 md:mb-0 aspect-video overflow-hidden rounded-lg">
                  <img
                    src={(article as any).cardImage || article.image}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-card">
                    {article.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Suspense fallback={<span className="h-4 w-4">📅</span>}>
                        <LazyCalendar className="h-4 w-4" />
                      </Suspense>
                      <span>{article.date}</span>
                    </div>
                    <span>•</span>
                    <span>Dave Melkonian</span>
                  </div>

                  <p className="text-gray-600 dark:text-white mb-4 line-clamp-3">
                    {article.description}
                  </p>

                  {article.url.startsWith("http") ? (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                    >
                      Read Article →
                    </a>
                  ) : (
                    <Link
                      to={`/article/${slugify(article.title)}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                    >
                      Read Article →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No articles found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      <MobileTrayMenu />
    </div>
  );
}
