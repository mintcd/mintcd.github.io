const fs = require('fs');
const path = require('path');

// Import the TypeScript object
const graph = require('../models/knowledge-graph');

// Convert the TypeScript object to JSON
const jsonContent = JSON.stringify(graph, null, 2);

// Define the output path for the JSON file
const outputPath = path.join(__dirname, 'output.json');

// Write the JSON content to the output file
fs.writeFileSync(outputPath, jsonContent, 'utf-8');

console.log(`JSON file has been saved to ${outputPath}`);
