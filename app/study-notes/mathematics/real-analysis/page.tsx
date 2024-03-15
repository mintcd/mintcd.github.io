import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import statementList from '@models/real-analysis-timeline';

export default function NoOppositeContent() {
  const timeline = statementList as Statement[];

  const color: { [key: string]: 'info' | 'secondary' | 'success' } = {
    definition: 'info',
    axiom: 'secondary',
    theorem: 'success'
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
          <TimelineItem key={index}>
            <TimelineOppositeContent sx={{ marginLeft: -100 }} color="textSecondary">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {index + 1}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={color[item.type]} />
              {index !== timeline.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              {item.name}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
