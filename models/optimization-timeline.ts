export default [
  {
    name: "Optimization taxonomy",
    type: "definition",
    content: `1) Linear and nonlinear,
              <br/>
              2) Discrete and continuous,
              <br/>
              3) Constrained and Unconstrained,
              <br/>
              4) Convex and non-convex,
              <br/>
              5) Deterministic and stochastic,
              <br/>
              6) Differentiable and non-differentiable.
              `
    ,
    dependants: [],
  },
  {
    name: "KKT conditions",
    type: "theorem",
    content: `Consider the problem $\\mathcal{P}$ of minimizing a function $f$ over the constraint set
              $$K=\\{x\\in\\mathbb{R}^n : g_i(x) \\le 0, i\\in I \\text{ and } h_j(x) = 0, j\\in J\\},$$
              where $I=\\{1,\\cdots,\\ell\\}$ is the index set of inequality constraints and $J=\\{1,\\cdots,m\\}$ is the index set of equality constraints. The function $g_i, i\\in I$ and $h_j,j\\in J$ are assumed to be differentiable. If a point $x^*$ is a minimum of $f$, then there exist $p_0\\in\\mathbb{R}_+, p\\in\\mathbb{R}^\\ell$ and $q\\in\\mathbb{R}^m$ such that
              $$\\begin{cases}
              (p_0,p,q) \\ne 0; \\\\
              p_0\\nabla f(x^*) + \\sum\\limits_{i\\in I} p_i \\nabla g_i(x^*) +  \\sum\\limits_{j\\in J} q_j \\nabla g_j(x^*)= 0 & \\text{(necessary condition)};\\\\
              \\sum\\limits_{i} p_ig_i(x^*) = 0 & \\text{(exclusive condition)}.
              \\end{cases}$$
              `
    ,
    dependants: [],
    implications: [
      {
        name: "",
        type: "note",
        content: `The exclusive condition means that $p_i\\ne 0$ if and only if $g_i(x^*) = 0$. If $g_i(x^*) = 0$, we call $g_i$ a <i>saturated</i> condition.`,
        dependants: [],
      },
    ]
  },

] as Statement[]