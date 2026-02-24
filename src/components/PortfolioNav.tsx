import { Link } from "react-router-dom";
import { content } from "../content";
import MelkonianLogo from "./MelkonianLogo";

const navOrder = [
  "current-projects",
  // "stories",
  "work",
  "articles",
  // "career",
  "testimonials",
  "contact",
  "design-system",
];

const idToRoute: Record<string, string> = {
  "current-projects": "/portfolio/lab",
  stories: "/portfolio/stories",
  work: "/portfolio/design-system",
  articles: "/portfolio/articles",
  // career: "/portfolio/career",
  testimonials: "/portfolio/testimonials",
  contact: "/portfolio/contact",
  "design-system": "/portfolio/design-system",
};

const activeClass = "text-brand-dynamic dark:text-white px-3 py-2 rounded-md";
const inactiveClass = "text-gray-600 dark:text-gray-300 hover:text-brand-dynamic dark:hover:text-white transition-colors px-3 py-2 rounded-md";

const PortfolioNav = ({ currentPage, hideBorder }: { currentPage?: string; hideBorder?: boolean }) => (
  <section className={`py-4 sm:py-4 xl:py-4 relative${hideBorder ? "" : " border-b border-border"}`}>
    <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <div className="pt-4 rounded-lg">
          <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="flex-1">
              <Link to="/portfolio" className="no-underline flex items-center gap-3">
                <MelkonianLogo
                  className="w-14 h-14 sm:w-20 sm:h-20 text-brand-dynamic dark:text-white"
                />
                <h1 className="tracking-tighter mb-0 title-font leading-none relative z-10 text-left text-brand-dynamic dark:text-white">
                  {content.siteInfo.subtitle}
                </h1>
              </Link>
            </div>

            <div className="hidden lg:flex flex-wrap items-center gap-2 sm:gap-3 mt-2 lg:mt-0 rounded-lg px-3 py-2" style={{ background: "linear-gradient(135deg, hsl(var(--brand) / 0.08), hsl(var(--secondary) / 0.12), hsl(var(--brand) / 0.05))" }}>
              <Link
                to="/portfolio"
                className={currentPage === "home" ? activeClass : inactiveClass}
                style={currentPage === "home" ? { fontWeight: 700 } : undefined}
              >
                Home
              </Link>
              <Link
                to="/portfolio/design-system"
                className={currentPage === "design-system" || currentPage === "work" ? activeClass : inactiveClass}
                style={currentPage === "design-system" || currentPage === "work" ? { fontWeight: 700 } : undefined}
              >
                Design System
              </Link>
              <Link
                to="/case-studies"
                className={currentPage === "case-studies" ? activeClass : inactiveClass}
                style={currentPage === "case-studies" ? { fontWeight: 700 } : undefined}
              >
                Case Studies
              </Link>
              {content.navigation.links
                .filter((link) => link.id !== "career" && link.id !== "contact" && link.id !== "current-projects" && link.id !== "work" && link.id !== "design-system")
                .sort((a, b) => {
                  const indexA = navOrder.indexOf(a.id);
                  const indexB = navOrder.indexOf(b.id);
                  return (
                    (indexA === -1 ? 999 : indexA) -
                    (indexB === -1 ? 999 : indexB)
                  );
                })
                .map((link) => {
                  const route = idToRoute[link.id] || "/portfolio";
                  const isActive = currentPage === link.id;
                  return (
                    <Link
                      key={link.id}
                      to={route}
                      className={isActive ? activeClass : inactiveClass}
                      style={isActive ? { fontWeight: 700 } : undefined}
                    >
                      {link.text}
                    </Link>
                  );
                })}
              <div className="ml-auto" />
              <Link
                to="/portfolio/lab"
                className={currentPage === "current-projects" ? activeClass : inactiveClass}
                style={currentPage === "current-projects" ? { fontWeight: 700 } : undefined}
              >
                Lab
              </Link>
              <Link
                to="/portfolio/contact"
                className={currentPage === "contact" ? activeClass : inactiveClass}
                style={currentPage === "contact" ? { fontWeight: 700 } : undefined}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PortfolioNav;
