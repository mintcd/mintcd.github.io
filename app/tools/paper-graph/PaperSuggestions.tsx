import { RefObject, useState } from 'react'
import PaperCard from './PaperCard';

export default function PaperSuggestions({ suggestions, ref }: {
  suggestions: {
    references: RelatedPaper[],
    citations: RelatedPaper[],
  },
  ref: RefObject<HTMLDivElement | null>
}) {
  const [visibleReferenceCount, setVisibleReferenceCount] = useState(10);
  const [visibleCitationCount, setVisibleCitationCount] = useState(10);

  return (
    <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="paper-suggestion bg-white w-[50vw] max-h-[80vh] p-6 rounded shadow overflow-y-auto z-50"
        ref={ref}>
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">References</h3>
          {suggestions.references.length === 0 ? (
            <p className="text-sm text-gray-500">No references found.</p>
          ) : (
            <>
              {suggestions.references
                .sort((a, b) => b.citationCount - a.citationCount)
                .slice(0, visibleReferenceCount)
                .map((paper) => (
                  <PaperCard key={paper.scid} paper={paper} />
                ))}
              {visibleReferenceCount < suggestions.references.length && (
                <button
                  className="text-blue-600 text-sm mt-2"
                  onClick={() => setVisibleReferenceCount(c => c + 10)}
                >
                  More
                </button>
              )}
            </>
          )}
        </div>

        {/* Citations Section */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Citations</h3>
          {suggestions.citations.length === 0 ? (
            <p className="text-sm text-gray-500">No citations found.</p>
          ) : (
            <>
              {suggestions.citations
                .sort((a, b) => b.citationCount - a.citationCount)
                .slice(0, visibleCitationCount)
                .map((paper) => (
                  <PaperCard key={paper.scid} paper={paper} />
                ))}
              {visibleCitationCount < suggestions.citations.length && (
                <button
                  className="text-blue-600 text-sm mt-2"
                  onClick={() => setVisibleCitationCount(c => c + 10)}
                >
                  More
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

