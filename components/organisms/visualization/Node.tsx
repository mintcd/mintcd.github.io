import Latex from '@components/atoms/latex';
import styles from '@styles/styles';

import "@styles/global.css"
import { breakLines } from './functions';
import TextField from '@components/atoms/text-field';

type VertexRendering = {
  id: number | string,
  x: number,
  y: number
  shape?: 'rect' | 'circ'
  width?: number;
  height?: number;
  radius?: number;
  label: string;
  fontSize?: number;
  className?: string;
  color?: string;
  editing?: boolean;

  onUpdate?: (value: string) => void;
}

export default function Node({
  id, shape = 'circ', x, y, width = 200, height = 20, radius = 0, label = "", fontSize = styles.fontSize,
  color = "#E3E7EE",
  editing = false,
  onUpdate = () => { }
}: VertexRendering) {

  // function handleKeyDown(e: React.KeyboardEvent, value: string) {
  //   if (e.key === 'Enter') {
  //     onUpdate({ content: [value] });
  //   }
  // }


  return (
    <g
      className={`node hover:cursor-pointer`}
      id={`node-${id}`}
      transform={`translate(${x}, ${y})`}
    >
      {shape === 'circ' &&
        <circle
          className="shape"
          r={radius}
          stroke="none"
          fill={color}
        />
      }

      {shape === 'rect' &&
        <rect
          className="shape"
          width={width}
          height={height}
          fill={color || 'white'}
          rx={2}
          ry={2}
        />
      }

      <foreignObject
        width={shape === 'circ' ? radius * 2 : width}
        height={shape === 'circ' ? radius * 2 : height}
        x={shape === 'circ' ? -radius : 0}
        y={shape === 'circ' ? -radius : 0}
      >
        {editing ?
          <TextField
            mode='edit'
            value={label}
            // onKeyDown={(e, value) => handleKeyDown(e, value)}
            onSubmit={(value) => onUpdate(value)}
          />

          : <div className={``}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              color: 'white',
              fontSize: fontSize
            }}
          >
            {breakLines(String(label), shape = shape, width = shape === 'circ' ? radius * 2 : width).map((line, i) => (
              <Latex key={i}>{line}</Latex>
            ))}
          </div>
        }
      </foreignObject>
    </g>
  );
};