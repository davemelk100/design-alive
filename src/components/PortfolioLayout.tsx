import { useState, useEffect } from "react";
// import LogoBanner from "./LogoBanner";
import PortfolioNav from "./PortfolioNav";

const PortfolioLayout = ({
  currentPage,
  children,
}: {
  currentPage?: string;
  children: React.ReactNode;
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="portfolio-page">
      {/* <LogoBanner /> */}
      <PortfolioNav currentPage={currentPage} />
      <main>{children}</main>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 w-10 h-10 bg-brand-dynamic/10 dark:bg-brand-dynamic/20 hover:bg-brand-dynamic/20 dark:hover:bg-brand-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg className="h-5 w-5 text-brand-dynamic" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PortfolioLayout;
