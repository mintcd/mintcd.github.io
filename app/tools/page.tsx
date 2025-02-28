import Tree from "@components/organisms/visualization/tree"

export default function ArgumentationGraph() {
  const tree: Tree = {
    nodes: [
      {
        id: 0,
        type: "contention",
        content: ["We should not kill animals"],
        depth: 0,
        order: 0,
      }
    ],
    edges: []
  };

  return (
    <Tree />
  )

}