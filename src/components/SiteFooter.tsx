import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function ContactForm() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    data.append("form-name", "contact");

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setOpen(false);
        form.reset();
      }, 3000);
    } catch {
      // fallback: let the native form submit handle it
      form.submit();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        Contact
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setOpen(false)}>
      <div
        className="rounded-xl p-6 w-[380px] shadow-xl"
        style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[18px] font-light mb-4">Contact Us</h3>

        {submitted ? (
          <p className="text-[14px] font-light py-4" style={{ color: "hsl(var(--success))" }}>
            Thanks! We'll be in touch.
          </p>
        ) : (
          <form
            ref={formRef}
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Don't fill this out: <input name="bot-field" />
              </label>
            </p>
            <div>
              <label className="block text-[13px] font-light uppercase tracking-wider mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 rounded-lg border text-[14px] font-light outline-none transition-colors"
                style={{
                  borderColor: "hsl(var(--border))",
                  backgroundColor: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[13px] font-light uppercase tracking-wider mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                Message
              </label>
              <textarea
                name="message"
                required
                rows={3}
                className="w-full px-3 py-2 rounded-lg border text-[14px] font-light outline-none transition-colors resize-none"
                style={{
                  borderColor: "hsl(var(--border))",
                  backgroundColor: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
                placeholder="How can we help?"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                style={{ color: "hsl(var(--card-foreground))" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "#e5e7eb",
                  color: "#111",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
              >
                Send
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ReportBugForm() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    data.append("form-name", "bug-report");

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setOpen(false);
        form.reset();
      }, 3000);
    } catch {
      form.submit();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        Report Bug
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setOpen(false)}>
      <div
        className="rounded-xl p-6 w-[380px] shadow-xl"
        style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[18px] font-light mb-4">Report a Bug</h3>

        {submitted ? (
          <p className="text-[14px] font-light py-4" style={{ color: "hsl(var(--success))" }}>
            Thanks! We'll look into it.
          </p>
        ) : (
          <form
            ref={formRef}
            name="bug-report"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <input type="hidden" name="form-name" value="bug-report" />
            <p className="hidden">
              <label>
                Don't fill this out: <input name="bot-field" />
              </label>
            </p>
            <div>
              <label className="block text-[13px] font-light uppercase tracking-wider mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                Email (optional)
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 rounded-lg border text-[14px] font-light outline-none transition-colors"
                style={{
                  borderColor: "hsl(var(--border))",
                  backgroundColor: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[13px] font-light uppercase tracking-wider mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                What happened?
              </label>
              <textarea
                name="description"
                required
                rows={3}
                className="w-full px-3 py-2 rounded-lg border text-[14px] font-light outline-none transition-colors resize-none"
                style={{
                  borderColor: "hsl(var(--border))",
                  backgroundColor: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
                placeholder="Describe the bug..."
              />
            </div>
            <div>
              <label className="block text-[13px] font-light uppercase tracking-wider mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                Steps to reproduce (optional)
              </label>
              <textarea
                name="steps"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border text-[14px] font-light outline-none transition-colors resize-none"
                style={{
                  borderColor: "hsl(var(--border))",
                  backgroundColor: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                }}
                placeholder="1. Go to... 2. Click on..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                style={{ color: "hsl(var(--card-foreground))" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "#e5e7eb",
                  color: "#111",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function LegalDropUp() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close, true);
    return () => document.removeEventListener("click", close, true);
  }, [open]);

  return (
    <div className="relative xl:hidden" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap flex items-center gap-1"
        style={{ color: "hsl(var(--muted-foreground))" }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Legal & Contact
        <svg
          className="w-3.5 h-3.5 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute bottom-full mb-2 right-0 rounded-lg shadow-lg py-2 min-w-[160px]"
          style={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          {[
            { to: "/privacy", label: "Privacy" },
            { to: "/cookies", label: "Cookies" },
            { to: "/terms", label: "Terms" },
            { to: "/accessibility", label: "Accessibility" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {item.label}
            </Link>
          ))}
          <div className="px-4 py-2">
            <ContactForm />
          </div>
          <div className="px-4 py-2">
            <ReportBugForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer
      className="hidden md:block sticky bottom-0 z-40 mt-auto border-t"
      style={{
        borderColor: "hsl(var(--border))",
        backgroundColor: "hsl(var(--background))",
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex-shrink-0 leading-none">
          <img src="/themal-just-t.svg" alt="Themal" className="h-8" width="28" height="32" />
        </Link>
        <nav className="hidden sm:flex items-center gap-4 sm:gap-6">
          <div className="hidden xl:contents">
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
          </div>
          <span className="w-px h-4" style={{ backgroundColor: "hsl(var(--border))" }} />
          {/* Desktop: show all links inline */}
          <div className="hidden xl:contents">
            <Link
              to="/privacy"
              className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Privacy
            </Link>
            <Link
              to="/cookies"
              className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Cookies
            </Link>
            <Link
              to="/terms"
              className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Terms
            </Link>
            <Link
              to="/accessibility"
              className="text-[13px] font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Accessibility
            </Link>
            <ContactForm />
            <ReportBugForm />
          </div>
          {/* Tablet: drop-up menu for legal + contact */}
          <LegalDropUp />
          <span className="w-px h-4" style={{ backgroundColor: "hsl(var(--border))" }} />
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
