export default {
  vertices: [
    {
      name: 'set-theory'
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
      source: 'measure-theory',
      target: 'probability-theory'
    },

  ]
} as Graph