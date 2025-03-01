'use client'
import { useState, useEffect, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function ClientOnly({ children }: Props) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}
