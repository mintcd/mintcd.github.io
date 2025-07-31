import { AddIcon, EditIcon, LightbulbIcon, OpenIcon } from "@public/icons";
import { useEffect, useRef, useState } from "react";
import { fetchFromSemanticScholar, fetchNotionBlock, getCachedSchema, getOpenUrl, getPdf, getSchema, updateNotionPage } from "./utils";
import { useClickOutside } from "@hooks";
import PaperSuggestions from "./PaperSuggestions";
import { Checkbox, Loading } from "@components/atoms";
import { Dropdown } from "@components/molecules";


export default function PaperDetail({ paper }: { paper: Paper }) {
  const [abstractLoading, setAbstractLoading] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  // const [schema, setSchema] = useState<{ [key: string]: any }>({})
  const [tags, setTags] = useState<{ name: string; color: string }[]>(paper.tags ?? [])
  const suggestionRef = useRef<HTMLDivElement>(null);
  useClickOutside(suggestionRef, () => setSuggestionsOpen(false))

  // useEffect(() => {
  //   setTags(paper.tags ?? []);
  // }, [paper]);

  // useEffect(() => {
  //   async function _getSchema() {
  //     const res = await getCachedSchema('papers');
  //     setSchema(res);
  //   }
  //   _getSchema();
  // }, []);

  useEffect(() => {
    async function fetchPaper() {
      if (paper.abstract === undefined) {
        setAbstractLoading(true)
        await fetchNotionBlock(paper.id).then(block => {
          paper.abstract = block.abstract
          paper.citationScids = block.citationScids
          paper.referenceScids = block.referenceScids
        })
        setAbstractLoading(false)
      }
    }
    fetchPaper()
  }, [paper])

  async function handleSuggest() {
    setSuggestionLoading(true);
    if (paper.relatedPapers === undefined) {
      const paperData = await fetchFromSemanticScholar(paper.scid)
      const newEntry = {
        references: paperData.references ?? [],
        citations: paperData.citations ?? [],
      }
      paper.relatedPapers = newEntry;
    }

    setSuggestionsOpen(true);
    setSuggestionLoading(false)
  }

  // if (Object.keys(schema).length === 0) {
  //   return <Loading size={18} />;
  // }

  return (
    <div className="paper-detail bg-slate-100 rounded-md p-2 h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200">
      <div className='flex items-center justify-between'>
        <span className="font-semibold text-sm text-blue-700">
          {paper.title}
        </span>
        <span className="flex">
          {suggestionLoading
            ? <span className="mr-2"><Loading size={18} /></span>
            : <LightbulbIcon className='mr-2 cursor-pointer' size={18} onClick={(e) => {
              e.stopPropagation();
              handleSuggest()
            }} />}
          {/* <Dropdown>
            <Dropdown.Toggler>
              <AddIcon size={18} className='mr-2 cursor-pointer' />
            </Dropdown.Toggler>
            <Dropdown.Content>
              <div className="p-2 bg-white rounded-md w-[100px]">

              </div>
              {
                schema.tags.multi_select.options.map((tag: any) =>
                  <div key={tag.name} className="flex items-center justify-between">
                    <span style={{ backgroundColor: tag.color }}
                      className='mt-2 mr-1 p-1 text-[10px] rounded-sm text-white'>
                      {tag.name}
                    </span>

                    <Checkbox
                      checked={paper.tags?.some(t => t.name === tag.name)}
                      onChange={async (checked: boolean) => {
                        let updatedTags;
                        if (checked) {
                          updatedTags = [...tags, { name: tag.name, color: tag.color }];
                        } else {
                          updatedTags = tags.filter(t => t.name !== tag.name);
                        }

                        setTags(updatedTags); // UI updates immediately
                        await updateNotionPage(paper.id, { tags: updatedTags }); // async DB update
                      }}
                    />


                  </div>

                )}
            </Dropdown.Content>
          </Dropdown> */}

          {/* {getPdf(paper) &&
              <EditIcon size={18} className='mr-2 cursor-pointer' onClick={(e) => {
                window.open(`${process.env.NEXT_PUBLIC_APP_URL}/pdf?url=${getPdf(paper)}`, '_blank')
              }} />} */}
          <OpenIcon size={18} className='cursor-pointer' onClick={(e) => {
            e.stopPropagation();
            const url = getOpenUrl(paper);
            if (url) window.open(url, '_blank');
          }} />
        </span>
      </div>
      <div>
        {(paper.tags ?? []).map((tag) =>
          <span key={tag.name} style={{ backgroundColor: tag.color }}
            className='mt-2 mr-1 p-1 text-[10px] rounded-sm text-white opacity-60'>
            {tag.name}
          </span>
        )
        }
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
      <strong className={`mt-3`}>Abstract. </strong>
      {
        abstractLoading
          ? <Loading size={18} />
          : (paper.abstract === null
            ? "No abstract found."
            : paper.abstract)
      }
      {suggestionsOpen && (
        <PaperSuggestions suggestions={paper.relatedPapers} ref={suggestionRef} />
      )}
    </div>
  )
}