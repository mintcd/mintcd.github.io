import { getBoundingRect } from "@functions/text-analysis";
import { sum } from "lodash";


export function getLayout(
  nodes: TreeNode[], maxNodeWidth: number, viewWidth: number,
  marginX: number = 10, marginY: number = 10, contentGap: number = 10, hierarchyGap = 10
): TreeLayout {

  const layout: TreeLayout = {};
  const hierarchies: { nodeNumber: number, maxHeight: number, y: number }[] = [];
  const cache: Record<number, { parent: number | null, xLeft?: number, xRight?: number }> = { 0: { parent: null, xLeft: 0, xRight: viewWidth } };

  // Cache parent and initialize layout
  nodes.forEach(node => {
    layout[node.id] = {
      width: 0, height: 0, x: 0, y: 0,
      subLayouts: node.content.map(() => ({ width: 0, height: 0, x: 0, y: 0 }))
    };

    node.children.forEach(child => (cache[child] = { parent: node.id }));
  });

  // Compute hierarchy information and subnode dimensions in one pass
  nodes.forEach(node => {
    if (!hierarchies[node.depth]) hierarchies[node.depth] = { nodeNumber: 0, maxHeight: 0, y: 0 };
    hierarchies[node.depth].nodeNumber++;

    node.content.forEach((subnode, i) => {
      const { width, height } = getBoundingRect(subnode, maxNodeWidth);
      layout[node.id].subLayouts[i] = { width, height, x: 0, y: 0 };
    });

    const commonWidth = Math.max(...layout[node.id].subLayouts.map(layout => layout.width))
    node.content.forEach((_, i) => {
      layout[node.id].subLayouts[i].width = commonWidth;
    });
  });

  // Compute width and height of each node
  nodes.forEach(node => {
    const subLayouts = layout[node.id].subLayouts;
    const multipleContent = node.content.length > 1;

    layout[node.id].width = Math.max(...subLayouts.map(s => s.width))
      + (multipleContent ? 2 * marginX : 0);

    layout[node.id].height = sum(subLayouts.map(layout => layout.height))
      + (multipleContent ? (2 * marginY + (node.content.length - 1) * contentGap) : 0);
  });

  // Compute x positions
  nodes.forEach(node => {
    const parent = cache[node.id].parent;

    if (parent !== null) {
      const { xLeft, xRight } = cache[parent];
      const sectionWidth = (xRight! - xLeft!) / nodes[parent].children.length;
      const xLeftNew = xLeft! + sectionWidth * node.order;
      const xRightNew = xLeftNew + sectionWidth;

      cache[node.id] = { parent, xLeft: xLeftNew, xRight: xRightNew };
      layout[node.id].x = (xLeftNew + xRightNew) / 2 - layout[node.id].width / 2

    } else {
      layout[node.id].x = viewWidth / 2
        - layout[node.id].width / 2
        - (node.content.length > 1 ? marginX : 0);
    }
  });

  // Assign maxHeight for each hierarchy
  nodes.forEach(node => {
    hierarchies[node.depth].maxHeight = Math.max(hierarchies[node.depth].maxHeight, layout[node.id].height);
  });

  // Compute y positions for hierarchies in one pass
  hierarchies.reduce((prevY, h, index) => {
    h.y = prevY + (index === 0 ? 0 : hierarchies[index - 1].maxHeight + 2 * hierarchyGap);
    return h.y;
  }, 0);

  // Assign y positions to nodes
  nodes.forEach(node => {
    layout[node.id].y = hierarchies[node.depth].y;
  });

  // Assign x and y positions for subnodes
  nodes.forEach(node => {
    layout[node.id].subLayouts.reduce((prevY, subLayout, index) => {
      subLayout.x = layout[node.id].x + (node.content.length > 1 ? marginX : 0);
      subLayout.y = index === 0 ? layout[node.id].y + (node.content.length > 1 ? marginY : 0)
        : prevY + layout[node.id].subLayouts[index - 1].height + contentGap;
      return subLayout.y;
    }, 0);
  });

  return layout;
}

export function createNode(content: string, maxWidth: number): SubNode {
  const { width, height } = getBoundingRect(content, maxWidth);
  console.log(content, maxWidth, width, height)
  return {
    content: content,
    width: width,
    height: height,
    x: 0,
    y: 0
  }
}


export const getEdges = function (nodes: TreeNode[]) {
  const edges: TreeEdge[] = [];

  nodes.forEach(v => {
    v.children?.forEach(childId => {
      edges.push({ source: v.id, target: childId });
    })
  })

  return edges;
};

// export function initiateLayout(vertices: Vertex[]) {
//   const depthDistribution = function () {

//     // Create a map to count nodes at each depth
//     const hierarchies: { [key: number]: number } = {};

//     vertices.forEach((node) => {
//       const depth = node.depth || 0;
//       hierarchies[depth] = (hierarchies[depth] || 0) + 1;
//     });

//     return hierarchies;
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

export function getHierarchies(vertices: TreeNode[]) {
  const hierarchies: { [key: number]: { id: number, length: number } } = {}
  vertices.forEach(v => {
    hierarchies[v.depth] = {
      id: v.id,
      length: v.content.length
    }
  })
}

export function hierarchies(vertices: TreeNode[], depth: number): number {
  return vertices.filter(v => v.depth === depth).length
}
