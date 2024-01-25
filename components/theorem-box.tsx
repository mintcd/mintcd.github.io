import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Latex from 'react-latex-next';

export default function TheoremBox({ statement }: { statement: Statement }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function bgColor(type: string) {
    if (type === 'theorem') return 'bg-blue-100';
    else if (type === 'definition') return 'bg-green-100';
    else return 'bg-gray-100';
  }

  return (
    <div
      className={`border rounded p-4 ${bgColor(statement.type)} m-3`}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="flex justify-between items-center mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-lg font-semibold">
          {statement.type.charAt(0).toUpperCase() + statement.type.slice(1)}
        </span>
        {isExpanded ? (
          <BsChevronUp size={20} />
        ) : (
          <BsChevronDown size={20} />
        )}
      </div>
      {isExpanded && (
        <Latex>
          {statement.content}
        </Latex>
      )}
    </div>
  );
}
