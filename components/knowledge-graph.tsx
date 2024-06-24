'use client'

import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { createRoot } from 'react-dom/client';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';

import { D3DragEvent, extent } from 'd3';
import { Selection, select } from 'd3-selection'
import { drag } from 'd3-drag'
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom'
import { forceSimulation, forceLink, forceCenter, forceCollide, forceRadial, forceManyBody } from 'd3-force';

import dagre from 'dagre';

import { statementProps } from '@styles/statement-props';
import Latex from '@components/latex';
import { breakLinesForCircle, getEdges } from '@functions/graph-analysis';

export default function KnowledgeGraph({ graph, radius = 30, fontSize = 9 }: { graph: Vertex[], radius?: number, fontSize?: number }) {

  const contentRef = useRef(null);
  const graphRef = useRef<SVGSVGElement>(null);

  const [graphRendered, setGraphRendered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shownContent, setShownContent] = useState<Vertex | null>(null)
  const graphSize = {
    width: typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.width * 0.9 : 500,
    height: typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.height : 500,
  }

  let vertices: Vertex[] = breakLinesForCircle(graph, radius, fontSize, "Arial") as Vertex[];
  let edges = getEdges(graph);

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setGraph({
    rankdir: 'TB', // Top to bottom direction
    nodesep: 1,
    edgesep: 1,   // Example value less than default
    ranksep: 1,     // Example value less than default
  });

  vertices.forEach((vertex: Vertex) => {
    dagreGraph.setNode(vertex.key, {
      width: radius,
      height: radius,
      ...vertex,
    });
  });

  edges.forEach((edge: Edge) => {
    dagreGraph.setEdge(edge.source, edge.target, {
      // label: edge.relation,
      ...edge,
    });
  });

  dagre.layout(dagreGraph)

  vertices = vertices.map((vertex: Vertex) => ({
    ...vertex,
    x: dagreGraph.node(vertex.key).x,
    y: dagreGraph.node(vertex.key).y,
  }));


  useEffect(() => {
    // Select the current svg element and use it as the graph

    const svg = select(graphRef.current as SVGSVGElement)
      .attr('width', graphSize.width)
      .attr('height', graphSize.height)

    const graph = svg.append("g")

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .filter((event) => {
        // Allow zooming on wheel events and not on other events like drag
        return event.type === 'wheel' || event.type === 'dblclick';
      })
      .on('zoom', (event) => {
        graph.attr('transform', event.transform);
      });

    const handleZoom = (event: WheelEvent) => {
      event.preventDefault();

      const svg = select(graphRef.current as SVGSVGElement);
      const currentTransform = zoomTransform(graphRef.current as SVGSVGElement);
      const sensitivity = 0.001;

      const svgBounds = (graphRef.current as SVGSVGElement).getBoundingClientRect();
      const mouseX = event.clientX - svgBounds.left;
      const mouseY = event.clientY - svgBounds.top;

      const scaleFactor = 1 - event.deltaY * sensitivity;
      const newScale = currentTransform.k * scaleFactor;
      const constrainedScale = Math.max(0.1, Math.min(newScale, 3));

      const x = currentTransform.x;
      const y = currentTransform.y;
      const k = currentTransform.k;

      const newX = mouseX - (mouseX - x) * (constrainedScale / k);
      const newY = mouseY - (mouseY - y) * (constrainedScale / k);

      const newTransform = zoomIdentity
        .translate(newX, newY)
        .scale(constrainedScale);


      svg
        .transition()
        .duration(50)
        .call(zoomBehavior.transform as any, newTransform);
    };

    const resetZoom = () => {
      svg.transition()
        .duration(100)
        .call(zoomBehavior.transform as any, zoomIdentity);
    };


    const resetButton = select('#reset-button')
    resetButton.on('click', resetZoom);

    svg.call(zoomBehavior as any)
      .on("wheel.zoom", handleZoom)

    // Style markers
    const markerStyles = graph.append("svg:defs")

    const defaultMarker = markerStyles.append("svg:marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", "#aaa");

    const specializesMarker = markerStyles.append("svg:marker")
      .attr("id", "arrow-specializes")
      .attr("viewBox", "0 -6 12 12")
      .attr("refX", 12)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,0 L6,-6 L12,0 L6,6 Z")
      .style("fill", "#aaa");

    const links = graph.selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .style("stroke", function (d) {
        const edge = d as Edge;
        return edge.relation && edge.relation === 'specializes' ? "#aaa" : "#aaa";
      })
      .attr("marker-end", function (d) {
        const edge = d as Edge;
        return edge.relation && edge.relation === 'specializes' ? "url(#arrow-specializes)" : "url(#arrow)";
      });


    const linkText = graph.append("g")
      .attr("class", "link-texts")
      .selectAll("text")
      .data(edges)
      .enter()
      .append("text")
      .attr("class", "link-text")
      .attr("dy", -5)
      .attr("text-anchor", "middle")
      .text(function (d) {
        const edge = d as Edge;
        // return edge.relation !== undefined ? edge.relation : '';
        return ''
      });

    const nodes = graph
      .selectAll(".node")
      .data(vertices)
      .enter()
      .append("g")
      .attr("class", "node")

    const gradients = graph.append('defs')
      .append('linearGradient')
      .attr('id', 'definition-theorem')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradients.append('stop')
      .attr('offset', '0%')
      .style('stop-color', '#0288d1');

    gradients.append('stop')
      .attr('offset', '100%')
      .style('stop-color', '#5bb561');

    const shapes = nodes.append("circle")
      .attr("class", "shape")
      .attr("r", radius)
      .attr("stroke", "none")
      .attr("fill", function (d) {
        const vertex = d as Vertex
        return vertex.color ? vertex.color : statementProps[vertex.type].color
      })

    const foreignObjects = nodes.append("foreignObject")
      .style('width', 2 * radius)
      .style('height', 2 * radius)
      .attr("x", -radius)
      .attr("y", -radius);

    const nodeDrag = drag()
      .on("start", function dragStartedHandler(event, d) {
        const vertex = d as Vertex;
        vertex.fx = vertex.x;
        vertex.fy = vertex.y;
      })
      .on("drag", function draggingHandler(event, d) {
        const vertex = d as Vertex;
        vertex.fx = event.x;
        vertex.fy = event.y;
        simulation.alphaTarget(0).restart()
      })
      .on("end", function dragEndedHandler(event, d) {
        const vertex = d as Vertex;
        if (!event.active) simulation.alphaTarget(0);
        vertex.fx = undefined;
        vertex.fy = undefined;
      });

    nodes.call(nodeDrag as any)

    foreignObjects.append("xhtml:div")
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("width", "100%")
      .style("height", "100%")
      .style("color", "white")
      .style("font-size", `${fontSize}px`)
      .each(function (this, d) {
        const vertex = d as Vertex
        const container = this as HTMLElement
        createRoot(container).render(
          <div className={`text-center w-full hover:font-bold hover:cursor-pointer
                            ${shownContent && shownContent.name === vertex.name ? 'font-bold' : ''}`}
            onClick={function handleClick(event) {
              setShownContent(vertex);
              setMousePosition({
                x: event.clientX,
                y: event.clientY,
              });
              console.log(mousePosition)
            }}>
            {vertex.lines
              && vertex.lines.map((line, i) => (
                <Latex key={i}>
                  {line}
                </Latex>
              ))
            }
          </div>
        );
      })

    const simulation = forceSimulation(vertices)
    simulation.alphaDecay(0.5)

    // simulation.force('fixed-root', forceRadial(0, graphSize.width / 2, radius)
    //   .strength(function (d) {
    //     const vertex = d as Vertex
    //     return vertex === vertices[0] ? 2 : 0
    //   }))
    simulation.force('center', forceCenter(graphSize.width / 2, graphSize.height / 2))

    simulation.force('link', forceLink(edges)
      .distance(radius * 2)  // Increased from radius
      .id(function (node) {
        const vertex = node as Vertex
        return vertex.key ? vertex.key : ''
      }))

    simulation.force('manyBody', forceManyBody().strength(-500))  // Changed from -100

    simulation.force('collide', forceCollide(1.25 * radius))

    simulation.on("tick", () => {
      links
        .attr("x1", (d) => {
          const edge = d as any
          const angle = Math.atan2(edge.target.y - edge.source.y, edge.target.x - edge.source.x);
          return edge.source.x + radius * Math.cos(angle);
        })
        .attr("y1", (d) => {
          const edge = d as any
          const angle = Math.atan2(edge.target.y - edge.source.y, edge.target.x - edge.source.x);
          return edge.source.y + radius * Math.sin(angle);
        })
        .attr("x2", (d) => {
          const edge = d as any
          const angle = Math.atan2(edge.source.y - edge.target.y, edge.source.x - edge.target.x);
          return edge.target.x + radius * Math.cos(angle);
        })
        .attr("y2", (d) => {
          const edge = d as any
          const angle = Math.atan2(edge.source.y - edge.target.y, edge.source.x - edge.target.x);
          return edge.target.y + radius * Math.sin(angle);
        });

      linkText
        .attr("x", function (d) {
          const edge = d as any
          return (edge.source.x + edge.target.x) / 2
        })
        .attr("y", function (d) {
          const edge = d as any
          return (edge.source.y + edge.target.y) / 2
        });
      nodes.attr("transform", function (d) {
        const vertex = d as VertexCoordinate;
        vertex.x = Math.max(radius, Math.min(graphSize.width - radius, vertex.x));
        vertex.y = Math.max(radius, Math.min(graphSize.height - radius, vertex.y));
        return `translate(${vertex.x},${vertex.y})`;
      });
    })

    setGraphRendered(true)

    return () => {
      graph.selectAll('*').remove();
      simulation.stop();
    };
  }, [graphRendered]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contentRef.current && !(contentRef.current as HTMLElement).contains(event.target as Node)) {
        setShownContent(null);
      }
    }

    function escHandler(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setShownContent(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', escHandler);

    // Clean up

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', escHandler);
    };

  });

  return (
    <div className='flex flex-col items-center justify-center h-screen'>

      <div className='flex flex-col items-center justify-center bg-slate-200 overflow-hidden'>
        <CenterFocusStrongRoundedIcon id='reset-button' className='cursor-pointer bg-transparent self-start m-4 w-10 h-10' />
        <svg ref={graphRef} className='graph-container relative top-0 left-0'>
        </svg>
      </div>


      {shownContent !== null && shownContent.content && (
        <div
          className={`fixed bg-orange-200 z-50 rounded-md animate-fadeIn p-5
            max-w-[600px]`}
          style={{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }}
          ref={contentRef}
        >
          <Latex>
            {shownContent.content ? shownContent.content : ''}
          </Latex>
        </div>
      )}
    </div>
  );
};
