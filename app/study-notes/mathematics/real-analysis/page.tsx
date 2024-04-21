import timeline from '@models/mathematics/real-analysis';
import SubjectMap from '@components/subject-map';

export default function RealAnalysis() {
  return (
    <div className='py-5'>
      <SubjectMap data={timeline} />
    </div>
  )
}
