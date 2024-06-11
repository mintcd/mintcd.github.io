export default {
  vertices: [
    {
      name: `Set Theory`,
      color: `#6883ba`,
      href: 'set-theory'
    },
    {
      name: `Linear Algebra`,
      color: `#6883ba`,
    },
    {
      name: `Topology`,
      color: `#6883ba`,
    },
    {
      name: `Abstract Algebra`,
      color: `#6883ba`,
    },
    {
      name: `Real Analysis`,
      href: `mathematics/real-analysis`,
      color: `#6883ba`,
    },
    {
      name: `Functional Analysis`,
      color: `#6883ba`,
    },
    {
      name: `Calculus`,
      color: `#6883ba`,

    },
    {
      name: `Measure Theory`,
      href: `measure-theory`,
      color: `#6883ba`,
    },
    {
      name: `Probability Theory`,
      color: `#6883ba`,
    },
    {
      name: `Optimization`,
      color: `#6883ba`,
    },
    {
      name: `Statistics`,
      color: `#6883ba`,
    },
    {
      name: `Stochastic Processes`,
      color: `#6883ba`,
    },
  ],
  edges: [
    { source: 'Set Theory', target: 'Linear Algebra' },
    { source: 'Set Theory', target: 'Abstract Algebra' },
    { source: 'Set Theory', target: 'Topology' },
    { source: 'Set Theory', target: 'Topology' },
    { source: 'Topology', target: 'Real Analysis' },
    { source: 'Linear Algebra', target: 'Functional Analysis' },
    { source: 'Real Analysis', target: 'Functional Analysis' },
    { source: 'Real Analysis', target: 'Calculus' },
    { source: 'Real Analysis', target: 'Measure Theory' },
    { source: 'Real Analysis', target: 'Optimization' },
    { source: 'Measure Theory', target: 'Probability Theory' },
    { source: 'Probability Theory', target: 'Statistics' },
    { source: 'Probability Theory', target: 'Stochastic Processes' },
  ]
} as Graph
