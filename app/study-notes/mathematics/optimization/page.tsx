import timeline from '@models/optimization-timeline'
import SubjectMap from '@components/subject-map'

export default function Optimization() {
  return (
    <SubjectMap data={timeline} />
  )
}
