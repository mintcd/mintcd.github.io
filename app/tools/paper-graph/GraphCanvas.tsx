'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MIN_SIZE = 5;
const MAX_SIZE = 20;
const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 700;

interface GraphCanvasProps {
  data: GraphData;
  hoveredNode: GraphNode | null;
  clickedNode: GraphNode | null;
  setHoveredNode: (node: any) => void;
  setClickedNode: (node: any) => any;
}

let hasDragged = false;

export default function GraphCanvas({
  data,
  hoveredNode,
  clickedNode,
  setHoveredNode,
  setClickedNode,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const citationCounts = data.nodes.map(d => d.citationCount ?? 0);
    const minCite = d3.min(citationCounts) ?? 0;
    const maxCite = d3.max(citationCounts) ?? 1;

    const radiusScale = d3.scaleSqrt()
      .domain([minCite, maxCite])
      .range([MIN_SIZE, MAX_SIZE]);

    const zoomGroup = svg.append('g');

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 5])
        .wheelDelta((event: any) => -event.deltaY * 0.001)
        .on('zoom', (event: any) => {
          zoomGroup.attr('transform', event.transform);
        })
    );

    const simulation = d3.forceSimulation(data.nodes)
      .alphaDecay(0.08)
      .force('link', d3.forceLink(data.links)
        .id((d: any) => d.id)
        .distance(400)
        .strength(0.2)
      )
      .force('center', d3.forceCenter(GRAPH_WIDTH / 2, GRAPH_HEIGHT / 2))
      .force('collide', d3.forceCollide().radius(30).strength(1));

    const link = zoomGroup.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', 1);

    const node = zoomGroup.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll<SVGCircleElement, GraphNode>('circle')
      .data(data.nodes)
      .join('circle')
      .on('mouseover', (_, d: any) => setHoveredNode(d))
      .on('mouseout', () => setHoveredNode(null))
      .on('click', (_, d: any) => setClickedNode(d))
      .attr('r', (d) => radiusScale(d.citationCount ?? 0) as number)
      .attr('fill', 'steelblue')
      .attr('opacity', 1)
      .attr('data-id', d => d.id)
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on('start', (event: any, d: any) => {
          simulation.alphaTarget(0.01).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event: any, d: any) => {
          if (!event.active) {
            simulation.alphaTarget(0.3).restart();
            simulation.force('center', null).force('charge', null);
          }
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    const label = zoomGroup.append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text(d => `${d.authors[0].name}, ${d.year}`)
      .attr('font-size', 9)
      .attr('fill', '#000');

    simulation.on('tick', () => {
      link
        .attr('x1', function (d: any) {
          const { x: x1, y: y1 } = d.source;
          const { x: x2, y: y2 } = d.target;
          const r = radiusScale(d.source.citationCount ?? 0) as number;

          const dx = x2 - x1;
          const dy = y2 - y1;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offsetX = (dx * r) / dist;
          const offsetY = (dy * r) / dist;

          return x1 + offsetX;
        })
        .attr('y1', function (d: any) {
          const { x: x1, y: y1 } = d.source;
          const { x: x2, y: y2 } = d.target;
          const r = radiusScale(d.source.citationCount ?? 0) as number;

          const dx = x2 - x1;
          const dy = y2 - y1;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offsetX = (dx * r) / dist;
          const offsetY = (dy * r) / dist;

          return y1 + offsetY;
        })
        .attr('x2', function (d: any) {
          const { x: x1, y: y1 } = d.source;
          const { x: x2, y: y2 } = d.target;
          const r = radiusScale(d.target.citationCount ?? 0) as number;

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offsetX = (dx * r) / dist;
          const offsetY = (dy * r) / dist;

          return x2 + offsetX;
        })
        .attr('y2', function (d: any) {
          const { x: x1, y: y1 } = d.source;
          const { x: x2, y: y2 } = d.target;
          const r = radiusScale(d.target.citationCount ?? 0) as number;

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offsetX = (dx * r) / dist;
          const offsetY = (dy * r) / dist;

          return y2 + offsetY;
        });


      node.attr('cx', d => d.x!).attr('cy', d => d.y!);
      label.attr('x', d => d.x! + 12).attr('y', d => d.y! + 4);
    });

    return () => {
      simulation.stop();
    };
  }, [data, setClickedNode, setHoveredNode]);

  useEffect(() => {
    if (!svgRef.current) return;
    const circles = svgRef.current.querySelectorAll('circle');

    const hasActiveNode = hoveredNode !== null || clickedNode !== null;

    circles.forEach((el) => {
      const id = el.getAttribute('data-id');
      if (!id) return;

      const isHovered = hoveredNode?.id === id;
      const isClicked = clickedNode?.id === id;

      if (!hasActiveNode) {
        el.setAttribute('opacity', '0.5');
      } else if (isClicked) {
        el.setAttribute('opacity', '1.0');
      } else if (isHovered) {
        el.setAttribute('opacity', '0.8');
      } else {
        el.setAttribute('opacity', '0.3');
      }
    });
  }, [hoveredNode, clickedNode]);


  return <svg ref={svgRef} width="100%" height={GRAPH_HEIGHT}></svg>;
}
