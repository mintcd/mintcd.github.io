import { breakLines, getTextWidth } from "@functions/text-analysis";
import styles from "@styles/styles";

// export const calculateDepths = function (node: Tree, currentDepth = 0, currentOrder = 0) {
//   // Add depth information to the current node
//   node.depth = currentDepth;
//   node.order = currentOrder;

//   // If the node has children, recursively calculate the depth for them
//   if (node.children && node.children.length > 0) {
//     node.children.forEach((child, index) => calculateDepths(child, currentDepth + 1, index))
//   }

//   return node
// };

export function getBoundingRect(vertex: TreeNode, maxWidth: number, fontSize: number = styles.fontSize) {
  const textWidth = getTextWidth(String(vertex.content))

  if (textWidth < maxWidth) {
    vertex.width = textWidth + 20;
    vertex.height = fontSize * 2;
  } else {
    const lines = breakLines(String(vertex.content), maxWidth, fontSize)
    vertex.width = maxWidth
    vertex.height = lines.length * fontSize * 2
    console.log(lines, vertex.width, vertex.height)
  }



  return vertex
}

export function getPosition(vertex: TreeNode, vertices: TreeNode[], viewWidth: number, layerGap = 100) {
  const sameLevelCount = depthCount(vertices, vertex.depth as number)
  vertex.x = viewWidth / (sameLevelCount + 1) * (vertex.order + 1) - (vertex.width as number) / 2
  vertex.y = (vertex.depth ?? 0) * layerGap;

  vertex.x1 = vertex.shape === 'circ' ? vertex.x : vertex.x + (vertex.width as number) / 2
  vertex.y1 = vertex.shape === 'circ' ? vertex.y : vertex.y + (vertex.height as number)
  vertex.x2 = vertex.shape === 'circ' ? vertex.x : vertex.x + (vertex.width as number) / 2
  vertex.y2 = vertex.shape === 'circ' ? vertex.y - (vertex.height as number) : vertex.y
  return vertex
}

// export const getVertices = function (node: Tree) {
//   const nodeList: Vertex[] = []; // Initialize an empty array to hold the nodes

//   // Recursive helper function to traverse the tree
//   const traverseTree = (currentNode: Tree) => {
//     // Add the current node to the nodeList
//     nodeList.push({
//       ...currentNode,
//       children: currentNode.children?.map(child => child.id)
//     });

//     // If the node has children, recursively traverse each child
//     if (currentNode.children && currentNode.children.length > 0) {
//       for (const child of currentNode.children) {
//         traverseTree(child);
//       }
//     }
//   };

//   // Start traversal from the given root node
//   traverseTree(node);

//   // Return the list of nodes
//   return nodeList;
// };

export const getEdges = function (vertices: TreeNode[]) {
  const edges: TreeEdge[] = [];

  vertices.forEach(v => {
    v.children?.forEach(childId => {
      edges.push({ source: v.id, target: childId });
    })
  })

  return edges;
};

// export function initiateLayout(vertices: Vertex[]) {
//   const depthDistribution = function () {

//     // Create a map to count nodes at each depth
//     const depthCount: { [key: number]: number } = {};

//     vertices.forEach((node) => {
//       const depth = node.depth || 0;
//       depthCount[depth] = (depthCount[depth] || 0) + 1;
//     });

//     return depthCount;
//   }()

//   vertices.forEach(v => {
//     const [width, height] = [v.width ?? 0, v.height ?? 0]

//     v.x = 1000 / (depthDistribution[v.depth as number] + 1) * (v.order as number + 1)
//     v.y = (v.depth ?? 0) * 100;

//     v.x1 = v.shape === 'circ' ? v.x : v.x + width / 2
//     v.y1 = v.shape === 'circ' ? v.y : v.y + height
//     v.x2 = v.shape === 'circ' ? v.x : v.x + width / 2
//     v.y2 = v.shape === 'circ' ? v.y - height : v.y
//   })

//   return vertices
// }

export function depthCount(vertices: Vertex[], depth: number): number {
  return vertices.filter(v => v.depth === depth).length
}
