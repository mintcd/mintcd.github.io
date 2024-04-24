export function extractEdges(vertices: Term[]) {
  const edges: Relation[] = [];

  // Iterate over each vertex
  vertices.forEach(vertex => {
    // If the vertex has children
    if (vertex.children) {
      // Iterate over each child and create an edge
      vertex.children.forEach(child => {
        edges.push({ source: vertex.name, target: child });
      });
    }
  });

  return edges;
}

export function computeNodeDepths(terms: Term[]): Term[] {
  // Clone the array of terms to avoid modifying the original array
  var newTerms = JSON.parse(JSON.stringify(terms));

  // Function to compute the depth of a single node
  function computeNodeDepth(nodeName: string, depth: number) {
    // Find the node by name
    var node = newTerms.find((term: Term) => term.name === nodeName);

    // If the node is not found, return -1
    if (!node) {
      return -1;
    }

    // Assign the depth to the current node
    node.depth = depth;

    // If the node doesn't have children, return the current depth
    if (!node.children || node.children.length === 0) {
      return depth;
    }

    // Otherwise, compute the depth recursively for each child and return the maximum depth
    var childDepths = node
      .children
      .map((child: string) => computeNodeDepth(child, depth + 1));
    return Math.max(...childDepths);
  }

  // Find the name of the root node
  const rootNodeName = newTerms
    .find((term: Term) =>
      !newTerms
        .some((otherTerm: Term) => otherTerm.children && otherTerm.children.includes(term.name))
    ).name;
  // Start depth computation from the root node
  computeNodeDepth(rootNodeName, 0);

  // Return the new array with updated depth values
  return newTerms;
}