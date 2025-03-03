import React from 'react';

export default function Edge({ source, target, type }: {
  source: Layout,
  target: Layout,
  type?: string,
}) {

  return (
    <line
      className='link'
      x1={source.x + source.width / 2}
      y1={source.y + source.height}
      x2={target.x + target.width / 2}
      y2={target.y}
      stroke={type === 'specializes' ? '#aaa' : '#aaa'}
      markerStart='url(#arrow-start)'
      strokeWidth={1}
    />

  );
}
