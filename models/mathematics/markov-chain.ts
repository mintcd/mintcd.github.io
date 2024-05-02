export default [
  {
    chapterName: "Markov Chain",
    notations: [],
    statements: [
      {
        name: "Discrete-time Markov property",
        type: "definition",
        content: `A sequence of random variables $(X_n)_{n\\in\\mathbb{N}}$ is a Markov chain if and only if for every $(i_0,\\cdots,i_n)\\in S^{n+1}$, we have
        $$\\PP(X_n = i_n \\,|\\, X_{n-1} = i_{n-1}, \\cdots, X_0 = i_0) = \\PP(X_n = i_n \\,|\\, X_{n-1} = i_{n-1}).$$`,
        implications: [
          {
            name: "Homogeneity",
            type: "definition",
            content: `The given Markov chain is homogeneous if $\\PP(X_n = i_n \\,|\\, X_{n-1} = i_{n-1})$ is independent of $n$. Otherwise, it is inhomogeneous.`,
          },
        ]
      },
      {
        name: "Representation of a homogeneous Markov chain",
        type: "theorem",
        content: `A homogeneous Markov chain can be described as a triplet $(S, p^{0}, \\Pi)$ including
        </br>
        1) The state space $S$, 
        </br>
        2) The initial distribution $p^{0}=\\{p^{0}_i \\,|\\, i\\in S\\}$,
        </br>
        3) The set of transition probabilities $\\Pi = \\{p_{ij}\,|\,i,j\\in S\\}$.`,
        implications: [
          {
            name: "stochastic matrix",
            type: "definition",
            content: `If $S$ is discrete, we can establish a map $S\\to\\{1,\\cdots,n\\}\\subset\\NN$. Then $\\Pi$ is a stochastic matrix whose $p_{ij}$ is the $(i,j)$ entry.`,
            dependants: [],
          },
          {
            name: "stationary distribution",
            type: "definition",
            content: `A distribution $\\pi$ of state in $S$ is stationary if $\\pi\\Pi = \\pi$.`,
            dependants: [],
          },
          {
            name: "transition after $t$ steps",
            type: "theorem",
            content: `Define $(p_{ij}^{(t)})$ to be the probability of reaching state $j$ from state $i$ after $t$ steps. By convention, $\\begin{cases}
                            p_{ij}^{(0)} = 1, \\text{ if } i = j, \\\\
                            p_{ij}^{(0)} = 0, \\text{ if } i \\ne j.
                        \\end{cases}$. Then $\\Pi^t=(p_{ij}^{(t)})$`,
            dependants: [],
          }
        ]
      },

      {
        name: "reachability and communicativity",
        type: "definition",
        content: `A state $j$ is reachable from a state $i$ if there exists $t\\in\\N$ such that $p_{ij}^{(t)}>0$. Two stages $i$ and $j$ communicate if they are reachable from each other.`,
        dependants: [],
        implications: [
          {
            name: "irreducible Markov chain",
            type: "definition",
            content: `Communicativity is an equivalence relation. Hence $S$ contains partitions of equivalence classes, called called communication classes. A Markov chain is irreducible if there exists only one partition of $S$.`,
            dependants: [],
          },
          {
            name: "class property",
            type: "definition",
            content: `A property $P$ is said to be a class property if whenever $i\\in S$ satisfies $P$, then $[i]$ satisfy $P$.`,
            dependants: [],
          },
        ]
      },
      {
        name: "Markov chain from i.i.d random variables",
        type: "theorem",
        content: `Let $(\\zeta_n)_{n\\in\\NN}$ be a sequence of i.i.d random variables in a space $\\Xi$, a map $f:\\Xi\\times S\\to S$ and a random variable $X_0$ independent of $(\\zeta_n)$. The process $(X_n)_{n\\in\\NN}$ defined by 
        $$X_{n+1} = f(X_n,\\zeta_n)$$
        is a Markov chain. Moreover, the transition probabilities are 
        $$p_{ij}=\\PP(f(i,\\zeta_1)=j).$$`,
        dependants: [],
      },
      {
        name: "Recurrent and transient states",
        type: "definition",
        content: `A state $s_i$ is recurrent if starting from $s_i$, one will eventually return to $s_i$. Otherwise, $s_i$ is transient.`,
        dependants: [],
      },
    ]
  },
] as Chapter[]