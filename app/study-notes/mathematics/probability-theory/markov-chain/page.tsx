import timeline from '@models/markov-chain';
import TheoremDependency from '@components/theorem-dependency';

export default function ProbabilityTheory() {
  return (
    <div>
      <TheoremDependency data={timeline} />
    </div>
  )
}
