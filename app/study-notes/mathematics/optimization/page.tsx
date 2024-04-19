import timeline from '@models/mathematics/optimization'
import SubjectMap from '@components/subject-map'

export default function Optimization() {
  return (
    <SubjectMap data={timeline} category='real-analysis' />
  )
}
