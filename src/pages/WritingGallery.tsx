import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Lock } from "lucide-react";
import { content } from "../content";
import MobileTrayMenu from "../components/MobileTrayMenu";

interface WritingPiece {
  id: number;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  url?: string;
  isPublished: boolean;
}

const WritingGallery: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [error, setError] = useState("");

  // Load saved writing pieces from storage or use defaults
  const getInitialWritingPieces = (): WritingPiece[] => {
    return content.writingGallery.defaultPieces.map((piece, i) => ({
      id: i + 1,
      title: "",
      subtitle: "",
      excerpt: piece.excerpt,
      category: "",
      readTime: "",
      date: "",
      image: "",
      url: "",
      isPublished: true,
    }));
  };

  const [writingPieces] = useState<WritingPiece[]>(getInitialWritingPieces);

  const [storageStatus] = useState<{ available: boolean; message?: string }>({
    available: true,
  });

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === "9109") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect pin code. Please try again.");
      setPinCode("");
    }
  };

  // Show pin code input if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-md mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-600 dark:text-gray-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Writing Gallery
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Enter pin code to access
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="Enter pin code"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  maxLength={4}
                />
              </div>

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Access Gallery
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Link>
            </div>
          </motion.div>
        </div>
        <MobileTrayMenu />
      </div>
    );
  }

  // Show actual content if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {content.writingGallery.title}
              </h1>
              {!storageStatus.available && (
                <div className="flex items-center gap-2 mt-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {storageStatus.message ||
                      content.writingGallery.storageNotAvailable}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {content.writingGallery.backToSite}
              </Link>
            </div>
          </div>

          {/* Writing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writingPieces.map((piece, index) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative bg-white dark:bg-gray-700 rounded-lg shadow-md p-6"
              >
                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {piece.excerpt}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center"></div>
        </motion.div>
      </div>
      <MobileTrayMenu />
    </div>
  );
};

export default WritingGallery;
