import React, { useEffect, useState } from "react";
import "../App.css";

/**
 * LoadingPage splash with fade-out and minimum duration logic.
 * Styled with Ghibli-inspired aesthetics.
 * @param {Object} props
 * @param {() => void} [props.onLoadingComplete] Optional callback when loading is done and fade-out finishes.
 */
const LoadingPage = ({ onLoadingComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const startTime = useState(() => Date.now())[0];

  useEffect(() => {
    const MIN_DURATION = 8000; // Minimum ms to show loader
    const FADE_DURATION = 700; // Fade out ms

    const checkLoadingComplete = () => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime >= MIN_DURATION) {
        setIsFading(true);
        setTimeout(() => {
          onLoadingComplete?.();
        }, FADE_DURATION);
      } else {
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            onLoadingComplete?.();
          }, FADE_DURATION);
        }, MIN_DURATION - elapsedTime);
      }
    };

    if (document.readyState === "complete") {
      checkLoadingComplete();
    } else {
      window.addEventListener("load", checkLoadingComplete);
    }
    return () => {
      window.removeEventListener("load", checkLoadingComplete);
    };
  }, [onLoadingComplete, startTime]);

  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        @keyframes fadeOutLoadingSplash {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          background: `linear-gradient(135deg, rgba(168, 230, 207, 0.7) 0%, rgba(220, 237, 193, 0.7) 50%, rgba(255, 211, 182, 0.7) 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          opacity: isFading ? 0 : 1,
          pointerEvents: isFading ? "none" : "auto",
          transition: "opacity 700ms cubic-bezier(0.4,0,0.2,1)",
          WebkitTransition: "opacity 700ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Ghibli-inspired Background Image */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/src/assets/bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
            zIndex: -1,
          }}
        />

        {/* Title */}
        <div className="ghibli-title-container">
          <h1 className="ghibli-title">GHIBLIFY</h1>
          <p className="ghibli-subtitle">
            Transform your images with Ghibli magic
          </p>
        </div>

        <p className="loading-text">Loading your magical experience...</p>

        <style>{`
          .floating-elements {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
          }
          
          .cloud {
            position: absolute;
            background: white;
            border-radius: 50%;
            opacity: 0.8;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          

          
          .ghibli-title-container {
            text-align: center;
            margin-bottom: 3rem;
            z-index: 1;
          }
          
          .ghibli-title {
            font-weight: 900;
            font-size: clamp(3rem, 10vw, 6rem);
            letter-spacing: 5px;
            color: #ffffff;
            text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin-bottom: 1rem;
          }
          
          .ghibli-subtitle {
            font-size: clamp(1rem, 3vw, 1.5rem);
            color: #ffffff;
            font-weight: 500;
            letter-spacing: 1px;
            text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
          }
          
          .loading-text {
            font-size: 1.2rem;
            color: #ffffff;
            margin-top: 1rem;
            font-weight: 500;
            letter-spacing: 1px;
            text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
            animation: pulse 2s infinite;
          }
        `}</style>
      </div>
    </>
  );
};

export default LoadingPage;
