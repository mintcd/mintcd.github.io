'use client'

import data from '@models/computer-science/compiler-design-phases';
import KnowledgeGraph from '@components/knowledge-graph';
// import ast from '@models/computer-science/ast';
import Latex from '@components/latex';
import { useState } from 'react';

export default function SubjectNotes() {
  const [shownChapter, setShownChapter] = useState<number | null>(0);
  const [shownSection, setShownSection] = useState<number | null>(null);

  function handleShownChapter(chapterIndex: number) {
    setShownChapter(chapterIndex);
    setShownSection(null);
  }

  function handleShownSection(sectionIndex: number) {
    setShownSection(sectionIndex);
    console.log(shownChapter, shownSection);
  }

  return (
    <div className='m-5 grid grid-cols-5'>
      <div className='col-span-1 mr-4'>
        {data.map((chapter, index) => (
          <div key={index}>
            <div
              key={`chapter-${index}`}
              onClick={() => handleShownChapter(index)}
              className={`mb-3 py-1 px-3 cursor-pointer hover:bg-blue-200 ${shownChapter === index ? 'bg-blue-200' : ''} text-lg font-bold`}
            >
              {chapter.name}
            </div>
            {shownChapter === index && chapter.sections && chapter.sections.map((section, sectionIndex) => (
              <div
                key={`section-${sectionIndex}`}
                onClick={() => handleShownSection(sectionIndex)}
                className={`mb-3 py-1 px-7 ml-5 cursor-pointer hover:bg-slate-200 ${shownSection === sectionIndex ? 'bg-slate-200' : ''} text-md`}
              >
                {section.name}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className='col-span-4'>
        {shownChapter !== null && (
          <>
            <Latex>
              {(shownSection === null ? data[shownChapter].content
                : (data[shownChapter].sections !== undefined &&
                  data[shownChapter].sections?.[shownSection].content)) || ''}
            </Latex>
            {/* {data[shownChapter].name === 'Semantic Analysis' && (
              <KnowledgeGraph key={shownChapter} graph={ast} />
            )} */}
          </>
        )}
      </div>
    </div>
  );
}
