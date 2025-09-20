import { useState, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEYS = {
  ROTATION: "vastu-inspector-rotation",
  COMPASS_POSITION: "vastu-inspector-compass-position",
} as const;

export function useLayoutConfigStorage() {
  const [rotation, setRotation] = useState<number>(0);
  const [compassPosition, setCompassPosition] = useState<Position | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    const savedRotation = localStorage.getItem(STORAGE_KEYS.ROTATION);
    if (savedRotation) {
      setRotation(parseFloat(savedRotation));
    }

    const savedPosition = localStorage.getItem(STORAGE_KEYS.COMPASS_POSITION);
    if (savedPosition) {
      try {
        setCompassPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error("Failed to parse compass position", e);
        localStorage.removeItem(STORAGE_KEYS.COMPASS_POSITION);
      }
    }
    setIsRestored(true);
  }, []);

  const saveRotation = (newRotation: number) => {
    setRotation(newRotation);
    localStorage.setItem(STORAGE_KEYS.ROTATION, newRotation.toString());
  };

  const saveCompassPosition = (newPosition: Position) => {
    setCompassPosition(newPosition);
    localStorage.setItem(
      STORAGE_KEYS.COMPASS_POSITION,
      JSON.stringify(newPosition),
    );
  };

  const clearStoredLayoutConfig = () => {
    setRotation(0);
    setCompassPosition(null);
    localStorage.removeItem(STORAGE_KEYS.ROTATION);
    localStorage.removeItem(STORAGE_KEYS.COMPASS_POSITION);
  };

  return {
    rotation,
    compassPosition,
    isRestored,
    saveRotation,
    saveCompassPosition,
    clearStoredLayoutConfig,
  };
}
