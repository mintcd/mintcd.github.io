'use client'
import { useRef, useEffect, useState, RefObject } from 'react';
import { createRoot } from 'react-dom/client';

import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { select, selectAll } from 'd3-selection'
import { drag } from 'd3-drag'
import { forceSimulation, forceLink, forceCenter, forceCollide, forceRadial, forceManyBody } from 'd3-force';

import VertexContent from '@components/statement-content';
import { getEdges, initiateLayout, getVerticesOfTopic } from '@functions/graph-analysis';
import { useZoomBehavior } from '@components/graph/behaviors';
import GraphNode from '@components/graph/graph-node';

import "@styles/global.css"

export default function KnowledgeGraph(
  { graphData }: { graphData: Graph }
) {

  const contentRef = useRef(null);
  const containerRef = useRef<SVGSVGElement>(null);
  const dropdownRef = useRef(null);
  const environmentRef: RefObject<HTMLDivElement> = useRef(null);
  const [adjustedGraphData, setAdjustedGraphData] = useState(graphData)

  const [graphRendered, setGraphRendered] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Vertex | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | "all-fields">('all-fields');

  const fields = [
    { value: "all-fields", label: "All Fields" },
    { value: "measure-theory", label: "Measure Theory" },
    { value: "real-analysis", label: "Real Analysis" },
    { value: "probability-theory", label: "Probability Theory" },
  ];

  const [params, setParams] = useState({
    width: 500,
    height: 500,
    radius: 10,
    fontSize: 3
  })

  let vertices = graphData.vertices
  if (selectedField !== "all-fields") {
    vertices = getVerticesOfTopic(graphData.vertices, [selectedField])
  }

  vertices = initiateLayout(vertices, 2 * params.radius, 2 * params.radius)

  let edges = getEdges(vertices);


  // Get field and window size
  useEffect(() => {
    setSelectedField(window.localStorage.getItem('selectedField') as Field || 'all-fields')
    const updateSize = () => {
      if (environmentRef.current) {
        const { width, height } = environmentRef.current.getBoundingClientRect();
        setParams({ width: width, height: width, radius: width / 50, fontSize: width / 200 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);


  // Rendering
  useEffect(() => {
    const graphContainer = select(containerRef.current as SVGSVGElement)
      .attr('width', params.width)
      .attr('height', params.height)

    const graph = graphContainer.select(".graph")

    /////////////////////////////// Marker Styles /////////////////////////////////////////////////////////
    const markerStyles = graph.append("svg:defs")
    const markerSize = params.fontSize;

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

    const links = graph
      .selectAll(".link")
      .data(edges)
      .enter()
      .append("line")
      .attr("class", "link")
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

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const nodes = graph
      .selectAll(".node")
      .data(vertices)
      .enter()
      .append("g")
      .attr("class", "node-container")

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

    return () => {
      graph.selectAll('*').remove();
    };
  }, [graphRendered, selectedField, selectedNode]);

  useEffect(() => {
    const nodes = selectAll(".node-container").data(vertices);

    nodes.each(function (d: Vertex) {
      createRoot(this as any).render(
        <GraphNode
          vertex={d}
          radius={params.radius}
          setSelectedNode={setSelectedNode}
          selectedNode={selectedNode}
        />
      );
    });

    setGraphRendered(true)

  }, [graphRendered, params, selectedNode]);



  useEffect(() => {
    /////////////////////////// Simulation //////////////////////////////////////
    const simulation = forceSimulation(vertices)
      .alphaDecay(0.5)
      .force('center', forceCenter(params.width / 2, params.height / 2))
      .force(
        'link',
        forceLink(edges)
          .distance(params.radius)
          .id((node) => (node as Vertex).key || '')
      )
      .force('collide', forceCollide(1.5 * params.radius));

    simulation.on("tick", () => {
      selectAll(".node-container").attr("transform", function (d) {
        const v = d as Vertex;

        // Ensure x is within bounds
        v.x = Math.max(params.radius, Math.min(params.width - params.radius, v.x || 0));
        v.y = Math.max(params.radius, Math.min(params.height - params.radius, v.y || 0));

        return `translate(${v.x},${v.y})`;
      });

      selectAll(".link")
        .attr("x1", (d) => {
          const edge = d as any
          const angle = Math.atan2(edge.target.y - edge.source.y, edge.target.x - edge.source.x);
          return edge.source.x + params.radius * Math.cos(angle);
        })
        .attr("y1", (d) => {
          const edge = d as any
          const angle = Math.atan2(edge.target.y - edge.source.y, edge.target.x - edge.source.x);
          return edge.source.y + params.radius * Math.sin(angle);
        })
        .attr("x2", (d) => {
          const edge = d as any
          const angle = Math.atan2(edge.source.y - edge.target.y, edge.source.x - edge.target.x);
          return edge.target.x + params.radius * Math.cos(angle);
        })
        .attr("y2", (d) => {
          const edge = d as any
          const angle = Math.atan2(edge.source.y - edge.target.y, edge.source.x - edge.target.x);
          return edge.target.y + params.radius * Math.sin(angle);
        });

      selectAll(".link-text")
        .attr("x", function (d) {
          const edge = d as any
          return (edge.source.x + edge.target.x) / 2
        })
        .attr("y", function (d) {
          const edge = d as any
          return (edge.source.y + edge.target.y) / 2
        });
    })
    const applyDrag = () => {
      const nodeDrag = drag()
        .on("drag", (event, d) => {
          const v = d as Vertex;
          simulation.alphaTarget(0).restart();
          v.fx = event.x;
          v.fy = event.y;
        })
        .on("end", (event, d) => {
          const v = d as Vertex;
          if (!event.active) simulation.alphaTarget(0);
          v.fx = undefined;
          v.fy = undefined;
        });

      // Reapply drag behavior
      selectAll(".node-container").call(nodeDrag as any);
    };
    // Call applyDrag after the GraphNode components are rendered
    applyDrag();
  });

  useZoomBehavior(select(containerRef.current as SVGElement))

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
      <div ref={dropdownRef} id='select' className=' col-span-4 mb-4 w-48'>
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
      <div ref={environmentRef} className={`col-span-4 w-full
                      flex flex-col items-center justify-center 
                     overflow-hidden`}>
        <div className='bg-gray-200 rounded-3xl'>
          <svg ref={containerRef} className='graph-container'>
            <foreignObject id='reset-button' className='cursor-pointer w-[50px] h-[50px] translate-x-[25px] translate-y-[25px]'>
              <CenterFocusStrongRoundedIcon className={`w-${params.width / 20} h-${params.height / 20}`} />
            </foreignObject>
            <g className='graph'>
              <defs>
                <linearGradient id='definition-theorem' x1='0%' y1='0%' x2='100%' y2='0%'>
                  <stop offset='0%' style={{ stopColor: '#0288d1' }}></stop>
                  <stop offset='100%' style={{ stopColor: '#5bb561' }}></stop>
                </linearGradient>
              </defs>

            </g>
          </svg>
        </div>
      </div>
      <div
        className={`col-span-2 z-50 rounded-3xl sm:mt-0 sm:ml-5 mt-5
                      text-gray-800 w-full h-full`}
        ref={contentRef}>
        <VertexContent statement={selectedNode} />
      </div>
    </div >
  );
};