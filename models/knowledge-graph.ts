export default [
  {
    name: `$\\sigma$-algebra`,
    key: 'sigma-algebra',
    type: `definition`,
    parents: []
  },
  {
    name: `Measurable space`,
    type: `definition`,
    parents: [`$\\sigma$-algebra`]
  },
  {
    name: `Measure`,
    type: `definition`,
    parents: [`Measurable space`]
  },
  {
    name: `Measure space`,
    type: `definition`,
    parents: [`Measurable space`, `Measure`]
  },
  {
    name: `Measure kernel`,
    type: `definition`,
    parents: [`Measurable space`, `Measure`]
  },
  {
    name: `Probability space`,
    type: `definition`,
    parents: [`Measure space`]
  },
  {
    name: `Distribution`,
    type: `definition`,
    parents: [`Probability space`]
  },
  {
    name: `Probability kernel`,
    type: `definition`,
    parents: [`Measure space`]
  },
  {
    name: `Almost everywhere`,
    type: `definition`,
    parents: [`Measure space`]
  },
  {
    name: `Measurable function`,
    type: `definition`,
    parents: [`Measurable space`]
  },
  {
    name: `$L^p$ space`,
    type: `theorem`,
    parents: [`Measurable function`, `Measure space`]
  },
  {
    name: `Random variable`,
    type: `definition`,
    parents: [`Measurable function`, `Probability space`]
  },
  {
    name: `Expectations`,
    type: `definition`,
    parents: [`Random variable`, `Probability space`]
  },
  {
    name: `Stochastic process`,
    type: `definition`,
    parents: [`Random variable`]
  },
  {
    name: `Martingale`,
    type: `definition`,
    parents: [`Expectations`, `Stochastic process`]
  },
  {
    name: `$\\L^p$ space`,
    type: `theorem`,
    parents: [`Stochastic process`]
  },
  {
    name: `Markov Process`,
    type: `definition`,
    parents: [`Stochastic process`]
  },
  {
    name: `Wiener Process`,
    type: `definition`,
    parents: [`Stochastic process`]
  },
  {
    name: `Itô Integral`,
    parents: [`Wiener Process`],
    type: `definition`
  },
  {
    name: `Itô formula`,
    parents: [`Itô Integral`],
    type: `definition`
  },
  // {
  //   name: `Derivative of a Function Evolved by a Semi-Group`,
  //   type: `theorem`,
  //   parents: [`Semi-group of Linear Operators`]
  // },
  // {
  //   name: `Kernel and Operator`,
  //   type: `lemma`,
  //   parents: [`Markov Operator`, `Probability Kernel`]
  // },
  {
    name: `Polish Space`,
    type: `definition`,
    parents: []
  },

  // {
  //   name: `Markov Operator`,
  //   type: `definition`,
  //   parents: [`Markov Process`]
  // },

  {
    name: `Martingale Problem`,
    type: `definition`,
    parents: [`Martingale`, `Polish Space`]
  },
  {
    name: `Normed Space`,
    type: `definition`,
    parents: []
  },
  {
    name: `Linear Operators Semigroup`,
    parents: [`Normed Space`]
  },
  {
    name: `Infinitesimal Generator`,
    parents: [`Linear Operators Semigroup`]
  },
  // {
  //   name: `Generator is Linear`,
  //   parents: [`Infinitesimal Generator`],
  //   type: `theorem`
  // },
  // {

  // {
  //   name: `Itô integral of a progressive, non-anticipative and square-integrable process`,
  //   parents: [],
  //   type: `definition`
  // },
  // {
  //   name: `Stochastic Differential Equation`,
  //   parents: [`Itô integral of a progressive, non-anticipative and square-integrable process`],
  //   type: `definition`
  // },
  // {
  //   name: `Kolmogorov Forward Equation`,
  //   parents: [`Infinitesimal Generator`]
  // },
  // {
  //   name: `Kolmogorov Backward Equation`,
  //   parents: [`Infinitesimal Generator`]
  // },
  // {
  //   name: `Reverse-time SDE`,
  //   parents: [`Kolmogorov Forward Equation`, `Kolmogorov Backward Equation`]
  // },
] as Vertex[]