'use client'

import { useState, useEffect } from 'react'

import KnowledgeGraph from '@components/graph/main'
import graph from '@models/knowledge-graph'
import { fetchData } from '@functions/database'

import Terminology from '@components/terminology'
import objects from '@models/mathematics/terminology'

export default function Mathematics() {
  // const [data, setData] = useState<Graph>({ vertices: [] })

  // useEffect(() => {
  //   fetchData({
  //     table: 'statements',
  //     attrs: ['id', 'name', 'type', 'fields']
  //   }).then((data) => {
  //     console.log(data)
  //     const vertices = data as unknown as Vertex[]
  //     setData({
  //       vertices: vertices
  //     })
  //   })
  // })

  return (
    <div className=''>
      {/* <div className='mb-4 w-full'>
        <div className="text-center text-3xl font-bold">
          Terminology
        </div>
        <Terminology data={objects} />
      </div> */}
      <KnowledgeGraph graphData={graph as Graph} />
    </div>
  );

};