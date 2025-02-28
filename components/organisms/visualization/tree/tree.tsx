'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getEdges, getPosition, depthCount, getBoundingRect } from './functions';

import Node from '../Node';
import Edge from '../edge';

import { AddIcon, EditIcon, DeleteIcon } from '@components/atoms/icons';

import styles from '@styles/styles'
import "./styles.css"

import GraphStyles from './styles';
import Loading from '@components/atoms/loading/loading';
import { useOnClickOutside } from '@node_modules/usehooks-ts/dist';

type ArgumentType = 'contention' | 'support' | 'objection' | 'premise'

export default function Tree({ data, fontSize = styles.fontSize, layerGap = 100, onUpdate }:
  { data?: Tree, fontSize?: number, layerGap?: number, onUpdate?: (value: Tree) => void }) {

  const root = {
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
    setClickedNode(null);
  })


  const [maxNodeWidth, setMaxNodeWidth] = useState(0)

  const [clickedNode, setClickedNode] = useState<TreeNode | null>(null)
  const [option, setOption] = useState<Option | null>(null)

  const [view, setView] = useState({
    width: 0,
    height: 0
  });

  const [tree, setTree] = useState<Tree>({ nodes: [root], edges: [] })

  function handleNodeClick(e: React.MouseEvent, v: TreeNode) {
    e.preventDefault();

    if (!containerRef.current) return;

    const svg = containerRef.current;
    const point = svg.createSVGPoint();
    point.x = v.x ?? 0;
    point.y = v.y ?? 0;

    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return;

    const transformedPoint = point.matrixTransform(screenCTM);

    setClickedNode({
      ...v,
      screenX: transformedPoint.x,
      screenY: transformedPoint.y
    });
  }

  function handleOptionClick(option: 'add' | 'edit' | 'delete') {
    setOption(prev => prev === option ? null : option);
  }

  function handleAdd(type: ArgumentType) {

    if (!clickedNode) return;
    const [depth, order] = [clickedNode.depth as number + 1, clickedNode.children?.length || 0]

    let newNode: TreeNode = {
      id: tree.nodes.length,
      type: type,
      content: [`New ${type}`],
      depth: depth,
      order: tree.nodes.find(node => node.id === clickedNode.id)?.children?.length || 0,
      shape: 'rect',
      color: nodeStyles[type].color,
      children: []
    }

    // Update nodes
    const newNodes = [...tree.nodes.map(node => (
      node.id === clickedNode.id
        ? {
          ...node,
          children: [...(node.children || []), newNode.id]
        }
        : node
    )), newNode]

    // Make sure to pass maxNodeWidth and fontSize to getBoundingRect
    newNode = getBoundingRect(newNode, maxNodeWidth, fontSize)
    // Then pass the updated nodes and view width to getPosition
    newNode = getPosition(newNode, newNodes, view.width)

    // Re-position other children and ensure they have proper bounding rects too
    const repositionedNodes = newNodes.map(node => {
      if (clickedNode.children?.includes(node.id) && node.id != newNode.id) {
        // Make sure existing nodes have proper bounding rects
        const nodeWithRect = getBoundingRect(node, maxNodeWidth, fontSize);
        return getPosition(nodeWithRect, newNodes, view.width);
      }
      return node;
    });

    setTree(prev => ({
      nodes: repositionedNodes,
      edges: [...prev.edges || [], { source: clickedNode.id, target: newNode.id }]
    }));

    setClickedNode(null);
  }

  function handleUpdateNode(nodeId: number, newValues: Partial<TreeNode>) {
    setTree(prev => {
      // First update the node with new values
      const updatedNodes = prev.nodes.map(node =>
        node.id === nodeId ? { ...node, ...newValues } : node
      );

      // Then recalculate its bounding rect and position
      return {
        ...prev,
        nodes: updatedNodes.map(node => {
          if (node.id === nodeId) {
            // Apply bounding rect with maxNodeWidth and fontSize
            const nodeWithRect = getBoundingRect(node, maxNodeWidth, fontSize);
            // Then reposition based on the updated rect
            return getPosition(nodeWithRect, updatedNodes, view.width);
          }
          return node;
        })
      };
    });
  }

  useEffect(() => {
    onUpdate && onUpdate(tree)
  }, [tree])

  useEffect(() => {
    const updateView = () => {
      if (environmentRef.current) {
        const rect = environmentRef.current.getBoundingClientRect();
        setView({
          width: rect.width,
          height: rect.height
        });

        setMaxNodeWidth(rect.width / 5);
      }
    };

    updateView();

    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  // New effect to reposition all nodes when view dimensions change
  useEffect(() => {
    setTree(prevTree => ({
      ...prevTree,
      nodes: prevTree.nodes.map(node => {
        const nodeWithRect = getBoundingRect(node, maxNodeWidth, fontSize);
        return getPosition(nodeWithRect, prevTree.nodes, view.width);
      })
    }));

  }, [maxNodeWidth]);

  return (
    <div ref={environmentRef} className={`tree flex flex-col items-center justify-center w-full`}>
      {view.width > 0 ?
        <svg ref={containerRef}
          className='graph-container'
          width={view.width}
          height={(Math.max(...tree.nodes.map(node => node.depth)) + 1) * layerGap +
            (Math.max(...tree.nodes.map(node => node.depth))) * 20}>
          <g className='graph'>
            <GraphStyles />
            {tree.nodes.map((node) => (
              <g className='node-container' key={node.id}
                onClick={(e) => handleNodeClick(e, node)}>
                <Node
                  key={node.id}
                  x={node.x ?? 0}
                  y={node.y ?? 0}
                  id={node.id}
                  shape='rect'
                  width={node.width}
                  height={node.height}
                  label={String(node.content)}
                  editing={option === 'edit' && clickedNode?.id === node.id}
                  onUpdate={(newValues: Partial<TreeNode>) => handleUpdateNode(node.id, newValues)}
                  color={node.color}
                />
              </g>

            ))}
            {tree.edges.map((edge, index) => (
              <g key={index}>
                <Edge
                  key={index}
                  edge={{
                    source: tree.nodes.find(v => v.id === edge.source) as TreeNode,
                    target: tree.nodes.find(v => v.id === edge.target) as TreeNode
                  }}
                />
              </g>

            ))}
          </g>
        </svg> : <Loading />}
      {clickedNode &&
        <div className='node-options' ref={nodeOptionsRef}>
          <div className={`fixed flex justify-between`}
            style={{
              fontSize: 9,
              width: clickedNode.width,
              left: `${clickedNode.screenX}px`,
              top: `${(clickedNode.screenY as number) + (clickedNode.height as number)}px`,
            }}>
            <AddIcon size={15} cursor='pointer' onClick={() => handleOptionClick('add')} />
            <EditIcon size={15} cursor='pointer' onClick={() => handleOptionClick('edit')} />
            <DeleteIcon size={15} cursor='pointer' onClick={() => handleOptionClick('delete')} />
          </div>
          {option === 'add' &&
            <div className={`fixed rounded-md`}
              style={{
                fontSize: 9,
                width: 'auto',
                left: `${clickedNode.screenX}px`,
                top: `${(clickedNode.screenY as number) + (clickedNode.height as number) + 15}px`,
              }}>
              <div className='hover:cursor-pointer hover:bg-gray-200 px-1'
                onClick={() => handleAdd('support')}>
                Add support
              </div>
              <div className='hover:cursor-pointer hover:bg-gray-200 px-1' onClick={() => handleAdd('objection')}> Add objection </div>
              <div className='hover:cursor-pointer hover:bg-gray-200 px-1' onClick={() => handleAdd('premise')}> Add premise </div>
            </div>
          }
        </div>
      }
    </div >
  );
}