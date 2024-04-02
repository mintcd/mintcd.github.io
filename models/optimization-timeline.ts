export default [
  {
    chapterName: "Introduction to Optimization",
    notations: [
      {
        name: "Optimization problem",
        content: ""
      },
      {
        name: "The set of constraints",
        content: "$K$"
      }
    ],
    statements: [
      {
        statementName: "Optimization taxonomy",
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
        statementName: "KKT conditions",
        type: "theorem",
        content: `Consider the problem 
                    $$\\begin{aligned}
                    (\\P) : \\text{minimize } & f(x) \\\\
                    \\text{s.t }              & g_i(x) \\le 0, i\\in I, \\\\
                                              & h_j(x) = 0, j\\in J,
                    \\end{aligned}
                    $$
                    where $I=\\{1,\\cdots,\\ell\\}$ is the index set of inequality constraints and $J=\\{1,\\cdots,m\\}$ is the index set of equality constraints. The functions $g_i, i\\in I$ and $h_j,j\\in J$ are assumed to be differentiable. If a point $x^*$ is a minimum of $f$, then there exist $p_0\\in\\mathbb{R}_+, p\\in\\mathbb{R}^\\ell$ and $q\\in\\mathbb{R}^m$ such that
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
            statementName: "",
            type: "note",
            content: ``,
            dependants: [],
          },
          {
            statementName: "",
            type: "note",
            content: `
          1) We call $K=\\{x\\in\\mathbb{R}^n : g_i(x) \\le 0, i\\in I\\text{ and } h_j(x) = 0, j\\in J\\}$ the set of constraints.
          </br>
          2) The exclusive condition means that $p_i\\ne 0$ if and only if $g_i(x^*) = 0$. 
          </br>
          3) For each $x\\in K$ we call $I(x) = \\{i\\in I : g_i(x) = 0\\}$ the set of <i>saturated</i> conditions.`,
            dependants: [],
          },
        ]
      },
      {
        statementName: "Qualification",
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
            statementName: "",
            type: "note",
            content: `The constraint set $K$ is itself said to be qualified if it is qualified at every point $x\\in K$.`,
            dependants: [],
          },
        ]
      },
      {
        statementName: "KKT conditions at a qualified point",
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
            statementName: "",
            type: "note",
            content: `This theorem permits $p$ in the first theorem to be taken as $1$ at qualified minimum point.`,
            dependants: [],
          },
        ]
      },
      {
        statementName: "Qualification criteria",
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
            statementName: "",
            type: "note",
            content: `This theorem permits $p$ in the first theorem to be taken as $1$ at qualified minimum point.`,
            dependants: [],
          },
        ]
      },
      {
        statementName: "Lagrangian function",
        type: "definition",
        content: `The function $\\L(x,\\lambda,\\mu) = f(x) + \\lambda^\\top g(x) + \\mu^\\top h(x)$.`,
        dependants: [],
        implications: [
          {
            statementName: "",
            type: "theorem",
            content: `We have $$\\inf\\limits_{x\\in K}\\sup\\limits_{(\\lambda,\\mu)\\in\\R^{\ell+m}}\\L(x,\\lambda,\\mu) = f(x),\\forall x\\in\\RR^n,\\lambda\\in\\RR^\\ell_+,\\mu\\in\\RR^m.$$`,
            dependants: [],
          },
        ]
      },
      {
        statementName: "Week duality",
        type: "definition",
        content: `We have $$\\sup\\limits_{(\\lambda,\\mu)\\in\\R^{\ell+m}}\\inf\\limits_{x\\in K}\\L(x,\\lambda,\\mu) \\le \\inf\\limits_{x\\in K}\\sup\\limits_{(\\lambda,\\mu)\\in\\R^{\ell+m}}\\L(x,\\lambda,\\mu),\\forall x\\in\\RR^n,\\lambda\\in\\RR^\\ell_+,\\mu\\in\\RR^m.$$`,
        dependants: [],
        implications: [
          {
            statementName: "",
            type: "definition",
            content: `The problem 
                        $$\\begin{aligned}
                        (\\D) : \\sup\\limits_{(\\lambda,\\mu)\\in\\R^{\ell+m}}\\inf\\limits_{x\\in K}\\L(x,\\lambda,\\mu) \\\\
                          \\text{s.t }  & \\lambda \\in \\RR^\\ell_+, \\\\
                                        & \\mu\\in\\RR^m
                        \\end{aligned} $$
                        is called the dual problem.`,
            dependants: [],
          },
        ]
      },
    ]
  },
  {
    chapterName: "Linear Programming",
    notations: [],
    statements: [
      {
        statementName: "linear program",
        type: "definition",
        content: `An optimization problem whose objective is a linear function and constraints are linear equalities or inequalities`,
        dependants: [],
        implications: [
          {
            statementName: "taxonomy",
            type: "definition",
            content: `Integer linear program, binary linear program, or mixed integer linear program`,
          },
        ]
      },
      {
        statementName: "standard form of a linear program",
        type: "definition",
        content: `$$\\begin{aligned}
                    (\\P) : \\text{min } & c^\\top x \\\\
                    \\text{s.t. } & Ax = b,\\\\
                    & x\\ge 0,
                  \\end{aligned}$$
                  where $x\\in\\RR, A\\in\\RR^{m\\times n}, b\\in\\RR^m, c\\in\\RR$.`,
        dependants: [],
        implications: [
          {
            statementName: "",
            type: "note",
            content: `We can assume that $\\rank(A) = m$. Otherwise, we can process row elimination to get fewer equality constraints.`,
          },
          {
            statementName: "convert to standard form",
            type: "note",
            content: ``,
          },
        ]
      },
      {
        statementName: "introductory terminology",
        type: "definition",
        content: `1) The set of feasible solutions: $X=\\{x\\in\\RR^n\\,|\\, Ax=b, x\\ge 0\\}$. If $X$ is empty, the problem is called infeasible.
                  </br>
                  2) If there is a sequence $\\{x_k\\}$ such that $\\lim\\limits_{k\\to\\infty} c^\\top x_k = -\\infty$, the problem is called unbounded.
                  </br>
                  3) An optimal solution $x^*\\in\\RR^n$ is such that $c^\\top x^* \\le c^\\top x,\\forall x\\in X$. In this case, the optimal set is defined to be $X\\cap\\{x\\in\\RR^n \\,|\\, c^\\top x = c^\\top x^*\\}$.
                  </br>               
                  4) Each $x_i, i\\in\\{1,\\cdots,n\\}$ is a decision variable.`,
        dependants: [],
      },
      {
        statementName: "solution-relevant terminology",
        type: "definition",
        content: `1) A basis $B$ is a non-singular submatrix of $A$.
                  </br>
                  2) Permute $A=(N, B)$, we rewrite the equality constraint in terms non-basic variables $x_N$ and basic variables $x_B$
                  $$Nx_N + Bx_B = b.$$
                  </br>
                  3) The basic solution associated to the basic $B$ is $(x_N,x_B)=(0,B^{-1}b)$.
                  </br>
                  4) A basis $B$ is degenerate if at least one component of the vector $B^{-1}b$ equals zero.
                  `
        ,
        dependants: [],
      },
      {
        statementName: "dual problem",
        type: "theorem",
        content: `The dual problem of the given standard primal problem is
                    $$\\begin{aligned}
                    (\\D) : \\text{max } & b^\\top y \\\\
                    \\text{s.t. } & A^\\top y + s = c,\\\\
                    & s\\ge 0.
                  \\end{aligned}$$`,
        dependants: [],
        implications: [
          {
            statementName: "",
            type: "theorem",
            content: `The double-dual problem coincides with the primal problem i.e. linear programs are self-dual.`,
          },
        ]
      },
      {
        statementName: "weak duality",
        type: "theorem",
        content: `If $x$ is feasible for $(\\P)$, $y$ is feasible for $(\\D)$ and $c^\\top x = b^\\top y$, then $x$ is optimal for $(\\P)$ and $y$ is optimal for $(\\D)$.`,
      },
      {
        statementName: "strong duality",
        type: "theorem",
        content: `1) $(\\P)$ has a finite optimal solution if and only if $(\\D)$ has a finite optimal solution. In this case, the duality gap is   zero.
        </br>
        2) If $(\\P)$ (resp. $(\\D)$) is unbounded, then $(\\D)$ (resp. $(\\P)$) is infeasible.`,
      },
      {
        statementName: "KKT optimality conditions",
        type: "theorem",
        content: `The tuple $(x,y,s)\\in\\R^{n+m+n}$ is a primal-dual optimal solution if and only if
                  $$
                  \\begin{align}
                  Ax &= &b \\\\
                  A^\\top y+ s &= &c \\\\
                  x_is_i &= &0, \\forall i\\in\\{1,\\cdots,n\\}  \\\\
                  (x,s) &\\ge &0 \\\\
                  \\end{align}
                  $$`,
      },
    ]
  }
] as Chapter[]