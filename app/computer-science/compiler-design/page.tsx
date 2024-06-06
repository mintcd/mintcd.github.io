'use client'

import timeline from '@app/computer-science/compiler-design/compiler-design-phases';
import SubjectNotes from '@components/subject-notes';

import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function DeepLearning() {
  const path = usePathname();

  return (
    <div>
      {/* <Link
        href={`${path}/graph`}
        replace
        className={`ml-5 mb-3 
                        cursor-pointer hover:bg-slate-200
                        text-lg font-bold `}
      >
        Summary
      </Link> */}
      <SubjectNotes data={timeline} />
    </div>
  );
}