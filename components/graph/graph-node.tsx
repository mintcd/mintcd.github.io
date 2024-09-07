import React from 'react';
import { select } from 'd3-selection';
import Latex from '@components/latex';
import { breakLinesForCircle } from '@functions/graph-analysis';
import { statementProps } from '@styles/statement-props';

import "@styles/global.css"

export default function GraphNode({ vertex, radius, fontSize = radius / 4, selectedNode, setSelectedNode }
  : {
    vertex: Vertex,
    radius: number,
    fontSize?: number,
    selectedNode: Vertex | undefined,
    setSelectedNode: (v: Vertex) => void
  }) {
  return (
    <g
      className={`node node-${vertex.key} hover:cursor-pointer`}
      onClick={() => { setSelectedNode(vertex); }}
    >
      <circle
        className="shape"
        r={radius}
        stroke="none"
        fill={vertex.color || statementProps[vertex.type].color}
      // opacity={vertex.name == selectedNode?.name ? 1 : 0.5}
      />
      <foreignObject
        width={2 * radius}
        height={2 * radius}
        x={-radius}
        y={-radius}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: 'white',
            fontSize: `${fontSize}px`,
          }}
        >
          {breakLinesForCircle(vertex, radius).map((line, i) => (
            <Latex key={i}>{line}</Latex>
          ))}
        </div>
      </foreignObject>
    </g>
  );
};