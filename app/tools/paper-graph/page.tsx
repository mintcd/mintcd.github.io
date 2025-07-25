'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Search from './Search';
import { fetchFromNotionDatabase, fetchNotionBlock, fetchNotionPage, getOpenUrl } from './utils';
import { OpenIcon, LightbulbIcon } from '@public/icons';
import PaperCard from './PaperCard';
import { useClickOutside } from '@hooks';

type GraphNode = Paper & {
  x: number, y: number, fx: number | null, fy: number | null
}

type Link = {
  source: string;
  target: string;
};

type GraphData = {
  nodes: GraphNode[];
  links: Link[];
};

let cachedAuthorNames: Record<string, string> = {};

export default function PaperGraph() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<GraphData | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<GraphNode | null>(null);
  const [abstracts, setAbstracts] = useState<Record<string, string>>({});
  const [abstractExpanded, setAbstractExpanded] = useState(false)
  const [citationCache, setCitationCache] = useState<{
    [paperId: string]: {
      references: any[],
      citations: any[],
    }
  }>({});
  const [lightbulbData, setLightbulbData] = useState<{
    references: any[],
    citations: any[],
    open: boolean,
  }>({ references: [], citations: [], open: false });
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const suggestionRef = useRef<HTMLDivElement>(null);
  useClickOutside(suggestionRef, () => setLightbulbData(d => ({ ...d, open: false })))

  useEffect(() => {
    async function fetchData() {
      const paperFilter = { property: "status", select: { equals: "shown" } };
      const nodes: GraphNode[] = await fetchFromNotionDatabase("papers", paperFilter);

      // Collect all unique author IDs
      const authorIds = new Set<string>();
      for (const node of nodes) {
        if (Array.isArray(node.authors)) {
          node.authors.forEach((id: string) => authorIds.add(id));
        }
      }

      // Fetch author pages in bulk
      if (authorIds.size > 0) {
        const authors = await fetchFromNotionDatabase("authors");

        cachedAuthorNames = Object.fromEntries(
          authors.map((a: any) => [a.id, a.name ?? a.title ?? ""])
        );
      }

      // Replace author IDs with names
      for (const node of nodes) {
        if (Array.isArray(node.authors)) {
          node.authors = node.authors.map((id: string) => cachedAuthorNames[id] ?? id);
        }
      }

      const links: Link[] = [];
      for (const item of nodes) {
        const sourceId = item.id;
        const references: string[] = item.references ?? [];
        for (const targetId of references) {
          links.push({ source: sourceId, target: targetId });
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

    setClickedNode(node);
    if (!(node.id in abstracts)) {
      const abs = await fetchNotionBlock(node.id);
      setAbstracts(prev => ({ ...prev, [node.id]: abs.data }));
    }
  }

  async function handleSuggest() {
    if (!clickedNode) return;

    const paperId = clickedNode.id;

    // Use cached data if available
    if (citationCache[paperId]) {
      setLightbulbData({
        ...citationCache[paperId],
        open: true,
      });
      return;
    }

    setSuggestionLoading(true);

    // Otherwise, fetch
    const referenceIds = clickedNode.references ?? [];
    const references = await Promise.all(referenceIds.map(async (refId) => {
      const result = await fetchNotionPage(refId);
      return result;
    }));

    const citationIds = clickedNode.citations ?? [];
    const citations = await Promise.all(citationIds.map(async (refId) => {
      const result = await fetchNotionPage(refId);
      return result;
    }));

    const newEntry = { references, citations };

    // Cache it
    setCitationCache(prev => ({
      ...prev,
      [paperId]: newEntry,
    }));

    // Show modal
    setLightbulbData({
      ...newEntry,
      open: true,
    });

    setSuggestionLoading(false)
  }

  return (
    <div className="relative w-full h-full overflow-hidden flex">

      <div className='w-[20%]  border-gray-300 '>
        <div className='flex m-3 justify-between items-center'>
          <Search
            knownIds={new Set(data?.nodes.map(n => n.id))}
            onSelect={async (paperNode) => {
              setData(oldData => {
                if (!oldData) return { nodes: [paperNode], links: [] };
                return {
                  ...oldData,
                  nodes: [...oldData.nodes, paperNode],
                };
              });
            }}
          />
          {!data && <span>Fetching graph...</span>}
          {suggestionLoading && <span>Loading suggestions...</span>}

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

      {clickedNode &&
        <div className="w-[30%] bg-slate-100 rounded-md p-2 h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200">
          <div className='flex justify-between'>
            <span className="font-semibold text-sm text-blue-700 truncate">
              {clickedNode.title}
            </span>
            <span className='flex'>
              <LightbulbIcon className='mr-2 cursor-pointer' size={18} onClick={(e) => {
                e.stopPropagation();
                handleSuggest()
              }} />
              <OpenIcon size={18} className='cursor-pointer' onClick={(e) => {
                e.stopPropagation();
                const url = getOpenUrl(clickedNode);
                if (url) window.open(url, '_blank');
              }} />
            </span>

          </div>
          <div className='flex justify-between'>
            {clickedNode.authors && clickedNode.authors.length > 0 && (
              <span className="text-xs text-gray-600 mt-1">
                {Array.isArray(clickedNode.authors)
                  ? clickedNode.authors.join(', ')
                  : String(clickedNode.authors)}
              </span>
            )}
            {typeof clickedNode.citationCount === 'number' && (
              <span className="text-xs text-gray-600 mt-1">
                {clickedNode.citationCount} citations
              </span>
            )}
          </div>

          {abstracts[clickedNode.id] &&
            <div onClick={() => setAbstractExpanded(!abstractExpanded)}>
              <strong>Abstract. </strong>
              {
                abstractExpanded
                  ? abstracts[clickedNode.id]
                  : abstracts[clickedNode.id].slice(0, 200) + '...'
              }
            </div>
          }
        </div>}

      {lightbulbData.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={suggestionRef} className="bg-white w-[1/2] max-h-[80vh] p-6 rounded shadow overflow-y-auto">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">References</h3>
              {lightbulbData.references.length === 0 ? (
                <p className="text-sm text-gray-500"> No references found.</p>
              ) : (
                <>
                  {lightbulbData.references
                    .sort((a, b) => b.citationCount - a.citationCount)
                    .map((paper) => <PaperCard key={paper.id} paper={paper} />)}
                </>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Citations</h3>
              {lightbulbData.citations.length === 0 ? (
                <p className="text-sm text-gray-500">No citations found.</p>
              ) : (
                <>
                  {lightbulbData.citations
                    .sort((a, b) => b.citationCount - a.citationCount)
                    .map((paper) =>
                      <PaperCard key={paper.id} paper={paper} />)}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
