import React, { useState } from "react";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import IconWrapper from "../../components/IconWrapper";
import { content } from "../../content";
import {
  getCardImageProps,
  getThumbnailImageProps,
} from "../../utils/imageOptimizer";

const LazyExternalLink = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ExternalLink })),
);
const LazyDribbble = React.lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Dribbble })),
);

export default function DesignPage() {
  const [designViewMode, setDesignViewMode] = useState<"list" | "grid">("list");

  const projects = content.work.projects.filter(
    (project: any) => project.title !== "3D Conversion UX Plan",
  );

  return (
    <PortfolioLayout currentPage="work">
      <section className="py-4 sm:py-6 lg:py-8 xl:py-12 relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
            <SectionHeader
              title="Design"
              subtitle={content.work.subtitle}
              className="mb-6"
              showArchiveLink={false}
              toggleView={(mode) => setDesignViewMode(mode)}
              viewMode={designViewMode}
              icon={
                <a
                  href={content.navigation.social.dribbble.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                  aria-label="Dribbble"
                >
                  <IconWrapper
                    Icon={LazyDribbble}
                    className="h-5 w-5 text-black dark:text-white"
                  />
                </a>
              }
            />
            {designViewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {projects.map((project: any, index) => (
                  <a
                    key={index}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                  >
                    <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-transparent">
                      <img
                        {...getCardImageProps(project.image)}
                        alt={project.alt || project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:font-bold transition-all">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-600 dark:text-white line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project: any, index) => (
                  <a
                    key={index}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-3 rounded-lg bg-white/20 backdrop-blur-lg hover:shadow-xl transition-all cursor-pointer shadow-xl"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded bg-transparent">
                      <img
                        {...getThumbnailImageProps(project.image)}
                        alt={project.alt || project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:font-bold transition-all truncate">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-600 dark:text-white line-clamp-1 mt-1">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <IconWrapper
                      Icon={LazyExternalLink}
                      className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}
