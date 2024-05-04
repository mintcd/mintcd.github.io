'use client'

import { useState } from 'react';
import realAnalysis from '@public/real-analysis.png';
import Image from 'next/image';
import Link from 'next/link';

export default function ComputerScience() {
  return (
    <div className="container mx-auto mt-8">
      <div className={`grid gap-6
                      sm:grid-cols-1 
                      md:grid-cols-2 
                      lg:grid-cols-3`}>
        <Link href="/study-notes/computer-science/deep-learning">
          <div className={`bg-white shadow-md rounded-lg p-4 cursor-pointer text-center`}>
            <h2 className="text-lg font-bold">Deep Learning</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}