import React, {
  FC,
  useState,
} from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  CircleCheckBig,
  ListFilter,
  Mail,
  X,
} from 'lucide-react'

import { z } from 'zod'
import { InputFieldForm } from '@/components/custom/InputField'
import MobileHeader from '@/components/custom/MobileHeader'
import { SelectField } from '@/components/custom/SelectField'
import { capitalize } from '@/utils/utils'
import { UseFormReturn } from 'react-hook-form'
import { CustomButton } from '@/components/custom/CustomButton'
import { FilterSchemaProduct } from '@/schemas/gestion/product-schema'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import CustomSearch from '@/components/utils/CustomSearch'
import { Select } from '@/components/custom/Select'
import { useSupportTranslations, useCommonTranslations } from '@/hooks/useTranslations'
interface FilerTableSupportProps {
  form: UseFormReturn<
    z.infer<typeof FilterSchemaProduct>
  >
  onSubmit: (
    data: z.infer<
      typeof FilterSchemaProduct
    >
  ) => void
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  open: boolean
}

export const FilterTableSupport: FC<
  FilerTableSupportProps
> = ({
  form,
  onSubmit,
  setOpen,
  open,
}) => {
  const t = useSupportTranslations()
  
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger className='flex h-14 w-14 items-center justify-center gap-2 rounded-full border-2 bg-white px-4 text-lynch-500 hover:bg-transparent hover:text-black lg:w-full lg:rounded-[14px] lg:bg-white'>
        <span className='hidden lg:block'>
          {t('filterBy')}
        </span>
        <ListFilter size={26} />
      </DialogTrigger>
      <DialogContent
        className='top-0 flex h-screen min-h-full min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-auto rounded-none bg-white px-0 py-0 lg:top-1/2 lg:h-auto lg:min-h-fit lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:rounded-[14px] lg:px-4 lg:py-4'
        showContent={false}
      >
        <FormProduct
          form={form}
          onSubmit={onSubmit}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

interface FormProductProps {
  form: UseFormReturn<
    z.infer<typeof FilterSchemaProduct>
  >
  onSubmit: (
    data: z.infer<
      typeof FilterSchemaProduct
    >
  ) => void
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}

const FormProduct: FC<
  FormProductProps
> = ({ form, onSubmit, setOpen }) => {
  const { handleSubmit, control } = form
  const [search, setSearch] =
    useState<string>('')
  const t = useSupportTranslations()
  const commonT = useCommonTranslations()
  
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className='-full flex w-full flex-col gap-2 lg:mt-0 lg:space-y-0'
      >
        <DialogTitle className='mt-0 hidden items-center justify-between text-[1.375rem] font-normal text-lynch-400 lg:flex'>
          {t('filterBy')}
          <DialogClose>
            <X size={24} />
          </DialogClose>
        </DialogTitle>
        <MobileHeader
          title={t('filterBy')}
          onClick={() => setOpen(false)}
        />
        <div className='flex flex-col gap-5 gap-x-4 px-4 py-5'>
          <div className='flex w-full flex-col gap-5 lg:flex-row'>
            <CustomSearch
              setSearch={setSearch}
              search={search}
            />
            <Select
              label={commonT('sort')}
              options={[
                { key: 'new', label: t('filter.new') },
                { key: 'popular', label: t('filter.popular') },
              ]}
              value='new'
              onChange={(e) => {}}
            />
          </div>
          <div className='flex w-full flex-col gap-5 text-sm lg:flex-row'>
            <InputFieldForm
              control={control}
              name='codebar'
              label={t('filter.codeBar')}
              placeholder={t('filter.codeBarPlaceholder')}
              IconLeft={Mail}
            />
            <SelectField
              control={control}
              name='rayon'
              label={t('filter.section')}
              options={[
                'Product',
                'FOOD_BANK',
              ].map((type) => ({
                key: type,
                label: capitalize(
                  type as string
                ) as string,
              }))}
            />
          </div>
          <div className='flex w-full flex-col gap-5 lg:flex-row'>
            {/* <SelectCategory
                            form={form}
                            control={control}
                            disabled={false}
                            withSubCategory={false}
                        /> */}
            <InputFieldForm
              control={control}
              name='quantity'
              label={t('filter.quantity')}
              placeholder={t('filter.quantityPlaceholder')}
            />
          </div>
          <div className='flex w-full flex-col gap-5 lg:flex-row'>
            <SelectField
              control={control}
              name='city'
              label={t('filter.city')}
              options={[]}
            />
            <SelectField
              control={control}
              name='zone'
              label={t('filter.zone')}
              options={[]}
            />
          </div>
        </div>

        <div className='sticky bottom-0 left-0 right-0 z-40 flex h-fit w-full items-center space-x-2 rounded-t-[24px] bg-white p-4 lg:relative lg:flex-auto lg:justify-end lg:bg-transparent'>
          <CustomButton
            variant='outline'
            label={commonT('cancel').toUpperCase()}
            onClick={() => {
              setOpen(false)
            }}
            className='h-fit w-full px-5 py-3 lg:w-fit'
            IconRight={X}
            type='submit'
          />
          <CustomButton
            label={commonT('confirm').toUpperCase()}
            onClick={() => {}}
            className='h-fit w-full px-5 py-3 lg:w-fit'
            IconRight={CircleCheckBig}
            type='submit'
          />
        </div>
      </form>
    </Form>
  )
}
