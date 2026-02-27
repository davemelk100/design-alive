import { lazy, Suspense, useState, useRef } from "react";
import { LinkedInLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import emailjs from "@emailjs/browser";
import { content } from "../content";

// Lazy load icon to avoid blocking critical path
const LazyDribbble = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Dribbble }))
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const contactFormRef = useRef<HTMLFormElement>(null);
  const [contactStatus, setContactStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [contactError, setContactError] = useState("");

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactStatus("sending");
    setContactError("");

    emailjs
      .sendForm(
        "service_fm58itq",
        "template_t8jxrzr",
        contactFormRef.current!,
        "6XBDY7TVW_51JPyZQ",
      )
      .then(() => {
        setContactStatus("success");
        contactFormRef.current?.reset();
      })
      .catch((err) => {
        setContactStatus("error");
        setContactError(err.text || "Something went wrong. Please try again.");
      });
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-border mt-auto">
      {/* Contact Form */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get in touch for consulting services</p>
        <form
          ref={contactFormRef}
          onSubmit={handleContactSubmit}
          className="max-w-xl space-y-4"
        >
          <div>
            <label
              htmlFor="contact-name"
              className="block text-gray-700 dark:text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="user_name"
              required
              className="w-full px-4 py-2 rounded-md border border-border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-dynamic"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="user_email"
              required
              className="w-full px-4 py-2 rounded-md border border-border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-dynamic"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="block text-gray-700 dark:text-gray-300 mb-1"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-2 rounded-md border border-border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-dynamic resize-vertical"
            />
          </div>
          <button
            type="submit"
            disabled={contactStatus === "sending"}
            className="px-6 py-3 rounded-md font-medium hover:brightness-[0.85] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "hsl(var(--accent))", color: "hsl(var(--accent-foreground))" }}
          >
            {contactStatus === "sending"
              ? "Sending..."
              : "Send Message"}
          </button>
          {contactStatus === "success" && (
            <p className="text-green-600 dark:text-green-400">
              Message sent successfully!
            </p>
          )}
          {contactStatus === "error" && (
            <p className="text-red-600 dark:text-red-400">
              {contactError}
            </p>
          )}
        </form>
      </div>

      {/* Footer info */}
      <div className="border-t border-secondary-dynamic/30">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          {/* Left side - Email and Copyright */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <a
              href="mailto:davemelk@gmail.com"
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              davemelk@gmail.com
            </a>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Dave Melkonian. All rights reserved.
            </p>
          </div>

          {/* Right side - Social Links + Dark Mode */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const html = document.documentElement;
                if (html.classList.contains("dark")) {
                  html.classList.remove("dark");
                  localStorage.setItem("theme", "light");
                } else {
                  html.classList.add("dark");
                  localStorage.setItem("theme", "dark");
                }
              }}
              className="bg-secondary-dynamic/10 dark:bg-secondary-dynamic/20 hover:bg-secondary-dynamic/20 dark:hover:bg-secondary-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              <svg
                className="w-5 h-5 text-brand-dynamic dark:text-brand-dynamic dark:hidden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <svg
                className="w-5 h-5 text-brand-dynamic dark:text-brand-dynamic hidden dark:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
            <a
              href={content.navigation.social.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary-dynamic/10 dark:bg-secondary-dynamic/20 hover:bg-secondary-dynamic/20 dark:hover:bg-secondary-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <LinkedInLogoIcon className="h-5 w-5 text-brand-dynamic dark:text-brand-dynamic" />
            </a>
            <a
              href="https://github.com/davemelk100"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary-dynamic/10 dark:bg-secondary-dynamic/20 hover:bg-secondary-dynamic/20 dark:hover:bg-secondary-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="GitHub"
            >
              <GitHubLogoIcon className="h-5 w-5 text-brand-dynamic dark:text-brand-dynamic" />
            </a>
            <a
              href={content.navigation.social.dribbble.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary-dynamic/10 dark:bg-secondary-dynamic/20 hover:bg-secondary-dynamic/20 dark:hover:bg-secondary-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="Dribbble"
            >
              <Suspense fallback={<span className="h-5 w-5">D</span>}>
                <LazyDribbble className="h-5 w-5 text-brand-dynamic dark:text-brand-dynamic" />
              </Suspense>
            </a>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};
