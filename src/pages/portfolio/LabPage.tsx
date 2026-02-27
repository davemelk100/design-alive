import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import { content } from "../../content";

export default function LabPage() {

  const projects = content.currentProjects.projects.filter(
    (project) =>
      project.title !== "Chatbots" &&
      project.title !== "Design Panes" &&
      project.title !== "HealthAware" &&
      project.title !== "AI NUI" &&
      project.title !== "Configurable Multivariate Testing",
  );

  return (
    <PortfolioLayout currentPage="current-projects">
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
                  {projects.map((project, index) => (
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
                            src={project.image.endsWith(".svg") ? `${project.image}?v=${Date.now()}` : project.image}
                            alt={project.title}
                            className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${project.image.endsWith(".svg") ? "object-contain object-center" : "object-cover object-top"}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            {...(index === 0 ? { fetchPriority: "high" as const } : {})}
                            decoding="async"
                            width="512"
                            height="512"
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
                        <h3 className="font-semibold text-brand-dynamic dark:text-white group-hover:font-bold transition-all">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-white line-clamp-2">
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
