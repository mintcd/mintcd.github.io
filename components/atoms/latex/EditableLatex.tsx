'use client'

import renderLatex from './renderLatex';

export default function Latex({ children, style }: {
  children: string,
  style?: React.CSSProperties
}) {
  const delimiters = [
    { left: '$$', right: '$$', display: true },
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false },
    { left: '\\[', right: '\\]', display: true },
  ];

  const alphabet: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const macros: Macros = {};

  alphabet.forEach(letter => {
    macros[`\\${letter}${letter}`] = `\\mathbb{${letter}}`;
    macros[`\\${letter}`] = `\\mathcal{${letter}}`;
  });

  const preprocessedChildren = String(children)
  const renderedLatex = renderLatex(preprocessedChildren, delimiters, false, macros);

  const shouldTruncate = style?.width && style?.height;

  return (
    <span
      className="__latex"
      contentEditable
      style={{
        ...style,
        display: 'inline-block', // Added to ensure the span respects width and height
        overflow: shouldTruncate ? 'hidden' : undefined,
        whiteSpace: shouldTruncate ? 'nowrap' : undefined,
        textOverflow: shouldTruncate ? 'ellipsis' : undefined,
      }}
      dangerouslySetInnerHTML={{ __html: renderedLatex }}
    />
  );
}
