import timeline from '@models/computer-science/deep-learning';
import SubjectMap from '@components/subject-map';
import Terminology from '@components/terminology';

import terms from '@models/computer-science/terminology'

export default function DeepLearning() {
  return (
    <div className="col-span-4">
      <Terminology data={terms} category='all' />
      <SubjectMap data={timeline} category="deep-learning" />
    </div>
  )
}
