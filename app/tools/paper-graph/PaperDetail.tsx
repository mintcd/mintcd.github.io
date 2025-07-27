import { LightbulbIcon, OpenIcon } from "@public/icons";
import { useEffect, useRef, useState } from "react";
import { fetchFromSemanticScholar, fetchNotionBlock, fetchNotionPage, getOpenUrl } from "./utils";
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
  const [lightbulbData, setLightbulbData] = useState<{
    references: any[],
    citations: any[],
    open: boolean,
  }>({ references: [], citations: [], open: false });
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  useClickOutside(suggestionRef, () => setLightbulbData(d => ({ ...d, open: false })))

  async function handleSuggest() {
    if (!paper) return;

    if (cachedRelatedPapers[paper.id]) {
      setLightbulbData({
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
    setLightbulbData({
      ...newEntry,
      open: true,
    });

    setSuggestionLoading(false)
  }

  return (
    paper
      ?
      <>
        <div className="paper-detail w-[30%] bg-slate-100 rounded-md p-2 h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200">
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
          {lightbulbData.open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div ref={suggestionRef} className="bg-white w-[1/2] max-h-[80vh] p-6 rounded shadow overflow-y-auto">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700">References</h3>
                  {lightbulbData.references.length === 0 ? (
                    <p className="text-sm text-gray-500"> No references found.</p>
                  ) : (
                    <>
                      {lightbulbData.references
                        .sort((a, b) => b.citationCount - a.citationCount)
                        .map((paper) => <PaperCard key={paper.id} paper={paper} />)}
                    </>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Citations</h3>
                  {lightbulbData.citations.length === 0 ? (
                    <p className="text-sm text-gray-500">No citations found.</p>
                  ) : (
                    <>
                      {lightbulbData.citations
                        .sort((a, b) => b.citationCount - a.citationCount)
                        .map((paper) =>
                          <PaperCard key={paper.scid} paper={paper} />)}
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