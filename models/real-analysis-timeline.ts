export default [
  {
    chapterName: 'Sets and Maps',
    notations: [],
    statements: [
      {
        statementName: "set cardinality",
        type: "definition",
        content: "Two sets $A$ and $B$ have the same cardinality if there is a bijection $f:A\\to B$.",
        dependants: [],
      },
      {
        statementName: "Cantor-Schröder-Bernstein theorem",
        type: "theorem",
        content: "If $|A| \\le |B|$ and $|B| \\le |A|$ then $|A| = |B|$."
      },
      {
        statementName: "Cantor's theorem of the power set",
        type: "theorem",
        content: "If $A$ is a set, then $|A| < \\mathcal{P}(A)$.",
        implications: [
          {
            statementName: "",
            type: "corollary",
            content: "For any $n\\in\\mathbb{N}\\cup\\{0\\}$, we have $n<2^n$."
          },
        ]
      },

    ]
  },
  {
    chapterName: "The Real Numbers",
    notations: [],
    statements: [
      {
        statementName: "the incompleteness of $\\QQ$",
        type: "thoughtBubble",
        content: `We can prove the followings 
        </br>
        1) There exists no $x\\in \\QQ$ such that $x^2=2$ (by contradiction). 
        </br>
        2) Moreover, given $S=\\{x\\in \\QQ \\,|\\, x^2<2\\}$. There exists no $x^*\\in\\QQ$ such that $x\\le x^*,\\forall x\\in \\QQ$.`,
        implications: [
          {
            statementName: "",
            type: "corollary",
            content: "For any $n\\in\\mathbb{N}\\cup\\{0\\}$, we have $n<2^n$."
          },
        ]
      },
      {
        statementName: "A construction of $\\mathbb{R}$ by Dedekind's cuts",
        type: "definition",
        content: "",
        implications: [
          {
            statementName: "",
            type: "theorem",
            content: ""
          },
        ]
      },
      {
        statementName: "supremum and infimum",
        type: "definition",
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
        statementName: "Least upper bound property",
        type: "definition",
        content: "An ordered set $S$ has the least upper bound property if every $E \\subset S$ which is nonempty and bounded above has a supremum in $S$.",
        dependants: []
      },
      {
        statementName: "The $\\epsilon$-principle",
        type: "theorem",
        content: "If $x,y\\in\\RR$ and for any $\\epsilon>0$, $|x-y|<\\epsilon$, then $x=y$.",
        dependants: []
      },
      {
        statementName: "Archimedian Property",
        type: "theorem",
        content: "If $x, y\\in\\mathbb{R}$ and $x > 0$, then $\\exist n \\in \\mathbb{N}$ such that $nx > y$.",
        dependants: []
      },
      {
        statementName: "Density of $\\mathbb{Q}$",
        type: "theorem",
        content: "If $x, y\\in \\mathbb{R}$ and $x < y$ then $\\exist r\\in\\mathbb{Q}$ such that $x < r < y$.",
        dependants: []
      },
      {
        statementName: "Absolute value",
        type: "definition",
        content: "",
        dependants: []
      },
      {
        statementName: "Triangle inequality",
        type: "theorem",
        content: "$\\forall x,y\\in\\mathbb{R}, |x+y|\\le |x|+|y|$.",
        dependants: []
      },
    ]
  }
] as Chapter[]