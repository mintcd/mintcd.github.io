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
    name: `Real Analysis`,
    parents: [`Topology`]
  },
  {
    name: `Measure Theory`,
    parents: [`Real Analysis`]
  },
  {
    name: `Probability Theory`,
    parents: [`Measure Theory`, `Real Analysis`]

  },

  {
    name: `Calculus`,
    parents: [`Real Analysis`]

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
] as Term[]