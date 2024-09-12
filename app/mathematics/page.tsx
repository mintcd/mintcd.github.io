import KnowledgeGraph from "@components/graph/main";
import graphData from "@models/knowledge-graph";

export default function Mathematics() {
  return (
    <div>
      <KnowledgeGraph graphData={graphData}></KnowledgeGraph>
    </div>
  )
}