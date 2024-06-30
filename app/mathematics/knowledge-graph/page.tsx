import KnowledgeGraph from '@components/knowledge-graph';
import graph from '@models/knowledge-graph'

const App = () => {
  return (
    <KnowledgeGraph graphData={graph} lectureView={true} filter={true} />
  );
};

export default App;
