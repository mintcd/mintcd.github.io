'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import MyLatex from '@components/my-latex'

export default function Proof() {
  const path = usePathname()
  const regex = /\/([\w-]+)\/([\w-]+)\/([\w-]+)\/([\w-]+)\/([\w-]+)/;
  const matches = path.match(regex);

  const [fieldName, dashedTheoremName] = matches ? [matches[4], matches[5]] : [null, null]

  const [theorem, setTheorem] = useState<Statement | null>(null)

  function findTheoremByDashedName(chapters: Chapter[], dashedTheoremName: string): Statement | null {
    for (const chapter of chapters) {
      console.log("Traverse", chapter.chapterName)
      for (const statement of chapter.statements) {
        if (statement.dashedStatementName === dashedTheoremName) {
          console.log("Traverse", statement.dashedStatementName)
          return statement;
        }
      }
    }
    return null;
  }

  useEffect(() => {
    if (fieldName && dashedTheoremName) {
      import(`@models/${fieldName}`).then(module => {
        const chapters = module.default
        console.log(chapters)
        const theorem = findTheoremByDashedName(chapters, dashedTheoremName)
        setTheorem(theorem)
      }).catch(error => {
        console.error("Error importing theorem:", error)
      })
    }
  }, [fieldName, dashedTheoremName])
  return (
    <MyLatex>Theorem: {theorem ? theorem.content : "Not found"}</MyLatex>
  )
}