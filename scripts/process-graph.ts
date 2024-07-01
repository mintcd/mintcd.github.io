// const fs = require('fs')
// const path = require('path')
// const dagre = require('dagre')



// let graph = require('../models/knowledge-graph.js')

// type Chapter = {
//   name: string,
//   content?: string,
//   description?: string,
//   sections?: Section[],
//   notations?: string[],
//   statements: Statement[]
// }

// type Statement =
//   {
//     name: string,
//     type: string,
//     parents?: string[],
//     content?: string,
//     proof?: string,
//     implications?: Statement[]
//   }


// type Section = {
//   name: string,
//   content?: string,
//   statements: Vertex[]
// }

// type Graph = {
//   metadata: {
//     edgesIncluded: boolean,
//     depthComputed: boolean,
//     positionInitialized: boolean
//   }
//   vertices: Vertex[],
//   edges: Edge[]
// }

// type Term = {
//   name: string,
//   definition: string,
//   fields: Field[],
//   parent?: string
// }

// type Vertex = {
//   // Basic Properties
//   key: string,
//   name: string,
//   abbreviation?: string,
//   type: StatementType


//   // Graph properties
//   parents: { key: string, relation?: RelationType }[],
//   depth?: number,

//   // Knowledge properties
//   notation?: string[],
//   short?: string,
//   content?: string,
//   examples?: string[]
//   proof?: string,
//   otherNames?: string[],
//   href?: string,
//   implications?: {
//     type: StatementType
//     content: string,
//     proof?: string,
//   }[]

//   // Taxonomy properties
//   fields: Field[],
//   chapter?: string,

//   // Style properties
//   color?: string,
//   lines?: string[],
//   fx?: number,
//   fy?: number,
//   x?: number,
//   y?: number,
//   height?: number,
//   width?: number
// }

// type Edge = {
//   source: string,
//   target: string,
//   relation?: RelationType
// }

// type EdgeCoordinate = {
//   source: VertexCoordinate,
//   target: VertexCoordinate
// }

// type VertexCoordinate = {
//   x: number,
//   y: number,
//   fx: number,
//   fy: number
// }

// type Field = 'real-analysis' | 'measure-theory' | 'probability-theory' | 'linear-algebra'

// type StatementType =
//   'axiom'
//   | 'corollary'
//   | 'definition'
//   | 'example'
//   | 'lemma'
//   | 'notation'
//   | 'note'
//   | 'proposition'
//   | 'thought-bubble'
//   | 'theorem'
//   | 'definition-theorem'

// type Category = 'all' | 'real-analysis' | 'probability-theory' | 'measure-theory' | 'stochastic-processes'
// type Type = 'metric' | 'architecture' | 'dataset' | 'problem' | 'mechanism' | StatementType
// type SubjectType = 'mathematics' | 'computer-science' | 'philosophy'

// type RelationType =
//   'composited-in'
//   | 'included-in'
//   | 'derives'
//   | 'specializes'


// function getEdges(vertices: Vertex[]): Edge[] {
//   let edges: Edge[] = [];

//   vertices.forEach(vertex => {
//     if (vertex.parents && vertex.parents.length > 0) {
//       vertex.parents.forEach(parent => {
//         edges.push({
//           source: parent.key,
//           target: vertex.key ? vertex.key : '',
//           relation: parent.relation
//         });
//       });
//     }

//     edges = edges.filter(function (edge) {
//       return vertices.map(vertex => vertex.key).includes(edge.source)
//     })

//     return edges

//   });

//   return edges;
// }

// function initiateLayout(vertices: Vertex[], width: number, height: number) {
//   const dagreGraph = new dagre.graphlib.Graph();
//   dagreGraph.setGraph({
//     rankdir: 'TB',
//     nodesep: 10,
//     edgesep: 10,
//     ranksep: 10,
//   });

//   vertices.forEach((vertex: Vertex) => {
//     dagreGraph.setNode(vertex.key, {
//       width: width,
//       height: height,
//       ...vertex,
//     });
//   });

//   const edges = getEdges(vertices)

//   edges.forEach((edge: Edge) => {
//     dagreGraph.setEdge(edge.source, edge.target, {
//       ...edge,
//     });
//   });

//   dagre.layout(dagreGraph)

//   vertices = vertices.map((vertex: Vertex) => ({
//     ...vertex,
//     x: dagreGraph.node(vertex.key).x,
//     y: dagreGraph.node(vertex.key).y,
//   }));
//   return vertices
// }

// function computeNodeDepths(terms: Vertex[]): Vertex[] {
//   const termMap = new Map<string, Vertex>();
//   const visited = new Set<string>();

//   // Create a map of node keys to their corresponding nodes
//   terms.forEach(term => {
//     termMap.set(term.key, term);
//     term.depth = undefined; // Reset depths
//   });

//   // Depth-First Search function
//   function dfs(node: Vertex, depth: number) {
//     if (visited.has(node.key)) return;
//     visited.add(node.key);

//     node.depth = Math.min(node.depth ?? Infinity, depth);

//     if (node.parents) {
//       node.parents.forEach(parent => {
//         const parentNode = termMap.get(parent.key);
//         if (parentNode) {
//           dfs(parentNode, depth - 1);
//         }
//       });
//     }
//   }

//   // Start DFS from each node
//   terms.forEach(term => {
//     if (!visited.has(term.key)) {
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

// console.log(graph.default.vertices)

// graph = {
//   vertices: computeNodeDepths(initiateLayout(graph.default.vertices, 30, 30)),
//   edges: getEdges(graph.default.vertices),
//   metadata: {
//     edgesIncluded: true,
//     depthComputed: true,
//     positionInitialized: true
//   }
// }

// const jsonContent = JSON.stringify(graph, null, 2);

// // Define the output path for the JSON file
// const outputPath = path.join(__dirname, 'output.json');

// // Write the JSON content to the output file
// fs.writeFileSync(outputPath, jsonContent, 'utf-8');

// console.log(`JSON file has been saved to ${outputPath}`);
