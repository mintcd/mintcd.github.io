'use client'

import { useEffect } from 'react';
import * as d3 from 'd3';

export default function NetworkGraph({ data }: { data: Graph }) {

  useEffect(() => {
    const margin = { top: 10, right: 30, bottom: 30, left: 40 };
    const graphWidth = (typeof window !== 'undefined' && window.visualViewport)
      ? window.visualViewport.width - margin.left - margin.right
      : 1500 - margin.left - margin.right;
    const graphHeight = (typeof window !== 'undefined' && window.visualViewport)
      ? window.visualViewport.height - margin.top - margin.bottom
      : 750 - margin.top - margin.bottom;


    const nodeWidth = 150
    const nodeHeight = 60
    // Select the referenced graph svg and define it as a <g> tag
    const graph = d3
      .select('svg')
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("width", graphWidth + margin.left + margin.right)
      .attr("height", graphHeight + margin.top + margin.bottom)


    // Append links before nodes
    const link = graph
      .selectAll("line")
      .data(data.edges)
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

    // Define each node as a <g> tag with class "node"
    const node = graph
      .selectAll(".node-href")
      .data(data.vertices)
      .enter()
      .append("a")
      .attr("class", "node-href")
      .attr("href", (d: Vertex) => `${window.location.href}/${d.name}`)

    // Add a rectangle inside each node
    node
      .append("rect")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .style("fill", "#69b3a2");

    // Add text inside each node
    node
      .append("text")
      .text(function (v: Vertex) {
        return v.name
          .replace(/-/g, ' ')
          .replace(/\b\w/g, function (char) {
            return char.toUpperCase();
          });
      })
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .style("fill", "white")
      .attr("dx", nodeWidth / 2)
      .attr("dy", nodeHeight / 2)

    // Set initial positions for specific nodes
    const setTheoryNode = data.vertices.find((v) => v.name === 'set-theory');
    if (setTheoryNode) {
      setTheoryNode.fx = graphWidth / 2;
      setTheoryNode.fy = nodeHeight;
    }

    // Force simulation and tick function remain unchanged
    const simulation = d3.forceSimulation(data.vertices)
      // Force the nodes to the center
      .force("center",
        d3.forceCenter(graphWidth / 2, graphHeight / 2)
      )
      // Force the links to be equally nodeWidth
      .force("link",
        d3.forceLink()
          .id((v: Vertex) => v.name)
          .links(data.edges)
          .distance(nodeHeight)
        // .iterations(300)
      )

      // Force the nodes to be at least nodeHeight far from others
      .force("collide",
        d3.forceCollide((nodeHeight + nodeWidth) / 2)
      )

      .on("tick", ticked);

    function ticked() {

      // Update links
      link.attr("x1", (d: EdgeCoordinate) => d.source.x + nodeWidth / 2)
        .attr("y1", (d: EdgeCoordinate) => d.source.y + nodeHeight / 2)
        .attr("x2", (d: EdgeCoordinate) => d.target.x + nodeWidth / 2)
        .attr("y2", (d: EdgeCoordinate) => d.target.y);

      // Update nodes
      node
        .attr("transform", (d: Vertex) => `translate(${d.x}, ${d.y})`);
    }

  }, []);

  return (
    <div
      className='flex justify-center'>

      <svg />
    </div>

  );
};