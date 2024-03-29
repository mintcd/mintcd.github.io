import timeline from '@models/real-analysis-timeline';
import TheoremDependency from '@components/theorem-dependency';

export default function RealAnalysis() {
  return (
    <div>
      <TheoremDependency data={timeline} />
    </div>
  )
}
