import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const bannerStyle = document.createElement("style");
bannerStyle.textContent = `
@keyframes scroll-banner {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-scroll-banner {
  animation: scroll-banner 30s linear infinite;
}
.animate-scroll-banner-slow {
  animation: scroll-banner 45s linear infinite;
}
.animate-scroll-banner.paused,
.animate-scroll-banner-slow.paused {
  animation-play-state: paused;
}
`;
document.head.appendChild(bannerStyle);

// Carousel swipeable hook (commented out for now)
// @ts-ignore
function useSwipeable(ref: React.RefObject<HTMLDivElement | null>) {
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollOffset = useRef(0);
  const currentOffset = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelector(".animate-scroll-banner") as HTMLElement;
    if (!inner) return;

    const getComputedTranslateX = () => {
      const style = window.getComputedStyle(inner);
      const matrix = new DOMMatrix(style.transform);
      return matrix.m41;
    };

    const onStart = (clientX: number) => {
      setIsDragging(true);
      inner.classList.add("paused");
      startX.current = clientX;
      scrollOffset.current = getComputedTranslateX();
      inner.style.transform = `translateX(${scrollOffset.current}px)`;
    };

    const onMove = (clientX: number) => {
      if (!isDragging) return;
      const delta = clientX - startX.current;
      currentOffset.current = scrollOffset.current + delta;
      inner.style.transform = `translateX(${currentOffset.current}px)`;
    };

    const onEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      inner.classList.remove("paused");
      inner.style.transform = "";
    };

    const onTouchStart = (e: TouchEvent) => onStart(e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      onMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => onEnd();
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      onStart(e.clientX);
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onMouseUp = () => onEnd();
    const onMouseLeave = () => onEnd();

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [ref, isDragging]);

  return isDragging;
}

const SectionHeader = ({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="font-bold title-font leading-tight text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
      </div>
      {subtitle && (
        <p className="sm:text-base text-muted-foreground mb-6 sm:mb-8 lg:mb-10">
          {subtitle}
        </p>
      )}
    </div>
  );
};

const ServiceSection = ({
  title,
  intro,
  bulletLabel,
  bullets,
  closing,
}: {
  title: string;
  intro: string;
  bulletLabel: string;
  bullets: string[];
  closing: string;
}) => (
  <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={title} className="mb-8 sm:mb-6" />
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {intro}
      </p>
      <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
        {bulletLabel}
      </p>
      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {bullets.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {closing}
      </p>
    </div>
  </section>
);

export default function Consult() {
  const bannerRef = useRef<HTMLDivElement>(null);
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
    <div className="portfolio-page">
      <div className="flex max-w-[1200px] mx-auto gap-0">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Hero Section */}
          <section className="py-4 sm:py-4 xl:py-4 relative">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                <div className="pt-4 rounded-lg">
                  <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                    <img
                      src="/img/melkonian-industries-logo.svg"
                      alt="Melkonian Industries"
                      className="w-16 sm:w-20 lg:w-28 h-16 sm:h-20 lg:h-28"
                    />
                    <h1 className="tracking-tighter title-font leading-none text-left text-gray-900 dark:text-white uppercase font-black">
                      Melkonian Industries
                    </h1>
                  </div>
                  {/* Auto-scrolling client logo banner - mobile only */}
                  <div
                    ref={bannerRef}
                    className="md:hidden mb-8 overflow-hidden relative bg-[#d5e0ea] dark:bg-gray-700 rounded-lg py-6 px-4 select-none space-y-4"
                  >
                    <div className="flex animate-scroll-banner items-center gap-8 w-max">
                      {[...Array(2)].map((_, setIndex) => (
                        <div
                          key={setIndex}
                          className="flex items-center gap-8 shrink-0"
                        >
                          <img
                            src="/img/carousel/optum-carousel.svg"
                            alt="Optum"
                            className="h-6 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/healthcare-dot-gov-carousel.svg"
                            alt="Healthcare.gov"
                            className="h-6 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/customgpt-carousel.png"
                            alt="CustomGPT.ai"
                            className="h-6 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/dcal-carousel.svg"
                            alt="DCAL"
                            className="h-10 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/logo-ddpa-green.png"
                            alt="Delta Dental"
                            className="h-4 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/bsbsm-carousel.png"
                            alt="BCBSM"
                            className="h-14 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/meridian-carousel.png"
                            alt="Meridian"
                            className="h-10 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/data-foundation-carousel.png"
                            alt="Data Foundation"
                            className="h-14 w-auto object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex animate-scroll-banner-slow items-center gap-8 w-max">
                      {[...Array(2)].map((_, setIndex) => (
                        <div
                          key={setIndex}
                          className="flex items-center gap-8 shrink-0"
                        >
                          <img
                            src="/img/carousel/nextier-carousel.png"
                            alt="Nextier"
                            className="h-10 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/logo-propio.svg"
                            alt="Propio"
                            className="h-6 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/dewpoint-carousel.svg"
                            alt="Dewpoint"
                            className="h-10 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/neogen-carousel.png"
                            alt="Neogen Corporation"
                            className="h-10 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/fictionforge-carousel.png"
                            alt="FictionForge"
                            className="h-20 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/cygnet-carousel.svg"
                            alt="Cygnet"
                            className="h-20 w-auto object-contain"
                          />
                          <img
                            src="/img/carousel/dark-slide-carousel.png"
                            alt="Dark Slide"
                            className="h-12 w-auto object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Technical Execution, Strategy, and Digital Growth
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    I help organizations improve performance, solve technical
                    challenges, and grow effectively by combining hands-on
                    engineering with business strategy. My work spans front-end
                    development, architecture, analytics, SEO, and paid
                    acquisition - focused on the decisions that determine
                    whether digital investments actually pay off.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Unlike traditional agencies that operate in silos, I work
                    across strategy, design, and development to ensure
                    everything connects - from system architecture to user
                    experience to measurable outcomes.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    I also consult on AI tooling and approaches - backed by
                    nearly 100 GitHub repos and countless working samples
                    spanning prompt engineering, AI-assisted development, and
                    practical integration patterns.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <ServiceSection
            title="Technical Consulting & Architecture"
            intro="Many digital initiatives fail because the technical foundation is poorly planned. I help teams make informed decisions before problems become expensive."
            bulletLabel="Technical consulting includes:"
            bullets={[
              "Website and application architecture reviews",
              "Front-end performance optimization",
              "CMS and content architecture planning",
              "Platform migrations and redesign support",
              "API, integration, and system-level advisory",
              "Technical discovery and roadmap development",
            ]}
            closing="This work is especially valuable for organizations with legacy systems or complex workflows."
          />

          <ServiceSection
            title="Front-End Development & Implementation Support"
            intro="I provide hands-on support where strategy meets execution."
            bulletLabel="Services include:"
            bullets={[
              "Front-end development and refactoring",
              "Accessibility-aware implementation (WCAG / ADA considerations)",
              "Design system and component guidance",
              "Semantic markup and structured content",
              "Performance, maintainability, and scalability improvements",
            ]}
            closing="You get solutions that work in production, not just in mockups."
          />

          <ServiceSection
            title="Analytics, Measurement, and Data Strategy"
            intro="Without reliable data, optimization becomes guesswork. I help teams establish clear measurement frameworks."
            bulletLabel="Analytics services include:"
            bullets={[
              "Google Analytics and tagging strategy",
              "Conversion and event tracking",
              "Performance dashboards and reporting",
              "Baseline reporting and trend analysis",
              "Insight translation for non-technical stakeholders",
            ]}
            closing="The focus is on actionable insight, not overwhelming reports."
          />

          <ServiceSection
            title="Digital Strategy & UX Support"
            intro="Traffic doesn't matter if users can't complete tasks. I help align digital efforts with how people actually use products and services."
            bulletLabel="Strategy support includes:"
            bullets={[
              "UX and content structure audits",
              "Landing page optimization for conversion",
              "Funnel and journey analysis",
              "Design-to-development alignment",
              "Advisory support for redesigns and site migrations",
            ]}
            closing="This ensures your digital presence works as a system, not a collection of disconnected parts."
          />

          <ServiceSection
            title="SEO Strategy & Enhancements"
            intro="I design and implement SEO improvements grounded in real technical constraints and user behavior, not checklists."
            bulletLabel="SEO services include:"
            bullets={[
              "Technical SEO audits (site structure, performance, indexing, accessibility)",
              "On-page SEO optimization (content structure, headings, internal linking)",
              "Keyword research focused on intent and conversion value",
              "Content optimization for existing pages",
              "Local SEO and Google Business Profile optimization",
              "SEO baselines and measurement frameworks to track progress over time",
            ]}
            closing="The goal is sustainable organic growth, not fragile tactics that collapse after algorithm updates."
          />

          <ServiceSection
            title="Google Ads Strategy & Management"
            intro="I help organizations use Google Ads intentionally and efficiently, ensuring paid traffic supports business goals instead of draining budget."
            bulletLabel="Google Ads services include:"
            bullets={[
              "Account setup and campaign architecture",
              "Keyword research and intent-based targeting",
              "Ad copywriting and landing page alignment",
              "Conversion tracking and analytics setup",
              "Ongoing optimization and budget efficiency improvements",
              "Support for nonprofits and grant-based ad programs",
            ]}
            closing="Paid acquisition only works when it's tightly integrated with landing pages, analytics, and technical performance - that's where I focus."
          />

          {/* Who I Work With */}
          <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="Who I Work With" className="mb-8 sm:mb-6" />
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                I work with:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <li>Small and mid-sized businesses</li>
                <li>Nonprofits and mission-driven organizations</li>
                <li>SaaS and B2B companies</li>
                <li>Organizations with legacy platforms or technical debt</li>
                <li>
                  Teams that need senior-level guidance without hiring full-time
                </li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you need someone who understands business goals, technical
                tradeoffs, and user behavior, you're in the right place.
              </p>
            </div>
          </section>

          {/* How I Work */}
          <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader title="How I Work" className="mb-8 sm:mb-6" />
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <li>Clear scopes and honest recommendations</li>
                <li>No black-box tactics or inflated metrics</li>
                <li>
                  Practical guidance grounded in implementation experience
                </li>
                <li>Collaboration with internal teams and vendors</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                My role is to reduce risk, improve outcomes, and make complex
                systems easier to manage.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section
            id="contact"
            className="py-4 sm:py-6 lg:py-8 xl:py-12 relative"
          >
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                title="Let's Improve Your Digital Performance"
                className="mb-8 sm:mb-6"
              />
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                If you're looking to modernize technical foundations, improve
                digital performance, or bring clarity to complex initiatives,
                let's talk.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Contact me to discuss your goals and determine next steps.
              </p>
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
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1d77af]"
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
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1d77af]"
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
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1d77af] resize-vertical"
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactStatus === "sending"}
                  className="px-6 py-3 rounded-md bg-[#1d77af] text-white font-medium hover:bg-[#155d8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactStatus === "sending" ? "Sending..." : "Send Message"}
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

          {/* SEO Footer */}
          <section className="py-4 sm:py-6 relative">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Technical and business consulting services specializing in
                front-end development, application architecture, analytics
                strategy, SEO, Google Ads, and performance-driven digital
                solutions.
              </p>
            </div>
          </section>
        </div>

        {/* Client logos column - right side */}
        <div className="hidden md:flex flex-col items-center gap-16 py-6 px-4 w-48 shrink-0 bg-[#d5e0ea] dark:bg-gray-700 rounded-lg mt-40 mr-4 self-start">
          <img
            src="/img/carousel/optum-carousel.svg"
            alt="Optum"
            className="w-36 object-contain"
          />
          <img
            src="/img/carousel/healthcare-dot-gov-carousel.svg"
            alt="Healthcare.gov"
            className="w-44 object-contain"
          />
          <img
            src="/img/carousel/customgpt-carousel.png"
            alt="CustomGPT.ai"
            className="w-44 object-contain"
          />
          <img
            src="/img/carousel/dcal-carousel.svg"
            alt="DCAL"
            className="w-32 object-contain"
          />
          <img
            src="/img/carousel/logo-ddpa-green.png"
            alt="Delta Dental"
            className="w-44 object-contain"
          />
          <img
            src="/img/carousel/bsbsm-carousel.png"
            alt="BCBSM"
            className="w-36 object-contain"
          />
          <img
            src="/img/carousel/meridian-carousel.png"
            alt="Meridian"
            className="w-44 object-contain"
          />
          <img
            src="/img/carousel/data-foundation-carousel.png"
            alt="Data Foundation"
            className="w-36 object-contain"
          />
          <img
            src="/img/carousel/nextier-carousel.png"
            alt="Nextier"
            className="w-32 object-contain"
          />
          <img
            src="/img/carousel/logo-propio.svg"
            alt="Propio"
            className="w-36 object-contain"
          />
          <img
            src="/img/carousel/dewpoint-carousel.svg"
            alt="Dewpoint"
            className="w-40 object-contain"
          />
          <img
            src="/img/carousel/neogen-carousel.png"
            alt="Neogen Corporation"
            className="w-32 object-contain"
          />
          <img
            src="/img/carousel/fictionforge-carousel.png"
            alt="FictionForge"
            className="w-40 object-contain"
          />
          <img
            src="/img/carousel/cygnet-carousel.svg"
            alt="Cygnet"
            className="w-24 object-contain"
          />
          <img
            src="/img/carousel/dark-slide-carousel.png"
            alt="Dark Slide"
            className="w-36 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
