'use client'

import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'

export default function MyLatex({ children }: { children: string | undefined }) {
  const macros: { [key: string]: string } = {
    "\\EE": "\\mathbb{E}",
    "\\NN": "\\mathbb{N}",
    "\\PP": "\\mathbb{P}",
    "\\QQ": "\\mathbb{Q}",
    "\\RR": "\\mathbb{R}",
    "\\VV": "\\mathbb{V}",

    "\\B": "\\mathcal{B}",
    "\\F": "\\mathcal{F}",
    "\\P": "\\mathcal{P}",
  }

  return (
    <div itemID='latex-container' className='font-modern'>
      <Latex macros={macros}>{children}</Latex>
    </div>
  )
}
