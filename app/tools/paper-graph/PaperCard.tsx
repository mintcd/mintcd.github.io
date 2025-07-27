import { OpenIcon } from "@public/icons";
import { getOpenUrl } from "./utils";

export default function PaperCard({ paper }: { paper: Paper }) {
  return (
    <div key={paper.id} className='shadow-sm p-2'>
      <div className='flex justify-between items-start gap-2'>
        <span className='font-semibold break-words w-[90%]'>
          {paper.title}
        </span>
        <OpenIcon
          size={18}
          className='cursor-pointer shrink-0'
          onClick={(e) => {
            e.stopPropagation();
            const url = getOpenUrl(paper);
            if (url) window.open(url, '_blank');
          }}
        />
      </div>
      <div>
        <span className="mr-3">
          {paper.authors.map(author => author.name).join(', ')}
        </span>
        <span className="mr-3">
          {paper.year}
        </span>
        <span className="">
          {paper.citationCount} citations
        </span>

      </div>
    </div>
  )
}