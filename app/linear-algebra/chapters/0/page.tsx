'use client'

import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Sidebar from '@app/linear-algebra/sidebar';
import Nav from "@components/nav"

export default function Chapter() {
	return (
		<div>
			<Nav />
			<div className='py-5 grid grid-cols-5 gap-3'>
				<Sidebar current={0} />

				<div className="col-span-4">

					Linear algebra provides computational means for many other scientific fields, such as machine learning and physics. Motivated by solving linear equations, mathematicians have developed a theoretical algebraic approach rooted from the definition of vector space and relevant objects.
					<br />

					<div className="border rounded p-4 bg-blue-100 m-3">
						<Latex>
							{`$\\textbf{Definition. }$ A set $V$ is called a vector space over a field $\\mathbb{F}$ if it is qualified with two operations`}
						</Latex>
						<div className='grid grid-cols-2'>
							<Latex>
								{`$$\\begin{aligned} + : V\\times V &\\to V \\\\ (x,y) &\\mapsto x+y,\\end{aligned}$$`}
							</Latex>
							<Latex>
								{`$$\\begin{aligned} \\cdot : \\mathbb{F}\\times V &\\to V \\\\ (c,x) &\\mapsto cx. \\end{aligned}$$`}
							</Latex>
						</div>
						<Latex>
							{`such that for any $x,y,z\\in V$ and $a,b\\in\\mathbb{F}$, the following axioms are satisfied
		                $$\\begin{aligned} 
		                &\\textbf{1. } x + y = y + x. \\\\
		                &\\textbf{2. } (x + y) + z = x + (y + z).\\\\
		                &\\textbf{3. } \\exists 0\\in V, x + 0 = x.\\\\
		                &\\textbf{4. } \\exists -x\\in V, x + (-x) = 0. \\\\
		                &\\textbf{5. } 1x = x. \\\\
		                &\\textbf{6. } (ab)x = a(bx). \\\\
		                &\\textbf{7. } a(x+y) = ax+ay. \\\\
		                &\\textbf{8. } (a+b)x = ax+bx.
		                \\end{aligned}$$
		                `}
						</Latex>
					</div>

					<Latex>
						{`Elements of $V$ are called vectors. Element of $\\mathbb{F}$ are called scalars because they are able to "scale" a vector. Hence the two operators are called vector addition and scalar multiplication. The four first axioms state that a vector space is an abelian group of addtion. The last axioms define rules for scalar multiplication. Similar to sub-structure of other algebraic structures, it is natural to define subspaces of a vector space.`}
					</Latex>

					<div className="border rounded p-4 bg-blue-100 m-4">
						<span className="text-lg font-semibold mb-2"> Definition. </span>
						<Latex>
							{`A subset $W$ of a vector space $V$ is subspace of $V$ if itself is a vector space.`}
						</Latex>
					</div>

					<div>
						Then we studied specific types of mappings related to vector spaces, namely linear transformations and linear forms.
					</div>

					<div className="border rounded p-4 bg-blue-100 m-4">
						<span className="text-lg font-semibold mb-2"> Definition. </span>
						<Latex>
							{`A map $f:V\\to W$ is called a linear transformation if it satisfies the following conditions
		                     $$\\begin{aligned} 
		                     &\\textbf{1. } f(x+y) = f(x)+f(y). \\\\
		                     &\\textbf{2. } f(cx) = cf(x).\\\\
		                     \\end{aligned}.$$ Or equivalently, $f(cx+y) = cf(x)+f(y)$. If $W=V$, $f$ is called a linear operator.`}
						</Latex>
					</div>

					<Latex>
						{`A linear transformation between two vector spaces is itself a homomorphism, so a vector space is also called a linear space. We study the matrix representation of a linear transformation and seek an equivalence between a linear transformation and its representation to extend results on linear transformations to matrices. Then we concern the following characteristics of linear transformations
					`}
					</Latex>

					<ul className='list-disc ml-10'>
						<li> Invertibility </li>
						<li> Diagonalizability </li>
						<li> Invariance, specifically the eigenvalues and eigenvectors </li>
					</ul>

					<div className="border rounded p-4 bg-blue-100 m-4">
						<span className="text-lg font-semibold mb-2"> Definition. </span>
						<Latex>
							{`A map $f:V^k\\to \\mathbb{F}$ is called a linear form if it satisfies the following conditions
		                     $$\\begin{aligned} 
		                     &\\textbf{1. } f(x_1,...,x_j+y_j,...+x_k) = f(x_1,...,x_j,...,x_k) + f(x_1,...,y_j,...,x_k). \\\\
		                     &\\textbf{2. } f(x_1,...,cx_j,...+x_k) = cf(x_1,...,x_j,...,x_k)\\\\
		                     \\end{aligned}.$$ Or equivalently, $(x_1,...,cx_j+y_j,...+x_k) = cf(x_1,...,x_j,...,x_k) + f(x_1,...,y_j,...,x_k)$.
		                     `}
						</Latex>
					</div>

					Now it is sufficient for us to define different vector spaces

					<ul className='list-disc ml-10'>
						<li> The quotient space. </li>
						<li> <Latex>{`The vector space $\\mathcal{L}(V,W)$ of all linear transformations from $V$ to $W$ and equivalently, the vector space of matrices`}</Latex>. </li>
						<li> <Latex>{`The dual space $\\mathcal{L}(V,\\mathbb{R})$ of all linear operators`}</Latex> and analogously, the matrix transpose. </li>
					</ul>


					<div className="border rounded p-4 bg-blue-100 m-4">
						<span className="text-lg font-semibold mb-2"> Definition. </span>
						<Latex>
							{`Applicable properties a linear form $f$
		            $\\\\$ 1. Conjugating bilinear $ f(x_1, x_2) = \\overline{f(x_2,x_1)}$. If $\\mathbb{K} = \\mathbb{R}$, this becomes symmetry.
								$\\\\$ 2. Positive definite bilinear $ f(x,x) \\ge 0,\\,\\,\\forall x$.
								$\\\\$ 3. Alternating multilinear $ f(x_1,...,x_i,...,x_i,...,x_k) = 0$.
								$\\\\$ 4. Normalized multilinear $ f(e_1,...,e_k) = 1$, where $\\{e_1,...,e_k\\}$ is a basis for $V$.
								`}
						</Latex>
					</div>

					Properties 1 and 2 are used to define the <i>inner product</i> and properties 3 and 4 are used to define the <i>determinant</i>.

					We finally draw the picture of linear algebra as a summary of its concepts.

					{/* <div className='flex flex-wrap'>
					<Xwrapper>

						<Node nodeId='1' label='Linear transformation' type="theorem" />
						<Node nodeId='0' label='Vector space' />
						<Node nodeId='2' label='Linear function' />
						<Node nodeId='3' label='Bilinear form' />
						<Node nodeId='4' label='Multilinear form' />


						<Xarrow startAnchor='auto' endAnchor='auto' strokeWidth={2} headSize={4} start='0' end='1' />
						<Xarrow startAnchor='auto' endAnchor='auto' strokeWidth={2} headSize={4} start='0' end='2' />

					</Xwrapper>
				</div> */}

				</div>



			</div >
		</div>

	)
}