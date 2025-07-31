'use client';
import { Dropdown } from '@components/molecules';
import { ArrowDownIcon, ArrowDownUpIcon, ArrowLeftIcon, ArrowUpIcon } from '@public/icons';
import { useState } from 'react';
import PaperDetail from './PaperDetail';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  papers: GraphNode[];
  hoveredNode: GraphNode | null;
  onHover: (id: GraphNode | null) => void;
  onClick: (paper: GraphNode | null) => void;
  clickedPaper: GraphNode | null;
}

const FIELDS: { [key in 'title' | 'year' | 'citationCount']: string } = {
  title: 'Title',
  year: 'Year',
  citationCount: 'Citations',
}

export default function PaperList({ papers,
  hoveredNode,
  onHover,
  onClick,
  clickedPaper
}: Props) {
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
    <div className='paper-list overflow-y-scroll max-h-[80vh] shadow-sm pr-[4px] mt-3'>
      <AnimatePresence mode="wait">
        {!clickedPaper ? (
          <motion.div
            key="paper-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
          >
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
                ${hoveredNode?.id === paper.id ? 'bg-gray-100' : 'bg-white'} 
                cursor-pointer border-b-gray-300 border-b-[1px]`}
                onMouseOver={() => onHover(paper)}
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
          </motion.div>
        ) : (
          <motion.div
            key="paper-detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
          >
            <div>
              <ArrowLeftIcon size={25} onClick={() => onClick(null)}
                className='cursor-pointer hover:bg-gray-200 rounded-full' />
            </div>
            <PaperDetail paper={clickedPaper} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
