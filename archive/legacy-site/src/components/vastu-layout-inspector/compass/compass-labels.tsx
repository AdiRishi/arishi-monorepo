import {
  COMPASS_DIRECTIONS,
  calculateLabelPosition,
  type Position,
} from "@/lib/compass-utils";

interface CompassLabelsProps {
  position: Position;
  containerWidth: number;
  containerHeight: number;
  rotation: number;
}

export default function CompassLabels({
  position,
  containerWidth,
  containerHeight,
  rotation,
}: CompassLabelsProps) {
  return (
    <>
      {COMPASS_DIRECTIONS.map((direction) => {
        const labelPos = calculateLabelPosition(
          direction.angle + rotation,
          position,
          containerWidth,
          containerHeight,
        );

        return (
          <div
            key={`label-${direction.label}`}
            className="pointer-events-none absolute rounded px-2 py-1 text-xs font-bold text-white shadow-md select-none"
            style={{
              left: labelPos.x,
              top: labelPos.y,
              transform: "translate(-50%, -50%)",
              backgroundColor: direction.color,
            }}
            title={direction.name}
          >
            {direction.label}
          </div>
        );
      })}
    </>
  );
}
