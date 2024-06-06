'use client'

import { useState, useEffect, useRef } from 'react'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent'

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

import Latex from '@components/latex'
import { ShowChart, ShowChartSharp } from '@mui/icons-material'

export default function SubjectNotes({ data }: { data: Chapter[] }) {
  const [shownChapter, setShownChapter] = useState<number | null>(0);
  const [shownSection, setShownSection] = useState<number | null>(null);

  function handleShownChapter(chapterIndex: number) {
    setShownChapter(chapterIndex)
    setShownSection(null)
  }

  function handleShownSection(sectionIndex: number) {
    setShownSection(sectionIndex)
    console.log(shownChapter, shownSection)
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
            {shownChapter === index && chapter.sections.map((section, sectionIndex) => (
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
        <div
          itemID='thought-bubble-container'
          className={`p-5 rounded-md
                            h-auto 
                          bg-blue-200`}>
          <Latex>
            {`${shownChapter !== null &&
              (shownSection === null ? data[shownChapter].content : data[shownChapter].sections[shownSection].content)}`}
          </Latex>
        </div>
      </div>
    </div>
  )
}
