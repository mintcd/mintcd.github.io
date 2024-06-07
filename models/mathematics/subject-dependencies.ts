export default [
  {
    name: `Set Theory`,
    color: `#6883ba`,
    parents: []
  },
  {
    name: `Linear Algebra`,
    parents: [`Set Theory`]
  },
  {
    name: `Topology`,
    parents: [`Set Theory`]
  },
  {
    name: `Abstract Algebra`,
    parents: [`Set Theory`]
  },
  {
    name: `Real Analysis`,
    href: `real-analysis`,
    parents: [`Topology`]
  },
  {
    name: `Functional Analysis`,
    parents: [`Linear Algebra`, 'Real Analysis']
  },
  {
    name: `Calculus`,
    parents: [`Real Analysis`]

  },
  {
    name: `Measure Theory`,
    href: `measure-theory`,
    parents: [`Real Analysis`]
  },
  {
    name: `Probability Theory`,
    parents: [`Measure Theory`]

  },
  {
    name: `Optimization`,
    parents: [`Real Analysis`]
  },

  {
    name: `Statistics`,
    parents: [`Probability Theory`]
  },
  {
    name: `Stochastic Process`,
    parents: [`Probability Theory`]
  },
  {
    name: `Markov Chain`,
    parents: [`Stochastic Process`]

  },
] as Vertex[]