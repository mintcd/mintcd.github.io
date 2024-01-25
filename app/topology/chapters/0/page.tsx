'use client'

import 'katex/dist/katex.min.css';
import Sidebar from "@components/sidebar"

export default function Chapter() {


  return (
    <div className='py-5 grid grid-cols-4 gap-3'>
      <div className='col-span-1'>
        <Sidebar topic='topology' current={0} />
      </div>
      <div className='col-span-3'>
      </div>
    </div>
  )
}