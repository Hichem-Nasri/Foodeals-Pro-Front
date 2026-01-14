import { cn } from '@/lib/utils'
import { FC } from 'react'

interface LabelProps {
  label: string
  htmlFor?: string
  className?: string
}

export const Label: FC<LabelProps> = ({ htmlFor, label, className }) => {
  return (
    <label
      className={cn('text-base font-medium text-lynch-950', className)}
      htmlFor={htmlFor}
    >
      {label}
    </label>
  )
}
