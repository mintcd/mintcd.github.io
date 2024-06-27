import { getTextWidth } from "./text-analysis";

export function getVerticesOfTopic(vertices: Vertex[], topics: string[]) {
  // Helper function to check if a vertex contains at least one of the specified topics
  const hasAnyTopic = (vertex: Vertex, topics: string[]) => {
    if (!vertex.fields) return false;
    return topics.some(topic => vertex.fields && vertex.fields.includes(topic));
  };

  // Filter vertices that have at least one of the specified topics
  const filteredVertices = vertices.filter((vertex: Vertex) => hasAnyTopic(vertex, topics));
  const filteredVertexKeys = new Set(filteredVertices.map((vertex: Vertex) => vertex.key));

  for (const vertex of filteredVertices) {
    if (vertex.parents) {
      for (const parent of vertex.parents) {
        if (!filteredVertexKeys.has(parent.key)) {
          const parentVertex = vertices.find((vertex: Vertex) => vertex.key === parent.key);
          if (parentVertex) {
            filteredVertices.push(parentVertex);
            filteredVertexKeys.add(parentVertex.key);
          }
        }
      }
    }
  }
  return filteredVertices;
}



export function getEdges(vertices: Vertex[]): Edge[] {
  let edges: Edge[] = [];

  vertices.forEach(vertex => {
    if (vertex.parents && vertex.parents.length > 0) {
      vertex.parents.forEach(parent => {
        edges.push({
          source: parent.key,
          target: vertex.key ? vertex.key : '',
          relation: parent.relation
        });
      });
    }

    edges = edges.filter(function (edge) {
      return vertices.map(vertex => vertex.key).includes(edge.source)
    })

    return edges

  });

  return edges;
}

export function computeGraphDepth(graph: Graph, vertexName?: string): number {
  if (vertexName === undefined) {
    const targetVertices = graph.edges.map(edge => edge.target);
    vertexName = graph.vertices.filter(vertex => !targetVertices.includes(vertex.name))[0].name;
  }
  // console.log(vertexName)
  // Find all edges where the current vertex is the source
  const outgoingEdges = graph.edges.filter(edge => edge.source === vertexName);
  // console.log(graph.edges)
  // If no outgoing edges, the depth is 0
  if (outgoingEdges.length === 0) {
    return 0;
  }

  // Compute depth of each target vertex and find the maximum depth
  let maxDepth = 0;
  for (const edge of outgoingEdges) {
    const depth = 1 + computeGraphDepth(graph, edge.target);
    if (depth > maxDepth) {
      maxDepth = depth;
    }
  }
  return maxDepth;
}

// export function computeNodeDepths(terms: Vertex[]): Vertex[] {
//   // Create a map of node names to their corresponding nodes
//   const termMap = new Map<string, Vertex>();
//   terms.forEach(term => termMap.set(term.name, term));

//   // Iterate over each node to compute its depth iteratively
//   terms.forEach(term => {
//     const stack = [{ node: term.name, depth: term.depth ?? 0 }];

//     while (stack.length > 0) {
//       const { node, depth } = stack.pop()!;
//       const currentNode = termMap.get(node)!;

//       // Update the depth of the current node
//       if (currentNode.depth === undefined || depth < currentNode.depth) {
//         currentNode.depth = depth;
//       }

//       // Add parents of the current node to the stack with increased depth
//       if (currentNode.parents) {
//         currentNode.parents.forEach(parentName => {
//           stack.push({ node: parentName, depth: depth - 1 });
//         });
//       }
//     }
//   });

//   const depths = terms.map(term => term.depth).filter(depth => depth !== undefined) as number[];
//   const minDepth = Math.min(...depths);

//   terms.forEach(term => {
//     term.depth = term.depth !== undefined ? term.depth - minDepth : term.depth
//   })

//   // Last adjust to ensure minimum depth is 0 and correct depth based on parents
//   terms.forEach(term => {
//     if (term.parents) {
//       const parentDepths = term.parents
//         .map(parent => terms.find(t => t.name === parent)?.depth)
//         .filter((depth): depth is number => depth !== undefined);

//       if (parentDepths.length > 0) {
//         term.depth = Math.min(...parentDepths) + 1;
//       }
//     }
//   });
//   return terms;
// }

export function breakLines(terms: Vertex[], maxWidth: number, fontSize: number, fontFamily: string): Vertex[] {
  return terms.map(term => {
    // Split the text into lines based on the maximum width
    const lines: string[] = [];
    let currentLine = term.name.split(` `)[0];

    for (let i = 1; i < term.name.split(` `).length; i++) {
      const word = term.name.split(` `)[i];
      const testLine = currentLine + ` ` + word;
      const testWidth = getTextWidth(testLine, fontSize, fontFamily);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return {
      ...term,
      lines: lines
    };
  });
}


export function breakLinesForCircle(terms: Vertex[], radius: number, fontSize: number, fontFamily: string): Vertex[] {
  return terms.map(term => {
    // Split the text into lines based on the maximum width at each height
    const lines: string[] = [];
    const words = term.name.split(' ');
    let currentLine = words[0];
    let currentHeight = -radius + fontSize / 2; // Start from the top of the circle
    let lineIndex = 0;

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;
      const testWidth = getTextWidth(testLine, fontSize, fontFamily);
      const maxWidth = 2 * Math.sqrt(radius * radius - (currentHeight + lineIndex * fontSize) * currentHeight + lineIndex * fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
        lineIndex++;
      }
    }
    lines.push(currentLine);
    return {
      ...term,
      lines: lines
    };
  });
}

export function toAdjacencyMatrix(graph: Graph) {
  const adjacencyMatrix: number[][] = [];
  const nameToIndex: Record<string, number> = {};
  graph.vertices.forEach((vertex, i) => {
    nameToIndex[vertex.name] = i;
    adjacencyMatrix[i] = new Array(graph.vertices.length).fill(0);
  });
  graph.edges.forEach(edge => {
    const sourceIndex = nameToIndex[edge.source];
    const targetIndex = nameToIndex[edge.target];
    adjacencyMatrix[sourceIndex][targetIndex] = 1;
    adjacencyMatrix[targetIndex][sourceIndex] = 1;
  });

  return adjacencyMatrix
}