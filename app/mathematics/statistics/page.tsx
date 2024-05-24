import timeline from '@models/mathematics/statistics';
import SubjectMap from '@components/subject-map';

export default function Statistics() {
  return (
    <div className='py-5'>
      <SubjectMap data={timeline} />
    </div>
  )
}
