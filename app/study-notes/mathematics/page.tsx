import NetworkGraph from '@components/network-graph'

import data from '@models/mathematics/subject-dependencies'

export default function Mathematics() {
  return (
    <div>
      <NetworkGraph data={data} />
    </div>
  )
};