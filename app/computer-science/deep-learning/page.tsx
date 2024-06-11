'use client'

import timeline from '@models/computer-science/deep-learning';
import SubjectMap from '@components/subject-timeline';

import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function DeepLearning() {
  const path = usePathname();

  return (
    <div>
      <Link
        href={`${path}/graph`}
        replace
        className={`ml-5 mb-3 
                        cursor-pointer hover:bg-slate-200
                        text-lg font-bold `}
      >
        Summary
      </Link>
      <SubjectMap data={timeline} />
    </div>
  );
}