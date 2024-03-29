import timeline from '@models/real-analysis-timeline';
import Sidebar from '@components/sidebar';
import TheoremDependency from '@components/theorem-dependency';

export default function RealAnalysis() {
  return (
    <div className='py-5 grid grid-cols-5 gap-3'>
      <div className="col-span-1">
        <Sidebar topic='real-analysis' current={0} />
      </div>

      <div className="col-span-4">
        <TheoremDependency data={timeline} />
      </div>

    </div >

  )
}
