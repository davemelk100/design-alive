import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface UploadedFile {
    url: string;
    name: string;
    type: "image" | "video";
}

const Discogs: React.FC = () => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    // const [isUploading, setIsUploading] = useState(false);
    // const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
    // const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFiles = async () => {
        try {
            const response = await fetch("http://localhost:8888/list-discogs");
            if (response.ok) {
                const data = await response.json();
                setFiles(data.files);
            }
        } catch (err) {
            console.error("Failed to fetch files:", err);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedFile(null);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    /* 
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      setIsUploading(true);
      setError(null);
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await fetch("http://localhost:8888/upload-discogs", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) throw new Error("Upload failed");
  
        await fetchFiles();
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        setError("Failed to upload file. Please try again.");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    };
    */

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-8 font-serif leading-relaxed">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Discogs</h1>
                    {/* <div className="flex items-center gap-4">
            {isUploading && <span className="text-sm animate-pulse font-sans">Uploading...</span>}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*,video/*"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80 transition-opacity text-sm font-medium font-sans"
            >
              Upload Photo/Video
            </label>
          </div> */}
                </div>

                {/* {error && <div className="text-red-500 text-sm font-sans">{error}</div>} */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {files.map((file, index) => (
                        <motion.div
                            layoutId={`file-${file.url}`}
                            key={index}
                            onClick={() => setSelectedFile(file)}
                            className={`group relative aspect-square rounded-lg overflow-hidden cursor-zoom-in ${file.type === "video" ? "bg-black" : "bg-gray-100 dark:bg-gray-900"}`}
                        >
                            {file.type === "video" ? (
                                <video
                                    src={file.url}
                                    className="w-full h-full object-contain pointer-events-none"
                                    muted
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs truncate font-sans">{file.name}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {files.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400 font-sans">No media yet. Upload some records to get started.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedFile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out"
                        onClick={() => setSelectedFile(null)}
                    >
                        <motion.button
                            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors"
                            onClick={() => setSelectedFile(null)}
                        >
                            <X className="w-8 h-8" />
                        </motion.button>

                        <motion.div
                            layoutId={`file-${selectedFile.url}`}
                            className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedFile.type === "video" ? (
                                <video
                                    src={selectedFile.url}
                                    className="max-w-full max-h-[90vh] rounded shadow-2xl"
                                    controls
                                    autoPlay
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={selectedFile.url}
                                    alt={selectedFile.name}
                                    className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl"
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Discogs;
