import timeline from '@models/mathematics/timelines/measure-theory';
import SubjectMap from '@components/subject-timeline';
import KnowledgeGraph from '@components/knowledge-graph';
import graph from '@models/knowledge-graph'
import { getVerticesOfTopic } from '@functions/graph-analysis';

export default function MeasureTheory() {
  return (
    <div className="">
      <SubjectMap data={timeline} />
    </div>
  )
}
