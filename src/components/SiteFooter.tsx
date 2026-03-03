import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function SiteFooter() {
  return (
    <footer
      className="sticky bottom-0 z-40 mt-auto border-t"
      style={{
        borderColor: "hsl(var(--border))",
        backgroundColor: "hsl(var(--background))",
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex-shrink-0 leading-none">
          <img src="/theemel-logo.svg" alt="Theemel" className="h-8" width="28" height="32" />
        </Link>
        <nav className="hidden sm:flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Home
          </Link>
          <Link
            to="/how-it-works"
            className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
            style={{ color: "hsl(var(--foreground))" }}
          >
            How It Works
          </Link>
          <Link
            to="/readme"
            className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
            style={{ color: "hsl(var(--foreground))" }}
          >
            README
          </Link>
          <Link
            to="/pricing"
            className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Pricing
          </Link>
          <Link
            to="/features"
            className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Features
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </footer>
  );
}
