import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 pt-16">
      <div className="w-full max-w-none">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Site
          </button>
        </div>

        <div className="bg-gradient-to-r from-black via-gray-600 via-gray-400 via-white via-gray-100 via-gray-500 via-blue-500 via-emerald-500 via-amber-500 to-red-500 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Admin Dashboard
              </h1>
            </div>
          </div>
        </div>

        {/* Site Summary */}
        <div className="bg-gradient-to-r from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900/20 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Site Overview & Journey
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Purpose & Content
              </h3>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  <strong>Portfolio Site:</strong> Dave Melkonian's digital
                  experience design portfolio showcasing 15+ years of UX/UI work
                  across healthcare, insurance, and SaaS industries.
                </p>
                <p>
                  <strong>Content Sections:</strong> Articles (12 published, 3
                  hidden), Design Work (9 projects), Lab Projects (3
                  experimental), Career History (6 positions), Testimonials (8
                  kudos), and Stories (3 case studies).
                </p>
                <p>
                  <strong>Technical Stack:</strong> React/TypeScript, Tailwind
                  CSS, Vite, with responsive design and dark mode support.
                </p>
                <p>
                  <strong>Special Features:</strong> Music player with 6 tracks,
                  writing gallery with admin controls, and comprehensive content
                  management system.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Development Journey
              </h3>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  <strong>Initial Build:</strong> Started as a simple portfolio
                  with basic sections and navigation. Evolved into a
                  comprehensive content management system.
                </p>
                <p>
                  <strong>Content Management:</strong> Added admin panel with
                  granular visibility controls for all content types, persistent
                  storage with export/import functionality.
                </p>
                <p>
                  <strong>Enhanced Features:</strong> Integrated music player,
                  writing gallery with card-based layout, and sophisticated
                  storage system with migration capabilities.
                </p>
                <p>
                  <strong>Current State:</strong> Fully functional admin system
                  with session management, content visibility controls, and
                  backup/restore functionality.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Music Player Link */}
        <div className="bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                Music Player
              </h3>
            </div>
            <Link
              to="/music-player"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Play className="h-4 w-4" />
              Open Music Player
            </Link>
          </div>
        </div>

        {/* Writing Gallery Link */}
        <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Writing Gallery
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Admin-only access to writing portfolio
              </p>
            </div>
            <Link
              to="/writing-gallery"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Play className="h-4 w-4" />
              Open Writing Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
