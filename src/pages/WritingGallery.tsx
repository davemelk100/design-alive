import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

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
  const [writingPieces, setWritingPieces] = useState<WritingPiece[]>([
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
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

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
    setWritingPieces([...writingPieces, newCard]);
  };

  const removeCard = (id: number) => {
    setWritingPieces(writingPieces.filter((piece) => piece.id !== id));
  };

  const startEditing = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = (id: number) => {
    setWritingPieces(
      writingPieces.map((piece) =>
        piece.id === id ? { ...piece, excerpt: editText } : piece
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Writing Gallery
            </h1>
            <button
              onClick={addCard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Card
            </button>
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WritingGallery;
