'use client'

import Sidebar from "@components/sidebar";
import Latex from 'react-latex-next'
import TheoremBox from "@components/theorem-box";

export default function RealAnalysis() {
  return (
    <div className='py-5 grid grid-cols-4 gap-3'>
      <div className='col-span-1'><Sidebar topic='real-analysis' current={1} /></div>
      <div className='col-span-3'>
        <Latex>{``}</Latex>
      </div>
    </div>
  )

}