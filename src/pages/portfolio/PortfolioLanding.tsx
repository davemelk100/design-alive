import React from "react";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import IconWrapper from "../../components/IconWrapper";
import { content } from "../../content";

const LazyLinkedInLogoIcon = React.lazy(() =>
  import("@radix-ui/react-icons").then((mod) => ({
    default: mod.LinkedInLogoIcon,
  })),
);

export default function PortfolioLanding() {
  return (
    <PortfolioLayout currentPage="home">
      {/* Intro + Live Design System row */}
      <section className="relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="lg:w-1/2">
              <p className="text-muted-foreground text-left">
                I'm David Melkonian, a technical product and
                experience leader with over a decade of work at
                the intersection of UX, software engineering, and
                digital accessibility. I specialize in designing
                and shipping full-stack web and mobile products
                using Vue, React, Next.js, Python, and FastAPI,
                with a focus on scalable design systems,
                performance, and usability. I've led teams
                of 30+ and established enterprise-wide standards
                for digital experience delivery.
              </p>
            </div>
            <div className="lg:w-1/2 rounded-lg border border-border bg-white dark:bg-gray-800 p-4 shadow-lg flex flex-col gap-3">
              <div>
                <h3 className="font-bold text-brand-dynamic dark:text-white mb-1 title-font">NEW - Live Design System!</h3>
                <p className="text-muted-foreground text-sm">
                  Explore the interactive design system powering this site. Pick a brand color and watch every token, including primary, secondary, accent, and more, transform in real time with automatic WCAG AA contrast correction.
                </p>
              </div>
              <a
                href="/portfolio/design-system"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-dynamic text-white hover:opacity-90 transition-opacity text-center"
              >
                Try It
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={content.career.title}
            subtitle={content.career.subtitle}
            className="mb-8 sm:mb-6"
            icon={
              <a
                href={content.navigation.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <IconWrapper
                  Icon={LazyLinkedInLogoIcon}
                  className="h-5 w-5 text-brand-dynamic"
                />
              </a>
            }
          />
          <div className="space-y-8">
            {content.career.positions.map((position) => (
              <div
                key={position.title + position.period}
                className=""
              >
                <h3 className="font-semibold mb-1 dark:text-white title-font">
                  {position.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  {position.company}
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  {position.period}
                </p>
                {Array.isArray(position.description) ? (
                  <ul className="text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                    {position.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {position.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Certifications
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-1 mb-4">
              <li>Certified ScrumMaster (Scrum Alliance)</li>
              <li>
                Certified Usability Analyst (Human Factors
                International)
              </li>
              <li>ITIL Foundation Certificate (Axelos)</li>
            </ul>
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Education
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">
              <li>Oakland University | Rochester MI</li>
              <li>Bachelor of Arts in English</li>
              <li>Minor in Public Relations</li>
            </ul>
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}
