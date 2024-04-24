import NetworkGraph from '@components/network-graph'

import data from '@models/computer-science/architecture-dependencies'

export default function Mathematics() {
  return (
    <div>
      <NetworkGraph data={data} />
    </div>
  )
};