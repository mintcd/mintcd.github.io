import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function MyLatex({ children }: { children: string }) {

  const alphabet: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const macros: Record<string, string> = {}

  alphabet.forEach(letter => {
    macros[`\\${letter}${letter}`] = `\\mathbb{${letter}}`;
    macros[`\\${letter}`] = `\\mathcal{${letter}}`;
  });

  // Preprocess the input string to handle newlines
  const preprocessedChildren = children.replace(/\n/g, '<br/>'); // Replace '\n' with LaTeX line break '\\'

  return (
    <div className='latex-container font-modern text-[14px]'>
      <Latex macros={macros}>{String(preprocessedChildren)}</Latex>
    </div>
  );
};
