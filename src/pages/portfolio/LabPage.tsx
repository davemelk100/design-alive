import { Link } from "react-router-dom";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import { LazyIcon } from "../../utils/lazyIcons";
import { content } from "../../content";
import { getCardImageProps } from "../../utils/imageOptimizer";
import SEO from "../../components/SEO";

export default function LabPage() {

  const labProjects = content.currentProjects.projects.filter(
    (project) =>
      project.title !== "Chatbots" &&
      project.title !== "Design Panes" &&
      project.title !== "HealthAware" &&
      project.title !== "AI NUI" &&
      project.title !== "Configurable Multivariate Testing",
  );

  const designProjects = content.work.projects.filter(
    (project: any) => project.title !== "3D Conversion UX Plan"
  );

  return (
    <PortfolioLayout currentPage="design-dev">
      <SEO
        title="Design & Dev"
        description="Design work, visual explorations, and development projects"
        url="/portfolio/lab"
        preloadImage={designProjects[0]?.image}
      />
      {/* UX/UI Section */}
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
              className="bg-brand-dynamic/10 dark:bg-brand-dynamic/20 hover:bg-brand-dynamic/20 dark:hover:bg-brand-dynamic/30 rounded-full p-2 shadow-sm hover:scale-110 transition-all duration-200 w-10 h-10 flex items-center justify-center"
              aria-label="Dribbble"
            >
              <LazyIcon name="Dribbble" className="h-5 w-5 text-brand-dynamic" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {designProjects.map((project: any, index: number) => {
                const isInternal = project.url?.startsWith("/");
                const cardClass = "group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col shadow-xl hover:shadow-2xl transition-shadow cursor-pointer";
                const cardContent = (
                  <>
                    <div className="relative w-full max-h-64 overflow-hidden bg-transparent">
                      <img
                        {...getCardImageProps(project.image)}
                        alt={project.alt || project.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading={index === 0 ? "eager" : "lazy"}
                        {...(index === 0 ? { fetchPriority: "high" } : {})}
                        decoding="async"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1 card-hover-secondary">
                      <h3 className="font-semibold text-brand-dynamic group-hover:font-bold transition-all">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-foreground/80 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </>
                );
                return isInternal ? (
                  <Link key={index} to={project.url} className={cardClass}>
                    {cardContent}
                  </Link>
                ) : (
                  <a key={index} href={project.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
                    {cardContent}
                  </a>
                );
              })}
          </div>
        </div>
      </section>

      {/* Lab Section */}
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative lab-section-narrow">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
              <SectionHeader
                title={content.currentProjects.title}
                subtitle={content.currentProjects.subtitle}
                className="mb-6"
                showUpArrow={false}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {labProjects.map((project, index) => (
                    <a
                      key={index}
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col cursor-pointer shadow-xl"
                    >
                      <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-transparent">
                        {project.image ? (
                          <img
                            {...(project.image.endsWith(".svg") ? { src: `${project.image}?v=${Date.now()}`, width: 512, height: 512 } : getCardImageProps(project.image))}
                            alt={project.title}
                            className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${project.image.endsWith(".svg") ? "object-contain object-center" : "object-cover object-top"}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            {...(index === 0 ? { fetchPriority: "high" } : {})}
                            decoding="async"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                            <span className="text-gray-400 dark:text-gray-500">
                              {(project as any).title || "Project"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1 card-hover-secondary">
                        <h3 className="font-semibold text-brand-dynamic group-hover:font-bold transition-all">
                          {project.title}
                        </h3>
                        <p className="text-foreground/80 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}
