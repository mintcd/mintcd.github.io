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

import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function TheoremDependency({ data }: { data: Statement[] }) {
  const [showed, setShowed] = useState(Array(data.length).fill(false));

  const [implicationShowed, setImplicationShowed] = useState(Array(data.length).fill(false));

  const color: { [key: string]: 'info' | 'secondary' | 'success' | 'grey' | 'warning' | 'primary' } = {
    definition: 'info',
    axiom: 'secondary',
    theorem: 'success',
    corollary: 'grey',
    example: 'warning',
    note: 'primary'
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
            <TimelineOppositeContent
              className='text-lg'
              color="textSecondary">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {index + 1}
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot
                className='cursor-pointer'
                sx={{ width: 15, height: 15 }}
                color={color[item.type]}
                variant={showed[index] ? 'filled' : 'outlined'} // Variant based on mouse interaction
                onClick={() => toggleState(index)} />
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
                        <TimelineDot color={color[implication.type]} />
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
