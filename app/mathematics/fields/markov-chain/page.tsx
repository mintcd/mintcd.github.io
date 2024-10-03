import timeline from '@models/mathematics/timelines/markov-chain';
import SubjectMap from '@components/subject-timeline';

export default function MarkovChain() {
  return (
    <div>
      <SubjectMap data={timeline} />
    </div>
  )
}