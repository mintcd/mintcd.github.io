'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Search from './Search';
import PaperDetail from './PaperDetail';
import { useFetchData } from './useFetchData';
import PaperList from './PaperList';
import { Loading } from '@components/atoms';

const MIN_SIZE = 5;
const MAX_SIZE = 20;
const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 700;


export default function PaperGraph() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<GraphNode | null>(null);
  const { data, loading, setData } = useFetchData();

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous renders

    const citationCounts = data.nodes.map(d => d.citationCount ?? 0);
    const minCite = d3.min(citationCounts) ?? 0;
    const maxCite = d3.max(citationCounts) ?? 1;

    const radiusScale = d3.scaleSqrt()
      .domain([minCite, maxCite])
      .range([MIN_SIZE, MAX_SIZE]);

    // Zoom group (wrap all visuals)
    const zoomGroup = svg.append('g');

    // Attach zoom behavior
    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 5])
        .wheelDelta((event: any) => -event.deltaY * 0.001)
        .on('zoom', (event: any) => {
          zoomGroup.attr('transform', event.transform);
        })
    );

    const simulation = d3
      .forceSimulation(data.nodes)
      .alphaDecay(0.08)
      .force('link', d3.forceLink(data.links)
        .id((d: any) => d.id)
        .distance(300)
        .strength(0.2)
      )
      // .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(GRAPH_WIDTH / 2, GRAPH_HEIGHT / 2))
      .force('collide', d3.forceCollide().radius(30).strength(1));

    const link = zoomGroup
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', 1);

    const node = zoomGroup
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll<SVGCircleElement, GraphNode>('circle')
      .data(data.nodes)
      .join('circle')
      .on('mouseover', (_, d: any) => setHoveredNodeId(d.id))
      .on('mouseout', () => setHoveredNodeId(null))
      .on('click', (_, d: any) => setClickedNode(prev => (prev?.id === d.id ? null : d)))
      .attr('r', (d) => radiusScale(d.citationCount ?? 0) as number)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.8)
      .attr('data-id', d => d.id)
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on('start', (event: any, d: any) => {
          if (!event.active) {
            simulation.alphaTarget(0.3).restart();
            simulation.force('center', null)
              .force('charge', null)
          }
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    const label = zoomGroup
      .append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text(d => `${d.authors[0].name}, ${d.year}`)
      .attr('font-size', 9)
      .attr('fill', '#000');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('cx', d => d.x!).attr('cy', d => d.y!);
      label.attr('x', d => d.x! + 12).attr('y', d => d.y! + 4);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  // Highlighting on hover
  useEffect(() => {
    if (!svgRef.current) return;

    const circles = svgRef.current.querySelectorAll('circle');

    circles.forEach((el) => {
      const id = el.getAttribute('data-id');
      if (!id) return;

      if (hoveredNodeId) {
        el.setAttribute('opacity', id === hoveredNodeId ? '1' : '0.3');
      } else {
        el.setAttribute('opacity', '0.8');
      }
    });
  }, [hoveredNodeId]);

  async function handlePaperClick(node: GraphNode) {
    setClickedNode(prev => (prev?.id === node.id ? null : node));
  }

  async function handlePaperSelect(paperNode: GraphNode) {
    setData(oldData => {
      if (!oldData) return { nodes: [paperNode], links: [] };
      const newNodes = [...oldData.nodes, paperNode];
      const newLinks: GraphLink[] = [
        ...oldData.links,
        ...(paperNode.references ?? []).map(ref => ({
          source: paperNode.id,
          target: ref.id,
        })),
        ...(paperNode.citations ?? []).map(cite => ({
          source: cite.id,
          target: paperNode.id,
        }))
      ];
      return { nodes: newNodes, links: newLinks };
    });
  }

  return (
    loading
      ? <Loading />
      :
      <div className="paper-graph relative w-full h-full overflow-hidden flex">

        <div className='w-[25%] border-gray-300'>
          <Search
            knownPapers={data?.nodes ?? []}
            onSelect={handlePaperSelect}
          />
          <PaperList
            papers={data?.nodes ?? []}
            hoveredNodeId={hoveredNodeId}
            onHover={setHoveredNodeId}
            onClick={handlePaperClick}
          />
        </div>

        <div className='w-[75%]'>
          <svg ref={svgRef} width="100%" height={GRAPH_HEIGHT}></svg>
        </div>

        <div
          className="absolute top-0 right-0 z-50 w-[30%] overflow-auto"
          style={{ maxHeight: 600 }}
        >
          <PaperDetail paper={clickedNode} />
        </div>
      </div>
  );
}
