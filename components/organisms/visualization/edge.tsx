import React from 'react';

export default function Edge({ edge }: { edge: { source: Vertex, target: Vertex, relation?: 'specializes' } }) {
  const { source, target } = edge as any;

  return (
    <line
      className='link'
      id={`link-${source.id}-${target.id}`}
      x1={source.x1}
      y1={source.y1}
      x2={target.x2}
      y2={target.y2}
      stroke={edge.relation === 'specializes' ? '#aaa' : '#aaa'}
      markerStart='url(#arrow-start)'
      strokeWidth={1}
    />

  );
}
