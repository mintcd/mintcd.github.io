export default {
  vertices: [
    {
      name: 'set-theory',
      color: '#6883ba'
    },
    {
      name: 'linear-algebra'
    },
    {
      name: 'topology'
    },
    {
      name: 'real-analysis'
    },

    {
      name: 'measure-theory'
    },
    {
      name: 'probability-theory'
    },
    {
      name: 'calculus'
    },
    {
      name: 'optimization'
    },
    {
      name: 'stochastic-processes'
    },
    {
      name: 'markov-chain'
    },
  ],
  edges: [
    {
      source: 'set-theory',
      target: 'topology'
    },
    {
      source: 'set-theory',
      target: 'linear-algebra'
    },
    {
      source: 'topology',
      target: 'real-analysis'
    },
    {
      source: 'real-analysis',
      target: 'measure-theory'
    },
    {
      source: 'real-analysis',
      target: 'probability-theory'
    },
    {
      source: 'real-analysis',
      target: 'calculus'
    },
    {
      source: 'real-analysis',
      target: 'optimization'
    },
    {
      source: 'calculus',
      target: 'optimization'
    },
    {
      source: 'measure-theory',
      target: 'probability-theory'
    },
    {
      source: 'probability-theory',
      target: 'stochastic-processes'
    },
    {
      source: 'stochastic-processes',
      target: 'markov-chain'
    },

  ]
} as Graph