'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getEdges, createNode, getLayout } from './functions';

import Node from '../Node';
import Edge from '../Edge';

import { AddIcon, EditIcon, DeleteIcon } from '@components/atoms/icons';

import styles from '@styles/styles'
import "./styles.css"

import GraphStyles from './styles';
import Loading from '@components/atoms/loading';
import { useOnClickOutside } from '@node_modules/usehooks-ts/dist';
import { useSize } from '@hooks';
import useTransform from '@hooks/useTransform';

type ArgumentType = 'contention' | 'support' | 'objection' | 'premise'

export default function Tree({ data, fontSize = styles.fontSize, layerGap = 100, onUpdate }:
  {
    data?: TreeNode[],
    fontSize?: number,
    layerGap?: number,
    onUpdate?: (value: TreeNode[]) => void
  }) {

  const root: TreeNode = {
    id: 0,
    type: "contention",
    content: ["contention"],
    depth: 0,
    order: 0,
    children: [],
    color: '#3288ba'
  }

  const nodeStyles: { [key in NodeType]: { color: string } } = {
    contention: {
      color: "#3288ba"
    },
    support: {
      color: "#41b42b"
    },
    objection: {
      color: "#b51823"
    },
    premise: {
      color: "#e9eef4"
    }
  }

  const containerRef = useRef<SVGSVGElement>(null);
  const environmentRef = useRef<HTMLDivElement>(null);
  const nodeOptionsRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(nodeOptionsRef, () => {
    setOption(null)
    setSelectedNode(null);
  })


  const [selectedNode, setSelectedNode] = useState<TreeNode & { order?: number } | null>(null)
  const [option, setOption] = useState<Option | null>(null)

  const view = useSize(environmentRef)
  const maxNodeWidth = view.width / 5;

  const [nodes, setNodes] = useState<TreeNode[]>([root])
  const [layout, setLayout] = useState<TreeLayout>({})

  const [optionsPosition, setOptionsPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
  const selectedNodeLayout = layout[selectedNode?.id ?? 0] ?? { x: 0, y: 0 };

  const edges = getEdges(nodes)

  function handleNodeClick(e: React.MouseEvent, node: TreeNode) {
    e.preventDefault();
    setOption(null)
    setSelectedNode(node)
  }

  function handleOptionClick(option: 'add' | 'edit' | 'delete') {
    setOption(option);
  }

  function handleAdd(type: ArgumentType) {
    if (!selectedNode) return;

    let newNode: TreeNode = {
      id: nodes.length,
      type: type,
      content: [`New ${type}`],
      depth: selectedNode.depth + 1,
      order: selectedNode.children.length,
      shape: 'rect',
      color: nodeStyles[type].color,
      children: []
    };

    const newNodes = nodes.map(node =>
      node.id === selectedNode.id
        ? { ...node, children: [...node.children, newNode.id] }
        : node
    ).concat(newNode)

    const newLayout = getLayout(newNodes, maxNodeWidth, view.width)

    setNodes(newNodes);
    setLayout(newLayout)
    setSelectedNode(null)
  }


  function handleExtend() {
    if (!selectedNode) return
    const newNodes = nodes.map(node => node.id === selectedNode.id ? {
      ...node,
      content: [...node.content, "New peer"]
    } : node
    )
    const newLayout = getLayout(newNodes, maxNodeWidth, view.width)

    setNodes(newNodes)
    setLayout(newLayout)
    setSelectedNode(null)
  }

  function handleUpdateNode(value: string) {
    setNodes(prev => {
      // First update the node with new values
      const updatedNodes = prev.map(node =>
        node.id === selectedNode?.id
          ? (
            selectedNode.order
              ? {
                ...node,
                content: node.content.map((subnode, index) =>
                  index === selectedNode.order
                    ? createNode(value, maxNodeWidth)
                    : subnode)
              }
              : {
                ...node,
                content: [createNode(value, maxNodeWidth)]
              }
          )
          : node
      );

      return {
        ...prev,
        nodes: updatedNodes
      }
    });
  }

  useEffect(() => {
    onUpdate && onUpdate(nodes)
  }, [nodes])

  // Reposition nodes when view dimensions change
  useEffect(() => {
    const newLayout = getLayout(nodes, maxNodeWidth, view.width)
    setLayout(newLayout);
  }, [view.width]);

  console.log(layout)

  // Get position of options
  useEffect(() => {
    if (!selectedNode) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    setOptionsPosition({
      x: layout[selectedNode.id]?.x + rect.left,
      y: layout[selectedNode.id]?.y + rect.top + (layout[selectedNode.id]?.height || 0)
    });
  }, [selectedNode, layout]);

  console.log(nodes, layout)

  return (
    <div ref={environmentRef} className={`nodes flex flex-col items-center justify-center w-full`}>
      {view.width > 0 ?
        <svg ref={containerRef}
          className='graph-container'
          width={view.width}
          height={(Math.max(...nodes.map(node => node.depth)) + 1) * layerGap +
            (Math.max(...nodes.map(node => node.depth))) * 20}>
          <g className='graph'>
            <GraphStyles />
            {nodes.map((node, nodeIndex) => (
              <g className='node-container' key={node.id}
                onClick={(e) => handleNodeClick(e, node)}>
                {node.content.length > 1
                  && <rect
                    width={layout[node.id].width}
                    height={layout[node.id].height}
                    fill={'#aaa'}
                    opacity={0.5}
                    rx={2}
                    ry={2}
                    transform={`translate(${layout[node.id].x}, ${layout[node.id].y})`}
                  />}

                {node.content.map((subnode, subnodeIndex) => (
                  <Node
                    id={`${node.id}-${subnodeIndex}`}
                    key={`${node.id}-${subnodeIndex}`}
                    x={layout[node.id].subLayouts[subnodeIndex].x as number}
                    y={layout[node.id].subLayouts[subnodeIndex].y as number}
                    shape="rect"
                    width={layout[node.id].subLayouts[subnodeIndex].width}
                    height={layout[node.id].subLayouts[subnodeIndex].height}
                    label={subnode}
                    editing={option === "edit" && selectedNode?.id === node.id}
                    onUpdate={(value) => handleUpdateNode(value)}
                    color={node.color}
                  />
                ))}
              </g>

            ))}
            {edges.map((edge, index) => (
              <g key={index}>
                <Edge
                  key={index}
                  source={layout[edge.source]}
                  target={layout[edge.target]}
                />
              </g>

            ))}
          </g>
        </svg>
        : <Loading />
      }
      {selectedNode &&
        <div className='node-options' ref={nodeOptionsRef}>
          {option === null
            && < div className={`fixed flex justify-between`}
              style={{
                fontSize: 9,
                width: layout[selectedNode.id].width,
                left: `${optionsPosition.x}px`,
                top: `${optionsPosition.y}px`,
              }}>
              <AddIcon size={15} cursor='pointer' onClick={() => handleOptionClick('add')} />
              <EditIcon size={15} cursor='pointer' onClick={() => handleOptionClick('edit')} />
              <DeleteIcon size={15} cursor='pointer' onClick={() => handleOptionClick('delete')} />
            </div>}
          {option === 'add' &&
            <div className={`fixed rounded-md`}
              style={{
                fontSize: 9,
                width: 'auto',
                left: `${optionsPosition.x}px`,
                top: `${optionsPosition.y}px`,
              }}>
              <div className='hover:cursor-pointer hover:bg-gray-200 px-1'
                onClick={() => handleAdd('support')}>
                Add support
              </div>
              <div className='hover:cursor-pointer hover:bg-gray-200 px-1' onClick={() => handleAdd('objection')}> Add objection </div>
              <div className='hover:cursor-pointer hover:bg-gray-200 px-1' onClick={() => handleAdd('premise')}> Add premise </div>
              <div className='hover:cursor-pointer hover:bg-gray-200 px-1' onClick={() => handleExtend()}> Add peer </div>
            </div>
          }
        </div>
      }
    </div >
  );
}