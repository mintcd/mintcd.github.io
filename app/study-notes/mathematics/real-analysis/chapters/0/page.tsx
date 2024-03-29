import Sidebar from "@components/sidebar";
import Latex from 'react-latex-next'
import TheoremBox from "@components/theorem-box";

export default function RealAnalysis() {
  return (
    <div>
      <div className='py-5 grid grid-cols-5 gap-3'>
        <Sidebar topic='real-analysis' current={0} />
      </div >
    </div>
  )

}