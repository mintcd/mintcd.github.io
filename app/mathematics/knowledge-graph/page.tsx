import KnowledgeGraph from '@components/knowledge-graph';
import graph from '@models/knowledge-graph'

const App = () => {
  return (
    <KnowledgeGraph graph={graph} radius={50} />
  );
};

export default App;
