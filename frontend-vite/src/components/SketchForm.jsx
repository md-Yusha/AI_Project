import { useState, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SketchForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [titleError, setTitleError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.trim()) {
      setTitleError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      // Check if file is an image (JPG or PNG)
      if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
        setImageError("Please select a JPG or PNG image");
        setImage(null);
        setPreviewUrl("");
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Image size should be less than 5MB");
        setImage(null);
        setPreviewUrl("");
        return;
      }

      setImage(file);
      setImageError("");

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    let isValid = true;

    if (!title.trim()) {
      setTitleError("Please enter a title");
      isValid = false;
    }

    if (!image) {
      setImageError("Please select an image");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    // Submit form
    onSubmit(formData);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter a title for your image"
            disabled={loading}
            className="input-field"
          />
          {titleError && (
            <p className="mt-1 text-sm text-red-600">{titleError}</p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Upload Image
        </label>
        <div
          className={`file-drop-area ${
            isDragging ? "border-primary-500 bg-primary-50" : ""
          } ${imageError ? "border-red-300" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            id="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg, image/png"
            disabled={loading}
            className="sr-only"
          />

          <div className="text-center">
            {previewUrl ? (
              <div className="relative mx-auto w-24 h-24 mb-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setPreviewUrl("");
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="mx-auto w-12 h-12 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-12 h-12 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
            )}

            <p className="text-sm text-gray-600 font-medium">
              {image
                ? "Change image"
                : "Drag & drop an image or click to browse"}
            </p>
            <p className="text-xs text-gray-500 mt-1">JPG or PNG, max 5MB</p>

            {image && (
              <p className="text-xs text-gray-600 mt-2 truncate max-w-xs mx-auto">
                {image.name}
              </p>
            )}
          </div>
        </div>

        {imageError && (
          <p className="mt-1 text-sm text-red-600">{imageError}</p>
        )}
        <p>
          <br />
        </p>
      </div>

      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-4 border border-gray-200"
        >
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          <div className="relative rounded-lg overflow-hidden bg-white shadow-sm">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-[300px] object-contain"
            />
          </div>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className={`w-full btn btn-primary py-3 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : (
          "Create Ghibli Art"
        )}
      </motion.button>
    </form>
  );
};

export default SketchForm;
