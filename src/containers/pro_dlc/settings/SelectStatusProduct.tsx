import { Label } from '@/components/custom/Label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import React, { FC } from 'react'
import { ConditionProduct } from '.'

interface SelectStatusProductProps {
  handleChange: (key: string, value: number, type: string) => void
  condition: ConditionProduct[]
  name: string
  disabled?: boolean
}

const SelectStatusProduct: FC<SelectStatusProductProps> = ({
  handleChange,
  condition,
  name,
  disabled,
}) => {
  const field = condition.find((item) => item.conditionName.includes(name))

  return (
    <div className='flex h-fit w-full flex-grow items-center justify-between space-x-4'>
      <div className={cn('flex w-full flex-col items-start justify-between')}>
        <Label label='Nombre de jour' className='text-lynch-950' />
        <Input
          className='w-full'
          value={field?.daysBeforePickup}
          onChange={(e) =>
            handleChange(
              name,
              e.target.value ? parseInt(e.target.value) : 0,

              'daysBeforePickup'
            )
          }
          max={31}
          min={1}
          disabled={disabled}
        />
      </div>
      <div className={cn('flex w-full flex-col items-start justify-between')}>
        <Label label='Reduction' className='text-lynch-950' />
        <Input
          className='w-full'
          value={field?.discountPercentage}
          onChange={(e) =>
            handleChange(
              name,
              e.target.value ? parseInt(e.target.value) : 0,
              'discountPercentage'
            )
          }
          max={100}
          min={0}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default SelectStatusProduct
