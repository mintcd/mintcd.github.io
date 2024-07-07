import DependencyGraph from '@components/dependency-graph'

import data from '@models/mathematics/subject-dependencies'
import Terminology from '@components/terminology'
import objects from '@models/mathematics/terminology'

export default function Mathematics() {
  return (
    <div className='flex flex-col items-center justify-center'>

      <div className='mb-4 w-full'>
        <div className="text-center text-3xl font-bold">
          Terminology
        </div>
        <Terminology data={objects} />
      </div>
      <div className='text-center m-4'>
        <a href="/mathematics/knowledge-graph" className='p-4 bg-green-200 rounded-md'>
          Maths Knowledge Graph
        </a>
      </div>
      <div className='w-[60%]'>
        <DependencyGraph graphData={data} radiusRatio={20} />
      </div>
    </div>
  );

};