import KnowledgeGraph from '@components/knowledge-graph'
import graph from '@models/knowledge-graph'

import Terminology from '@components/terminology'
import objects from '@models/mathematics/terminology'

export default function Mathematics() {
  return (
    <div className=''>
      {/* <div className='mb-4 w-full'>
        <div className="text-center text-3xl font-bold">
          Terminology
        </div>
        <Terminology data={objects} />
      </div> */}
      <KnowledgeGraph graphData={graph} />
    </div>
  );

};