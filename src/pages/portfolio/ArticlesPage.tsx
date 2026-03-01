import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import { content } from "../../content";
import { slugify } from "../../utils/slugify";
import {
  getCardImageProps,
} from "../../utils/imageOptimizer";
import SEO from "../../components/SEO";
const ArticleModal = lazy(() => import("../../components/ArticleModal"));

export function ArticlesContent() {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState<{
    title: string;
    content: string;
    image?: string;
    date?: string;
  } | null>(null);

  const articles = content.articles.items
    .filter(
      (article) =>
        article.title !== "Commit Message Fatigue" &&
        article.title !== "Information Architecture Is Not Sacred" &&
        article.title !== "AI is hydrated with user research data" &&
        article.title !== "Prompting for Heuristic Evaluations" &&
        article.title !== "Vibe Coding v Vibe Engineering",
    )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  const handleArticleClick = (article: (typeof articles)[0]) => {
    if (article.url.startsWith("http")) {
      window.open(article.url, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/article/${slugify(article.title)}`);
    }
  };

  return (
    <>
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
            <SectionHeader
              title="Articles"
              subtitle={content.articles.subtitle}
              className="mb-6"
              showArchiveLink={false}
              icon={
                <a
                  href="https://davemelk.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-dynamic/10 dark:bg-brand-dynamic/20 hover:bg-brand-dynamic/20 dark:hover:bg-brand-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                  aria-label="Substack"
                >
                  <svg
                    className="h-5 w-5 text-brand-dynamic"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                  </svg>
                </a>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {articles.map((article, index) => (
                  <div
                    key={index}
                    onClick={() => handleArticleClick(article)}
                    className="group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                  >
                    <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-transparent">
                      <img
                        {...getCardImageProps(
                          (article as any).cardImage || article.image,
                        )}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading={index === 0 ? "eager" : "lazy"}
                        {...(index === 0 ? { fetchPriority: "high" } : {})}
                        decoding="async"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1 card-hover-secondary">
                      <h3 className="font-semibold text-brand-dynamic group-hover:font-bold transition-all">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-foreground/80 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </section>

      {selectedArticle && (
        <Suspense fallback={null}>
          <ArticleModal
            title={selectedArticle.title}
            content={selectedArticle.content}
            image={selectedArticle.image}
            onClose={() => setSelectedArticle(null)}
          />
        </Suspense>
      )}
    </>
  );
}

export default function ArticlesPage() {
  return (
    <PortfolioLayout currentPage="articles">
      <SEO
        title="Articles"
        description="Articles on design, development, and digital experience"
        url="/portfolio/articles"
      />
      <ArticlesContent />
    </PortfolioLayout>
  );
}
