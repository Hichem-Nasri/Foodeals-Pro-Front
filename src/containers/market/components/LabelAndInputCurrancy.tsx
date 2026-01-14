import { Label } from '@/components/custom/Label'
import { InputWithCurrancy } from '@/components/tools/InputWithCurrancy'
import React from 'react'

interface LabelAndInputCurrancyProps {
  disabled: boolean
  className?: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
  label: string
}

const LabelAndInputCurrancy: React.FC<LabelAndInputCurrancyProps> = ({
  label,
  className,
  disabled,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className='flex w-full flex-col items-start gap-3'>
      <Label label={label} />
      <InputWithCurrancy
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}

export default LabelAndInputCurrancy
