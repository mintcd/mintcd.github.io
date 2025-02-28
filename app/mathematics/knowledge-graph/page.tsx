'use client'

import { useState, useEffect } from 'react'

import Graph from '@components/organisms/visualization/graph'
import { fetchData } from '@functions/database'
import { getEdges } from '@functions/graph-analysis'

export default function Mathematics() {
  const [data, setData] = useState<Graph>({ vertices: [] })

  useEffect(() => {
    fetchData({
      table: 'statement',
      attrs: ['id', 'name', 'type', 'field', 'parents']
    }).then((data) => {
      const vertices = data as unknown as Vertex[]
      setData({
        vertices: vertices,
        edges: getEdges(vertices)
      })
    })
  }, [])

  return (
    <div className=''>
      {data.vertices.length > 0 && <Graph graphData={data} />}
    </div>
  );

};