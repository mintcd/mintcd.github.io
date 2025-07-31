'use client';

import { useCallback, useState } from 'react';
import Search from './Search';
import { useFetchData } from './useFetchData';
import PaperList from './PaperList';
import { Loading } from '@components/atoms';
import GraphCanvas from './GraphCanvas';

export default function PaperGraph() {
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [clickedNode, setClickedNode] = useState<GraphNode | null>(null);
  const { data, loading, setData } = useFetchData();


  const handlePaperClick = useCallback(async (node: GraphNode | null) => {
    setClickedNode(prev => (prev?.id === node?.id ? null : node));
  }, [])

  const handlePaperSelect = useCallback(async (paperNode: GraphNode) => {
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
  }, [setData])

  return (
    loading
      ? <Loading />
      :
      <div className="paper-graph relative w-full h-full overflow-hidden flex">

        <div className='w-[30%] border-gray-300'>
          <Search
            knownPapers={data?.nodes ?? []}
            onSelect={handlePaperSelect}
          />
          <PaperList
            papers={data?.nodes ?? []}
            hoveredNode={hoveredNode}
            onHover={setHoveredNode}
            onClick={handlePaperClick}
            clickedPaper={clickedNode}
          />
        </div>

        <div className='w-[70%]'>
          <GraphCanvas
            data={data}
            hoveredNode={hoveredNode}
            clickedNode={clickedNode}
            setHoveredNode={setHoveredNode}
            setClickedNode={setClickedNode}
          />
        </div>
      </div>
  );
}
