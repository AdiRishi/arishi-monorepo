import { useState, useEffect } from "react";

interface ImageData {
  src: string;
  width: number;
  height: number;
}

const STORAGE_KEYS = {
  IMAGE: "vastu-inspector-image",
  IMAGE_SIZE: "vastu-inspector-image-size",
} as const;

export function useImageStorage() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isRestoredFromStorage, setIsRestoredFromStorage] = useState(false);

  // Load image from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem(STORAGE_KEYS.IMAGE);
    const savedImageSize = localStorage.getItem(STORAGE_KEYS.IMAGE_SIZE);

    if (savedImage && savedImageSize) {
      try {
        const size = JSON.parse(savedImageSize);
        setImageData({
          src: savedImage,
          width: size.width,
          height: size.height,
        });
        setIsRestoredFromStorage(true);

        // Clear the indicator after 3 seconds
        setTimeout(() => setIsRestoredFromStorage(false), 3000);
      } catch (error) {
        console.error("Error loading saved image:", error);
        clearStoredImage();
      }
    }
  }, []);

  const saveImage = (src: string, width: number, height: number) => {
    const newImageData = { src, width, height };
    setImageData(newImageData);

    try {
      localStorage.setItem(STORAGE_KEYS.IMAGE, src);
      localStorage.setItem(
        STORAGE_KEYS.IMAGE_SIZE,
        JSON.stringify({ width, height }),
      );
    } catch (error) {
      console.error("Error saving image to localStorage:", error);
      alert(
        "Warning: Unable to save image locally. It may not persist after refresh.",
      );
    }
  };

  const clearStoredImage = () => {
    setImageData(null);
    setIsRestoredFromStorage(false);
    localStorage.removeItem(STORAGE_KEYS.IMAGE);
    localStorage.removeItem(STORAGE_KEYS.IMAGE_SIZE);
  };

  return {
    imageData,
    isRestoredFromStorage,
    saveImage,
    clearStoredImage,
  };
}
