import { getTextWidth } from "@functions/text-analysis";
import dagre from 'dagre';

// export function initiateLayout(vertices: Vertex[], width: number, height: number) {
//   const dagreGraph = new dagre.graphlib.Graph();
//   dagreGraph.setGraph({
//     rankdir: 'TB',
//     nodesep: 5,
//     edgesep: 5,
//     ranksep: 5,
//   });

//   vertices.forEach((vertex: Vertex) => {
//     dagreGraph.setNode(String(vertex.id), {
//       width: width,
//       height: height,
//       ...vertex,
//     });
//   });

//   const edges = getEdges(vertices)

//   edges.forEach((edge: Edge) => {
//     dagreGraph.setEdge(String(edge.source.id), String(edge.target.id), {
//       ...edge,
//     });
//   });

//   dagre.layout(dagreGraph)

//   return vertices.map((vertex: Vertex) => ({
//     ...vertex,
//     x: dagreGraph.node(String(vertex.id)).x,
//     y: dagreGraph.node(String(vertex.id)).y,
//   }));
// }

// export function getEdges(vertices: Vertex[]): Edge[] {
//   let edges: Edge[] = [];

//   vertices.forEach(vertex => {
//     if (vertex.parents && vertex.parents.length > 0) {
//       vertex.parents.forEach(parent => {
//         edges.push({
//           source: parent,
//           target: vertex.name ? vertex.name : '',
//         });
//       });
//     }

//     edges = edges.filter(function (edge) {
//       return vertices.map(vertex => vertex.name).includes(edge.source)
//     })

//     return edges

//   });

//   return edges;
// }

// export function computeGraphDepth(graph: Graph, vertexName?: string): number {
//   if (graph.edges === undefined) {
//     graph.edges = getEdges(graph.vertices)
//   }

//   if (vertexName === undefined) {
//     const targetVertices = graph.edges.map(edge => edge.target);
//     vertexName = graph.vertices.filter(vertex => !targetVertices.includes(vertex.name || " "))[0].name;
//   }
//   // console.log(vertexName)
//   // Find all edges where the current vertex is the source
//   const outgoingEdges = graph.edges.filter(edge => edge.source === vertexName);
//   // console.log(graph.edges)
//   // If no outgoing edges, the depth is 0
//   if (outgoingEdges.length === 0) {
//     return 0;
//   }

//   // Compute depth of each target vertex and find the maximum depth
//   let maxDepth = 0;
//   for (const edge of outgoingEdges) {
//     const depth = 1 + computeGraphDepth(graph, edge.target);
//     if (depth > maxDepth) {
//       maxDepth = depth;
//     }
//   }
//   return maxDepth;
// }

// export function computeNodeDepths(terms: Vertex[]): Vertex[] {
//   const termMap = new Map<string, Vertex>();
//   const visited = new Set<string>();

//   // Create a map of node keys to their corresponding nodes
//   terms.forEach(term => {
//     termMap.set(term.name, term);
//     term.depth = undefined; // Reset depths
//   });

//   // Depth-First Search function
//   function dfs(node: Vertex, depth: number) {
//     if (visited.has(node.name)) return;
//     visited.add(node.name);

//     node.depth = Math.min(node.depth ?? Infinity, depth);

//     if (node.parents) {
//       node.parents.forEach(parent => {
//         const parentNode = termMap.get(parent);
//         if (parentNode) {
//           dfs(parentNode, depth - 1);
//         }
//       });
//     }
//   }

//   // Start DFS from each node
//   terms.forEach(term => {
//     if (!visited.has(term.name)) {
//       dfs(term, 0);
//     }
//   });

//   // Adjust depths to ensure minimum depth is 0
//   const minDepth = Math.min(...Array.from(termMap.values()).map(term => term.depth ?? Infinity));
//   terms.forEach(term => {
//     if (term.depth !== undefined) {
//       term.depth -= minDepth;
//     }
//   });

//   return terms;
// }

// export function breakLines(terms: Vertex[], maxWidth: number, fontSize: number, fontFamily: string): Vertex[] {
//   return terms.map(term => {
//     // Split the text into lines based on the maximum width
//     const lines: string[] = [];
//     let currentLine = term.name.split(` `)[0];

//     for (let i = 1; i < term.name.split(` `).length; i++) {
//       const word = term.name.split(` `)[i];
//       const testLine = currentLine + ` ` + word;
//       const testWidth = getTextWidth(testLine, fontSize, fontFamily);

//       if (testWidth <= maxWidth) {
//         currentLine = testLine;
//       } else {
//         lines.push(currentLine);
//         currentLine = word;
//       }
//     }
//     lines.push(currentLine);
//     return {
//       ...term,
//       lines: lines
//     };
//   });
// }


export function breakLinesForCircle(text: string, width: number, fontSize: number = 9, fontFamily: string = "Arial"): string[] {
  const radius = width / 2
  const lines: string[] = [];
  const words = text.split(' ');
  let currentLine = words[0];
  let currentHeight = -radius + fontSize / 2; // Start from the top of the circle
  let lineIndex = 0;

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
    const testWidth = getTextWidth(testLine, fontSize, fontFamily);
    const maxWidth = 2 * Math.sqrt(radius * radius - Math.pow(currentHeight + lineIndex * fontSize, 2));

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
      lineIndex++;
      currentHeight += fontSize; // Update the height for the next line

      if (currentHeight + lineIndex * fontSize >= radius) {
        break; // Stop if the text exceeds the circle's height
      }
    }
  }
  if (currentHeight + lineIndex * fontSize < radius) {
    lines.push(currentLine);
  } else {
    // Truncate text with ellipses
    const lastLine = lines.pop() || '';
    const availableWidth = 2 * Math.sqrt(radius * radius - Math.pow(currentHeight + lineIndex * fontSize, 2));
    let truncated = '';
    for (let j = 0; j < lastLine.length; j++) {
      truncated += lastLine[j];
      if (getTextWidth(truncated + '...', fontSize, fontFamily) > availableWidth) {
        truncated = truncated.slice(0, -1);
        break;
      }
    }
    lines.push(truncated + '...');
  }
  return lines
}

export function breakLinesForRectangle(text: string, width: number, fontSize: number = 9, fontFamily: string = "Arial"): string[] {

  const lines: string[] = [];
  const endlineSplits = text.split('\n')

  endlineSplits.forEach(line => {
    const words = line.split(" ")

    let currentLine = "";
    words.forEach(word => {
      const testLine = currentLine.length > 0 ? currentLine + ` ` + word : word;
      const testWidth = getTextWidth(testLine, fontSize, fontFamily);

      if (testWidth <= width) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    })
    lines.push(currentLine)
  })

  return lines
}

export function breakLines(
  text: string,
  shape: 'rect' | 'circ',
  width: number,
  fontSize: number = 9,
  fontFamily: string = "Arial"
): string[] {
  const lines: string[] = [];
  const words = text.split(' ');

  if (shape === 'rect') {
    let currentLine = "";
    words.forEach(word => {
      const testLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;
      const testWidth = getTextWidth(testLine, fontSize, fontFamily);

      if (testWidth <= width) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
  } else if (shape === 'circ') {
    const radius = width / 2;
    let currentLine = words[0];
    let currentHeight = -radius + fontSize / 2;
    let lineIndex = 0;

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = `${currentLine} ${word}`;
      const testWidth = getTextWidth(testLine, fontSize, fontFamily);
      const maxWidth = 2 * Math.sqrt(radius * radius - Math.pow(currentHeight + lineIndex * fontSize, 2));

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
        lineIndex++;
        currentHeight += fontSize;

        if (currentHeight + lineIndex * fontSize >= radius) break;
      }
    }
    if (currentHeight + lineIndex * fontSize < radius) {
      lines.push(currentLine);
    } else {
      const lastLine = lines.pop() || '';
      const availableWidth = 2 * Math.sqrt(radius * radius - Math.pow(currentHeight + lineIndex * fontSize, 2));
      let truncated = '';
      for (let j = 0; j < lastLine.length; j++) {
        truncated += lastLine[j];
        if (getTextWidth(truncated + '...', fontSize, fontFamily) > availableWidth) {
          truncated = truncated.slice(0, -1);
          break;
        }
      }
      lines.push(truncated + '...');
    }
  }

  return lines;
}

// export function toAdjacencyMatrix(graph: Graph) {
//   if (graph.edges === undefined) {
//     graph.edges = getEdges(graph.vertices)
//   }
//   const adjacencyMatrix: number[][] = [];
//   const nameToIndex: Record<string, number> = {};
//   graph.vertices.forEach((vertex, i) => {
//     nameToIndex[vertex.name] = i;
//     adjacencyMatrix[i] = new Array(graph.vertices.length).fill(0);
//   });
//   graph.edges.forEach(edge => {
//     const sourceIndex = nameToIndex[edge.source];
//     const targetIndex = nameToIndex[edge.target];
//     adjacencyMatrix[sourceIndex][targetIndex] = 1;
//     adjacencyMatrix[targetIndex][sourceIndex] = 1;
//   });

//   return adjacencyMatrix
// }