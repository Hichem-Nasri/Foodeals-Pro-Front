import React, { FC, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Calendar, CircleCheckBig, ListFilter, X } from 'lucide-react'

import { z } from 'zod'
import { InputFieldForm } from '@/components/custom/InputField'
import { SelectField } from '@/components/custom/SelectField'
import { capitalize } from '@/utils/utils'
import { UseFormReturn } from 'react-hook-form'
import { CustomButton } from '@/components/custom/CustomButton'
import { Form } from '@/components/ui/form'
import CustomSearch from '@/components/utils/CustomSearch'
import SelectCategory from './newProducts/SelectCategory'
import { FilterSchemaProductDlc } from '@/schemas/product-schema-dlc'
import MobileHeaderDlc from '@/components/custom/MobileHeaderDlc'
import { DatePicker } from '@/components/ui/DatePicker'
import { useTranslations } from '@/hooks/useTranslations'

interface FilerTableProductsProps {
  form: UseFormReturn<z.infer<typeof FilterSchemaProductDlc>>
  onSubmit: (data: z.infer<typeof FilterSchemaProductDlc>) => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
}

export const FilterTableProducts: FC<FilerTableProductsProps> = ({
  form,
  onSubmit,
  setOpen,
  open,
}) => {
  const { t } = useTranslations();
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='flex h-14 w-14 items-center justify-center gap-3 rounded-full bg-white p-3 text-lynch-500 hover:bg-transparent hover:text-black lg:h-fit lg:w-fit lg:rounded-[12px] lg:border lg:border-lynch-300 lg:bg-transparent lg:px-4 lg:text-lynch-500'>
        <span className='hidden font-medium lg:flex'>{t('common.filter')}</span>
        <ListFilter size={26} />
      </DialogTrigger>
      <DialogContent
        className='top-0 flex h-screen min-h-full min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-auto rounded-none bg-white px-0 py-0 lg:top-1/2 lg:h-[85vh] lg:min-h-[400px] lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:rounded-[14px] lg:px-4 lg:py-0'
        showContent={false}
      >
        <FormProduct form={form} onSubmit={onSubmit} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

interface FormProductProps {
  form: UseFormReturn<z.infer<typeof FilterSchemaProductDlc>>
  onSubmit: (data: z.infer<typeof FilterSchemaProductDlc>) => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const FormProduct: FC<FormProductProps> = ({ form, onSubmit, setOpen }) => {
  const { t } = useTranslations();
  const { control, handleSubmit } = form
  const [search, setSearch] = useState<string>('')

  const conditionOptions = [
    { key: 'urgente', label: t('dlc.types.urgent') },
    { key: 'exigée', label: t('dlc.types.required') },
    { key: 'souhaitable', label: t('dlc.types.desirable') },
  ]

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(data)
        })}
        className='-full flex w-full flex-col gap-2 lg:mt-0 lg:space-y-0'
      >
        <DialogTitle className='sticky top-0 z-40 mt-0 hidden items-center justify-between rounded-b-sm bg-white p-3 pb-4 text-[1.375rem] font-normal text-lynch-400 lg:flex'>
          <h1>{t('dlc.filters.title')}</h1>
          <DialogClose>
            <X size={24} />
          </DialogClose>
        </DialogTitle>
        <MobileHeaderDlc title={t('dlc.filters.title')} onClick={() => setOpen(false)} />
        <div className='flex flex-col gap-5 gap-x-4 px-4 py-5'>
          <div className='flex w-full flex-col gap-5 lg:flex-row'>
            <CustomSearch setSearch={setSearch} search={search} />
          </div>
          <div className='flex w-full flex-col gap-5 lg:flex-row'>
            <SelectField
              control={control}
              name='condition'
              label={t('settings.product.productStatus')}
              options={conditionOptions}
            />
            <div className='w-full'>
              <DatePicker
                control={control}
                name='expiryDate'
                label={t('settings.product.days')}
                icon={Calendar}
              />
            </div>
          </div>
          <div className='flex w-full flex-col gap-5 lg:flex-row'>
            <SelectField
              control={control}
              name='city'
              label={t('fields.city')}
              options={[]}
            />
            <SelectField
              control={control}
              name='zone'
              label={t('support.filter.zone')}
              options={[]}
            />
          </div>
          <div className='flex w-full flex-col gap-5 lg:flex-row'>
            <SelectField
              control={control}
              name='organization_id'
              label={t('stores.title')}
              options={['Product', 'FOOD_BANK'].map((type) => ({
                key: type,
                label: capitalize(type.replace('_', ' ') as string) as string,
                avatar: 'https://picsum.photos/id/237/200/300',
              }))}
            />
            <SelectField
              control={control}
              name='responsible_id'
              label={t('collaborators.responsible')}
              options={['Product', 'FOOD_BANK'].map((type) => ({
                key: type,
                label: capitalize(type.replace('_', ' ') as string) as string,
                avatar: 'https://picsum.photos/id/237/200/300',
              }))}
            />
          </div>
          <div className='flex w-full flex-col gap-5 lg:flex-row'>
            <SelectField
              control={control}
              name='rayon'
              label={t('support.filter.section')}
              options={['Product', 'FOOD_BANK'].map((type) => ({
                key: type,
                label: capitalize(type.replace('_', ' ') as string) as string,
                avatar: 'https://picsum.photos/id/237/200/300',
              }))}
            />
            <SelectCategory
              form={form}
              control={control}
              disabled={false}
              withSubCategory={false}
            />
          </div>
          <div className='flex w-full flex-col gap-5 lg:flex-row'>
            <SelectField
              control={control}
              name='order'
              label={t('common.sort')}
              options={[t('support.filter.new'), t('support.filter.popular')].map((status) => ({
                key: status,
                label: capitalize(status) as string,
              }))}
            />
            <InputFieldForm
              control={control}
              name='quantity'
              label={t('support.filter.quantity')}
              placeholder={t('support.filter.quantityPlaceholder')}
            />
          </div>
        </div>

        <div className='t sticky bottom-0 left-0 right-0 z-40 flex h-fit w-full items-center space-x-2 rounded-t-[24px] bg-white p-4 lg:flex-auto lg:justify-end'>
          <CustomButton
            variant='outline'
            label={t('dlc.cancel').toUpperCase()}
            onClick={() => setOpen(false)}
            className='h-fit w-full px-5 py-3 lg:w-fit'
            IconRight={X}
            type='button' // Changed to button type
          />
          <CustomButton
            label={t('common.confirm').toUpperCase()}
            className='h-fit w-full bg-[#FAC215] px-5 py-3 text-white hover:bg-[#FAC215] lg:w-fit'
            IconRight={CircleCheckBig}
            type='submit' // Only this should be submit
          />
        </div>
      </form>
    </Form>
  )
}
