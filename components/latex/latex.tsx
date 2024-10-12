import React, { useEffect, useRef, useState } from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function MyLatex({ children }: { children: string }) {

  const latexRef = useRef(null)
  const alphabet: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const macros: Record<string, string> = {}

  alphabet.forEach(letter => {
    macros[`\\${letter}${letter}`] = `\\mathbb{${letter}}`;
    macros[`\\${letter}`] = `\\mathcal{${letter}}`;
  });

  const preprocessItemize = (latexString: string) => {
    // Replace itemize environments with <ul> and <li> tags
    return latexString
      .replace(/\\begin{itemize}/g, '<ul class="latex-list">')
      .replace(/\\end{itemize}/g, '</ul>')
      .replace(/\\item/g, '<li>')
      .replace(/<\/li>\s*<li>/g, '</li><li>') // Handle spacing issues between list items
      .replace(/<\/li>\s*<\/ul>/g, '</li></ul>'); // Properly close the last <li>
  };

  // Preprocess the input string to handle newlines
  const preprocessedChildren = preprocessItemize(children.replace(/\n/g, '<br/>'));

  return (
    <div className='latex-container font-modern' ref={latexRef}>
      <Latex macros={macros}>{preprocessedChildren}</Latex>
    </div>
  );
};
