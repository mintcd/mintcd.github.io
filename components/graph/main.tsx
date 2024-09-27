'use client'
import { useRef, useEffect, useState, RefObject } from 'react';
import { createRoot } from 'react-dom/client';

import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { select, selectAll } from 'd3-selection'
import { drag } from 'd3-drag'
import { forceSimulation, forceLink, forceCenter, forceCollide } from 'd3-force';

import VertexContent from '@components/statement-content';
import { getEdges, initiateLayout, computeNodeDepths, getVerticesOfTopic } from '@functions/graph-analysis';
import { useZoomBehavior } from '@components/graph/behaviors';
import GraphNode from '@components/graph/graph-node';
import GraphStyles from '@styles/graph';

export default function KnowledgeGraph({ graphData }: { graphData: Graph }) {
  const contentRef = useRef(null);
  const containerRef = useRef<SVGSVGElement>(null);
  const dropdownRef = useRef(null);
  const environmentRef: RefObject<HTMLDivElement> = useRef(null);

  const [graphRendered, setGraphRendered] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Vertex | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | "all-fields">('all-fields');

  function getFieldsWithAllOption(vertices: Vertex[]): { value: string; label: string }[] {
    const fieldsSet = new Set<string>();

    vertices.forEach(vertex => {
      if (vertex.fields) {
        vertex.fields.forEach(field => fieldsSet.add(field));
      }
    });

    const uniqueFields = Array.from(fieldsSet);

    // Sort the fields alphabetically
    uniqueFields.sort();

    return [{ value: "all-fields", label: "All Fields" },
    ...uniqueFields.map(field => ({
      value: field,
      label: field.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    })),];
  }

  const fields = getFieldsWithAllOption(graphData.vertices);

  const [params, setParams] = useState({
    width: 500,
    height: 500,
    radius: 10,
    fontSize: 3
  });

  let vertices = graphData.vertices;
  if (selectedField !== "all-fields") {
    vertices = getVerticesOfTopic(graphData.vertices, [selectedField]);
  }
  vertices = initiateLayout(vertices, 2 * params.radius, 2 * params.radius);

  let edges = getEdges(vertices);

  // Get window size
  useEffect(() => {
    setSelectedField(window.localStorage.getItem('selectedField') as Field || 'all-fields');
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

  // Hook for SVG Graph Rendering
  useEffect(() => {
    const graphContainer = select(containerRef.current as SVGSVGElement)
      .attr('width', params.width)
      .attr('height', params.height);

    const graph = graphContainer.select(".graph");

    const links = graph.selectAll("line")
      .data(edges)
      .enter()
      .append("g")
      .attr("class", "link-container")
      .append("line")
      .style("stroke", "#aaa")
      .attr("stroke-width", 0.5)
      .attr("marker-end", function (d) {
        const edge = d as Edge;
        return edge.relation && edge.relation === 'specializes' ? "url(#arrow-specializes)" : "url(#arrow)";
      });

    const nodes = graph
      .selectAll(".node")
      .data(vertices)
      .enter()
      .append("g")
      .attr("class", "node-container")
      .each(function (d: Vertex) {
        createRoot(this as any).render(
          <GraphNode
            vertex={d}
            radius={params.radius}
            setSelectedNode={setSelectedNode}
            selectedNode={selectedNode}
          />
        );
      });

    const simulation = forceSimulation(vertices)
      .alphaDecay(0.5)
      .force('center', forceCenter(params.width / 2, params.height / 2))
      .force('link', forceLink(edges)
        .distance(params.radius)
        .id(function (node) {
          const v = node as Vertex;
          return v.key ? v.key : '';
        }))
      .force('collide', forceCollide(1.5 * params.radius));

    simulation.on("tick", () => {
      nodes.attr("transform", function (d) {
        const v = d as Vertex;

        // Ensure x is within bounds
        v.x = Math.max(params.radius, Math.min(params.width - params.radius, v.x || 0));
        v.y = Math.max(params.radius, Math.min(params.height - params.radius, v.y || 0));

        return `translate(${v.x},${v.y})`;
      });

      links
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
    });

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
        simulation.alphaTarget(0).restart();
      })
      .on("end", function dragEndedHandler(event, d) {
        const v = d as Vertex;
        if (!event.active) simulation.alphaTarget(0);
        v.fx = undefined;
        v.fy = undefined;
      });

    nodes.call(nodeDrag as any);

    return () => {
      setGraphRendered(true);
      graph.selectAll('*').remove();
      simulation.stop();
    };
  }, [edges, vertices, selectedNode, params, graphRendered, selectedField]);

  useZoomBehavior(select(containerRef.current as SVGElement));

  useEffect(() => {
    if (graphRendered) {
      const graphContainer = select(containerRef.current as SVGSVGElement);
      graphContainer.selectAll(".shape").data(vertices)
        .style("opacity", (d) => {
          const v = d as Vertex;
          return selectedNode !== undefined && v.name === selectedNode.name ? 1 : 0.7;
        });
    }
  }, [vertices, selectedNode, graphRendered]);

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
                  localStorage.setItem('selectedField', field.value);
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
            <GraphStyles />
            <foreignObject id='reset-button' className='cursor-pointer w-[50px] h-[50px] translate-x-[25px] translate-y-[25px]'>
              <CenterFocusStrongRoundedIcon className={`w-${params.width / 20} h-${params.height / 20}`} />
            </foreignObject>
            <g className='graph'></g>
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
