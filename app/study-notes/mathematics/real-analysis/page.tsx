import timeline from '@models/real-analysis-timeline';
import Sidebar from '@components/sidebar';
import SubjectMap from '@components/subject-map';

export default function RealAnalysis() {
  return (
    <div className='py-5 grid grid-cols-5 gap-3'>
      <div className="col-span-1">
        <Sidebar topic='real-analysis' current={0} />
      </div>

      <div className="col-span-4">
        <SubjectMap data={timeline} />
      </div>

    </div >

  )
}
