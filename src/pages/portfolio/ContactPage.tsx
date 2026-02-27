import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";

export default function ContactPage() {
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
    <PortfolioLayout currentPage="contact">
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Contact"
            subtitle="Get in touch for consulting services"
            className="mb-8 sm:mb-6"
          />
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
      </section>
    </PortfolioLayout>
  );
}
