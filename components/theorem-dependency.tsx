'use client'

import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

import { useState } from 'react';

import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css';

export default function TheoremDependency({ data }: { data: Statement[] }) {
  const [showed, setShowed] = useState(Array(10).fill(false));

  const color: { [key: string]: 'info' | 'secondary' | 'success' | 'grey' | 'warning' | 'primary' } = {
    definition: 'info',
    axiom: 'secondary',
    theorem: 'success',
    corollary: 'grey',
    example: 'warning',
    note: 'primary'
  };

  function toggleState(index: number) {
    setShowed(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className='m-5'>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {data.map((item, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent
              className='text-lg'
              sx={{ marginLeft: -50 }}
              color="textSecondary">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {index + 1}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                className='cursor-pointer'
                sx={{ width: 15, height: 15 }}
                color={color[item.type]}
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
              <div>
                {showed[index] && item.content !== "" &&
                  <Latex>
                    {item.content}
                  </Latex>}
                {showed[index] && item.implications && item.implications.length !== 0 &&
                  item.implications.map((implication, corollaryIndex) => (
                    <TimelineItem key={`${index}-${corollaryIndex}`}>
                      <TimelineOppositeContent
                        sx={{ marginLeft: -80 }}
                        color="textSecondary"
                      >
                        {implication.type.charAt(0).toUpperCase() + implication.type.slice(1)} {corollaryIndex + 1}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={color[implication.type]} />
                        <TimelineConnector
                          sx={{ backgroundColor: 'white' }} />
                      </TimelineSeparator>
                      <TimelineContent>
                        {implication.name}
                        <Latex>
                          {implication.content}
                        </Latex>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}

