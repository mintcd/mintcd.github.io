export default [
  {
    name: `Introduction`,
    statements: [
      {
        name: `stochastic process`,
        type: `definition`,

        content: `A stochastic process is a collection of random variable $\\{X(t)\\}_{t\\in T}$, where $T$ is an index set.`,
        parents: [],
        implications: [
          {
            name: ``,
            type: `definition`,
            content: `Usually, $T$ is $\\NN$ (discrete-time) or an interval of $\\RR_+$ (continuous-time).`,
          },
          {
            name: ``,
            type: `definition`,
            content: `For a fix $\\omega$, the map $t\\mapsto X(t,\\omega)$ is a sample path.`,
          },
          {
            name: ``,
            type: `notation`,
            content: `We may $X_t$ equivalently to $X(t)$.`,
          },
        ]
      },
      {
        name: `filtration and adaptation`,
        type: `definition`,

        content: `A filtration is a family of sub-$\\sigma$-algebra $\\{\\F_i\\}_{i\\in\\I}$ of $\\F$ such that $\\F_i\\subset\\F_j$ for any $i,j\\in\\I$ and $i\\le j$.`,
        implications: [
          {
            name: ``,
            type: `definition`,

            content: `The tuple $(\\Omega,\\F,\\{\\F_i\\},\\PP)$ is called an filtered probability space.`,
          },
          {
            name: ``,
            type: `definition`,
            content: `A stochastic process $\\{X_i\\}_{i\\in \\I}$ is called adapted to the given filtered probability space if $X_i$ is $\\F_i$-measurable for any $i\\in\\I$.`,
          },
          {
            name: ``,
            type: `definition`,
            content: `The filtration $\\{\\F_i\\}_{i\\in \\I}$ such that $\\F_i=\\sigma\\left(\\{X_j\\,|\\, j\\le i\\}\\right)$ is called the canonical filtration of the stochastic process $\\{X_i\\}_{i\\in \\I}$.`,
          },
        ]
      },
      {
        name: `Wiener process (Brownian motion)`,
        type: `example`,
        content: ``,
      },
    ]
  },
  {
    name: `Stochastic Differential Equations`,
    notations: [],
    statements: [
      {
        name: ``,
        type: ``,
        content: `Usually, $T$ is $\\NN$ (discrete-time) or an interval of $\\RR_+$ (continuous-time).`,
      },
    ]
  }
] as Chapter[]