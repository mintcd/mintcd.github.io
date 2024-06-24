import fs from 'fs';
import graph from '../models/knowledge-graph.mjs'

const filePath = `\models\\knowledge-graph.json`

graph.vertices.forEach((vertex, index) => {
  if (!vertex.key) {
    vertex.key = vertex.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }
});

// Create a map from names to keys for easy lookup
const nameToKey = Object.fromEntries(graph.vertices.map((vertex) => [vertex.name, vertex.key]));

// Update edges to use keys instead of names
graph.edges.forEach((edge) => {
  edge.source = nameToKey[edge.source];
  edge.target = nameToKey[edge.target];
});

// Write the updated graph back to the file
const outputData = JSON.stringify(graph, null, 2);
fs.writeFileSync(filePath, outputData, 'utf8');