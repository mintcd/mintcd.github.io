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
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'

import Latex from '@components/latex'
import Terminology from '@components/terminology'

export default function SubjectMap({ data, category }: { data: Chapter[], category: Category }) {

  const proofRef = useRef(null);

  const [showedItems, setShowedItems] = useState(data.map(chapter => ({
    showedChapter: false,
    showedStatements: chapter.statements.map(() => false),
    showedImplications: chapter.statements.map(() => false),
  })));

  const [showedProof, setShowedProof] = useState<{
    chapterIndex: number | null;
    statementIndex: number | null;
    implicationIndex: number | null
  }>({ chapterIndex: null, statementIndex: null, implicationIndex: null });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (proofRef.current && !(proofRef.current as HTMLElement).contains(event.target as Node)) {
        // Clicked outside the proof element, reset showedProof state to null
        setShowedProof({ chapterIndex: null, statementIndex: null, implicationIndex: null });
      }
    }

    // Attach event listener when the proof is shown
    if (showedProof.chapterIndex !== null && showedProof.statementIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove event listener when the proof is hidden
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showedProof]);

  function toggleChapter(chapterIndex: number) {
    const newShowedItems = [...showedItems]
    newShowedItems[chapterIndex].showedChapter = !newShowedItems[chapterIndex].showedChapter
    setShowedItems(newShowedItems)
  }

  function toggleStatement(chapterIndex: number, statementIndex: number) {
    const newShowedItems = [...showedItems]
    newShowedItems[chapterIndex].showedStatements[statementIndex] = !newShowedItems[chapterIndex].showedStatements[statementIndex]
    setShowedItems(newShowedItems)
  };

  function toggleImplication(chapterIndex: number, statementIndex: number) {
    const newShowedItems = [...showedItems]
    newShowedItems[chapterIndex].showedImplications[statementIndex] = !newShowedItems[chapterIndex].showedImplications[statementIndex]
    setShowedItems(newShowedItems)
  }

  function changeProof(chapterIndex: number, statementIndex: number, implicationIndex: number | null) {
    if (chapterIndex == showedProof.chapterIndex && statementIndex == showedProof.statementIndex) {
      setShowedProof({ chapterIndex: null, statementIndex: null, implicationIndex: null })
    }
    else {
      setShowedProof({ chapterIndex: chapterIndex, statementIndex: statementIndex, implicationIndex: implicationIndex })
    }
  }

  const statementProps: { [key in StatementType]: {
    color: string,
    image: (chapterIndex: number, statementIndex: number) => JSX.Element,
    contentBackground: string
  } } = {
    axiom: {
      color: '#0288d1',
      image: (chapterIndex, statementIndex) => (
        <TipsAndUpdatesRoundedIcon
          className={showedItems[chapterIndex].showedChapter === true
            && showedItems[chapterIndex].showedStatements[statementIndex] === true
            ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
      contentBackground: 'bg-[#a0d7f5]'

    },
    definition: {
      color: '#0288d1',
      image: (chapterIndex, statementIndex) => (
        <TipsAndUpdatesRoundedIcon
          className={showedItems[chapterIndex].showedStatements[statementIndex]
            ? 'text-white' : 'text-[#0288d1]'} />
      ),
      contentBackground: 'bg-[#aad7ef]'
    },
    lemma: {
      color: 'primary',
      image: (chapterIndex, statementIndex) => (
        <TipsAndUpdatesRoundedIcon
          className={showedItems[chapterIndex].showedChapter === true
            && showedItems[chapterIndex].showedStatements[statementIndex] === true
            ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
      contentBackground: 'bg-[#77c7f2]'
    },
    proposition: {
      color: '#6da484',
      image: (chapterIndex, statementIndex) => (
        <TipsAndUpdatesRoundedIcon
          className={showedItems[chapterIndex].showedChapter === true
            && showedItems[chapterIndex].showedStatements[statementIndex] === true
            ? 'text-white' : 'text-[#6da484]'} />
      ),
      contentBackground: 'bg-[#6da484]'
    },
    theorem: {
      color: '#5bb561',
      image: (chapterIndex, statementIndex) => (
        <NotificationsActiveRoundedIcon
          className={showedItems[chapterIndex].showedChapter === true
            && showedItems[chapterIndex].showedStatements[statementIndex] === true
            ? 'text-white' : 'text-[#5bb561]'} />
      ),
      contentBackground: 'bg-[#7cab7f]'
    },
    corollary: {
      color: 'grey',
      image: (chapterIndex, statementIndex) => (
        <TipsAndUpdatesRoundedIcon
          className={showedItems[chapterIndex].showedChapter === true
            && showedItems[chapterIndex].showedStatements[statementIndex] === true
            ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
      contentBackground: 'bg-[#77c7f2]'

    },
    example: {
      color: 'warning',
      image: (chapterIndex, statementIndex) => (
        <TipsAndUpdatesRoundedIcon
          className={showedItems[chapterIndex].showedChapter === true
            && showedItems[chapterIndex].showedStatements[statementIndex] === true
            ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
      contentBackground: 'bg-[#77c7f2]'
    },
    note: {
      color: 'green',
      image: (chapterIndex, statementIndex) => (
        <TipsAndUpdatesRoundedIcon
          className={showedItems[chapterIndex].showedChapter === true
            && showedItems[chapterIndex].showedStatements[statementIndex] === true
            ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
      contentBackground: 'bg-[#77c7f2]'
    },
    thoughtBubble: {
      color: 'primary',
      image: (chapterIndex, statementIndex) => (
        <TipsAndUpdatesRoundedIcon
          className={showedItems[chapterIndex].showedChapter === true
            && showedItems[chapterIndex].showedStatements[statementIndex] === true
            ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
      contentBackground: 'bg-[#77c7f2]'
    },
  }

  const numberOfThoughtBubbles = data.map((chapter) => (
    chapter.statements.filter((statement) => (statement.type === 'thoughtBubble')).length
  ))

  return (
    <div className='m-5'>
      {data.map((chapter, chapterIndex) => (
        <Timeline
          key={chapterIndex}
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.2,
            },
          }}>
          <div onClick={() => toggleChapter(chapterIndex)}
            className={`mb-3 
                        cursor-pointer hover:bg-slate-200
                        text-lg font-bold `}>
            {chapter.chapterName}
          </div>

          {showedItems[chapterIndex].showedChapter &&
            chapter.statements.map((statement, statementIndex) => (
              statement.type !== 'thoughtBubble' ?
                <TimelineItem
                  key={`${chapterIndex}-${statementIndex}`}>

                  <TimelineOppositeContent>
                    <div
                      itemID='timeline-opposite-content-container'
                      className='text-lg'>
                      {statement.type.charAt(0).toUpperCase() + statement.type.slice(1)} {chapterIndex + 1}.{statementIndex + 1 - numberOfThoughtBubbles[chapterIndex]}
                    </div>
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        backgroundColor: showedItems[chapterIndex].showedStatements[statementIndex]
                          ? statementProps[statement.type].color
                          : 'white',
                        borderColor: statementProps[statement.type].color
                      }}
                      onClick={() => toggleStatement(chapterIndex, statementIndex)}>
                      {statementProps[statement.type].image(chapterIndex, statementIndex)}
                    </TimelineDot>

                    {statementIndex !== chapter.statements.length - 1 && chapter.statements[statementIndex + 1].type !== 'thoughtBubble' &&
                      <TimelineConnector sx={showedItems[chapterIndex].showedStatements[statementIndex]
                        && statement.content !== ""
                        ? { height: 80 }
                        : { height: 20 }} />}
                  </TimelineSeparator>

                  <TimelineContent>
                    <div className='text-lg'>
                      <Latex>
                        {statement.statementName
                          ? statement.statementName.charAt(0).toUpperCase() + statement.statementName.slice(1)
                          : ""}
                      </Latex>

                    </div>
                    <div className={`mt-2 transition-all duration-500 ${showedItems[chapterIndex].showedStatements[statementIndex] ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
                      {showedItems[chapterIndex].showedStatements[statementIndex]
                        && statement.content !== ""
                        && <div className={`relative text-black ${statementProps[statement.type].contentBackground} p-3 rounded-xl`}>
                          <Latex>
                            {statement.content}
                          </Latex>
                          <div itemID='proof-and-implications-button' className='flex justify-end'>
                            {statement.type === 'theorem'
                              && <div onClick={() => changeProof(chapterIndex, statementIndex, null)}
                                className='cursor-pointer mr-3 italic'>
                                Proof
                              </div>}
                            {statement.implications
                              && statement.implications.length !== 0
                              &&
                              <ExpandMoreOutlinedIcon
                                onClick={() => toggleImplication(chapterIndex, statementIndex)}
                                className={`w-6 h-6 cursor-pointer
                                          text-${statementProps[statement.type].color}`} />
                            }
                          </div>

                        </div>
                      }

                      {showedItems[chapterIndex].showedStatements[statementIndex]
                        && showedItems[chapterIndex].showedImplications[statementIndex]
                        && statement.implications
                        && statement.implications.length !== 0
                        && statement.implications.map((implication, implicationIndex) => (
                          <Timeline
                            key={`implications-${implicationIndex}`}
                            sx={{
                              [`& .${timelineOppositeContentClasses.root}`]: {
                                flex: 0,
                              },
                            }}
                          >
                            <TimelineItem key={`${statementIndex}-${implicationIndex}`}>
                              <TimelineOppositeContent />
                              <TimelineDot sx={{
                                backgroundColor: statementProps[implication.type].color
                              }} />
                              <TimelineContent>
                                <Latex>
                                  {`<b>
                                      ${implication.type.charAt(0).toUpperCase() + implication.type.slice(1)}
                                      ${chapterIndex + 1}.${statementIndex + 1}.${implicationIndex + 1} 
                                      ${implication.statementName
                                    &&
                                    `(${implication.statementName.charAt(0)?.toUpperCase() + implication.statementName.slice(1)})`}
                                    </b>`}
                                </Latex>
                                <Latex>
                                  {implication.content}
                                </Latex>
                                <div itemID='implication-proof-button' className='flex justify-end'>
                                  {implication.type === 'theorem'
                                    && <div onClick={() => changeProof(chapterIndex, statementIndex, implicationIndex)}
                                      className='cursor-pointer mr-3 italic'>
                                      Proof
                                    </div>}

                                </div>
                              </TimelineContent>
                            </TimelineItem>
                          </Timeline>
                        ))}
                    </div>
                  </TimelineContent>
                </TimelineItem>
                :
                <div key={statementIndex}
                  itemID='thought-bubble-container'
                  className={`p-5 rounded-md
                            h-auto 
                          bg-blue-300`}>
                  <Latex>
                    {`<b>
                    ${statement.statementName ?
                        statement.statementName.charAt(0).toUpperCase() + statement.statementName.slice(1) :
                        ''}.
                  </b> 
              ${statement.content}`}
                  </Latex>
                </div>
            ))}
        </Timeline>
      ))}

      {showedProof.chapterIndex !== null && showedProof.statementIndex !== null && (
        <div
          ref={(element) => {
            if (element) {
              // Calculate the middle of the viewport
              const middleOfViewport = window.scrollY + window.innerHeight / 2;
              // Calculate the top position of the proof element
              const proofTopPosition = element.getBoundingClientRect().top;
              // Calculate the offset to scroll to the middle of the proof element
              const scrollToOffset = proofTopPosition - middleOfViewport;
              // Scroll to the middle of the proof element
              window.scrollTo({
                top: window.scrollY + scrollToOffset,
                behavior: 'smooth',
              });
            }
          }}
          className={`absolute top-0 left-0 right-0 bottom-0 
                    bg-gray-800 bg-opacity-50 z-50
                      flex items-center justify-center `}>
          <div ref={proofRef}
            className="p-5 bg-white rounded-lg">
            {showedProof.implicationIndex === null
              ?
              <Latex>
                {`<b>
                Proof of Theorem ${showedProof.chapterIndex + 1}.${showedProof.statementIndex + 1}.
              </b> 
              ${data[showedProof.chapterIndex].statements[showedProof.statementIndex].proof
                  || "Have not provided yet :(("}`}
              </Latex>
              :
              (
                <Latex>
                  {`<b>
                    Proof of ${data[showedProof.chapterIndex]
                      .statements[showedProof.statementIndex]
                      .implications?.[showedProof.implicationIndex].type || ""}
                    ${showedProof.chapterIndex + 1}.${showedProof.statementIndex + 1}.${showedProof.implicationIndex + 1}
                    </b> 
                    ${data[showedProof.chapterIndex]
                      .statements[showedProof.statementIndex]
                      .implications?.[showedProof.implicationIndex].proof
                    || "Have not provided yet :(("}`}
                </Latex>)
            }
          </div>
        </div>
      )}
    </div>
  )
}
