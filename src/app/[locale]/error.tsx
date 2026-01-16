'use client'

import React from 'react'
import LayoutError from '@/components/layout/error'

interface ErrorProps {
  error?: Error & { digest?: string }
  reset?: () => void
  message?: string
}

export default function Error({
  error,
  message,
}: ErrorProps) {
  return (
    <LayoutError message={message || error?.message} />
  )
}
