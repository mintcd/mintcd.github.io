import timeline from '@models/mathematics/probability-theory';
import SubjectMap from '@components/subject-map';

export default function ProbabilityTheory() {
  return (
    <div>
      <SubjectMap data={timeline} category='probability-theory' />
    </div>
  )
}
