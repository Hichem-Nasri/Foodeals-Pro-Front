import { RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { IconType } from '@/types/common-types'
import React from 'react'

interface LabelAndRadioProps {
  Icon: IconType
  label: string
  onClick: () => void
  checked: boolean
  disabled: boolean
  value: string
  className?: string
  classNameLabel?: string
}

const LabelAndRadio: React.FC<LabelAndRadioProps> = ({
  Icon,
  label,
  onClick,
  checked,
  disabled,
  value,
  className,
  classNameLabel,
}) => {
  return (
    <div
      className={cn(
        'flex h-14 items-center justify-between gap-3 rounded-[12px] bg-lynch-50 px-3',
        className
      )}
    >
      <div
        className={cn('gap-2 text-mountain-400 flex-center', classNameLabel)}
      >
        <Icon size={24} />
        <p className='text-lynch-500'>{label}</p>
      </div>
      <RadioGroupItem
        value={value}
        id={label}
        checked={checked}
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  )
}

export default LabelAndRadio
