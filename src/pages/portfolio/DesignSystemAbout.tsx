import { Link } from "react-router-dom";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import { content } from "../../content";

export default function DesignSystemAbout() {
  return (
    <PortfolioLayout currentPage="design-system">
      <section className="pt-4 pb-8 sm:pb-12 lg:pb-16">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <SectionHeader title="How It Works" subtitle="" className="" />
          <div className="mt-6">
            {content.designSystem.specsContent.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-sm mb-4" style={{ color: "hsl(var(--foreground))" }}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8">
            <Link
              to="/portfolio/design-system"
              className="text-sm underline hover:opacity-80"
              style={{ color: "hsl(var(--brand))" }}
            >
              ← Back to Design System
            </Link>
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}
