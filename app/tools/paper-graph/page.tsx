'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Search from './Search';
import { fetchFromNotionDatabase, fetchNotionBlock, fetchNotionPage, fetchPapers } from './utils';
import PaperDetail from './PaperDetail';

export default function PaperGraph() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<GraphData | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    async function fetchData() {
      let nodes: GraphNode[] = await fetchPapers();

      console.log(nodes)

      const authors = await fetchFromNotionDatabase("authors") as _Author[];;

      const authorsById = authors.reduce((acc, author) => {
        acc[author.id] = author;
        return acc;
      }, {} as { [id: string]: _Author });

      // Adjust authors
      for (const node of nodes) {
        for (const author of node.authors ?? []) {
          author.name = authorsById[author.id]?.name;
        }
      }

      const links: GraphLink[] = [];
      for (const item of nodes) {
        for (const target of item.references ?? []) {
          links.push({ source: item.id, target: target.id });
        }
      }
      console.log(nodes)
      setData({ nodes, links });
    }

    fetchData();
  }, []);

  //Render
  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous renders

    const width = 800;
    const height = 600;

    const citationCounts = data.nodes.map(d => d.citationCount ?? 0);
    const minCite = d3.min(citationCounts) ?? 0;
    const maxCite = d3.max(citationCounts) ?? 1;

    const radiusScale = d3.scaleSqrt()
      .domain([minCite, maxCite])
      .range([30, 60]);

    const simulation = d3
      .forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(20))
      .force('charge', d3.forceManyBody().strength(-50))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', 1.5)

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll<SVGCircleElement, GraphNode>('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', (d) => radiusScale(d.citationCount ?? 0) as number)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.8)
      .attr('data-id', d => d.id)

      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on('start', (event: any, data) => {
          const d = data as unknown as GraphNode
          if (!event.active) {
            simulation.alphaTarget(0.3).restart();
            simulation.force('center', null)
          };
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, data) => {
          const d = data as unknown as GraphNode
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: any, data) => {
          if (!event.active) simulation.alphaTarget(0);
          const d = data as unknown as GraphNode
          d.fx = null;
          d.fy = null;
        })
      );

    const label = svg
      .append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text(d => d.title.length > 8 ? d.title.slice(0, 6) + '…' : d.title)
      .attr('text-anchor', 'middle')             // center horizontally
      .attr('dominant-baseline', 'middle')       // center vertically
      .attr('font-size', 10)
      .attr('fill', '#fff')
      .attr('pointer-events', 'none');           // prevent interfering with dragging


    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('cx', d => d.x!).attr('cy', d => d.y!);
      label.attr('x', d => d.x! + 12).attr('y', d => d.y! + 4);

      label
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });
    return () => {
      simulation.stop();
    };
  }, [data]);

  useEffect(() => {
    if (!svgRef.current) return;

    const circles = svgRef.current.querySelectorAll('circle');

    circles.forEach((el) => {
      const id = el.getAttribute('data-id');
      if (!id) return;

      if (hoveredNodeId) {
        if (id === hoveredNodeId) {
          el.setAttribute('opacity', '1');
        } else {
          el.setAttribute('opacity', '0.3');
        }
      } else {
        el.setAttribute('opacity', '0.8');
      }
    });
  }, [hoveredNodeId]);


  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;

    function handleMouseOver(event: MouseEvent) {
      // event.target might be a <circle> or something else
      const target = event.target as Element;
      if (target.tagName === 'circle') {
        const id = target.getAttribute('data-id');
        if (id) setHoveredNodeId(id);
      } else {
        setHoveredNodeId(null);
      }
    }

    function handleMouseOut(event: MouseEvent) {
      // If leaving a circle, clear hover state
      const related = event.relatedTarget as Element | null;
      if (!related || (related.tagName !== 'circle')) {
        setHoveredNodeId(null);
      }
    }

    svg.addEventListener('mouseover', handleMouseOver);
    svg.addEventListener('mouseout', handleMouseOut);

    return () => {
      svg.removeEventListener('mouseover', handleMouseOver);
      svg.removeEventListener('mouseout', handleMouseOut);
    };
  });

  async function handlePaperClick(node: GraphNode) {
    if (clickedNode?.id === node.id) {
      setClickedNode(null);
      return;
    }

  }

  async function handlePaperSelect(paperNode: GraphNode) {
    console.log(paperNode)
    setData(oldData => {
      if (!oldData) return { nodes: [paperNode], links: [] };
      const newNodes = [...oldData.nodes, paperNode]
      const newLinks: GraphLink[] = [...oldData.links,
      ...(paperNode.references ?? []).map(ref => ({
        source: paperNode.id,
        target: ref.id,
      })),
      ...(paperNode.citations ?? []).map(cite => ({
        source: cite.id,
        target: paperNode.id,
      }))]
      return {
        nodes: newNodes,
        links: newLinks
      };
    });

  }


  return (
    <div className="relative w-full h-full overflow-hidden flex">

      <div className='w-[20%]  border-gray-300 '>
        <div className='flex m-3 justify-between items-center'>
          <Search
            knownPapers={data?.nodes ?? []}
            onSelect={handlePaperSelect}
          />
          {!data && <span>Fetching graph...</span>}

        </div>
        {data?.nodes.map((node) => (
          <div
            key={node.id}
            className={`p-3 border border-b-gray-300 
              bg-${hoveredNodeId === node.id ? 'gray-100' : 'white'} 
              rounded-lg shadow-sm`}
            onMouseOver={() => setHoveredNodeId(node.id)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onClick={() => handlePaperClick(node)}
          >
            <span className="text-sm">{node.title}</span>
          </div>
        ))}
      </div>

      <div className='w-[50%]'>
        <svg ref={svgRef} width="100%" height={600}></svg>
      </div>

      <PaperDetail paper={clickedNode} />
    </div>
  );
}
