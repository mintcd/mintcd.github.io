import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Latex from '@components/latex';

export default function StatementContent({ statement }: { statement: Vertex | undefined }) {
  return (
    statement === undefined ?
      <div className={`transition-all duration-300 ease-in-out
      rounded-md overflow-hidden
      bg-blue-200 p-4 w-full h-full`}>

      </div>
      :
      <div
        className={`transition-all duration-300 ease-in-out
                      rounded-md overflow-hidden
                      bg-blue-200 p-4 w-full h-full`}>
        {statement.content && <Latex>{statement.content}</Latex>}
        {statement.proof && (
          <div className="mt-4">
            <span className={`mr-1 text-lg font-semibold`}>
              Proof
            </span>
            <Latex>{statement.proof}</Latex>
          </div>
        )}
        {statement.examples && (
          <div className="mt-4">
            <span className={`mr-1 text-lg font-semibold`}>
              Examples
            </span>
            {statement.examples.map((example, index) => <Latex key={index}>{example}</Latex>)}
          </div>
        )}
      </div>
  );
}
