'use client';
import { Dropdown } from '@components/molecules';
import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from '@public/icons';
import { useState } from 'react';

interface Props {
  papers: GraphNode[];
  hoveredNodeId: string | null;
  onHover: (id: string | null) => void;
  onClick: (paper: GraphNode) => void;
}

const FIELDS: { [key in 'title' | 'year' | 'citationCount']: string } = {
  title: 'Title',
  year: 'Year',
  citationCount: 'Citations',
}

export default function PaperList({ papers, hoveredNodeId, onHover, onClick }: Props) {
  const [sort, setSort] = useState<{
    open: boolean,
    field: keyof typeof FIELDS,
    direction: 'asc' | 'desc'
  }
  >({ open: false, field: 'title', direction: 'asc' })

  const sortedPapers = papers.sort((a, b) => {
    const field = sort.field;
    const dir = sort.direction === 'asc' ? 1 : -1;

    const aValue = a[field] ?? '';
    const bValue = b[field] ?? '';

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * dir;
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * dir;
    }

    return 0; // fallback
  });

  return (
    <div className='paper-list overflow-auto max-h-[80vh] shadow-gray-500 shadow-sm'>
      <div className={`paper-list-options flex items-center justify-between`}>
        <span className='font-semibold'>
          {papers.length} documents
        </span>
        <span className='sort-filter flex items-center gap-2 mx-2'>
          <Dropdown>
            <Dropdown.Toggler>
              <ArrowDownUpIcon
                size={18}
                onClick={() => setSort(prev => ({ ...prev, open: !prev.open }))}
                className='cursor-pointer'
              />
            </Dropdown.Toggler>
            <Dropdown.Content>
              <div className='flex items-center border-2 bg-white rounded-md'>
                <span className={`sort-fields mr-10px`}>
                  {Object.entries(FIELDS).map(([key, value]) => (
                    <span className={`mr-2 py-[2px] px-[4px] ${sort.field === key ? 'bg-blue-200' : ''} cursor-pointer`} key={key} onClick={() => setSort(prev => ({
                      ...prev,
                      field: key as 'title' | 'year' | 'citationCount'
                    }))}>
                      {value}
                    </span>
                  ))}
                </span>
                <span className='sort-order flex items-center gap-[2px] cursor-pointer'>
                  {sort.direction === 'asc'
                    ? <ArrowUpIcon size={20} onClick={() => setSort(prev => ({ ...prev, direction: 'desc' }))} />
                    : <ArrowDownIcon size={20} onClick={() => setSort(prev => ({ ...prev, direction: 'asc' }))} />
                  }

                </span>

              </div>
            </Dropdown.Content>
          </Dropdown>
        </span>
      </div>
      {sortedPapers.map((paper) => (
        <div
          key={paper.id}
          className={`p-3
            ${hoveredNodeId === paper.id ? 'bg-gray-100' : 'bg-white'} 
            cursor-pointer border-b-gray-300 border-b-[1px]`}
          onMouseOver={() => onHover(paper.id)}
          onMouseLeave={() => onHover(null)}
          onClick={() => onClick(paper)}
        >
          <div className="text-sm">
            {paper.title}
          </div>
          <div>
            {(paper.tags ?? []).map((tag) =>
              <span key={tag.name} style={{ backgroundColor: tag.color }}
                className='mt-2 mr-1 p-1 text-[10px] rounded-sm text-white opacity-60'>
                {tag.name}
              </span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
