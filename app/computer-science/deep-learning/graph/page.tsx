import KnowledgeGraph from '@components/knowledge-graph'

import data from '@models/computer-science/architecture-dependencies'

export default function Mathematics() {
  return (
    <div>
      <KnowledgeGraph graph={data} />
    </div>
  )
};