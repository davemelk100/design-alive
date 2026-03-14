import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export function ContactForm({ buttonClassName }: { buttonClassName?: string }) {
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
        className={`${buttonClassName || "text-xs font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"} ${buttonClassName ? "text-fg" : "text-muted-foreground"}`}
      >
        Contact
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={() => setOpen(false)}>
      <div
        className="rounded-xl p-6 w-[380px] shadow-xl surface-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-light mb-4 text-card-fg">Contact Us</h3>

        {submitted ? (
          <p className="text-sm font-light py-4 text-success">
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
              <label className="block text-xs font-light uppercase tracking-wider mb-1" style={{ color: "hsl(var(--card-foreground) / 0.6)" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 rounded-lg border text-sm font-light outline-none transition-colors border-theme text-card-fg"
                style={{ backgroundColor: "hsl(var(--card) / 0.7)" }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-light uppercase tracking-wider mb-1" style={{ color: "hsl(var(--card-foreground) / 0.6)" }}>
                Message
              </label>
              <textarea
                name="message"
                required
                rows={3}
                className="w-full px-3 py-2 rounded-lg border text-sm font-light outline-none transition-colors resize-none border-theme text-card-fg"
                style={{ backgroundColor: "hsl(var(--card) / 0.7)" }}
                placeholder="How can we help?"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-sm font-light rounded-lg transition-colors hover:opacity-80 text-card-fg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-sm font-light rounded-lg transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "hsl(var(--brand))",
                  color: "hsl(var(--brand-foreground, var(--background)))",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
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

export function ReportBugForm({ buttonClassName }: { buttonClassName?: string }) {
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
        className={`${buttonClassName || "text-xs font-light uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap"} ${buttonClassName ? "text-fg" : "text-muted-foreground"}`}
      >
        Report Bug
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={() => setOpen(false)}>
      <div
        className="rounded-xl p-6 w-[380px] shadow-xl surface-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-light mb-4 text-card-fg">Report a Bug</h3>

        {submitted ? (
          <p className="text-sm font-light py-4 text-success">
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
              <label className="block text-xs font-light uppercase tracking-wider mb-1" style={{ color: "hsl(var(--card-foreground) / 0.6)" }}>
                Email (optional)
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 rounded-lg border text-sm font-light outline-none transition-colors border-theme text-card-fg"
                style={{ backgroundColor: "hsl(var(--card) / 0.7)" }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-light uppercase tracking-wider mb-1" style={{ color: "hsl(var(--card-foreground) / 0.6)" }}>
                What happened?
              </label>
              <textarea
                name="description"
                required
                rows={3}
                className="w-full px-3 py-2 rounded-lg border text-sm font-light outline-none transition-colors resize-none border-theme text-card-fg"
                style={{ backgroundColor: "hsl(var(--card) / 0.7)" }}
                placeholder="Describe the bug..."
              />
            </div>
            <div>
              <label className="block text-xs font-light uppercase tracking-wider mb-1" style={{ color: "hsl(var(--card-foreground) / 0.6)" }}>
                Steps to reproduce (optional)
              </label>
              <textarea
                name="steps"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border text-sm font-light outline-none transition-colors resize-none border-theme text-card-fg"
                style={{ backgroundColor: "hsl(var(--card) / 0.7)" }}
                placeholder="1. Go to... 2. Click on..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-sm font-light rounded-lg transition-colors hover:opacity-80 text-card-fg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-sm font-light rounded-lg transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "hsl(var(--brand))",
                  color: "hsl(var(--brand-foreground, var(--background)))",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)",
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


export function SiteFooterBranding() {
  return (
    <div className="flex justify-center py-1.5">
      <img src="/circled-themal.svg" alt="Themal" className="h-8" />
    </div>
  );
}

export default function SiteFooter() {
  const { pathname } = useLocation();
  if (pathname === "/editor") return null;

  return (
    <footer className="hidden md:block sticky bottom-0 z-40 mt-auto bg-page">
      <div className="flex justify-center py-1.5">
        <Link to="/" className="hover:opacity-70 transition-opacity">
          <img src="/circled-themal.svg" alt="Themal" className="h-8" />
        </Link>
      </div>
    </footer>
  );
}
