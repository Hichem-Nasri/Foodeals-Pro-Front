import { cn } from '@/lib/utils'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function SubPageHeader({
  href,
  title,
  color = 'purple',
}: {
  href: string
  title: string
  color?: ColorsT
}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between border-b-2 bg-white p-4 lg:hidden',
        getActiveColorClassName(color, 'border')
      )}
    >
      <Link href={href}>
        <ChevronLeft className='text-lynch-300' />
      </Link>
      <h1 className='font-medium'>{title}</h1>
    </header>
  )
}
