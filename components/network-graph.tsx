'use client'

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import * as d3 from 'd3';
import { computeNodeDepths, extractEdges, breakLines } from '@functions/graph-analysis'
import statementProps from '@styles/statement-props'

import Latex from '@components/latex';

/**
 * Renders a network graph based on the provided data.
 * 
 * @param data
 * @param shape :'cir' (circle), 'rec' (rectangle), or undefined (default).
 * @param width. The node width, in case of rectangles.
 * @param height. The node height, in case of rectangles.
 * @param rx. The x-radius of rounded corner,  in case of rectangles.
 * @param ry. The y-radius of rounded corner,  in case of rectangles.
 * @param radius. The radius of nodes in case of circles.
 */

export default function NetworkGraph(
  { data, shape, width, height, rx, ry, radius }: {
    data: Graph
    shape?: 'cir' | 'rec' | undefined
    width?: number | undefined
    height?: number | undefined
    rx?: number | undefined
    ry?: number | undefined
    radius?: number | undefined
  }) {


  const graphWidth = (typeof window !== 'undefined' && window.visualViewport)
    ? window.visualViewport.width
    : 1500;
  const graphHeight = (typeof window !== 'undefined' && window.visualViewport)
    ? window.visualViewport.height
    : 750;

  const fontSize = 16;
  const lineHeightRatio = 1;

  const nodeWidth = width !== undefined ? width : 150
  const nodeHeight = height !== undefined ? height : 60

  useEffect(() => {
    const lineHeight = fontSize * lineHeightRatio;
    const addedLengthNodes = computeNodeDepths(data)
    console.log(addedLengthNodes)


    const vertices = breakLines(addedLengthNodes, 0.95 * nodeWidth, fontSize, "Arial")
      .map(vertex => {
        const length = vertex.lines ? vertex.lines.length : 0;
        vertex.height = (length + 1) * lineHeight * 1.2;
        vertex.width = nodeWidth;
        return vertex;
      });

    const maxDepth = Math.max(...vertices.map((vertex: Vertex) => vertex.depth === undefined ? 0 : vertex.depth));
    console.log(maxDepth)

    const edges = extractEdges(data)

    // Define a graph as an SVG
    const graph = d3
      .select('.graph')
      .attr("width", graphWidth)
      .attr("height", maxDepth * ((length + 1) * lineHeight * 1.2) * 10)

    // Append links
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

    nodes.filter((d: Vertex) => d.href)
      .attr("href", (d: Vertex) => `${window.location.href}/${d.href}`);

    // Add a rectangle inside each node
    nodes
      .append("rect")
      .attr("width", nodeWidth)
      .attr("height", (d: Vertex) => {
        return d.height;
      })
      .attr("rx", 10)
      .attr("ry", 10)
      .style("fill", (d: Vertex) => {
        return d.color
          || d.type && statementProps[d.type] && statementProps[d.type].color
          || '#0288d1'
      });

    const textNodes = nodes.append("foreignObject")
      .attr("width", nodeWidth)
      .attr("height", (d: Vertex) => d.height)
      .attr("x", 0)
      .attr("y", 0)
      .append("xhtml:div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("height", "100%")
      .style("width", "100%")
      .style("color", "white")
      .style("font-size", fontSize)
      .append("xhtml:div")
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("width", "100%")
      .style("height", "100%");

    textNodes.each(function (this: Element, d: Vertex) {
      const container = this;
      const lines = d.lines?.map((line, index) => (
        <div className={`text-center w-full text-[${fontSize}px]`} key={index}>
          <Latex>{line}</Latex>
        </div>
      ));

      createRoot(container).render(lines);
    });


    // Set initial positions for specific nodes
    for (const vertex of vertices) {
      vertex.fy = vertex.depth !== undefined ? nodeHeight * (0.5 + 2 * vertex.depth) : 500;
      const equalDepthVertices = vertices.filter(v => v.depth == vertex.depth)
      vertex.fx = graphWidth * (equalDepthVertices.indexOf(vertex) + 1) / (equalDepthVertices.length + 1)

      // vertex.fy = vertex.parents?.length === 0 ? nodeHeight * 0.5 : undefined;
    }

    // Force simulation and tick function remain unchanged
    const simulation = d3.forceSimulation(vertices)
      .force("center",
        d3.forceCenter(graphWidth / 2, graphHeight / 2)
      )
      .force("link",
        d3.forceLink()
          .id((vertex: Vertex) => vertex.name)
          .links(edges)
          .distance(nodeHeight)
        // .iterations(300)
      )

      .force("collide",
        d3.forceCollide(nodeWidth / 2)
      )
      .on("tick", ticked);

    function ticked() {
      // Update nodes
      nodes
        .attr("transform",
          function (d: Vertex) {
            return `translate(${d.x}, ${d.y})`
          });

      // Update links
      // Update links
      links.attr("x1", (d: Edge) => (d.source.x ?? 0) + ((d.source.width ?? 0) / 2))
        .attr("y1", (d: Edge) => (d.source.y ?? 0) + (d.source.height ?? 0))
        .attr("x2", (d: Edge) => (d.target.x ?? 0) + ((d.target.width ?? 0) / 2))
        .attr("y2", (d: Edge) => d.target.y ?? 0);

    }
  });

  return (
    <div>
      <svg className='graph' />
    </div>
  );
};