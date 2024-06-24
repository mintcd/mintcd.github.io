import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

interface MyLatexProps {
  children: string | string[];
}

const MyLatex: React.FC<MyLatexProps> = ({ children }) => {
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

    "\\d": "\\mathrm{d}",

    "\\1": "\\mathbf{1}"
  };

  // Ensure children is an array
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div id='latex-container' className='font-modern'>
      {childrenArray.map((child, index) => (
        <Latex key={index} macros={macros}>{child}</Latex>
      ))}
    </div>
  );
};

export default MyLatex;
