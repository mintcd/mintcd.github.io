// import React from 'react';

// export default function GraphLink({ edge, radius }: { edge: Edge, radius: number }) {
//   const { source, target } = edge as any;

//   const x1 = source.x + radius * Math.cos(Math.atan2(target.y - source.y, target.x - source.x));
//   const y1 = source.y + radius * Math.sin(Math.atan2(target.y - source.y, target.x - source.x));
//   const x2 = target.x + radius * Math.cos(Math.atan2(source.y - target.y, source.x - target.x));
//   const y2 = target.y + radius * Math.sin(Math.atan2(source.y - target.y, source.x - target.x));

//   return (
//     <line
//       className='link'
//       x1={x1}
//       y1={y1}
//       x2={x2}
//       y2={y2}
//       stroke={edge.relation === 'specializes' ? '#aaa' : '#aaa'}
//       strokeWidth={radius * 0.03}
//       markerEnd={edge.relation === 'specializes' ? 'url(#arrow-specializes)' : 'url(#arrow)'}
//     />
//   );
// }
