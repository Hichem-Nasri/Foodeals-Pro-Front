import { Input } from '@/components/custom/Input'
import { Label } from '@/components/custom/Label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { IconType } from '@/types/common-types'
import React from 'react'

interface LabelAndInputProps {
  label: string
  name: string
  type?:
    | 'number'
    | 'textarea'
    | 'text'
    | 'email'
    | 'password'
    | 'file'
    | undefined
  placeholder?: string
  value: string
  onChange: (e: any) => void
  className?: string
  disabled?: boolean
  IconLeft?: IconType
  IconRight?: IconType
}

const LabelAndInput: React.FC<LabelAndInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder = "Saisir l'information",
  value,
  onChange,
  className,
  disabled = false,
  IconLeft,
  IconRight,
}) => {
  return (
    <div className='flex w-full flex-col items-start gap-3'>
      <Label label={label} />
      {type == 'textarea' ? (
        <Textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            'min-h-44 text-base text-lynch-400 disabled:cursor-none disabled:bg-lynch-50 disabled:text-lynch-400 disabled:opacity-100',
            className
          )}
          disabled={disabled}
          rows={5}
          autoCorrect='off'
          autoComplete='off'
          cols={50}
        />
      ) : (
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={className}
          disabled={disabled}
          IconLeft={IconLeft}
          IconRight={IconRight}
        />
      )}
    </div>
  )
}

export default LabelAndInput
