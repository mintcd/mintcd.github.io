'use client'

import { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom'
import { forceSimulation, forceLink, forceCenter, forceCollide, forceRadial, forceManyBody } from 'd3-force';


import { statementProps } from '@styles/statement-props';
import Latex from '@components/latex';
import VertexContent from '@components/statement-content';
import { breakLinesForCircle, getEdges, initiateLayout, computeNodeDepths, getVerticesOfTopic } from '@functions/graph-analysis';

export default function KnowledgeGraph({
  graphData,
  radius,
  fontSize = 9,
  lectureView = false,
  filter = false,
}
  : { graphData: Graph, radius?: number, fontSize?: number, lectureView?: boolean, filter?: boolean }) {

  const contentRef = useRef(null);
  const graphRef = useRef<SVGSVGElement>(null);
  const dropdownRef = useRef(null);

  const [graphRendered, setGraphRendered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shownContent, setShownContent] = useState<Vertex | null>(null)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | "all-fields">("all-fields");

  const fields = [
    { value: "all-fields", label: "All Fields" },
    { value: "measure-theory", label: "Measure Theory" },
    { value: "real-analysis", label: "Real Analysis" },
    { value: "probability-theory", label: "Probability Theory" },
  ];

  const graphSize = {
    width: typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.width * 0.6 : 500,
    height: typeof window !== 'undefined' && window.visualViewport ? window.visualViewport.height : 500,
  }

  if (radius === undefined) {
    radius = graphSize.width / 30
  }

  let vertices = graphData.vertices
  if (selectedField !== "all-fields") {
    vertices = getVerticesOfTopic(graphData.vertices, [selectedField])
  }
  vertices = breakLinesForCircle(vertices, radius, fontSize, "Arial") as Vertex[];
  // vertices = computeNodeDepths(vertices)
  vertices = initiateLayout(vertices, 2 * radius, 2 * radius)

  let edges = getEdges(vertices);

  // Hook for SVG Graph Rendering
  useEffect(() => {
    // Select the graph container
    const svgContainer = select(graphRef.current as SVGSVGElement)
      .attr('width', graphSize.width)
      .attr('height', graphSize.height)

    // Add graph from container
    const svgGraph = svgContainer.append("g")

    /////////////////////////////// Marker Styles /////////////////////////////////////////////////////////
    const markerStyles = svgGraph.append("svg:defs")

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

    const links = svgGraph.selectAll("line")
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


    const linkText = svgGraph.append("g")
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

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const nodes = svgGraph
      .selectAll(".node")
      .data(vertices)
      .enter()
      .append("g")
      .attr("class", "node")

    const gradients = svgGraph.append('defs')
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

    const foreignObjects = nodes
      .append("foreignObject")
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
            onMouseEnter={(event) => {
              if (!lectureView) {
                setShownContent(vertex);
                setMousePosition({
                  x: event.clientX,
                  y: event.clientY,
                });
              }

            }}
            onMouseLeave={() => {
              if (!lectureView) {
                setShownContent(null);
              }

            }}
            onClick={() => {
              if (vertex.href && lectureView === false) {
                window.open(vertex.href, '_blank');
              } else {
                setShownContent(vertex)
              }
            }}
          >
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
    /////////////////////////// Simulation //////////////////////////////////////
    const simulation = forceSimulation(vertices)
    simulation.alphaDecay(0.5)
      .force('center', forceCenter(graphSize.width / 2, graphSize.height / 2))
      .force('link', forceLink(edges)
        .distance(radius * 3)
        .id(function (node) {
          const vertex = node as Vertex
          return vertex.key ? vertex.key : ''
        }))
      .force('collide', forceCollide(1.5 * radius))
    // .force('x', d3.forceX(graphSize.width / 2).strength(0.1))
    // .force('y', d3.forceY().strength(0.1).y(0));

    simulation.on("tick", () => {
      nodes.attr("transform", function (d) {
        const vertex = d as VertexCoordinate;
        vertex.x = Math.max(radius, Math.min(graphSize.width - radius, vertex.x));
        vertex.y = Math.max(radius, Math.min(graphSize.height - radius, vertex.y));
        return `translate(${vertex.x},${vertex.y})`;
      });

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

    })

    //////////////// Drag behaviors ////////////////////////////////////////////////////
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .filter((event) => {
        // Allow zooming on wheel events and not on other events like drag
        return event.type === 'wheel' || event.type === 'dblclick';
      })
      .on('zoom', (event) => {
        svgGraph.attr('transform', event.transform);
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
      svgContainer.transition()
        .duration(100)
        .call(zoomBehavior.transform as any, zoomIdentity);
    };

    const resetButton = select('#reset-button')
    resetButton.on('click', resetZoom);

    svgContainer.call(zoomBehavior as any)
      .on("wheel.zoom", handleZoom)

    return () => {
      setGraphRendered(true)
      svgGraph.selectAll('*').remove();
      simulation.stop();
    };
  }, [graphRendered, selectedField]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contentRef.current && !(contentRef.current as HTMLElement).contains(event.target as Node)) {
        setShownContent(null);
      }

      if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setIsOpen(false);
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
    <div className='grid grid-cols-6 place-items-center'>
      {filter && <div ref={dropdownRef} id='select' className=' col-span-4 mb-4 w-48'>
        <div
          className="bg-white border border-gray-300 rounded-md p-2 flex justify-between items-center cursor-pointer col-span-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-gray-700">
            {fields.find(f => f.value === selectedField)?.label}
          </span>
          <ArrowDropDownIcon className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
        {isOpen && (
          <div className="absolute w-48 bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10">
            {fields.map((field) => (
              <div
                key={field.value}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedField(field.value as Field | "all-fields");
                  setIsOpen(false);
                }}
              >
                {field.label}
              </div>
            ))}
          </div>
        )}
      </div>}
      <div className={`${lectureView ? 'col-span-4' : 'col-span-6'} w-[90%] 
                      flex flex-col items-center justify-center 
                     overflow-hidden`}>
        <div className='bg-slate-200'>
          <svg ref={graphRef} className='graph-container fill-slate-200'>
            <foreignObject id='reset-button' className='cursor-pointer w-[50px] h-[50px] translate-x-[25px] translate-y-[25px]'>
              <CenterFocusStrongRoundedIcon className='w-[50px] h-[50px]' />
            </foreignObject>
          </svg>
        </div>
      </div>

      {
        shownContent !== null && shownContent.content && (lectureView ?
          <div
            className={`col-span-2 z-50 rounded-md 
                      mr-5 h-full w-full`}
            ref={contentRef}
          >
            <VertexContent statement={shownContent} />
          </div>
          :
          <div
            className={`z-50 rounded-md 
         animate-fadeIn p-5 max-w-[600px]
        `}
            style={{
              position: 'fixed',
              top: `${mousePosition.y}px`,
              left: `${mousePosition.x}px`
            }}
            ref={contentRef}
            onMouseEnter={() => setShownContent(shownContent)}
            onMouseLeave={() => setShownContent(null)}
          >
            <VertexContent statement={shownContent} />
          </div>
        )}
    </div >
  );
};