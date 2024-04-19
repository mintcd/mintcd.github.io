export default [
  {
    chapterName: "Introduction",
    notations: [],
    statements: [
      {
        statementName: "stochastic process",
        type: "definition",
        content: `A collection of random variable $\\{X_i\\}_{i\\in \\I}$, where $\\I$ is an index set.`,
        dependants: [],
        implications: [
          {
            statementName: "",
            type: "definition",
            content: `Usually, $\\I$ is $\\NN$ (discrete-time) or an interval of $\\RR$ (continuous-time).`,
          },
        ]
      },
      {
        statementName: "filtration and adaptation",
        type: "definition",
        content: `A filtration is a family of sub-$\\sigma$-algebra $\\{\\F_i\\}_{i\\in\\I}$ of $\\F$ such that $\\F_i\\subset\\F_j$ for any $i,j\\in\\I$ and $i\\le j$.`,
        implications: [
          {
            statementName: "",
            type: "definition",
            content: `The tuple $(\\Omega,\\F,\\{\\F_i\\},\\PP)$ is called an filtered probability space.`,
          },
          {
            statementName: "",
            type: "definition",
            content: `A stochastic process $\\{X_i\\}_{i\\in \\I}$ is called adapted to the given filtered probability space if $X_i$ is $\\F_i$-measurable for any $i\\in\\I$.`,
          },
          {
            statementName: "",
            type: "definition",
            content: `The filtration $\\{\\F_i\\}_{i\\in \\I}$ such that $\\F_i=\\sigma\\left(\\{X_j\\,|\\, j\\le i\\}\\right)$ is called the canonical filtration of the stochastic process $\\{X_i\\}_{i\\in \\I}$.`,
          },
        ]
      },
    ]
  },
] as Chapter[]