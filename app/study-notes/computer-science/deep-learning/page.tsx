'use client'

import timeline from '@models/computer-science/deep-learning';
import SubjectMap from '@components/subject-map';
import Terminology from '@components/terminology';

import { usePathname } from 'next/navigation';

export default function DeepLearning() {
  const path = usePathname();

  return (
    <div>
      <a
        href={`${path}/graph`}// Call the function on click
        className={`ml-5 mb-3 
                        cursor-pointer hover:bg-slate-200
                        text-lg font-bold `}
      >
        Summary
      </a>
      <SubjectMap data={timeline} />
    </div>
  );
}