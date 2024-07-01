export default [
  {
    name: 'Sets and Maps',
    notations: [],
    statements: [
      {
        name: `set cardinality`,
        type: `definition`,
        content: `Two sets $A$ and $B$ have the same cardinality if there is a bijection $f:A\\to B$.`,
        parents: [],
      },
      {
        name: `Cantor-Schröder-Bernstein theorem`,
        type: `theorem`,
        content: `If $|A| \\le |B|$ and $|B| \\le |A|$ then $|A| = |B|$.`
      },
      {
        name: `Cantor's theorem of the power set`,
        type: `theorem`,
        content: `If $A$ is a set, then $|A| < \\mathcal{P}(A)$.`,
        implications: [
          {
            name: ``,
            type: `corollary`,
            content: `For any $n\\in\\mathbb{N}\\cup\\{0\\}$, we have $n<2^n$.`
          },
        ]
      },

    ]
  },
  {
    name: `The Real Numbers`,
    statements: [
      {
        name: `the incompleteness of $\\QQ$`,
        type: 'thought-bubble',
        content: `We can prove the followings 
        </br>
        1) There exists no $x\\in \\QQ$ such that $x^2=2$ (by contradiction). 
        </br>
        2) Moreover, given $S=\\{x\\in \\QQ \\,|\\, x^2<2\\}$. There exists no $x^*\\in\\QQ$ such that $x\\le x^*,\\forall x\\in \\QQ$.`,
        implications: [
          {
            name: ``,
            type: `corollary`,
            content: `For any $n\\in\\mathbb{N}\\cup\\{0\\}$, we have $n<2^n$.`
          },
        ]
      },
      {
        name: `A construction of $\\mathbb{R}$ by Dedekind's cuts`,
        type: `definition`,
        content: ``,
        implications: [
          {
            name: ``,
            type: `theorem`,
            content: ``
          },
        ]
      },
      {
        name: `supremum and infimum`,
        type: `definition`,
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
        name: `Least upper bound property`,
        type: `theorem`,
        content: `The set $\\RR$ constructed as above has the Least upper bound property: every nonempty and bounded subset $S$ of $\\RR$ has a supremum in $\\RR$.`,
        parents: [],
        implications: [
          {
            name: ``,
            type: `note`,
            content: `From now on, when we write comparative statements like $a>b$ without further explanation, it means $a,b\\in\\RR$.`,
          },
        ]
      },
      {
        name: `The $\\epsilon$-principle`,
        type: `theorem`,
        content: `If $x,y\\in\\RR$ and for any $\\epsilon>0$, $|x-y|<\\epsilon$, then $x=y$.`,

      },
      {
        name: `Archimedian Property`,
        type: `theorem`,
        content: `If $x, y\\in\\mathbb{R}$ and $x > 0$, then $\\exist n \\in \\mathbb{N}$ such that $nx > y$.`,

      },
      {
        name: `Density of $\\mathbb{Q}$`,
        type: `theorem`,
        content: `If $x, y\\in \\mathbb{R}$ and $x < y$ then $\\exist r\\in\\mathbb{Q}$ such that $x < r < y$.`,
        parents: []
      },
      {
        name: `Absolute value`,
        type: `definition`,
        content: ``,
        parents: []
      },
      {
        name: `Triangle inequality`,
        type: `theorem`,
        content: `$\\forall x,y\\in\\mathbb{R}, |x+y|\\le |x|+|y|$.`,
        parents: []
      },
    ]
  }
] as Chapter[]