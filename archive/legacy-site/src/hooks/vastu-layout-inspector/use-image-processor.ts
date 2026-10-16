import { useCallback } from "react";

export const useImageProcessor = (
  onImageLoad: (imageSrc: string, width: number, height: number) => void,
) => {
  const processImageFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;

        // Create an image element to get dimensions
        const img = new Image();
        img.onload = () => {
          onImageLoad(imageSrc, img.width, img.height);
        };
        img.src = imageSrc;
      };
      reader.readAsDataURL(file);
    },
    [onImageLoad],
  );

  return {
    processImageFile,
  };
};
