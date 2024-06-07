import NetworkGraph from '@components/network-graph'

import data from '@models/mathematics/subject-dependencies'
import Terminology from '@components/terminology'
import objects from '@models/mathematics/terminology'

export default function Mathematics() {
  return (
    <div className=''>
      <div className='text-center'>
        <a href="/mathematics/knowledge-graph" className='p-4 bg-green-200 rounded-md'>
          Check here for a Knowledge Graph of Maths!
        </a>
      </div>
      <Terminology data={objects} category='all' />
      <NetworkGraph data={data} />
    </div>
  )
};