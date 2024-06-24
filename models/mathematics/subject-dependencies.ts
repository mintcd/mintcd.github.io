export default [
  {
    name: `Set Theory`,
    key: 'set-theory',
    color: `#6883ba`,
    href: 'set-theory'
  },
  {
    name: `Linear Algebra`,
    key: 'linear-algebra',
    color: `#6883ba`,
    parents: [
      { key: 'set-theory' }
    ]
  },
  {
    name: `Topology`,
    key: 'topology',
    color: `#6883ba`,
    parents: [
      { key: 'set-theory' }
    ]
  },
  {
    name: `Abstract Algebra`,
    color: `#6883ba`,
    parents: [
      { key: 'set-theory' }
    ]
  },
  {
    name: `Real Analysis`,
    href: `mathematics/real-analysis`,
    key: 'real-analysis',
    color: `#6883ba`,
    parents: [
      { key: 'topology' }
    ]
  },
  {
    name: `Functional Analysis`,
    color: `#6883ba`,
    key: 'functional-analysis',
    parents: [
      { key: 'real-analysis' }
    ]
  },
  {
    name: `Calculus`,
    color: `#6883ba`,
    key: 'calculus',
    parents: [
      { key: 'real-analysis' }
    ]

  },
  {
    name: `Measure Theory`,
    href: `measure-theory`,
    key: 'measure-theory',
    color: `#6883ba`,
    parents: [
      { key: 'real-analysis' }
    ]
  },
  {
    name: `Probability Theory`,
    color: `#6883ba`,
    key: 'probability-theory',
    parents: [
      { key: 'measure-theory' }
    ]
  },
  {
    name: `Optimization`,
    color: `#6883ba`,
    key: 'optimization',
    parents: [
      { key: 'real-analysis' }
    ]
  },
  {
    name: `Statistics`,
    color: `#6883ba`,
    key: 'statistics',
    parents: [
      { key: 'probability-theory' }
    ]
  },
  {
    name: `Stochastic Processes`,
    color: `#6883ba`,
    key: 'stochastic-process',
    parents: [
      { key: 'probability-theory' }
    ]
  },
] as Vertex[]
