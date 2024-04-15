'use client'

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

import data from '@models/mathematics/subject-dependencies'

export default function NetworkGraph() {
  const svgRef = useRef(null);

  const margin = { top: 10, right: 30, bottom: 30, left: 40 };
  const graphWidth = 1000 - margin.left - margin.right;
  const graphHeight = 1000 - margin.top - margin.bottom;

  const nodeWidth = 150
  const nodeHeight = 60

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("width", graphWidth + margin.left + margin.right)
      .attr("height", graphHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const link = svg.selectAll("line")
      .data(data.edges)
      .join("line")
      .style("stroke", "#aaa")
      .attr("marker-end", "url(#arrow)");

    // Define the arrowhead marker
    svg.append("svg:defs")
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

    const node = svg
      .selectAll(".node")
      .data(data.vertices)
      .enter()
      .append("g")
      .attr("class", "node");

    node.append("rect")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .style("fill", "#69b3a2");

    node.append("text")
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
      .on("click", function (event, v: Vertex) {
        const currentUrl = window.location.href; // Get the current URL
        const newUrl = `${currentUrl}/${v.name}`; // Concatenate v.name to the current URL
        console.log("Clicked on node:", v.name);
        console.log("Navigating to:", newUrl);
        window.location.href = newUrl; // Navigate to the new URL
      })
      .style("cursor", "pointer");


    node.append("a")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("title", "node-href")
      .attr("href", "google.com")

    const simulation = d3.forceSimulation(data.vertices)
      .force("link", d3.forceLink()
        .id((v: Vertex) => v.name)
        .links(data.edges)
      )
      .force("charge", d3.forceManyBody().strength(-5000))
      .force("center", d3.forceCenter(graphWidth / 2, graphHeight / 2))
      .on("tick", ticked)
      .alphaDecay(0.01);



    function ticked() {
      link
        .attr("x1", function (d: EdgeCoordinate) {
          // console.log(d)
          return d.source.x
        })
        .attr("y1", (d: EdgeCoordinate) => d.source.y)
        .attr("x2", (d: EdgeCoordinate) => d.target.x)
        .attr("y2", (d: EdgeCoordinate) => d.target.y);

      node
        .attr("transform", function (d: VertexCoordinate) {
          return `translate(${d.x - nodeWidth / 2}, ${d.y - nodeHeight / 2})`
        })
    }
  }, []);

  return (
    <div
      className='flex justify-center'>
      <svg ref={svgRef}></svg>
    </div>

  );
};