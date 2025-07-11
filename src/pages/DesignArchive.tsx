import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { content } from "../content";
import { ArrowLeft, Search } from "lucide-react";

export default function DesignArchive() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const designSection = document.getElementById("design-work");
      if (designSection) {
        designSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    return content.work.projects.filter((project: any) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description &&
          project.description.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8 relative z-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Design
          </Link>

          <h1 className="text-3xl font-bold dark:text-white mb-4 title-font">
            Design Work Archive
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
            Browse all {content.work.projects.length} design projects or search
            for specific work.
          </p>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search design work..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Showing {filteredProjects.length} of {content.work.projects.length}{" "}
            projects
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8">
          {filteredProjects.map((project: any, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg bg-gray-100/80 p-6 transition-all duration-300 hover:bg-gray-200/80 dark:bg-gray-800/80 dark:hover:bg-gray-700/80"
            >
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Image */}
                <div className="mb-4 md:mb-0 aspect-video overflow-hidden rounded-lg">
                  <img
                    src={`${project.image}?v=${Date.now()}`}
                    alt={project.alt || project.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <h3 className="mb-3 text-xl font-semibold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-card">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No design work found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
