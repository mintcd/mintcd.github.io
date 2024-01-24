'use client'

import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Sidebar from "@app/linear-algebra/sidebar"

export default function Chapter() {


  return (
    <div className='py-5 grid grid-cols-4 gap-3'>
      <div className='col-span-1'><Sidebar current={2} /></div>
      <div className='col-span-3'>
        Generally, vector space is an algebraic structure specified by the set of vectors <Latex> $V$ </Latex> and the set of scalars <Latex>{`$\\mathbb{F}$`}</Latex>. So we concern about the homomorphism between two vector spaces in the normal sense - operation preservation. Concretely, if <Latex>{`$f: V\\to W$`}</Latex> is a homomorphism, then it preserves vector addition and scalar multiplication.
        <Latex>$$f(x+y) = f(x)+f(y),\,\,\forall x,y\in V$$</Latex>
        <Latex>{`$$f(ax) = af(x),\\,\\,\\forall x\\in V, c\\in\\mathbb{F}$$`}</Latex>
        The above properties are similar to that of linear function in analysis. So we use the term "linear transformation" interchangeably with "homomorphism" in the case of vector spaces.
        <div className="border rounded p-4 bg-blue-100 m-3">
          <span className="text-lg font-semibold mb-2"> Definition. </span>
          <Latex>
            {`A linear transformation between two vector spaces $V$ and $W$ is a mapping $f: V\\to W$ satisfying 
          $$f(x+y) = f(x)+f(y),\\,\\,\\forall x,y\\in V$$ $$f(ax) = af(x),\\,\\,\\forall x\\in V, c\\in\\mathbb{F}$$`}
          </Latex>
        </div>

        For example, let <Latex>{`$P_3[\\mathbb{R}]$`}</Latex> and <Latex>{`$P_2[\\mathbb{R}]$`}</Latex> be <Latex>{`$\\mathbb{R}$`}</Latex> vector spaces of polynomials of degree not exceeding 3 and 2, repectively. The derivative
        <Latex>{`$$\\dfrac{\\mathrm{d}}{\\mathrm{d}x} : P_3[\\mathbb{R}] \\to P_2[\\mathbb{R}]$$`}</Latex> is a linear transformation.
        <br />
        <Latex>
          {`Let $\\beta=\\{\\beta_1,...,\\beta_m\\}$ and $\\gamma=\\{\\gamma_1,...,\\gamma_n\\}$ are bases for $V$ and $W$, respectively. Then each $f(\\beta_1),...,f(\\beta_m)\\in W$ can be express uniquely as linear combinations of $\\gamma_1,...,\\gamma_n$, concretely $$f(\\beta_i) = \\sum\\limits_{j=1}^n a_{ij}\\gamma_i,\\,\\,j=1,...,n.$$ In terms of matrix product,$$ 
            \\left(\\begin{array}{c} f(\\beta_1) \\\\ \\vdots \\\\ f(\\beta_n) \\\\\\end{array}\\right) 
            =  \\left(\\begin{array}{ccc} a_{11} & \\cdots & a_{1n} \\\\ \\vdots & \\ddots & \\vdots \\\\ a_{m1} & \\cdots & a_{mn} \\\\ \\end{array}\\right)
            \\left(\\begin{array}{c} \\gamma_1 \\\\ \\vdots \\\\ \\gamma_n \\\\\\end{array}\\right).$$
          The matrix $(a_{ij})$ is called the matrix of $f$ relative to bases $\\beta$ and $\\gamma$, denoted by $[f]_\\beta^\\gamma$. If $\\beta=\\gamma$, we simply denote it $[f]_\\beta$.
          For some vector $v = b_m\\beta_m +...+b_m\\beta_m\\in V$, we have 
          $$f(v) = \\left(\\begin{array}{ccc} b_1 & ... & b_m \\\\ \\end{array}\\right)
          \\left(\\begin{array}{c} f(\\beta_1) \\\\ \\vdots \\\\ f(\\beta_m) \\\\\\end{array}\\right)
          = \\left(\\begin{array}{ccc} b_1 & ... & b_n \\\\ \\end{array}\\right)
          \\left(\\begin{array}{ccc} a_{11} & \\cdots & a_{1n} \\\\ \\vdots & \\ddots & \\vdots \\\\ a_{m1} & \\cdots & a_{mn} \\\\ \\end{array}\\right)
            \\left(\\begin{array}{c} \\gamma_1 \\\\ \\vdots \\\\ \\gamma_n \\\\\\end{array}\\right).
          $$ Hence $[f(v)]_\\gamma = [v]_\\beta[f]_\\beta^\\gamma$.`}
        </Latex>
        <div>
          <Latex>
            {`Next, we will show that for given bases $\\beta$ for $V$ and $\\gamma$ for $W$, for each linear transformation $f$, there is an $m\\times n$ representation matrix for $f$ and vice versa. This means there is a bijection from $\\mathcal{L}(V,W)$ to $\\mathcal{M}_{m\\times n}^\\mathbb{F}$. Moreover, the bijection is an isomorphism, meaning that almost all theorems on linear transformation have a matrix version and so far, we have formalized matrix by linear transformation, which is a more systematic approach.`}
          </Latex>

        </div>
        <div className="border rounded p-4 bg-green-100 m-3">
          <span className="text-lg font-semibold mb-2"> Theorem. </span>
          <Latex>
            {`For given bases $\\beta$ for $V$ and $\\gamma$ for $W$, the mapping 
            $$\\begin{aligned} \\Phi : \\mathcal{L}(V,W) &\\to  \\mathcal{M}_{m\\times n}^\\mathbb{F} \\\\ f &\\mapsto [f]_\\beta^\\gamma \\end{aligned}$$ is an isomorphism.`}
          </Latex>
        </div>
        <i> Proof. </i>
        <Latex>
          {`For each transformation, the matrix has been constructed uniquely as shown above. Now for each matrix $A = (a_{ij})\\in \\mathcal{M}_{m\\times n}^\\mathbb{F}$, define $f$ such that $$f(\\beta_i) = \\sum\\limits_{j=1}^n a_{ij}\\gamma_j,\\,\\, 1\\le i \\le m, 1\\le j \\le n.$$ We need to show that $f$ is unique. Suppose that there is $g$ such that $$g(\\beta_i) = \\sum\\limits_{j=1}^n a_{ij}\\gamma_j,\\,\\, 1\\le i \\le m, 1\\le j \\le n,$$ we can easily see that $f(v)=g(v),\\,\\,\\forall v\\in V$. Therefore, $\\Phi$ is a bijection. $$$$ To show that $\\Phi$ is an isomorphism, we have to point out that $$\\Phi(cf+g) = c[f]_\\beta^\\gamma + [g]_\\beta^\\gamma.$$ Indeed, since $(cf+g)(v) = cf(v) + g(v)$, we have 
          $$[(cf+g)(v)]_\\gamma 
          = c[f(v)]_\\gamma + [g(v)]_\\gamma 
          = c[v]_\\beta[f]_\\beta^\\gamma + [v]_\\beta[g]_\\beta^\\gamma
          = [v]_\\beta[cf]_\\beta^\\gamma + [v]_\\beta[g]_\\beta^\\gamma
          = [v]_\\beta([cf]_\\beta^\\gamma + [g]_\\beta^\\gamma) = [v]_\\beta([cf + g])_\\beta^\\gamma.$$ Hence $[cf + g])_\\beta^\\gamma$ is the matrix of $cf+g$ relative to bases $\\beta$ and $\\gamma$.`}
        </Latex>
      </div>
    </div>
  )
}