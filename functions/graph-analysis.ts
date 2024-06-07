import { getTextWidth } from "./text-analysis";

export function extractEdges(vertices: Vertex[]) {
  const edges: Edge[] = [];

  // Iterate over each vertex
  vertices.forEach(vertex => {
    // If the vertex has children
    if (vertex.parents) {
      // Iterate over each child and create an edge
      vertex.parents.forEach(parent => {
        edges.push({ source: parent, target: vertex.name });
      });
    }
  });

  return edges;
}

export function computeNodeDepths(terms: Vertex[]): Vertex[] {
  // Create a map of node names to their corresponding nodes
  const termMap = new Map<string, Vertex>();
  terms.forEach(term => termMap.set(term.name, term));

  // Iterate over each node to compute its depth iteratively
  terms.forEach(term => {
    const stack = [{ node: term.name, depth: term.depth ?? 0 }];

    while (stack.length > 0) {
      const { node, depth } = stack.pop()!;
      const currentNode = termMap.get(node)!;

      // Update the depth of the current node
      if (currentNode.depth === undefined || depth < currentNode.depth) {
        currentNode.depth = depth;
      }

      // Add parents of the current node to the stack with increased depth
      if (currentNode.parents) {
        currentNode.parents.forEach(parentName => {
          stack.push({ node: parentName, depth: depth - 1 });
        });
      }
    }
  });

  const depths = terms.map(term => term.depth).filter(depth => depth !== undefined) as number[];
  const minDepth = Math.min(...depths);

  terms.forEach(term => {
    term.depth = term.depth !== undefined ? term.depth - minDepth : term.depth
  })

  // Last adjust to ensure minimum depth is 0 and correct depth based on parents
  terms.forEach(term => {
    if (term.parents) {
      const parentDepths = term.parents
        .map(parent => terms.find(t => t.name === parent)?.depth)
        .filter((depth): depth is number => depth !== undefined);

      if (parentDepths.length > 0) {
        term.depth = Math.min(...parentDepths) + 1;
      }
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
