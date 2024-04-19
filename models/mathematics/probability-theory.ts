export default
  [
    {
      chapterName: "Introduction",
      notations: [
        {
          name: 'probability space',
          content: `$(\\Omega,\\F, \\PP)$`
        }
      ],
      statements: [
        {
          statementName: "probability space",
          type: "definition",
          content: "A probability measure $\\mathbb{P}$ on a mesurable space $(\\Omega, \\mathcal{F})$ is a measure satisfying $\\mathbb{P}(\\Omega)=1$. The triplet $(\\Omega,\\mathcal{F},\\mathbb{P})$ is called a probability space.",
          dependants: [],
          implications: [
            {
              statementName: "",
              type: "note",
              content: "We open call $\\Omega$ the <i>sample space</i>, each element $\\omega\\in\\Omega$ an <i>outcome</i> and each $E\\in\\mathcal{F}$ an <i>event</i>.",
              dependants: [],
            },
            {
              statementName: "",
              type: "corollary",
              content: "Let $A$ be an event such that $\\mathbb{P}(A) > 0$. Then the function $\\mathbb{P}(\\cdot|A):\\mathcal{F}\\to\\mathbb{R}$ defined by $\\mathbb{P}(X|A)=\\dfrac{\\mathbb{P}(X\\cap A)}{\\mathbb{A}}$ is another probability measure, called the <i>probability condition on event $A$ </i>.",
              dependants: [],
            },
          ]
        },
        {
          statementName: "Borel-Cantelli lemma",
          type: "definition",
          content: `Given a sequence of events $(A_n)_{n\\in\\NN}$
                  </br>
                  1) If $\\sum_{n\\in\\NN}\\PP(A_n) < \\infty$, then 
                  $$\\PP(\\limsup A_n) = 0.$$
                  Equivalently, $\\{n\\in N : \\omega\\in A_n\\}$ is a.s. finite.
                  </br>
                  2) If $\\sum_{n\\in\\NN}\\PP(A_n) = \\infty$, then 
                  $$\\PP(\\limsup A_n) = 1.$$
                  Equivalently, $\\{n\\in N : \\omega\\in A_n\\}$ is a.s. infinite.`,
        },
        {
          statementName: "independent events",
          type: "definition",
          content: "A family of events $\\{A_i\\}_{i\\in I}$ is independent if for any indices $i_1,\\cdots,i_k$ in $I$ ($k\\in\\mathbb{N}^*$), we have $$\\mathbb{P}(A_{i_1}\\cdots A_{i_k}) = \\mathbb{P}(A_{i_1})\\cdots \\mathbb{P}(A_{i_k})$$.",
        },
      ]
    },
    {
      chapterName: "Random Variables",
      notations: [],
      statements: [
        {
          statementName: "Random variable",
          type: "definition",
          content: "A Borel measurable function $X:\\Omega\\to\\mathbb{R}$ is called a random variable. A tuple $(X_1,\\cdots,X_n)$ of random variables is called a random vector.",
          dependants: [],
          implications: [
            {
              name: "",
              type: "definition",
              content: "If $X(\\Omega)$ is countable, $X$ is said to be discrete. We also concern about absolutely continuous random variables, to be defined later.",
              dependants: [],
            },
          ]
        },
        {
          statementName: "Distribution function",
          type: "definition",
          content: `The distribution function of a random variable $X$ is expressed as $F_X: \\mathbb{R}\\to [0,1]$, such that 
        $$F_X(x) = \\mathbb{P}(X\\le x) = \\mathbb{P}(X\\in[-\\infty,x])$$`,
          dependants: [],
          implications: [
            {
              statementName: "Absolutely continuous random variable",
              type: "definition",
              content: `If there exists a Borel measurable function $f_X:\\mathbb{R}\\to\\mathbb{R}$ such that
            <br/>
            1) $f(x)\\ge0, \\forall x\\in\\mathbb{R}$;
            <br/>
            2) For any $a,b\\in\\mathbb{R}$ and $a<b$, we have $F_X(b)-F_X(a) = \\int_a^b f_X(x)\\,\\mathrm{d}x$.
            Then $X$ is absolutely continuous.`,
              dependants: [],
            },
          ]
        },
        {
          statementName: "Convergence of random variables",
          type: "definition",
          content: "",
          dependants: [],
          implications: [
            {
            },
          ]
        },
        {
          statementName: "Expectation and Conditional expectation",
          type: "definition",
          content: "",
          dependants: [],
        },
      ]
    },

    {
      chapterName: "Conditioning",
      description: `This chapter discusses conditional expectations coming along with random variables.`,
      notations: [],
      statements: [
        {
          statementName: "expectation conditioned on an event",
          type: "definition",
          content: `The conditional expectation of a random variable $X$ given an event $B$ such that $\\PP(B)>0$ is
        $$\\EE[X|B] = \\int_{\\Omega} X\\,\\d\\PP(X|B) = \\dfrac{\\EE[X\\1_B]}{\\PP(B)}.$$
        If $\\PP(B)=0$, we may assign $\\EE[X|B] = 0$, because $\\PP(X=x|B) = 0,\\forall x\\in X(\\Omega)$.`,
          implications: [
          ]
        },
        {
          statementName: "expectation conditioned on a random variable",
          type: "definition",
          content: `Let $X,Y$ be random variables. The conditional expectation of $X$ given $Y$ is a random variable, denoted by $\\EE[X|Y]$, such that
                  $$\\EE[X|Y](\\omega) = \\EE[X|Y=Y(\\omega)], a.s.$$`,
          implications: [
            {
              statementName: "",
              type: "note",
              content: `Consider the set $E=\\{y\\in Y(\\Omega) : \\PP(Y=y) > 0\\}$. We write
            $$\\EE[X|Y](\\omega) = \\begin{cases}
                                        \\EE[X|Y=Y(\\omega)], & \\text{ if } Y(\\omega)\\in E,\\\\\\\\
                                        0,           & \\text{ otherwise.}     
                                  \\end{cases}$$`,
              implications: [
              ]
            },
          ]
        },
      ]
    },
  ] as Chapter[]