import { useState } from "react";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import { content } from "../../content";
import designTokens from "../../designTokens.json";

export default function DesignSystemPage() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 1500);
  };

  return (
    <PortfolioLayout currentPage="design-system">
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={content.designSystem.title}
            subtitle={content.designSystem.subtitle}
            className="mb-8 sm:mb-6"
          />

          {/* Colors */}
          <div className="mb-10">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {content.designSystem.sections.colors}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {designTokens.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => copyToClipboard(color.value)}
                  className="group text-left"
                >
                  <div
                    className="w-full h-16 rounded-lg mb-2 border border-gray-200 dark:border-gray-700 group-hover:ring-2 group-hover:ring-gray-400 transition-all"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {color.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {copiedValue === color.value ? "Copied!" : color.value}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="mb-10">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {content.designSystem.sections.typography}
            </h3>
            <div className="space-y-4">
              {designTokens.typography.map((type) => (
                <div
                  key={type.name}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border-b border-gray-100 dark:border-gray-800 pb-4"
                >
                  <div className="sm:w-32 flex-shrink-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {type.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {type.fontSize} / {type.fontWeight}
                    </p>
                  </div>
                  <p
                    className="text-gray-900 dark:text-white"
                    style={{
                      fontSize: type.fontSize,
                      fontWeight: Number(type.fontWeight),
                      lineHeight: type.lineHeight,
                    }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="mb-10">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {content.designSystem.sections.spacing}
            </h3>
            <div className="space-y-3">
              {designTokens.spacing.map((space) => (
                <div key={space.name} className="flex items-center gap-4">
                  <span className="w-12 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {space.name}
                  </span>
                  <div
                    className="bg-blue-500 dark:bg-blue-400 rounded-sm"
                    style={{ width: space.value, height: "1rem" }}
                  />
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {space.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shadows */}
          <div className="mb-10">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Shadows
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {designTokens.shadows.map((shadow) => (
                <div key={shadow.name} className="text-center">
                  <div
                    className="w-full h-20 rounded-lg bg-white dark:bg-gray-800 mb-2"
                    style={{ boxShadow: shadow.value }}
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {shadow.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {shadow.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-10">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {content.designSystem.sections.buttons}
            </h3>
            <div className="flex flex-wrap gap-3">
              {designTokens.buttons.map((btn) => (
                <button
                  key={btn.name}
                  className="transition-colors"
                  style={{
                    backgroundColor: btn.backgroundColor,
                    color: btn.textColor,
                    border: btn.border,
                    padding: btn.padding,
                    borderRadius: `${btn.borderRadius}px`,
                    fontWeight: btn.fontWeight,
                  }}
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>

          {/* Animations */}
          <div className="mb-10">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Animations
            </h3>
            <div className="space-y-6">
              {/* Accordion */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      accordion-down / accordion-up
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      0.2s ease-out
                    </p>
                  </div>
                  <button
                    onClick={() => setAccordionOpen((prev) => !prev)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {accordionOpen ? "Collapse" : "Expand"}
                  </button>
                </div>
                <div
                  className="grid transition-all duration-200 ease-out"
                  style={{
                    gridTemplateRows: accordionOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      This content expands and collapses using the accordion
                      animation. Used by the Radix UI Accordion component to
                      smoothly reveal and hide content sections.
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Banner */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    scroll-banner
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    linear infinite
                  </p>
                </div>
                <div className="px-4 py-3 overflow-hidden">
                  <div
                    className="flex w-max"
                    style={{
                      animation: "scroll-banner 30s linear infinite",
                    }}
                  >
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex gap-8 mr-8">
                        {[
                          "Design Systems",
                          "Typography",
                          "Color Tokens",
                          "Spacing",
                          "Components",
                          "Accessibility",
                        ].map((word) => (
                          <span
                            key={`${i}-${word}`}
                            className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Border Radii */}
          <div className="mb-10">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Border Radius
            </h3>
            <div className="flex flex-wrap gap-6">
              {designTokens.numbers
                .filter((n) => n.name.startsWith("border-radius"))
                .map((radius) => (
                  <div key={radius.name} className="text-center">
                    <div
                      className="w-20 h-20 bg-blue-500 dark:bg-blue-400 mb-2"
                      style={{ borderRadius: `${radius.value}px` }}
                    />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {radius.value}px
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {radius.name.replace("border-radius-", "")}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}
