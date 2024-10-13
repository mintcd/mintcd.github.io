'use client'

import renderLatex, { Macros } from './renderLatex';
import './Latex.css'

export interface LatexProps {
  children: string | string[];
  delimiters?: Delimiter[];
  strict?: boolean;
  macros?: Macros
}

const defaultDelimiters = [
  { left: '$$', right: '$$', display: true },
  { left: '\\(', right: '\\)', display: false },
  { left: '$', right: '$', display: false },
  { left: '\\[', right: '\\]', display: true },
]

export default function Latex({ children }: { children: string }) {
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

  const renderedLatex = renderLatex(preprocessedChildren, defaultDelimiters, false, macros);
  return (
    <span className="latex" dangerouslySetInnerHTML={{ __html: renderedLatex }} />
  )
}