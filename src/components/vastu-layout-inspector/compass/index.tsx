"use client";

import { useDrag } from "@/hooks/vastu-layout-inspector/use-drag";
import { useRotation } from "@/hooks/vastu-layout-inspector/use-rotation";
import { COMPASS_SIZE } from "@/lib/compass-utils";
import { useRef } from "react";
import CompassCenter from "./compass-center";
import CompassLabels from "./compass-labels";
import CompassLines from "./compass-lines";
import RotationHandle from "./rotation-handle";

interface CompassProps {
  containerWidth: number;
  containerHeight: number;
  initialX?: number;
  initialY?: number;
  resetKey: number;
  rotation: number;
  onRotationChange: (newAngle: number) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export default function Compass({
  containerWidth,
  containerHeight,
  initialX = 50,
  initialY = 50,
  resetKey,
  rotation,
  onRotationChange,
  onPositionChange,
}: CompassProps) {
  const compassRef = useRef<HTMLDivElement>(null);
  const stableContainerRef = useRef<HTMLDivElement>(null);

  const { position, handleMouseDown: handleDragMouseDown } = useDrag(
    compassRef,
    { x: initialX, y: initialY },
    {
      minX: COMPASS_SIZE / 2,
      maxX: containerWidth - COMPASS_SIZE / 2,
      minY: COMPASS_SIZE / 2,
      maxY: containerHeight - COMPASS_SIZE / 2,
    },
    resetKey,
    onPositionChange,
  );

  const { handleMouseDown: handleRotateMouseDown } = useRotation(
    stableContainerRef,
    position,
    onRotationChange,
  );

  return (
    <div
      ref={stableContainerRef}
      className="pointer-events-none absolute inset-0 select-none"
    >
      <div
        className="absolute inset-0"
        style={
          {
            // transform: `rotate(${rotation}deg)`,
            // transformOrigin: `${position.x}px ${position.y}px`,
          }
        }
      >
        <CompassLines
          position={position}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          rotation={rotation}
        />

        <CompassCenter
          ref={compassRef}
          position={position}
          onMouseDown={handleDragMouseDown}
        />
        <RotationHandle
          position={position}
          onMouseDown={handleRotateMouseDown}
          rotation={rotation}
        />

        <CompassLabels
          position={position}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          rotation={rotation}
        />
      </div>
    </div>
  );
}
