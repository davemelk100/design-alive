import { Link } from "react-router-dom";
import { content } from "../content";
import MelkonianLogo from "./MelkonianLogo";

const activeClass =
  "px-3 py-2 rounded-md bg-accent-dynamic/10";
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
              <MelkonianLogo className="w-14 h-14 sm:w-20 sm:h-20 text-brand-dynamic" />
              <h1 className="tracking-tighter mb-0 title-font leading-none relative z-10 text-left text-brand-dynamic">
                {content.siteInfo.subtitle}
              </h1>
            </Link>
          </div>

          {/* Nav links */}
          <div
            className="hidden md:flex flex-wrap items-center gap-2 sm:gap-3 mt-2 lg:mt-0 rounded-lg px-3 py-2 flex-shrink-0"
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
                  ? { fontWeight: 700, color: "hsl(var(--foreground))" }
                  : { color: "hsl(var(--foreground))" }
              }
              {...(currentPage === "home" ? { "aria-current": "page" as const } : {})}
            >
              Home
            </Link>
            <Link
              to="/case-studies"
              className={
                currentPage === "writing" ? activeClass : inactiveClass
              }
              style={
                currentPage === "writing"
                  ? { fontWeight: 700, color: "hsl(var(--foreground))" }
                  : { color: "hsl(var(--foreground))" }
              }
              {...(currentPage === "writing" ? { "aria-current": "page" as const } : {})}
            >
              Case Studies & Articles
            </Link>
            <Link
              to="/portfolio/lab"
              className={
                currentPage === "design-dev" ? activeClass : inactiveClass
              }
              style={
                currentPage === "design-dev"
                  ? { fontWeight: 700, color: "hsl(var(--foreground))" }
                  : { color: "hsl(var(--foreground))" }
              }
              {...(currentPage === "design-dev" ? { "aria-current": "page" as const } : {})}
            >
              Design & Dev
            </Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export default PortfolioNav;
