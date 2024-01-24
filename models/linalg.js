export default [
    {
        chapter: 1,
        name: "Vector spaces",
        statements: [
            {
                id: '1',
                type: "definition",
                name: "Vector space",
                content: "A set $V$ is called a vector space (linear space) over a field $\\mathbb{F}$ if it is qualified two operations $\\\\ \\text{1. }$ Vector addition. $$\\begin{aligned} + : V\\times V &\\to V \\\\ (x,y) &\\mapsto x+y \\end{aligned}$$ $\\\\ \\text{2. }$ Scalar multiplication. $$\\begin{aligned} \\cdot : \\mathbb{F}\\times V &\\to V \\\\ (c,x) &\\mapsto cx \\end{aligned}$$ satisfying the following conditions $\\\\ \\text{1. }$ $x+y=y+x,\\,\\,\\forall x,y\\in V.$ $\\\\ \\text{2. }$ $(x+y)+z=x+(y+z),\\,\\,\\forall x,y,z\\in V.$ $\\\\ \\text{3. }$ There exists $0\\in V$, such that $x+0=0+x=x,\\,\\,\\forall x\\in V.$ $\\\\ \\text{4. }$ For each $x\\in V$, there exists $y\\in V$, such that $x+y=0$. $\\\\ \\text{5. }$ $1x=x,\\,\\,\\forall x\\in V.$ $\\\\ \\text{6. }$ $(cx)y=x(cy),\\,\\,\\forall x,y\\in V, c\\in\\mathbb{F}.$ $\\\\ \\text{7. }$ $c(x+y)=cx+cy,\\,\\,\\forall x,y\\in V, c\\in\\mathbb{F}.$ $\\\\ \\text{8. }$ $(a+b)x=ax+bx,\\,\\,\\forall x\\in V, a,b\\in\\mathbb{F}.$",
                depending: [],
            },
            {
                id: '2',
                type: "definition",
                content: "A subset $W$ of a vector space $V$ is called a subspace of $V$ if itself is a vector space, denoted by $W\\le V$.",
                depending: [],
            },
            {
                id: '1.3',
                type: "theorem",
                name: "Subspace",
                content: "Let $V$ be a vector space, $W\\le V$ if and only if the following hold $\\\\ \\text{1. }$ $0\\in W.$ $\\\\ \\text{2. }$ If $x,y\\in W$ then $x+y\\in W.$ $\\\\ \\text{3. }$  If $x\\in W$ and $c\\in\\mathbb{F}$ then $cx\\in W.$",
                short: "",
                depending: [],
            },

            {
                id: '3',
                type: "definition",
                content: "Let $S = \\{v_1,...,v_m\\} \\subset V$, each vector $x = a_1v_1+...+a_mv_m$ is called a linear combination of the vectors in S. The set of all such combinations is called the span of S, denoted by $\\mathrm{span}\\,(S)$. Define $\\mathrm{span}\\,(\\varnothing) = \\{0\\}$.",
                depending: [],
            },
            {
                id: '1.5',
                type: "theorem",
                name: "Spanning sets",
                content: `$\\\\ \\text{1. }$ If $S\\subset V$, then $\\mathrm{span}\\,(S)\\le V.$ 
                        $\\\\ \\text{2. }$ If $W\\le V$ and $S\\subset W$, then $\\mathrm{span}\\,(S) \\subset W.$`,
                depending: [],
            },
            {
                id: '4',
                type: "definition",
                content: "Let $S = \\{v_1,...,v_m\\} \\subset V$, then $S$ is called linearly dependent if there exist $a_1,...,a_m\\in \\mathbb{F}$ not all zero, such that $a_1v_1+...+a_mv_m = 0$. Otherwise, $S$ is called linearly independent.",
                depending: [],
            },
            {
                id: '1.6',
                type: "theorem",
                name: "Linear independence and dependence",
                content: `Given $S\\subseteq T\\subseteq V$, then 
                $\\\\ 1.$ If $T$ is linearly independent, so is $S$. 
                $\\\\ 2.$ If $S$ is linearly dependent, so is $T$
                $\\\\ 3.$ $S\\cup \\{v\\}$ is linearly dependent if and only if $v\\in\\mathrm{span}\\,(S)$`,
                depending: [],
            },
            // {
            //     id: '5',
            //     type: "definition",
            //     content: "A set $\\beta\\in V$ is called a basis for $V$ if $\\beta$ is linearly independent and $\\mathrm{span}\\,(\\beta) = V$.",
            //     depending: [],
            // },
            {
                id: '1.8',
                type: "theorem",
                name: "Basis",
                content: "A set $\\beta$ is a basis for $V$ if and only if each vector $v\\in V$ can be uniquely expressed as a linear combination of the vectors in $\\beta$.",
                short: `The following statements are equivalent, any can be used for basis definition
                $\\\\\\textbf{1. }$ $\\beta$ is linearly independent and generates $V$.
                $\\\\\\textbf{2. }$ $\\beta$ is maximal linearly independent.
                $\\\\\\textbf{3. }$ Every vector in $V$ can be expressed uniquely as a combination of vectors in $\\beta$.`,
                depending: [],
            },
            {
                id: '1.9',
                type: "theorem",
                name: "Construct a basis from a spanning set",
                content: "If $\\mathrm{span}\\,(S) = V$, where each is a finite set, then some subset of $S$ is a basis for $V$. Hence $V$ has a finite basis.",
                depending: [],
            },
            {
                id: '1.10',
                type: "theorem",
                name: "Replacement theorem",
                content: `Let $S$ be a generating subset of $V$ containing $n$ elements and $T$ is a linearly independent subset of $V$ containing $m$ elements. Then $m\\le n$ and there exist a subset $S'$ of $S$ containing $n-m$ element such that $S'\\cup T$ generates $V$.`,
                short: `Let $V = \\mathrm{span}\\,(S)$ where $|S| = n$ and $T\\subset V$ where $|T|=m$. Then $m \\le n$ and the exists $S'\\subseteq S$, $|S'| = n-m$ such that $\\mathrm{span}\\,(S'\\cup T) = V$`,
                depending: ['1.9'],
            },
            {
                id: '1.105',
                type: "theorem",
                name: "Dimension definition",
                content: "Every basis of $V$ contains the same number of vectors, called the dimension of $V$, denoted by $\\dim V$",
                depending: ['1.10'],
            },
            {
                id: '1.106',
                type: "theorem",
                name: "Dimension properties",
                content: `If $\\dim V = n$, then $\\\\\\textbf{1. }$ Any generating set $G$ for $V$ contains at least $n$ vectors. 
                $\\\\\\textbf{2. }$ Any linearly independent subset of $V$ that contains exactly $n$ vectors is a basis for $V$. 
                $\\\\\\textbf{3. }$ Any linearly independent subset of $V$ can be extended to a basis for $V$`,
                depending: ['1.10'],
            },
            {
                id: '1.11',
                type: "theorem",
                name: "The Dimension of Subspaces",
                content: "Let $V$ be a finite dimensional space and $W\\le V$, then $\\dim W \\le \\dim V$. Equality holds if and only if $W = V$.",
                depending: ['1.10'],
            },
            {
                id: '6',
                type: "definition",
                content: "",
                short: "Given $W_1,...,W_k \\le V$, the set $W_1+...+W_k = \\{w_1+...+w_k \\,|\\, w_i\\in W_i \\}$ is called the sum of $W_1,...,W_k$. If for every $v\\in W_1+...+W_2$, there are unique $w_1,...,w_k$ such that $v=w_1+...+w_k$, the sum is called the direct sum of $W_1,...,W_k$, denoted by $W_1 \\oplus ... \\oplus W_k$.",
                depending: [],
            },
            {
                id: '1.12',
                type: "definition",
                content: "",
                short: `The following statements are equivalent
                        $\\\\\\textbf{1. }$ $W_1+...+W_k$ is a direct sum.
                        $\\\\\\textbf{2. }$ $W_i \\bigcap(\\sum\\limits_{j\\ne i} W_j) = \\{0\\}$.
                        $\\\\\\textbf{3. }$ $W_i \\bigcap(\\sum\\limits_{j > i} W_j) = \\{0\\}$.`,
                depending: [],
            },
        ]
    },
    {
        chapter: 2,
        name: "Linear transformations and Matrices",
        statements: [
            {
                id: '1',
                type: 'definition',
                name: "Linear transformations",
                content: "A linear transformation is a homomorphism between two vector spaces",
                depending: [],
            },
            {
                id: '2',
                type: 'definition',
                name: "Matrix of a linear transformation",
                content: "Let $\\alpha=\\{\\alpha_1,...,\\alpha_n\\}$ and $\\beta=\\{\\beta_1,...,\\beta_m\\}$ be bases of $V$ and $W$. Let $T : V\\to W$. For each $\\alpha_j$, there exist unique scalars $a_{1j},...,a_{mj}$ such that $T(\\alpha_j)=\\sum\\limits_{i=1}^m a_{ij}\\beta_i$. The matrix $[T]_\\alpha^\\beta = (a_{ij})$ is called transformation matrix with respect to bases $\\alpha$ and $\\beta$.",
                depending: [],

            },
            {
                id: '2.1',
                type: 'theorem',
                name: "Inverse transformation properties",
                content: "",
                short: "If $T$ is invertible, then $T^{-1}$ is linear.",
                depending: [],
            },
            {
                id: '2.2',
                type: 'theorem',
                name: "Isomorphic spaces",
                content: "",
                short: "$V \\cong W \\Leftrightarrow \\dim V = \\dim W$.",
                depending: [],
            },
            {
                id: '2.3',
                type: 'theorem',
                name: "Determine a Transformation",
                content: "Let $\\alpha=\\{\\alpha_1,...,\\alpha_n\\}$ be a basis of $V$ and $\\beta=\\{\\beta_1,...,\\beta_m\\}$ be a basis of $W$. Then $$\\begin{aligned} \\Phi: \\mathcal{L}(V,W) &\\to \\mathcal{M}_{m\\times n} \\\\ T &\\mapsto [T]_\\alpha^\\beta \\end{aligned}$$ is an isomorphism.",
                short: "$\\mathcal{L}(V,W) \\cong \\mathcal{M}_{m\\times n}$",
                depending: [],
            },
            {
                id: '2.4',
                type: 'theorem',
                name: "Properties of Transformation matrix",
                content: "Let $\\alpha=\\{\\alpha_1,...,\\alpha_n\\}$ be a basis of $V$ and $\\beta=\\{\\beta_1,...,\\beta_m\\}$ be a basis of $W$. Then $$\\begin{aligned} \\Phi: \\mathcal{L}(V,W) &\\to \\mathcal{M}_{m\\times n} \\\\ T &\\mapsto [T]_\\alpha^\\beta \\end{aligned}$$ is an isomorphism.",
                short: "$\\mathcal{L}(V,W) \\cong \\mathcal{M}_{m\\times n}$",
                depending: [],
            },
        ]
    },
    // {
    //     chapter: 4,
    //     name: "Determinant",
    //     statements: [
    //         {
    //             id: '1',
    //             type: "definition",
    //             content: "A $k$ alternating linear form in $V$ is a function $f : V^k \\to \\mathbb{F}$, such that $\\\\\\textbf{1.}$  $f(v_1,...,cu_i+v_i,...,v_k) = cf(v_1,...,u_i,...,v_k) + f(v_1,...,v_i,...,v_k)$.  $\\\\\\textbf{2.}$ $f(v_1,...,v_i,...,v_j,...,v_k) = 0$ if $v_i=v_j$. $\\\\$ The set of all $k$ alternating linear forms is a vector space over $\\mathbb{F}$, denoted by $\\Lambda^k(V)^*$.",
    //         },
    //         {
    //             id: '4.1',
    //             type: "theorem",
    //             content: "If $\\dim V = n$, then $\\dim\\Lambda^n(V)^* = 1$.",
    //             proof: "Let $\\{v_1,...,v_n\\}$ be a basis of $V$ and $\\alpha_j = \\sum\\limits_{i=1}^n a_{ij}v_i$. Then for each $\\varphi\\in\\Lambda^n(V)^*$, we have $$\\varphi(\\alpha_1,...,\\alpha_n) = \\varphi(\\alpha_1,...,\\alpha_n)$$",
    //         },
    //         {
    //             id: '2',
    //             type: "definition",
    //             name: "permutation",
    //             content: "A permutation $\\sigma$ on a set $A = \\{1, \\ldots, n\\}$ is a bijection from $A$ to itself. The set of all permutations on $A$ under composition is a group, denoted by $S_n$.",
    //         },
    //     ]
    // },
    // {
    //     chapter: 6,
    //     name: "Inner product space",
    //     statements: [
    //         {
    //             id: '6.1',
    //             type: 'theorem',
    //             name: 'Basic properties of inner product',
    //             content: "For any $x,y,x\\in V$ and $c\\in\\mathbb{F}$ we have $\\\\ \\text{(a) }$  $\\langle x,y+z\\rangle = \\langle x,y\\rangle + \\langle x,z\\rangle$ $\\\\ \\text{(b) }$  $\\langle x,cy\\rangle =  \\overline{c}\\langle x,y\\rangle$. $\\\\ \\text{(c) }$  $\\langle x,0\\rangle =  \\langle 0,x\\rangle = 0$   $\\\\ \\text{(d) }$  $\\langle x,x\\rangle = 0 \\Leftrightarrow x=0$. $\\\\ \\text{(e) }$ $\\langle x,y\\rangle = \\langle x,z\\rangle,\\,\\, x\\in V \\Rightarrow y=z$.",
    //             depending: []

    //         },
    //         {
    //             id: '2',
    //             type: 'definition',
    //             name: 'Norm',
    //             content: "The norm a vector $x$ is $||x||=\\sqrt{\\langle x,x\\rangle}$.",
    //             depending: []
    //         },
    //         {
    //             id: '6.2',
    //             type: 'theorem',
    //             name: "Basic properties of norm",
    //             content: "For all $x,y\\in V$ and $c\\in\\mathbb{F}$, we have $\\\\ \\text{(a) }$ $||cx||=|c|\\cdot||x||$. $\\\\ \\text{(b) }$ $||x||\\ge 0$, equality holds if and only if $|x|=0$ $\\\\ \\text{(c) }$ (Cauchy-Schwarz inequality) $|\\langle x,y\\rangle| \\le ||x||\\cdot||y||.$ $\\\\ \\text{(d) }$ (Triangle inequality) $||x+y||\\le ||x||+||y||.$",
    //             depending: []
    //         },
    //         {
    //             id: '6.3',
    //             type: 'theorem',
    //             content: "Vectors $x$ and $y$ are orthogonal if $\\langle x,y\\rangle=0$. A vector",
    //             short: "Any orthogonal set not containing $0$ is linearly independent.",
    //             depending: []
    //         },
    //         {
    //             id: '6.4',
    //             type: 'theorem',
    //             content: "Vectors $x$ and $y$ are orthogonal if $\\langle x,y\\rangle=0$. A vector",
    //             short: "Any finite dimensinal vector space has an orthonormal basis.",
    //             depending: []
    //         },
    //         {
    //             id: '6.15',
    //             type: 'theorem',
    //             content: "Let $V$ be an inner product space, and let $T$ be a normal operator on $V$. Then the following statements are true. $\\\\ \\text{(a) }$  $||T(x)|| = ||T^*(x)||,\\,\\,x\\in V.$ $\\\\ \\text{(b) }$ $T-cI$ is normal for every $x\\in\\mathbb{F}.$ $\\\\ \\text{(c) }$ If $x$ is an eigenvector of $T$, then $x$ is also an eigenvector of $T^*$. In fact, if $T(x)=\\lambda x$, then $T^*(x)=\\overline{\\lambda}x$. $\\\\ \\text{(d) }$ If $\\lambda_1$ and $\\lambda_2$ are distinct eigenvalues of $T$ with corresponding eigenvectors $x_1$ and $x_2$, then $x_1$ and $x_2$ are orthogonal.",
    //             depending: []
    //         },

    //         {
    //             id: '6.16',
    //             type: 'theorem',
    //             content: "Let $T$ be a linear operator on a finite-dimensional complex inner product space $V$. Then $T$ is normal if and only if there exists an orthonormal basis for $V$ consisting of eigenvectors of $T$.",
    //             depending: []
    //         },
    //         {
    //             id: '6.17',
    //             type: 'theorem',
    //             content: "Let $T$ be a linear operator on a finite-dimensional real inner product space $V$. Then $T$ is self-adjoint if and only if there exists an orthonormal basis $β$ for $V$ consisting of eigenvectors of $T$.",
    //             depending: []
    //         },
    //         {
    //             id: '6.24',
    //             type: 'theorem',
    //             content: "Let $V$ be an inner product space and  $T$ be a linear operator on $V$. Then $T$ is an orthogonal projection if and only if $T$ has an adjoint $T^*$ and $T^2 = T = T^*$",
    //             depending: []
    //         },
    //         {
    //             id: '6.25',
    //             type: 'theorem',
    //             content: "$\\textbf{The Spectral theorem}$ Suppose that $T$ is a linear operator on a finite-dimensional inner product space $V$. Then",
    //             depending: ['6.16', '6.17']
    //         }
    //     ]
    // }
]