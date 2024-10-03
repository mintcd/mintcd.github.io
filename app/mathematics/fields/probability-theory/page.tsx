import timeline from '@models/mathematics/timelines/probability-theory';
import SubjectMap from '@components/subject-timeline';

export default function ProbabilityTheory() {
  return (
    <div>
      <SubjectMap data={timeline} />
    </div>
  )
}
