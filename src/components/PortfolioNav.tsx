import { Link } from "react-router-dom";
import { content } from "../content";
import MelkonianLogo from "./MelkonianLogo";

const navOrder = [
  "current-projects",
  // "stories",
  "work",
  "articles",
  // "career",
  "design-system",
];

const idToRoute: Record<string, string> = {
  "current-projects": "/portfolio/lab",
  stories: "/portfolio/stories",
  work: "/portfolio/design-system",
  articles: "/portfolio/articles",
  // career: "/portfolio/career",
  "design-system": "/portfolio/design-system",
};

const activeClass =
  "text-brand-dynamic dark:text-white px-3 py-2 rounded-md bg-accent-dynamic/10";
const inactiveClass =
  "hover:text-brand-dynamic transition-colors px-3 py-2 rounded-md";

const PortfolioNav = ({ currentPage }: { currentPage?: string }) => (
  <nav aria-label="Site navigation" className="pt-4 pb-0 relative">
    <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="pt-4 rounded-lg">
        {/* Top row: Logo + Nav */}
        <div className="mb-0 flex flex-col lg:flex-row lg:items-center lg:gap-6">
          {/* Logo + Name */}
          <div className="flex items-center gap-3 lg:flex-1 lg:min-w-0">
            <Link
              to="/portfolio"
              className="no-underline inline-flex items-center gap-3 flex-shrink-0"
            >
              <MelkonianLogo className="w-14 h-14 sm:w-20 sm:h-20 text-brand-dynamic dark:text-white" />
              <h1 className="tracking-tighter mb-0 title-font leading-none relative z-10 text-left text-brand-dynamic dark:text-white">
                {content.siteInfo.subtitle}
              </h1>
            </Link>
          </div>

          {/* Nav links */}
          <div
            className="hidden lg:flex flex-wrap items-center gap-2 sm:gap-3 mt-2 lg:mt-0 rounded-lg px-3 py-2 flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--brand) / 0.08), hsl(var(--secondary) / 0.12), hsl(var(--brand) / 0.05))",
            }}
          >
            <Link
              to="/portfolio"
              className={currentPage === "home" ? activeClass : inactiveClass}
              style={
                currentPage === "home"
                  ? { fontWeight: 700 }
                  : { color: "hsl(var(--foreground))" }
              }
            >
              Home
            </Link>
            <Link
              to="/portfolio/design-system"
              className={
                currentPage === "design-system" || currentPage === "work"
                  ? activeClass
                  : inactiveClass
              }
              style={
                currentPage === "design-system" || currentPage === "work"
                  ? { fontWeight: 700 }
                  : { color: "hsl(var(--foreground))" }
              }
            >
              Design System
            </Link>
            <Link
              to="/case-studies"
              className={
                currentPage === "case-studies" ? activeClass : inactiveClass
              }
              style={
                currentPage === "case-studies"
                  ? { fontWeight: 700 }
                  : { color: "hsl(var(--foreground))" }
              }
            >
              Case Studies
            </Link>
            {content.navigation.links
              .filter(
                (link) =>
                  link.id !== "career" &&
                  link.id !== "contact" &&
                  link.id !== "current-projects" &&
                  link.id !== "work" &&
                  link.id !== "design-system",
              )
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
                    style={
                      isActive
                        ? { fontWeight: 700 }
                        : { color: "hsl(var(--foreground))" }
                    }
                  >
                    {link.text}
                  </Link>
                );
              })}
            <Link
              to="/portfolio/graphics"
              className={
                currentPage === "graphics" ? activeClass : inactiveClass
              }
              style={
                currentPage === "graphics"
                  ? { fontWeight: 700 }
                  : { color: "hsl(var(--foreground))" }
              }
            >
              UX/UI
            </Link>
            <div className="ml-auto" />
            <Link
              to="/portfolio/lab"
              className={
                currentPage === "current-projects" ? activeClass : inactiveClass
              }
              style={
                currentPage === "current-projects"
                  ? { fontWeight: 700 }
                  : { color: "hsl(var(--foreground))" }
              }
            >
              Lab
            </Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export default PortfolioNav;
