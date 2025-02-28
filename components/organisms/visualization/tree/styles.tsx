export default function GraphStyles({ markerSize = 6 }: { markerSize?: number }) {
  return (
    <g>
      <defs>
        <linearGradient id="definition-theorem" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0288d1" />
          <stop offset="100%" stopColor="#5bb561" />
        </linearGradient>
      </defs>


      <defs>
        <marker id="arrow-end"
          viewBox={`0 -${markerSize / 2} ${markerSize} ${markerSize}`}
          refX={`${markerSize}`}
          markerWidth={`${markerSize}`}
          markerHeight={`${markerSize}`}
          orient="auto">
          <path d={`M0,-${markerSize / 2}L${markerSize},0L0,${markerSize / 2}Z`}
            fill="#aaa" />
        </marker>

        <marker id="arrow-start"
          viewBox={`0 -${markerSize / 2} ${markerSize} ${markerSize}`}
          refX="0"  // Change this to 0 so the arrow aligns properly at the start
          markerWidth={`${markerSize}`}
          markerHeight={`${markerSize}`}
          orient="auto">
          <path d={`M${markerSize},-${markerSize / 2}L0,0L${markerSize},${markerSize / 2}Z`}
            fill="#aaa" />
        </marker>



        <marker id="arrow-specializes"
          viewBox="0 -${markerSize / 2} ${markerSize} ${markerSize}"
          refX={`${markerSize}`}
          markerWidth={`${markerSize}`}
          markerHeight={`${markerSize}`}
          orient="auto">
          <path d={`M0,-${markerSize / 2}L${markerSize / 2},0L0,${markerSize / 2}L-${markerSize / 2},0Z`}
            fill="#aaa" />
        </marker>
      </defs>
    </g>

  )
}