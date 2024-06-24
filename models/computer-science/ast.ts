export default {
  vertices: [
    {
      name: `$\\sigma$-algebra`, key: 'sigma-algebra', type: `definition`,
    },
    {
      name: `Measurable space`,
      type: `definition`,
    },
    {
      name: `Measure`,
      type: `definition`,
    },
    {
      name: `Measure space`,
      type: `definition`,
    },
    {
      name: `Measure kernel`,
      type: `definition`,
    },
    // {
    //   name: `Probability space`,
    //   type: `definition`,
    // },
    // {
    //   name: `Distribution`,
    //   type: `definition`,
    // },
    // {
    //   name: `Probability kernel`,
    //   type: `definition`,
    // },
    // {
    //   name: `Almost everywhere`,
    //   type: `definition`,
    // },
    // {
    //   name: `Measurable function`,
    //   type: `definition`,
    // },
    // {
    //   name: `$L^p$ space`,
    //   type: `theorem`,
    // },
    // {
    //   name: `Random variable`,
    //   type: `definition`,
    // },
    // {
    //   name: `Expectations`,
    //   type: `definition`,
    // },
    // {
    //   name: `Stochastic process`,
    //   type: `definition`,
    // },
    // {
    //   name: `Martingale`,
    //   type: `definition`,
    // },
    // {
    //   name: `$\\L^p$ space`,
    //   type: `theorem`,
    // },
    // {
    //   name: `Markov Process`,
    //   type: `definition`,
    // },
    // {
    //   name: `Wiener Process`,
    //   type: `definition`,
    // },
    // {
    //   name: `Itô Integral`,
    //   type: `definition`
    // },
    // {
    //   name: `Itô formula`,
    //   type: `definition`
    // },
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
    // {
    //   name: `Polish Space`,
    //   type: `definition`,
    // },
    // {
    //   name: `Markov Operator`,
    //   type: `definition`,
    //   parents: [`Markov Process`]
    // },
    // {
    //   name: `Martingale Problem`,
    //   type: `definition`,
    // },
    // {
    //   name: `Normed Space`,
    //   type: `definition`,
    // },
    // {
    //   name: `Linear Operators Semigroup`,
    // },
    // {
    //   name: `Infinitesimal Generator`,
    // },
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
    // }
  ],
  edges: [
    { source: `$\\sigma$-algebra`, target: `Measurable space` },
    { source: `$\\sigma$-algebra`, target: `Measure` },
    { source: `Measurable space`, target: `Measure space` },
    { source: `Measure`, target: `Measure space` }
  ]
} as Graph
