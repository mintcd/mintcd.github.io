'use client'

import { useState } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

import { FaRegLightbulb } from "react-icons/fa";
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';


import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function TheoremDependency({ data }: { data: Statement[] }) {
  const [showed, setShowed] = useState(Array(data.length).fill(false));

  const [implicationShowed, setImplicationShowed] = useState(Array(data.length).fill(false));

  const statementProps: {
    [key in 'definition' | 'axiom' | 'theorem' | 'corollary' | 'example' | 'note' | 'lemma']: {
      color: 'info' | 'secondary' | 'success' | 'grey' | 'warning' | 'primary';
      image: (index: number) => JSX.Element;
    };
  } = {
    definition: {
      color: 'info',
      image: (index) => (
        <TipsAndUpdatesRoundedIcon className={showed[index] ? 'text-white' : 'text-[#0288d1]'} />
      ),
    },
    axiom: {
      color: 'secondary',
      image: (index) => (
        <TipsAndUpdatesRoundedIcon className={showed[index] ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
    },
    theorem: {
      color: 'success',
      image: (index) => (
        <TipsAndUpdatesRoundedIcon className={showed[index] ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
    },
    corollary: {
      color: 'grey',
      image: (index) => (
        <TipsAndUpdatesRoundedIcon className={showed[index] ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
    },
    example: {
      color: 'warning',
      image: (index) => (
        <TipsAndUpdatesRoundedIcon className={showed[index] ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
    },
    note: {
      color: 'primary',
      image: (index) => (
        <TipsAndUpdatesRoundedIcon className={showed[index] ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
    },
    lemma: {
      color: 'primary',
      image: (index) => (
        <TipsAndUpdatesRoundedIcon className={showed[index] ? 'text-[#0288d1]' : 'text-gray-700'} />
      ),
    },
  };

  const toggleState = (index: number) => {
    setShowed(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const toggleImplicationState = (index: number) => {
    setImplicationShowed(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className='m-5'>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
          },
        }}
      >
        {data.map((item, index) => (
          <TimelineItem key={index}>
            <div
              itemProp='timeline-opposite-content-container'
              className='text-lg'>
              <TimelineOppositeContent>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {index + 1}
              </TimelineOppositeContent>
            </div>

            <TimelineSeparator>
              <div
                itemProp='timeline-dot-container'
                className='cursor-pointer'
                onClick={() => toggleState(index)}
              >
                <TimelineDot
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  color={statementProps[item.type].color}
                  variant={showed[index] ? 'filled' : 'outlined'}
                >
                  {statementProps[item.type].image(index)}
                </TimelineDot>
              </div>
              {index !== data.length - 1 &&
                <TimelineConnector
                  sx={showed[index] && item.content !== "" ? { height: 80 } : { height: 20 }} />}
            </TimelineSeparator>

            <TimelineContent>
              <div className='text-lg'>
                <Latex>
                  {item.name}
                </Latex>

              </div>
              <div className={`mt-2 transition-all duration-500 ${showed[index] ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
                {showed[index] && item.content !== "" &&
                  <div className='relative bg-green-200 p-3 rounded-xl'>
                    <Latex>
                      {item.content}
                    </Latex>
                    {item.implications && item.implications.length !== 0 &&
                      <FaRegLightbulb className='absolute bottom-3 right-3 w-6 h-6 cursor-pointer'
                        onClick={() => toggleImplicationState(index)} />
                    }
                  </div>
                }

                {showed[index] && implicationShowed[index] && item.implications && item.implications.length !== 0 &&
                  item.implications.map((implication, corollaryIndex) => (
                    <Timeline
                      key={`implications-${index}`}
                      sx={{
                        [`& .${timelineOppositeContentClasses.root}`]: {
                          flex: 0,
                        },
                      }}
                    >
                      <TimelineItem key={`${index}-${corollaryIndex}`}>
                        <TimelineOppositeContent
                        >

                        </TimelineOppositeContent>
                        <TimelineDot color={statementProps[implication.type].color} />
                        <TimelineContent>
                          <b>
                            {implication.type.charAt(0).toUpperCase() + implication.type.slice(1)} {corollaryIndex + 1}. {implication.name !== '' && `(${implication.name})`}
                          </b>

                          <Latex>
                            {implication.content}
                          </Latex>
                        </TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  ))}
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
