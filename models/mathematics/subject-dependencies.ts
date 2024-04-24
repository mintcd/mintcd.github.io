export default [
  {
    name: 'set-theory',
    color: '#6883ba',
    children: ['topology', 'linear-algebra']
  },
  {
    name: 'linear-algebra'
  },
  {
    name: 'topology',
    children: ['real-analysis']
  },
  {
    name: 'real-analysis',
    children: ['calculus', 'probability-theory', 'measure-theory']
  },
  {
    name: 'measure-theory',
    children: ['probability-theory']
  },
  {
    name: 'probability-theory',
    children: ['stochastic-processes']

  },
  {
    name: 'calculus',
    children: ['optimization']

  },
  {
    name: 'optimization'
  },
  {
    name: 'stochastic-processes',
    children: ['markov-chain']
  },
  {
    name: 'markov-chain'
  },
] as Term[]