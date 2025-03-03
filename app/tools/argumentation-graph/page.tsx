"use client"

import { useEffect, useRef, useState } from "react";
import Tree from "@components/organisms/visualization/tree";
import Button from "@components/atoms/button";

import axios from 'axios'
import { getEdges } from "@components/organisms/visualization/tree/functions";


export default function ArgumentationGraph() {

  const [isClient, setIsClient] = useState(false);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [mermaidCode, setMermaidCode] = useState<string>("")

  const notionIcon = <svg width={30} height={30}>
    <path fillRule="evenodd"
      clipRule="evenodd"
      d="M18.405.068l-16.6 1.226C.466 1.41 0 2.285 0 3.334v18.198c0 .817.29 1.516.99 2.45l3.902 5.074c.641.817 1.224.992 2.448.934l19.277-1.167c1.63-.116 2.097-.875 2.097-2.158V6.192c0-.663-.262-.854-1.033-1.42a85.473 85.473 0 01-.133-.096L22.25.943c-1.282-.932-1.806-1.05-3.845-.875zM7.776 5.857c-1.574.106-1.931.13-2.825-.597L2.678 3.452c-.231-.234-.115-.526.467-.584l15.958-1.166c1.34-.117 2.038.35 2.562.758l2.737 1.983c.117.059.408.408.058.408l-16.48.992-.204.014zM5.941 26.49V9.11c0-.759.233-1.109.931-1.168L25.8 6.834c.642-.058.932.35.932 1.108v17.264c0 .759-.117 1.401-1.165 1.459l-18.113 1.05c-1.048.058-1.513-.291-1.513-1.225zm17.88-16.448c.116.525 0 1.05-.525 1.11l-.873.173v12.832c-.758.408-1.456.641-2.039.641-.932 0-1.165-.292-1.863-1.166l-5.709-8.982v8.69l1.806.409s0 1.05-1.457 1.05l-4.017.233c-.117-.234 0-.817.407-.933l1.049-.291v-11.49L9.144 12.2c-.117-.525.174-1.283.99-1.342l4.31-.29 5.94 9.098v-8.049l-1.514-.174c-.117-.643.349-1.11.931-1.167l4.02-.234z"
      fill="#000">
    </path>
  </svg>

  async function handleExport() {
    console.log("exporting...")
    await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/notion/page/test`, {
      type: 'code',
      content: mermaidCode,
    },
      {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(res => console.log(res))
      .catch(err => console.log(err.message));

  }

  const chartRef = useRef<HTMLPreElement | null>(null); // Type the ref to HTMLPreElement

  useEffect(() => {
    setIsClient(true); // Ensures rendering only happens on the client
  }, []);

  useEffect(() => {
    const treeToMermaid = (nodes: TreeNode[]) => {
      let mermaidCode = `graph TD\n`;
      nodes.forEach(node => {
        if (node.content.length > 1) {
          mermaidCode += `subgraph ${node.id}\n${node.content.map((content, index) => `${node.id}_${index}["${content}"]`).join('\n')}\nend\n`;
        } else {
          mermaidCode += `${node.id}["${node.content}"]\n`;
        }
      });


      const edges = getEdges(nodes)

      // Add dependencies (support, objections)
      edges.forEach(edge => {
        // Create edges between nodes based on dependencies
        mermaidCode += `${edge.source} --> ${edge.target}\n`;
      });

      return mermaidCode;
    };

    setMermaidCode(treeToMermaid(tree));
  }, [tree])

  console.log(mermaidCode)

  return (
    <div className="flex flex-col items-center space-y-4">
      <Tree onUpdate={(value) => setTree(value)} />
      <Button
        text="Export"
        icon={notionIcon}
        listeners={{ onClick: (e) => handleExport() }}
        style={{ color: '#aaa' }}
      />
    </div>
  );

}
