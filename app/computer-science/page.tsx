'use client'

import Image from 'next/image';
import Link from 'next/link';

export default function ComputerScience() {
  const topics = [
    {
      name: "Deep Learning",
      href: "deep-learning"
    },
    {
      name: "Compiler Design",
      href: "compiler-design"
    }
  ]
  return (
    <div className="container mx-auto mt-8">
      <div className={`grid gap-6
                      sm:grid-cols-1 
                      md:grid-cols-2 
                      lg:grid-cols-3`}>
        {topics.map((topic, index) => (
          <Link key={index} href={`/computer-science/${topic.href}`}>
            <div className={`bg-blue-100 shadow-md rounded-lg p-4 cursor-pointer text-center`}>
              <h2 className="text-lg font-bold"> {topic.name} </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
