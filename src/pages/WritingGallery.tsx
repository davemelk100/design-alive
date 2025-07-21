import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Trash2,
  Edit2,
  Check,
  X,
  Download,
  Upload,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { writingGalleryStorage, storage } from "../utils/storage";

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
  // Load saved writing pieces from storage or use defaults
  const getInitialWritingPieces = (): WritingPiece[] => {
    const saved = writingGalleryStorage.getPieces();
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }

    // Default pieces if nothing is saved
    return [
      {
        id: 1,
        title: "",
        subtitle: "",
        excerpt: "AI has made it less scary for when their parents die.",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
      {
        id: 2,
        title: "",
        subtitle: "",
        excerpt:
          "I mean, you came to see Shattered Realm, so now's not the time to whine about your helmet being split in two.",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
      {
        id: 3,
        title: "",
        subtitle: "",
        excerpt:
          "Thick Goth Chick Gets Ozempic and Leaves Harcore Dude Who Held Her Down All Those Years Before She Got Skinny",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
      {
        id: 4,
        title: "",
        subtitle: "",
        excerpt:
          "Chick Loses Weight, Boyfriend Knows This Is Just The First Step, Next Thing You Know She'll Ask To Go Outside",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
      {
        id: 5,
        title: "",
        subtitle: "",
        excerpt:
          "(image of the wild wild country guy bagwan shri rajneesh) SOUNDGARDEN",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
      {
        id: 6,
        title: "",
        subtitle: "",
        excerpt:
          "are moustaches still ironic? seems like people are taking them serious again.",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
    ];
  };

  const [writingPieces, setWritingPieces] = useState<WritingPiece[]>(
    getInitialWritingPieces
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [storageStatus, setStorageStatus] = useState<{
    available: boolean;
    message?: string;
  }>({ available: storage.isAvailable() });

  const saveToStorage = (pieces: WritingPiece[]) => {
    try {
      writingGalleryStorage.setPieces(pieces);
      setStorageStatus({ available: true });
    } catch (error) {
      setStorageStatus({
        available: false,
        message: "Failed to save changes. Please try again.",
      });
    }
  };

  const removeCard = (id: number) => {
    const updatedPieces = writingPieces.filter((piece) => piece.id !== id);
    setWritingPieces(updatedPieces);
    saveToStorage(updatedPieces);
  };

  const startEditing = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = (id: number) => {
    const updatedPieces = writingPieces.map((piece) =>
      piece.id === id ? { ...piece, excerpt: editText } : piece
    );
    setWritingPieces(updatedPieces);
    saveToStorage(updatedPieces);
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Export data functionality
  const exportData = () => {
    try {
      const data = {
        writingPieces,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `writing-gallery-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to export data. Please try again.");
    }
  };

  // Import data functionality
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.writingPieces && Array.isArray(data.writingPieces)) {
          setWritingPieces(data.writingPieces);
          saveToStorage(data.writingPieces);
          alert("Data imported successfully!");
        } else {
          alert("Invalid file format. Please select a valid backup file.");
        }
      } catch (error) {
        alert("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

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
                Writing Gallery
              </h1>
              {!storageStatus.available && (
                <div className="flex items-center gap-2 mt-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {storageStatus.message || "Storage not available"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Export/Import buttons */}
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                title="Export data backup"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <label className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm cursor-pointer">
                <Upload className="h-4 w-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Site
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
                {editingId === piece.id ? (
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full h-32 p-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your text here..."
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {piece.excerpt}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default WritingGallery;
