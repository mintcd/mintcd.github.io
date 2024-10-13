'use client';
import { useRef, useEffect, useState, RefObject } from 'react';
import { createRoot } from 'react-dom/client';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';
import { forceSimulation, forceLink, forceCenter, forceCollide } from 'd3-force';

import { getEdges, initiateLayout, getVerticesOfTopic } from '@functions/graph-analysis';
import { useZoomBehavior } from '@components/graph/behaviors';
import GraphNode from './graph-node';
import GraphLink from './graph-link';
import GraphStyles from './styles';
import { selectAll } from 'd3';

export default function KnowledgeGraph({ graphData }: { graphData: Graph }) {

  const contentRef = useRef(null);
  const containerRef = useRef<SVGSVGElement>(null);
  const dropdownRef = useRef(null);
  const environmentRef: RefObject<HTMLDivElement> = useRef(null);

  const [graphRendered, setGraphRendered] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Vertex | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | "all-fields">('all-fields');
  const [params, setParams] = useState({
    width: 500,
    height: 500,
    radius: 10,
    fontSize: 3
  });

  function getFieldsWithAllOption(vertices: Vertex[]): { value: string; label: string }[] {
    const fieldsSet = new Set<string>();
    vertices.forEach(vertex => {
      if (vertex.field) {
        vertex.field.forEach(field => fieldsSet.add(field));
      }
    });

    const uniqueFields = Array.from(fieldsSet).sort();

    return [{ value: "all-fields", label: "All Fields" },
    ...uniqueFields.map(field => ({
      value: field,
      label: field.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    })),];
  }
  const fields = getFieldsWithAllOption(graphData.vertices);

  let vertices = graphData.vertices;
  if (selectedField !== "all-fields") {
    vertices = getVerticesOfTopic(graphData.vertices, [selectedField]);
  }
  vertices = initiateLayout(vertices, 2 * params.radius, 2 * params.radius);

  let edges = getEdges(vertices);

  useEffect(() => {
    setSelectedField(window.localStorage.getItem('selectedField') as Field || 'all-fields');
    const updateSize = () => {
      if (environmentRef.current) {
        const { width } = environmentRef.current.getBoundingClientRect();
        setParams({ width: width, height: width, radius: width / 40, fontSize: width / 300 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const graphContainer = select(containerRef.current as SVGSVGElement)
      .attr('width', params.width)
      .attr('height', params.height);

    const graph = graphContainer.select(".graph");

    const links = graph
      .selectAll(".link-container")
      .data(edges)
      .enter()
      .append("g")
      .attr("class", "link-container")
      .each(function (e: Edge) {
        createRoot(this as any).render(
          <GraphLink
            edge={e}
            radius={params.radius}
          />
        );
      })

    const nodes = graph
      .selectAll(".node-container")
      .data(vertices)
      .enter()
      .append("g")
      .attr("class", "node-container")
      .each(function (d: Vertex) {
        createRoot(this as any).render(
          <GraphNode
            vertex={d}
            radius={params.radius}
          />
        );
      })
      .on("click", (_, v) => setSelectedNode(v))

    const simulation = forceSimulation(vertices)
      .alpha(0.1) // Start with a lower alpha value
      .alphaDecay(0.05) // Slower decay for alpha
      .force('center', forceCenter(params.width / 2, params.height / 4))
      .force('link', forceLink(edges)
        .distance(params.radius)
        .id(function (node) {
          const v = node as Vertex;
          return v.name ? v.name : '';
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
        .select("line")
        .attr("x1", (d) => {
          const edge = d as any;
          const angle = Math.atan2(edge.target.y - edge.source.y, edge.target.x - edge.source.x);
          return edge.source.x + params.radius * Math.cos(angle);
        })
        .attr("y1", (d) => {
          const edge = d as any;
          const angle = Math.atan2(edge.target.y - edge.source.y, edge.target.x - edge.source.x);
          return edge.source.y + params.radius * Math.sin(angle);
        })
        .attr("x2", (d) => {
          const edge = d as any;
          const angle = Math.atan2(edge.source.y - edge.target.y, edge.source.x - edge.target.x);
          return edge.target.x + params.radius * Math.cos(angle);
        })
        .attr("y2", (d) => {
          const edge = d as any;
          const angle = Math.atan2(edge.source.y - edge.target.y, edge.source.x - edge.target.x);
          return edge.target.y + params.radius * Math.sin(angle);
        });
    });

    // Drag behavior
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
  }, [params, graphRendered, selectedField, edges, vertices]);

  useEffect(() => {
    selectAll(".node")
      .data(vertices)
      .select("circle")
      .attr("opacity", (v) => v.name === selectedNode?.name ? 1 : 0.5)
  })

  useZoomBehavior(select(containerRef.current as SVGElement));

  return (
    <div className=''>
      <div ref={dropdownRef} id='select' className='mb-4 w-48'>
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
      <div ref={environmentRef} className={`w-[70vw] flex flex-col items-center justify-center overflow-hidden`}>
        <div className='bg-gray-200 rounded-3xl'>
          <svg ref={containerRef} className='graph-container'>
            <GraphStyles />
            <foreignObject id='reset-button' className='cursor-pointer w-[50px] h-[50px] translate-x-[25px] translate-y-[25px]'>
              <CenterFocusStrongRoundedIcon className={`w-${params.width / 20} h-${params.height / 20}`} />
            </foreignObject>
            <g className='graph'>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
