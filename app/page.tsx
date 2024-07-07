'use client'

import Link from 'next/link'
import Image from 'next/image'
import RealAnalysis from '@public/real-analysis.png'

const NAV_ITEMS = [
  { title: 'Philosophy', image: RealAnalysis },
  { title: 'Mathematics', image: RealAnalysis },
  { title: 'Computer Science', image: RealAnalysis },
]

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="my-10 sm:my-20 text-center font-extrabold text-5xl sm:text-6xl text-gray-300">
        Ignite the Meaning?
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {NAV_ITEMS.map(({ title, image }, index) => (
          <Link
            key={index}
            href={`/${title.toLowerCase().replace(' ', '-')}`}
            className="group flex flex-col items-center p-2 rounded-md transition duration-150 ease-in-out w-full hover:opacity-80"
          >
            <div className="bg-gray-300 w-full h-11 flex justify-center items-center text-balance">
              Image soon...
            </div>
            {/* <Image
              src={image}
              alt={title}
              className="transition-transform duration-300 group-hover:scale-105"
            /> */}
            <div className="mt-2 h-20 flex justify-center items-center text-center font-bold text-transparent text-xl bg-clip-text bg-gradient-to-r from-green-200 via-blue-200 to-purple-200">
              {title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
