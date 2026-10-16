import { useState, useEffect, RefObject } from "react";

interface ContainerSize {
  width: number;
  height: number;
}

export function useContainerSize(
  containerRef: RefObject<HTMLElement | null>,
  dependencies: unknown[] = [],
) {
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 800,
    height: 600,
  });

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);

    return () => window.removeEventListener("resize", updateContainerSize);
  }, dependencies);

  return containerSize;
}
