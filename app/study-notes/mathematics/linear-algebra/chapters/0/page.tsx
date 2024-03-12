'use client'

import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Sidebar from '@components/sidebar';
import linalg from '@models/linear-algebra';
import TheoremBox from '@components/theorem-box';

export default function Chapter() {
	const chapter = linalg.find(chapter => chapter.chapter === 1)
	const lintrans = linalg.find(chapter => chapter.chapter === 2)?.statements[0]
	return (
		<div>
			<div className='py-5 grid grid-cols-5 gap-3'>
				<Sidebar topic='linear-algebra' current={0} />

				<div className="col-span-4">


					{chapter?.statements[0] && <TheoremBox statement={chapter.statements[0]} />}

					<Latex>
						{`The first four axioms indicate that a vector space is an abelian group of addtion and the last axioms define rules for scalar multiplication. Similar to sub-structure of other algebraic structures, it is natural to define subspaces of a vector space.`}
					</Latex>

					{chapter?.statements[1] && <TheoremBox statement={chapter.statements[1]} />}
					{lintrans && <TheoremBox statement={lintrans} />}

					<Latex>
						{`A linear transformation between two vector spaces is also a homomorphism. This is the reason why a vector space is also called a linear space. Every vector space has a dimension. Later we will prove that an $n$-dimensional vector space is isomorphic to $\\mathbb{R}^n$. Consequently, we can use a matrix as a representation of a linear transformation. Then we concern characteristics of linear transformations, namely invertibility, diagonalizability and invariance.
					`}
					</Latex>

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