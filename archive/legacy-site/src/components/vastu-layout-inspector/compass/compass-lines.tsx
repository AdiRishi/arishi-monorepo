import {
  COMPASS_DIRECTIONS,
  calculateLineEndPoint,
  type Position,
} from "@/lib/compass-utils";

interface CompassLinesProps {
  position: Position;
  containerWidth: number;
  containerHeight: number;
  rotation: number;
}

export default function CompassLines({
  position,
  containerWidth,
  containerHeight,
  rotation,
}: CompassLinesProps) {
  return (
    <svg
      width={containerWidth}
      height={containerHeight}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
    >
      {COMPASS_DIRECTIONS.map((direction) => {
        const endPoint = calculateLineEndPoint(
          direction.angle + rotation,
          position,
          containerWidth,
          containerHeight,
        );
        return (
          <line
            key={direction.label}
            x1={position.x}
            y1={position.y}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke={direction.strokeColor}
            strokeWidth="3"
            strokeDasharray="8,4"
            opacity="0.8"
          />
        );
      })}
    </svg>
  );
}
