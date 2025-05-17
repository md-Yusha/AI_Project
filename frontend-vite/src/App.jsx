import { useState, useEffect, useCallback } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "./App.css";

import Header from "./components/Header";
import SketchForm from "./components/SketchForm";
import SketchList from "./components/SketchList";
import LoadingPage from "./components/LoadingPage";
import LoadingAnimation from "./components/LoadingAnimation";
import Notification from "./components/Notification";

const API_URL = "http://localhost:8000/api/sketches/";

function App() {
  const [sketches, setSketches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    additionalInfo: "",
  });
  const [pollingIds, setPollingIds] = useState([]);
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen for 1.5 seconds on first load
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch sketches on component mount
  useEffect(() => {
    fetchSketches();
  }, []);

  // Polling mechanism for sketches that are being processed
  useEffect(() => {
    if (pollingIds.length === 0) return;

    const pollingInterval = setInterval(() => {
      checkProcessedSketches();
    }, 3000); // Check every 3 seconds

    return () => clearInterval(pollingInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollingIds]);

  const checkProcessedSketches = useCallback(async () => {
    if (pollingIds.length === 0) return;

    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data)) {
        const updatedSketches = response.data;
        setSketches(updatedSketches);

        // Check if any of the polling sketches are now processed
        const stillProcessing = [];
        pollingIds.forEach((id) => {
          const sketch = updatedSketches.find((s) => s.id === id);
          if (sketch && (!sketch.processed || !sketch.sketch_image_url)) {
            stillProcessing.push(id);
          }
        });

        // Update the polling list
        setPollingIds(stillProcessing);
      }
    } catch (err) {
      console.error("Error checking processed sketches:", err);
    }
  }, [pollingIds]);

  const fetchSketches = async () => {
    setInitialLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data && Array.isArray(response.data)) {
        setSketches(response.data);

        // Find sketches that are still processing
        const processingIds = response.data
          .filter((sketch) => !sketch.processed || !sketch.sketch_image_url)
          .map((sketch) => sketch.id);

        setPollingIds(processingIds);
      } else if (response.data && response.data.error) {
        setNotification({
          type: "error",
          message: "Server error",
          additionalInfo: response.data.error,
        });
        console.error("Server returned an error:", response.data.error);
      } else {
        setNotification({
          type: "error",
          message: "Invalid data format",
          additionalInfo: "Received invalid data format from server",
        });
        console.error("Invalid data format:", response.data);
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: "Connection error",
        additionalInfo:
          "Failed to fetch images. Please make sure the Django server is running.",
      });
      console.error("Error fetching images:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSketchSubmit = async (formData) => {
    setLoading(true);
    setNotification({ type: "", message: "", additionalInfo: "" });

    // Add the style parameter to the form data
    formData.append("style", "ghibli");

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.id) {
        // Add the new image to the list
        setSketches([response.data, ...sketches]);

        // Add the new image ID to the polling list
        setPollingIds((prev) => [...prev, response.data.id]);

        setNotification({
          type: "success",
          message: "Image uploaded successfully!",
          additionalInfo:
            "The AI is now processing your image to create Ghibli art. This may take a minute or two.",
        });
      } else if (response.data && response.data.error) {
        setNotification({
          type: "error",
          message: "Server error",
          additionalInfo: response.data.error,
        });
        console.error("Server returned an error:", response.data.error);
      } else {
        setNotification({
          type: "error",
          message: "Invalid response",
          additionalInfo: "Received invalid response from server",
        });
        console.error("Invalid response format:", response.data);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        // Handle structured error responses
        if (err.response.data.error) {
          setNotification({
            type: "error",
            message: "Upload failed",
            additionalInfo: err.response.data.error,
          });
        } else if (typeof err.response.data === "object") {
          // Handle validation errors
          const errorMessages = Object.entries(err.response.data)
            .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
            .join("; ");
          setNotification({
            type: "error",
            message: "Validation error",
            additionalInfo: errorMessages,
          });
        } else {
          setNotification({
            type: "error",
            message: "Upload failed",
            additionalInfo: "Failed to upload image. Please try again.",
          });
        }
      } else {
        setNotification({
          type: "error",
          message: "Connection error",
          additionalInfo:
            "Failed to upload image. Please make sure the Django server is running.",
        });
      }
      console.error("Error uploading image:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle image deletion
  const handleDeleteSketch = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}?id=${id}`);

      // Remove the deleted image from the state
      setSketches(sketches.filter((sketch) => sketch.id !== id));

      // Also remove from polling if it's there
      setPollingIds(pollingIds.filter((pollId) => pollId !== id));

      // Show success message
      setNotification({
        type: "success",
        message: "Image deleted successfully!",
        additionalInfo: "",
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: "Delete failed",
        additionalInfo: "Failed to delete image. Please try again.",
      });
      console.error("Error deleting image:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearNotification = () => {
    setNotification({ type: "", message: "", additionalInfo: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
        type={notification.type}
        message={notification.message}
        additionalInfo={notification.additionalInfo}
        onClose={clearNotification}
      />

      <div className="container mx-auto px-4 py-8">
        <Header />

        {/* Splash screen on first website load */}
        {showSplash ? (
          <LoadingPage />
        ) : (
          <main className="mt-8 md:mt-12">
            {initialLoading ? (
              <LoadingAnimation />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                    Ghiblify your Image
                  </h2>
                  <SketchForm onSubmit={handleSketchSubmit} loading={loading} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                    Your Ghibli Art
                  </h2>
                  {loading && !sketches.length ? (
                    <LoadingAnimation />
                  ) : (
                    <SketchList
                      sketches={sketches}
                      onDelete={handleDeleteSketch}
                    />
                  )}
                </motion.div>
              </div>
            )}
          </main>
        )}

        <footer className="mt-16 text-center text-gray-500 text-sm py-6">
          <p>{new Date().getFullYear()} Ghibli Art Generator. Md Yusha.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
