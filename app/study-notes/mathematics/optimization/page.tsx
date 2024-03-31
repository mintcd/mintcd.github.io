import timeline from '@models/optimization-timeline';
import TheoremDependency from '@components/theorem-dependency';

export default function ProbabilityTheory() {
  return (
    <div>
      <TheoremDependency data={timeline.statements} />
    </div>
  )
}
