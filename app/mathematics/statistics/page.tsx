import timeline from '@models/mathematics/timelines/statistics';
import SubjectMap from '@components/subject-timeline';

export default function Statistics() {
  return (
    <div className='py-5'>
      <SubjectMap data={timeline} />
    </div>
  )
}
