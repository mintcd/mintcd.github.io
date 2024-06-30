// import timeline from '@models/mathematics/timelines/real-analysis';
// import SubjectMap from '@components/subject-timeline';
import data from '@models/knowledge-graph'
import { getVerticesOfTopic } from '@functions/graph-analysis'
import KnowledgeGraph from '@components/knowledge-graph'

export default function RealAnalysis() {
  const realAnalysisData = getVerticesOfTopic(data, ["real-analysis"])
  return (
    <div className={`py-5`}>
      {/* <SubjectMap data={timeline} /> */}
      <KnowledgeGraph graph={realAnalysisData} lectureView={true} />
    </div>
  )
}
