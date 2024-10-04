'use client'

import { useEffect } from "react"

export default function Chocomint() {
  useEffect(() => {
    window.localStorage.setItem("timeKeyGot", Date.now().toString())
  })
  return (
    <div>
      Key obtained
    </div>
  )
}