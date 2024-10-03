import timeline from '@models/mathematics/timelines/measure-theory';
import SubjectMap from '@components/subject-timeline';

export default function MeasureTheory() {
  return (
    <div className="">
      <SubjectMap data={timeline} />
    </div>
  )
}
