import { EditIcon, LightbulbIcon, OpenIcon } from "@public/icons";
import { useRef, useState } from "react";
import { fetchFromSemanticScholar, getOpenUrl, getPdf } from "./utils";
import { useClickOutside } from "@hooks";
import PaperCard from "./PaperCard";
import PaperSuggestions from "./PaperSuggestions";
import { Loading } from "@components/atoms";


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
          <div className="font-semibold text-sm text-blue-700">
            {paper.title}
          </div>
          <div className='flex'>
            {suggestionLoading
              ? <span className="mr-2"><Loading size={18} /></span>
              : <LightbulbIcon className='mr-2 cursor-pointer' size={18} onClick={(e) => {
                e.stopPropagation();
                handleSuggest()
              }} />}
            {getPdf(paper) &&
              <EditIcon size={18} className='mr-2 cursor-pointer' onClick={(e) => {
                window.open(`${process.env.NEXT_PUBLIC_APP_URL}/pdf?url=${getPdf(paper)}`, '_blank')
              }} />}
            <OpenIcon size={18} className='cursor-pointer' onClick={(e) => {
              e.stopPropagation();
              const url = getOpenUrl(paper);
              if (url) window.open(url, '_blank');
            }} />
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
            <PaperSuggestions suggestions={suggestions} ref={suggestionRef} />
          )}
        </div>
      </>
      : <></>
  )
}