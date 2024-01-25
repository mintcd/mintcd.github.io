'use client'

import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Sidebar from "@app/linear-algebra/sidebar"

export default function Chapter() {


  return (
    <div className='py-5 grid grid-cols-4 gap-3'>
      <div className='col-span-1'><Sidebar current={2} /></div>
      <div className='col-span-3'>

      </div>
    </div>
  )
}