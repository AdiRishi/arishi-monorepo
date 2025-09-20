export interface Direction {
  angle: number;
  label: string;
  name: string;
  color: string;
  strokeColor: string;
}

export interface Position {
  x: number;
  y: number;
}

export const COMPASS_DIRECTIONS: Direction[] = [
  {
    angle: 0,
    label: "N",
    name: "North",
    color: "#dc2626",
    strokeColor: "#dc2626",
  }, // Red
  {
    angle: 45,
    label: "NE",
    name: "Northeast",
    color: "#ea580c",
    strokeColor: "#ea580c",
  }, // Orange
  {
    angle: 90,
    label: "E",
    name: "East",
    color: "#d97706",
    strokeColor: "#d97706",
  }, // Amber
  {
    angle: 135,
    label: "SE",
    name: "Southeast",
    color: "#65a30d",
    strokeColor: "#65a30d",
  }, // Lime
  {
    angle: 180,
    label: "S",
    name: "South",
    color: "#059669",
    strokeColor: "#059669",
  }, // Emerald
  {
    angle: 225,
    label: "SW",
    name: "Southwest",
    color: "#0891b2",
    strokeColor: "#0891b2",
  }, // Cyan
  {
    angle: 270,
    label: "W",
    name: "West",
    color: "#7c3aed",
    strokeColor: "#7c3aed",
  }, // Violet
  {
    angle: 315,
    label: "NW",
    name: "Northwest",
    color: "#c026d3",
    strokeColor: "#c026d3",
  }, // Fuchsia
];

export const COMPASS_SIZE = 32;

/**
 * Calculate the end point of a compass line that extends to the container edge
 */
export function calculateLineEndPoint(
  angle: number,
  position: Position,
  containerWidth: number,
  containerHeight: number,
): Position {
  // Convert compass angle to radians (North = 0°, clockwise)
  // In screen coordinates: North = -90° (up), East = 0° (right)
  const radians = (angle - 90) * (Math.PI / 180);
  const dx = Math.cos(radians);
  const dy = Math.sin(radians);

  // Calculate intersection with each edge of the container
  const intersections = [];

  // Top edge (y = 0)
  if (dy < 0) {
    const t = -position.y / dy;
    const x = position.x + t * dx;
    if (x >= 0 && x <= containerWidth) {
      intersections.push({ x, y: 0, distance: t });
    }
  }

  // Bottom edge (y = containerHeight)
  if (dy > 0) {
    const t = (containerHeight - position.y) / dy;
    const x = position.x + t * dx;
    if (x >= 0 && x <= containerWidth) {
      intersections.push({ x, y: containerHeight, distance: t });
    }
  }

  // Left edge (x = 0)
  if (dx < 0) {
    const t = -position.x / dx;
    const y = position.y + t * dy;
    if (y >= 0 && y <= containerHeight) {
      intersections.push({ x: 0, y, distance: t });
    }
  }

  // Right edge (x = containerWidth)
  if (dx > 0) {
    const t = (containerWidth - position.x) / dx;
    const y = position.y + t * dy;
    if (y >= 0 && y <= containerHeight) {
      intersections.push({ x: containerWidth, y, distance: t });
    }
  }

  // Find the closest intersection (smallest positive distance)
  const validIntersections = intersections.filter((i) => i.distance > 0);
  if (validIntersections.length === 0) {
    // Fallback - should not happen
    return { x: position.x, y: position.y };
  }

  const closest = validIntersections.reduce((min, current) =>
    current.distance < min.distance ? current : min,
  );

  return { x: closest.x, y: closest.y };
}

/**
 * Calculate the position for a direction label around the compass
 */
export function calculateLabelPosition(
  angle: number,
  compassPosition: Position,
  containerWidth: number,
  containerHeight: number,
  offset: number = 40,
): Position {
  // Calculate the point on the container edge
  const edgePoint = calculateLineEndPoint(
    angle,
    compassPosition,
    containerWidth,
    containerHeight,
  );

  // Vector from compass center to the edge point
  const vectorX = edgePoint.x - compassPosition.x;
  const vectorY = edgePoint.y - compassPosition.y;

  // Length of the vector (distance to the edge)
  const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

  // Avoid division by zero if length is 0
  if (length === 0) {
    return compassPosition;
  }

  // Normalized direction vector
  const unitVectorX = vectorX / length;
  const unitVectorY = vectorY / length;

  // New length, pulled back from the edge by the offset
  const newLength = length - offset;

  // Calculate the new position
  const newX = compassPosition.x + unitVectorX * newLength;
  const newY = compassPosition.y + unitVectorY * newLength;

  return {
    x: newX,
    y: newY,
  };
}
