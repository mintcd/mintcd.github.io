export default [
  {
    name: "Markov chain",
    type: "definition",
    content: `A Markov chain is a triplet $(S, p^{0}, \\Pi)$, where 
    </br>
    1) $S$ is the state space, 
    </br>
    2) $p^{0}=\\{p^{0}_i \\,|\\, i\\in S\\}$ is the initial distribution,
    </br>
    3) $\\Pi = \\{p_{ij}\,|\,i,j\\in S\\}$ is the set of transition probabilities.`,
    dependants: [],
  },
  {
    name: "Markov property",
    type: "theorem",
    content: `A sequence of random variables $(X_n)_{n\\in\\mathbb{N}}$ is a Markov chain if and only if for every $(i_0,\\cdots,i_n)\\in S^{n+1}$, we have
    $$\\PP(X_n = i_n \\,|\\, X_{n-1} = i_{n-1}, \\cdots, X_0 = i_0) = \\PP(X_n = i_n \\,|\\, X_{n-1} = i_{n-1}),$$
    and $\\forall i,j\\in S, \\PP(X_{n+1} = i \\,|\\, X_{n} = j)$ is independent of $n$.`,
    dependants: [],
  },
  {
    name: "recurrent state",
    type: "theorem",
    content: ``,
    dependants: [],
  },
  {
    name: "transient state",
    type: "theorem",
    content: ``,
    dependants: [],
  },
] as Statement[]