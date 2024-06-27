// import timeline from '@models/mathematics/timelines/measure-theory';
import SubjectMap from '@components/subject-timeline';
import KnowledgeGraph from '@components/knowledge-graph';
import data from '@models/knowledge-graph'
import { getVerticesOfTopic } from '@functions/graph-analysis';

export default function MeasureTheory() {
  const measureTheoryData = getVerticesOfTopic(data, ["Measure Theory"])
  return (

    <div className="">
      {/* <SubjectMap data={timeline} /> */}
      <KnowledgeGraph graph={measureTheoryData} lectureView={true} />
    </div>
  )
}
