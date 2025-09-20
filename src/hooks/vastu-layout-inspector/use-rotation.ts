import { useState, useEffect, useCallback, RefObject } from "react";

export function useRotation(
  containerRef: RefObject<HTMLElement | null>,
  centerPoint: { x: number; y: number },
  onRotationChange: (rotation: number) => void,
) {
  const [isRotating, setIsRotating] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isRotating || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + centerPoint.x;
      const centerY = rect.top + centerPoint.y;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Calculate angle in radians and then convert to degrees
      // We subtract 90 degrees because 0 degrees is 'North' (up) in our compass
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      onRotationChange(angle + 90);
    },
    [isRotating, centerPoint.x, centerPoint.y, containerRef, onRotationChange],
  );

  const handleMouseUp = useCallback(() => {
    setIsRotating(false);
  }, []);

  useEffect(() => {
    if (isRotating) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isRotating, handleMouseMove, handleMouseUp]);

  return { handleMouseDown };
}
