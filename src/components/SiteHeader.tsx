import { Link, useLocation } from "react-router-dom";
import ThemalLogo from "./ThemalLogo";

const NAV_LINKS = [
  { to: "/editor", label: "Editor" },
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/readme", label: "Docs" },
];

export default function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header
      className="border-b"
      style={{
        borderColor: "hsl(var(--border))",
        backgroundColor: "hsl(var(--background))",
      }}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-end gap-6" style={{ maxWidth: "1500px" }}>
        <Link
          to="/"
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Themal home"
        >
          <ThemalLogo className="h-6 sm:h-7" />
        </Link>
        <nav className="ml-auto flex items-end gap-1 sm:gap-2 overflow-x-auto">
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className="px-2 sm:px-3 py-1.5 text-[13px] font-light uppercase tracking-wider rounded-md transition-colors hover:opacity-70 whitespace-nowrap"
                style={{
                  color: active
                    ? "hsl(var(--foreground))"
                    : "hsl(var(--muted-foreground))",
                  backgroundColor: active
                    ? "hsl(var(--muted))"
                    : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
