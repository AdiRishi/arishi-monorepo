import { useState, useEffect, RefObject } from "react";

interface Position {
  x: number;
  y: number;
}

interface DragConstraints {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function useDrag(
  elementRef: RefObject<HTMLElement | null>,
  initialPosition: Position,
  constraints?: DragConstraints,
  resetKey: number = 0,
  onPositionChange?: (position: Position) => void,
) {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const parentRect =
      elementRef.current.parentElement?.getBoundingClientRect();

    if (parentRect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !elementRef.current?.parentElement) return;

    const parentRect = elementRef.current.parentElement.getBoundingClientRect();
    let newX = e.clientX - parentRect.left - dragOffset.x;
    let newY = e.clientY - parentRect.top - dragOffset.y;

    // Apply constraints if provided
    if (constraints) {
      newX = Math.max(constraints.minX, Math.min(constraints.maxX, newX));
      newY = Math.max(constraints.minY, Math.min(constraints.maxY, newY));
    }

    const newPosition = { x: newX, y: newY };
    setPosition(newPosition);
    onPositionChange?.(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Update position when initialPosition changes
  useEffect(() => {
    setPosition(initialPosition);
    onPositionChange?.(initialPosition);
  }, [initialPosition.x, initialPosition.y, resetKey]);

  return {
    position,
    isDragging,
    handleMouseDown,
    setPosition,
  };
}
