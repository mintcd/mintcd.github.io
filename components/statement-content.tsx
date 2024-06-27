import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Latex from '@components/latex';

export default function StatementContent({ statement }: { statement: Vertex }) {
  // const boxStyle: { [key in StatementType]: { backgroundColor: string, borderColor: string } } = {
  //   axiom: {
  //     backgroundColor: 'gray-100',
  //     borderColor: 'border-green-400'
  //   },
  //   corollary: {
  //     backgroundColor: 'gray-100',
  //     borderColor: 'gray-400'
  //   },
  //   definition: {
  //     backgroundColor: 'green-50',
  //     borderColor: 'border-green-400'
  //   },
  //   example: {
  //     backgroundColor: 'gray-100',
  //     borderColor: 'gray-400'
  //   },
  //   lemma: {
  //     backgroundColor: 'green-50',
  //     borderColor: 'blue-400'
  //   },
  //   note: {
  //     backgroundColor: 'gray-100',
  //     borderColor: 'gray-400'
  //   },
  //   proposition: {
  //     backgroundColor: 'gray-100',
  //     borderColor: 'gray-400'
  //   },
  //   theorem: {
  //     backgroundColor: 'blue-50',
  //     borderColor: 'blue-400'
  //   },
  //   'thought-bubble': {
  //     backgroundColor: 'gray-100',
  //     borderColor: 'gray-400'
  //   }
  // }

  return (
    <div
      className={`cursor-pointer transition-all duration-300 ease-in-out
                      rounded-md overflow-hidden
                      bg-blue-200 p-4 w-full h-full`}>
      <span className={`mr-1 text-lg font-semibold`}>
        {
          statement.type === "definition-theorem"
            ? "Theorem"
            : statement.type.charAt(0).toUpperCase() + statement.type.slice(1)
        }
      </span>
      {statement.content && <Latex>{statement.content}</Latex>}
      {statement.proof && (
        <div className="mt-4">
          <Latex>{statement.proof}</Latex>
        </div>
      )}
      {statement.examples && (
        <div className="mt-4">
          <Latex>{statement.examples}</Latex>
        </div>
      )}
    </div>
  );
}
