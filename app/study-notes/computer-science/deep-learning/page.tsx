import timeline from '@models/computer-science/deep-learning';
import SubjectMap from '@components/subject-map';
import Terminology from '@components/terminology';

import terms from '@models/computer-science/terminology'

export default function DeepLearning() {
  return (
    <SubjectMap data={timeline} />
  )
}
