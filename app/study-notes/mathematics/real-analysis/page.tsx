'use client'

import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import statementList from '@models/real-analysis-timeline';

import React, { useState } from 'react';

import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css';

export default function NoOppositeContent() {
  const [showed, setShowed] = useState(Array(10).fill(true));
  const timeline = statementList as Statement[];

  const color: { [key: string]: 'info' | 'secondary' | 'success' | 'grey' | 'warning' } = {
    definition: 'info',
    axiom: 'secondary',
    theorem: 'success',
    corollary: 'grey',
    example: 'warning'
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
        {timeline.map((item, index) => (
          <React.Fragment key={index}>
            <TimelineItem>
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
                {index !== timeline.length - 1 &&
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
                          Corollary {corollaryIndex + 1}
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
          </React.Fragment>
        ))}
      </Timeline>
    </div>
  );
}

