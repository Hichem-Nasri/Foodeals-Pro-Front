import { InputFieldForm } from '@/components/custom/InputField'
import { Label } from '@/components/custom/Label'
import { SelectField } from '@/components/custom/SelectField'
import { FormField, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import SelectCategory from '@/containers/gestions/Products/newProducts/SelectCategory'
import { DealProType } from '@/types/market-pro-type'
import { capitalize } from '@/utils/utils'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

interface InfoDealProps {
  form: UseFormReturn<any>
  disabled: boolean
}

const InfoDeal: React.FC<InfoDealProps> = ({ form, disabled }) => {
  const { control } = form
  return (
    <div className='flex w-full flex-col gap-3 rounded-[18px] bg-white p-4 py-5'>
      <div className='flex w-full flex-col gap-3 lg:flex-row'>
        <SelectField
          control={form.control}
          name='type'
          label='Publier en tant que'
          options={['restaurant', 'SUPERMARKETS_HYPERMARKETS'].map((item) => ({
            label: capitalize(item),
            key: item,
          }))}
          disabled={disabled}
        />
        <SelectField
          control={control}
          label='Catégorie'
          options={['BREAD_AND_PASTRIES'].map((item) => ({
            key: item,
            label: item
              .split('_')
              .map((word) => capitalize(word))
              .join(' '),
          }))}
          name={'category'}
          disabled={disabled}
        />
        <InputFieldForm
          control={control}
          name='title'
          label='Titre'
          placeholder='Titre'
          disabled={disabled}
        />
      </div>
      <FormField
        control={control}
        name='description'
        render={({ field }) => (
          <div className='flex flex-col gap-3'>
            <Label label='Description' />
            <Textarea
              {...field}
              placeholder='Description'
              className='h-32 w-full rounded-[8px] p-4 text-base text-lynch-400'
              onChange={(e) => field.onChange(e.target.value)}
              value={field.value}
            />
            <FormMessage {...field} />
          </div>
        )}
      />
    </div>
  )
}

export default InfoDeal
