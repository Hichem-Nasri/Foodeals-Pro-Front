import { CustomButton } from '@/components/custom/CustomButton'
import { Input } from '@/components/custom/Input'
import { Label } from '@/components/custom/Label'
import { MultiProductType } from '@/schemas/donate-schema'
import { PenLine, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface MultiProductCardProps {
  Item: MultiProductType
  id: number
  setItems: React.Dispatch<React.SetStateAction<MultiProductType[]>>
  setModify: (id: number) => void
  disabled?: boolean
}

const MultiProductCard: React.FC<MultiProductCardProps> = ({
  Item,
  id,
  setModify,
  setItems,
  disabled,
}) => {
  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((_, index) => index !== id))
  }
  return (
    <div className='flex h-full w-full flex-1 basis-full flex-col justify-between gap-3 rounded-[18px] bg-white p-3 lg:basis-1/3'>
      <div className='flex items-center justify-start gap-3'>
        <Image
          src={
            typeof Item.productImages == 'string'
              ? Item.productImages
              : URL.createObjectURL(Item.productImages!)
          }
          alt='food'
          className='h-[80px] w-[120px] rounded-[11px] bg-scooter-700 object-cover'
          width={120}
          height={80}
          layout='fixed'
          loading='lazy'
        />
        <div className='flex flex-col items-start justify-center gap-1'>
          <h1 className='text-lg font-semibold text-lynch-950'>{Item.title}</h1>
          <p className='line-clamp-2 text-sm text-lynch-400'>
            {Item.description}
          </p>
        </div>
      </div>
      <div className='flex w-full items-center gap-3 self-end'>
        <Input
          label='Quantité'
          type='number'
          placeholder=''
          className='w-full flex-1 items-center'
          onChange={() => {}}
          value={Item.quantity}
          name={''}
          disabled
        />
        <div className='flex w-fit flex-col items-center gap-3'>
          <Label label='Modifier' className='text-sm' />
          <div className='h-fit w-full gap-3 self-center flex-center'>
            <CustomButton
              label=''
              variant='ghost'
              size='sm'
              IconLeft={PenLine}
              className='self-center bg-transparent p-0 text-lynch-400 hover:bg-transparent'
              onClick={() => {
                setModify(id)
              }}
              disabled={disabled}
            />
            <CustomButton
              label=''
              variant='ghost'
              size='sm'
              IconLeft={Trash2}
              className='self-center bg-transparent p-0 text-coral-500 hover:bg-transparent'
              onClick={() => {
                handleDelete(id)
              }}
              disabled={disabled}
            />
          </div>
        </div>
        {/* <div className='flex w-fit flex-col items-center gap-3'>
          <Label label='Supprimer' className='text-sm' />
          <div className='h-full w-full self-center flex-col-center'>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default MultiProductCard
