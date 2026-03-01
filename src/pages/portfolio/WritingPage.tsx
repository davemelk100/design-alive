import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PortfolioLayout from "../../components/PortfolioLayout";
import SEO from "../../components/SEO";
import { CaseStudiesContent } from "../CaseStudies";
import { ArticlesContent } from "./ArticlesPage";

export default function WritingPage() {
  const location = useLocation();
  const articlesRef = useRef<HTMLDivElement>(null);
  const caseStudiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.pathname === "/portfolio/articles" && articlesRef.current) {
      articlesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <PortfolioLayout currentPage="writing">
      <SEO
        title="Case Studies & Articles"
        description="In-depth case studies and articles on design, development, and digital experience"
        url={location.pathname}
      />
      <div ref={caseStudiesRef} id="case-studies">
        <CaseStudiesContent />
      </div>
      <div ref={articlesRef} id="articles">
        <ArticlesContent />
      </div>
    </PortfolioLayout>
  );
}
