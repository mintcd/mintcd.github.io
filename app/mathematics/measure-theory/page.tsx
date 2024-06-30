// import timeline from '@models/mathematics/timelines/measure-theory';
import SubjectMap from '@components/subject-timeline';
import KnowledgeGraph from '@components/knowledge-graph';
import graph from '@models/knowledge-graph'
import { getVerticesOfTopic } from '@functions/graph-analysis';

export default function MeasureTheory() {
  const measureTheoryGraph = {
    vertices: getVerticesOfTopic(graph.vertices, ["measure-theory"]),
    metadata: graph.metadata
  } as Graph


  return (

    <div className="">
      {/* <SubjectMap data={timeline} /> */}
      <KnowledgeGraph graphData={measureTheoryGraph} lectureView={true} />
    </div>
  )
}
