import trailblazers from "@models/trailblazers"

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Trailblazers',
  description: 'Trailblazers in in popularizing groundbreaking ideas and shaping the future.',
}

export default function Trailblazers() {
  return (
    <div className="m-5">
      {trailblazers.map(function (item, index) {
        return (
          <div key={`trailblazer-${index}`}
            className={`p-3 hover:bg-slate-100`}>
            <Link href={item.href ? item.href : "/"}> {item.name} </Link>
          </div>
        )
      })}
    </div>
  )
}