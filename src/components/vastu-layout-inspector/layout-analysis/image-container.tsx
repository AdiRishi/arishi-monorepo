import Compass from "@/components/vastu-layout-inspector/compass";
import { forwardRef } from "react";

interface ImageContainerProps {
  imageSrc: string;
  containerWidth: number;
  containerHeight: number;
  resetKey: number;
  rotation: number;
  onRotationChange: (newAngle: number) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  initialCompassPosition: { x: number; y: number };
}

const ImageContainer = forwardRef<HTMLDivElement, ImageContainerProps>(
  (
    {
      imageSrc,
      containerWidth,
      containerHeight,
      resetKey,
      rotation,
      onRotationChange,
      onPositionChange,
      initialCompassPosition,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 select-none"
        style={{
          width: "100%",
          height: "70vh",
          minHeight: "500px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Uploaded layout"
          className="h-full w-full object-contain select-none"
          style={{
            imageRendering: "crisp-edges",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
          draggable={false}
        />

        <Compass
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          initialX={initialCompassPosition.x}
          initialY={initialCompassPosition.y}
          resetKey={resetKey}
          rotation={rotation}
          onRotationChange={onRotationChange}
          onPositionChange={onPositionChange}
        />
      </div>
    );
  },
);

ImageContainer.displayName = "ImageContainer";

export default ImageContainer;
