import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Download,
  Upload,
  AlertCircle,
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
        excerpt:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
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
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
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
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
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
        excerpt: "AI has made it less scary for when their parents die.",
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
          "I mean, you came to see Shattered Realm, so now's not the time to whine about your helmet being split in two.",
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
      console.error("Failed to save writing pieces:", error);
      setStorageStatus({
        available: false,
        message: "Failed to save changes. Please try again.",
      });
    }
  };

  const addCard = () => {
    const newId = Math.max(...writingPieces.map((piece) => piece.id), 0) + 1;
    const newCard: WritingPiece = {
      id: newId,
      title: "",
      subtitle: "",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      category: "",
      readTime: "",
      date: "",
      image: "",
      url: "",
      isPublished: true,
    };
    const updatedPieces = [...writingPieces, newCard];
    setWritingPieces(updatedPieces);
    saveToStorage(updatedPieces);
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
      console.error("Failed to export data:", error);
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
        console.error("Failed to import data:", error);
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
              <button
                onClick={addCard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Card
              </button>
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
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {editingId === piece.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(piece.id)}
                        className="p-1 text-green-500 hover:text-green-600 transition-colors"
                        title="Save changes"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-gray-500 hover:text-gray-600 transition-colors"
                        title="Cancel edit"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(piece.id, piece.excerpt)}
                        className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                        title="Edit card"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeCard(piece.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove card"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Content */}
                {editingId === piece.id ? (
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full h-32 p-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your text here..."
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 text-sm pr-16">
                    {piece.excerpt}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              This gallery is only accessible via the admin panel.
            </p>
            {storageStatus.available && (
              <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                ✓ Data is being saved automatically
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WritingGallery;
