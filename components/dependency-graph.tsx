'use client'

import { useRef, useEffect, useState, RefObject } from 'react';
import { createRoot } from 'react-dom/client';

import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';

import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom'
import { forceSimulation, forceLink, forceCenter, forceCollide, forceRadial, forceManyBody } from 'd3-force';


import { statementProps } from '@styles/statement-props';
import Latex from '@components/latex';
import { breakLinesForCircle, getEdges, initiateLayout, computeNodeDepths, getVerticesOfTopic } from '@functions/graph-analysis';

export default function DependencyGraph({
  graphData,
  radiusRatio
}
  : { graphData: Graph, radiusRatio?: number }) {

  const graphRef = useRef<SVGSVGElement>(null);
  const dropdownRef = useRef(null);
  const containerRef: RefObject<HTMLDivElement> = useRef(null);
  const [fontSize, setFontSize] = useState(9);

  const [graphRendered, setGraphRendered] = useState(false)
  const [shownContent, setShownContent] = useState<Vertex | null>(null)
  const [selectedField, setSelectedField] = useState<Field | "all-fields">("all-fields");

  const fields = [
    { value: "all-fields", label: "All Fields" },
    { value: "measure-theory", label: "Measure Theory" },
    { value: "real-analysis", label: "Real Analysis" },
    { value: "probability-theory", label: "Probability Theory" },
  ];

  const [graphSize, setGraphSize] = useState({
    width: 500,
    height: 500,
  });

  radiusRatio = radiusRatio || 35
  const radius = graphSize.width / radiusRatio

  let vertices = graphData.vertices
  if (selectedField !== "all-fields") {
    vertices = getVerticesOfTopic(graphData.vertices, [selectedField])
  }
  vertices = breakLinesForCircle(vertices, radius, fontSize, "Arial") as Vertex[];
  // vertices = computeNodeDepths(vertices)
  vertices = initiateLayout(vertices, 2 * radius, 2 * radius)

  let edges = getEdges(vertices);

  useEffect(() => {
    const calculateFontSize = (width: number): number => {
      if (width <= 414) {  // Phone screen
        return 9;
      } else {  // Larger screens
        return 14;
      }
    };
    const updateFontSize = () => {
      const newFontSize = calculateFontSize(window.innerWidth);
      setFontSize(newFontSize);
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);

    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setGraphSize({ width: width, height: width });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

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
    const markerSize = graphSize.width / 100;

    const defaultMarker = markerStyles.append("svg:marker")
      .attr("id", "arrow")
      .attr("viewBox", `0 -${markerSize / 2} ${markerSize} ${markerSize}`)
      .attr("refX", markerSize)
      .attr("markerWidth", markerSize)
      .attr("markerHeight", markerSize)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", `M0,-${markerSize / 2}L${markerSize},0L0,${markerSize / 2}`)
      .style("fill", "#aaa");

    const specializesMarker = markerStyles.append("svg:marker")
      .attr("id", "arrow-specializes")
      .attr("viewBox", `0 -${markerSize / 2} ${markerSize} ${markerSize}`)
      .attr("refX", markerSize)
      .attr("markerWidth", markerSize)
      .attr("markerHeight", markerSize)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", `M0,0 L${markerSize / 2},-${markerSize / 2} L${markerSize},0 L${markerSize / 2},${markerSize / 2} Z`)
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
        const v = d as Vertex
        return v.color ? v.color : statementProps[v.type].color
      })

    const foreignObjects = nodes
      .append("foreignObject")
      .style('width', 2 * radius)
      .style('height', 2 * radius)
      .attr("x", -radius)
      .attr("y", -radius);

    const nodeDrag = drag()
      .on("start", function dragStartedHandler(event, d) {
        const v = d as Vertex;
        v.fx = v.x;
        v.fy = v.y;
      })
      .on("drag", function draggingHandler(event, d) {
        const v = d as Vertex;
        v.fx = event.x;
        v.fy = event.y;
        simulation.alphaTarget(0).restart()
      })
      .on("end", function dragEndedHandler(event, d) {
        const v = d as Vertex;
        if (!event.active) simulation.alphaTarget(0);
        v.fx = undefined;
        v.fy = undefined;
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
        const v = d as Vertex
        const container = this as HTMLElement
        createRoot(container).render(
          <div className={`text-center w-full hover:font-bold hover:cursor-pointer
                            ${shownContent && shownContent.name === v.name ? 'font-bold' : ''}`}
            onClick={() => {
              if (v.href) {
                window.open(v.href, '_blank');
              } else {
                setShownContent(v)
              }
            }}
          >
            {v.lines
              && v.lines.map((line, i) => (
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
        .distance(radius * 2)
        .id(function (node) {
          const v = node as Vertex
          return v.key ? v.key : ''
        }))
      .force('collide', forceCollide(1.5 * radius))

    simulation.on("tick", () => {
      nodes.attr("transform", function (d) {
        const v = d as Vertex;

        // Ensure x is within bounds
        v.x = Math.max(radius, Math.min(graphSize.width - radius, v.x || 0));
        v.y = Math.max(radius, Math.min(graphSize.height - radius, v.y || 0));

        return `translate(${v.x},${v.y})`;
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


  return (
    <div className='place-items-center'>

      <div ref={containerRef} className={`w-full
                      flex flex-col items-center justify-center 
                     overflow-hidden`}>
        <div className='bg-slate-200'>
          <svg ref={graphRef} className='graph-container fill-gray-500'>
            <foreignObject id='reset-button' className='cursor-pointer w-[50px] h-[50px] translate-x-[25px] translate-y-[25px]'>
            </foreignObject>
          </svg>
        </div>
      </div>
    </div >
  );
};