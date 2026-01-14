import { cn } from '@/lib/utils'
import { IconType } from '@/types/common-types'
import React from 'react'

interface IconAndTextProps {
  IconRight?: IconType
  IconLeft?: IconType
  text: string
  className?: string
  classNameParent?: string
  size?: number
}

const IconAndText: React.FC<IconAndTextProps> = ({
  className,
  IconLeft,
  classNameParent,
  IconRight,
  text,
  size = 24,
}) => {
  return (
    <div
      className={cn('flex items-center gap-2 text-lynch-400', classNameParent)}
    >
      {IconLeft && <IconLeft size={size} />}
      <p className={className}>{text}</p>
      {IconRight && <IconRight size={size} />}
    </div>
  )
}

export default IconAndText
