import { getTextWidth } from "./text-analysis";
import dagre from 'dagre';

export function initiateLayout(vertices: Vertex[], width: number, height: number) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setGraph({
    rankdir: 'TB',
    nodesep: 10,
    edgesep: 10,
    ranksep: 10,
  });

  vertices.forEach((vertex: Vertex) => {
    dagreGraph.setNode(vertex.key, {
      width: width,
      height: height,
      ...vertex,
    });
  });

  const edges = getEdges(vertices)

  edges.forEach((edge: Edge) => {
    dagreGraph.setEdge(edge.source, edge.target, {
      ...edge,
    });
  });

  dagre.layout(dagreGraph)

  vertices = vertices.map((vertex: Vertex) => ({
    ...vertex,
    x: dagreGraph.node(vertex.key).x,
    y: dagreGraph.node(vertex.key).y,
  }));
  return vertices
}

export function getVerticesOfTopic(vertices: Vertex[], topics: Field[]) {
  // Helper function to check if a vertex contains at least one of the specified topics
  const hasAnyTopic = (vertex: Vertex, topics: Field[]) => {
    if (!vertex.fields) return false;
    return topics.some((topic) => vertex.fields && vertex.fields.includes(topic));
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
  if (graph.edges === undefined) {
    graph.edges = getEdges(graph.vertices)
  }

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

export function computeNodeDepths(terms: Vertex[]): Vertex[] {
  const termMap = new Map<string, Vertex>();
  const visited = new Set<string>();

  // Create a map of node keys to their corresponding nodes
  terms.forEach(term => {
    termMap.set(term.key, term);
    term.depth = undefined; // Reset depths
  });

  // Depth-First Search function
  function dfs(node: Vertex, depth: number) {
    if (visited.has(node.key)) return;
    visited.add(node.key);

    node.depth = Math.min(node.depth ?? Infinity, depth);

    if (node.parents) {
      node.parents.forEach(parent => {
        const parentNode = termMap.get(parent.key);
        if (parentNode) {
          dfs(parentNode, depth - 1);
        }
      });
    }
  }

  // Start DFS from each node
  terms.forEach(term => {
    if (!visited.has(term.key)) {
      dfs(term, 0);
    }
  });

  // Adjust depths to ensure minimum depth is 0
  const minDepth = Math.min(...Array.from(termMap.values()).map(term => term.depth ?? Infinity));
  terms.forEach(term => {
    if (term.depth !== undefined) {
      term.depth -= minDepth;
    }
  });

  return terms;
}

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

    return {
      ...term,
      lines: lines
    };
  });
}


export function toAdjacencyMatrix(graph: Graph) {
  if (graph.edges === undefined) {
    graph.edges = getEdges(graph.vertices)
  }
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