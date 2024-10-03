import timeline from '@models/mathematics/timelines/stochastic-processes';
import SubjectMap from '@components/subject-timeline';

export default function StochasticProcesses() {
  return (
    <div>
      <SubjectMap data={timeline} />
    </div>
  )
}
