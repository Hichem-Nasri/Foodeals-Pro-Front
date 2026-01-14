import { Input } from '@/components/custom/Input'
import { InputFieldForm } from '@/components/custom/InputField'
import { Label } from '@/components/custom/Label'
import { SelectField } from '@/components/custom/SelectField'
import MultiPreviewProduct from '@/components/tools/MultiPreviewProduct'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import { FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import HeaderLine from '@/components/utils/HeaderLine'
import { DealType, Sauces, Suda, SupplementType } from '@/types/market-pro-type'
import { type } from 'os'
import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import AddSuplement from '../../components/AddSuplement'
import QuntityLabel from '../../components/Quntity'
import FieldImages from './FieldImages'
import { capitalize } from '@/utils/utils'
import SelectCategory from '@/containers/gestions/Products/newProducts/SelectCategory'
import QrCodeInput from '../../components/QrCodeInput'
import { useQuery } from '@tanstack/react-query'
import api from '@/utils/api'
import { TotalValueProps, TotalValues } from '@/types/GlobalType'
import { Skeleton } from '@/components/ui/skeleton'
import { useOffersTranslations } from '@/hooks/useTranslations'

interface InfoProductProps {
  form: UseFormReturn<DealType>
  disabled: boolean
  changeProdReq: (data: any) => void
  id: string
}

const InfoProduct: React.FC<InfoProductProps> = ({
  form,
  disabled,
  changeProdReq,
  id,
}) => {
  const { control } = form
  const tOffers = useOffersTranslations()
  
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
    type: [
      'BAKERIES_PASTRIES',
      'SUPERMARKETS_HYPERMARKETS',
      'RESTAURANTS_HOTELS_CATERERS',
      'WHOLESALERS_INDUSTRIALS',
    ].map((item) => ({
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
  const { data, isLoading, error } = useQuery({
    queryKey: ['supplements'],
    queryFn: async () => {
      try {
        const res = await api.get(
          `/supplements?pageNum=${totals.currentPage}&pageSize=${totals.pageSize}`
        )
        if (res.status !== 200) {
          throw new Error('Erreur lors de la récupération des données')
        }
        setTotals((prev) => ({
          ...prev,
          totalPages: res.data.totalPages,
        }))
        return res.data?.content?.map(
          (item: any) =>
            ({
              id: item.id,
              name: item.name,
              price: item.price.amount,
              image: item.image,
            }) as SupplementType
        )
      } catch (error) {
        console.error('Error:', error)
        return []
      }
    },
  })

  return (
    <div className='flex w-full flex-col gap-4'>
      {id == '' && <QrCodeInput handleScanProduct={handleScanProduct} />}
      <FieldImages
        control={form.control}
        name='productImages'
        label=''
        disabled={false}
      />
      <HeaderLine title={tOffers('form.dealInfo')} />
      {type == 'RESTAURANTS_HOTELS_CATERERS' && (
        <>
          <HeaderLine title={tOffers('form.sauces')} />
          <div className='container-item'>
            <FormField
              control={form.control}
              name='sauces'
              render={({ field }) => (
                <FormItem>
                  {isLoading ? (
                    <Skeleton className='w-full rounded-lg bg-lynch-50' />
                  ) : (
                    <MultiPreviewProduct
                      images={data}
                      setSelected={field.onChange}
                    />
                  )}
                </FormItem>
              )}
            />
          </div>
          <HeaderLine title={tOffers('form.sodas')} />
          <div className='container-item'>
            <FormField
              control={form.control}
              name='sodas'
              render={({ field }) => (
                <FormItem>
                  <MultiPreviewProduct
                    images={Suda}
                    setSelected={field.onChange}
                  />
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
      <div className='flex w-full flex-col gap-3 rounded-[18px] bg-white p-4 py-5'>
        <div className='flex w-full flex-col gap-3 lg:flex-row'>
          <SelectField
            control={form.control}
            name='type'
            label={tOffers('form.publishAs')}
            options={options.type}
            disabled={disabled}
          />
          <SelectField
            control={form.control}
            name='category'
            label={tOffers('form.category')}
            options={options.category}
            disabled={disabled}
          />
          <InputFieldForm
            control={control}
            name='title'
            label={tOffers('form.dealTitle')}
            placeholder={tOffers('form.titlePlaceholder')}
            disabled={disabled}
          />
        </div>
        <FormField
          control={control}
          name='description'
          render={({ field }) => (
            <div className='flex flex-col gap-3'>
              <Label label={tOffers('form.description')} />
              <Textarea
                {...field}
                placeholder={tOffers('form.descriptionPlaceholder')}
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
      <HeaderLine title={tOffers('form.supplements')} />
      <FormField
        name='supplements'
        disabled={disabled}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <AddSuplement
              suplements={field.value || []}
              setSuplements={field.onChange}
              disabled={field.disabled}
            />
          </FormItem>
        )}
      />
      <div className='container-item'>
        <SelectField
          control={form.control}
          label={tOffers('form.unitType')}
          options={['Kg', 'Litre', 'Pièce'].map((item: string) => ({
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
                label={tOffers('form.quantity')}
                value={+field.value || 0}
                onChange={(value: number) => field.onChange(value)}
                min={1}
                disabled={field.disabled}
              />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default InfoProduct
