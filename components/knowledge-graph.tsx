'use client'

import { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';
import dagre from 'dagre'

import statementProps from '@styles/statement-props';
import Latex from '@components/latex';


import { breakLinesForCircle } from '@functions/graph-analysis'

const KnowledgeGraph = ({ graph, radius }: { graph: Graph, radius: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const graphWidth = (typeof window !== 'undefined' && window.visualViewport)
    ? window.visualViewport.width
    : 1500;
  const graphHeight = (typeof window !== 'undefined' && window.visualViewport)
    ? window.visualViewport.height
    : 750;

  const fontSize = 14;
  const padding = 4; // Add some padding to the foreignObject

  let vertices = graph.vertices;
  const edges = graph.edges;

  vertices = breakLinesForCircle(vertices, radius, fontSize, "Arial");
  const dagreGraph = new dagre.graphlib.Graph();

  // Set an object for the graph label
  dagreGraph.setGraph({
    rankdir: 'TB', // Top to bottom
    nodesep: 50, // Separation between nodes
    edgesep: 10, // Separation between edges
    ranksep: 50, // Separation between ranks
  });

  // Default to assigning a new object as a label for each edge.
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph
  vertices.forEach((vertex) => {
    dagreGraph.setNode(vertex.name, {
      width: radius,
      height: radius,
      ...vertex,
    });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target, {
      label: edge.relation,
      ...edge,
    });
  });

  // Compute the layout
  dagre.layout(dagreGraph);

  // Update vertices with dagre computed layout
  vertices = vertices.map((vertex) => ({
    ...vertex,
    x: dagreGraph.node(vertex.name).x,
    y: dagreGraph.node(vertex.name).y,
  }));

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("width", graphWidth)
      .attr("height", graphHeight);

    const simulation = d3.forceSimulation(vertices)
      .force("link", d3.forceLink(edges).id((d: Vertex) => d.name).distance(3 * radius))
      .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2))
      .force("charge", d3.forceManyBody())
      .force("collide", d3.forceCollide(radius + 10));

    const links = svg
      .selectAll("line")
      .data(edges)
      .join("line")
      .style("stroke", "#aaa")
      .attr("marker-end", "url(#arrow)");

    // Arrow styling for links
    svg
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

    const linkText = svg.append("g")
      .attr("class", "link-texts")
      .selectAll("text")
      .data(edges)
      .enter().append("text")
      .attr("class", "link-text")
      .attr("dy", -5)
      .attr("text-anchor", "middle")
      .text((d: Edge) => d.relation ? d.relation : '');

    const nodes = svg.append("g")
      .attr("class", "vertex")
      .selectAll(".node")
      .data(vertices) // Use nodeLayoutInfo instead of vertices
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: Vertex) => `translate(${d.x},${d.y})`)

    const shapes = nodes.append("circle")
      .attr("class", "shape")
      .attr("r", radius)
      .attr("fill", (d: Vertex) => d.color ? d.color : statementProps[d.type].color)
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));

    const foreignObjects = nodes.append("foreignObject")
      .attr("width", 2 * radius)
      .attr("height", 2 * radius)
      .attr("x", -radius)
      .attr("y", -radius); // Center the foreignObject

    foreignObjects.append("xhtml:div")
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("width", "100%")
      .style("height", "100%")
      .style("padding", `${padding}px 0`) // Add padding to top and bottom
      .style("color", "white")
      .style("font-size", `${fontSize}px`)
      .each(function (this: HTMLElement, d: Vertex) {
        createRoot(this).render(
          <div className="text-center w-full">
            {d.lines && d.lines.map((line, i) => (
              <a key={i} href={d.href}>
                <Latex>{line}</Latex>
              </a>
            ))}
          </div>
        );
      });

    simulation.on("tick", () => {
      links
        .attr("x1", (d: EdgeCoordinate) => {
          const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
          return d.source.x + radius * Math.cos(angle);
        })
        .attr("y1", (d: EdgeCoordinate) => {
          const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
          return d.source.y + radius * Math.sin(angle);
        })
        .attr("x2", (d: EdgeCoordinate) => {
          const angle = Math.atan2(d.source.y - d.target.y, d.source.x - d.target.x);
          return d.target.x + radius * Math.cos(angle);
        })
        .attr("y2", (d: EdgeCoordinate) => {
          const angle = Math.atan2(d.source.y - d.target.y, d.source.x - d.target.x);
          return d.target.y + radius * Math.sin(angle);
        });

      linkText
        .attr("x", (d: EdgeCoordinate) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: EdgeCoordinate) => (d.source.y + d.target.y) / 2);

      nodes
        .attr("transform", (d: VertexCoordinate) => `translate(${d.x},${d.y})`);
    });

    function dragStarted(event: any, d: VertexCoordinate) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: VertexCoordinate) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: VertexCoordinate) {
      if (!event.active) simulation.alphaTarget(0);
    }

    return () => {
      svg.selectAll('*').remove();
      simulation.stop();
    };
  });

  return <svg ref={svgRef}></svg>;
};

export default KnowledgeGraph;
