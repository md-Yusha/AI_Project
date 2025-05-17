import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SketchList = ({ sketches, onDelete }) => {
  const [expandedSketch, setExpandedSketch] = useState(null);

  if (!sketches || sketches.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
        <p className="mt-4 text-gray-500 text-lg">No images uploaded yet.</p>
        <p className="text-gray-400 text-sm mt-1">
          Upload an image to get started
        </p>
      </div>
    );
  }

  const toggleExpand = (id) => {
    if (expandedSketch === id) {
      setExpandedSketch(null);
    } else {
      setExpandedSketch(id);
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this image?")) {
      onDelete(id);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <AnimatePresence>
        {sketches.map((sketch) => (
          <motion.div
            key={sketch.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="card hover:translate-y-[-4px]"
            onClick={() => toggleExpand(sketch.id)}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800 truncate">
                {sketch.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {new Date(sketch.uploaded_at).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => handleDelete(sketch.id, e)}
                  className="p-1 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div
              className={`grid ${
                expandedSketch === sketch.id
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-2"
              } gap-4 p-4`}
            >
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original Image
                </p>
                <div className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square">
                  <img
                    src={sketch.image_url}
                    alt={`${sketch.title} - Original`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghibli Art
                </p>
                {sketch.sketch_image_url ? (
                  <div className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square">
                    <img
                      src={sketch.sketch_image_url}
                      alt={`${sketch.title} - Ghibli Art`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg aspect-square">
                    {sketch.processed === false ? (
                      <>
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 rounded-full border-t-2 border-primary-500 animate-spin"></div>
                          <div className="absolute inset-2 rounded-full border-t-2 border-secondary-500 animate-spin-slow"></div>
                          <div
                            className="absolute inset-4 rounded-full border-t-2 border-primary-300 animate-spin"
                            style={{ animationDirection: "reverse" }}
                          ></div>
                        </div>
                        <p className="mt-4 text-gray-600 text-sm font-medium">
                          AI is generating your Ghibli art...
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          This may take a minute or two
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500">Not available</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {expandedSketch === sketch.id && sketch.sketch_image_url && (
              <div className="p-4 border-t border-gray-100">
                <button
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Create a temporary link to download the image
                    const link = document.createElement("a");
                    link.href = sketch.sketch_image_url;
                    link.download = `${sketch.title}-ghibli.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Download Ghibli Art
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SketchList;
