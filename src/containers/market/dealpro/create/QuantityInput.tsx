import { Input } from '@/components/custom/Input'
import { InputFieldForm } from '@/components/custom/InputField'
import { Label } from '@/components/custom/Label'
import { SelectField } from '@/components/custom/SelectField'
import { InputWithCurrancy } from '@/components/tools/InputWithCurrancy'
import { FormField, FormItem } from '@/components/ui/form'
import { DealProType } from '@/types/market-pro-type'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import LabelAndInputCurrancy from '../../components/LabelAndInputCurrancy'

interface QuantityInputProps {
  form: UseFormReturn<any>
  disabled: boolean
}

const QuantityInput: React.FC<QuantityInputProps> = ({ disabled, form }) => {
  const { control } = form
  const type = form.watch('typeProduct')
  const defaultUnity: {
    label: string
    name: 'defaultUnity.x30' | 'defaultUnity.x60' | 'defaultUnity.x120'
  }[] = [
    {
      label: 'x30',
      name: 'defaultUnity.x30',
    },
    {
      label: 'x60',
      name: 'defaultUnity.x60',
    },
    {
      label: 'x120',
      name: 'defaultUnity.x120',
    },
  ]
  return (
    <>
      {type === 'product' ? (
        <>
          <div className='container-item'>
            <SelectField
              name='defaultUnity.unity'
              control={control}
              label='Unité'
              options={['kg', 'g', 'l', 'ml', 'unité'].map((item) => ({
                key: item,
                label: item,
              }))}
            />
            <div className='flex w-full flex-col items-center gap-3'>
              {defaultUnity.map((item, index) => (
                <div key={item.name} className='flex w-full items-start gap-3'>
                  <Input
                    label='Qte'
                    placeholder=''
                    value={item.label}
                    disabled={true}
                    onChange={() => {}}
                    name={''}
                    className='text-center'
                  />
                  <FormField
                    name={item.name as any}
                    control={control}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <LabelAndInputCurrancy
                          label='Prix'
                          className='w-full'
                          placeholder='Quantité'
                          disabled={field.disabled! || disabled}
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className='container-item'>
            <SelectField
              name='customUnity.unity'
              control={control}
              label='Unité'
              options={['kg', 'g', 'l', 'ml', 'unité'].map((item) => ({
                key: item,
                label: item,
              }))}
            />
            <div className='flex w-full items-start gap-3'>
              <InputFieldForm
                control={control}
                name='customUnity.global.quantity'
                label='Qte globale'
                type='number'
                placeholder='Quantité globale'
                className='text-center'
                disabled={disabled}
              />
              <InputFieldForm
                control={control}
                name='customUnity.global.price'
                label='Prix unitaire'
                placeholder='prix'
                disabled={disabled}
                type='number'
              />
            </div>
            <div className='flex w-full items-start gap-3'>
              <InputFieldForm
                control={control}
                name='customUnity.min.quantity'
                label='Qte min'
                type='number'
                className='text-center'
                placeholder='Quantité minimale'
                disabled={disabled}
              />
              <InputFieldForm
                control={control}
                name='customUnity.min.price'
                label='Prix'
                placeholder='prix'
                disabled={disabled}
                type='number'
              />
            </div>
          </div>
        </>
      ) : (
        <div className='container-item'>
          <Input
            label='Type d’unité'
            placeholder=''
            value={'Lot'}
            disabled={true}
            onChange={() => {}}
            name={''}
          />
          <FormField
            control={control}
            name='prixLot'
            render={({ field }) => (
              <FormItem className='w-full'>
                <LabelAndInputCurrancy
                  label='Prix du lot'
                  className='w-full text-center'
                  placeholder='Prix du lot'
                  disabled={disabled}
                  onChange={field.onChange}
                  value={field.value!}
                />
              </FormItem>
            )}
          />
        </div>
      )}
    </>
  )
}

export default QuantityInput
