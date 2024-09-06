'use client'
import { useRef, useEffect, useState, RefObject } from 'react';

import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { select, selectAll } from 'd3-selection'
import { zoom, zoomIdentity, zoomTransform, ZoomBehavior } from 'd3-zoom'
import { forceSimulation, forceLink, forceCenter, forceCollide } from 'd3-force';

import { getEdges, initiateLayout, getVerticesOfTopic } from '@functions/graph-analysis';
import GraphNode from '@components/graph/graph-node';
import { createRoot } from 'react-dom/client';
import GraphLink from './graph/graph-link';

import { drag } from 'd3-drag'
import { Simulation } from 'd3-force';

export default function KnowledgeGraph({
  graphData,
  radiusRatio,
}
  : { graphData: Graph, radiusRatio?: number }) {

  const fields = [
    { value: "all-fields", label: "All Fields" },
    { value: "measure-theory", label: "Measure Theory" },
    { value: "real-analysis", label: "Real Analysis" },
    { value: "probability-theory", label: "Probability Theory" },
  ];


  const dropdownRef = useRef(null);

  const environmentRef: RefObject<HTMLDivElement> = useRef(null);
  const graphContainerRef = useRef<SVGSVGElement>(null);

  const simulationRef = useRef<Simulation<Vertex, undefined> | null>(null);

  const [clickedNodeKey, setClickedNodeKey] = useState<string | null>(null);

  const [graphRendered, setGraphRendered] = useState(false)
  const [isOpen, setIsOpen] = useState(false);

  const [selectedField, setSelectedField] = useState<Field | "all-fields">('all-fields');
  const [graphSize, setGraphSize] = useState({
    width: 500,
    height: 500,
  });

  radiusRatio = radiusRatio || 0.02
  const radius = graphSize.width * radiusRatio
  const fontSize = 250 * radiusRatio

  let vertices = graphData.vertices
  if (selectedField !== "all-fields") {
    vertices = getVerticesOfTopic(graphData.vertices, [selectedField])
  }
  vertices = initiateLayout(vertices, 2 * radius, 2 * radius)

  let edges = getEdges(vertices);


  useEffect(() => {
    setSelectedField(window.localStorage.getItem('selectedField') as Field || 'all-fields')

    const updateSize = () => {
      if (environmentRef.current) {
        const { width, height } = environmentRef.current.getBoundingClientRect();
        setGraphSize({ width: width, height: width });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initial Rendering
  useEffect(() => {
    // Select the graph container
    const graphContainer = select(graphContainerRef.current as SVGSVGElement)
      .attr('width', graphSize.width)
      .attr('height', graphSize.height)

    /////////////////////////////// Styles /////////////////////////////////////////////////////////
    const markerStyles = graphContainer.append("svg:defs")
    const markerSize = graphSize.width * radiusRatio / 3;

    markerStyles.append("svg:marker")
      .attr("id", "arrow")
      .attr("viewBox", `0 -${markerSize / 2} ${markerSize} ${markerSize}`)
      .attr("refX", markerSize * 0.8)
      .attr("markerWidth", markerSize)
      .attr("markerHeight", markerSize)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", `M0,-${markerSize / 2}L${markerSize},0L0,${markerSize / 2}`)
      .style("fill", "#aaa");

    markerStyles.append("svg:marker")
      .attr("id", "arrow-specializes")
      .attr("viewBox", `0 -${markerSize / 2} ${markerSize} ${markerSize}`)
      .attr("refX", markerSize * 0.8)
      .attr("markerWidth", markerSize)
      .attr("markerHeight", markerSize)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", `M0,0 L${markerSize / 2},-${markerSize / 2} L${markerSize},0 L${markerSize / 2},${markerSize / 2} Z`)
      .style("fill", "#aaa");

    const gradients = graphContainer
      .append('defs')
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const graph = graphContainer.select(".graph")

    const links = graph.selectAll('.link')
      .data(edges)
      .enter()
      .append("g")
      .attr("class", "link")
      .each(function (d: Edge) {
        const root = createRoot(this)
        root.render(<GraphLink edge={d} radius={radius} />)
      });

    const linkText = graph
      .append("g")
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

    graph
      .selectAll(".node")
      .data(vertices)
      .enter()
      .append("g")
      .attr("class", "node")
      .each(function (d: Vertex) {
        const root = createRoot(this)
        root.render(
          <GraphNode
            data={d}
            radius={radius}
            fontSize={fontSize}
            isClicked={clickedNodeKey === d.key}
            onClick={() => {
              setClickedNodeKey(d.key)
              console.log(clickedNodeKey)
            }}
          />
        )
      });

    const simulation = forceSimulation(vertices)

    simulation
      .force('center', forceCenter(graphSize.width / 2, graphSize.height / 2))
      .force(
        'link',
        forceLink(edges)
          .distance(radius)
          .id((d) => (d as Vertex).key || '')
      )
      .force('collide', forceCollide(1.5 * radius))
      .alphaDecay(0.5);


    simulation.on('tick', () => {
      const nodes = selectAll('.node')
      nodes.attr('transform', (d: Vertex) => {
        d.x = Math.max(radius, Math.min(graphSize.width - radius, d.x || 0));
        d.y = Math.max(radius, Math.min(graphSize.height - radius, d.y || 0));
        return `translate(${d.x},${d.y})`;
      });

      // Update links
      selectAll('.link').each(function (d: Edge) {
        const root = createRoot(this as SVGElement);
        root.render(<GraphLink edge={d} radius={radius} />);
      });
    });

    return () => {
      setGraphRendered(true)
      selectAll('*').remove();
    };
  });


  // // Initial node distribution
  // useEffect(() => {


  //   if (!simulationRef.current) return;

  //   const dragBehavior = drag<SVGGElement, Vertex>()
  //     .on('start', (event, d) => {
  //       // Pause the simulation and fix the position of the node being dragged
  //       simulationRef.current?.alphaTarget(0.01).restart();
  //       d.fx = d.x;
  //       d.fy = d.y;
  //     })
  //     .on('drag', (event, d) => {
  //       // Update the node's position according to the drag event
  //       d.fx = event.x;
  //       d.fy = event.y;
  //     })
  //     .on('end', (event, d) => {
  //       // Unfix the node's position after dragging
  //       d.fx = null;
  //       d.fy = null;

  //       // Optionally, restart the simulation if you want the nodes to adjust their positions again
  //       simulationRef.current?.stop();
  //     });

  //   selectAll('.node').call(dragBehavior as any);


  //   return () => {
  //     simulation.stop();
  //   };
  // }, [graphRendered])


  // useEffect(() => {

  //   const svgContainer = select(graphContainerRef.current as SVGSVGElement)
  //   const svgGraph = svgContainer.selectAll(".graph")

  //   //////////////// Zoom behaviors ////////////////////////////////////////////////////

  //   const zoomBehavior = zoom<SVGSVGElement, unknown>()
  //     .scaleExtent([0.1, 3])
  //     .filter((event) => {
  //       // Allow zooming on wheel events and not on other events like drag
  //       return event.type === 'wheel' || event.type === 'dblclick';
  //     })
  //     .on('zoom', (event) => {
  //       svgGraph.attr('transform', event.transform);
  //     });

  //   const handleZoom = (event: WheelEvent) => {
  //     event.preventDefault();
  //     const currentTransform = zoomTransform(graphContainerRef.current as SVGSVGElement);
  //     const sensitivity = 0.001;

  //     const svgBounds = (graphContainerRef.current as SVGSVGElement).getBoundingClientRect();
  //     const mouseX = event.clientX - svgBounds.left;
  //     const mouseY = event.clientY - svgBounds.top;

  //     const scaleFactor = 1 - event.deltaY * sensitivity;
  //     const newScale = currentTransform.k * scaleFactor;
  //     const constrainedScale = Math.max(0.1, Math.min(newScale, 3));

  //     const x = currentTransform.x;
  //     const y = currentTransform.y;
  //     const k = currentTransform.k;

  //     const newX = mouseX - (mouseX - x) * (constrainedScale / k);
  //     const newY = mouseY - (mouseY - y) * (constrainedScale / k);

  //     const newTransform = zoomIdentity
  //       .translate(newX, newY)
  //       .scale(constrainedScale);

  //     svgContainer
  //       .transition()
  //       .duration(50)
  //       .call(zoomBehavior.transform as any, newTransform);
  //   };

  //   const resetZoom = () => {
  //     svgContainer.transition()
  //       .duration(100)
  //       .call(zoomBehavior.transform as any, zoomIdentity);
  //   };

  //   const resetButton = select('#reset-button')
  //   resetButton.on('click', resetZoom);

  //   svgContainer.call(zoomBehavior as any)
  //     .on("wheel.zoom", handleZoom)
  // }, [vertices])



  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function escHandler(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
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
    <div className='sm:grid grid-cols-6 place-items-center'>
      <div ref={dropdownRef} id='select' className=' col-span-6 mb-4 w-48'>
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
                  localStorage.setItem('selectedField', field.value)
                  setIsOpen(false);
                }}
              >
                {field.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <div ref={environmentRef} className={`col-span-6 w-full
                      flex flex-col items-center justify-center 
                     overflow-hidden bg-gray-200 rounded-3xl`}>
        <svg ref={graphContainerRef} className='graph-container'>
          <foreignObject id='reset-button' className={`cursor-pointer w-[50px] h-[50px] translate-x-[25px] translate-y-[25px]`}>
            <CenterFocusStrongRoundedIcon className={`w-${graphSize.width / 20} h-${graphSize.height / 20}`} />
          </foreignObject>
          <g className='graph' />
        </svg>
      </div>
    </div >
  );
};