'use client'

import { useEffect } from 'react';
import * as d3 from 'd3';
import { computeNodeDepths, extractEdges } from '@functions/graph-analysis'

export default function NetworkGraph({ data }: { data: Graph }) {
  const margin = { top: 10, right: 30, bottom: 30, left: 40 };

  const graphWidth = (typeof window !== 'undefined' && window.visualViewport)
    ? window.visualViewport.width - margin.left - margin.right
    : 1500 - margin.left - margin.right;
  const graphHeight = (typeof window !== 'undefined' && window.visualViewport)
    ? window.visualViewport.height - margin.top - margin.bottom
    : 750 - margin.top - margin.bottom;

  const nodeWidth = 150
  const nodeHeight = 60

  useEffect(() => {
    const vertices = computeNodeDepths(data)
    const edges = extractEdges(data)

    // Define a graph as an SVG
    const graph = d3
      .select('svg')
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("width", graphWidth + margin.left + margin.right)
      .attr("height", graphHeight + margin.top + margin.bottom)

    // Append links before nodes
    const links = graph
      .selectAll("line")
      .data(edges)
      .join("line")
      .style("stroke", "#aaa")
      .attr("marker-end", "url(#arrow)");

    // Arrow styling for links
    graph
      .append("svg:defs")
      .append("svg:marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", "#aaa");

    // Define each node as an <a> tag with class "node"
    const nodes = graph
      .selectAll(".node")
      .data(vertices)
      .enter()
      .append("a")
      .attr("class", "node")
      .attr("href",
        function (d: Term) {
          return d.href ? d.href : `${window.location.href}/${d.name}`
        })

    // Add a rectangle inside each node
    nodes
      .append("rect")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("rx", 10)
      .attr("ry", 10)
      .style("fill", (d: Term) => d.color ? d.color : "#69b3a2");

    // Add a text inside each node
    nodes
      .append("text")
      .text((d: Term) => d.name)
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .style("fill", "white")
      .attr("x", nodeWidth / 2)
      .attr("y", nodeHeight / 2);

    // Set initial positions for specific nodes
    for (const vertex of vertices) {
      vertex.fy = vertex.depth !== undefined ? nodeHeight * (0.5 + 2 * vertex.depth) : 500;
      if (vertex.depth === 0) vertex.fx = graphWidth / 2
    }

    // Force simulation and tick function remain unchanged
    const simulation = d3.forceSimulation(vertices)
      // Force the nodes to the center
      .force("center",
        d3.forceCenter(graphWidth / 2, graphHeight / 2)
      )
      // Force the links to be equally nodeWidth
      .force("link",
        d3.forceLink()
          .id((vertex: Term) => vertex.name)
          .links(edges)
        // .distance(nodeHeight)
        // .iterations(300)
      )

      // Force the nodes to be at least nodeHeight far from others
      .force("collide",
        d3.forceCollide((nodeHeight + nodeWidth) / 2)
      )

      .on("tick", ticked);

    function ticked() {
      // Update nodes
      nodes
        .attr("transform",
          function (d: Term) {
            return `translate(${d.x}, ${d.y})`
          });

      // Update links
      links.attr("x1", (d: EdgeCoordinate) => d.source.x + nodeWidth / 2)
        .attr("y1", (d: EdgeCoordinate) => d.source.y + nodeHeight)
        .attr("x2", (d: EdgeCoordinate) => d.target.x + nodeWidth / 2)
        .attr("y2", (d: EdgeCoordinate) => d.target.y);
    }

    console.log("Depths", vertices)

  });

  return (
    <div
      className='flex justify-center'>

      <svg />
    </div>

  );
};