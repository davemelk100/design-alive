import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { content } from "../content";
import { LazyIcon } from "../utils/lazyIcons";
import ThemeToggle from "./ThemeToggle";

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
    <footer className="border-t border-border mt-auto" style={{ backgroundColor: "hsl(var(--background))" }}>
      {/* Contact Form */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h3 className="text-lg font-semibold text-foreground mb-4">Contact</h3>
        <p className="text-sm text-muted-foreground mb-4">Get in touch for consulting services</p>
        <form
          ref={contactFormRef}
          onSubmit={handleContactSubmit}
          className="max-w-xl space-y-4"
        >
          <div>
            <label
              htmlFor="contact-name"
              className="block text-foreground/80 mb-1"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="user_name"
              required
              className="w-full px-4 py-2 rounded-md border border-border text-[color:hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-accent-dynamic"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-foreground/80 mb-1"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="user_email"
              required
              className="w-full px-4 py-2 rounded-md border border-border text-[color:hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-accent-dynamic"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="block text-foreground/80 mb-1"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-2 rounded-md border border-border text-[color:hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-accent-dynamic resize-vertical"
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
              className="text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors"
            >
              davemelk@gmail.com
            </a>
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {currentYear} Dave Melkonian. All rights reserved.
            </p>
          </div>

          {/* Right side - Social Links + Dark Mode */}
          <div className="flex items-center gap-4">
            <div className="bg-brand-dynamic/10 dark:bg-brand-dynamic/20 hover:bg-brand-dynamic/20 dark:hover:bg-brand-dynamic/30 rounded-full shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center">
              <ThemeToggle className="text-brand-dynamic" />
            </div>
            <a
              href={content.navigation.social.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-dynamic/10 dark:bg-brand-dynamic/20 hover:bg-brand-dynamic/20 dark:hover:bg-brand-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dynamic"><path d="M2 1C1.44772 1 1 1.44772 1 2V13C1 13.5523 1.44772 14 2 14H13C13.5523 14 14 13.5523 14 13V2C14 1.44772 13.5523 1 13 1H2ZM3.05 6H4.95V12H3.05V6ZM5.075 4.005C5.075 4.59871 4.59371 5.08 4 5.08C3.4063 5.08 2.925 4.59871 2.925 4.005C2.925 3.41129 3.4063 2.93 4 2.93C4.59371 2.93 5.075 3.41129 5.075 4.005ZM12 8.35713C12 6.55208 10.8334 5.85033 9.67449 5.85033C9.29502 5.83163 8.91721 5.91119 8.57874 6.08107C8.32172 6.21007 8.05265 6.50523 7.84516 7.01853H7.79179V6.00044H6V12.0047H7.90616V8.8112C7.8786 8.48413 7.98327 8.06142 8.19741 7.80987C8.41156 7.55832 8.71789 7.49825 8.95015 7.46774H9.02258C9.62874 7.46774 10.0786 7.84301 10.0786 8.78868V12.0047H11.9847L12 8.35713Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/></svg>
            </a>
            <a
              href="https://github.com/davemelk100"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-dynamic/10 dark:bg-brand-dynamic/20 hover:bg-brand-dynamic/20 dark:hover:bg-brand-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="GitHub"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dynamic"><path d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/></svg>
            </a>
            <a
              href={content.navigation.social.dribbble.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-dynamic/10 dark:bg-brand-dynamic/20 hover:bg-brand-dynamic/20 dark:hover:bg-brand-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="Dribbble"
            >
              <LazyIcon name="Dribbble" className="h-5 w-5 text-brand-dynamic" fallback="D" />
            </a>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};
