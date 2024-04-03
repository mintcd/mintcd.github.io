import timeline from '@models/probability-theory-timeline';
import SubjectMap from '@components/subject-map';

export default function ProbabilityTheory() {
  return (
    <div>
      <SubjectMap data={timeline} />
    </div>
  )
}
