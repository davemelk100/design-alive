import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/editor", label: "Editor" },
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/readme", label: "Docs" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

export default function SiteNav() {
  const { pathname } = useLocation();

  return (
    <aside
      className="hidden lg:flex flex-col gap-1.5 flex-shrink-0 w-48 pt-4 pb-6 pl-4 pr-2 sticky top-0 self-start overflow-y-auto max-h-screen site-nav"
    >
      {NAV_LINKS.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={`w-full h-9 px-2 text-xs font-normal rounded-lg transition-colors hover:opacity-80 flex items-center gap-2 no-underline ${
            pathname === to ? "site-nav-active" : "site-nav-link"
          }`}
        >
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </aside>
  );
}
