export default [
  {
    name: 'Set Theory',
    color: '#6883ba',
    children: ['Topology', 'Linear Algebra']
  },
  {
    name: 'Linear Algebra'
  },
  {
    name: 'Topology',
    children: ['Real Analysis']
  },
  {
    name: 'Real Analysis',
    children: ['Calculus', 'Probability Theory', 'Measure Theory']
  },
  {
    name: 'Measure Theory',
    children: ['Probability Theory']
  },
  {
    name: 'Probability Theory',
    children: ['Stochastic Process']

  },
  {
    name: 'Calculus',
    children: ['Optimization']

  },
  {
    name: 'Optimization'
  },
  {
    name: 'Stochastic Process',
    children: ['Markov Chain']
  },
  {
    name: 'Markov Chain'
  },
] as Term[]