import { useState, useEffect } from "react";

export default function useTransform(coordinate: Coordinate, ref: React.RefObject<HTMLElement>): {
  left: number,
  top: number
} {
  const [transformedPosition, setTransformedPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!coordinate || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    setTransformedPosition({
      left: rect.left + coordinate.x,
      top: rect.top + coordinate.y
    });
  }, [coordinate]);

  return transformedPosition;
};