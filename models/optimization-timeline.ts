export default {
  notations: [],
  statements: [{
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
        content: `
        </br>
        (i) The exclusive condition means that $p_i\\ne 0$ if and only if $g_i(x^*) = 0$. 
        </br>
        (ii) For each $x\\in K$ we call $I(x) = \\{i\\in I : g_i(x) = 0\\}$ the set of <i>saturated</i> conditions.`,
        dependants: [],
      },
    ]
  },
  {
    name: "Qualification",
    type: "definition",
    content: `The set $K$ of <b>nonlinear</b> constraints is qualified at point $x^*\\in K$ if for all $\\lambda\\in\\RR^\\ell_+$ and $\\mu\\in\\RR^m$ satisfying
    $$\\begin{cases}
    \\sum\\limits_{i\\in I} \\lambda_i g_i(x^*) = 0; \\\\
    \\sum\\limits_{i\\in I} \\lambda_i \\nabla g_i(x^*) + \\sum\\limits_{j\\in J} \\mu_j \\nabla h_j(x^*)  = 0.
    \\end{cases}$$
    Then we necessarily have $\\lambda = 0$ and $\\mu = 0$.`
    ,
    dependants: [],
    implications: [
      {
        name: "",
        type: "note",
        content: `The constraint set $K$ is itself said to be qualified if it is qualified at every point $x\\in K$.`,
        dependants: [],
      },
    ]
  },
  {
    name: "KKT conditions at a qualified point",
    type: "theorem",
    content: `If $K$ is qualified at a minimum point $x^*$, then there exist $\\lambda\\in\\RR^\\ell_+$ and $\\mu\\in\\RR^m$ such that
    $$\\begin{cases}
    \\sum\\limits_{i\\in I} \\lambda_i g_i(x^*) = 0; \\\\
    \\nabla f(x^*) + \\sum\\limits_{i\\in I} \\lambda_i \\nabla g_i(x^*) + \\sum\\limits_{j\\in J} \\mu_j \\nabla h_j(x^*)  = 0.
    \\end{cases}$$`
    ,
    dependants: [],
    implications: [
      {
        name: "",
        type: "note",
        content: `This theorem permits $p$ in the first theorem to be taken as $1$ at qualified minimum point.`,
        dependants: [],
      },
    ]
  },
  {
    name: "Qualification criteria",
    type: "theorem",
    content: `If $x\\in K$ satisfying two following conditions
    </br>
    (i) The family $\\{\\nabla h_1(x),\\cdots,\\nabla h_m(x)\\}$ is linear independent;
    </br>
    (ii) There exists a vector $v\\in\\R^n$ such that
    $$\\langle g_i(x), v \\rangle < 0, \\forall i\\in I(x) \\text{ and } \\langle h_j(x), v \\rangle = 0, \\forall j\\in j.$$
    `
    ,
    dependants: [],
    implications: [
      {
        name: "",
        type: "note",
        content: `This theorem permits $p$ in the first theorem to be taken as $1$ at qualified minimum point.`,
        dependants: [],
      },
    ]
  },




  ] as Statement[]
}