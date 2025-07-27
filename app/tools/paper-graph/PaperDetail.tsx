import { LightbulbIcon, OpenIcon } from "@public/icons";
import { useRef, useState } from "react";
import { fetchFromSemanticScholar, getOpenUrl } from "./utils";
import { useClickOutside } from "@hooks";
import PaperCard from "./PaperCard";


export default function PaperDetail({ paper }: { paper: Paper | null }) {
  const [abstractExpanded, setAbstractExpanded] = useState(false)
  const [cachedRelatedPapers, setCitationCache] = useState<{
    [id: string]: {
      references: RelatedPaper[],
      citations: RelatedPaper[],
    }
  }>({});
  const [suggestions, setSuggestions] = useState<{
    references: any[],
    citations: any[],
    open: boolean,
  }>({ references: [], citations: [], open: false });
  const [visibleReferenceCount, setVisibleReferenceCount] = useState(10);
  const [visibleCitationCount, setVisibleCitationCount] = useState(10);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  useClickOutside(suggestionRef, () => setSuggestions(d => ({ ...d, open: false })))

  async function handleSuggest() {
    if (!paper) return;

    if (cachedRelatedPapers[paper.id]) {
      setSuggestions({
        ...cachedRelatedPapers[paper.id],
        open: true,
      });
      return;
    }

    setSuggestionLoading(true);
    const paperData = await fetchFromSemanticScholar(paper.scid)
    const newEntry = {
      references: paperData.references ?? [],
      citations: paperData.citations ?? [],
    }

    // Cache it
    setCitationCache(prev => ({
      ...prev,
      [paper.id]: newEntry,
    }));

    // Show modal
    setSuggestions({
      ...newEntry,
      open: true,
    });

    setSuggestionLoading(false)
  }

  return (
    paper
      ?
      <>
        <div className="paper-detail bg-slate-100 rounded-md p-2 h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200">
          <div className='flex justify-between'>
            <span className="font-semibold text-sm text-blue-700 truncate">
              {paper.title}
            </span>
            <span className='flex'>
              <LightbulbIcon className='mr-2 cursor-pointer' size={18} onClick={(e) => {
                e.stopPropagation();
                handleSuggest()
              }} />
              <OpenIcon size={18} className='cursor-pointer' onClick={(e) => {
                e.stopPropagation();
                const url = getOpenUrl(paper);
                if (url) window.open(url, '_blank');
              }} />
            </span>

          </div>
          <div className='flex justify-between'>
            {paper.authors && (
              <span className="text-xs text-gray-600 mt-1">
                {paper.authors.map(author => author.name).join(', ')}
              </span>
            )}
            {typeof paper.citationCount === 'number' && (
              <span className="text-xs text-gray-600 mt-1">
                {paper.citationCount} citations
              </span>
            )}
          </div>

          {<div onClick={() => setAbstractExpanded(!abstractExpanded)}>
            <strong>Abstract. </strong>
            {
              paper.abstract ?
                (abstractExpanded
                  ? paper.abstract
                  : paper.abstract?.slice(0, 200) + '...')
                : "No abstract found."
            }
          </div>
          }
          {suggestions.open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div ref={suggestionRef} className="bg-white w-[50vw] max-h-[80vh] p-6 rounded shadow overflow-y-auto">

                {/* References Section */}
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
                          Show 10 more
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
                          Show 10 more
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </>
      : <></>
  )
}