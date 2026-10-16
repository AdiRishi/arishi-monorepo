"use client";

import ImageUpload from "@/components/vastu-layout-inspector/image-upload";
import AnalysisHeader from "@/components/vastu-layout-inspector/layout-analysis/analysis-header";
import ImageContainer from "@/components/vastu-layout-inspector/layout-analysis/image-container";
import InstructionsPanel from "@/components/vastu-layout-inspector/layout-analysis/instructions-panel";
import { useContainerSize } from "@/hooks/vastu-layout-inspector/use-container-size";
import { useImageStorage } from "@/hooks/vastu-layout-inspector/use-image-storage";
import { useLayoutConfigStorage } from "@/hooks/vastu-layout-inspector/use-layout-config-storage";
import { toPng } from "html-to-image";
import { useCallback, useRef, useState } from "react";

export default function VastuLayoutInspectorPage() {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [resetKey, setResetKey] = useState(0);
  const { imageData, saveImage, clearStoredImage } = useImageStorage();
  const {
    rotation,
    compassPosition,
    isRestored,
    saveRotation,
    saveCompassPosition,
    clearStoredLayoutConfig,
  } = useLayoutConfigStorage();
  const containerSize = useContainerSize(imageContainerRef, [imageData]);

  const handleImageLoad = (src: string, width: number, height: number) => {
    saveImage(src, width, height);
    clearStoredLayoutConfig(); // Reset layout when new image is loaded
  };

  const handleImageRemove = () => {
    clearStoredImage();
    clearStoredLayoutConfig();
  };

  const handleResetCompass = () => {
    // Increment reset key to force compass to re-render with initial position
    setResetKey((prev) => prev + 1);
    saveRotation(0);
    // Clearing position will reset it to center
    saveCompassPosition({
      x: containerSize.width / 2,
      y: containerSize.height / 2,
    });
  };

  const handleRotationChange = (newAngle: number) => {
    saveRotation(newAngle);
  };

  const handleDownloadImage = useCallback(() => {
    if (imageContainerRef.current === null) {
      return;
    }

    toPng(imageContainerRef.current, { cacheBust: true })
      .then((dataUrl: string) => {
        const link = document.createElement("a");
        link.download = "vastu-layout.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err: Error) => {
        console.error("oops, something went wrong!", err);
      });
  }, [imageContainerRef]);

  const getInitialCompassPosition = () => {
    if (compassPosition) {
      return compassPosition;
    }
    if (containerSize.width && containerSize.height) {
      return { x: containerSize.width / 2, y: containerSize.height / 2 };
    }
    // Default fallback, though containerSize should be available
    return { x: 250, y: 250 };
  };

  if (!isRestored) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Vastu Layout Inspector
          </h1>
          <p className="text-gray-600">
            Upload an image and use the draggable compass to analyze directional
            layout
          </p>
        </header>

        {!imageData ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <ImageUpload
              onImageLoad={handleImageLoad}
              onImageRemove={handleImageRemove}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <AnalysisHeader
              onResetCompass={handleResetCompass}
              onRemoveImage={handleImageRemove}
              onDownloadImage={handleDownloadImage}
              rotation={rotation}
              onRotationChange={handleRotationChange}
            />

            <ImageContainer
              ref={imageContainerRef}
              imageSrc={imageData.src}
              containerWidth={containerSize.width}
              containerHeight={containerSize.height}
              resetKey={resetKey}
              rotation={rotation}
              onRotationChange={handleRotationChange}
              onPositionChange={saveCompassPosition}
              initialCompassPosition={getInitialCompassPosition()}
            />

            <InstructionsPanel />
          </div>
        )}
      </div>
    </div>
  );
}
