'use client'
import { CustomButton } from '@/components/custom/CustomButton'
import { AvatarProfile } from '@/components/tools/AvatarProfile'
import { InputWithCurrancy } from '@/components/tools/InputWithCurrancy'
import { Input } from '@/components/ui/input'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { SupplementType } from '@/types/market-pro-type'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { Avatar } from '@radix-ui/react-avatar'
import { ImagePlus, Plus, X } from 'lucide-react'
import { useMarketTranslations } from '@/hooks/useTranslations'

import React from 'react'
interface AddSuplementProps {
  showContent?: boolean
  suplements: SupplementType[]
  setSuplements: React.Dispatch<React.SetStateAction<SupplementType[]>>
  disabled?: boolean
  color?: ColorsT
}

const AddSuplement: React.FC<AddSuplementProps> = ({
  showContent = true,
  suplements,
  setSuplements,
  disabled = false,
  color = 'green',
}) => {
  const { notify } = useNotification()
  const t = useMarketTranslations()
  const [suplement, setSuplement] = React.useState<SupplementType>({
    name: '',
    price: 0,
    image: '',
  })
  const [elements, setElements] = React.useState<SupplementType[]>(
    Array.from(suplements)
  )
  const handleElement = (index: number, element: SupplementType) => {
    setElements((prev) => {
      const newElements = Array.from(prev)
      newElements[index] = element
      setSuplements(newElements)
      return newElements
    })
  }
  const colors = getActiveColorClassName(color, 'bg')
  const style = `hover:${colors} ${colors.replace('400', '50').replace('500', '50')} ${colors.replace('bg', 'text')} ${colors.replace('bg', 'border')}`
  return (
    <div className='flex w-full flex-col gap-3 rounded-[30px] bg-white p-4'>
      {showContent && !disabled && (
        <>
          <CustomButton
            label={t('components.addSupplement.addButton')}
            IconRight={Plus}
            disabled={disabled}
            className={style}
            onClick={() => {
              if (suplement.name && suplement.price && suplement.image) {
                handleElement(suplements.length, suplement)
                setSuplement({ name: '', price: 0, image: '' })
              } else {
                notify(
                  NotificationType.INFO,
                  t('components.addSupplement.fillAllFields')
                )
              }
            }}
            variant='secondary'
          />
          <div className='flex w-full gap-3'>
            <Input
              placeholder={t('components.addSupplement.namePlaceholder')}
              disabled={disabled}
              onChange={(e) => {
                setSuplement((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }}
              value={suplement.name}
            />
            <InputWithCurrancy
              placeholder={t('components.addSupplement.pricePlaceholder')}
              disabled={disabled}
              onChange={(e) => {
                setSuplement((prev) => ({
                  ...prev,
                  price: e,
                }))
              }}
              className='w-full flex-1'
              value={suplement.price || 0}
              currancy='MAD'
            />
            <button
              type='button'
              title='Supprimer'
              className='text-lynch-500 flex-center'
              disabled={disabled}
              onClick={() => {
                setSuplement({
                  name: '',
                  price: 0,
                  image: '',
                })
              }}
            >
              <X size={24} />
            </button>
          </div>
          <AvatarProfile
            iUrl={suplement.image as string}
            onChange={(file) => {
              if (file) {
                setSuplement((prev) => ({
                  ...prev,
                  image: file,
                }))
              }
            }}
            className='aspect-video min-h-60 w-full rounded-[14px] bg-white'
            Icon={<ImagePlus size={80} />}
          />{' '}
        </>
      )}
      <div className='grid grid-cols-3 gap-3'>
        {suplements.map((suplement, index) => (
          <div
            key={index}
            className='col-span-1 flex w-full flex-col items-center gap-3'
          >
            <h1>{suplement.name}</h1>
            <AvatarProfile
              iUrl={
                typeof suplement.image == 'string'
                  ? suplement.image
                  : URL.createObjectURL(suplement.image)
              }
              disabled
              className='aspect-square w-full rounded-[14px] bg-white lg:bg-lynch-50'
            />
            <div className='h-12 w-full rounded-[12px] bg-lynch-50 text-lynch-400 flex-center'>
              {suplement.price} MAD
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddSuplement
