import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Palette } from "lucide-react";
import { content } from "../content";
import MobileTrayMenu from "../components/MobileTrayMenu";

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/archive"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">View Articles</p>
                <p className="text-sm text-gray-600">Browse all articles</p>
              </div>
            </Link>

            <Link
              to="/writing-gallery"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Writing Gallery</p>
                <p className="text-sm text-gray-600">Manage writing pieces</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Content Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Articles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Articles
            </h2>
            <div className="space-y-3">
              {content.articles.items.slice(0, 5).map((article, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-600">{article.date}</p>
                  </div>
                  {article.url.startsWith("http") ? (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </a>
                  ) : (
                    <Link
                      to={`/article/${article.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Design Work */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Design Work
            </h2>
            <div className="space-y-3">
              {content.work.projects.slice(0, 5).map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {project.categories}
                    </p>
                  </div>
                  {"url" in project && project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <MobileTrayMenu />
    </div>
  );
};

export default Admin;
