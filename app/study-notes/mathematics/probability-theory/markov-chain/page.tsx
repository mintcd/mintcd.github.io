import timeline from '@models/markov-chain';
import SubjectMap from '@components/subject-map';

export default function ProbabilityTheory() {
  return (
    <div>
      <SubjectMap data={timeline} />
    </div>
  )
}
