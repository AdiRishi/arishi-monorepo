import { type Position } from "@/lib/compass-utils";

interface RotationHandleProps {
  position: Position;
  onMouseDown: (e: React.MouseEvent) => void;
  rotation: number;
}

const HANDLE_OFFSET = 40; // The distance from the center of the compass

export default function RotationHandle({
  position,
  onMouseDown,
  rotation,
}: RotationHandleProps) {
  const angleRad = (rotation - 90) * (Math.PI / 180);
  const x = position.x + HANDLE_OFFSET * Math.cos(angleRad);
  const y = position.y + HANDLE_OFFSET * Math.sin(angleRad);

  const handleStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    transform: "translate(-50%, -50%)",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "rgba(220, 38, 38, 0.9)", // A strong red color
    border: "2px solid white",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
    cursor: "grab",
    pointerEvents: "all",
  };

  return <div style={handleStyle} onMouseDown={onMouseDown} />;
}
