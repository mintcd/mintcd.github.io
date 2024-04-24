import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Latex from 'react-latex-next';

export default function TheoremBox({ statement }: { statement: Statement }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const boxStyle: { [key in StatementType]: { backgroundColor: string, borderColor: string } } = {
    axiom: {
      backgroundColor: 'gray-100',
      borderColor: 'border-green-400'
    },
    corollary: {
      backgroundColor: 'gray-100',
      borderColor: 'gray-400'
    },
    definition: {
      backgroundColor: 'green-50',
      borderColor: 'border-green-400'
    },
    example: {
      backgroundColor: 'gray-100',
      borderColor: 'gray-400'
    },
    lemma: {
      backgroundColor: 'green-50',
      borderColor: 'blue-400'
    },
    note: {
      backgroundColor: 'gray-100',
      borderColor: 'gray-400'
    },
    proposition: {
      backgroundColor: 'gray-100',
      borderColor: 'gray-400'
    },
    theorem: {
      backgroundColor: 'blue-50',
      borderColor: 'blue-400'
    },
    'thought-bubble': {
      backgroundColor: 'gray-100',
      borderColor: 'gray-400'
    }
  }

  return (
    <div onClick={() => setIsExpanded(!isExpanded)}
      className={`cursor-pointer transition-all duration-300 ease-in-out
                      border-2 rounded-md overflow-hidden
                      ${isExpanded ? 'max-h-full' : 'max-h-14'}
                      m-3
                      bg-${boxStyle[statement.type].backgroundColor} border-${boxStyle[statement.type].borderColor}`}>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className={`mr-1 text-lg font-semibold border-${boxStyle[statement.type].borderColor}`}>
            {statement.type.charAt(0).toUpperCase() + statement.type.slice(1)}
          </span>
          {isExpanded ? (
            <BsChevronUp size={15} />
          ) : (
            <BsChevronDown size={15} />
          )}
        </div>
        <Latex>{statement.content}</Latex>
      </div>
    </div>
  );
}

