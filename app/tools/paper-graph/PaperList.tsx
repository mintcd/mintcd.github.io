'use client';
import React from 'react';

interface Props {
  nodes: GraphNode[];
  hoveredNodeId: string | null;
  onHover: (id: string | null) => void;
  onClick: (node: GraphNode) => void;
}

export default function PaperList({ nodes, hoveredNodeId, onHover, onClick }: Props) {
  return (
    <div className='border-gray-300'>
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`p-3 border border-b-gray-300 
            ${hoveredNodeId === node.id ? 'bg-gray-100' : 'bg-white'} 
            rounded-lg shadow-sm cursor-pointer`}
          onMouseOver={() => onHover(node.id)}
          onMouseLeave={() => onHover(null)}
          onClick={() => onClick(node)}
        >
          <div className="text-sm">{node.title}</div>
          <div>
            {node.tags.map((tag) =>
              <span key={tag.name} style={{ backgroundColor: tag.color }} className='mt-2 mr-1 p-1 text-[10px] rounded-sm text-white opacity-60'>
                {tag.name}
              </span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
