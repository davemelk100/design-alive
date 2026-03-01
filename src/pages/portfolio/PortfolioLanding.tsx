import React, { Suspense, useState, useEffect, useCallback } from "react";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import IconWrapper from "../../components/IconWrapper";
import { content } from "../../content";
import {
  applyStoredThemeColors,
  EDITABLE_VARS,
  useContrastEnforcement,
} from "./themeUtils";

import { LinkedInLogoIcon } from "../../components/SocialIcons";
const LazyLinkedInLogoIcon = LinkedInLogoIcon;
import SEO from "../../components/SEO";

const PortfolioLandingDesignSystem = React.lazy(() => import('./PortfolioLandingDesignSystem'));

export default function PortfolioLanding() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [lockedKeys, setLockedKeys] = useState<Set<string>>(new Set());
  const [prevColors, setPrevColors] = useState<Record<string, string> | null>(null);

  const readCurrentColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    const current: Record<string, string> = {};
    let hasEmpty = false;
    EDITABLE_VARS.forEach(({ key }) => {
      const val = style.getPropertyValue(key).trim();
      current[key] = val;
      if (!val) hasEmpty = true;
    });
    setColors(current);
    if (hasEmpty) {
      setTimeout(() => {
        const retryStyle = getComputedStyle(document.documentElement);
        const retried: Record<string, string> = {};
        EDITABLE_VARS.forEach(({ key }) => {
          retried[key] = retryStyle.getPropertyValue(key).trim();
        });
        setColors(retried);
      }, 100);
    }
  }, []);

  useContrastEnforcement(colors, setColors, lockedKeys);

  useEffect(() => {
    applyStoredThemeColors();
    readCurrentColors();

    const handlePendingUpdate = () => {
      setTimeout(() => readCurrentColors(), 50);
    };
    window.addEventListener("theme-pending-update", handlePendingUpdate);
    return () => window.removeEventListener("theme-pending-update", handlePendingUpdate);
  }, [readCurrentColors]);

  return (
    <PortfolioLayout currentPage="home">
      <SEO
        title="Portfolio"
        description="Digital Experience Designer with over 15 years of experience creating user-centered solutions"
        url="/portfolio"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Dave Melkonian",
          url: "https://davemelkonian.com/portfolio",
          jobTitle: "Digital Experience Designer",
          sameAs: [
            "https://www.linkedin.com/in/davemelk/",
            "https://dribbble.com/davemelk100",
            "https://github.com/davemelk100",
          ],
        }}
      />
      {/* Live Design System Preview */}
      <Suspense fallback={null}>
        <PortfolioLandingDesignSystem
          colors={colors}
          setColors={setColors}
          lockedKeys={lockedKeys}
          setLockedKeys={setLockedKeys}
          prevColors={prevColors}
          setPrevColors={setPrevColors}
          readCurrentColors={readCurrentColors}
        />
      </Suspense>

      {/* Career Section */}
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={content.career.title}
            subtitle={content.career.subtitle}
            className="mb-8 sm:mb-6"
            icon={
              <a
                href={content.navigation.social.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-dynamic/10 dark:bg-brand-dynamic/20 hover:bg-brand-dynamic/20 dark:hover:bg-brand-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
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
                <h3 className="font-semibold mb-1 title-font">
                  {position.title}
                </h3>
                <p className="text-foreground/80 mb-1">
                  {position.company}
                </p>
                <p className="text-foreground/80 mb-2">
                  {position.period}
                </p>
                {Array.isArray(position.description) ? (
                  <ul className="text-foreground/80 leading-relaxed list-disc list-inside space-y-1">
                    {position.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-foreground/80 leading-relaxed">
                    {position.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2">
            <h3 className="font-semibold mb-2 text-[color:hsl(var(--foreground))]">
              Certifications
            </h3>
            <ul className="list-disc list-inside text-foreground/80 leading-relaxed space-y-1 mb-4">
              <li>Certified ScrumMaster (Scrum Alliance)</li>
              <li>
                Certified Usability Analyst (Human Factors
                International)
              </li>
              <li>ITIL Foundation Certificate (Axelos)</li>
            </ul>
            <h3 className="font-semibold mb-2 text-[color:hsl(var(--foreground))]">
              Education
            </h3>
            <ul className="list-disc list-inside text-foreground/80 leading-relaxed space-y-1">
              <li>Oakland University | Rochester MI</li>
              <li>Bachelor of Arts in English</li>
              <li>Minor in Public Relations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={content.testimonials.title}
            subtitle={content.testimonials.subtitle}
            className="mb-8 sm:mb-6"
          />
          <div className="space-y-6">
            {content.testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="border-l-2 border-accent-dynamic/60 pl-4"
              >
                <p className="text-foreground/80 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <p className="mt-2 font-semibold text-[color:hsl(var(--foreground))]">
                  {testimonial.author}
                </p>
                <p className="text-foreground/80 text-sm">
                  {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}
