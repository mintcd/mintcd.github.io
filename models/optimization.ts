export default [
  {
    chapterName: "Introduction to Optimization",
    notations: [],
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
      },
    ]
  },
  {
    chapterName: "Smooth and Constrained Problems",
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
        statementName: "General Form of a Smooth Problem",
        type: "definition",
        content: `Consider the problem 
        $$\\begin{aligned}
        (\\P) : \\min\\limits_{x\\in\\RR^n} & f(x) \\\\
        \\text{s.t }              & c_i = 0, i\\in\\I \\\\
                                  & c_i \\ge 0, i\\in\\E
        \\end{aligned}
        $$
      where the functions $f:\\RR^n\\to\\RR$, $g:\\RR^n\\to\\RR^m$ and $h:\\RR^n\\to\\RR^p$ are smooth on some
      domain of $\\RR^n$.`,
        implications: [
          {
            statementName: "terminology",
            type: "definition",
            content: `1) The feasible set is defined by 
                      $$\\F=\\{x\\in\\RR^n : g(x)=0 \\text{ and } h(x) \\le 0\\}.$$
                      </br>
                      2) A local solution is a feasible solution $x^*\\in\\F$ for which
                      $$\\exists\\epsilon>0, \\forall x\\in B(x^*,\\epsilon)\\cap\\F: f(x^*)\\le f(x).$$`,
          },
        ]
      },
      {
        statementName: "Fritz John Conditions",
        type: "theorem",
        content: `If $x^*$ is a local minimum of $(\\P)$, and $f,g$ and $h$ are are continuously differentiable in a neighborhood of
        $x^*$, then there exists $(\\lambda^*, y^*, z^*)\\in\\RR_+\\times\\RR^m\\times\\RR^p_+\\setminus\\{0\\}$, such that
                $$\\begin{cases}
                (z^*)^\\top h(x^*) = 0 \\\\
                \\lambda^*\\nabla f(x^*) + \\nabla g(x^*)y^* + \\nabla h(x^*)z^* = 0.
                \\end{cases}$$
                `,
        dependants: [],
      },
      {
        statementName: "Lagrangian function",
        type: "definition",
        content: `The function $\\L(x,y,z) = f(x) + y^\\top g(x) + z^\\top h(x)$.`,
        dependants: [],
        implications: [
          {
            statementName: "",
            type: "definition",
            content: `The vectors $y$ and $z$ are called Lagrange multiplier vectors. Each component of $y$ and $z$ is called a Lagrange multiplier. There is one multiplier per constraint.`,
            dependants: [],
          },
          {
            statementName: "",
            type: "theorem",
            content: `We have $$\\inf\\limits_{x\\in K}\\sup\\limits_{(\\lambda,\\mu)\\in\\R^{\ell+m}}\\L(x,\\lambda,\\mu) = f(x),\\forall x\\in\\RR^n,\\lambda\\in\\RR^\\ell_+,\\mu\\in\\RR^m.$$`,
            dependants: [],
          },
        ]
      },
      {
        statementName: "Mangasarian-Fromovitz Constraint Qualification",
        type: "definition",
        content: `Define the set of active inequalities for each $x\\in \\F$ as
        $$\\I(x) = \\{i\\in\\{1,\\cdots,p\\} : h_i(x)=0\\}.$$
        We said $x$ to be qualified if 
        $$\\forall (y,z)\\in\\RR^m\\times\\RR^p: \\nabla g(x) y + \\nabla h(x)_{\\I(x)}(x)z = 0 \\Rightarrow (y,z)=0.$$`,
        dependants: [],
        implications: [
          {
            statementName: "",
            type: "theorem",
            content: `The qualification condition is equivalent to
                      </br>
                      (i) the matrix $\\nabla g(x)$ is full column-rank;
                      </br>
                      (ii) there exists $d\\in\\RR^n\\setminus\\{0\\}$ such that
                      $$\\nabla g(x)^\\top d = 0 \\text{ and } \\nabla h_{\\I(x)}(x)^\\top d < 0.$$`,
            dependants: [],
          },
          {
            statementName: "Linear Independence Constraint Qualification",
            type: "definition",
            content: `The linear constraint qualification holds at $x\\in\\F$ if columns of  $\\nabla g(x)$ and $\\nabla h_{\\I(x)}(x)$ are independent.`,
            dependants: [],
          },
        ]
      },
      {
        statementName: "Karush-Kuhn-Tucker conditions",
        type: "theorem",
        content: `If $x^*$ is a qualified local minimum of $(\\P)$, and $f,g$ and $h$ are are continuously differentiable in a neighborhood of
        $x^*$, there exists $(y^*, z^*)\\in\\times\\RR^m\\times\\RR^p_+\\setminus\\{0\\}$, such that
                $$\\begin{cases}
                (z^*)^\\top h(x^*)  = 0 \\\\
                \\nabla_x\\L(x^*,y^*,z^*) = 0.
                \\end{cases}$$
                `,
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