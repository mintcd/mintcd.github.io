import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Latex from 'react-latex-next';

export default function TheoremBox({ statement }: { statement: Statement }) {
  const [isExpanded, setIsExpanded] = useState(true);

  function bgColor(type: string) {
    if (type === 'theorem') return 'bg-blue-50';
    else if (type === 'lemma') return 'bg-blue-50';
    else if (type === 'definition') return 'bg-green-50';
    else return 'bg-gray-100';
  }

  function borderColor(type: string) {
    if (type === 'theorem') return 'border-blue-400';
    else if (type === 'lemma') return 'border-blue-400';
    else if (type === 'definition') return 'border-green-400';
    else return 'border-gray-400';
  }

  return (
    <div
      className={`border-2 rounded-md overflow-hidden ${bgColor(
        statement.type
      )} ${borderColor(statement.type)} m-3 cursor-pointer transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-full' : 'max-h-14'}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className={`mr-1 text-lg font-semibold ${borderColor(statement.type)}`}>
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

