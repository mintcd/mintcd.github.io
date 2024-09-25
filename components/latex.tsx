import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

const MyLatex = ({ children }: {
  children: string
}) => {
  const macros: { [key: string]: string } = {
    "\\EE": "\\mathbb{E}",
    "\\NN": "\\mathbb{N}",
    "\\PP": "\\mathbb{P}",
    "\\QQ": "\\mathbb{Q}",
    "\\RR": "\\mathbb{R}",
    "\\VV": "\\mathbb{V}",

    "\\B": "\\mathcal{B}",
    "\\C": "\\mathcal{C}",
    "\\D": "\\mathcal{D}",
    "\\E": "\\mathcal{E}",
    "\\F": "\\mathcal{F}",
    "\\G": "\\mathcal{G}",
    "\\I": "\\mathcal{I}",
    "\\L": "\\mathcal{L}",
    "\\P": "\\mathcal{P}",
    "\\T": "\\mathcal{T}",
    "\\X": "\\mathcal{X}",
    "\\Y": "\\mathcal{Y}",

    "\\d": "\\mathrm{d}",

    "\\1": "\\mathbf{1}"
  };

  return (
    <div className='latex-container font-modern text-[14px]'>
      <Latex macros={macros}>{children}</Latex>
    </div>
  );
};

export default MyLatex;
