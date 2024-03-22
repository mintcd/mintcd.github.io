import timeline from '@models/probability-theory-timeline';
import TheoremDependency from '@components/theorem-dependency';

export default function ProbabilityTheory() {
  return (
    <div>
      <TheoremDependency data={timeline} />
    </div>
  )
}
