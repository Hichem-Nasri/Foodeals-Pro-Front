import { Label } from '@/components/custom/Label'
import { LabelAndAvatar } from '@/components/custom/LabelAndAvatar'
import { DatePicker } from '@/components/tools/DatePicker'
import HeaderLine from '@/components/utils/HeaderLine'
import React from 'react'
import LabelAndInput from '../../components/LabelAndInput'
import Image from 'next/image'
import { Control } from 'react-hook-form'
import MultiImageField from '../../components/MultiImageField'
import MultiImagesPlus from '../../components/MultiImagesPlus'
interface InfoDealProProps {
  control: Control<any>
  productImages: string[]
  title: string
  description: string
  client: string
  clientAvatar: string
  date: Date
}

const InfoDealPro: React.FC<InfoDealProProps> = ({
  productImages,
  title,
  control,
  description,
  client,
  clientAvatar,
}) => {
  return (
    <>
      <HeaderLine title='Photo de Produit' />
      <div className='w-full rounded-[30px] bg-white p-2'>
        {productImages && productImages.length <= 1 ? (
          <Image
            src='/images/fromages.png'
            width={200}
            height={200}
            alt='pas de produit'
            className='max-h-[247px] w-full rounded-[18px] object-cover'
          />
        ) : (
          <MultiImagesPlus
            images={productImages}
            onChange={(data) => {}}
            withAdd={false}
            disabled
          />
        )}
      </div>
      <HeaderLine title='Information du deal pro' />
      <div className='flex w-full flex-col gap-3 rounded-[30px] bg-white p-2 px-4 py-[25px]'>
        <div className='flex flex-col gap-3 lg:flex-row'>
          <LabelAndAvatar
            label='Market'
            avatar='/images/marjane_logo.png'
            value='Marjane Market'
            name={''}
            onChange={() => {}}
            disabled
          />
          <LabelAndInput
            label='Nom du produit'
            value={title}
            name='product'
            onChange={() => {}}
            disabled
          />
        </div>

        <LabelAndInput
          label='Détail du produit'
          value={description}
          name='product'
          onChange={() => {}}
          type='textarea'
          disabled
        />

        <div className='flex flex-col gap-3'>
          <Label label='Date de péremption' />
          <DatePicker value={new Date()} onChange={() => {}} disabled />
        </div>
      </div>
    </>
  )
}

export default InfoDealPro
