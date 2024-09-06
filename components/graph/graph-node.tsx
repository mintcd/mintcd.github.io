import { useState, useEffect } from 'react';
import Latex from '@components/latex';
import { breakLinesForCircle } from '@functions/graph-analysis';

export default function GraphNode({
  vertex,
  radius,
  fontSize,
  isClicked,
  onNodeClick,
}: {
  vertex: Vertex;
  radius: number;
  fontSize: number;
  isClicked: boolean;
  onNodeClick: (v: Vertex) => void;
}) {
  const [opacity, setOpacity] = useState(0.7);

  useEffect(() => {
    // Change opacity based on the clicked state
    setOpacity(isClicked ? 1 : 0.7);
  }, [isClicked]);

  return (
    <g className="node">
      <circle
        className="shape"
        r={radius}
        stroke="none"
        fill={vertex.color}
        style={{ opacity }}
        onClick={() => onNodeClick(vertex)} // Handle click event
      />
      <foreignObject
        style={{ width: 2 * radius, height: 2 * radius }}
        x={-radius}
        y={-radius}
      >
        <div
          className="text-center w-full hover:font-bold hover:cursor-pointer"
          style={{ color: 'white', fontSize: `${fontSize}px` }}
          onClick={() => onNodeClick(vertex)}
        >
          {breakLinesForCircle(vertex, radius).map((line, i) => (
            <Latex key={i}>{line}</Latex>
          ))}
        </div>
      </foreignObject>
    </g>
  );
}
