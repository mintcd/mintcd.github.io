import Latex from '@components/latex';
import { statementProps } from '@styles/statement-props';

interface GraphNodeProps {
  vertex: Vertex;
  radius: number;
  fontSize: number;
  shownContent: Vertex | null;
  setShownContent: (vertex: Vertex | null) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  lectureView: boolean;
}

const GraphNode: React.FC<GraphNodeProps> = ({
  vertex,
  radius,
  fontSize,
  shownContent,
  setShownContent,
  setMousePosition,
  lectureView
}) => {
  return (
    <g className="node">
      <circle
        className="shape"
        r={radius}
        stroke="none"
        fill={vertex.color || statementProps[vertex.type].color}
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
          <div
            className={`text-center w-full hover:font-bold hover:cursor-pointer
              ${shownContent && shownContent.name === vertex.name ? 'font-bold' : ''}`}
            onMouseEnter={(event) => {
              if (!lectureView) {
                setShownContent(vertex);
                setMousePosition({
                  x: event.clientX,
                  y: event.clientY,
                });
              }
            }}
            onMouseLeave={() => {
              if (!lectureView) {
                setShownContent(null);
              }
            }}
            onClick={() => {
              if (vertex.href && !lectureView) {
                window.open(vertex.href, '_blank');
              } else {
                setShownContent(vertex);
              }
            }}
          >
            {vertex.lines &&
              vertex.lines.map((line, i) => (
                <Latex key={i}>{line}</Latex>
              ))}
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default GraphNode;