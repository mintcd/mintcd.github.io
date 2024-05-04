import timeline from '@models/mathematics/markov-chain';
import SubjectMap from '@components/subject-map';

export default function MarkovChain() {
  return (
    <div>
      <SubjectMap data={timeline} />
    </div>
  )
}