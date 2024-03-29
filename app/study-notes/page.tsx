'use client'

import { useState } from 'react';
import realAnalysis from '@public/real-analysis.png';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [isMathVisible, setIsMathVisible] = useState(true);

  const toggleMathematics = () => {
    setIsMathVisible(!isMathVisible);
  };

  return (
    <div className="container mx-auto mt-8">

      <Link href="/study-notes/mathematics">
        <div className="my-3 text-center mb-8">
          <h2 className="text-2xl font-bold cursor-pointer">Mathematics</h2>
        </div>
      </Link>

    </div>
  );
}
