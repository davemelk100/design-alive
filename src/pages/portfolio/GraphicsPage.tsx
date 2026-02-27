import { lazy } from "react";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import IconWrapper from "../../components/IconWrapper";
import { content } from "../../content";

const LazyDribbble = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Dribbble }))
);

export default function GraphicsPage() {
  return (
    <PortfolioLayout currentPage="graphics">
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionHeader
              title="UX/UI"
              subtitle="Design work and visual explorations"
              className=""
            />
            <a
              href={content.navigation.social.dribbble.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-8 h-8 flex items-center justify-center"
              aria-label="Dribbble"
            >
              <IconWrapper
                Icon={LazyDribbble}
                className="h-4 w-4 text-brand-dynamic dark:text-gray-300"
              />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {content.work.projects
              .filter((project: any) => project.title !== "3D Conversion UX Plan")
              .map((project: any, index: number) => (
                <a
                  key={index}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                >
                  <div className="relative w-full overflow-hidden bg-transparent">
                    <img
                      src={project.image}
                      alt={project.alt || project.title}
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1 card-hover-secondary">
                    <h3 className="font-semibold text-brand-dynamic dark:text-white group-hover:font-bold transition-all">
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
        </div>
      </section>
    </PortfolioLayout>
  );
}
