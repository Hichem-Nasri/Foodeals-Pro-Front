import { InputFieldForm } from '@/components/custom/InputField'
import { Label } from '@/components/custom/Label'
import { SelectField } from '@/components/custom/SelectField'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import HeaderLine from '@/components/utils/HeaderLine'
import React, { useState } from 'react'
import { useFormContext, UseFormReturn } from 'react-hook-form'
import FieldImages from './FieldImages'
import { capitalize } from '@/utils/utils'
import { TotalValueProps, TotalValues } from '@/types/GlobalType'
import { z } from 'zod'
import QrCodeInput from '@/containers/market/components/QrCodeInput'
import QuntityLabel from '@/containers/market/components/Quntity'
import { DonateSchema, StepOneDonate } from '@/schemas/donate-schema'
import { AvatarField } from '@/components/custom/AvatarField'
import { DatePicker } from '@/components/tools/DatePicker'
import { CalendarMinus2 } from 'lucide-react'
import RelaunchButtonWithDialog from '@/app/[locale]/pro-market/offres/components/RelaunchButtonWithDialog'

interface InfoProductProps {
  disabled: boolean
  changeProdReq: (data: any) => void
  id: string
  handleRelaunch?: () => void
  isHistory?: boolean
}

const InfoProduct: React.FC<InfoProductProps> = ({
  disabled,
  changeProdReq,
  id,
  handleRelaunch,
  isHistory,
}) => {
  const form = useFormContext<z.infer<typeof StepOneDonate>>()
  const [options, setOptions] = React.useState<{
    category: MultiSelectOptionsType[]
    type: MultiSelectOptionsType[]
  }>({
    category: [
      {
        label: 'CAKES',
        key: 'CAKES',
      },
      {
        label: 'DAIRY_PRODUCTS',
        key: 'DAIRY_PRODUCTS',
      },
    ],
    type: ['UN_PRODUIT', 'MULTIPLE'].map((item) => ({
      label: item
        .split('_')
        .map((val) => capitalize(val))
        .join(' '),
      key: item,
    })),
  })
  const { type } = form.watch()
  const handleScanProduct = (data: any) => {
    if (data) {
      changeProdReq(data)
    }
  }
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  console.log('erros: ', form.formState.errors)
  return (
    <div className='justify-center-center flex w-full flex-col gap-4'>
      {id == '' && (
        <QrCodeInput
          handleScanProduct={handleScanProduct}
          color='blue'
          qrCode={form.getValues('barCode')}
        />
      )}
      {type !== 'MULTIPLE' && (
        // <FieldImages
        //   control={form.control}
        //   name='productImages'
        //   label=''
        //   disabled={false}
        // />
        <AvatarField
          form={form}
          name='productImages'
          label=''
          disabled={false}
          className='m-auto w-full self-center lg:w-[740px]'
          classNameAvatar='lg:h-[223px] h-[160px] lg:w-[740px] w-full rounded-[24px] bg-white'
        />
      )}
      {!isHistory && (
        <div className='inline-flex w-full lg:hidden'>
          <RelaunchButtonWithDialog
            color='blue'
            title='Relancer la donation'
            description='Voulez-vous vraiment relancer cette donation?'
            actionFn={handleRelaunch}
          />
        </div>
      )}
      <HeaderLine title='Informations de donation' />
      <div className='flex w-full flex-col gap-3 rounded-[18px] bg-white p-4 py-5'>
        <div className='grid grid-cols-1 gap-3 lg:grid-cols-3 lg:flex-row'>
          <SelectField
            control={form.control}
            name='type'
            label='Type de donate'
            className='col-span-1'
            options={options.type}
            disabled={disabled}
          />
          <InputFieldForm
            control={form.control}
            name='title'
            className='col-span-1'
            label='Titre'
            placeholder='Titre'
            disabled={disabled}
          />
          <FormField
            control={form.control}
            name='expirationDate'
            render={({ field }) => (
              <FormItem className='flex flex-1 flex-col justify-between gap-2 text-sm font-medium'>
                <FormLabel className='font-semibold'>
                  Date d'expiration
                </FormLabel>
                <DatePicker
                  myFormat='dd/MM/yyyy'
                  id='expirationDate'
                  triggerClassName='text-base text-lynch-500'
                  iconClassName='text-scooter-500'
                  placeholder='Choisir une date'
                  onChange={field.onChange}
                  Icon={CalendarMinus2}
                  disabled={field.disabled}
                  value={field.value}
                  color='blue'
                />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <div className='flex flex-col gap-3'>
              <FormLabel className='font-semibold'>Description</FormLabel>
              <Textarea
                {...field}
                placeholder='Description'
                disabled={disabled}
                className='h-32 w-full rounded-[8px] p-4 text-base text-lynch-400 disabled:cursor-text disabled:opacity-100'
                onChange={(e) => field.onChange(e.target.value)}
                value={field.value}
              />
              <FormMessage {...field} />
            </div>
          )}
        />
      </div>
      <div className='container-item'>
        <SelectField
          control={form.control}
          label='Type de unite'
          options={['KG', 'LITRE', 'PIECE'].map((item: string) => ({
            label: capitalize(item),
            key: item,
          }))}
          disabled={false}
          name={'unity'}
        />
        <FormField
          name='quantity'
          control={form.control}
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              <QuntityLabel
                label='Quantité'
                value={+field.value || 0}
                onChange={(value: number) => field.onChange(value)}
                min={1}
                disabled={field.disabled}
                color='blue'
              />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default InfoProduct
