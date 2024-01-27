'use client'

import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Sidebar from "@components/sidebar"
import TheoremBox from '@components/theorem-box';
import topology from '@models/topology';

export default function Chapter() {
  const statements = topology.find(chapter => chapter.chapter === 2)?.statements

  return (
    <div className='py-5 grid grid-cols-4 gap-3'>

      <div className='col-span-1'><Sidebar topic='topology' current={2} /></div>
      <div className='col-span-3'>
        {statements && statements[0] && <TheoremBox statement={statements[0]} />}
        {statements && statements[0] && <TheoremBox statement={statements[1]} />}
        {statements && statements[0] && <TheoremBox statement={statements[2]} />}
      </div>
    </div>
  )
}