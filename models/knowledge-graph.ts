
const graph = {
  vertices: [
    {
      name: "Metric space",
      key: "metric-space",
      type: "definition",
      content: ""
    },
    {
      name: "Dense subset of a metric space",
      key: "dense-subset-of-a-metric-space",
      type: "definition",
      parents: [
        {
          key: "metric-space"
        }
      ],
      content: "Let $(M,d)$ be a metric space. A subset $N$ of $M$ is said to be dense if every ball $B(x,r)\\subset M$, we have\n      $$B(x,r)\\cap N \\neq \\varnothing.$$."
    },
    {
      name: "Lipschitz continuity",
      key: "lipschitz-continuity",
      type: "definition",
      parents: [
        {
          key: "metric-space"
        }
      ],
      content: ""
    },
    {
      name: "Upper Bound and Lower Bound",
      key: "upper-bound-and-lower-bound",
      type: 'definition',
      fields: ['real-analysis'],
      content: `Suppose that $S$ is an ordered set. If
    $$\\forall E\\subset S, \\exists \\beta \\in S , \\forall x\\in E: x\\le \\beta,$$
    then we say that $E$ is bounded above and $\\beta$ is called an upper bound of $E$.`
    },
    {
      name: `Supremum and Infimum`,
      key: 'supremum-and-infimum',
      type: `definition`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "upper-bound-and-lower-bound",
        }
      ],
      content: `An element $b_0\\in A$ is called a least lower bound, or a supremum of $A$ if 
    </br>
    (i) $b_0$ is an upper bound,
    </br>
    (ii) for any upper bound $b$ of $A$, we have $b_0\\le b$. 
    </br>
    Similarly, we say that $c_0$ is a greatest lower bound, or an infimum of $A$ if 
    </br>
    (i) $c_0$ is a lower bound, 
    </br>
    (ii) for any lower bound $c$ of $A$, we have $c_0\\le c$.`,
    },
    {
      name: `Least Upper Bound Property`,
      key: 'least-upper-bound-property',
      type: `definition`,
      fields: ['real-analysis'],
      parents: [
        {
          key: 'supremum-and-infimum',
        }
      ],
      content: `A set $S$ has least upper bound property if for every nonempty subset $E$ of $S$, $\\sup E$ exists.`,
    },
    {
      name: "The Real Numbers",
      key: "the-real-numbers",
      fields: ["real-analysis"],
      type: `definition-theorem`,
      parents: [
        {
          key: 'least-upper-bound-property',
        }
      ]
    },
    {
      name: `The $\\epsilon$-principle`,
      key: 'the-epsilon-principle',
      fields: ["real-analysis"],
      type: `theorem`,
      parents: [
        {
          key: "the-real-numbers",
        }
      ],
      content: `If $x,y\\in\\RR$ and for any $\\epsilon>0$, $|x-y|<\\epsilon$, then $x=y$.`,
      proof: `Suppose that $x\\ne y$. We have $|x-y|\\ge \\dfrac{|x-y|}{2} > 0$, a contradiction.`
    },
    {
      name: `Archimedian Property`,
      key: 'archimedian-property',
      type: `theorem`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "the-real-numbers",
        }
      ],
      content: `If $x, y\\in\\mathbb{R}$ and $x > 0$, then $\\exist n \\in \\mathbb{N}$ such that $nx > y$.`,
    },
    {
      name: `Density of $\\mathbb{Q}$`,
      type: `theorem`,
      key: 'density-of-q',
      fields: ["real-analysis"],
      parents: [
        {
          key: 'archimedian-property',
        }
      ],
      content: `If $x, y\\in \\mathbb{R}$ and $x < y$ then $\\exist r\\in\\mathbb{Q}$ such that $x < r < y$.`,
      dependants: []
    },
    {
      name: "Roots of a positive real number",
      key: "roots-of-a-positive-real-number",
      type: `theorem`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "the-real-numbers",
        }
      ],
      content: `For every real number $x>0$ and every integer $n>0$, there exists a unique $y>0$ such that $y^n = x$.`
    },
    {
      name: `Absolute value`,
      key: "absolute-value",
      type: `definition`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "the-real-numbers",
        }
      ],
      content: ``,
    },
    {
      name: `Decimal representation`,
      key: "decimal-representation",
      type: `definition`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "the-real-numbers",
        }
      ],
      content: ``,
    },
    {
      name: `Sequence of real numbers`,
      key: "sequence-of-real-numbers",
      type: `definition`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "the-real-numbers",
        }
      ],
      content: ``,
    },
    {
      name: `Subsequence`,
      key: "subsequence",
      type: `definition`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "sequence-of-real-numbers",
        }
      ],
      content: ``,
    },
    {
      name: `Monotonic sequence`,
      key: "monotonic-sequence",
      type: `definition`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "sequence-of-real-numbers",
        }
      ],
      content: ``,
    },
    {
      name: `Boundedness of a sequence`,
      key: "boundedness-of-a-sequence",
      type: `definition`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "sequence-of-real-numbers",
        }
      ],
      content: ``,
    },
    {
      name: `Convergence of a sequence`,
      key: "convergence-of-a-sequence",
      type: `definition-theorem`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "sequence-of-real-numbers",
        },
        {
          key: "absolute-value",
        }
      ],
      content: ``,
    },
    {
      name: `Limit of subsequence`,
      key: "limit-of-subsequence",
      type: `definition`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "subsequence",
        },
        {
          key: "convergence-of-a-sequence",
        }
      ],
      content: ``,
    },
    {
      name: `Convergent sequence is bounded`,
      key: "convergent-sequence-is-bounded",
      type: `theorem`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "boundedness-of-a-sequence",
        },
        {
          key: "convergence-of-a-sequence",
        }
      ],
      content: ``,
    },
    {
      name: `Bounded monotonic sequence converges`,
      key: "bounded-monotonic-sequence-converges",
      type: `theorem`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "boundedness-of-a-sequence",
        },
        {
          key: "convergence-of-a-sequence",
        },
        {
          key: "monotonic-sequence",
        }
      ],
      content: ``,
    },
    {
      name: `Squeeze theorem`,
      key: "squeeze-theorem",
      type: `theorem`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "convergence-of-a-sequence",
        }
      ],
      content: ``,
    },
    {
      name: `Comparison of limits`,
      key: "comparison-of-limits",
      type: `theorem`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "convergence-of-a-sequence",
        }
      ],
      content: ``,
    },
    {
      name: `Algebra of limits`,
      key: "algebra-of-limits",
      type: `theorem`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "convergence-of-a-sequence",
        }
      ],
      content: ``,
    },
    {
      name: `limsup and liminf of a bounded sequence converges`,
      key: "limsup-and-liminf-of-a-bounded-sequence-converges",
      type: `definition-theorem`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "convergence-of-a-sequence",
        },
        {
          key: 'supremum-and-infimum',
        }
      ],
      content: ``,
    },
    {
      name: `Bolzano-Weierstrass`,
      key: "bolzano-weierstrass",
      type: `theorem`,
      fields: ["real-analysis"],
      parents: [
        {
          key: "limsup-and-liminf-of-a-bounded-sequence-converges",
        },
        {
          key: 'squeeze-theorem',
        }
      ],
      content: ``,
    },
    {
      name: "$\\sigma$-algebra",
      key: "sigma-algebra",
      type: "definition",
      fields: ["measure-theory", "probability-theory"],
      content: `A collection of subsets of $\\Omega$ satisfying
    $$$$ 1) $\\Omega\\in\\F$ .
    $$$$ 2) (Closure under Complement) $A\\in\\F$ implies $A^c\\in\\F$.
    $$$$ 3) (Closure under Countable Union) $\\{A_n\\}_{n\\in\\NN}\\subset\\F$ implies $\\cup_{n=1}^{\\infty}A_n\\in\\F$.`
    },
    {
      name: 'Filtration',
      key: 'filtration',
      type: 'definition',
      parents: [{
        key: 'sigma-algebra'
      }],
      fields: ["probability-theory"],
      content: "A family of $\\sigma$-algebras \\{\\F_t:t\\in T\\}  is a filtration on $(\\Omega,\\F)$ if $t\\in T$ and $s\\le t$ imply $\\F_s\\subset\\F_t\\subset\\F$. The tuple $(\\Omega,\\F, \\{\\F_t:t\\in T\\},\\PP)$ is called a filtered probability space."
    },

    {
      name: 'Stopping time',
      key: 'stopping-time',
      type: 'definition',
      parents: [
        {
          key: 'filtration'
        }
      ],
      content: "Let $(\\Omega,\\F, \\{\\F_t:t\\in T\\},\\PP)$ be a filtered probability space. A random variable $\\tau: \\Omega\\to T$ is called a stopping time if for every $t\\in T$, $$\\{\\tau \\le t\\}\\in\\F_t.$$"
    },
    {
      name: "Generated $\\sigma$-algebra",
      key: "generated-sigma-algebra",
      type: "definition-theorem",
      fields: ["measure-theory"],
      parents: [
        {
          key: "sigma-algebra"
        }
      ],
      content: "Let $\\C$ be a collection of subsets of $\\Omega$. Then \n      $$\\sigma(\\C) = \\bigcap \\{ \\F : \\F \\text{ is a $\\sigma$-algebra and } \\C\\subset\\F \\}$$\n      is the smallest $\\sigma$-algebra containing $\\C$, called the $\\sigma$-algebra generated by $\\C$"
    },
    {
      name: "Borel $\\sigma$-algebra",
      key: "borel-sigma-algebra",
      type: "definition",
      fields: ["measure-theory"],
      parents: [
        {
          key: "sigma-algebra"
        }
      ],
    },
    {
      name: "Measurable space",
      key: "measurable-space",
      type: "definition",
      parents: [
        {
          key: "sigma-algebra"
        }
      ],
      fields: ["measure-theory"],
      content: "Let $\\F$ be a $\\sigma$-algebra on $\\Omega$. The doublet $(\\Omega,\\F)$ is called a measurable space."
    },
    {
      name: `Measurability Criterion`,
      key: `measurability-criterion`,
      type: `proposition`,
      fields: ["measure-theory"],
      content: `If there is a subset $\\C$ of $2^\\Omega$ such that $\\G = \\sigma(\\C)$ and 
    $$\\forall G\\in\\G, f^{-1}(G)\\in\\C.$$
    Then $f$ is measurable.`,
    },
    {
      name: "Measurable function",
      key: "measurable-function",
      fields: ["measure-theory"],
      type: "definition",
      parents: [
        {
          key: "measurable-space"
        }
      ],
      content: `Let $(\\Omega, \\F)$ and $(\\Gamma, \\G)$ be measurable spaces. A function $f:\\Omega\\to\\Gamma$ is measurable $\\F\\to\\G$ if 
    $$\\forall G\\in\\G, f^{-1}(G)\\in\\F.$$
    If $\\B$ has been explicated, we say that $f$ is $\\F$-measurable.`,
    },
    {
      name: "Measure",
      type: "definition",
      key: "measure",
      fields: ["measure-theory"],
      parents: [{
        key: "measurable-space"
      }],
      content: "Let $(\\Omega,\\F)$ be a measurable space. A measure is a function $\\mu:\\F\\to[0,\\infty]$ such that\n                  </br>\n                  1) $\\mu(\\varnothing) = 0$\n                  </br>\n                  2) ($\\sigma$-additivity) For every family $\\{A_i\\}_{i\\in\\N}$ of disjoint measurable subsets, we have\n                  $$\\mu\\left(\\bigcup\\limits_{i=1}^\\infty A_i\\right) = \\sum\\limits_{i=1}^\\infty \\mu(A_i).$$"
    },
    {
      name: "Measure space",
      type: "definition",
      key: "measure-space",
      parents: [{
        key: 'measure'
      }],
      content: "Let $\\mu$ be a measure on a measurable space $(\\Omega,\\F)$. The triplet $(\\Omega,\\F, \\mu)$ is called a measure space"
    },
    {
      name: "Almost everywhere",
      key: "almost-everywhere",
      type: "definition",
      parents: [{
        key: 'measure-space'
      }],
      content: "Let $(\\Omega, \\F, \\mu)$ be a measure space. A property $\\P:\\Omega\\to\\{\\mathrm{true},\\mathrm{false}\\}$ is said to hold almost everywhere with respect to $\\mu$, abbreviated by $\\mu$-a.e. if\n                $$\\mu\\left(\\left\\{x\\in\\Omega : \\neg \\P(x)\\right\\}\\right) = 0.$$"
    },

    {
      name: "Lebesgue integral",
      type: "definition-theorem",
      key: "lebesgue-integral",
      parents: [
        {
          key: 'measure-space'
        },
        {
          key: 'measurable-function'
        }]
    },
    {
      name: "$L^p$ space",
      key: "lp-space",
      type: "definition-theorem",
      parents: [
        {
          key: "lebesgue-integral"
        }]
    },
    {
      name: "Probability measure",
      key: "probability-measure",
      type: "definition",
      parents: [{
        key: "measure"
      }],
      content: "A measure $\\PP$ on $(\\Omega, \\F)$ is a probability measure if $\\PP(\\Omega)$ = 1."
    },
    {
      name: "Conditional probability",
      key: "conditional-probability",
      type: "definition",
      parents: [{
        key: "probability-measure"
      }
      ],
      content: "A measure $\\PP$ on $(\\Omega, \\F)$ is a probability measure if $\\PP(\\Omega)$ = 1."
    },
    {
      name: "Measure kernel",
      key: "measure-kernel",
      type: "definition",
      parents: [
        {
          key: 'measurable-space'
        },
        {
          key: 'measurable-function'
        }],
      content: "Let $(\\Omega, \\F)$ and $(\\Gamma, \\G)$ be measurable spaces. A function $\\kappa: (\\Omega,\\G) \\to [0,\\infty]$ is a measure kernel if  $$$$ 1) For each $B\\in\\G$, $\\omega \\mapsto \\kappa(\\omega,B)$ is $(\\F\\to\\B([0,\\infty]))$-measurable $$$$ 2) For each $\\omega\\in\\Omega$, $B \\mapsto \\kappa(\\omega,B)$ is a measure on $\\G$. For a measurable function $f: \\Gamma\\to\\RR$, we write the integral of $f$ with respect to $\\kappa(\\omega,B)$ as $\\int f(y)\\d\\kappa(\\omega,y) := \\int f(y)\\kappa(\\omega,\\d y)$ $$$$   If $(\\Omega, \\F) = (\\Gamma, \\G)$, we call $\\kappa$ a measure kernel on $(\\Omega, \\F)$."
    },
    {
      name: "Product of kernels",
      type: "definition",
      key: "product-of-kernels",
      parents: [
        { key: "measure-kernel" }
      ],
      content: "Let $\\kappa, \\lambda$ be measure kernels on $(\\Omega, \\F)$. The product of $\\kappa$ and $\\lambda$ is a measure kernel on $(\\Omega, \\F)$, defined by\n      $$(\\kappa\\lambda)(x,B) = \\int\\kappa(x,\\dy)\\lambda(y, B).$$"
    },
    {
      name: "Probability kernel",
      key: "probability-kernel",
      type: "definition",
      parents: [
        {
          key: "measure-kernel",
          relation: 'specializes'
        }
      ],
    },
    {
      name: "Probability space",
      type: "definition",
      key: "probability-space",
      parents: [{
        key: 'measure-space'
      }],
      content: "A measure space $(\\Omega, \\F, \\PP)$ is a probability space if $\\PP$ is a probability measure. In such case, each element of $\\Omega$ is called an outcome and each element of $\\F$ is called an event."
    },
    {
      name: "Random variable",
      key: "random-variable",
      type: "definition",
      parents: [{
        key: 'probability-space'
      },
      {
        key: 'measurable-function'
      }],
      content: "Let $(\\Omega, \\F, \\PP)$ be a probability space. A function $X : \\Omega\\to\\RR^d$ is called a random variable if $X$ is $(\\F\\to\\B(\\RR^d))$-measurable. We will write $\\B_X := \\B(\\RR^d))$, the Borel $\\sigma$-algebra associated to $X$.",
      examples: ["If $A$ is an event, then $\\1_A$ is a random variable. Therefore, $\\PP(A) = \\EE[\\1_A]$"]
    },
    {
      name: "Distribution",
      key: "distribution",
      type: "definition-theorem",
      parents: [
        { key: 'random-variable' }
      ],
      content: "Let $(\\Omega, \\F, \\PP)$ be a probability space and $X$ be a $d$-dimensional random variable. Then $X$ induces a measure $\\PP_X(B) : \\B(\\RR^d) \\to \\R$ such that \n      $$\\PP_X(B) = \\PP(X^{-1}(B)),$$ called the distribution or the law of $X$."
    },
    {
      name: "Expectation",
      key: "expectation",
      type: "definition",
      parents: [
        {
          key: 'random-variable'
        }
      ],
      content: "Let $(\\Omega, \\F, \\PP)$ be a probability space and $X$ be a real-valued random variable. The expectation of $X$ is defined as $$\\EE[X] = \\int_\\Omega X\\d\\PP.$$"
    },
    {
      name: "Expectation conditioned on an event",
      key: "expectation-conditioned-on-an-event",
      type: "definition",
      parents: [
        {
          key: "expectation"
        }
      ],
      content: "Let $(\\Omega, \\F, \\PP)$ be a probability space and $X$ be a real-valued random variable. The expectation of $X$ conditioned on an event $A$ is defined as $$\\EE[X | A] = \\int_A X\\d\\PP.$$"
    },
    {
      name: "Expectation conditioned on a $\\sigma$-algebra",
      key: "expectation-conditioned-on-an-event",
      type: "definition-theorem",
      parents: [
        {
          key: "expectation-conditioned-on-an-event"
        }
      ],
      content: "Let $(\\Omega, \\F, \\PP)$ be a probability space, $X$ be a real-valued random variable and $\\G$ be a sub-$\\sigma$-algebra of $\\F$. Then there exists a unique linear operator $\\EE[\\cdot | \\G] : L^1(\\F)\\to L^1(\\G)$ such that $$\\EE[\\EE[X|\\G] | A] = \\EE[X | A], \\forall X\\in L^1(\\F), A\\in \\F.$$"
    },
    {
      name: "Stochastic process",
      key: "stochastic-process",
      type: "definition",
      parents: [
        {
          key: 'random-variable'
        }
      ],
      content: "Let $T$ be an index set. A stochastic process is a collection of random variables $\\{X_t\\}_{t\\in T}$, where $$X_t: \\Omega\\to\\RR^d.$$ We consider $T=\\NN$ equipped with the $\\sigma$-algebra $\\T = 2^T$ or $T=\\RR_+$ equipped with $\\T = \\B(\\RR_+)$. The tuple $(T,\\T)$ is called the time space, the tuple $(\\RR^d,\\B(\\RR^d))$ is called the state space."
    },
    {
      name: "Random time",
      key: 'random-time',
      type: 'definition',
      parents: [{
        key: "stochastic-process"
      }]
    },
    {
      name: "Adapted stochastic process",
      key: "adapted-stochastic-process",
      type: "definition",
      parents: [{
        key: "stochastic-process",
      },
      {
        key: "filtration",
      }],
      content: "Let $(\\Omega, \\F, \\PP)$ be a probability space and $X := \\{X_t\\}_{t\\in T}$ be a stochastic process. Let $\\{\\F_t\\}$ be an increasing class of sub-$\\sigma$-algebras of $\\F$, called a filtration. The process $X$ is said to be adapted to $\\{\\F_t\\}$ if $X_t$ is $\\F_t$-measurable, for every $t\\in T$."
    },
    {
      name: "Natural filtration",
      key: "natural filtration",
      type: "definition",
      parents: [{
        key: "adapted-stochastic-process",
      },],
      content: ""
    },
    {
      name: "Jointly measurable stochastic process",
      key: "jointly-measurable-stochastic-process",
      type: "definition",
      parents: [{
        key: "stochastic-process"
      }],
      content: "A stochastic process $X$ with probability space $(\\Omega,\\F,\\PP)$ time space $(T, \\T)$, state space $(\\RR^d, \\B(\\RR^d))$ is jointly measurable if X is $(\\T\\otimes \\F \\to \\B(\\RR^d))$-measurable."
    },
    {
      name: "Wiener process",
      key: "wiener-process",
      type: "definition-theorem",
      parents: [{
        key: "stochastic-process"
      }],
    },
    {
      name: "Markov process",
      type: "definition",
      key: "markov-process",
      parents: [{
        key: "stochastic-process"
      }],
      content: ``
    },
    {
      name: "Martingale",
      type: "definition",
      key: "martingale",
      parents: [{
        key: "stochastic-process"
      }],
      content: "The process $X$ is a martingale with respect to  $\\F$ if $E(X_t∣\\F_s)=X_s$ for all $s,t\\in T$ with $s\\le t$"
    },
    {
      name: "Progressively measurable process",
      key: "progressively-measurable-process",
      type: "definition",
      content: "",
      parents: [
        {
          key: "adapted-stochastic-process",
          relation: 'specializes'
        },
        {
          key: "jointly-measurable-stochastic-process",
          relation: 'specializes'
        }
      ],
    },
    {
      name: "Diffusion",
      key: "diffusion",
      type: "definition",
      content: "A stochastic process $X$ adapted to a filtration $\\F$ is a diffusion when it is a strong Markov process with respect to $\\F$, homogeneous in time, and has continuous sample paths.",
      parents: [{
        key: "adapted-stochastic-process"
      }],
    },
  ],
  metadata: {
    edgesIncluded: false,
    depthComputed: false,
    positionInitialized: false
  }
}

export default graph as Graph