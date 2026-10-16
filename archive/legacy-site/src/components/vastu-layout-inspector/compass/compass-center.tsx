import { COMPASS_SIZE } from "@/lib/compass-utils";
import type { Position } from "@/lib/compass-utils";
import { forwardRef } from "react";

interface CompassCenterProps {
  position: Position;
  onMouseDown: (e: React.MouseEvent) => void;
}

const CompassCenter = forwardRef<HTMLDivElement, CompassCenterProps>(
  ({ position, onMouseDown }, ref) => {
    return (
      <div
        ref={ref}
        className="pointer-events-auto absolute flex cursor-move items-center justify-center rounded-full border-2 border-blue-500 bg-white/80 shadow-md hover:bg-white/90"
        style={{
          width: COMPASS_SIZE,
          height: COMPASS_SIZE,
          left: position.x - COMPASS_SIZE / 2,
          top: position.y - COMPASS_SIZE / 2,
        }}
        onMouseDown={onMouseDown}
        title="Drag to move compass"
      >
        <div className="h-2 w-2 rounded-full bg-blue-500" />
      </div>
    );
  },
);

CompassCenter.displayName = "CompassCenter";

export default CompassCenter;
