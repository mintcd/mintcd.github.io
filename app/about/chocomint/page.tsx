'use client'

import { useEffect } from "react"

export default function GetKey() {
  useEffect(() => {
    window.localStorage.setItem("timeKeyGot", String(Date.now()))
  })
  return (
    <div>
      Key obtained
    </div>
  )
}