import { Graph } from 'react-graph-vis';

const graph = {
  nodes: [
    { id: 1, label: 'A' },
    { id: 2, label: 'B' },
    { id: 3, label: 'C' },
  ],
  edges: [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 1, to: 3, dashes: true },
  ],
};

const options = {
  layout: {
    hierarchical: false,
  },
  edges: {
    smooth: {
      type: 'curvedCW',
      roundness: 0.5,
    },
  },
};

const App = () => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Graph graph={graph} options={options} />
    </div>
  );
};

export default App;
