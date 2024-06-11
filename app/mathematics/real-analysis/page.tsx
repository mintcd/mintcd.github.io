import timeline from '@models/mathematics/timelines/real-analysis';
import SubjectMap from '@components/subject-timeline';

export default function RealAnalysis() {
  return (
    <div className={`py-5`}>
      <SubjectMap data={timeline} />
    </div>
  )
}
