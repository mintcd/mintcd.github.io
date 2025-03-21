// import Latex from '@components/atoms/latex';
// import { breakLinesForCircle } from '../functions';
// // import { statementProps } from '@styles/statement-props';

// import "@styles/global.css"

// export default function Vertex({ vertex, radius, fontSize = radius / 3 }
//   : {
//     vertex: Vertex,
//     radius: number,
//     fontSize?: number,
//   }) {


//   return (
//     <g
//       className={`node node-${vertex.key} hover:cursor-pointer`}
//     >
//       <circle
//         className="shape"
//         r={radius}
//         stroke="none"
//         fill={vertex.color ?? 'gray'}
//       />
//       <foreignObject
//         width={2 * radius}
//         height={2 * radius}
//         x={-radius}
//         y={-radius}
//       >
//         <div className={``}
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '100%',
//             height: '100%',
//             color: 'white',
//             fontSize: fontSize
//           }}
//         >
//           {breakLinesForCircle(String(vertex.content), radius, fontSize).map((line, i) => (
//             <Latex key={i}>{line}</Latex>
//           ))}
//         </div>
//       </foreignObject>
//     </g>
//   );
// };