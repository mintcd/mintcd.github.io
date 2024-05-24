import NetworkGraph from '@components/network-graph'

import data from '@models/mathematics/subject-dependencies'

export default function Mathematics() {
  return (
    <div className=''>
      <div className='text-center'>
        <a href="/mathematics/knowledge-graph" className='p-4 bg-green-200 rounded-md'>
          Check here for a Knowledge Graph of Maths!
        </a>
      </div>
      <NetworkGraph data={data} />
    </div>
  )
};