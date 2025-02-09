import { useEffect, useState } from 'react'

export function authorize() {
  const [authorized, setAuthorized] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem("timeKeyGot") !== null) {
      setAuthorized(true)
    }
  })
  return authorized
}