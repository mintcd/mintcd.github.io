export default function conrecData(
  levels: number[],
  xRange: number[],
  yRange: number[],
  f: (x: number, y: number) => number,
  epsilon: number = 0.005) {
  const data: Point[][][] = levels.map(() => []);
  const fPoint = pointFromFunction(f);

  for (let x = xRange[0]; x < xRange[1]; x += xRange[2]) {
    for (let y = yRange[0]; y < yRange[1]; y += yRange[2]) {
      const topLeft = fPoint(x, y);
      const topRight = fPoint(x + xRange[2], y);
      const bottomLeft = fPoint(x, y + yRange[2]);
      const bottomRight = fPoint(x + xRange[2], y + yRange[2]);
      const center = fPoint(x + xRange[2] / 2, y + yRange[2] / 2);

      const triangles = [
        triangleProcess(topLeft, topRight, center, levels, epsilon),
        triangleProcess(topLeft, bottomLeft, center, levels, epsilon),
        triangleProcess(topRight, bottomRight, center, levels, epsilon),
        triangleProcess(bottomLeft, bottomRight, center, levels, epsilon)
      ];

      triangles.forEach(triangle => {
        if (triangle) data[triangle.levelIndex].push(triangle.line);
      });
    }
  }

  return data.map(levelData => [...new Set(levelData.map(item => JSON.stringify(item)))].map(item => JSON.parse(item)));
}


export function triangleProcess(A: Point, B: Point, C: Point, levels: number[], epsilon: number = 0.01): {
  levelIndex: number,
  line: Point[]
} | null {
  // Choose one level
  const maxAbsDiffs = levels.map(level => Math.max(Math.abs(level - A.z), Math.abs(level - B.z), Math.abs(level - C.z)))
  const minOfMaxAbsDiffs = Math.min(...maxAbsDiffs)
  const levelIndex = maxAbsDiffs.findIndex(diff => diff === minOfMaxAbsDiffs) as number
  const level = levels[levelIndex]

  // Level test
  // console.log(A.z, B.z, C.z, level) 

  const diff = { A: A.z - level, B: B.z - level, C: C.z - level }
  const state = {
    A: {
      on: Math.abs(diff.A) < epsilon,
      above: diff.A > epsilon,
      below: diff.A < -epsilon,
    },
    B: {
      on: Math.abs(diff.B) < epsilon,
      above: diff.B > epsilon,
      below: diff.B < -epsilon,
    },
    C: {
      on: Math.abs(diff.B) < epsilon,
      above: diff.B > epsilon,
      below: diff.B < -epsilon,
    }
  }
  let line: Point[] = []
  // If two points lie on the level, draw a line between them
  if (state.A.on && state.B.on) {
    line = [A, B]
  } else if (state.B.on && state.C.on) {
    line = [B, C]
  } else if (state.A.on && state.C.on) {
    line = [A, C]
  }
  // If one point on a side and other points on other side, draw a line cutting edges using linear interpolation
  else if (state.A.above && state.B.below && state.C.below
    || state.A.below && state.B.above && state.C.above
  ) {
    line = [interpolate(A, B, level), interpolate(A, C, level)]
  }
  else if (state.A.below && state.B.above && state.C.below
    || state.A.above && state.B.below && state.C.above
  ) {
    line = [interpolate(B, A, level), interpolate(B, C, level)]
  }
  else if (state.A.below && state.B.below && state.C.above
    || state.A.above && state.B.above && state.C.below
  ) {
    line = [interpolate(C, A, level), interpolate(C, B, level)]
  }

  return line.length !== 0 ? { levelIndex: levelIndex, line: line } : null
}


function interpolate(A: Point, B: Point, level: number) {
  // Find lambda such that lambda A.z + (1-lambda) B.z = level
  const lambda = (level - B.z) / (A.z - B.z)
  return {
    x: lambda * A.x + (1 - lambda) * B.x,
    y: lambda * A.y + (1 - lambda) * B.y,
    z: level
  }
}

const pointFromFunction = (f: (x: number, y: number) => number) => {
  return (x: number, y: number) => ({
    x: x, y: y, z: f(x, y)
  })
}
