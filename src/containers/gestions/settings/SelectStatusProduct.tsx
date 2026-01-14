import { Label } from '@/components/custom/Label'
import { Input } from '@/components/ui/input'
import { useSettingsTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'
import React, { FC } from 'react'
import { ConditionProduct } from '.'

interface SelectStatusProductProps {
  handleChange: (
    key: string,
    value: number,
    type: string
  ) => void
  condition: ConditionProduct[]
  name: string
  disabled?: boolean
}

const SelectStatusProduct: FC<
  SelectStatusProductProps
> = ({
  handleChange,
  condition,
  name,
  disabled,
}) => {
  const t = useSettingsTranslations()
  const field = condition.find((item) =>
    item.conditionName.includes(name)
  )
  const addCharacter = (
    value: number,
    char: string,
    position: 'right' | 'left'
  ) => {
    if (!disabled) {
      return value
    }
    if (position === 'right') {
      return value
        ? value + char
        : 0 + char
    }
    return value
      ? char + value
      : char + 0
  }
  return (
    <div className='flex h-fit w-full flex-grow items-center justify-between space-x-4'>
      <div
        className={cn(
          'flex w-full flex-col items-start gap-3 text-lynch-400'
        )}
      >
        <Label
          label={t('product.days')}
          className='font-semibold text-lynch-950'
        />
        <Input
          className='w-full'
          value={addCharacter(
            field?.daysBeforePickup!,
            'J-',
            'left'
          )}
          onChange={(e) => {
            handleChange(
              name,
              e.target.value
                ? parseInt(
                    e.target.value
                  )
                : 0,

              'daysBeforePickup'
            )
          }}
          max={31}
          min={1}
          disabled={disabled}
        />
      </div>
      <div
        className={cn(
          'flex w-full flex-col items-start gap-3 text-lynch-400'
        )}
      >
        <Label
          label={t('product.discount')}
          className='font-semibold text-lynch-950'
        />
        <Input
          className='w-full'
          value={addCharacter(
            field?.discountPercentage!,
            '%',
            'right'
          )}
          onChange={(e) => {
            handleChange(
              name,
              e.target.value
                ? parseInt(
                    e.target.value
                  )
                : 0,
              'discountPercentage'
            )
          }}
          max={100}
          min={0}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default SelectStatusProduct
