import { Link } from "react-router-dom";
import { content } from "../content";

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
  work: "/portfolio/design",
  articles: "/portfolio/articles",
  // career: "/portfolio/career",
  testimonials: "/portfolio/testimonials",
  contact: "/portfolio/contact",
  "design-system": "/portfolio/design-system",
};

const PortfolioNav = ({ currentPage }: { currentPage?: string }) => (
  <section className="py-4 sm:py-4xl:py-4 relative">
    <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <div className="pt-4 rounded-lg">
          <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            <div className="flex-1">
              <Link to="/portfolio" className="no-underline flex items-center gap-3">
                <img
                  src="/img/melkonian-industries-logo.svg"
                  alt="Melkonian Industries"
                  className="w-14 h-14 sm:w-20 sm:h-20 brightness-0 dark:invert"
                />
                <h1 className="tracking-tighter mb-0 title-font leading-none relative z-10 text-left">
                  {content.siteInfo.subtitle}
                </h1>
              </Link>
            </div>

            <div className="hidden lg:flex flex-wrap justify-end gap-2 sm:gap-3 mt-2 lg:mt-0">
              {content.navigation.links
                .filter((link) => link.id !== "career")
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
                      className={
                        isActive
                          ? "text-gray-900 dark:text-white px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    >
                      {link.text}
                    </Link>
                  );
                })}
              <Link
                to="/case-studies"
                className={
                  currentPage === "case-studies"
                    ? "text-gray-900 dark:text-white px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              >
                Case Studies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PortfolioNav;
