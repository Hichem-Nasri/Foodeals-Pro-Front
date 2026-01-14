'use client'
import { CustomButton } from '@/components/custom/CustomButton'
import { Input } from '@/components/custom/Input'
import { Label } from '@/components/custom/Label'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { Minus, Plus } from 'lucide-react'
import React from 'react'

interface QuntityProps {
  value: number
  onChange: (val: number) => void
  children?: React.ReactNode
  label: string
  min?: number
  max?: number
  disabled?: boolean
  color?: ColorsT
}

const QuntityLabel: React.FC<QuntityProps> = ({
  value,
  onChange,
  color = 'green',
  children,
  label,
  min = 0,
  max,
  disabled,
  ...props
}) => {
  const bgColor = getActiveColorClassName(color, 'bg')
  const textColor = getActiveColorClassName(color, 'text')
  const style = `hover:${bgColor} ${bgColor.replace('400', '50').replace('500', '50')} ${bgColor.replace('bg', 'text')} ${bgColor.replace('bg', 'border')}`
  const ClassName = `size-14 rounded-full border-[1px] ${style} bg-mountain-50 ${textColor} [&>.icon]:m-0`
  const [val, setVal] = React.useState(value)
  const handleChange = (e: number) => {
    if (e < min || (max && e > max)) return
    setVal(e)
    onChange(e)
  }
  return (
    <div className='flex w-full flex-col gap-2'>
      <Label label={label} />
      <div className='flex w-full items-center gap-3'>
        <Input
          value={val}
          disabled={disabled}
          {...props}
          onChange={(e) => {
            handleChange(Number(e))
          }}
          placeholder='x00'
          onBlur={() => {}}
          type='number'
          className='h-12 w-full min-w-20 flex-1 rounded-[12px] bg-lynch-50 text-center flex-center'
          name={''}
        />
        {children}
        <div className='w-fit gap-2 flex-center'>
          <CustomButton
            label=''
            variant='secondary'
            size='sm'
            IconLeft={Minus}
            disabled={disabled}
            onClick={() => {
              handleChange(val - 1)
            }}
            className={ClassName}
          />
          <CustomButton
            label=''
            variant='secondary'
            size='sm'
            IconLeft={Plus}
            disabled={disabled}
            onClick={() => {
              handleChange(val + 1)
            }}
            className={ClassName}
          />
        </div>
      </div>
    </div>
  )
}

export default QuntityLabel
