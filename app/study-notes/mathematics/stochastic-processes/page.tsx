import timeline from '@models/mathematics/stochastic-processes';
import SubjectMap from '@components/subject-map';

export default function StochasticProcesses() {
  return (
    <div>
      <SubjectMap data={timeline} category='stochastic-processes' />
    </div>
  )
}
